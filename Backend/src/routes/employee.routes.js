const express = require("express");
const router = express.Router();
const employeeController = require("../controllers/employee.controller");
const { verifyToken } = require("../middleware/auth.middleware");
const { isCFO, isNotEMP } = require("../middleware/role.middleware");

// GET /rest/employees  — RM sees their EMPs, APE sees all EMPs+RMs, CFO sees all
router.get("/", verifyToken, isNotEMP, employeeController.listEmployees);

// POST /rest/employees/assign  — CFO only
router.post("/assign", verifyToken, isCFO, employeeController.assignEmployee);

// DELETE /rest/employees/assign  — CFO only
router.delete("/assign", verifyToken, isCFO, employeeController.removeAssignment);

module.exports = router;
