import express from "express";
import {
  followUnfollowUser,
  getMutualFollows,
  getSuggestedUsers,
  getUserProfile,
  updateUser,
} from "../controllers/user.controller.js";
import verifyUser from "../middleware/verifyUser.js";
const router = express.Router();

// API routes
router.get("/user/profile/:username", verifyUser, getUserProfile);
router.put("/user/update", verifyUser, updateUser);
router.get("/suggestions", verifyUser, getSuggestedUsers);
router.post("/user/follow/:id", verifyUser, followUnfollowUser);
router.get("/user/friends", verifyUser, getMutualFollows);

export default router;
