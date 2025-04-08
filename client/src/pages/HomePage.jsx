import React, { useState } from "react";

import Posts from "../components/posts/Posts";
import CreatePost from "../components/posts/CreatePost";

const HomePage = () => {
  const [feed, setFeed] = useState("forYou");

  return (
    <div className="h-full w-full border-x-2 border-x-gray-500 lg:px-7 md:px-5 px-3 mt-1 overflow-y-scroll">
      <div className="flex justify-around items-center">
        <div
          className="relative p-2 text-medium font-medium text-white cursor-pointer transition-colors duration-200"
          onClick={() => setFeed("forYou")}
        >
          For You
          {feed === "forYou" && (
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-full rounded-4xl h-1 bg-purple-600" />
          )}
        </div>
        <div
          className="relative text-medium font-medium p-2 text-sm text-white cursor-pointer transition-colors duration-200"
          onClick={() => setFeed("followings")}
        >
          Followings
          {feed === "followings" && (
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-full rounded-4xl h-1 bg-purple-600" />
          )}
        </div>
      </div>
      <CreatePost></CreatePost>
      <Posts feed={feed}></Posts>
    </div>
  );
};

export default HomePage;
