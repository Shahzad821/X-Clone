import React, { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Link } from "react-router-dom";
import { setSelectedConversation } from "../../ReduxStore/conversationSlice";
import { useDispatch } from "react-redux";
const Chat = () => {
  const dispatch = useDispatch();
  const {
    data: friends,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["mutualFriends"],
    queryFn: async () => {
      const res = await axios.get("/api/user/friends");
      return res.data;
    },
  });
  if (isLoading)
    return (
      <div className="p-6 text-center text-white">
        <span className="animate-pulse">Loading chats...</span>
      </div>
    );

  if (isError)
    return (
      <div className="p-6 text-center text-red-500">Error: {error.message}</div>
    );

  return (
    <div className="h-full w-full p-6 border-x border-gray-600 text-white overflow-y-auto">
      <h2 className="text-2xl font-bold mb-6">💬 Friends You Can Chat With</h2>

      {friends.length === 0 ? (
        <p className="text-gray-400">You have no mutuals yet 🥲</p>
      ) : (
        <ul className="space-y-4">
          {friends.map((user) => (
            <Link
              to={`/chat/${user.username}`}
              key={user._id}
              onClick={() => dispatch(setSelectedConversation(user))}
            >
              <li className="flex items-center my-3 gap-4 p-4 bg-gray-800 hover:bg-gray-500 transition-all duration-200 rounded-xl shadow-sm cursor-pointer">
                <img
                  src={user?.profileImg?.url || "/avatar-placeholder.png"}
                  alt={user.username}
                  className="w-12 h-12 rounded-full object-cover border-2 border-gray-700"
                />
                <div>
                  <p className="text-lg font-medium">{user.username}</p>
                  <p className="text-sm text-gray-400">Click to start chat</p>
                </div>
              </li>
            </Link>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Chat;
