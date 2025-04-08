import React, { createContext, useState, useEffect, useContext } from "react";
import { useSelector } from "react-redux";
import { io } from "socket.io-client";

// Create context
const SocketContext = createContext();
export const SocketAuthProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  console.log(socket);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const authUser = useSelector((state) => state.auth.authUser);
  useEffect(() => {
    if (!authUser) return;

    const newSocket = io("http://localhost:3000", {
      query: { userId: authUser._id },
    });

    setSocket(newSocket);

    newSocket.on("getOnlineUsers", (users) => {
      setOnlineUsers(users);
    });

    return () => newSocket.disconnect();
  }, [authUser]);

  return (
    <SocketContext.Provider
      value={{
        socket,
        onlineUsers,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

// Custom hook to use socket
export const useSocketAuth = () => {
  return useContext(SocketContext);
};
