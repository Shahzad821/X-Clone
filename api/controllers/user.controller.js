import User from "../models/auth.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import uploadFile, { deleteFile } from "../utils/cloudinay.js";
import createError from "../utils/errorhandler.js";
import Notification from "../models/notification.model.js";
import bcrypt from "bcryptjs";
export const getUserProfile = asyncHandler(async (req, res, next) => {
  const { username } = req.params;

  const user = await User.findOne({ username }).select("-password");
  if (!user) {
    return next(createError("User not found", 404));
  }
  res.status(200).json(user);
});
export const followUnfollowUser = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const userToModify = await User.findById(id);
  const currentUser = await User.findById(req.user._id);

  if (id.toString() === req.user._id.toString()) {
    return next(createError("You can't follow/unfollow yourself", 400));
  }

  if (!currentUser || !userToModify) {
    return next(createError("User not found", 404));
  }

  const isFollowing = currentUser.followings.includes(userToModify._id);

  if (isFollowing) {
    await User.updateOne(
      { _id: currentUser._id },
      { $pull: { followings: userToModify._id } }
    );
    await User.updateOne(
      { _id: userToModify._id },
      { $pull: { followers: currentUser._id } }
    );

    // Option 2 (Commented Out): Modify the documents in-memory then save.
    /*
      currentUser.followings = currentUser.followings.filter(
        following => following.toString() !== userToModify._id.toString()
      );
      userToModify.followers = userToModify.followers.filter(
        follower => follower.toString() !== currentUser._id.toString()
      );
      await currentUser.save();
      await userToModify.save();
      */

    // Fetch updated followings (if needed) or simply use the modified document.
    const updatedCurrentUser = await User.findById(currentUser._id);
    return res.status(200).json({
      success: true,
      message: "User unfollowed successfully!",
      updatedFollowings: updatedCurrentUser.followings,
    });
  } else {
    // -----------------------
    // FOLLOW LOGIC
    // -----------------------

    // Option 1 (Commented Out): Using update operators:
    /*
      await User.updateOne(
        { _id: currentUser._id },
        { $push: { followings: userToModify._id } }
      );
      await User.updateOne(
        { _id: userToModify._id },
        { $push: { followers: currentUser._id } }
      );
      */

    // Option 2: Modify the documents in-memory then save.
    currentUser.followings.push(userToModify._id);
    userToModify.followers.push(currentUser._id);
    const notification = new Notification({
      from: currentUser._id,
      to: userToModify._id,
      type: "follow",
    });
    await currentUser.save();
    await userToModify.save();
    await notification.save();

    return res.status(200).json({
      success: true,
      message: "User followed successfully!",
      updatedFollowings: currentUser.followings,
    });
  }
});

export const getSuggestedUsers = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;
  const usersFollowedbyMe = await User.findById(userId).select("followings");

  const users = await User.aggregate([
    {
      $match: {
        _id: { $ne: userId },
      },
    },
    { $sample: { size: 10 } },
  ]);

  const filteredUsers = users.filter(
    (user) => !usersFollowedbyMe.followings?.includes(user._id)
  );
  const suggestedUsers = filteredUsers.slice(0, 4);
  suggestedUsers.forEach((user) => user.password === null);
  res.status(200).json(suggestedUsers);
});
export const updateUser = asyncHandler(async (req, res, next) => {
  const { fullName, email, username, newPassword, currentPassword, link, bio } =
    req.body;
  let { profileImg, coverImg } = req.body;

  const userId = req.user._id;
  const user = await User.findById(userId);
  if (!user) {
    return next(createError("User not found", 404));
  }
  if (email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return next(createError("Invalid email format!", 400));
    }
    user.email = email || user.email;
  }

  if ((newPassword && !currentPassword) || (!newPassword && currentPassword)) {
    return next(
      createError("Please provide both current password and new password", 400)
    );
  }
  if (newPassword && currentPassword) {
    const isPasswordCorrect = bcrypt.compareSync(
      currentPassword,
      user.password
    );
    if (!isPasswordCorrect) {
      return next(createError("Invalid current password", 400));
    }
    if (newPassword.trim().length < 6) {
      return next(createError("Password must be at least 6 characters", 400));
    }
    const genSalt = await bcrypt.genSalt(10);
    const hashedPassword = bcrypt.hashSync(newPassword, genSalt);
    user.password = hashedPassword;
  }
  if (profileImg) {
    if (user.profileImg.public_id) {
      const res = await deleteFile(user.profileImg.public_id);
      if (!res.success) {
        return next(createError(res.result));
      }
    }
    let url = await uploadFile(profileImg, "avatar");
    profileImg = url;
  }
  if (coverImg) {
    if (user.coverImg.public_id) {
      const res = await deleteFile(user.coverImg.public_id);
      if (!res.success) {
        return next(createError(res.result));
      }
    }

    let url = await uploadFile(coverImg, "avatar");
    coverImg = url;
  }

  user.fullName = fullName || user.fullName;
  user.username = username || user.username;
  user.profileImg = profileImg || user.profileImg;
  user.coverImg = coverImg || user.coverImg;
  user.link = link || user.link;
  user.bio = bio || user.bio;
  await user.save();
  user.password = null;
  return res.status(200).json(user);
});
export const getMutualFollows = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;

  const currentUser = await User.findById(userId);
  if (!currentUser) {
    return next(createError("User not found", 404));
  }

  // Find mutuals (users who are both followed and following back)
  const mutualUsers = currentUser.followings.filter((id) =>
    currentUser.followers.includes(id)
  );

  // Get mutual user details (excluding password)
  const users = await User.find({ _id: { $in: mutualUsers } }).select(
    "_id username profileImg fullName"
  );
  if (!users || users.length === 0) {
    return next(createError("No mutual follows found", 404));
  }
  res.status(200).json(users);
});
