import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import Spinner from "../components/Spinner";

import { IoSettingsOutline } from "react-icons/io5";
import { FaUser, FaHeart } from "react-icons/fa";
import axios from "axios";
import profile from "../assets/avatar-placeholder.png";
const NotificationPage = () => {
  const queryClient = useQueryClient();
  const {
    data: notifications,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const res = await axios.get("/api/notifications");
      console.log(res);
      return res.data;
    },
  });
  if (error) {
    toast.error("Failed to load notifications");
    return null;
  }
  const { mutate: deleteNotifications } = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/notifications", {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete notifications");
      return res.json();
    },
    onSuccess: () => {
      toast.success("Notifications deleted successfully");
      queryClient.invalidateQueries(["notifications"]);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return (
    <div className="border-x border-gray-500 w-full h-full overflow-y-scroll ">
      <div className="flex justify-between items-center p-4 border-b border-gray-700">
        <p className="font-bold text-white">Notifications</p>
        <button
          onClick={deleteNotifications}
          className="text-white hover:text-gray-400"
        >
          <IoSettingsOutline className="w-5 h-5" />
        </button>
      </div>
      {isLoading && (
        <div className="flex justify-center items-center h-full">
          <Spinner />
        </div>
      )}
      {notifications?.length === 0 && (
        <div className="text-center p-4 font-bold text-white">
          No notifications 🤔
        </div>
      )}
      {notifications?.map((notification) => (
        <div className="border-b border-gray-700 p-4" key={notification._id}>
          <div className="flex items-center gap-3">
            {notification.type === "follow" && (
              <FaUser className="w-7 h-7 text-blue-500" />
            )}
            {notification.type === "like" && (
              <FaHeart className="w-7 h-7 text-red-500" />
            )}
            <Link
              to={`/profile/${notification.from.username}`}
              className="flex items-center gap-2 text-white hover:underline"
            >
              <img
                src={notification.from.profileImg.url || profile}
                className="w-8 h-8 rounded-full"
                alt="profile"
              />
              <span className="font-bold">@{notification.from.username}</span>
              <span>
                {notification.type === "follow"
                  ? "followed you"
                  : "liked your post"}
              </span>
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NotificationPage;
