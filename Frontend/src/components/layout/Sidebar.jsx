import { NavLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, FileText, PlusCircle, Users, CheckSquare,
  UserCheck, BarChart2, Shield, LogOut,
} from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import toast from 'react-hot-toast'

// ── Navigation config per role ────────────────────────────────────────────────
const NAV_CONFIG = {
  EMP: [
    { to: '/emp/dashboard',      label: 'Dashboard',         icon: LayoutDashboard },
    { to: '/emp/raise',          label: 'Raise Request',     icon: PlusCircle },
    { to: '/emp/reimbursements', label: 'My Reimbursements', icon: FileText },
    { to: '/emp/profile',        label: 'Profile',           icon: UserCheck },
  ],
  RM: [
    { to: '/rm/dashboard',      label: 'Dashboard',             icon: LayoutDashboard },
    { to: '/rm/employees',      label: 'My Employees',          icon: Users },
    { to: '/rm/reimbursements', label: 'Pending Approvals',     icon: CheckSquare },
  ],
  APE: [
    { to: '/ape/dashboard', label: 'Dashboard',        icon: LayoutDashboard },
    { to: '/ape/approvals', label: 'Pending Approvals', icon: CheckSquare },
  ],
  CFO: [
    { to: '/cfo/dashboard',        label: 'Dashboard',         icon: LayoutDashboard },
    { to: '/cfo/employees',        label: 'All Employees',      icon: Users },
    { to: '/cfo/assign-roles',     label: 'Assign Roles',       icon: Shield },
    { to: '/cfo/assign-employees', label: 'Assign Employees',   icon: UserCheck },
    { to: '/cfo/reports',          label: 'Reports',            icon: BarChart2 },
  ],
}

// Role badge colors
const ROLE_COLORS = {
  EMP: 'bg-emerald-500/20 text-emerald-400',
  RM:  'bg-blue-500/20 text-blue-400',
  APE: 'bg-violet-500/20 text-violet-400',
  CFO: 'bg-amber-500/20 text-amber-400',
}

export default function Sidebar({ role, collapsed, mobileOpen, onMobileClose }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const navItems = NAV_CONFIG[role] || []

  const handleLogout = async () => {
    try {
      await logout()
      toast.success('Logged out successfully')
      navigate('/login', { replace: true })
    } catch {
      toast.error('Failed to logout')
    }
  }

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* ── Logo ─────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-white/10">
        <div className="w-9 h-9 gradient-primary rounded-xl flex items-center justify-center flex-shrink-0">
          <span className="text-white font-bold text-base">R</span>
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              className="text-white font-bold text-base whitespace-nowrap overflow-hidden"
            >
              ReimburseFlow
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* ── User info ─────────────────────────────────────────────────── */}
      <div className={`px-4 py-4 border-b border-white/10 ${collapsed ? 'flex justify-center' : ''}`}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 gradient-primary rounded-full flex items-center justify-center flex-shrink-0 font-semibold text-white text-sm">
            {user?.name?.[0]?.toUpperCase() || 'U'}
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="min-w-0 overflow-hidden"
              >
                <p className="text-white text-sm font-medium truncate">{user?.name}</p>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${ROLE_COLORS[user?.role]}`}>
                  {user?.role}
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── Nav items ─────────────────────────────────────────────────── */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onMobileClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group ${
                isActive
                  ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30'
                  : 'text-gray-400 hover:text-gray-100 hover:bg-white/5'
              } ${collapsed ? 'justify-center' : ''}`
            }
            title={collapsed ? label : undefined}
          >
            {({ isActive }) => (
              <>
                <Icon size={18} className={`flex-shrink-0 ${isActive ? 'text-indigo-400' : 'text-gray-500 group-hover:text-gray-300'}`} />
                <AnimatePresence>
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-sm font-medium whitespace-nowrap overflow-hidden"
                    >
                      {label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* ── Logout ────────────────────────────────────────────────────── */}
      <div className="px-3 py-4 border-t border-white/10">
        <button
          onClick={handleLogout}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 ${collapsed ? 'justify-center' : ''}`}
          title={collapsed ? 'Logout' : undefined}
        >
          <LogOut size={18} className="flex-shrink-0" />
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-sm font-medium whitespace-nowrap overflow-hidden"
              >
                Logout
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* ── Desktop Sidebar ─────────────────────────────────────────── */}
      <motion.aside
        animate={{ width: collapsed ? 64 : 240 }}
        transition={{ duration: 0.25, ease: 'easeInOut' }}
        className="hidden lg:flex flex-col flex-shrink-0 bg-gray-900 border-r border-white/10 overflow-hidden"
      >
        {sidebarContent}
      </motion.aside>

      {/* ── Mobile Sidebar ──────────────────────────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="fixed left-0 top-0 h-full w-60 flex flex-col bg-gray-900 border-r border-white/10 z-40 lg:hidden"
          >
            {sidebarContent}
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  )
}
