import { motion, AnimatePresence } from 'framer-motion'
import { X, AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react'

/**
 * Alert — dismissible alert messages with variants.
 */
export default function Alert({ variant = 'info', title, children, onClose, className = '' }) {
  const variants = {
    info: {
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/30',
      icon: 'text-blue-400',
      iconBg: 'bg-blue-500/20',
      Icon: Info,
    },
    success: {
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/30',
      icon: 'text-emerald-400',
      iconBg: 'bg-emerald-500/20',
      Icon: CheckCircle,
    },
    warning: {
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/30',
      icon: 'text-amber-400',
      iconBg: 'bg-amber-500/20',
      Icon: AlertTriangle,
    },
    error: {
      bg: 'bg-red-500/10',
      border: 'border-red-500/30',
      icon: 'text-red-400',
      iconBg: 'bg-red-500/20',
      Icon: AlertCircle,
    },
  }

  const config = variants[variant] || variants.info

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className={`
          relative flex items-start gap-3 p-4 rounded-xl border
          ${config.bg} ${config.border} ${className}
        `}
      >
        <div className={`flex-shrink-0 w-8 h-8 rounded-lg ${config.iconBg} flex items-center justify-center`}>
          <config.Icon size={16} className={config.icon} />
        </div>
        <div className="flex-1 min-w-0">
          {title && (
            <p className="text-sm font-semibold text-gray-200 mb-1">{title}</p>
          )}
          <div className="text-sm text-gray-400">
            {children}
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="flex-shrink-0 text-gray-500 hover:text-gray-300 transition-colors"
          >
            <X size={16} />
          </button>
        )}
      </motion.div>
    </AnimatePresence>
  )
}
