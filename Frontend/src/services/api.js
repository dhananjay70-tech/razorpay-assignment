import axios from "axios";

const api = axios.create({
  baseURL: "https://razorpay-assignment-v52p.onrender.com/rest",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});



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
