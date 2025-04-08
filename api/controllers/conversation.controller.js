import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import { getReceiverSocketId } from "../socket/socket.js";
import asyncHandler from "../utils/asyncHandler.js";
import createError from "../utils/errorhandler.js";
import { io } from "../socket/socket.js";
export const sendMessage = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;
  const recipientId = req.params.id;
  const { message } = req.body;
  if (!message.trim()) {
    return createError("Message cannot be empty", 400);
  }
  let conversation = await Conversation.findOne({
    members: { $all: [userId, recipientId] },
  });
  const newMessage = await Message.create({
    sender: userId,
    receiver: recipientId,
    content: message,
  });

  if (!conversation) {
    conversation = new Conversation({
      members: [userId, recipientId],
      messages: [newMessage._id],
    });
  } else {
    conversation.messages.push(newMessage._id);
  }
  if (newMessage) {
    const socketId = getReceiverSocketId(recipientId);
    if (socketId) {
      io.to(socketId).emit("newMessage", newMessage);
    }
  }

  await Promise.all([conversation.save(), newMessage.save()]);

  return res.status(200).json({
    success: true,
    conversation,
    message: newMessage,
  });
});

export const getMessages = asyncHandler(async (req, res, next) => {
  const senderId = req.user._id;

  const recipientId = req.params.id;

  const conversation = await Conversation.findOne({
    members: { $all: [senderId, recipientId] },
  }).populate("messages");
  if (!conversation) {
    return res.status(200).json([]);
  }
  const messages = conversation.messages;
  res.status(200).json(messages);
});
// Get all conversations for a user
