import ProjectModel from "../models/ProjectModel.js";
import { v2 as cloudinary } from "cloudinary";
import UserModel from "../models/UserModel.js";

const createProjectController = async (req, res) => {
  try {
    const { title, description, category, tags, liveLink, repoLink } = req.body;
    const userId = req.user._id;
    const previewImage = req?.files?.previewImage?.[0];

    if (!title)
      return res
        .status(400)
        .json({ success: false, error: "Title is missing" });
    if (!description)
      return res
        .status(400)
        .json({ success: false, error: "Description is missing" });
    if (!category)
      return res
        .status(400)
        .json({ success: false, error: "Category is missing" });
    if (!repoLink)
      return res
        .status(400)
        .json({ success: false, error: "Repository is missing" });

    const exist = await ProjectModel.findOne({ title: title });
    if (exist)
      return res
        .status(400)
        .json({ success: false, error: "Title already exist" });

    let imageUrl = "";
    if (previewImage) {
      const result = await cloudinary.uploader.upload(previewImage.path, {
        resource_type: "image",
      });
      imageUrl = result.secure_url;
    }

    let parsedTags = tags;
    if (typeof tags === "string") {
      try {
        parsedTags = JSON.parse(tags);
      } catch {
        parsedTags = [];
      }
    }

    const newProject = ProjectModel({
      title,
      description,
      category,
      tags: parsedTags,
      liveLink,
      repoLink,
      authorId: userId,
      previewImage: imageUrl,
    });

    await newProject.save();
    return res
      .status(200)
      .json({
        success: true,
        message: "Project created Successfully",
        newProject,
      });
  } catch (err) {
    console.log(`Error in Create Project Controller - ${err.message}`);
    return res
      .status(500)
      .json({
        message: "Internal Server Error",
        error: err.message,
        success: false,
      });
  }
};

const getAllProjectController = async (req, res) => {
  try {
    const projects = await ProjectModel.find().populate([
      { path: "authorId", select: "username _id" },
      { path: "likes", select: "username _id" },
      { path: "bookmarks", select: "username _id" },
      { path: "favorites", select: "username _id" },
      {
        path: "comments",
        select: "commentedBy",
        populate: { path: "commentedBy", select: "username _id" },
      },
    ]);
    return res.status(200).json({ success: true, projects });
  } catch (err) {
    console.log(`Error in Get All Project Controller - ${err.message}`);
    return res
      .status(500)
      .json({
        message: "Internal Server Error",
        error: err.message,
        success: false,
      });
  }
};

const getSingleProjectController = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await ProjectModel.findById(id).populate([
      { path: "authorId", select: "username _id" },
      { path: "likes", select: "username _id" },
      { path: "bookmarks", select: "username _id" },
      { path: "favorites", select: "username _id" },
      {
        path: "comments",
        select: "commentedBy",
        populate: { path: "commentedBy", select: "username _id" },
      },
    ]);
    if (!project)
      return res
        .status(404)
        .json({ success: false, error: "Project doesn't exist" });
    return res.status(200).json({ success: true, project });
  } catch (err) {
    console.log(`Error in  Get Single Project Controller - ${err.message}`);
    return res
      .status(500)
      .json({
        message: "Internal Server Error",
        error: err.message,
        success: false,
      });
  }
};

const editProjectController = async (req, res) => {
  try {
    const { title, description, category, tags, liveLink, repoLink } = req.body;
    const { id } = req.params;
    const previewImage = req?.files?.previewImage?.[0];

    const project = await ProjectModel.findById(id);
    if (!project)
      return res
        .status(404)
        .json({ success: false, error: "Project doesn't exist" });
    if (project.authorId.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ success: false, error: "Unauthorized to edit this project" });
    }

    let parsedTags = tags;
    if (typeof tags === "string") {
      try {
        parsedTags = JSON.parse(tags);
      } catch {
        parsedTags = [];
      }
    }

    if (previewImage) {
      if (project.previewImage) {
        const imageURL = project.previewImage.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(imageURL);
      }

      const result = await cloudinary.uploader.upload(previewImage.path, {
        resource_type: "image",
      });
      const imageUrl = result.secure_url;
      const editedProject = await ProjectModel.findByIdAndUpdate(
        id,
        {
          title,
          description,
          category,
          tags: parsedTags,
          liveLink,
          repoLink,
          previewImage: imageUrl,
        },
        { new: true }
      ).populate([
        { path: "authorId", select: "username _id" },
        { path: "likes", select: "username _id" },
        { path: "bookmarks", select: "username _id" },
        { path: "favorites", select: "username _id" },
        {
          path: "comments",
          select: "commentedBy",
          populate: { path: "commentedBy", select: "username _id" },
        },
      ]);
      return res
        .status(200)
        .json({
          success: true,
          message: "Project Edited Successfully",
          editedProject,
        });
    }

    const editedProject = await ProjectModel.findByIdAndUpdate(
      id,
      { title, description, category, tags: parsedTags, liveLink, repoLink },
      { new: true }
    ).populate([
      { path: "authorId", select: "username _id" },
      { path: "likes", select: "username _id" },
      { path: "bookmarks", select: "username _id" },
      { path: "favorites", select: "username _id" },
      {
        path: "comments",
        select: "commentedBy",
        populate: { path: "commentedBy", select: "username _id" },
      },
    ]);
    return res
      .status(200)
      .json({
        success: true,
        message: "Project Edited Successfully",
        editedProject,
      });
  } catch (err) {
    console.log(`Error in Edit Project Controller - ${err.message}`);
    return res
      .status(500)
      .json({
        message: "Internal Server Error",
        error: err.message,
        success: false,
      });
  }
};

const deleteProjectController = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await ProjectModel.findById(id);
    if (!project)
      return res
        .status(404)
        .json({ success: false, error: "Project not found" });
    if (project.authorId.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ success: false, error: "Unauthorized to delete this project" });
    }

    if (project.previewImage) {
      const imageURL = project.previewImage.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(imageURL);
    }

    await ProjectModel.findByIdAndDelete(id);
    return res
      .status(200)
      .json({ success: true, message: "Project Deleted Successfully" });
  } catch (err) {
    console.log(`Error in Delete Project Controller - ${err.message}`);
    return res
      .status(500)
      .json({
        message: "Internal Server Error",
        error: err.message,
        success: false,
      });
  }
};

const toggleLikeProjectController = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const project = await ProjectModel.findById(id);
    if (!project)
      return res
        .status(404)
        .json({ success: false, error: "Project not found" });

    const isLiked = project.likes.some(
      (e) => e.toString() === userId.toString()
    );
    if (isLiked) {
      await ProjectModel.findByIdAndUpdate(
        id,
        { $pull: { likes: userId } },
        { new: true }
      );
      return res
        .status(200)
        .json({ success: true, message: "Project Disliked Successfully" });
    }

    await ProjectModel.findByIdAndUpdate(
      id,
      { $push: { likes: userId } },
      { new: true }
    );
    return res
      .status(200)
      .json({ success: true, message: "Project Liked Successfully" });
  } catch (err) {
    console.log(`Error in Like Project Controller - ${err.message}`);
    return res
      .status(500)
      .json({
        message: "Internal Server Error",
        error: err.message,
        success: false,
      });
  }
};

const toggleBookmarkProjectController = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const project = await ProjectModel.findById(id);
    if (!project)
      return res
        .status(404)
        .json({ success: false, error: "Project not found" });

    const isBookmarked = project.bookmarks.some(
      (e) => e.toString() === userId.toString()
    );
    if (isBookmarked) {
      await UserModel.findByIdAndUpdate(
        userId,
        { $pull: { bookmarks: id } },
        { new: true }
      );
      await ProjectModel.findByIdAndUpdate(
        id,
        { $pull: { bookmarks: userId } },
        { new: true }
      );
      return res
        .status(200)
        .json({
          success: true,
          message: "Project removed from bookmark Successfully",
        });
    }

    await UserModel.findByIdAndUpdate(
      userId,
      { $push: { bookmarks: id } },
      { new: true }
    );
    await ProjectModel.findByIdAndUpdate(
      id,
      { $push: { bookmarks: userId } },
      { new: true }
    );
    return res
      .status(200)
      .json({
        success: true,
        message: "Project added to bookmark Successfully",
      });
  } catch (err) {
    console.log(`Error in Bookmark Project Controller - ${err.message}`);
    return res
      .status(500)
      .json({
        message: "Internal Server Error",
        error: err.message,
        success: false,
      });
  }
};

const toggleFavoriteProjectController = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const project = await ProjectModel.findById(id);
    if (!project)
      return res
        .status(404)
        .json({ success: false, error: "Project not found" });

    const isFavorited = project.favorites.some(
      (e) => e.toString() === userId.toString()
    );
    if (isFavorited) {
      await UserModel.findByIdAndUpdate(
        userId,
        { $pull: { favorites: id } },
        { new: true }
      );
      await ProjectModel.findByIdAndUpdate(
        id,
        { $pull: { favorites: userId } },
        { new: true }
      );
      return res
        .status(200)
        .json({
          success: true,
          message: "Project removed from favorites Successfully",
        });
    }

    await UserModel.findByIdAndUpdate(
      userId,
      { $push: { favorites: id } },
      { new: true }
    );
    await ProjectModel.findByIdAndUpdate(
      id,
      { $push: { favorites: userId } },
      { new: true }
    );
    return res
      .status(200)
      .json({
        success: true,
        message: "Project added to favorites Successfully",
      });
  } catch (err) {
    console.log(`Error in Favorite Project Controller - ${err.message}`);
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
  createProjectController,
  getAllProjectController,
  getSingleProjectController,
  editProjectController,
  deleteProjectController,
  toggleLikeProjectController,
  toggleBookmarkProjectController,
  toggleFavoriteProjectController,
};
