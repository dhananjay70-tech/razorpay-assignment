import api from './api'

/**
 * Role service — wraps /rest/roles endpoints
 * CFO only
 */

/** POST /rest/roles/assign — assign/change a user's role */
export const assignRole = async ({ userId, role }) => {
  const res = await api.post('/roles/assign', { userId, role })
  return res.data.data.user
}
