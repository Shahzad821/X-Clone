// components/ProtectedLayout.js
import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import RightPanel from "./RightPannel";
import BottomNavbar from "./Navbar";
const ProtectedLayout = () => {
  return (
    <>
      <div className="flex h-screen pb-16 md:pb-0 ">
        <Sidebar />
        <div className="flex-1 ">
          <Outlet />
          <BottomNavbar />
        </div>
        <RightPanel />
      </div>
    </>
  );
};

export default ProtectedLayout;
