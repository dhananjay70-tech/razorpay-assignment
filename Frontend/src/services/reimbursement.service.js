import api from './api'

/**
 * Reimbursement service — wraps /rest/reimbursements endpoints
 */

/** POST /rest/reimbursements — EMP only */
export const createReimbursement = async ({ title, description, amount }) => {
  const res = await api.post('/reimbursements', { title, description, amount })
  return res.data.data.reimbursement
}

/** GET /rest/reimbursements — role-filtered list */
export const listReimbursements = async () => {
  const res = await api.get('/reimbursements')
  return res.data.data.reimbursements
}

/** GET /rest/reimbursements/:userId — view specific user's reimbursements (RM/APE/CFO) */
export const listByUser = async (userId) => {
  const res = await api.get(`/reimbursements/${userId}`)
  return res.data.data.reimbursements
}

/** PATCH /rest/reimbursements — approve or reject (RM/APE/CFO) */
export const updateReimbursementStatus = async ({ reimbursementId, status }) => {
  const res = await api.patch('/reimbursements', { reimbursementId, status })
  return res.data.data.reimbursement
}
