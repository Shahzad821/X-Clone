const PostSkeleton = () => {
  return (
    <div className="flex flex-col gap-4 flex-1 p-4">
      {/* Profile Info Skeleton */}
      <div className="flex gap-4 items-center">
        <div className="w-10 h-10 rounded-full bg-gray-300 animate-pulse shrink-0"></div>
        <div className="flex flex-col gap-2">
          <div className="h-2 w-12 rounded-full bg-gray-300 animate-pulse"></div>
          <div className="h-2 w-24 rounded-full bg-gray-300 animate-pulse"></div>
        </div>
      </div>
      {/* Post Content Skeleton */}
      <div className="h-40 w-full bg-gray-300 animate-pulse rounded-lg"></div>
    </div>
  );
};

export default PostSkeleton;
