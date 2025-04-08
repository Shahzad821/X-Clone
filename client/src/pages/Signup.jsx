import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import XSvg from "../assets/svgs/X";
const Signup = () => {
  const [data, setData] = useState({
    username: "",
    fullName: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const { mutate, isPending } = useMutation({
    mutationKey: "register",
    mutationFn: async (userData) => {
      const response = await axios.post("/api/auth/register", userData);

      return response.data;
    },
    onMutate: () => {
      toast.loading("Please wait...", { id: "Registering" });
    },
    onSuccess: () => {
      toast.success("Registration successful! You can now log in.", {
        id: "Registering",
      });
      setData({
        username: "",
        fullName: "",
        email: "",
        password: "",
      });
      navigate("/signin");
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.message ||
          error.message ||
          "An error occurred while signing up. Please try again.",
        { id: "Registering" }
      );
    },
  });
  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    mutate(data);
  };
  return (
    <div className="h-screen flex items-center justify-around px-9 flex-1">
      <div className="w-full max-w-md hidden md:block shrink-0">
        <XSvg />
      </div>

      <form
        className="w-full md:max-w-md flex flex-col gap-3"
        onSubmit={handleSubmit}
      >
        <h1 className="text-center text-white font-bold text-3xl font-serif mb-5">
          Sign Up
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
            value={data.username}
            className="py-2 px-3 w-full bg-white/50 placeholder:text-white rounded-3xl focus:outline-none focus:ring-1 focus:ring-purple-500 border-2 border-gray-500"
            placeholder="Enter your username"
            onChange={handleChange}
            required
          />
        </div>

        {/* fullName */}
        <div className="text-lg text-white">
          <label htmlFor="fullName" className="font-medium font-mono">
            fullName
          </label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            value={data.fullName}
            className="py-2 px-3 w-full bg-white/50 placeholder:text-white rounded-3xl focus:outline-none focus:ring-1 focus:ring-purple-500 border-2 border-gray-500"
            placeholder="Enter your fullName"
            onChange={handleChange}
            required
          />
        </div>

        {/* Email */}
        <div className="text-lg text-white">
          <label htmlFor="email" className="font-medium font-mono">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={data.email}
            className="py-2 px-3 w-full bg-white/50 placeholder:text-white rounded-3xl focus:outline-none focus:ring-1 focus:ring-purple-500 border-2 border-gray-500"
            placeholder="Enter your email"
            onChange={handleChange}
            required
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
            value={data.password}
            className="py-2 px-3 w-full bg-white/50 placeholder:text-white rounded-3xl focus:outline-none focus:ring-1 focus:ring-purple-500 border-2 border-gray-500"
            placeholder="Enter your password"
            onChange={handleChange}
            required
          />
        </div>

        {/* Submit Button */}
        <button
          className="w-full bg-gradient-to-tr from-yellow-500 to-pink-500 p-3 rounded-xl mt-3 text-white font-bold cursor-pointer hover:bg-gradient-to-tl transition-all duration-200 ease-in"
          type="submit"
        >
          {isPending ? "Registration" : "Sign Up"}
        </button>

        {/* Redirect to Sign In */}
        <div className="text-center text-sm text-white mt-4">
          Already have an account?{" "}
          <Link
            to="/signin"
            className="font-medium text-purple-200 hover:text-purple-400"
          >
            Sign In
          </Link>
        </div>
      </form>
    </div>
  );
};
export default Signup;
