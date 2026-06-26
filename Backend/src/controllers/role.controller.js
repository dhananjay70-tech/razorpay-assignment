const roleService = require("../services/role.service");
const { success } = require("../utils/response");

// POST /rest/roles/assign  (CFO only)
const assignRole = async (req, res, next) => {
  try {
    const { userId, role } = req.body;
    const updated = await roleService.assignRole({ userId, role });
    return success(res, { user: updated });
  } catch (err) {
    next(err);
  }
};

module.exports = { assignRole };
