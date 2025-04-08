import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { MdHomeFilled } from "react-icons/md";
import { IoNotifications } from "react-icons/io5";
import { FaUser, FaStoreAlt } from "react-icons/fa";
import { FaMessage } from "react-icons/fa6";
import { useSelector } from "react-redux";

const BottomNavbar = () => {
  const location = useLocation();
  const authUser = useSelector((state) => state.auth.authUser);

  const menuItems = [
    { name: "Home", icon: MdHomeFilled, path: "/" },
    { name: "Notifications", icon: IoNotifications, path: "/notifications" },
    { name: "Profile", icon: FaUser, path: `/profile/${authUser?.username}` },
    { name: "Chat", icon: FaMessage, path: `/chat` },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-gray-900/90 text-white p-1 shadow-lg md:hidden ">
      <ul className="flex justify-around items-center">
        {menuItems.map((item) => (
          <li key={item.name}>
            <Link to={item.path} className="flex flex-col items-center">
              <item.icon
                className={`w-6 h-6 transition-all ${
                  location.pathname === item.path
                    ? "text-blue-400 scale-110"
                    : "text-gray-400"
                }`}
              />
              <span
                className={`text-xs ${
                  location.pathname === item.path
                    ? "text-blue-400 font-semibold"
                    : "text-gray-400"
                }`}
              >
                {item.name}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default BottomNavbar;
