const onboardingService = require("../services/onboarding.service");
const { success, error } = require("../utils/response");

// POST /rest/onboardings/register
const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return error(res, "name, email, and password are required.", 400);
    }
    const user = await onboardingService.register({ name, email, password });
    return success(res, { user }, 201);
  } catch (err) {
    next(err);
  }
};

// POST /rest/onboardings/login
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return error(res, "email and password are required.", 400);
    }

    const { user, token } = await onboardingService.login({ email, password });

    // Set httpOnly auth cookie
    res.cookie("authToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return success(res, { user });
  } catch (err) {
    next(err);
  }
};

// POST /rest/onboardings/logout
const logout = (req, res) => {
  res.clearCookie("authToken");
  return success(res, { message: "Logged out successfully." });
};

module.exports = { register, login, logout };
