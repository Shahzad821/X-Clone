import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
const UseCommentPost = (id) => {
  const queryClient = useQueryClient();
  const {
    mutate: commentPost,
    isPending: isCommenting,
    isSuccess,
  } = useMutation({
    mutationKey: ["comment"],

    mutationFn: async (formData) => {
      const respnose = await axios.post(`/api/post/comment/${id}`, formData);
      return respnose.data;
    },
    onSuccess: (comments) => {
      queryClient.setQueryData(["post"], (oldData) => {
        return oldData?.map((p) => {
          if (p._id === id) {
            return { ...p, comments: comments };
          }
          return p;
        });
      });
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.message || error.message || "Failed to comment"
      );
    },
  });
  return { commentPost, isCommenting, isSuccess };
};

export default UseCommentPost;
