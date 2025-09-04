const express = require("express");


const {
  signup,
  login,
  forgotPassword,
  updateUser,
  resetPassword,
  verifyOtp
} = require("../controllers/authController");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Public routes
router.post("/signup", signup);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/verify-otp", verifyOtp);
router.post("/reset-password", resetPassword); 

// Protected routes

router.put("/update", protect, updateUser);

module.exports = router;
