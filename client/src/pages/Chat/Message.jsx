import React, { useEffect } from "react";
import { useSelector } from "react-redux";

const Message = ({ message }) => {
  const authUser = useSelector((state) => state.auth.authUser);
  let isOwnMessage = message.sender === authUser._id;
  return (
    <div
      className={`flex px-4 my-2 ${
        isOwnMessage ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`max-w-xs md:max-w-sm px-4 py-2 rounded-2xl text-sm shadow-md transition-all duration-300 ${
          isOwnMessage
            ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-br-none"
            : "bg-gray-100 text-gray-800 rounded-bl-none"
        }`}
      >
        {message.content}
      </div>
    </div>
  );
};

export default Message;
