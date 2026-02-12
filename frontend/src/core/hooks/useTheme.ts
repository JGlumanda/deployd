import { useEffect } from 'react'
import { getTheme } from '@themes/registry'
import type { Theme } from '@core/types'

export function useTheme(themeName: string): Theme | null {
  const theme = getTheme(themeName)

  useEffect(() => {
    if (!theme) return

    const root = document.documentElement
    const { tokens } = theme

    // Apply color CSS variables
    Object.entries(tokens.colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${kebabCase(key)}`, value as string)
    })

    // Apply font CSS variables
    root.style.setProperty('--font-heading', tokens.fonts.heading)
    root.style.setProperty('--font-body', tokens.fonts.body)
    root.style.setProperty('--font-mono', tokens.fonts.mono)

    // Apply radius CSS variables
    Object.entries(tokens.radius).forEach(([key, value]) => {
      root.style.setProperty(`--radius-${key}`, value as string)
    })

    // Apply spacing CSS variables
    Object.entries(tokens.spacing).forEach(([key, value]) => {
      root.style.setProperty(`--spacing-${kebabCase(key)}`, value as string)
    })

    // Load Google Fonts
    const fontLinks: HTMLLinkElement[] = []
    if (tokens.fonts.googleFontsUrls) {
      tokens.fonts.googleFontsUrls.forEach((url: string) => {
        const link = document.createElement('link')
        link.rel = 'stylesheet'
        link.href = url
        link.setAttribute('data-theme-font', themeName)
        document.head.appendChild(link)
        fontLinks.push(link)
      })
    }

    // Cleanup function
    return () => {
      // Remove CSS variables
      const allVars = [
        ...Object.keys(tokens.colors).map((k) => `--color-${kebabCase(k)}`),
        '--font-heading',
        '--font-body',
        '--font-mono',
        ...Object.keys(tokens.radius).map((k) => `--radius-${k}`),
        ...Object.keys(tokens.spacing).map((k) => `--spacing-${kebabCase(k)}`),
      ]
      allVars.forEach((varName) => root.style.removeProperty(varName))

      // Remove font links
      fontLinks.forEach((link) => link.remove())
    }
  }, [theme, themeName])

  return theme || null
}

// Helper function to convert camelCase to kebab-case
function kebabCase(str: string): string {
  return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()
}
