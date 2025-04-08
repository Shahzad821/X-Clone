const RightPanelSkeleton = () => {
  return (
    <div className="flex flex-col gap-3  my-2 w-1/4 ">
      {/* Simulating multiple suggested user skeletons */}
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="flex gap-2 items-center ">
          {/* Profile Picture Skeleton */}
          <div className="skeleton w-10 h-10 rounded-full shrink-0"></div>

          {/* User Info & Button Skeleton */}
          <div className="flex flex-1 justify-between">
            <div className="flex flex-col gap-1">
              <div className="skeleton h-3 w-14 rounded-full"></div>
              <div className="skeleton h-2 w-20 rounded-full"></div>
            </div>
            <div className="skeleton h-6 w-16 rounded-full"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RightPanelSkeleton;
