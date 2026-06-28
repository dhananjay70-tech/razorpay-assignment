import { motion } from 'framer-motion'

/**
 * Card — reusable card component with optional hover effect.
 */
export default function Card({ children, hover = false, className = '', ...props }) {
  return (
    <motion.div
      whileHover={hover ? { y: -2 } : {}}
      className={`
        bg-gray-900 border border-white/10 rounded-2xl overflow-hidden
        ${hover ? 'card-hover' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </motion.div>
  )
}
