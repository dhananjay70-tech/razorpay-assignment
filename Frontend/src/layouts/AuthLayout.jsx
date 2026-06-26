import { Outlet } from 'react-router-dom'
import { motion } from 'framer-motion'

/**
 * AuthLayout — wraps Login and Register pages with a split-screen design.
 * Left: branding panel   Right: form
 */
export default function AuthLayout() {
  return (
    <div className="min-h-screen flex">
      {/* ── Left branding panel ─────────────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-1/2 gradient-primary flex-col justify-between p-12 relative overflow-hidden">
        {/* Background circles decoration */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-white/5 rounded-full" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-white/5 rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/5 rounded-full" />

        {/* Logo */}
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">R</span>
            </div>
            <span className="text-white font-bold text-xl">ReimburseFlow</span>
          </div>
        </div>

        {/* Hero text */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10"
        >
          <h1 className="text-4xl font-bold text-white leading-tight mb-4">
            Streamline your<br />
            <span className="text-white/80">reimbursement</span><br />
            workflow.
          </h1>
          <p className="text-white/70 text-lg leading-relaxed">
            Multi-stage approval, real-time tracking, and role-based access
            — all in one platform.
          </p>

          {/* Stats */}
          <div className="mt-10 grid grid-cols-3 gap-6">
            {[
              { label: 'Faster Approvals', value: '3×' },
              { label: 'Accuracy Rate', value: '99%' },
              { label: 'Time Saved / Month', value: '40h' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-bold text-white">{stat.value}</div>
                <div className="text-white/60 text-sm mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Footer */}
        <div className="relative z-10 text-white/40 text-sm">
          © {new Date().getFullYear()} ReimburseFlow · Enterprise Edition
        </div>
      </div>

      {/* ── Right form panel ────────────────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center p-6 bg-gray-950">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-3 mb-10 justify-center">
            <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">R</span>
            </div>
            <span className="text-white font-bold text-xl">ReimburseFlow</span>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Outlet />
          </motion.div>
        </div>
      </div>
    </div>
  )
}
