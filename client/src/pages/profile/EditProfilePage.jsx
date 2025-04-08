import { useEffect, useState } from "react";
import UseUpdateProfile from "../../Hooks/UseUpdateProfile";
import { useQueryClient } from "@tanstack/react-query";
import { setUser } from "../../ReduxStore/userSlice";
import { useDispatch } from "react-redux";

const EditProfileModal = ({ authUser, isOpen, setIsOpen }) => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    bio: "",
    link: "",
    newPassword: "",
    currentPassword: "",
  });

  const { updateProfile, isUpdatingProfile } = UseUpdateProfile();

  // Use useEffect to populate the form with authUser data when modal opens
  useEffect(() => {
    if (isOpen && authUser) {
      setFormData({
        fullName: authUser.fullName || "",
        username: authUser.username || "",
        email: authUser.email || "",
        bio: authUser.bio || "",
        link: authUser.link || "",
        newPassword: "",
        currentPassword: "",
      });
    }
  }, [isOpen, authUser]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    updateProfile(formData, {
      onSuccess: (updatedUser) => {
        queryClient.setQueryData(["user", authUser.username], (oldData) => {
          return { ...oldData, ...updatedUser };
        });
        dispatch(setUser(updatedUser));
        // queryClient.setQueryData(["authUser"], (oldData) => ({
        //   ...oldData,
        //   ...updatedUser,
        // }));

        setIsOpen(false);
        setFormData({
          fullName: "",
          username: "",
          email: "",
          bio: "",
          link: "",
          newPassword: "",
          currentPassword: "",
        });
      },
      onError: (error) => {
        console.error("Update failed:", error);
      },
    });
  };

  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-gray-900/90 w-full">
      <div className="bg-gray-900 p-6 rounded-xl w-full max-w-lg shadow-lg">
        <h3 className="text-xl font-semibold text-white mb-4">
          Update Profile
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              placeholder="Full Name"
              className="w-full p-2 border border-gray-600 rounded bg-gray-800 text-white"
            />
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              placeholder="Username"
              className="w-full p-2 border border-gray-600 rounded bg-gray-800 text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Email"
              className="w-full p-2 border border-gray-600 rounded bg-gray-800 text-white"
            />
            <input
              type="text"
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              placeholder="Bio"
              className="w-full p-2 border border-gray-600 rounded bg-gray-800 text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <input
              type="password"
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleInputChange}
              placeholder="Current Password"
              className="w-full p-2 border border-gray-600 rounded bg-gray-800 text-white"
            />
            <input
              type="password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleInputChange}
              placeholder="New Password"
              className="w-full p-2 border border-gray-600 rounded bg-gray-800 text-white"
            />
          </div>

          <input
            type="text"
            name="link"
            value={formData.link}
            onChange={handleInputChange}
            placeholder="Link"
            className="w-full p-2 border border-gray-600 rounded bg-gray-800 text-white"
          />

          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              className="px-4 py-2 text-gray-400 hover:text-white transition"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white"
            >
              {isUpdatingProfile ? "Updating..." : "Update"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;
