import express from "express";
import {
  signUpController,
  loginController,
  logoutController,
  verifyTokenController,
  googleLoginAndSignUpController,
} from "../controller/authController.js";
import verifyToken from "../middleware/verifyToken.js";

const router = express.Router();

router.post("/signup", signUpController);
router.post("/login", loginController);
router.post("/logout", logoutController);
router.get("/verify/token", verifyToken, verifyTokenController);
router.post("/google", googleLoginAndSignUpController);

export default router;