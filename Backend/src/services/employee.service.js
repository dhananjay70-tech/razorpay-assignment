const { eq, inArray } = require("drizzle-orm");
const { getDb } = require("../config/db");
const { appUsers, employeeAssignments } = require("../db/schema");

// ── List employees (role-filtered) ────────────────────────────────────────────
/**
 * EMP   → 403 (enforced at route level, not here)
 * RM    → EMPs that are assigned to them
 * APE   → all EMPs and RMs
 * CFO   → everyone
 */
const listEmployees = async (requestingUser) => {
  const db = getDb();
  const { id, role } = requestingUser;

  let rows = [];

  const baseSelect = {
    id:    appUsers.id,
    name:  appUsers.name,
    email: appUsers.email,
    role:  appUsers.role,
  };

  if (role === "RM") {
    // Find employeeIds assigned to this RM
    const assignments = await db
      .select({ employeeId: employeeAssignments.employeeId })
      .from(employeeAssignments)
      .where(eq(employeeAssignments.managerId, id));

    const employeeIds = assignments.map((a) => a.employeeId);

    if (employeeIds.length === 0) return [];

    rows = await db
      .select(baseSelect)
      .from(appUsers)
      .where(inArray(appUsers.id, employeeIds));

    // Filter to EMP role only (mirrors Prisma: { role: "EMP" })
    rows = rows.filter((u) => u.role === "EMP");
  } else if (role === "APE") {
    rows = await db
      .select(baseSelect)
      .from(appUsers)
      .where(inArray(appUsers.role, ["EMP", "RM"]));
  } else if (role === "CFO") {
    rows = await db.select(baseSelect).from(appUsers);
  }

  // Normalise to userId key as per spec response
  return rows.map((u) => ({
    userId: u.id,
    name:   u.name,
    email:  u.email,
    role:   u.role,
  }));
};

// ── Assign EMP to RM (CFO only) ───────────────────────────────────────────────
const assignEmployee = async ({ employeeId, managerId }) => {
  const db = getDb();

  // Validate employee exists and is EMP
  const [employee] = await db
    .select()
    .from(appUsers)
    .where(eq(appUsers.id, employeeId))
    .limit(1);

  if (!employee || employee.role !== "EMP") {
    const err = new Error("Target user not found or is not an EMP.");
    err.statusCode = 400;
    throw err;
  }

  // Validate manager exists and is RM
  const [manager] = await db
    .select()
    .from(appUsers)
    .where(eq(appUsers.id, managerId))
    .limit(1);

  if (!manager || manager.role !== "RM") {
    const err = new Error("Manager user not found or is not an RM.");
    err.statusCode = 400;
    throw err;
  }

  // Upsert — each EMP has exactly one RM (unique employeeId)
  const [assignment] = await db
    .insert(employeeAssignments)
    .values({ employeeId, managerId })
    .onConflictDoUpdate({
      target: employeeAssignments.employeeId,
      set:    { managerId },
    })
    .returning();

  return assignment;
};

// ── Remove EMP ↔ RM assignment (CFO only) ────────────────────────────────────
const removeAssignment = async ({ employeeId, managerId }) => {
  const db = getDb();

  const [assignment] = await db
    .select()
    .from(employeeAssignments)
    .where(eq(employeeAssignments.employeeId, employeeId))
    .limit(1);

  if (!assignment || assignment.managerId !== managerId) {
    const err = new Error("Assignment not found for the given employee and manager.");
    err.statusCode = 404;
    throw err;
  }

  await db
    .delete(employeeAssignments)
    .where(eq(employeeAssignments.employeeId, employeeId));

  return { message: "Assignment removed successfully." };
};

module.exports = { listEmployees, assignEmployee, removeAssignment };
