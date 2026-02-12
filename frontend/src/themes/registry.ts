import type { Theme } from '@core/types'

const registry = new Map<string, Theme>()

export function registerTheme(theme: Theme): void {
  registry.set(theme.name, theme)
}

export function getTheme(name: string): Theme | undefined {
  return registry.get(name)
}

export function getAllThemes(): Theme[] {
  return Array.from(registry.values())
}

export function getThemeNames(): string[] {
  return Array.from(registry.keys())
}
