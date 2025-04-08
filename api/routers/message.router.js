import express from "express";
import {
  getMessages,
  sendMessage,
} from "../controllers/conversation.controller.js";
import verifyUser from "../middleware/verifyUser.js";

const router = express.Router();
console.log("Message Router Loaded");
router.get("/message/:id", verifyUser, getMessages);
router.post("/send/:id", verifyUser, sendMessage);
export default router;
