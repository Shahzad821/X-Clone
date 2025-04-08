import React, { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUser, logoutUser } from "../ReduxStore/userSlice";
import { useNavigate } from "react-router-dom";
import Spinner from "../components/Spinner";

const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { data, isLoading, error } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      const response = await axios.get("/api/user/getme");
      return response.data;
    },
    retry: false,
  });

  useEffect(() => {
    if (data) {
      dispatch(setUser(data));
    }
  }, [data, dispatch]);

  useEffect(() => {
    if (error) {
      if (error.response?.status === 401) {
        dispatch(logoutUser());
        navigate("/signin");
      } else {
        console.error("An error occurred:", error);
      }
    }
  }, [error, dispatch, navigate]);

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthProvider;
