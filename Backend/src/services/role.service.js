const { eq } = require("drizzle-orm");
const { getDb } = require("../config/db");
const { appUsers } = require("../db/schema");

const VALID_ROLES = ["EMP", "RM", "APE", "CFO"];

// ── Assign role to a user (CFO only) ─────────────────────────────────────────
const assignRole = async ({ userId, role }) => {
  if (!VALID_ROLES.includes(role)) {
    const err = new Error(`Invalid role. Must be one of: ${VALID_ROLES.join(", ")}`);
    err.statusCode = 400;
    throw err;
  }

  const db = getDb();

  const [user] = await db
    .select()
    .from(appUsers)
    .where(eq(appUsers.id, userId))
    .limit(1);

  if (!user) {
    const err = new Error("User not found.");
    err.statusCode = 404;
    throw err;
  }

  const [updated] = await db
    .update(appUsers)
    .set({ role })
    .where(eq(appUsers.id, userId))
    .returning({
      id:    appUsers.id,
      name:  appUsers.name,
      email: appUsers.email,
      role:  appUsers.role,
    });

  return updated;
};

module.exports = { assignRole };
