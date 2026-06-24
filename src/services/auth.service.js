const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { getPrismaClient } = require("../config/db");

const prisma = getPrismaClient();

const SALT_ROUNDS = 10;

// ── Register ──────────────────────────────────────────────────────────────────
const register = async ({ name, email, password, roleId }) => {
  // Check if email already exists
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    const error = new Error("Email already in use");
    error.statusCode = 409;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      roleId: roleId || null,
    },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  });

  return user;
};

// ── Login ─────────────────────────────────────────────────────────────────────
const login = async ({ email, password }) => {
  const user = await prisma.user.findUnique({
    where: { email },
    include: { role: true },
  });

  if (!user) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  const payload = { id: user.id, email: user.email, role: user.role?.name };

  const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });

  const { password: _, ...userWithoutPassword } = user;
  return { user: userWithoutPassword, accessToken };
};

// ── Get current user ──────────────────────────────────────────────────────────
const getMe = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      employee: true,
      createdAt: true,
    },
  });

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  return user;
};

// ── Refresh token ─────────────────────────────────────────────────────────────
const refreshToken = async (oldToken) => {
  if (!oldToken) {
    const error = new Error("No token provided");
    error.statusCode = 401;
    throw error;
  }

  let decoded;
  try {
    decoded = jwt.verify(oldToken, process.env.JWT_SECRET);
  } catch {
    const error = new Error("Invalid or expired token");
    error.statusCode = 401;
    throw error;
  }

  const newToken = jwt.sign(
    { id: decoded.id, email: decoded.email, role: decoded.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );

  return { accessToken: newToken };
};

module.exports = { register, login, getMe, refreshToken };
