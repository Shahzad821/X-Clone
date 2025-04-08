import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import XSvg from "../assets/svgs/X";

const Signin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const queryClient = useQueryClient();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const { mutate, isPending } = useMutation({
    mutationFn: async (data) => {
      const response = await axios.post("/api/auth/signin", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      setFormData({
        username: "",
        password: "",
      });
      navigate("/");
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.message || error.message || "Failed to sign in"
      );
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutate(formData);
  };

  return (
    <div className="h-screen flex items-center justify-around px-9 flex-1">
      <div className="w-full max-w-md hidden md:block">
        <XSvg />
      </div>
      <form
        className="w-full md:max-w-md flex flex-col gap-4"
        onSubmit={handleSubmit}
      >
        <h1 className="text-center text-white font-bold text-3xl font-serif mb-5">
          Sign In
        </h1>
        {/* Username */}
        <div className="text-lg text-white">
          <label htmlFor="username" className="font-medium font-mono">
            Username
          </label>
          <input
            id="username"
            name="username"
            type="text"
            required
            className="py-2 px-3 w-full bg-white/50 placeholder:text-base placeholder:text-white rounded-3xl focus:outline-none focus:ring-1 focus:ring-purple-500 border-2 border-gray-500"
            placeholder="Please enter your username"
            value={formData.username}
            onChange={handleChange}
          />
        </div>
        {/* Password */}
        <div className="text-lg text-white">
          <label htmlFor="password" className="font-medium font-mono">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            className="py-2 px-3 w-full bg-white/50 placeholder:text-base placeholder:text-white rounded-3xl focus:outline-none focus:ring-1 focus:ring-purple-500 border-2 border-gray-500"
            placeholder="Please enter your password"
            value={formData.password}
            onChange={handleChange}
          />
        </div>
        {/* Forgot Password Link */}
        <div className="text-right">
          <Link
            to="#"
            className="text-sm text-purple-200 hover:text-purple-400"
          >
            Forgot Password?
          </Link>
        </div>
        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-gradient-to-tr from-yellow-500 to-pink-500 p-3 rounded-xl mt-3 text-white font-bold cursor-pointer hover:bg-gradient-to-tl transition-all duration-200 ease-in"
          disabled={isPending}
        >
          {isPending ? "Loading..." : "Sign In"}
        </button>
        {/* Redirect to Sign Up */}
        <div className="text-center text-sm text-white mt-4">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="font-medium text-purple-200 hover:text-purple-400"
          >
            Sign Up
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Signin;
