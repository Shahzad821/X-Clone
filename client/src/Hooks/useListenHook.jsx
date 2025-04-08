import { useEffect } from "react";
import { useSocketAuth } from "../Store/ContextStore";
import { useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";

const useListenHook = () => {
  const { socket, setMessages } = useSocketAuth();
  const selectedConversation = useSelector(
    (state) => state.conversation.selectedConversation
  );
  const queryClient = useQueryClient();
  useEffect(() => {
    const handleNewMessage = (message) => {
      console.log(message);
      queryClient.setQueryData(
        ["messages", selectedConversation._id],
        (oldMessages) => {
          return [...oldMessages, message];
        }
      );
    };

    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [setMessages, socket]);
};

export default useListenHook;
