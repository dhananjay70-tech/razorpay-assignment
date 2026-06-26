const reimbursementService = require("../services/reimbursement.service");
const { success, error } = require("../utils/response");

// POST /rest/reimbursements  (EMP only)
const createReimbursement = async (req, res, next) => {
  try {
    const { title, description, amount } = req.body;
    if (!title || !description || amount === undefined) {
      return error(res, "title, description, and amount are required.", 400);
    }
    const reimbursement = await reimbursementService.createReimbursement(
      req.user.id,
      { title, description, amount }
    );
    return success(res, { reimbursement }, 201);
  } catch (err) {
    next(err);
  }
};

// GET /rest/reimbursements  (all roles — filtered by role)
const listReimbursements = async (req, res, next) => {
  try {
    const reimbursements = await reimbursementService.listReimbursements(req.user);
    return success(res, { reimbursements });
  } catch (err) {
    next(err);
  }
};

// GET /rest/reimbursements/:userId  (RM/APE/CFO — subordinate check)
const listByUser = async (req, res, next) => {
  try {
    const reimbursements = await reimbursementService.listByUser(
      req.user,
      req.params.userId
    );
    return success(res, { reimbursements });
  } catch (err) {
    next(err);
  }
};

// PATCH /rest/reimbursements  (RM / APE / CFO)
const updateReimbursement = async (req, res, next) => {
  try {
    const { reimbursementId, status } = req.body;
    if (!reimbursementId || !status) {
      return error(res, "reimbursementId and status are required.", 400);
    }
    const reimbursement = await reimbursementService.updateStatus(
      { reimbursementId, status },
      req.user
    );
    return success(res, { reimbursement });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createReimbursement,
  listReimbursements,
  listByUser,
  updateReimbursement,
};
