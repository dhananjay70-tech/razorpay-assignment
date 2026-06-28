import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, MoreVertical } from 'lucide-react'

/**
 * Dropdown — reusable dropdown menu with trigger and items.
 */
export default function Dropdown({ 
  trigger, 
  items, 
  align = 'right',
  variant = 'button',
  className = '' 
}) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const alignments = {
    left: 'left-0',
    right: 'right-0',
    center: 'left-1/2 -translate-x-1/2',
  }

  return (
    <div ref={dropdownRef} className={`relative inline-block ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center justify-center"
      >
        {variant === 'icon' ? (
          <div className="p-2 rounded-lg hover:bg-white/10 transition-colors text-gray-400 hover:text-white">
            <MoreVertical size={18} />
          </div>
        ) : variant === 'chevron' ? (
          <span className="flex items-center gap-2 text-gray-400 hover:text-white">
            {trigger}
            <ChevronDown size={16} className={isOpen ? 'rotate-180' : ''} />
          </span>
        ) : (
          trigger
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -5 }}
            transition={{ duration: 0.15 }}
            className={`
              absolute z-50 mt-2 w-48 bg-gray-900 border border-white/10 rounded-xl
              shadow-xl overflow-hidden
              ${alignments[align]}
            `}
          >
            <div className="py-1">
              {items.map((item, index) => (
                <button
                  key={index}
                  onClick={() => {
                    item.onClick?.()
                    setIsOpen(false)
                  }}
                  disabled={item.disabled}
                  className={`
                    w-full px-4 py-2 text-left text-sm transition-colors flex items-center gap-3
                    ${item.disabled 
                      ? 'text-gray-600 cursor-not-allowed' 
                      : item.danger 
                        ? 'text-red-400 hover:bg-red-500/10' 
                        : 'text-gray-300 hover:bg-white/5'
                    }
                  `}
                >
                  {item.icon && <item.icon size={16} />}
                  {item.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
