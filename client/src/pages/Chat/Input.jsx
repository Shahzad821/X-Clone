import React, { useState } from "react";

import { useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";

import useSendMessages from "../../Hooks/SendMesssage";
const Input = () => {
  const selectedConversation = useSelector(
    (state) => state.conversation.selectedConversation
  );

  const queryClient = useQueryClient();
  const { sendMessage, isSending } = useSendMessages();

  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedMessage = message.trim();
    if (!trimmedMessage) return;

    sendMessage(
      { message: trimmedMessage },
      {
        onSuccess: (data) => {
          queryClient.setQueryData(
            ["messages", selectedConversation._id],
            (oldMessages) => {
              return [...oldMessages, data.message];
            }
          );

          setMessage("");
        },
      }
    );
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 border-t border-gray-800 bg-gray-900 flex gap-2"
    >
      <input
        type="text"
        aria-label="Type your message"
        className="flex-1 px-4 py-2 rounded-full bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
        placeholder="Type a message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button
        type="submit"
        aria-label="Send message"
        disabled={isSending || !message.trim()}
        className={`px-5 py-2 rounded-full font-medium text-white transition duration-200 ${
          isSending || !message.trim()
            ? "bg-blue-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-500"
        }`}
      >
        {isSending ? "Sending..." : "Send"}
      </button>
    </form>
  );
};

export default Input;
