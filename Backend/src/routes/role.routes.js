const express = require("express");
const router = express.Router();
const roleController = require("../controllers/role.controller");
const { verifyToken } = require("../middleware/auth.middleware");
const { isCFO } = require("../middleware/role.middleware");

// POST /rest/roles/assign  — CFO only
router.post("/assign", verifyToken, isCFO, roleController.assignRole);

module.exports = router;
