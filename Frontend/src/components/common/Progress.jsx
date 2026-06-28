import { motion } from 'framer-motion'

/**
 * Progress — reusable progress bar with variants.
 */
export default function Progress({ value = 0, max = 100, size = 'md', color = 'indigo', className = '' }) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100)

  const sizes = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  }

  const colors = {
    indigo: 'bg-indigo-500',
    emerald: 'bg-emerald-500',
    amber: 'bg-amber-500',
    red: 'bg-red-500',
    violet: 'bg-violet-500',
  }

  return (
    <div className={`w-full bg-gray-800 rounded-full overflow-hidden ${sizes[size]} ${className}`}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className={`h-full rounded-full ${colors[color]}`}
      />
    </div>
  )
}
