import express from "express";
import {
  getMe,
  login,
  logout,
  register,
} from "../controllers/auth.controller.js";
import verifyUser from "../middleware/verifyUser.js";
const router = express.Router();

// Define API routes
router.post("/auth/register", register);
router.post("/auth/signin", login);
router.get("/user/getme", verifyUser, getMe);
router.post("/user/logout", logout);

export default router;
