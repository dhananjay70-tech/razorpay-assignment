import { motion } from 'framer-motion'

/**
 * Button — reusable button with variants, sizes, and loading state.
 */
export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  className = '',
  ...props
}) {
  const base = 'inline-flex items-center justify-center gap-2 font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 disabled:opacity-50 disabled:cursor-not-allowed'

  const variants = {
    primary:   'gradient-primary text-white hover:opacity-90 shadow-lg shadow-indigo-500/20',
    secondary: 'bg-gray-800 text-gray-200 hover:bg-gray-700 border border-white/10',
    danger:    'bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30',
    success:   'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border border-emerald-500/30',
    ghost:     'text-gray-400 hover:text-white hover:bg-white/10',
    outline:   'border border-indigo-500/50 text-indigo-400 hover:bg-indigo-500/10',
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  }

  return (
    <motion.button
      whileTap={{ scale: disabled || loading ? 1 : 0.97 }}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {children}
    </motion.button>
  )
}
