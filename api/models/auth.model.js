import mongoose from "mongoose";
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minLength: 6,
    },
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: [],
      },
    ],
    followings: [
      { type: mongoose.Schema.Types.ObjectId, ref: "User", default: [] },
    ],
    bio: {
      type: String,
      default: "",
    },
    link: {
      type: String,
      default: "",
    },
    profileImg: {
      url: {
        type: String,
        default: "",
      },
      public_id: {
        type: String,
        default: "",
      },
    },
    coverImg: {
      url: {
        type: String,
        default: null,
      },
      public_id: {
        type: String,
        default: null,
      },
    },
    likedPosts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
        default: [],
      },
    ],
    resetPasswordToken: String,
    resetPasswordExpire: String,
  },
  { timestamps: true }
);
const User = mongoose.model("User", userSchema);

export default User;
