import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";

const useFollowUser = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationKey: ["follow"],
    mutationFn: async (id) => {
      const response = await axios.post(`/api/user/follow/${id}`);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(["follow"]);
      queryClient.invalidateQueries(["authUser"]);
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || error.message || "Something went wrong"
      );
    },
  });
  return { followUnfollowUser: mutation.mutate, isLoading: mutation.isPending };
};

export default useFollowUser;
