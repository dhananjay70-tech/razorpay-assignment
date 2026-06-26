import { Menu, Sun, Moon, Bell } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { useTheme } from '../../hooks/useTheme'

const ROLE_LABEL = {
  EMP: 'Employee Portal',
  RM:  'Manager Portal',
  APE: 'Accounts Portal',
  CFO: 'CFO Admin Portal',
}

const ROLE_COLORS = {
  EMP: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  RM:  'bg-blue-500/20 text-blue-400 border-blue-500/30',
  APE: 'bg-violet-500/20 text-violet-400 border-violet-500/30',
  CFO: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
}

export default function Topbar({ onMenuClick, onMobileMenuClick }) {
  const { user } = useAuth()
  const { isDark, toggleTheme } = useTheme()

  return (
    <header className="flex-shrink-0 h-16 bg-gray-900 border-b border-white/10 flex items-center justify-between px-4 lg:px-6">
      {/* ── Left: Menu toggle + page title ─────────────────────────────── */}
      <div className="flex items-center gap-4">
        {/* Desktop collapse button */}
        <button
          id="sidebar-toggle-desktop"
          onClick={onMenuClick}
          className="hidden lg:flex items-center justify-center w-8 h-8 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-all"
          aria-label="Toggle sidebar"
        >
          <Menu size={18} />
        </button>

        {/* Mobile burger */}
        <button
          id="sidebar-toggle-mobile"
          onClick={onMobileMenuClick}
          className="flex lg:hidden items-center justify-center w-8 h-8 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-all"
          aria-label="Open menu"
        >
          <Menu size={18} />
        </button>

        <div>
          <h2 className="text-white font-semibold text-sm">
            {ROLE_LABEL[user?.role] || 'Dashboard'}
          </h2>
          <p className="text-gray-500 text-xs hidden sm:block">
            Welcome back, {user?.name?.split(' ')[0]}
          </p>
        </div>
      </div>

      {/* ── Right: actions ──────────────────────────────────────────────── */}
      <div className="flex items-center gap-2">
        {/* Role badge */}
        <span className={`hidden sm:inline-flex text-xs font-semibold px-2.5 py-1 rounded-full border ${ROLE_COLORS[user?.role]}`}>
          {user?.role}
        </span>

        {/* Theme toggle */}
        <button
          id="theme-toggle"
          onClick={toggleTheme}
          className="flex items-center justify-center w-8 h-8 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-all"
          aria-label="Toggle theme"
        >
          {isDark ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        {/* Notification bell (decorative) */}
        <button
          id="notifications-btn"
          className="flex items-center justify-center w-8 h-8 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-all relative"
          aria-label="Notifications"
        >
          <Bell size={16} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-indigo-500 rounded-full" />
        </button>

        {/* Avatar */}
        <div className="w-8 h-8 gradient-primary rounded-full flex items-center justify-center text-white text-xs font-bold ml-1">
          {user?.name?.[0]?.toUpperCase() || 'U'}
        </div>
      </div>
    </header>
  )
}
