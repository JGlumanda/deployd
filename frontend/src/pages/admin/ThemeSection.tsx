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
        color: '#2C3E50',
        fontFamily: "'Libre Baskerville', serif",
        marginBottom: 8,
      }}>Theme</h1>

      <p style={{
        fontSize: 13,
        color: '#A0ADB8',
        marginBottom: 28,
      }}>Wähle das Aussehen deiner Showcase-Seite.</p>

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
                background: '#FFF',
                border: isActive ? `2px solid ${accentColor}` : '1px solid #E2DDD5',
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
                color: '#2C3E50',
                fontFamily: "'Libre Baskerville', serif",
                marginBottom: 4,
              }}>{theme.displayName}</h3>

              <p style={{
                fontSize: 12,
                color: '#A0ADB8',
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
                }}>Aktiv</span>
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
          border: '1px solid #E2DDD5',
          borderRadius: 12,
        }}>
          <p style={{ fontSize: 14, color: '#A0ADB8' }}>
            Keine Themes verfügbar.
          </p>
        </div>
      )}
    </div>
  )
}
