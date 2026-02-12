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
          background: var(--color-card);
          color: var(--color-text);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
        }

        input[type="text"]:focus,
        input[type="password"]:focus,
        input[type="email"]:focus,
        input[type="url"]:focus,
        input[type="number"]:focus,
        textarea:focus,
        select:focus {
          outline: 2px solid var(--color-accent-soft);
          border-color: var(--color-accent);
        }

        button {
          background: var(--color-accent);
          color: var(--color-card);
          border: none;
          border-radius: var(--radius-md);
        }

        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* Mobile responsive */
        @media (max-width: 767px) {
          .admin-layout { flex-direction: column; }
          .admin-sidebar { width: 100% !important; border-right: none !important; border-bottom: 1px solid #E2DDD5; }
          .admin-main { padding: 20px 16px !important; }
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
