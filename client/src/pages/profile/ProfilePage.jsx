import { useState, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import axios from "axios";
import { FaArrowLeft } from "react-icons/fa6";
import { IoCalendarOutline } from "react-icons/io5";
import { FaLink } from "react-icons/fa";
import { MdCancel, MdEdit } from "react-icons/md";
import profilePlaceholder from "../../assets/avatar-placeholder.png";
import coverPlaceholder from "../../assets/cover.jfif";
import EditProfileModal from "./EditProfilePage";
import UseUpdateProfile from "../../Hooks/UseUpdateProfile";
import ProfileHeaderSkeleton from "../../components/skeletons/ProfilePageSkeleton";
import toast from "react-hot-toast";
import useFollowUser from "../../Hooks/FollowUser";
import { useDispatch, useSelector } from "react-redux";
import Posts from "../../components/posts/Posts";
import { setUser } from "../../ReduxStore/userSlice";
const ProfilePage = () => {
  const dispatch = useDispatch();
  const { username } = useParams();
  const [feedType, setFeedType] = useState("posts");
  const queryClient = useQueryClient();
  const authUser = useSelector((state) => state.auth.authUser);
  console.log(authUser);
  const [isOpen, setIsOpen] = useState(false);
  const { updateProfile, isUpdatingProfile } = UseUpdateProfile();
  const { followUnfollowUser, isFollowing } = useFollowUser();
  const [profileImage, setProfileImage] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const profileInputRef = useRef(null);
  const coverInputRef = useRef(null);

  const {
    data: user,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["user", username],
    queryFn: async () => {
      const response = await axios.get(`/api/user/profile/${username}`);
      return response.data;
    },
    enabled: !!username,
  });

  const isFollowingUser = user?.followers?.includes(authUser?._id);
  const isMyProfile = authUser?.username === user?.username;
  const formattedDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString()
    : "Unknown";

  const handleImageChange = (event, type) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        type === "profile"
          ? setProfileImage(reader.result)
          : setCoverImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageCancel = (type) => {
    if (type === "profileImage") {
      profileInputRef.current.value = "";
      setProfileImage(null);
    }
    if (type === "coverImage") {
      coverInputRef.current.value = "";
      setCoverImage(null);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!profileImage && !coverImage) return;

    const formData = { profileImg: profileImage, coverImg: coverImage };

    updateProfile(formData, {
      onSuccess: (data) => {
        queryClient.setQueryData(["user", username], (oldUser) => ({
          ...oldUser,
          ...data,
        }));
        dispatch(setUser(data));
        toast.success("Profile updated successfully!");
        setProfileImage(null);
        setCoverImage(null);
        profileInputRef.current.value = "";
        coverInputRef.current.value = "";
      },
    });
  };

  const handleFollow = () => {
    if (!authUser) return;
    followUnfollowUser(user._id);
  };

  if (isLoading) return <ProfileHeaderSkeleton />;
  if (error)
    return <p className="text-red-500 text-center">Failed to load user</p>;

  return (
    <div className="flex flex-col w-full h-screen overflow-y-scroll border-x border-gray-500  text-white relative ">
      {/* Header */}
      <div className="flex gap-4 px-4 py-4 items-center border-b border-gray-600">
        <Link to="/">
          <FaArrowLeft className="w-5 h-5 text-gray-400" />
        </Link>

        <p className="font-bold text-lg">{user?.fullName || "User"}</p>
      </div>

      {/* Cover Image */}
      <div className="relative mb-9">
        <img
          src={coverImage || user?.coverImg?.url || coverPlaceholder}
          className="md:h-52 h-32 w-full object-cover"
          alt="Cover"
        />
        {isMyProfile && (
          <button
            onClick={() =>
              coverImage
                ? handleImageCancel("coverImage")
                : coverInputRef.current.click()
            }
            className="absolute top-2 right-2 bg-gray-600 p-1 rounded-full cursor-pointer"
          >
            {coverImage ? (
              <MdCancel className="w-5 h-5 text-red-500 hover:text-red-400" />
            ) : (
              <MdEdit className="w-5 h-5 text-blue-500 hover:text-blue-400" />
            )}
          </button>
        )}

        <div className="absolute -bottom-8.5 left-4 translate-y-1.5">
          <img
            src={profileImage || user?.profileImg?.url || profilePlaceholder}
            className="w-24 h-24 rounded-full border-4 border-blue-900"
            alt={`${user?.fullName || "User"}'s Profile`}
          />
          {isMyProfile && (
            <button
              onClick={() =>
                profileImage
                  ? handleImageCancel("profileImage")
                  : profileInputRef.current.click()
              }
              className="absolute top-2 right-0 bg-gray-600 p-1 rounded-full cursor-pointer"
            >
              {profileImage ? (
                <MdCancel className="w-3 h-3 text-red-500 hover:text-red-400" />
              ) : (
                <MdEdit className="w-3 h-3 text-blue-500 hover:text-blue-400" />
              )}
            </button>
          )}
          <input
            type="file"
            accept="image/*"
            ref={profileInputRef}
            className="hidden"
            onChange={(e) => handleImageChange(e, "profile")}
          />
        </div>
        <input
          type="file"
          accept="image/*"
          ref={coverInputRef}
          className="hidden"
          onChange={(e) => handleImageChange(e, "cover")}
        />
      </div>

      {/* Profile Info */}
      <div className="px-4 mt-3 flex items-center justify-between">
        <div>
          <p className="font-bold text-lg leading-3">
            {user?.fullName || "User"}
          </p>
          <p className="text-gray-500">@{user?.username || "username"}</p>
        </div>
        {isMyProfile && (
          <div className="px-4">
            {profileImage || coverImage ? (
              <button
                onClick={handleSubmit}
                disabled={isUpdatingProfile}
                className="px-4 py-2 border border-gray-500 rounded-full  text-white text-sm hover:bg-gray-700 transition"
              >
                {isUpdatingProfile ? "Updating..." : "Update Profile"}
              </button>
            ) : (
              <button
                className="px-4 py-2 border border-gray-500 rounded-full  text-white text-sm hover:bg-gray-700 transition"
                onClick={() => setIsOpen(true)}
              >
                Edit Profile
              </button>
            )}
          </div>
        )}
        {!isMyProfile && (
          <button
            onClick={handleFollow}
            disabled={isFollowing}
            className={`px-4 py-2 rounded-full font-semibold text-sm ${
              isFollowingUser
                ? "bg-transparent border border-red-600 text-red-500 hover:bg-red-900"
                : "bg-blue-500 hover:bg-blue-600 text-white"
            } transition-colors duration-200`}
          >
            {isFollowing
              ? "Loading..."
              : isFollowingUser
              ? "Unfollow"
              : "Follow"}
          </button>
        )}
      </div>

      {/* Bio & Details */}
      <div className="px-4">
        <p className="text-sm">{user?.bio || "No bio available"}</p>
        <div className="flex gap-2 mt-2">
          {user?.link && (
            <a
              href={user.link}
              target="_blank"
              rel="noreferrer"
              className="text-blue-500 text-sm hover:underline flex items-center"
            >
              <FaLink className="mr-1" /> {user.link}
            </a>
          )}
          <span className="text-sm text-gray-500 flex items-center">
            <IoCalendarOutline className="mr-1" /> Joined {formattedDate}
          </span>
        </div>
      </div>
      <EditProfileModal authUser={user} isOpen={isOpen} setIsOpen={setIsOpen} />

      {/* Feed Tabs */}
      <div className="flex border-b border-gray-600 mt-4">
        <button
          onClick={() => setFeedType("posts")}
          className={`flex-1 text-center py-2 ${
            feedType === "posts"
              ? "border-b-2 border-blue-500 font-bold"
              : "text-gray-500"
          }`}
        >
          Posts
        </button>
        <button
          onClick={() => setFeedType("likes")}
          className={`flex-1 text-center py-2 ${
            feedType === "likes"
              ? "border-b-2 border-blue-500 font-bold"
              : "text-gray-500"
          }`}
        >
          Likes
        </button>
      </div>

      {/* Posts */}
      <Posts feed={feedType} username={username} id={user?._id} />
    </div>
  );
};

export default ProfilePage;
