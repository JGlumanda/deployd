import { cn } from '@core/utils/cn'
import { getAllThemes } from '@themes/registry'
import type { Theme } from '@core/types'

interface ThemeSectionProps {
  activeTheme: string
  onSelectTheme: (themeName: string) => void
}

export default function ThemeSection({ activeTheme, onSelectTheme }: ThemeSectionProps) {
  const themes = getAllThemes()

  return (
    <div>
      <h1 className="text-2xl font-bold text-heading font-heading mb-2">Theme</h1>

      <p className="text-[13px] text-text-muted mb-7">Choose the look of your showcase page.</p>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4">
        {themes.map((theme: Theme) => {
          const isActive = theme.name === activeTheme
          const accentColor = theme.tokens.colors.accent

          return (
            <button
              key={theme.name}
              onClick={() => onSelectTheme(theme.name)}
              className={cn(
                'p-5 bg-card rounded-xl cursor-pointer transition-all duration-200 text-left',
                isActive ? 'border-none' : 'border border-border hover:shadow-lg'
              )}
              style={isActive ? { border: `2px solid ${accentColor}` } : undefined}
            >
              {/* Color bars preview */}
              <div className="flex gap-1 mb-3">
                <div
                  className="w-8 h-1.5 rounded-sm"
                  style={{ background: accentColor }}
                />
                <div
                  className="w-4 h-1.5 rounded-sm opacity-40"
                  style={{ background: accentColor }}
                />
                <div
                  className="w-2 h-1.5 rounded-sm opacity-20"
                  style={{ background: accentColor }}
                />
              </div>

              <h3 className="text-[15px] font-bold text-heading font-heading mb-1">{theme.displayName}</h3>

              <p className="text-xs text-text-muted leading-snug mb-2">{theme.description}</p>

              {isActive && (
                <span
                  className="inline-block text-[10px] font-bold font-mono tracking-wider uppercase"
                  style={{ color: accentColor }}
                >Active</span>
              )}
            </button>
          )
        })}
      </div>

      {themes.length === 0 && (
        <div className="p-12 text-center bg-card border border-border rounded-xl">
          <p className="text-sm text-text-muted">
            No themes available.
          </p>
        </div>
      )}
    </div>
  )
}
