import React, { useEffect, useRef } from "react";
import Input from "./Input";
import { useDispatch, useSelector } from "react-redux";
import Messages from "./Messages";

const ChatPage = () => {
  const conversation = useSelector(
    (state) => state.conversation.selectedConversation
  );
  return (
    <div className="flex flex-col border-x border-gray-500 h-[95vh] md:h-full w-full bg-gray-900 text-white overflow-">
      <div className="p-4 border-b border-gray-700 flex items-center gap-3">
        <img
          src={conversation?.profileImg?.url || "/avatar-placeholder.png"}
          alt={conversation?.username}
          className="w-10 h-10 rounded-full object-cover border border-gray-600"
        />
        <h2 className="text-xl font-semibold">{conversation?.fullName}</h2>
      </div>
      <Messages></Messages>
      <Input />
    </div>
  );
};

export default ChatPage;
