import { forwardRef } from 'react'

/**
 * Switch — toggle switch component with label support.
 */
const Switch = forwardRef(function Switch(
  { label, error, className = '', ...props },
  ref
) {
  return (
    <div className="space-y-1.5">
      <label className="flex items-center gap-3 cursor-pointer group">
        <div className="relative">
          <input
            type="checkbox"
            ref={ref}
            className="sr-only peer"
            {...props}
          />
          <div className={`
            w-11 h-6 rounded-full transition-all duration-200
            peer-checked:bg-indigo-500
            ${error ? 'bg-red-500/30' : 'bg-gray-700'}
            ${className}
          `}>
            <div className={`
              absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow-sm
              transition-all duration-200
              peer-checked:translate-x-5
            `} />
          </div>
        </div>
        {label && (
          <span className="text-sm text-gray-300 group-hover:text-gray-100 transition-colors">
            {label}
          </span>
        )}
      </label>
      {error && (
        <p className="text-xs text-red-400 flex items-center gap-1 mt-1">
          <span>⚠</span> {error}
        </p>
      )}
    </div>
  )
})

export default Switch
