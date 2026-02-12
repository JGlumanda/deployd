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
        background: 'var(--color-card)',
        borderRight: '1px solid var(--color-border)',
        padding: 'var(--spacing-section) 0',
        display: 'flex',
        flexDirection: 'column',
      }}>
        <div style={{ padding: '0 24px', marginBottom: 32 }}>
          <h2 style={{
            fontSize: 18,
            fontWeight: 700,
            color: 'var(--color-text)',
            fontFamily: 'var(--font-heading)',
            marginBottom: 2,
          }}>Admin</h2>
          <p style={{
            fontSize: 11,
            color: 'var(--color-text-muted)',
            fontFamily: 'var(--font-mono)',
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
                background: activeSection === s.id ? 'var(--color-accent-soft)' : 'transparent',
                borderRight: activeSection === s.id ? '2px solid var(--color-accent)' : '2px solid transparent',
                color: activeSection === s.id ? 'var(--color-text)' : 'var(--color-text-muted)',
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
              color: 'var(--color-error)',
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
                borderRadius: 'var(--radius-md)',
                background: 'transparent',
                color: 'var(--color-text-muted)',
                border: '1px solid var(--color-border)',
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
              borderRadius: 'var(--radius-md)',
              background: hasChanges ? 'var(--color-accent)' : 'var(--color-border)',
              color: hasChanges ? 'var(--color-card)' : 'var(--color-text-muted)',
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
                  border: '2px solid currentColor',
                  borderTopColor: 'transparent',
                  borderRadius: '50%',
                  animation: 'spin 0.6s linear infinite',
                  display: 'inline-block',
                  opacity: 0.4,
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
        background: 'var(--color-card)',
        borderBottom: '1px solid var(--color-border)',
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
                borderRadius: 'var(--radius-md)',
                border: activeSection === s.id ? '1px solid var(--color-accent)' : '1px solid var(--color-border)',
                background: activeSection === s.id ? 'var(--color-accent-soft)' : 'var(--color-card)',
                color: activeSection === s.id ? 'var(--color-accent)' : 'var(--color-text-muted)',
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
                borderRadius: 'var(--radius-md)',
                background: 'transparent',
                color: 'var(--color-text-muted)',
                border: '1px solid var(--color-border)',
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
                borderRadius: 'var(--radius-md)',
                background: 'var(--color-accent)',
                color: 'var(--color-card)',
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
            color: 'var(--color-error)',
            padding: '0 16px 12px',
            lineHeight: 1.4,
          }}>{saveError}</p>
        )}
      </div>
    </>
  )
}
