const bcrypt = require("bcrypt");
const jwt    = require("jsonwebtoken");
const { eq } = require("drizzle-orm");
const { getDb } = require("../config/db");
const { appUsers } = require("../db/schema");

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

  const db = getDb();

  const [existing] = await db
    .select()
    .from(appUsers)
    .where(eq(appUsers.email, email))
    .limit(1);

  if (existing) {
    const err = new Error("An account with this email already exists.");
    err.statusCode = 409;
    throw err;
  }

  const hashed = await bcrypt.hash(password, 10);

  const [user] = await db
    .insert(appUsers)
    .values({ name, email, password: hashed, role: "EMP" })
    .returning({
      id:        appUsers.id,
      name:      appUsers.name,
      email:     appUsers.email,
      role:      appUsers.role,
      createdAt: appUsers.createdAt,
    });

  return user;
};

// ── Login ─────────────────────────────────────────────────────────────────────
const login = async ({ email, password }) => {
  validateOrgEmail(email);

  const db = getDb();

  const [user] = await db
    .select()
    .from(appUsers)
    .where(eq(appUsers.email, email))
    .limit(1);

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

// ── Get current user profile ──────────────────────────────────────────────────
const getMe = async (userId) => {
  const db = getDb();

  const [user] = await db
    .select({
      id:        appUsers.id,
      name:      appUsers.name,
      email:     appUsers.email,
      role:      appUsers.role,
      createdAt: appUsers.createdAt,
    })
    .from(appUsers)
    .where(eq(appUsers.id, userId))
    .limit(1);

  if (!user) {
    const err = new Error("User not found.");
    err.statusCode = 404;
    throw err;
  }

  return user;
};

module.exports = { register, login, getMe };
