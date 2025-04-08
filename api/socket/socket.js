import { Server } from "socket.io";
import http from "http";
import express from "express";
import dotenv from "dotenv";
dotenv.config();
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST"],
  },
});

let userSocketMap = {};
export const getReceiverSocketId = (receiverId) => userSocketMap[receiverId];
io.on("connection", (socket) => {
  const user = socket.handshake.query.userId;
  if (user !== undefined) {
    userSocketMap[user] = socket.id;
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  }
  console.log("New client connected", socket.id);

  socket.on("disconnect", () => {
    if (user) {
      delete userSocketMap[user];
      io.emit("getOnlineUsers", Object.keys(userSocketMap));
    }

    console.log("Client disconnected", socket.id);
  });
});
export { server, app, io };
