const { getPrismaClient } = require("../config/db");

// ── Helper: format reimbursement for API response ─────────────────────────────
const fmt = (r) => ({
  id: r.id,
  title: r.title,
  description: r.description,
  amount: r.amount,
  status: r.status,
});

// ── Create reimbursement (EMP only) ──────────────────────────────────────────
const createReimbursement = async (employeeId, { title, description, amount }) => {
  const prisma = getPrismaClient();

  const reimbursement = await prisma.reimbursement.create({
    data: {
      employeeId,
      title,
      description,
      amount: parseFloat(amount),
      status: "PENDING",
      rmApproved: false,
      apeApproved: false,
    },
  });

  return fmt(reimbursement);
};

// ── List reimbursements (role-filtered) ──────────────────────────────────────
/**
 * EMP  → their own (all statuses)
 * RM   → PENDING from their direct EMPs where RM hasn't acted yet (rmApproved=false, not rejected)
 * APE  → RM-approved but APE hasn't acted yet (rmApproved=true, apeApproved=false, status=PENDING)
 * CFO  → APE-approved (apeApproved=true)
 */
const listReimbursements = async (requestingUser) => {
  const prisma = getPrismaClient();
  const { id, role } = requestingUser;

  let reimbursements = [];

  if (role === "EMP") {
    reimbursements = await prisma.reimbursement.findMany({
      where: { employeeId: id },
      orderBy: { createdAt: "desc" },
    });
  } else if (role === "RM") {
    // Get EMP IDs under this RM
    const assignments = await prisma.employeeAssignment.findMany({
      where: { managerId: id },
      select: { employeeId: true },
    });
    const empIds = assignments.map((a) => a.employeeId);

    reimbursements = await prisma.reimbursement.findMany({
      where: {
        employeeId: { in: empIds },
        status: "PENDING",
        rmApproved: false,
      },
      orderBy: { createdAt: "desc" },
    });
  } else if (role === "APE") {
    reimbursements = await prisma.reimbursement.findMany({
      where: {
        status: "PENDING",
        rmApproved: true,
        apeApproved: false,
      },
      orderBy: { createdAt: "desc" },
    });
  } else if (role === "CFO") {
    reimbursements = await prisma.reimbursement.findMany({
      where: { apeApproved: true },
      orderBy: { createdAt: "desc" },
    });
  }

  return reimbursements.map(fmt);
};

// ── List reimbursements for a specific user (subordinate check) ───────────────
/**
 * Caller must be RM/APE/CFO.
 * Target must be an EMP who is the caller's subordinate:
 *   RM  → must be one of their assigned EMPs
 *   APE/CFO → any EMP
 */
const listByUser = async (requestingUser, targetUserId) => {
  const prisma = getPrismaClient();
  const { id: callerId, role } = requestingUser;

  // Target must exist and be an EMP
  const target = await prisma.user.findUnique({ where: { id: targetUserId } });
  if (!target || target.role !== "EMP") {
    const err = new Error("Target user not found or is not an EMP.");
    err.statusCode = 404;
    throw err;
  }

  // RM: check subordinate relationship
  if (role === "RM") {
    const assignment = await prisma.employeeAssignment.findFirst({
      where: { employeeId: targetUserId, managerId: callerId },
    });
    if (!assignment) {
      const err = new Error("This EMP does not report to you.");
      err.statusCode = 403;
      throw err;
    }
  }
  // APE and CFO can view any EMP's reimbursements

  const reimbursements = await prisma.reimbursement.findMany({
    where: { employeeId: targetUserId },
    orderBy: { createdAt: "desc" },
  });

  return reimbursements.map(fmt);
};

// ── Update reimbursement status (RM / APE / CFO) ─────────────────────────────
/**
 * Body: { reimbursementId, status }
 * Status must be APPROVED or REJECTED.
 *
 * Approval flow:
 *   RM APPROVED  → rmApproved=true  (overall status stays PENDING until APE also approves)
 *   APE APPROVED → apeApproved=true → if rmApproved=true, status=APPROVED
 *   CFO APPROVED → status=APPROVED directly
 *   Any REJECTED → status=REJECTED immediately
 */
const updateStatus = async ({ reimbursementId, status }, requestingUser) => {
  const prisma = getPrismaClient();
  const { id: callerId, role } = requestingUser;

  if (!["APPROVED", "REJECTED"].includes(status)) {
    const err = new Error("Status must be APPROVED or REJECTED.");
    err.statusCode = 400;
    throw err;
  }

  const reimbursement = await prisma.reimbursement.findUnique({
    where: { id: reimbursementId },
  });

  if (!reimbursement) {
    const err = new Error("Reimbursement not found.");
    err.statusCode = 404;
    throw err;
  }

  if (reimbursement.status === "REJECTED") {
    const err = new Error("Cannot update an already rejected reimbursement.");
    err.statusCode = 400;
    throw err;
  }

  if (reimbursement.status === "APPROVED") {
    const err = new Error("This reimbursement has already been fully approved.");
    err.statusCode = 400;
    throw err;
  }

  let updateData = {};

  if (status === "REJECTED") {
    updateData = { status: "REJECTED" };
  } else if (status === "APPROVED") {
    if (role === "RM") {
      // RM can only approve EMPs that report to them
      const assignment = await prisma.employeeAssignment.findFirst({
        where: { employeeId: reimbursement.employeeId, managerId: callerId },
      });
      if (!assignment) {
        const err = new Error("This EMP does not report to you.");
        err.statusCode = 403;
        throw err;
      }
      // RM approval: mark rmApproved, keep status PENDING (APE still needs to act)
      updateData = { rmApproved: true };
    } else if (role === "APE") {
      // APE can only approve after RM has approved
      if (!reimbursement.rmApproved) {
        const err = new Error("RM has not yet approved this reimbursement.");
        err.statusCode = 400;
        throw err;
      }
      // APE approval: mark apeApproved, set status to APPROVED
      updateData = { apeApproved: true, status: "APPROVED" };
    } else if (role === "CFO") {
      // CFO can approve anything directly
      updateData = { rmApproved: true, apeApproved: true, status: "APPROVED" };
    }
  }

  const updated = await prisma.reimbursement.update({
    where: { id: reimbursementId },
    data: updateData,
  });

  return fmt(updated);
};

module.exports = {
  createReimbursement,
  listReimbursements,
  listByUser,
  updateStatus,
};
