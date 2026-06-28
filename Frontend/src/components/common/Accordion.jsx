import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

/**
 * Accordion — collapsible content sections with smooth animations.
 */
export default function Accordion({ items, defaultOpen = 0, allowMultiple = false, className = '' }) {
  const [openItems, setOpenItems] = useState(
    defaultOpen !== null ? (allowMultiple ? [defaultOpen] : defaultOpen) : []
  )

  const toggleItem = (index) => {
    if (allowMultiple) {
      setOpenItems(prev =>
        prev.includes(index)
          ? prev.filter(i => i !== index)
          : [...prev, index]
      )
    } else {
      setOpenItems(prev => prev === index ? -1 : index)
    }
  }

  const isOpen = (index) => {
    return allowMultiple ? openItems.includes(index) : openItems === index
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {items.map((item, index) => (
        <div key={index} className="border border-white/10 rounded-xl overflow-hidden bg-gray-900/50">
          <button
            onClick={() => toggleItem(index)}
            className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-white/5 transition-colors"
          >
            <span className="text-sm font-medium text-gray-300">{item.title}</span>
            <motion.div
              animate={{ rotate: isOpen(index) ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown size={16} className="text-gray-500" />
            </motion.div>
          </button>
          <AnimatePresence>
            {isOpen(index) && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="px-4 pb-3 text-sm text-gray-400">
                  {item.content}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  )
}
