/**
 * Divider — visual separator with optional label.
 */
export default function Divider({ label, className = '' }) {
  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <div className="flex-1 h-px bg-white/10" />
      {label && (
        <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">
          {label}
        </span>
      )}
      <div className="flex-1 h-px bg-white/10" />
    </div>
  )
}
