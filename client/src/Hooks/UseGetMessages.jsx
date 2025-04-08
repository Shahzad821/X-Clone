import axios from "axios";
import { useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";

const useGetMessages = () => {
  const conversation = useSelector(
    (state) => state.conversation.selectedConversation
  );
  const {
    data: messages,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["messages", conversation?._id],
    queryFn: async () => {
      if (!conversation?._id) return [];
      const res = await axios.get(`/api/message/${conversation._id}`);

      return res.data;
    },
    enabled: !!conversation?._id,
  });

  return { messages, isLoading, isError, error };
};

export default useGetMessages;
