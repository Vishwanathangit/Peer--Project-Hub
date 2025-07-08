import CommentModel from "../models/CommentModel.js";
import ProjectModel from "../models/ProjectModel.js";

const createCommentController = async (req, res) => {
  try {
    const { content } = req.body;
    const { projectId } = req.params;
    const commentedBy = req.user._id;

    if (!content) {
      return res
        .status(400)
        .json({ success: false, error: "Content is missing" });
    }

    const project = await ProjectModel.findById({ _id: projectId });
    if (!project) {
      return res
        .status(404)
        .json({ success: false, error: "Project not found" });
    }

    const newComment = CommentModel({
      content: content,
      projectId: projectId,
      commentedBy: commentedBy,
    });
    await newComment.save();

    await ProjectModel.findByIdAndUpdate(
      { _id: projectId },
      {
        $push: {
          comments: newComment._id,
        },
      },
      { new: true }
    );

    return res
      .status(200)
      .json({
        success: true,
        message: "Commented Successfully",
        newComment: newComment,
      });
  } catch (err) {
    console.log(`Error in Create Comment Controller - ${err.message}`);
    return res
      .status(500)
      .json({
        message: "Internal Server Error",
        error: err.message,
        success: false,
      });
  }
};

const getCommentController = async (req, res) => {
  try {
    const { projectId } = req.params;

    const comments = await CommentModel.find({ projectId: projectId }).populate(
      {
        path: "commentedBy",
        select: "username email",
      }
    );

    return res.status(200).json({ success: true, comments: comments });
  } catch (err) {
    console.log(`Error in Get Comment Controller - ${err.message}`);
    return res
      .status(500)
      .json({
        message: "Internal Server Error",
        error: err.message,
        success: false,
      });
  }
};

const deleteCommentController = async (req, res) => {
  try {
    const { commentId } = req.params;

    const comment = await CommentModel.findById({ _id: commentId });
    if (!comment) {
      return res
        .status(404)
        .json({ success: false, error: "Comment not found" });
    }

    if (comment.commentedBy.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ success: false, error: "Unauthorized to delete this comment" });
    }

    const projectId = comment.projectId;
    await CommentModel.findByIdAndDelete({ _id: commentId });
    await ProjectModel.findByIdAndUpdate(
      { _id: projectId },
      {
        $pull: {
          comments: commentId,
        },
      },
      { new: true }
    );

    return res
      .status(200)
      .json({ success: true, message: "Comment Deleted Successfully" });
  } catch (err) {
    console.log(`Error in Delete Comment Controller - ${err.message}`);
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
  createCommentController,
  getCommentController,
  deleteCommentController,
};
