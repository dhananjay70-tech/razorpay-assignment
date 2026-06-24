/**
 * Standardised response helpers.
 * Shape expected by the assignment tester:
 *   success → { status: "success", data: { ... } }
 *   error   → { status: "error",   message: "..." }
 */

const success = (res, data, statusCode = 200) =>
  res.status(statusCode).json({ status: "success", data });

const error = (res, message, statusCode = 400) =>
  res.status(statusCode).json({ status: "error", message });

module.exports = { success, error };
