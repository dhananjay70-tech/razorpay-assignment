import { forwardRef } from 'react'

/**
 * Textarea — reusable multi-line text input with label and error support.
 */
const Textarea = forwardRef(function Textarea(
  { label, error, className = '', rows = 4, ...props },
  ref
) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-sm font-medium text-gray-300">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        rows={rows}
        className={`
          w-full bg-gray-800 border rounded-xl px-4 py-2.5 text-sm text-gray-100
          placeholder:text-gray-500 transition-all duration-200 resize-y
          focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50
          disabled:opacity-50 disabled:cursor-not-allowed
          ${error ? 'border-red-500/50 focus:ring-red-500/50' : 'border-white/10 hover:border-white/20'}
          ${className}
        `}
        {...props}
      />
      {error && (
        <p className="text-xs text-red-400 flex items-center gap-1 mt-1">
          <span>⚠</span> {error}
        </p>
      )}
    </div>
  )
})

export default Textarea
