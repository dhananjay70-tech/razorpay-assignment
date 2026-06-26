const express = require("express");
const router = express.Router();
const reimbursementController = require("../controllers/reimbursement.controller");
const { verifyToken } = require("../middleware/auth.middleware");
const { isEMP, isNotEMP, canActOnReimbursement } = require("../middleware/role.middleware");

// POST /rest/reimbursements  — EMP only
router.post("/", verifyToken, isEMP, reimbursementController.createReimbursement);

// GET /rest/reimbursements  — all roles (filtered by role in service)
router.get("/", verifyToken, reimbursementController.listReimbursements);

// PATCH /rest/reimbursements  — RM / APE / CFO only (not EMP)
router.patch("/", verifyToken, canActOnReimbursement, reimbursementController.updateReimbursement);

// GET /rest/reimbursements/:userId  — RM / APE / CFO (subordinate check in service)
router.get("/:userId", verifyToken, isNotEMP, reimbursementController.listByUser);

module.exports = router;
