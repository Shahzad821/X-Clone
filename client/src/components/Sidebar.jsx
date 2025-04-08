import React from "react";
import { MdHomeFilled } from "react-icons/md";
import { IoNotifications } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { BiLogOut } from "react-icons/bi";
import { Link, useLocation } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import XSvg from "../assets/svgs/X";
import profileImage from "../assets/avatar-placeholder.png";
import { FaMessage } from "react-icons/fa6";
import { logoutUser } from "../ReduxStore/userSlice";
import { useDispatch, useSelector } from "react-redux";
const Sidebar = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const authUser = useSelector((state) => state.auth.authUser);
  const { mutate: logout } = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/user/logout", { method: "POST" });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Something went wrong");
      }
    },
    onSuccess: () => {
      dispatch(logoutUser());
    },
    onError: () => {
      toast.error("Logout failed");
    },
  });

  const menuItems = [
    { name: "Home", icon: MdHomeFilled, path: "/" },
    { name: "Notifications", icon: IoNotifications, path: "/notifications" },
    { name: "Profile", icon: FaUser, path: `/profile/${authUser?.username}` },
    { name: "Chat", icon: FaMessage, path: `/chat` },
  ];
  return (
    <div className=" hidden sticky top-0 left-0 h-screen w-64  text-white md:flex flex-col z-50">
      <div className="flex items-center justify-center h-16 border-b border-gray-700">
        <Link to="/">
          <XSvg className="w-12 h-12 fill-current text-white" />
        </Link>
      </div>
      <nav className="flex-1 px-2 py-4">
        {menuItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className={`flex items-center px-4 py-2 mt-2 text-sm font-medium rounded-lg ${
              location.pathname === item.path
                ? "bg-gray-800 text-white"
                : "text-gray-400 hover:bg-gray-800 hover:text-white"
            }`}
          >
            <item.icon className="w-6 h-6" />
            <span className="ml-3">{item.name}</span>
          </Link>
        ))}
      </nav>
      {authUser && (
        <Link
          to={`/profile/${authUser.username}`}
          className="flex items-center p-4 border-t border-gray-700"
        >
          <img
            src={authUser.profileImg.url || profileImage}
            alt="User Avatar"
            className="w-10 h-10 rounded-full"
          />
          <div className="ml-3">
            <p className="text-sm font-medium text-white">
              {authUser.fullName}
            </p>
            <p className="text-xs font-medium text-gray-400">
              @{authUser.username}
            </p>
          </div>
          <button
            onClick={logout}
            className="ml-auto bg-gray-800 text-gray-400 hover:text-white p-2 rounded-full"
          >
            <BiLogOut className="w-5 h-5" />
          </button>
        </Link>
      )}
    </div>
  );
};

export default Sidebar;
