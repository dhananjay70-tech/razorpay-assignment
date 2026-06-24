const { getPrismaClient } = require("../config/db");

const VALID_ROLES = ["EMP", "RM", "APE", "CFO"];

// ── Assign role to a user (CFO only) ─────────────────────────────────────────
const assignRole = async ({ userId, role }) => {
  if (!VALID_ROLES.includes(role)) {
    const err = new Error(`Invalid role. Must be one of: ${VALID_ROLES.join(", ")}`);
    err.statusCode = 400;
    throw err;
  }

  const prisma = getPrismaClient();

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    const err = new Error("User not found.");
    err.statusCode = 404;
    throw err;
  }

  const updated = await prisma.user.update({
    where: { id: userId },
    data: { role },
    select: { id: true, name: true, email: true, role: true },
  });

  return updated;
};

module.exports = { assignRole };
