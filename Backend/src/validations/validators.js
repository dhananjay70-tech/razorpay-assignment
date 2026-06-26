/**
 * Request body validators — thin helpers that check required fields
 * and return a 400 error if any are missing.
 *
 * Pattern: call validate(req.body, ['field1', 'field2'])
 * Returns: { valid: true } | { valid: false, message: string }
 */

/**
 * Validate that all required keys are present and non-empty in an object.
 * @param {object} body - The request body.
 * @param {string[]} fields - Field names that must be present.
 * @returns {{ valid: boolean, message?: string }}
 */
const validate = (body, fields) => {
  const missing = fields.filter(
    (f) => body[f] === undefined || body[f] === null || body[f] === ""
  );
  if (missing.length > 0) {
    return {
      valid: false,
      message: `Missing required fields: ${missing.join(", ")}.`,
    };
  }
  return { valid: true };
};

// ── Pre-built validators for each resource ────────────────────────────────────

const validateRegister = (body) => validate(body, ["name", "email", "password"]);
const validateLogin    = (body) => validate(body, ["email", "password"]);
const validateAssignRole = (body) => validate(body, ["userId", "role"]);
const validateAssignEmployee = (body) => validate(body, ["employeeId", "managerId"]);
const validateReimbursement  = (body) => validate(body, ["title", "description", "amount"]);
const validateReimbursementStatus = (body) => validate(body, ["reimbursementId", "status"]);

module.exports = {
  validate,
  validateRegister,
  validateLogin,
  validateAssignRole,
  validateAssignEmployee,
  validateReimbursement,
  validateReimbursementStatus,
};
