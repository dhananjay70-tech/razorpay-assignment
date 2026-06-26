import { motion } from 'framer-motion'
import { InboxIcon } from 'lucide-react'

/**
 * EmptyState — shown when a list/table has no data.
 */
export default function EmptyState({ title = 'No data found', description = '', icon: Icon = InboxIcon }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 text-center px-4"
    >
      <div className="relative mb-4">
        <div className="w-16 h-16 bg-gray-800/80 border border-white/10 rounded-2xl flex items-center justify-center">
          <Icon size={28} className="text-gray-600" />
        </div>
        {/* Subtle glow behind icon */}
        <div className="absolute inset-0 w-16 h-16 bg-indigo-500/5 rounded-2xl blur-xl" />
      </div>
      <h3 className="text-gray-300 font-semibold mb-1">{title}</h3>
      {description && <p className="text-gray-500 text-sm max-w-xs leading-relaxed">{description}</p>}
    </motion.div>
  )
}
