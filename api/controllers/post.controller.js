import User from "../models/auth.model.js";
import Post from "../models/post.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import uploadFile, { deleteFile } from "../utils/cloudinay.js";
import createError from "../utils/errorhandler.js";
import Notification from "../models/notification.model.js";
export const createPost = asyncHandler(async (req, res, next) => {
  const id = req.user?._id;
  const { text } = req.body;
  let { image } = req.body;
  const user = await User.findById(id);
  if (!user) {
    return next(createError("User not found", 404));
  }
  if (!text && !image) {
    return next(createError("Post must have image or text", 400));
  }
  if (image) {
    const res = await uploadFile(image, "shopIt");
    image = res;
  }
  const post = await Post({
    text,
    image,
    user: id,
  });
  await post.save();
  res.status(201).json(post);
});

export const deletePost = asyncHandler(async (req, res, next) => {
  const post = await Post.findById(req.params.id);
  if (!post) {
    return next(createError(404, "No post found"));
  }
  if (post.user.toString() !== req.user._id.toString()) {
    return next(createError(401, "You are not allowed to delete this post"));
  }
  if (post.image?.url) {
    const result = await deleteFile(post.image.public_id);
    if (!result.success) {
      return next(createError(500, result.message));
    }
  }
  await Post.deleteOne({ _id: post._id });
  res.status(200).json({ success: true, message: "Post Deleted!" });
});

export const commentOnPost = asyncHandler(async (req, res, next) => {
  const postId = req.params.id;
  const userId = req.user._id;
  const { text } = req.body;
  const post = await Post.findById(postId);
  if (!post) {
    return next(createError("No such post", 404));
  }
  if (!text) {
    return next(createError("Text field is required", 401));
  }
  let comment = { user: userId, text };
  post.comments.push(comment);
  await post.save();

  res.status(200).json(post.comments);
});
export const likeUnLikePost = asyncHandler(async (req, res, next) => {
  const postId = req.params.id;
  const userId = req.user._id;
  const post = await Post.findById(postId);
  if (!post) {
    return next(createError("No such post", 404));
  }

  let isPostLiked = post.likes?.includes(userId);
  if (isPostLiked) {
    await User.updateOne({ _id: userId }, { $pull: { likedPosts: postId } });
    await Post.updateOne({ _id: postId }, { $pull: { likes: userId } });
    const updatedLikes = post.likes.filter(
      (id) => id.toString() !== userId.toString()
    );
    res.status(200).json(updatedLikes);
  } else {
    await User.updateOne({ _id: userId }, { $push: { likedPosts: postId } });
    post.likes.push(userId);
    const notification = new Notification({
      from: userId,
      to: post.user,
      type: "like",
    });
    await post.save();
    await notification.save();
    const updatedLikes = post.likes;
    res.status(200).json(updatedLikes);
  }
});
export const getAllPosts = asyncHandler(async (req, res, next) => {
  let page = Number(req.query.page) || 1;
  let limit = Number(req.query.limit) || 15;
  let skip = (page - 1) * limit;

  const posts = await Post.find()
    .populate({ path: "user", select: "-password" })
    .populate({ path: "comments.user", select: "-password" })

    .limit(limit)
    .skip(skip)
    .sort({ createdAt: -1 });

  res.status(200).json(posts);
});
export const getLikedPosts = asyncHandler(async (req, res, next) => {
  const userId = req.params.id;
  const user = await User.findById(userId);
  if (!user) {
    return next(createError("User not found", 404));
  }
  const posts = await Post.find({
    _id: { $in: user.likedPosts },
  })
    .populate({ path: "user", select: "-password" })
    .populate({ path: "comments.user", select: "-password" });

  res.status(200).json(posts);
});
export const getFollowingsPosts = asyncHandler(async (req, res, next) => {
  const userId = req.user?._id;

  const user = await User.findById(userId);
  if (!user) {
    return next(createError("User not found", 404));
  }
  const posts = await Post.find({
    _id: { $in: user.followings },
  })
    .populate({ path: "user", select: "-password" })
    .populate({ path: "comments.user", select: "-password" });

  res.status(200).json(posts);
});
export const getUserPosts = asyncHandler(async (req, res, next) => {
  const { username } = req.params;

  const user = await User.findOne({ username });
  if (!user) {
    return next(createError("User not found", 404));
  }
  const posts = await Post.find({
    user: user._id,
  })
    .populate({ path: "user", select: "-password" })
    .populate({ path: "comments.user", select: "-password" });

  res.status(200).json(posts);
});
export const getPost = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const post = await Post.findOne({ _id: id })
    .populate({
      path: "user",
      select: "-password",
    })
    .populate({ path: "comments.user", select: "-password" });
  if (!post) {
    return createError("Post not found", 404);
  }
  res.status(200).json(post);
});
