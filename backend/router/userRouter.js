import express from "express";
import {
  updateUserProfileController,
  getUserBookmarkController,
  getUserFavoritesController,
  getUserProjectsController,
  getUserProfileController,
} from "../controller/userController.js";
import upload from "../middleware/multer.js";
import verifyToken from "../middleware/verifyToken.js";

const router = express.Router();

router.put(
  "/update/profile/:userId",
  verifyToken,
  upload.fields([{ name: "profilePic", maxCount: 1 }]),
  updateUserProfileController
);
router.get("/get/bookmarks/:userId", verifyToken, getUserBookmarkController);
router.get("/get/favorites/:userId", verifyToken, getUserFavoritesController);
router.get("/get/projects/:userId", getUserProjectsController);
router.get("/get/profile/:userId", getUserProfileController);

export default router;
