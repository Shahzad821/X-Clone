import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
const UseLikePost = (id) => {
  const queryClient = useQueryClient();
  const {
    mutate: likePost,
    isPending: isLiking,
    isSuccess,
  } = useMutation({
    mutationKey: ["like"],

    mutationFn: async () => {
      const respnose = await axios.post(`/api/post/like/${id}`);
      return respnose.data;
    },
    onSuccess: (updatedLikes) => {
      // queryClient.invalidateQueries(["getpost"]);
      queryClient.setQueryData(["post"], (oldData) => {
        return oldData?.map((p) => {
          if (p._id === id) {
            return { ...p, likes: updatedLikes };
          }
          return p;
        });
      });
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.message || error.message || "Failed to sign in"
      );
    },
  });
  return { likePost, isLiking, isSuccess };
};

export default UseLikePost;
