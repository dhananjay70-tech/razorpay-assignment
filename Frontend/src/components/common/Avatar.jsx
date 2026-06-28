/**
 * Avatar — user avatar with fallback initials and size variants.
 */
export default function Avatar({ src, alt, name, size = 'md', className = '' }) {
  const initials = name
    ? name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'U'

  const sizes = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg',
  }

  return (
    <div className={`
      rounded-full flex items-center justify-center font-semibold text-white
      gradient-primary flex-shrink-0 overflow-hidden
      ${sizes[size]} ${className}
    `}>
      {src ? (
        <img src={src} alt={alt || name} className="w-full h-full object-cover" />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  )
}
