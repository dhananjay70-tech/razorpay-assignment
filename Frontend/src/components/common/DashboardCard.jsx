import { motion } from 'framer-motion'

/**
 * DashboardCard — animated stat card for dashboard overview sections.
 */
export default function DashboardCard({ title, value, subtitle, description, icon: Icon, color = 'indigo', index = 0 }) {
  const subtext = subtitle || description

  const colorMap = {
    indigo:  { bg: 'bg-indigo-500/10',  border: 'border-indigo-500/20',  icon: 'text-indigo-400',  glow: 'bg-indigo-500' },
    emerald: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', icon: 'text-emerald-400', glow: 'bg-emerald-500' },
    amber:   { bg: 'bg-amber-500/10',   border: 'border-amber-500/20',   icon: 'text-amber-400',   glow: 'bg-amber-500' },
    red:     { bg: 'bg-red-500/10',     border: 'border-red-500/20',     icon: 'text-red-400',     glow: 'bg-red-500' },
    violet:  { bg: 'bg-violet-500/10',  border: 'border-violet-500/20',  icon: 'text-violet-400',  glow: 'bg-violet-500' },
    blue:    { bg: 'bg-blue-500/10',    border: 'border-blue-500/20',    icon: 'text-blue-400',    glow: 'bg-blue-500' },
  }

  const c = colorMap[color] || colorMap.indigo

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className={`relative overflow-hidden rounded-2xl border ${c.border} ${c.bg} p-5 card-hover`}
    >
      {/* Subtle glow */}
      <div className={`absolute -top-8 -right-8 w-24 h-24 ${c.glow} opacity-10 rounded-full blur-2xl`} />

      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-400 text-sm font-medium mb-2">{title}</p>
          <p className="text-3xl font-bold text-white">{value}</p>
          {subtext && <p className="text-gray-500 text-xs mt-1">{subtext}</p>}
        </div>
        {Icon && (
          <div className={`w-11 h-11 rounded-xl ${c.bg} border ${c.border} flex items-center justify-center`}>
            <Icon size={20} className={c.icon} />
          </div>
        )}
      </div>
    </motion.div>
  )
}
