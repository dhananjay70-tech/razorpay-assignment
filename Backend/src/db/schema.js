/**
 * Drizzle ORM Schema — PostgreSQL
 *
 * Three models matching Prompt 2:
 *   • User (app_users)
 *   • EmployeeAssignment (employee_assignments)
 *   • Reimbursement (reimbursements)
 *
 * Two enums:
 *   • role               → EMP | RM | APE | CFO
 *   • reimbursement_status → PENDING | APPROVED | REJECTED
 *
 * Proper FK relations defined both at the column level (.references())
 * and via Drizzle's relations() API for the relational query builder.
 */

const {
  pgTable,
  pgEnum,
  uuid,
  text,
  boolean,
  doublePrecision,
  timestamp,
} = require("drizzle-orm/pg-core");

const { relations } = require("drizzle-orm");

// ── Enums ──────────────────────────────────────────────────────────────────────

/**
 * Role — every user has exactly one role.
 * EMP  = employee           (submits reimbursements)
 * RM   = reporting manager  (first-level approver)
 * APE  = accounts payable executive (second-level approver)
 * CFO  = chief financial officer (final approver / admin)
 */
const roleEnum = pgEnum("role", ["EMP", "RM", "APE", "CFO"]);

/**
 * ReimbursementStatus — tracks the overall approval state.
 * PENDING  → awaiting approval
 * APPROVED → fully approved (RM + APE, or CFO directly)
 * REJECTED → rejected at any stage
 */
const reimbursementStatusEnum = pgEnum("reimbursement_status", [
  "PENDING",
  "APPROVED",
  "REJECTED",
]);

// ── Tables ─────────────────────────────────────────────────────────────────────

/**
 * User — stores all users regardless of role.
 */
const appUsers = pgTable("app_users", {
  id:        uuid("id").defaultRandom().primaryKey(),
  name:      text("name").notNull(),
  email:     text("email").notNull().unique(),
  password:  text("password").notNull(),
  role:      roleEnum("role").default("EMP").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

/**
 * EmployeeAssignment — maps one EMP to one RM (unique employeeId enforces 1-to-1).
 * Both columns are FK references to app_users.
 */
const employeeAssignments = pgTable("employee_assignments", {
  id:         uuid("id").defaultRandom().primaryKey(),
  employeeId: uuid("employee_id")
    .notNull()
    .unique()
    .references(() => appUsers.id, { onDelete: "cascade" }),
  managerId:  uuid("manager_id")
    .notNull()
    .references(() => appUsers.id, { onDelete: "cascade" }),
});

/**
 * Reimbursement — a claim submitted by an EMP.
 * employeeId is a FK to app_users.
 * rmApproved / apeApproved track the two-stage approval workflow.
 */
const reimbursements = pgTable("reimbursements", {
  id:          uuid("id").defaultRandom().primaryKey(),
  title:       text("title").notNull(),
  description: text("description").notNull(),
  amount:      doublePrecision("amount").notNull(),
  status:      reimbursementStatusEnum("status").default("PENDING").notNull(),
  employeeId:  uuid("employee_id")
    .notNull()
    .references(() => appUsers.id, { onDelete: "cascade" }),
  rmApproved:  boolean("rm_approved").default(false).notNull(),
  apeApproved: boolean("ape_approved").default(false).notNull(),
  createdAt:   timestamp("created_at").defaultNow().notNull(),
});

// ── Relations (Drizzle relational query API) ──────────────────────────────────

/**
 * appUsers relations:
 *   • one user can have one assignment as EMP   (employeeAssignments.employeeId)
 *   • one user can manage many EMPs as RM       (employeeAssignments.managerId)
 *   • one user can have many reimbursements     (reimbursements.employeeId)
 */
const appUsersRelations = relations(appUsers, ({ one, many }) => ({
  assignmentAsEmployee: one(employeeAssignments, {
    fields:     [appUsers.id],
    references: [employeeAssignments.employeeId],
    relationName: "employee",
  }),
  assignedEmployees: many(employeeAssignments, {
    relationName: "manager",
  }),
  reimbursements: many(reimbursements),
}));

/**
 * employeeAssignments relations:
 *   • belongs to one EMP (the assigned employee)
 *   • belongs to one RM  (the reporting manager)
 */
const employeeAssignmentsRelations = relations(employeeAssignments, ({ one }) => ({
  employee: one(appUsers, {
    fields:       [employeeAssignments.employeeId],
    references:   [appUsers.id],
    relationName: "employee",
  }),
  manager: one(appUsers, {
    fields:       [employeeAssignments.managerId],
    references:   [appUsers.id],
    relationName: "manager",
  }),
}));

/**
 * reimbursements relations:
 *   • belongs to one EMP (the submitter)
 */
const reimbursementsRelations = relations(reimbursements, ({ one }) => ({
  employee: one(appUsers, {
    fields:     [reimbursements.employeeId],
    references: [appUsers.id],
  }),
}));

// ── Exports ───────────────────────────────────────────────────────────────────

module.exports = {
  // Enums
  roleEnum,
  reimbursementStatusEnum,
  // Tables
  appUsers,
  employeeAssignments,
  reimbursements,
  // Relations
  appUsersRelations,
  employeeAssignmentsRelations,
  reimbursementsRelations,
};
