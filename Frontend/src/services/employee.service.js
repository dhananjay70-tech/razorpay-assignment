import api from './api'

/**
 * Employee service — wraps /rest/employees endpoints
 */

/** GET /rest/employees — role-filtered list (RM/APE/CFO only) */
export const listEmployees = async () => {
  const res = await api.get('/employees')
  return res.data.data.users
}

/** POST /rest/employees/assign — CFO only */
export const assignEmployee = async ({ employeeId, managerId }) => {
  const res = await api.post('/employees/assign', { employeeId, managerId })
  return res.data.data.assignment
}

/** DELETE /rest/employees/assign — CFO only */
export const removeAssignment = async ({ employeeId, managerId }) => {
  const res = await api.delete('/employees/assign', {
    data: { employeeId, managerId },
  })
  return res.data.data
}
