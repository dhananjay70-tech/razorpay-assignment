const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const { verifyToken } = require("../middleware/auth.middleware");

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post("/register", authController.register);

// @route   POST /api/auth/login
// @desc    Login user & get token
// @access  Public
router.post("/login", authController.login);

// @route   POST /api/auth/logout
// @desc    Logout user
// @access  Private
router.post("/logout", verifyToken, authController.logout);

// @route   GET /api/auth/me
// @desc    Get current logged-in user profile
// @access  Private
router.get("/me", verifyToken, authController.getMe);

// @route   POST /api/auth/refresh
// @desc    Refresh access token
// @access  Public
router.post("/refresh", authController.refreshToken);

module.exports = router;
