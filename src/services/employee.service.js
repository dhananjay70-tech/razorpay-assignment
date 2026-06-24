const { getPrismaClient } = require("../config/db");

// ── List employees (role-filtered) ────────────────────────────────────────────
/**
 * EMP   → 403 (enforced at route level, not here)
 * RM    → EMPs that are assigned to them
 * APE   → all EMPs and RMs
 * CFO   → everyone
 */
const listEmployees = async (requestingUser) => {
  const prisma = getPrismaClient();
  const { id, role } = requestingUser;

  let users = [];

  if (role === "RM") {
    // Find employeeIds assigned to this RM
    const assignments = await prisma.employeeAssignment.findMany({
      where: { managerId: id },
      select: { employeeId: true },
    });
    const employeeIds = assignments.map((a) => a.employeeId);

    users = await prisma.user.findMany({
      where: { id: { in: employeeIds }, role: "EMP" },
      select: { id: true, name: true, email: true, role: true },
    });
  } else if (role === "APE") {
    users = await prisma.user.findMany({
      where: { role: { in: ["EMP", "RM"] } },
      select: { id: true, name: true, email: true, role: true },
    });
  } else if (role === "CFO") {
    users = await prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true },
    });
  }

  // Normalise to userId key as per spec response
  return users.map((u) => ({
    userId: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
  }));
};

// ── Assign EMP to RM (CFO only) ───────────────────────────────────────────────
const assignEmployee = async ({ employeeId, managerId }) => {
  const prisma = getPrismaClient();

  // Validate employee exists and is EMP
  const employee = await prisma.user.findUnique({ where: { id: employeeId } });
  if (!employee || employee.role !== "EMP") {
    const err = new Error("Target user not found or is not an EMP.");
    err.statusCode = 400;
    throw err;
  }

  // Validate manager exists and is RM
  const manager = await prisma.user.findUnique({ where: { id: managerId } });
  if (!manager || manager.role !== "RM") {
    const err = new Error("Manager user not found or is not an RM.");
    err.statusCode = 400;
    throw err;
  }

  // Upsert — each EMP has exactly one RM (unique employeeId)
  const assignment = await prisma.employeeAssignment.upsert({
    where: { employeeId },
    update: { managerId },
    create: { employeeId, managerId },
  });

  return assignment;
};

// ── Remove EMP ↔ RM assignment (CFO only) ────────────────────────────────────
const removeAssignment = async ({ employeeId, managerId }) => {
  const prisma = getPrismaClient();

  const assignment = await prisma.employeeAssignment.findUnique({
    where: { employeeId },
  });

  if (!assignment || assignment.managerId !== managerId) {
    const err = new Error("Assignment not found for the given employee and manager.");
    err.statusCode = 404;
    throw err;
  }

  await prisma.employeeAssignment.delete({ where: { employeeId } });

  return { message: "Assignment removed successfully." };
};

module.exports = { listEmployees, assignEmployee, removeAssignment };
