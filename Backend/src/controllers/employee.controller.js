const employeeService = require("../services/employee.service");
const { success } = require("../utils/response");

// GET /rest/employees
const listEmployees = async (req, res, next) => {
  try {
    const users = await employeeService.listEmployees(req.user);
    return success(res, { users });
  } catch (err) {
    next(err);
  }
};

// POST /rest/employees/assign  (CFO only)
const assignEmployee = async (req, res, next) => {
  try {
    const { employeeId, managerId } = req.body;
    const assignment = await employeeService.assignEmployee({ employeeId, managerId });
    return success(res, { assignment }, 201);
  } catch (err) {
    next(err);
  }
};

// DELETE /rest/employees/assign  (CFO only)
const removeAssignment = async (req, res, next) => {
  try {
    const { employeeId, managerId } = req.body;
    const result = await employeeService.removeAssignment({ employeeId, managerId });
    return success(res, result);
  } catch (err) {
    next(err);
  }
};

module.exports = { listEmployees, assignEmployee, removeAssignment };
