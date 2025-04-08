import User from "../models/auth.model.js";
import createError from "../utils/errorhandler.js";
import jwt from "jsonwebtoken";

const verifyUser = async (req, res, next) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return next(createError("Not authenticated, please login first!", 401));
    }

    jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, decodedData) => {
      if (err) {
        return next(createError("Not authenticated, token failed!", 401));
      }

      if (!decodedData?.id) {
        return next(createError("Invalid token payload!", 401));
      }

      const user = await User.findById(decodedData.id).select("-password");
      if (!user) {
        return next(createError("User not found!", 404));
      }

      req.user = user;
      next();
    });
  } catch (error) {
    next(createError("Internal Server Error!", 500));
  }
};

export default verifyUser;
