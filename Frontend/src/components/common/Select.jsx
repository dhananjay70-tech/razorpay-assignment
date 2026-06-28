import { forwardRef } from 'react'
import { ChevronDown } from 'lucide-react'

/**
 * Select — reusable dropdown select with label, error, and icon support.
 */
const Select = forwardRef(function Select(
  { label, error, icon: Icon, children, className = '', ...props },
  ref
) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-sm font-medium text-gray-300">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
            <Icon size={16} />
          </div>
        )}
        <select
          ref={ref}
          className={`
            w-full bg-gray-800 border rounded-xl px-4 py-2.5 text-sm text-gray-100
            appearance-none cursor-pointer transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50
            disabled:opacity-50 disabled:cursor-not-allowed
            ${Icon ? 'pl-10' : ''}
            pr-10
            ${error ? 'border-red-500/50 focus:ring-red-500/50' : 'border-white/10 hover:border-white/20'}
            ${className}
          `}
          {...props}
        >
          {children}
        </select>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
          <ChevronDown size={16} />
        </div>
      </div>
      {error && (
        <p className="text-xs text-red-400 flex items-center gap-1 mt-1">
          <span>⚠</span> {error}
        </p>
      )}
    </div>
  )
})

export default Select
