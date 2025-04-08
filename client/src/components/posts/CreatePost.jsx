import React, { useRef, useState } from "react";
import { CiImageOn } from "react-icons/ci";
import { BsEmojiSmileFill } from "react-icons/bs";
import { IoCloseSharp } from "react-icons/io5";
import ProfileImage from "../../assets/avatar-placeholder.png";
import UseUploadPost from "../../Hooks/UploadPost";
import { useSelector } from "react-redux";

const CreatePost = () => {
  const { mutate, isPending } = UseUploadPost();
  const authUser = useSelector((state) => state.auth.authUser);
  const [text, setText] = useState("");
  const [img, setImg] = useState(null);
  const imgRef = useRef(null);
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = {
      image: img,
      text,
    };
    mutate(formData);
    setImg(null);
    setText("");
  };

  const handleImgChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImg(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex p-4 items-start gap-4 border-b border-gray-700">
      {/* Avatar */}
      <div className="w-8 h-8 flex-shrink-0">
        <img
          src={authUser.profileImg.url || ProfileImage}
          alt="User avatar"
          className="w-8 h-8 rounded-full object-cover"
        />
      </div>
      {/* Post Form */}
      <form className="flex flex-col gap-2 w-full" onSubmit={handleSubmit}>
        <textarea
          className=" text-white/90 placeholder:text-white/90 text-base border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
          placeholder="What is happening?!"
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={3}
        />
        {/* Image Preview */}
        {img && (
          <div className="relative w-72 mx-auto">
            <IoCloseSharp
              className="absolute top-1 right-1 text-white bg-gray-800 rounded-full w-6 h-6 cursor-pointer p-0.5"
              onClick={() => {
                setImg(null);
                if (imgRef.current) imgRef.current.value = null;
              }}
            />
            <img
              src={img}
              alt="Selected preview"
              className="w-full mx-auto h-72 object-contain rounded-lg"
            />
          </div>
        )}
        {/* Actions */}
        <div className="flex items-center justify-between border-t border-gray-700 py-2">
          <div className="flex gap-2 items-center">
            <CiImageOn
              className="w-6 h-6 text-purple-500 cursor-pointer"
              onClick={() => {
                if (imgRef.current) imgRef.current.click();
              }}
            />
            <BsEmojiSmileFill className="w-5 h-5 text-purple-500 cursor-pointer" />
          </div>
          <input
            accept="image/*"
            type="file"
            hidden
            ref={imgRef}
            onChange={handleImgChange}
          />
          <button
            type="submit"
            disabled={isPending || (!img && !text)}
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded-full transition-colors duration-200"
          >
            {isPending ? (
              <span className="inline-block w-5 h-5 border-2 border-t-2 border-white rounded-full animate-spin"></span>
            ) : (
              "Post"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;
