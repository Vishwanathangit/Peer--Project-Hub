import express from "express";
import {
  createCommentController,
  getCommentController,
  deleteCommentController,
} from "../controller/commentController.js";
import verifyToken from "../middleware/verifyToken.js";

const router = express.Router();

router.post("/create/:projectId", verifyToken, createCommentController);
router.get("/get/:projectId", getCommentController);
router.delete("/delete/:commentId", verifyToken, deleteCommentController);

export default router;
