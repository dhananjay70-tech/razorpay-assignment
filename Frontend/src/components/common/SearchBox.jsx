import { Search } from 'lucide-react'

/**
 * SearchBox — search input with icon and clear button.
 */
export default function SearchBox({ value, onChange, placeholder = 'Search...', className = '' }) {
  return (
    <div className={`relative ${className}`}>
      <Search
        size={15}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
      />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="
          w-full bg-gray-800 border border-white/10 rounded-xl
          pl-9 pr-4 py-2 text-sm text-gray-100 placeholder:text-gray-500
          focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50
          hover:border-white/20 transition-all duration-200
        "
      />
    </div>
  )
}
