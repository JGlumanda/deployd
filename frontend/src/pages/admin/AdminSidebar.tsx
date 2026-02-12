type Section = 'projects' | 'profile' | 'themes' | 'settings'

interface AdminSidebarProps {
  activeSection: Section
  onSectionChange: (section: Section) => void
  hasChanges: boolean
  onSave: () => void
  onDiscard: () => void
  saving: boolean
  saveError: string | null
}

const sections = [
  { id: 'projects' as const, label: 'Projekte', icon: '◫' },
  { id: 'profile' as const, label: 'Profil', icon: '◉' },
  { id: 'themes' as const, label: 'Theme', icon: '◆' },
  { id: 'settings' as const, label: 'Einstellungen', icon: '⚙' },
]

export default function AdminSidebar({
  activeSection,
  onSectionChange,
  hasChanges,
  onSave,
  onDiscard,
  saving,
  saveError,
}: AdminSidebarProps) {

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="admin-sidebar desktop-sidebar" style={{
        width: 220,
        background: '#FFFFFF',
        borderRight: '1px solid #E2DDD5',
        padding: '32px 0',
        display: 'flex',
        flexDirection: 'column',
      }}>
        <div style={{ padding: '0 24px', marginBottom: 32 }}>
          <h2 style={{
            fontSize: 18,
            fontWeight: 700,
            color: '#2C3E50',
            fontFamily: "'Libre Baskerville', serif",
            marginBottom: 2,
          }}>Admin</h2>
          <p style={{
            fontSize: 11,
            color: '#A0ADB8',
            fontFamily: "'IBM Plex Mono', monospace",
          }}>Project Showcase</p>
        </div>

        <nav>
          {sections.map(s => (
            <button
              key={s.id}
              onClick={() => onSectionChange(s.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                width: '100%',
                padding: '10px 24px',
                border: 'none',
                cursor: 'pointer',
                background: activeSection === s.id ? '#6B8FA30E' : 'transparent',
                borderRight: activeSection === s.id ? '2px solid #6B8FA3' : '2px solid transparent',
                color: activeSection === s.id ? '#2C3E50' : '#A0ADB8',
                fontSize: 13,
                fontWeight: activeSection === s.id ? 600 : 500,
                transition: 'all 0.2s',
                textAlign: 'left',
              }}
            >
              <span style={{ fontSize: 14, opacity: 0.7 }}>{s.icon}</span> {s.label}
            </button>
          ))}
        </nav>

        <div style={{ flex: 1 }} />

        {/* Save/Discard Buttons */}
        <div style={{ padding: '0 24px' }}>
          {saveError && (
            <p style={{
              fontSize: 11,
              color: '#D4A0A0',
              marginBottom: 12,
              lineHeight: 1.4,
            }}>{saveError}</p>
          )}

          {hasChanges && (
            <button
              onClick={onDiscard}
              disabled={saving}
              style={{
                width: '100%',
                padding: '8px 16px',
                borderRadius: 8,
                background: 'transparent',
                color: '#A0ADB8',
                border: '1px solid #E2DDD5',
                fontSize: 12,
                fontWeight: 600,
                cursor: saving ? 'not-allowed' : 'pointer',
                marginBottom: 8,
                opacity: saving ? 0.5 : 1,
              }}
            >Verwerfen</button>
          )}

          <button
            onClick={onSave}
            disabled={!hasChanges || saving}
            style={{
              width: '100%',
              padding: '10px 16px',
              borderRadius: 8,
              background: hasChanges ? '#6B8FA3' : '#E2DDD5',
              color: hasChanges ? '#FFF' : '#A0ADB8',
              border: 'none',
              fontSize: 13,
              fontWeight: 600,
              cursor: hasChanges && !saving ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
            }}
          >
            {saving ? (
              <>
                <span style={{
                  width: 12,
                  height: 12,
                  border: '2px solid #FFF4',
                  borderTopColor: '#FFF',
                  borderRadius: '50%',
                  animation: 'spin 0.6s linear infinite',
                  display: 'inline-block',
                }} />
                Speichern...
              </>
            ) : (
              'Speichern'
            )}
          </button>
        </div>
      </aside>

      {/* Mobile Tabs */}
      <div className="mobile-tabs" style={{
        display: 'none',
        background: '#FFFFFF',
        borderBottom: '1px solid #E2DDD5',
        overflowX: 'auto',
      }}>
        <style>{`
          @media (max-width: 767px) {
            .desktop-sidebar { display: none !important; }
            .mobile-tabs { display: block !important; }
          }
        `}</style>

        <div style={{
          display: 'flex',
          padding: '12px 16px',
          gap: 8,
        }}>
          {sections.map(s => (
            <button
              key={s.id}
              onClick={() => onSectionChange(s.id)}
              style={{
                padding: '8px 16px',
                borderRadius: 8,
                border: activeSection === s.id ? '1px solid #6B8FA3' : '1px solid #E2DDD5',
                background: activeSection === s.id ? '#6B8FA30E' : '#FFF',
                color: activeSection === s.id ? '#6B8FA3' : '#A0ADB8',
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <span>{s.icon}</span>
              <span>{s.label}</span>
            </button>
          ))}
        </div>

        {/* Mobile save button */}
        {hasChanges && (
          <div style={{
            padding: '0 16px 12px',
            display: 'flex',
            gap: 8,
          }}>
            <button
              onClick={onDiscard}
              disabled={saving}
              style={{
                flex: 1,
                padding: '8px 16px',
                borderRadius: 8,
                background: 'transparent',
                color: '#A0ADB8',
                border: '1px solid #E2DDD5',
                fontSize: 12,
                fontWeight: 600,
                cursor: saving ? 'not-allowed' : 'pointer',
                opacity: saving ? 0.5 : 1,
              }}
            >Verwerfen</button>

            <button
              onClick={onSave}
              disabled={saving}
              style={{
                flex: 2,
                padding: '8px 16px',
                borderRadius: 8,
                background: '#6B8FA3',
                color: '#FFF',
                border: 'none',
                fontSize: 12,
                fontWeight: 600,
                cursor: saving ? 'not-allowed' : 'pointer',
              }}
            >
              {saving ? 'Speichern...' : 'Speichern'}
            </button>
          </div>
        )}

        {saveError && (
          <p style={{
            fontSize: 11,
            color: '#D4A0A0',
            padding: '0 16px 12px',
            lineHeight: 1.4,
          }}>{saveError}</p>
        )}
      </div>
    </>
  )
}
