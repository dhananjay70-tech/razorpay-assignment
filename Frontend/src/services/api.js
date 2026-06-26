import axios from 'axios'

/**
 * Axios instance configured for the backend.
 * - baseURL uses Vite proxy (/rest → http://localhost:7002/rest)
 * - withCredentials: true sends the httpOnly authToken cookie automatically
 */
const api = axios.create({
  baseURL: '/rest',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

// ── Response interceptor ─────────────────────────────────────────────────────
// Normalise error messages from { status:"error", message:"..." } shape
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      'Something went wrong. Please try again.'
    return Promise.reject(new Error(message))
  }
)

export default api
