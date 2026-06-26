const { eq, and, inArray, desc } = require("drizzle-orm");
const { getDb } = require("../config/db");
const { appUsers, employeeAssignments, reimbursements } = require("../db/schema");

// ── Helper: format reimbursement for API response ─────────────────────────────
const fmt = (r) => ({
  id:          r.id,
  title:       r.title,
  description: r.description,
  amount:      r.amount,
  status:      r.status,
});

// ── Create reimbursement (EMP only) ──────────────────────────────────────────
const createReimbursement = async (employeeId, { title, description, amount }) => {
  const db = getDb();

  const [reimbursement] = await db
    .insert(reimbursements)
    .values({
      employeeId,
      title,
      description,
      amount:      parseFloat(amount),
      status:      "PENDING",
      rmApproved:  false,
      apeApproved: false,
    })
    .returning();

  return fmt(reimbursement);
};

// ── List reimbursements (role-filtered) ──────────────────────────────────────
/**
 * EMP  → their own (all statuses)
 * RM   → PENDING from their direct EMPs where RM hasn't acted yet (rmApproved=false)
 * APE  → RM-approved but APE hasn't acted yet (rmApproved=true, apeApproved=false, status=PENDING)
 * CFO  → APE-approved (apeApproved=true)
 */
const listReimbursements = async (requestingUser) => {
  const db = getDb();
  const { id, role } = requestingUser;

  let rows = [];

  if (role === "EMP") {
    rows = await db
      .select()
      .from(reimbursements)
      .where(eq(reimbursements.employeeId, id))
      .orderBy(desc(reimbursements.createdAt));
  } else if (role === "RM") {
    // Get EMP IDs under this RM
    const assignments = await db
      .select({ employeeId: employeeAssignments.employeeId })
      .from(employeeAssignments)
      .where(eq(employeeAssignments.managerId, id));

    const empIds = assignments.map((a) => a.employeeId);

    if (empIds.length === 0) return [];

    rows = await db
      .select()
      .from(reimbursements)
      .where(
        and(
          inArray(reimbursements.employeeId, empIds),
          eq(reimbursements.status, "PENDING"),
          eq(reimbursements.rmApproved, false)
        )
      )
      .orderBy(desc(reimbursements.createdAt));
  } else if (role === "APE") {
    rows = await db
      .select()
      .from(reimbursements)
      .where(
        and(
          eq(reimbursements.status, "PENDING"),
          eq(reimbursements.rmApproved, true),
          eq(reimbursements.apeApproved, false)
        )
      )
      .orderBy(desc(reimbursements.createdAt));
  } else if (role === "CFO") {
    rows = await db
      .select()
      .from(reimbursements)
      .where(eq(reimbursements.apeApproved, true))
      .orderBy(desc(reimbursements.createdAt));
  }

  return rows.map(fmt);
};

// ── List reimbursements for a specific user (subordinate check) ───────────────
/**
 * Caller must be RM/APE/CFO.
 * Target must be an EMP who is the caller's subordinate:
 *   RM  → must be one of their assigned EMPs
 *   APE/CFO → any EMP
 */
const listByUser = async (requestingUser, targetUserId) => {
  const db = getDb();
  const { id: callerId, role } = requestingUser;

  // Target must exist and be an EMP
  const [target] = await db
    .select()
    .from(appUsers)
    .where(eq(appUsers.id, targetUserId))
    .limit(1);

  if (!target || target.role !== "EMP") {
    const err = new Error("Target user not found or is not an EMP.");
    err.statusCode = 404;
    throw err;
  }

  // RM: check subordinate relationship
  if (role === "RM") {
    const [assignment] = await db
      .select()
      .from(employeeAssignments)
      .where(
        and(
          eq(employeeAssignments.employeeId, targetUserId),
          eq(employeeAssignments.managerId, callerId)
        )
      )
      .limit(1);

    if (!assignment) {
      const err = new Error("This EMP does not report to you.");
      err.statusCode = 403;
      throw err;
    }
  }
  // APE and CFO can view any EMP's reimbursements

  const rows = await db
    .select()
    .from(reimbursements)
    .where(eq(reimbursements.employeeId, targetUserId))
    .orderBy(desc(reimbursements.createdAt));

  return rows.map(fmt);
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
  const db = getDb();
  const { id: callerId, role } = requestingUser;

  if (!["APPROVED", "REJECTED"].includes(status)) {
    const err = new Error("Status must be APPROVED or REJECTED.");
    err.statusCode = 400;
    throw err;
  }

  const [reimbursement] = await db
    .select()
    .from(reimbursements)
    .where(eq(reimbursements.id, reimbursementId))
    .limit(1);

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
      const [assignment] = await db
        .select()
        .from(employeeAssignments)
        .where(
          and(
            eq(employeeAssignments.employeeId, reimbursement.employeeId),
            eq(employeeAssignments.managerId, callerId)
          )
        )
        .limit(1);

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

  const [updated] = await db
    .update(reimbursements)
    .set(updateData)
    .where(eq(reimbursements.id, reimbursementId))
    .returning();

  return fmt(updated);
};

module.exports = {
  createReimbursement,
  listReimbursements,
  listByUser,
  updateStatus,
};
