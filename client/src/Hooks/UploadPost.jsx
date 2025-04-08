import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";

const UseUploadPost = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending, isSuccess } = useMutation({
    mutationKey: ["upload"],
    mutationFn: async (formData) => {
      const response = await axios.post("/api/post/upload", formData);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(["post"]);
      toast.success("Post Uploaded!");
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.message ||
          error.message ||
          "Failed to upload post"
      );
    },
  });
  return { mutate, isPending, isSuccess };
};

export default UseUploadPost;
