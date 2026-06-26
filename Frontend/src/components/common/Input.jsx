import { forwardRef } from 'react'

/**
 * Input — reusable form input with label, error, icon, and optional right-side element support.
 */
const Input = forwardRef(function Input(
  { label, error, icon: Icon, rightElement, id, className = '', ...props },
  ref
) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-300">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
            <Icon size={16} />
          </div>
        )}
        <input
          ref={ref}
          id={id}
          className={`
            w-full bg-gray-800 border rounded-xl px-4 py-2.5 text-sm text-gray-100
            placeholder:text-gray-500 transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50
            disabled:opacity-50 disabled:cursor-not-allowed
            ${Icon ? 'pl-10' : ''}
            ${rightElement ? 'pr-10' : ''}
            ${error ? 'border-red-500/50 focus:ring-red-500/50' : 'border-white/10 hover:border-white/20'}
            ${className}
          `}
          {...props}
        />
        {rightElement && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {rightElement}
          </div>
        )}
      </div>
      {error && (
        <p className="text-xs text-red-400 flex items-center gap-1 mt-1">
          <span>⚠</span> {error}
        </p>
      )}
    </div>
  )
})

export default Input
