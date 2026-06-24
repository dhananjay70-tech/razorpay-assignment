const authService = require("../services/auth.service");

// @desc   Register new user
// POST   /api/auth/register
const register = async (req, res, next) => {
  try {
    const user = await authService.register(req.body);
    res.status(201).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

// @desc   Login user
// POST   /api/auth/login
const login = async (req, res, next) => {
  try {
    const { user, accessToken } = await authService.login(req.body);

    // Set token in cookie (httpOnly for security)
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(200).json({ success: true, data: { user, accessToken } });
  } catch (error) {
    next(error);
  }
};

// @desc   Logout user
// POST   /api/auth/logout
const logout = (req, res) => {
  res.clearCookie("accessToken");
  res.status(200).json({ success: true, message: "Logged out successfully" });
};

// @desc   Get current logged-in user
// GET    /api/auth/me
const getMe = async (req, res, next) => {
  try {
    const user = await authService.getMe(req.user.id);
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

// @desc   Refresh access token
// POST   /api/auth/refresh
const refreshToken = async (req, res, next) => {
  try {
    const token = req.body.token || req.cookies?.accessToken;
    const result = await authService.refreshToken(token);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, logout, getMe, refreshToken };
