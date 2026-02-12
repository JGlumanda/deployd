import { useState, useEffect } from 'react'
import { useConfig } from '@core/hooks/useConfig'
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
        background: '#F5F1EB',
        fontFamily: "'Karla', sans-serif",
      }}>
        <p style={{ color: '#A0ADB8' }}>Laden...</p>
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
        background: '#F5F1EB',
        fontFamily: "'Karla', sans-serif",
      }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: '#D4A0A0', marginBottom: 16 }}>{error}</p>
          <button
            onClick={reload}
            style={{
              padding: '8px 20px',
              borderRadius: 8,
              background: '#6B8FA3',
              color: '#FFF',
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
      background: '#F5F1EB',
      fontFamily: "'Karla', sans-serif",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:wght@400;700&family=Karla:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        input, textarea, select, button { font-family: 'Karla', sans-serif; }
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
            />
          )}
        </main>
      </div>
    </div>
  )
}
