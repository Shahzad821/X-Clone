import React, { useState } from "react";
import {
  FaRegComment,
  FaRegHeart,
  FaRegBookmark,
  FaTrash,
} from "react-icons/fa";
import { BiRepost } from "react-icons/bi";
import { Link } from "react-router-dom";
import profile from "../../assets/avatar-placeholder.png";

import useLikePost from "../../Hooks/useLikePost";
import useCommentPost from "../../Hooks/useCommentPost";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import axios from "axios";
import { formatTimeAgo } from "../../utils/formate";
import { useSelector } from "react-redux";

const Post = ({ post }) => {
  const queryClient = useQueryClient();
  const { user, _id, text, image, createdAt, likes, comments } = post;
  const authUser = useSelector((state) => state.auth.authUser);
  const { likePost, isLiking } = useLikePost(_id);
  const { commentPost, isCommenting } = useCommentPost(_id);
  const [comment, setComment] = useState("");

  const isLiked = likes?.includes(authUser?._id);

  const isMyPost = user?._id === authUser?._id.toString();

  const { mutate: onDelete, isPending: isDeleting } = useMutation({
    mutationFn: async () => {
      const response = await axios.delete(`/api/post/${_id}`);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["post"], (oldData) =>
        oldData?.filter((p) => p._id !== _id)
      );
      toast.success(data.message);
    },
    onError: (error) => {
      const errorMessage =
        error?.response?.data?.message ||
        error.message ||
        "Error deleting post";
      toast.error(errorMessage);
    },
  });

  const handleLikePost = () => {
    if (isLiking) return;
    likePost();
  };

  const handlePostComment = (e) => {
    e.preventDefault();
    if (isCommenting) return;
    commentPost({ text: comment });
    setComment("");
  };

  return (
    <div className="flex gap-2 items-start p-4 border-b border-gray-700">
      <Link to={`/profile/${user.username}`}>
        <img
          src={user.profileImg?.url || profile}
          alt={user.fullName}
          className="w-8 h-8 rounded-full overflow-hidden"
        />
      </Link>

      <div className="flex flex-col flex-1">
        <div className="flex justify-between items-center">
          <div className="flex gap-2 items-center">
            <Link
              to={`/profile/${user.username}`}
              className="font-bold text-white/90 text-base md:text-lg"
            >
              {user.fullName}
            </Link>
            <span className="text-gray-400 text-xs">
              {formatTimeAgo(new Date(createdAt))}
            </span>
          </div>
          {isMyPost && (
            <FaTrash
              className="w-4 h-4 text-red-500 cursor-pointer"
              onClick={() => {
                if (!isDeleting) onDelete(_id);
              }}
            />
          )}
        </div>

        <Link
          to={`/post/${_id}`}
          className="flex flex-col gap-3 overflow-hidden"
        >
          <span className="text-white/85 text-base">{text}</span>
          {image?.url && (
            <img
              src={image.url}
              className="md:h-60 h-50 object-cover rounded-lg border border-gray-700"
              alt="Post"
            />
          )}
        </Link>

        <div className="flex justify-between mt-3">
          <div className="flex gap-4 items-center w-2/3 justify-between">
            <div className="flex gap-1 items-center cursor-pointer group">
              <FaRegComment className="w-4 h-4 text-slate-400 group-hover:text-sky-400" />
              <span className="text-sm text-slate-400 group-hover:text-sky-400">
                {comments?.length || 0}
              </span>
            </div>
            <div className="flex gap-1 items-center group cursor-pointer">
              <BiRepost className="w-6 h-6 text-slate-400 group-hover:text-green-500" />
              <span className="text-sm text-slate-400 group-hover:text-green-500">
                0
              </span>
            </div>
            <div
              className="flex gap-1 items-center group cursor-pointer"
              onClick={handleLikePost}
            >
              <FaRegHeart
                className={`w-4 h-4 ${
                  isLiked ? "text-pink-500" : "text-slate-400"
                }`}
              />
              <span
                className={`text-sm ${
                  isLiked ? "text-pink-500" : "text-slate-400"
                }`}
              >
                {likes?.length || 0}
              </span>
            </div>
          </div>
          <FaRegBookmark className="w-4 h-4 text-slate-400 cursor-pointer" />
        </div>

        <form
          className="flex gap-2 items-center mt-3"
          onSubmit={handlePostComment}
        >
          <textarea
            className="textarea w-full p-1 rounded text-md resize-none border focus:outline-none border-gray-600 placeholder:text-gray-300 text-gray-300 text-sm"
            placeholder="Add a comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <button
            className="bg-blue-500 text-white px-3 py-1 rounded "
            type="submit"
            disabled={isCommenting || !comment}
          >
            Post
          </button>
        </form>

        {comments && comments.length > 0 && (
          <div className="mt-3">
            <div
              key={comments[0]._id}
              className="flex gap-2 items-start border-t border-gray-600 pt-2"
            >
              <div className="w-8 rounded-full">
                <img
                  src={comments[0].user?.profileImg?.url || profile}
                  alt="Commenter"
                  className="rounded-full"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-white/90">
                  {comments[0].user.fullName}
                </span>
                <span className="text-sm text-gray-300">
                  {comments[0].text}
                </span>
              </div>
            </div>
            {comments.length > 1 && (
              <Link
                to={`/post/${_id}`}
                className="text-blue-500 text-sm mt-2 inline-block"
              >
                Read more comments...
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Post;
