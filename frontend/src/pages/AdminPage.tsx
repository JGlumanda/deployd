import { useState, useEffect } from 'react'
import { useConfig } from '@core/hooks/useConfig'
import { useTheme } from '@core/hooks/useTheme'
import type { AppConfig } from '@core/types'
import AdminAuth from './admin/AdminAuth'
import AdminSidebar from './admin/AdminSidebar'
import ProjectsSection from './admin/ProjectsSection'
import ProfileSection from './admin/ProfileSection'
import ThemeSection from './admin/ThemeSection'
import SettingsSection from './admin/SettingsSection'

type Section = 'projects' | 'profile' | 'themes' | 'settings'

export default function AdminPage() {
  const { config, loading, error, save, reload } = useConfig()
  const [password, setPassword] = useState<string | null>(null)
  const [draftConfig, setDraftConfig] = useState<AppConfig | null>(null)
  const [activeSection, setActiveSection] = useState<Section>('projects')
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [hasChanges, setHasChanges] = useState(false)

  // Apply theme to admin panel (use saved config, not draft)
  useTheme(config?.theme.active || 'nordic')

  // Initialize draft config when config loads
  useEffect(() => {
    if (config) {
      setDraftConfig(structuredClone(config))
      setHasChanges(false)
    }
  }, [config])

  // Update draft and mark as changed
  const updateDraft = (updater: (draft: AppConfig) => void) => {
    if (!draftConfig) return
    const newDraft = structuredClone(draftConfig)
    updater(newDraft)
    setDraftConfig(newDraft)
    setHasChanges(true)
  }

  const handleSave = async () => {
    if (!draftConfig || !password) return

    setSaving(true)
    setSaveError(null)

    try {
      await save(draftConfig, password)
      setHasChanges(false)
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Fehler beim Speichern')
    } finally {
      setSaving(false)
    }
  }

  const handleDiscard = () => {
    if (!config) return
    if (hasChanges && !confirm('Alle Änderungen verwerfen?')) return
    setDraftConfig(structuredClone(config))
    setHasChanges(false)
    setSaveError(null)
  }

  const handleReset = () => {
    if (!config || !draftConfig) return

    const confirmed = confirm(
      'Möchtest du die Konfiguration wirklich zurücksetzen?\n\n' +
      'Dies wird löschen:\n' +
      '• Alle Projekte\n' +
      '• Profil-Informationen (Name, Bio, Avatar, Links)\n\n' +
      'Dies bleibt erhalten:\n' +
      '• Standard-Tags\n' +
      '• Theme-Einstellungen\n' +
      '• Weitere Einstellungen'
    )

    if (!confirmed) return

    // Create default config with only predefined tags and settings
    const resetConfig: AppConfig = {
      profile: {
        name: '',
        tagline: '',
        bio: '',
        avatar: null,
        links: {},
      },
      projects: [],
      theme: draftConfig.theme,
      settings: {
        ...draftConfig.settings,
        tags: {
          predefined: config.settings.tags.predefined, // Keep predefined tags
          custom: [], // Clear custom tags
        },
      },
    }

    setDraftConfig(resetConfig)
    setHasChanges(true)
  }

  // Show auth if not authenticated
  if (!password) {
    return <AdminAuth onAuthenticated={setPassword} />
  }

  // Show loading state
  if (loading || !draftConfig) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--color-bg)',
        fontFamily: 'var(--font-body)',
      }}>
        <p style={{ color: 'var(--color-text-muted)' }}>Laden...</p>
      </div>
    )
  }

  // Show error state
  if (error) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--color-bg)',
        fontFamily: 'var(--font-body)',
      }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: 'var(--color-error)', marginBottom: 16 }}>{error}</p>
          <button
            onClick={reload}
            style={{
              padding: '8px 20px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--color-accent)',
              color: 'var(--color-card)',
              border: 'none',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >Erneut versuchen</button>
        </div>
      </div>
    )
  }

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      background: 'var(--color-bg)',
      fontFamily: 'var(--font-body)',
    }}>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        /* Default input styling using theme variables */
        input, textarea, select, button { font-family: var(--font-body); }

        input[type="text"],
        input[type="password"],
        input[type="email"],
        input[type="url"],
        input[type="number"],
        textarea,
        select {
          background: var(--color-input-bg) !important;
          color: var(--color-input-text) !important;
          border: 1px solid var(--color-input-border) !important;
          border-radius: var(--radius-md) !important;
        }

        input[type="text"]::placeholder,
        input[type="password"]::placeholder,
        input[type="email"]::placeholder,
        input[type="url"]::placeholder,
        input[type="number"]::placeholder,
        textarea::placeholder {
          color: var(--color-input-placeholder) !important;
          opacity: 1 !important;
        }

        input[type="text"]:focus,
        input[type="password"]:focus,
        input[type="email"]:focus,
        input[type="url"]:focus,
        input[type="number"]:focus,
        textarea:focus,
        select:focus {
          outline: none !important;
          border-color: var(--color-input-border-focus) !important;
          box-shadow: 0 0 0 2px var(--color-accent-soft) !important;
        }

        /* Action buttons only - exclude theme cards and special buttons */
        button:not([style*="padding: 16px"]):not([style*="padding: 20px"]):not([style*="width: 100%"]) {
          font-family: var(--font-body);
        }

        /* Small action buttons (like Save, Load, Add, etc.) */
        button[style*="padding: 8px"],
        button[style*="padding: 12px"],
        .admin-sidebar button {
          background: var(--color-accent) !important;
          color: var(--color-card) !important;
        }

        /* Universal theming for ALL admin containers and elements */
        /* White backgrounds - catch all variations */
        main *[style*="background: #FFF"],
        main *[style*="background:#FFF"],
        main *[style*="background: rgb(255, 255, 255)"],
        main *[style*="background:rgb(255, 255, 255)"],
        main *[style*="background: white"],
        main *[style*="background:white"] {
          background: var(--color-card) !important;
        }

        /* Light beige/cream backgrounds */
        main *[style*="background: #F8F6F2"],
        main *[style*="background: #FAFAF7"],
        main *[style*="background: #F5F1EB"],
        main *[style*="background: rgb(248, 246, 242)"],
        main *[style*="background: rgb(250, 250, 247)"],
        main *[style*="background: rgb(245, 241, 235)"] {
          background: var(--color-bg-alt) !important;
        }

        /* Transparent backgrounds (for alternating rows) */
        main *[style*="background: transparent"] {
          background: transparent !important;
        }

        /* Text colors - dark headings */
        main *[style*="color: #2C3E50"],
        main *[style*="color: #1A1A1A"],
        main *[style*="color: #000"],
        main *[style*="color: rgb(44, 62, 80)"],
        main *[style*="color: rgb(26, 26, 26)"],
        main *[style*="color: rgb(0, 0, 0)"] {
          color: var(--color-heading) !important;
        }

        /* Text colors - muted/secondary text */
        main *[style*="color: #A0ADB8"],
        main *[style*="color: #999"],
        main *[style*="color: #888"],
        main *[style*="color: #777"],
        main *[style*="color: rgb(160, 173, 184)"],
        main *[style*="color: rgb(153, 153, 153)"],
        main *[style*="color: rgb(136, 136, 136)"] {
          color: var(--color-text-muted) !important;
        }

        /* Regular body text */
        main *[style*="color: #555"],
        main *[style*="color: #666"],
        main *[style*="color: rgb(85, 85, 85)"],
        main *[style*="color: rgb(102, 102, 102)"] {
          color: var(--color-text) !important;
        }

        /* Borders - catch all border colors */
        main *[style*="border"][style*="#E2DDD5"],
        main *[style*="border"][style*="#D4C9B8"],
        main *[style*="border"][style*="#DDD"],
        main *[style*="border"][style*="rgb(226, 221, 213)"],
        main *[style*="border"][style*="rgb(212, 201, 184)"] {
          border-color: var(--color-border) !important;
        }

        /* Ensure readable contrast for labels and small text */
        main label,
        main span[style*="fontSize: 11"],
        main span[style*="fontSize: 12"],
        main span[style*="fontSize: 13"] {
          color: var(--color-text) !important;
        }

        /* Strong emphasis text uses heading color */
        main strong,
        main b,
        main h1,
        main h2,
        main h3,
        main h4 {
          color: var(--color-heading) !important;
        }

        /* Ensure all paragraphs use body text color */
        main p {
          color: var(--color-text) !important;
        }

        /* Code blocks and inline code */
        main code {
          background: var(--color-bg-alt) !important;
          color: var(--color-text) !important;
        }

        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* Mobile responsive */
        @media (max-width: 767px) {
          .admin-layout { flex-direction: column; }
          .admin-sidebar { width: 100% !important; border-right: none !important; border-bottom: 1px solid var(--color-border); }
          .admin-main { padding: 20px 16px !important; max-width: 100% !important; }

          /* Responsive heading sizes */
          main h1 { font-size: 20px !important; }
          main h2 { font-size: 18px !important; }
          main h3 { font-size: 16px !important; }

          /* Header sections with buttons - wrap on mobile */
          main > div > div[style*="display: flex"][style*="justifyContent: space-between"] {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 12px !important;
          }

          /* Button groups - full width on mobile */
          main > div > div[style*="display: flex"][style*="justifyContent: space-between"] > div {
            width: 100% !important;
          }

          main > div > div[style*="display: flex"][style*="justifyContent: space-between"] > div button {
            flex: 1 !important;
          }

          /* Responsive forms - full width inputs */
          main input[type="text"],
          main input[type="email"],
          main input[type="url"],
          main input[type="number"],
          main input[type="password"],
          main textarea,
          main select {
            width: 100% !important;
            max-width: 100% !important;
            font-size: 16px !important; /* Prevents zoom on iOS */
          }

          /* Project list items - stack elements on mobile */
          main > div > div > div[style*="display: flex"][style*="alignItems: center"][style*="gap: 16px"] {
            flex-wrap: wrap !important;
            gap: 8px !important;
            padding: 12px 14px !important;
            position: relative !important;
          }

          /* Date field in project list - move to new line */
          main > div > div > div[style*="display: flex"][style*="alignItems: center"] > span[style*="fontFamily"][style*="Mono"] {
            order: 3 !important;
            width: 100% !important;
            margin-top: 4px !important;
          }

          /* Delete button in project list */
          main > div > div > div[style*="display: flex"][style*="alignItems: center"] > button:last-child {
            position: absolute !important;
            top: 8px !important;
            right: 8px !important;
          }

          /* Theme cards grid - single column on mobile */
          main > div > div[style*="grid"] {
            grid-template-columns: 1fr !important;
            gap: 12px !important;
          }

          /* Theme cards - reduce padding */
          main > div > div[style*="grid"] > button {
            padding: 16px !important;
          }

          /* GitHub import - responsive table */
          main table {
            display: block !important;
            overflow-x: auto !important;
            font-size: 12px !important;
          }

          /* Reduce general padding on mobile */
          main > div[style*="padding: 20px"],
          main > div[style*="padding: 24px"],
          main > div[style*="padding: 28px"] {
            padding: 16px !important;
          }

          main > div[style*="padding: 48px"] {
            padding: 24px !important;
          }

          /* Checkbox/Radio groups - better spacing */
          main div[style*="display: flex"][style*="flexDirection: column"] {
            gap: 12px !important;
          }

          /* Empty states - reduce padding */
          main > div > div[style*="textAlign: center"] {
            padding: 32px 16px !important;
          }
        }

        /* Tablet responsive */
        @media (min-width: 768px) and (max-width: 1024px) {
          .admin-main { padding: 24px 20px !important; }

          /* Theme cards - 2 columns on tablet */
          main > div > div[style*="grid"][style*="gridTemplateColumns"] {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
      `}</style>

      <div className="admin-layout" style={{ display: 'flex', flex: 1 }}>
        <AdminSidebar
          activeSection={activeSection}
          onSectionChange={setActiveSection}
          hasChanges={hasChanges}
          onSave={handleSave}
          onDiscard={handleDiscard}
          saving={saving}
          saveError={saveError}
        />

        <main className="admin-main" style={{
          flex: 1,
          padding: '32px 40px',
          maxWidth: 800,
          animation: 'fadeIn 0.4s ease',
        }}>
          {activeSection === 'projects' && (
            <ProjectsSection
              projects={draftConfig.projects}
              settings={draftConfig.settings}
              onUpdateProjects={(projects) => updateDraft(d => { d.projects = projects })}
            />
          )}

          {activeSection === 'profile' && (
            <ProfileSection
              profile={draftConfig.profile}
              onUpdateProfile={(profile) => updateDraft(d => { d.profile = profile })}
            />
          )}

          {activeSection === 'themes' && (
            <ThemeSection
              activeTheme={draftConfig.theme.active}
              onSelectTheme={(themeName) => updateDraft(d => { d.theme.active = themeName })}
            />
          )}

          {activeSection === 'settings' && (
            <SettingsSection
              settings={draftConfig.settings}
              projects={draftConfig.projects}
              onUpdateSettings={(settings) => updateDraft(d => { d.settings = settings })}
              onReset={handleReset}
            />
          )}
        </main>
      </div>
    </div>
  )
}
