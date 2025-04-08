import express from "express";
import {
  deleteNotification,
  getNotificatoins,
} from "../controllers/notification.controller.js";
import verifyUser from "../middleware/verifyUser.js";
const router = express.Router();
router.get("/notifications", verifyUser, getNotificatoins);
router.delete("/notifications", verifyUser, deleteNotification);
export default router;
