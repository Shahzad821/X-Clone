import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Function to upload a file to Cloudinary
const uploadFile = async (file, folder) => {
  try {
    const result = await cloudinary.uploader.upload(file, {
      resource_type: "auto",
      folder: folder,
    });

    return {
      public_id: result.public_id,
      url: result.secure_url,
    };
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    throw new Error("Failed to upload file to Cloudinary");
  }
};

// Function to delete a file from Cloudinary
export const deleteFile = async (file) => {
  try {
    const res = await cloudinary.uploader.destroy(file);

    if (res.result === "ok") return { success: true, result: res.result };

    return { success: false, result: res.result };
  } catch (error) {
    console.error("Error deleting from Cloudinary:", error);
    throw new Error("Failed to delete file from Cloudinary");
  }
};

export default uploadFile;

// import { v2 as cloudinary } from "cloudinary";
// import { response } from "express";

// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// const uploadFile = (file, folder) => {
//   return new Promise((resolve, reject) => {
//     cloudinary.uploader.upload(
//       file, // File input (path, URL, or buffer)
//       {
//         resource_type: "auto", // Auto-detect the resource type (image, video, etc.)
//         folder: folder, // Folder to store the uploaded file
//       },
//       (error, result) => {
//         if (error) {
//           reject(error);
//         } else {
//           resolve({
//             public_id: result.public_id,
//             url: result.secure_url,
//           });
//         }
//       }
//     );
//   });
// };

// export default uploadFile;
// export const deleteFile = async (file) => {
//   const res = await cloudinary.uploader.deleteFile(file);
//   if (res.statusCode === "ok") return true;
// };
