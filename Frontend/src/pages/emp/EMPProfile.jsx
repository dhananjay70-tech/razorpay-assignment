import { motion } from 'framer-motion'
import { User, Mail, Shield, Calendar } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import StatusBadge from '../../components/common/StatusBadge'

export default function EMPProfile() {
  const { user } = useAuth()

  const fields = [
    { label: 'Full Name',     value: user?.name,      icon: User     },
    { label: 'Email',         value: user?.email,     icon: Mail     },
    { label: 'Role',          value: user?.role,      icon: Shield, isRole: true },
    {
      label: 'Member Since',
      value: user?.createdAt
        ? new Date(user.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })
        : '—',
      icon: Calendar,
    },
  ]

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-white">Profile</h1>
        <p className="text-gray-400 text-sm mt-1">Your account information.</p>
      </motion.div>

      {/* ── Profile card ───────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gray-900 border border-white/10 rounded-2xl overflow-hidden"
      >
        {/* Avatar banner */}
        <div className="gradient-primary h-24 relative" />
        <div className="px-6 pb-6">
          <div className="-mt-10 mb-4">
            <div className="w-20 h-20 gradient-primary rounded-2xl flex items-center justify-center text-white text-3xl font-bold border-4 border-gray-900 shadow-xl">
              {user?.name?.[0]?.toUpperCase()}
            </div>
          </div>
          <h2 className="text-xl font-bold text-white">{user?.name}</h2>
          <p className="text-gray-400 text-sm">{user?.email}</p>
        </div>

        {/* Fields */}
        <div className="border-t border-white/10 divide-y divide-white/5">
          {fields.map(({ label, value, icon: Icon, isRole }) => (
            <div key={label} className="flex items-center gap-4 px-6 py-4">
              <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center flex-shrink-0">
                <Icon size={15} className="text-gray-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-gray-500 text-xs">{label}</p>
                {isRole ? (
                  <StatusBadge status={value} size="sm" />
                ) : (
                  <p className="text-white text-sm font-medium truncate">{value}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ── Info notice ────────────────────────────────────────────────── */}
      <p className="text-center text-gray-600 text-xs">
        To update your profile or change your role, contact your system administrator.
      </p>
    </div>
  )
}
