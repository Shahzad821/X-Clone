import React, { useEffect, useRef } from "react";
import useGetMessages from "../../Hooks/UseGetMessages";
import Message from "./Message";
import useListenHook from "../../Hooks/useListenHook";

const Messages = () => {
  const { isLoading, messages } = useGetMessages();
  const lastMessageRef = useRef();
  useListenHook();
  useEffect(() => {
    lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  return (
    <div className="flex-1 px-2 overflow-y-auto">
      {isLoading && (
        <div className="flex items-center justify-center h-full w-full text-gray-400 ">
          Loading messages...
        </div>
      )}

      {messages?.length === 0 && !isLoading && (
        <div className="flex items-center justify-center text-gray-500 font-semibold h-full">
          No messages yet. Start a conversation!
        </div>
      )}
      {messages?.length > 0 &&
        messages.map((msg, index) => (
          <div
            key={msg._id}
            ref={index === messages.length - 1 ? lastMessageRef : null}
          >
            <Message key={msg._id} message={msg} />
          </div>
        ))}
    </div>
  );
};

export default Messages;
