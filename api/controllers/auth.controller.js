import User from "../models/auth.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import createError from "../utils/errorhandler.js";
import bcrypt from "bcryptjs"; // Correct import for bcrypt

import crypto from "crypto";
import { resetEmailTemplate } from "../utils/emailTemplate.js";
import sendEmail from "../utils/sendEmail.js";
import generateTokenAndSetCookie from "../utils/generateTokenAndSetCookie.js";

export const register = asyncHandler(async (req, res, next) => {
  const { username, fullName, email, password } = req.body;
  console.log(req.body);
  if (!username || !fullName || !email || !password) {
    return next(createError("All fields are required.", 400));
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return next(createError("Invalid email format!", 400));
  }

  const emailExist = await User.findOne({ email });
  if (emailExist) {
    return next(createError("Email already exists", 400));
  }

  const usernameExist = await User.findOne({ username });
  if (usernameExist) {
    return next(createError("Username already exists", 400));
  }

  if (password.trim().length < 6) {
    return next(createError("Password must be at least 6 characters", 400));
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = new User({
    fullName,
    username,
    email,
    password: hashedPassword,
  });

  await newUser.save();

  generateTokenAndSetCookie(newUser._id, res);

  return res.status(201).json({
    success: true,
    message: "User created successfully",
  });
});
export const login = asyncHandler(async (req, res, next) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  const isPasswordCorrect = bcrypt.compareSync(password, user?.password || "");
  if (!user || !isPasswordCorrect) {
    return next(createError("Invalid username or password", 400));
  }
  generateTokenAndSetCookie(user._id, res);
  res.status(200).json({
    success: true,
    message: "Login successfully",
  });
});
export const logout = asyncHandler(async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
    maxAge: 0,
  });

  res.status(200).json({
    success: true,

    message: "Logged out successfully",
  });
});
export const getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id).select("-password");

  res.status(200).json(user);
});
export const forgotPassword = asyncHandler(async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email: email });
  if (!user) {
    return next(createError("User not found", 404));
  }
  const token = crypto.randomBytes(20).toString("hex");
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  user.resetPasswordToken = hashedToken;
  user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
  await user.save();
  const resetUrl = `${process.env.FRONTEND_URL}/password/reset/${token}`;
  const message = resetEmailTemplate(user.username, resetUrl);
  try {
    await sendEmail({
      email: user.email,
      subject: "Password Reset",
      message,
    });
    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} successfully`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    return next(createError(error.message || "Something went wrong", 500));
  }
});
export const resetPassword = asyncHandler(async (req, res, next) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });
  if (!user) {
    return next(createError("Invalid or expired token", 400));
  }
  if (req.body.password !== req.body.confirmPassword) {
    return next(createError("Passwords do not match", 400));
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);
  user.password = hashedPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();
  res.status(200).json({ success: true, message: "Password changed" });
});
