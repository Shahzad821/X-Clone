import React from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import profile from "../assets/avatar-placeholder.png";
import RightPanelSkeleton from "./skeletons/RightPannelSkeleton";
import useFollowUser from "../Hooks/FollowUser";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { MdMoreHoriz } from "react-icons/md";

const RightPanel = () => {
  const { followUnfollowUser } = useFollowUser();
  const { data, isLoading, error } = useQuery({
    queryKey: ["follow"],
    queryFn: async () => {
      const response = await axios.get("/api/suggestions");
      return response.data;
    },
  });
  console.log(data);
  const handleFollow = (id) => {
    followUnfollowUser(id);
  };

  if (error) {
    toast.error("Failed to load follow suggestions");
    return null;
  }

  if (isLoading) {
    return <RightPanelSkeleton />;
  }

  return (
    <div className="w-1/4 h-screen p-2 hidden lg:block mx-auto sticky top-0 bottom-0">
      <h1>
        <h2 className="text-white font-bold text-2xl">Follow Suggestions</h2>
        <p className="text-xs text-gray-400">
          View popular and relevant accounts to follow.
        </p>

        <Link className="flex items-center gap-2 text-blue-500 text-xs font-semibold hover:text-blue-400 transition-colors duration-200"></Link>
      </h1>
      {data?.map((user) => (
        <div
          key={user._id}
          className="flex items-center justify-between w-full p-3 mb-2 hover:bg-gray-500 rounded-md transition-colors duration-200"
        >
          <Link
            className="flex items-center gap-3 flex-1 min-w-0"
            to={`/profile/${user.username}`}
          >
            <img
              className="w-10 h-10 rounded-full"
              src={user.profileImg?.url || profile}
              alt={`${user.fullName}'s avatar`}
            />
            <div className="min-w-0 text-nowrap">
              <p className="font-medium text-white truncate">{user.fullName}</p>
              <p className="text-xs text-white/80 truncate">@{user.username}</p>
            </div>
          </Link>
          <button
            className="text-blue-500 text-xs font-semibold border border-blue-500 rounded-full px-4 py-1 hover:bg-blue-500 hover:text-white transition-colors duration-200"
            onClick={() => handleFollow(user._id)}
          >
            Follow
          </button>
        </div>
      ))}
    </div>
  );
};

export default RightPanel;
