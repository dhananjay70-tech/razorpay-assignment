import { forwardRef } from 'react'

/**
 * Radio — reusable radio button with label support.
 */
const Radio = forwardRef(function Radio(
  { label, error, className = '', ...props },
  ref
) {
  return (
    <div className="space-y-1.5">
      <label className="flex items-center gap-3 cursor-pointer group">
        <div className="relative">
          <input
            type="radio"
            ref={ref}
            className="sr-only peer"
            {...props}
          />
          <div className={`
            w-5 h-5 rounded-full border-2 transition-all duration-200 flex items-center justify-center
            peer-checked:border-indigo-500 peer-checked:bg-indigo-500/10
            ${error ? 'border-red-500/50' : 'border-gray-600 peer-hover:border-indigo-500/50'}
            ${className}
          `}>
            <div className="w-2 h-2 rounded-full bg-indigo-500 opacity-0 peer-checked:opacity-100 transition-opacity" />
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

export default Radio
