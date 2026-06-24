const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { getPrismaClient } = require("../config/db");

const ORG_DOMAIN = "@org.com";

/** Validate that the email belongs to the org domain */
const validateOrgEmail = (email) => {
  if (!email || !email.endsWith(ORG_DOMAIN)) {
    const err = new Error(`Only ${ORG_DOMAIN} email addresses are allowed.`);
    err.statusCode = 400;
    throw err;
  }
};

// ── Register ──────────────────────────────────────────────────────────────────
const register = async ({ name, email, password }) => {
  validateOrgEmail(email);

  const prisma = getPrismaClient();

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    const err = new Error("An account with this email already exists.");
    err.statusCode = 409;
    throw err;
  }

  const hashed = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: { name, email, password: hashed, role: "EMP" },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  });

  return user;
};

// ── Login ─────────────────────────────────────────────────────────────────────
const login = async ({ email, password }) => {
  validateOrgEmail(email);

  const prisma = getPrismaClient();

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    const err = new Error("Invalid email or password.");
    err.statusCode = 401;
    throw err;
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    const err = new Error("Invalid email or password.");
    err.statusCode = 401;
    throw err;
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );

  const { password: _, ...safeUser } = user;
  return { user: safeUser, token };
};

module.exports = { register, login };
