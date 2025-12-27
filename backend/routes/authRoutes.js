import express from "express";
import {
  sendOtp,
  verifyOtp,
  register,
  login,
  sendForgotPasswordOtp,
  verifyForgotPasswordOtp,
  resetPassword
} from "../controllers/authController.js";

const router = express.Router();

router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
router.post("/register", register);
router.post("/login", login);

// Forgot Password Flow
router.post("/send-forgot-otp", sendForgotPasswordOtp);
router.post("/verify-forgot-otp", verifyForgotPasswordOtp);
router.post("/reset-password", resetPassword);

export default router;
