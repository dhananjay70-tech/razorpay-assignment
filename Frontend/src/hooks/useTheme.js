import { useTheme as useThemeContext } from '../theme/ThemeProvider'

/**
 * useTheme — hook to access theme context
 */
export function useTheme() {
  return useThemeContext()
}
