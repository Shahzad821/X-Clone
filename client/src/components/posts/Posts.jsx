import React, { useEffect } from "react";
// import { POSTS } from "../../utils/db/dummy.js";
import Post from "./Post.jsx";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import PostSkeleton from "../skeletons/PostSkeleton.jsx";
const Posts = ({ feed, username, id }) => {
  const POST_ENDPOINT = () => {
    switch (feed) {
      case "forYou":
        return "/api/post/all";
      case "followings":
        return "/api/post/get/following";
      case "posts":
        return `/api/post/user/${username}`;
      case "likes":
        return `/api/post/like/${id}`;
    }
  };
  const endPost = POST_ENDPOINT();
  const {
    data: POSTS,
    isLoading,
    error,
    isRefetching,
    refetch,
  } = useQuery({
    queryKey: ["post"],
    queryFn: async () => {
      const respnose = await axios.get(endPost);
      return respnose.data;
    },
  });

  if (error) {
    return (
      <div>
        <p>Failed to load posts</p>
        <button onClick={refetch}>Retry</button>
      </div>
    );
  }
  useEffect(() => {
    refetch();
  }, [username, id, feed]);
  return (
    <>
      {(isLoading || isRefetching) && (
        <div className="flex flex-col justify-center">
          <PostSkeleton />
          <PostSkeleton />
          <PostSkeleton />
        </div>
      )}
      {!isLoading && !isRefetching && POSTS?.length === 0 && (
        <p className="text-center my-4 text-gray-300">
          No posts in this tab. Switch 👻
        </p>
      )}
      {!isLoading &&
        !isRefetching &&
        POSTS?.map((post) => <Post key={post._id} post={post} />)}
    </>
  );
};

export default Posts;
