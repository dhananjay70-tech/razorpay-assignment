import { motion } from 'framer-motion'

/**
 * Skeleton — loading placeholder with shimmer effect.
 */
export default function Skeleton({ className = '', variant = 'default' }) {
  const variants = {
    default: 'h-4 rounded',
    circle: 'rounded-full',
    text: 'h-4 rounded w-3/4',
    avatar: 'h-10 w-10 rounded-full',
    card: 'h-32 rounded-2xl',
  }

  return (
    <motion.div
      className={`
        bg-gray-800
        ${variants[variant] || variants.default}
        ${className}
      `}
      animate={{
        opacity: [0.4, 0.6, 0.4],
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  )
}
