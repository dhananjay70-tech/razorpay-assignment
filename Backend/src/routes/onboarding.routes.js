const express = require("express");
const router = express.Router();
const onboardingController = require("../controllers/onboarding.controller");
const { verifyToken } = require("../middleware/auth.middleware");

// POST /rest/onboardings/register  — Public
router.post("/register", onboardingController.register);

// POST /rest/onboardings/login  — Public
router.post("/login", onboardingController.login);

// POST /rest/onboardings/logout  — Private
router.post("/logout", verifyToken, onboardingController.logout);

// GET  /rest/onboardings/me  — Private (returns current user profile)
router.get("/me", verifyToken, onboardingController.getMe);

module.exports = router;
