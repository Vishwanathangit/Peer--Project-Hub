import ProjectModel from "../models/ProjectModel.js";
import UserModel from "../models/UserModel.js";
import { v2 as cloudinary } from "cloudinary";

const updateUserProfileController = async (req, res) => {
  try {
    const { username, bio } = req.body;
    if (!username)
      return res
        .status(400)
        .json({ success: false, error: "Username is missing" });

    const profilePic = req?.files?.profilePic?.[0];
    const { userId } = req.params;

    if (userId.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ success: false, error: "Unauthorized to Update this profile" });
    }

    if (profilePic) {
      const user = await UserModel.findById(userId);
      if (user.profilePic) {
        const imageURL = user.profilePic.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(imageURL);
      }

      const result = await cloudinary.uploader.upload(profilePic.path, {
        resource_type: "image",
      });
      const imageUrl = result.secure_url;

      const updatedUserProfile = await UserModel.findByIdAndUpdate(
        { _id: userId },
        { username, bio, profilePic: imageUrl },
        { new: true }
      );
      return res
        .status(200)
        .json({
          success: true,
          message: "Profile Updated Successfully",
          updatedUserProfile,
        });
    }

    const updatedUserProfile = await UserModel.findByIdAndUpdate(
      { _id: userId },
      { username, bio },
      { new: true }
    );
    return res
      .status(200)
      .json({
        success: true,
        message: "Profile Updated Successfully",
        updatedUserProfile,
      });
  } catch (err) {
    console.log(`Error in Update Profile Controller - ${err.message}`);
    return res
      .status(500)
      .json({
        message: "Internal Server Error",
        error: err.message,
        success: false,
      });
  }
};

const getUserBookmarkController = async (req, res) => {
  try {
    const { userId } = req.params;
    if (userId.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ success: false, error: "Unauthorized to view bookmarks" });
    }

    const user = await UserModel.findById(userId).populate({
      path: "bookmarks",
      populate: [
        { path: "likes", select: "username _id" },
        { path: "bookmarks", select: "username _id" },
        { path: "favorites", select: "username _id" },
        {
          path: "comments",
          select: "commentedBy",
          populate: { path: "commentedBy", select: "username _id" },
        },
      ],
    });
    return res.status(200).json({ success: true, bookmarks: user.bookmarks });
  } catch (err) {
    console.log(`Error in Get Bookmark Controller - ${err.message}`);
    return res
      .status(500)
      .json({
        message: "Internal Server Error",
        error: err.message,
        success: false,
      });
  }
};

const getUserFavoritesController = async (req, res) => {
  try {
    const { userId } = req.params;
    if (userId.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ success: false, error: "Unauthorized to view favorites" });
    }

    const user = await UserModel.findById(userId).populate({
      path: "favorites",
      populate: [
        { path: "likes", select: "username _id" },
        { path: "bookmarks", select: "username _id" },
        { path: "favorites", select: "username _id" },
        {
          path: "comments",
          select: "commentedBy",
          populate: { path: "commentedBy", select: "username _id" },
        },
      ],
    });
    return res.status(200).json({ success: true, favorites: user.favorites });
  } catch (err) {
    console.log(`Error in Get Favorites Controller - ${err.message}`);
    return res
      .status(500)
      .json({
        message: "Internal Server Error",
        error: err.message,
        success: false,
      });
  }
};

const getUserProjectsController = async (req, res) => {
  try {
    const { userId } = req.params;

    const userProjects = await ProjectModel.find({ authorId: userId }).populate(
      [
        { path: "likes", select: "username _id" },
        { path: "bookmarks", select: "username _id" },
        { path: "favorites", select: "username _id" },
        {
          path: "comments",
          select: "commentedBy",
          populate: { path: "commentedBy", select: "username _id" },
        },
      ]
    );
    return res.status(200).json({ success: true, userProjects });
  } catch (err) {
    console.log(`Error in Get Project Controller - ${err.message}`);
    return res
      .status(500)
      .json({
        message: "Internal Server Error",
        error: err.message,
        success: false,
      });
  }
};

const getUserProfileController = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await UserModel.findById(userId).select(
      "username email bio profilePic"
    );
    if (!user)
      return res.status(404).json({ success: false, error: "User not found" });
    return res.status(200).json({ success: true, user });
  } catch (err) {
    console.log(`Error in Get Profile Controller - ${err.message}`);
    return res
      .status(500)
      .json({
        message: "Internal Server Error",
        error: err.message,
        success: false,
      });
  }
};

export {
  updateUserProfileController,
  getUserBookmarkController,
  getUserFavoritesController,
  getUserProjectsController,
  getUserProfileController,
};
