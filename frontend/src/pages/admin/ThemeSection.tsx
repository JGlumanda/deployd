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
      <h1 style={{
        fontSize: 24,
        fontWeight: 700,
        color: 'var(--color-heading)',
        fontFamily: "'Libre Baskerville', serif",
        marginBottom: 8,
      }}>Theme</h1>

      <p style={{
        fontSize: 13,
        color: 'var(--color-text-muted)',
        marginBottom: 28,
      }}>Choose the look of your showcase page.</p>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: 16,
      }}>
        {themes.map((theme: Theme) => {
          const isActive = theme.name === activeTheme
          const accentColor = theme.tokens.colors.accent

          return (
            <button
              key={theme.name}
              onClick={() => onSelectTheme(theme.name)}
              style={{
                padding: 20,
                background: 'var(--color-card)',
                border: isActive ? `2px solid ${accentColor}` : '1px solid var(--color-border)',
                borderRadius: 12,
                cursor: 'pointer',
                transition: 'all 0.2s',
                textAlign: 'left',
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.boxShadow = '0 4px 16px rgba(44,62,80,0.1)'
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              {/* Color bars preview */}
              <div style={{ display: 'flex', gap: 4, marginBottom: 12 }}>
                <div style={{
                  width: 32,
                  height: 6,
                  borderRadius: 3,
                  background: accentColor,
                }} />
                <div style={{
                  width: 16,
                  height: 6,
                  borderRadius: 3,
                  background: accentColor,
                  opacity: 0.4,
                }} />
                <div style={{
                  width: 8,
                  height: 6,
                  borderRadius: 3,
                  background: accentColor,
                  opacity: 0.2,
                }} />
              </div>

              <h3 style={{
                fontSize: 15,
                fontWeight: 700,
                color: 'var(--color-heading)',
                fontFamily: "'Libre Baskerville', serif",
                marginBottom: 4,
              }}>{theme.displayName}</h3>

              <p style={{
                fontSize: 12,
                color: 'var(--color-text-muted)',
                lineHeight: 1.4,
                marginBottom: 8,
              }}>{theme.description}</p>

              {isActive && (
                <span style={{
                  display: 'inline-block',
                  fontSize: 10,
                  fontWeight: 700,
                  color: accentColor,
                  fontFamily: "'IBM Plex Mono', monospace",
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                }}>Active</span>
              )}
            </button>
          )
        })}
      </div>

      {themes.length === 0 && (
        <div style={{
          padding: 48,
          textAlign: 'center',
          background: '#FFF',
          border: '1px solid var(--color-border)',
          borderRadius: 12,
        }}>
          <p style={{ fontSize: 14, color: '#A0ADB8' }}>
            No themes available.
          </p>
        </div>
      )}
    </div>
  )
}
