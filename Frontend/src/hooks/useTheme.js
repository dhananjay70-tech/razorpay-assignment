import { useState } from 'react'

/**
 * useTheme — manages dark/light mode toggle via body class
 */
export function useTheme() {
  const [isDark, setIsDark] = useState(() => {
    return !document.body.classList.contains('light')
  })

  const toggleTheme = () => {
    if (isDark) {
      document.body.classList.add('light')
      setIsDark(false)
    } else {
      document.body.classList.remove('light')
      setIsDark(true)
    }
  }

  return { isDark, toggleTheme }
}
