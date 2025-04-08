import express from "express";
import {
  commentOnPost,
  createPost,
  deletePost,
  getAllPosts,
  getFollowingsPosts,
  getLikedPosts,
  getPost,
  getUserPosts,
  likeUnLikePost,
} from "../controllers/post.controller.js";
import verifyUser from "../middleware/verifyUser.js";
const router = express.Router();

router.post("/post/upload", verifyUser, createPost);
router.get("/post/all", verifyUser, getAllPosts);
router.get("/post/:id", verifyUser, getPost);
router.get("/post/get/following", verifyUser, getFollowingsPosts);
router.get("/post/like/:id", verifyUser, getLikedPosts);
router.get("/post/user/:username", verifyUser, getUserPosts);
router.post("/post/like/:id", verifyUser, likeUnLikePost);
router.post("/post/comment/:id", verifyUser, commentOnPost);
router.delete("/post/:id", verifyUser, deletePost);

export default router;
