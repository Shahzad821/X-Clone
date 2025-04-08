import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

const useSendMessages = () => {
  const selectedConversation = useSelector(
    (state) => state.conversation.selectedConversation
  );
  const { mutate: sendMessage, isPending: isSending } = useMutation({
    mutationFn: async (message) => {
      if (!selectedConversation?._id) return;
      console.log(message);
      const res = await axios.post(
        `/api/send/${selectedConversation._id}`,
        message
      );

      return res.data;
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.message ||
          error.message ||
          "Error sending message"
      );
    },
  });
  return { sendMessage, isSending };
};

export default useSendMessages;
