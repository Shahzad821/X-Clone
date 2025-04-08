import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

import toast from "react-hot-toast";

const UseUpdateProfile = () => {
  const queryClient = useQueryClient();
  const {
    mutate: updateProfile,
    isPending: isUpdatingProfile,
    isSuccess,
  } = useMutation({
    mutationFn: async (data) => {
      const response = await axios.put(`/api/user/update`, data);
      return response.data;
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.message ||
          error.message ||
          "Failed to update profile"
      );
    },
  });
  return { updateProfile, isUpdatingProfile, isSuccess };
};

export default UseUpdateProfile;
