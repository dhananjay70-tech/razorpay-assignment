const { error } = require("../utils/response");

/** Only CFO can proceed */
const isCFO = (req, res, next) => {
  if (req.user?.role !== "CFO") {
    return error(res, "Forbidden — CFO access required.", 403);
  }
  next();
};

/** Only EMP can proceed */
const isEMP = (req, res, next) => {
  if (req.user?.role !== "EMP") {
    return error(res, "Forbidden — EMP access required.", 403);
  }
  next();
};

/** EMP is NOT allowed; RM, APE, CFO can proceed */
const isNotEMP = (req, res, next) => {
  if (req.user?.role === "EMP") {
    return error(res, "Forbidden — EMP cannot access this endpoint.", 403);
  }
  next();
};

/** RM, APE, or CFO — anyone who can act on reimbursements */
const canActOnReimbursement = (req, res, next) => {
  const allowed = ["RM", "APE", "CFO"];
  if (!allowed.includes(req.user?.role)) {
    return error(res, "Forbidden — insufficient role.", 403);
  }
  next();
};

module.exports = { isCFO, isEMP, isNotEMP, canActOnReimbursement };
