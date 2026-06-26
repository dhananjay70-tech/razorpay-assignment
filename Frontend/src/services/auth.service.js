import api from './api'

/**
 * Auth service — wraps /rest/onboardings endpoints
 */

/** POST /rest/onboardings/register */
export const register = async ({ name, email, password }) => {
  const res = await api.post('/onboardings/register', { name, email, password })
  return res.data.data.user
}

/** POST /rest/onboardings/login — sets httpOnly cookie */
export const login = async ({ email, password }) => {
  const res = await api.post('/onboardings/login', { email, password })
  return res.data.data.user
}

/** POST /rest/onboardings/logout — clears cookie */
export const logout = async () => {
  const res = await api.post('/onboardings/logout')
  return res.data
}

/** GET /rest/onboardings/me — returns current user profile */
export const getMe = async () => {
  const res = await api.get('/onboardings/me')
  return res.data.data.user
}
