import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

// Layouts
import AuthLayout from '../layouts/AuthLayout'
import DashboardLayout from '../layouts/DashboardLayout'

// Auth pages
import LoginPage from '../pages/auth/LoginPage'
import RegisterPage from '../pages/auth/RegisterPage'

// EMP pages
import EMPDashboard from '../pages/emp/EMPDashboard'
import RaiseReimbursement from '../pages/emp/RaiseReimbursement'
import MyReimbursements from '../pages/emp/MyReimbursements'
import EMPProfile from '../pages/emp/EMPProfile'

// RM pages
import RMDashboard from '../pages/rm/RMDashboard'
import MyEmployees from '../pages/rm/MyEmployees'
import PendingReimbursements from '../pages/rm/PendingReimbursements'

// APE pages
import APEDashboard from '../pages/ape/APEDashboard'
import PendingApprovals from '../pages/ape/PendingApprovals'

// CFO pages
import CFODashboard from '../pages/cfo/CFODashboard'
import AllEmployees from '../pages/cfo/AllEmployees'
import AssignRoles from '../pages/cfo/AssignRoles'
import AssignEmployees from '../pages/cfo/AssignEmployees'
import Reports from '../pages/cfo/Reports'

// Loading spinner
import Loader from '../components/common/Loader'

// ── Role redirect map ─────────────────────────────────────────────────────────
const ROLE_HOME = {
  EMP: '/emp/dashboard',
  RM:  '/rm/dashboard',
  APE: '/ape/dashboard',
  CFO: '/cfo/dashboard',
}

// ── Protected Route wrapper ───────────────────────────────────────────────────
function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth()

  if (loading) return <Loader fullScreen />

  if (!user) return <Navigate to="/login" replace />

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={ROLE_HOME[user.role] || '/login'} replace />
  }

  return children
}

// ── Auth Guard (redirect logged-in users away from login/register) ────────────
function AuthGuard({ children }) {
  const { user, loading } = useAuth()

  if (loading) return <Loader fullScreen />

  if (user) return <Navigate to={ROLE_HOME[user.role] || '/login'} replace />

  return children
}

// ── App Router ────────────────────────────────────────────────────────────────
export default function AppRouter() {
  return (
    <Routes>
      {/* ── Root redirect ─────────────────────────────── */}
      <Route path="/" element={<RootRedirect />} />

      {/* ── Auth routes ───────────────────────────────── */}
      <Route element={<AuthGuard><AuthLayout /></AuthGuard>}>
        <Route path="/login"    element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      {/* ── EMP routes ───────────────────────────────── */}
      <Route
        path="/emp"
        element={
          <ProtectedRoute allowedRoles={['EMP']}>
            <DashboardLayout role="EMP" />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard"         element={<EMPDashboard />} />
        <Route path="raise"             element={<RaiseReimbursement />} />
        <Route path="reimbursements"    element={<MyReimbursements />} />
        <Route path="profile"           element={<EMPProfile />} />
        <Route index element={<Navigate to="dashboard" replace />} />
      </Route>

      {/* ── RM routes ────────────────────────────────── */}
      <Route
        path="/rm"
        element={
          <ProtectedRoute allowedRoles={['RM']}>
            <DashboardLayout role="RM" />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard"      element={<RMDashboard />} />
        <Route path="employees"      element={<MyEmployees />} />
        <Route path="reimbursements" element={<PendingReimbursements />} />
        <Route index element={<Navigate to="dashboard" replace />} />
      </Route>

      {/* ── APE routes ───────────────────────────────── */}
      <Route
        path="/ape"
        element={
          <ProtectedRoute allowedRoles={['APE']}>
            <DashboardLayout role="APE" />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<APEDashboard />} />
        <Route path="approvals" element={<PendingApprovals />} />
        <Route index element={<Navigate to="dashboard" replace />} />
      </Route>

      {/* ── CFO routes ───────────────────────────────── */}
      <Route
        path="/cfo"
        element={
          <ProtectedRoute allowedRoles={['CFO']}>
            <DashboardLayout role="CFO" />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard"        element={<CFODashboard />} />
        <Route path="employees"        element={<AllEmployees />} />
        <Route path="assign-roles"     element={<AssignRoles />} />
        <Route path="assign-employees" element={<AssignEmployees />} />
        <Route path="reports"          element={<Reports />} />
        <Route index element={<Navigate to="dashboard" replace />} />
      </Route>

      {/* ── Catch-all ────────────────────────────────── */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

// Root redirect based on auth state
function RootRedirect() {
  const { user, loading } = useAuth()
  if (loading) return <Loader fullScreen />
  if (!user)   return <Navigate to="/login" replace />
  return <Navigate to={ROLE_HOME[user.role] || '/login'} replace />
}
