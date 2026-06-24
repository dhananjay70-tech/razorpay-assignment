const express = require("express");
const router = express.Router();
const onboardingController = require("../controllers/onboarding.controller");
const { verifyToken } = require("../middleware/auth.middleware");

// POST /rest/onboardings/register
router.post("/register", onboardingController.register);

// POST /rest/onboardings/login
router.post("/login", onboardingController.login);

// POST /rest/onboardings/logout
router.post("/logout", verifyToken, onboardingController.logout);

module.exports = router;
