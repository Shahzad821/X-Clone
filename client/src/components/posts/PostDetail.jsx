import React from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import profilePlaceholder from "../../assets/avatar-placeholder.png";

import Spinner from "../Spinner";
import { formatTimeAgo } from "../../utils/formate";

const DetailedPost = () => {
  const { id } = useParams();

  const {
    data: post,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["getpost", id],
    queryFn: async () => {
      const response = await axios.get(`/api/post/${id}`);
      return response.data;
    },
  });

  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return <div>Error loading post: {error.message}</div>;
  }

  if (!post) {
    return <div>Post not found</div>;
  }

  const { user, text, image, createdAt, comments } = post;

  return (
    <div className="p-4 border-x border-gray-500 w-full h-full">
      {user && (
        <div className="flex items-center gap-2">
          <Link to={`/profile/${user.username}`}>
            <img
              src={user.profileImg?.url || profilePlaceholder}
              alt={user.fullName || "User"}
              className="w-10 h-10 rounded-full"
            />
          </Link>
          <div>
            <Link
              to={`/profile/${user.username}`}
              className="font-bold text-white/90"
            >
              {user.fullName || "Unknown User"}
            </Link>
            <p className="text-gray-400 text-sm">
              @{user.username} · {formatTimeAgo(new Date(createdAt))}
            </p>
          </div>
        </div>
      )}

      <p className="mt-3 text-white/85 text-base">{text}</p>

      {image?.url && (
        <img
          src={image.url}
          alt="Post content"
          className="mt-3 rounded-lg h-80 w-full object-cover border border-gray-700"
        />
      )}
      <hr className="text-gray-300  my-2" />
      <h3 className="text-lg font-semibold text-white/90">Comments</h3>
      {comments?.length > 0 ? (
        <div className="mt-3">
          {comments.map((comment) => (
            <div
              key={comment._id}
              className="flex gap-2 items-start border-t border-gray-600 pt-2 mt-2"
            >
              <img
                src={comment.user?.profileImg?.url || profilePlaceholder}
                alt={comment.user?.fullName || "Commenter"}
                className="w-8 h-8 rounded-full"
              />
              <div className="flex flex-col">
                <span className="font-bold text-white/90">
                  {comment.user?.fullName || "Unknown User"}
                </span>
                <span className="text-sm text-gray-300">{comment.text}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-300">No comments yet!</p>
      )}
    </div>
  );
};

export default DetailedPost;
