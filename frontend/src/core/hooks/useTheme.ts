import { useEffect, useRef } from 'react'
import { getTheme } from '@themes/registry'
import type { Theme } from '@core/types'

// Track the currently active theme globally
let currentGlobalTheme: string | null = null
let currentFontLinks: HTMLLinkElement[] = []

export function useTheme(themeName: string): Theme | null {
  const theme = getTheme(themeName)
  const isFirstRender = useRef(true)

  useEffect(() => {
    if (!theme) return

    // Only update if theme actually changed globally
    if (currentGlobalTheme === themeName && !isFirstRender.current) {
      return
    }

    const root = document.documentElement
    const { tokens } = theme

    // Remove old font links if theme changed
    if (currentGlobalTheme !== themeName) {
      currentFontLinks.forEach((link) => link.remove())
      currentFontLinks = []
    }

    // Apply color CSS variables (including input colors)
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

    // Load Google Fonts (only if not already loaded)
    if (tokens.fonts.googleFontsUrls) {
      tokens.fonts.googleFontsUrls.forEach((url: string) => {
        // Check if this font URL is already loaded
        const existing = Array.from(document.head.querySelectorAll('link[rel="stylesheet"]'))
          .find((link) => (link as HTMLLinkElement).href === url)

        if (!existing) {
          const link = document.createElement('link')
          link.rel = 'stylesheet'
          link.href = url
          link.setAttribute('data-theme-font', themeName)
          document.head.appendChild(link)
          currentFontLinks.push(link)
        }
      })
    }

    currentGlobalTheme = themeName
    isFirstRender.current = false
  }, [theme, themeName])

  return theme || null
}

// Helper function to convert camelCase to kebab-case
function kebabCase(str: string): string {
  return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()
}
