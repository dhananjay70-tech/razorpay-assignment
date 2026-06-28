import { motion } from 'framer-motion'

/**
 * Tabs — reusable tab navigation with animated indicator.
 */
export default function Tabs({ tabs, activeTab, onChange, className = '' }) {
  return (
    <div className={`border-b border-white/10 ${className}`}>
      <div className="flex gap-1 relative">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id
          
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={`
                relative px-4 py-2.5 text-sm font-medium transition-colors
                ${isActive ? 'text-indigo-400' : 'text-gray-400 hover:text-gray-300'}
              `}
            >
              {tab.label}
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500"
                  initial={false}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
