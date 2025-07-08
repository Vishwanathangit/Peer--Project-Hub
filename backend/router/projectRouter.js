import express from "express";
import {
  createProjectController,
  getAllProjectController,
  getSingleProjectController,
  editProjectController,
  deleteProjectController,
  toggleLikeProjectController,
  toggleBookmarkProjectController,
  toggleFavoriteProjectController,
} from "../controller/projectController.js";
import verifyToken from "../middleware/verifyToken.js";
import upload from "../middleware/multer.js";

const router = express.Router();

router.post(
  "/create",
  verifyToken,
  upload.fields([{ name: "previewImage", maxCount: 1 }]),
  createProjectController
);
router.get("/get/all", getAllProjectController);
router.get("/get/:id", getSingleProjectController);
router.put(
  "/edit/:id",
  verifyToken,
  upload.fields([{ name: "previewImage", maxCount: 1 }]),
  editProjectController
);
router.delete("/delete/:id", verifyToken, deleteProjectController);
router.put("/toggle/like/:id", verifyToken, toggleLikeProjectController);
router.put(
  "/toggle/bookmark/:id",
  verifyToken,
  toggleBookmarkProjectController
);
router.put(
  "/toggle/favorite/:id",
  verifyToken,
  toggleFavoriteProjectController
);

export default router;
