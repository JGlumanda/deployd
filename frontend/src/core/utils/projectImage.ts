import type { Theme } from '@core/types'
import { generateGradient } from './gradient'

/**
 * Get project image style from theme or use defaults
 */
export function getProjectImageStyle(theme: Theme | null, title: string) {
  // If theme has custom project image style, use it
  if (theme?.projectImageStyle) {
    return theme.projectImageStyle
  }

  // Fallback to colorful gradient
  return {
    background: generateGradient(title),
    titleColor: 'rgba(255, 255, 255, 0.95)',
    titleShadow: '0 2px 8px rgba(0, 0, 0, 0.3)'
  }
}
