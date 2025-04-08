const ProfileHeaderSkeleton = () => {
  return (
    <div className="flex flex-col gap-2 w-full my-2 p-4">
      <div className="flex gap-2 items-center">
        <div className="flex flex-1 gap-1">
          <div className="flex flex-col gap-1 w-full">
            {/* Profile Name Skeleton */}
            <div className="h-4 w-12 bg-gray-300 animate-pulse rounded-full"></div>
            <div className="h-4 w-16 bg-gray-300 animate-pulse rounded-full"></div>

            {/* Cover Image Skeleton */}
            <div className="h-40 w-full bg-gray-300 animate-pulse relative rounded-lg">
              {/* Profile Picture Skeleton */}
              <div className="h-20 w-20 bg-gray-300 animate-pulse rounded-full border absolute -bottom-10 left-3"></div>
            </div>

            {/* Buttons Skeleton */}
            <div className="h-6 mt-4 w-24 ml-auto bg-gray-300 animate-pulse rounded-full"></div>

            {/* Profile Info Skeleton */}
            <div className="h-4 w-14 bg-gray-300 animate-pulse rounded-full mt-4"></div>
            <div className="h-4 w-20 bg-gray-300 animate-pulse rounded-full"></div>
            <div className="h-4 w-2/3 bg-gray-300 animate-pulse rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeaderSkeleton;
