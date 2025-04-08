import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import errorMiddleware from "./middleware/errorMiddleware.js";
import ConnectDB from "./config/db.js";
import { server, app } from "./socket/socket.js";
import authRouter from "./routers/auth.router.js";
import postRouter from "./routers/post.router.js";
import userRouter from "./routers/user.router.js";
import notificationRouter from "./routers/notification.router.js";
import messageRouter from "./routers/message.router.js";
dotenv.config();
process.on("uncaughtException", (err) => {
  console.log("Uncaught exception", err);
  console.log("Shutting down server due to uncaught exception");
  process.exit(1);
});
app.use(cookieParser());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = process.env.PORT || 3000;
ConnectDB();

app.use("/api", authRouter);
app.use("/api", postRouter);
app.use("/api", userRouter);
app.use("/api", notificationRouter);
app.use("/api", messageRouter);
app.use(errorMiddleware);
server.listen(port, () => {
  console.log(
    `Server is running on port ${port} in ${process.env.NODE_ENV} mode`
  );
});
process.on("unhandledRejection", (err) => {
  console.log("Unhandled rejection", err);
  console.log("Shutting down server due to unhandled rejection");
  server.close(() => process.exit(1));
});
