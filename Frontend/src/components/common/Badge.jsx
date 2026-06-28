/**
 * Badge — generic badge component with variants.
 */
export default function Badge({ children, variant = 'default', size = 'md', className = '' }) {
  const variants = {
    default: 'bg-gray-800 text-gray-300 border border-white/10',
    primary: 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30',
    success: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
    warning: 'bg-amber-500/20 text-amber-400 border border-amber-500/30',
    danger: 'bg-red-500/20 text-red-400 border border-red-500/30',
  }

  const sizes = {
    xs: 'text-xs px-1.5 py-0.5',
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-1',
    lg: 'text-base px-3 py-1.5',
  }

  return (
    <span className={`
      inline-flex items-center rounded-full font-medium
      ${variants[variant]} ${sizes[size]} ${className}
    `}>
      {children}
    </span>
  )
}
