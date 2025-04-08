import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Signup from "./pages/Signup";
import Signin from "./pages/Signin";
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/profile/ProfilePage";
import DetailedPost from "./components/posts/PostDetail";
import NotificationPage from "./pages/NotificationPage";
import Chat from "./pages/Chat/Chat";
import { Toaster } from "react-hot-toast";
import { useSelector } from "react-redux";
import ProtectedLayout from "./components/ProtectedLayout";
import ChatPage from "./pages/Chat/ChatPage";

const App = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  return (
    <>
      <Routes>
        <Route
          path="/signup"
          element={!isAuthenticated ? <Signup /> : <Navigate to="/" />}
        />
        <Route
          path="/signin"
          element={!isAuthenticated ? <Signin /> : <Navigate to="/" />}
        />
        {isAuthenticated && (
          <Route path="/" element={<ProtectedLayout />}>
            <Route index element={<HomePage />} />
            <Route path="post/:id" element={<DetailedPost />} />
            <Route path="notifications" element={<NotificationPage />} />
            <Route path="chat" element={<Chat />} />
            <Route path="chat/:username" element={<ChatPage />} />
            <Route path="profile/:username" element={<ProfilePage />} />
          </Route>
        )}
        <Route
          path="*"
          element={<Navigate to={isAuthenticated ? "/" : "/signin"} />}
        />
      </Routes>

      <Toaster />
    </>
  );
};

export default App;
