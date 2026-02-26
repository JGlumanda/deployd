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
import MediaSection from './admin/MediaSection'

type Section = 'projects' | 'profile' | 'themes' | 'media' | 'settings'

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

  // Update document title for admin
  useEffect(() => {
    if (config?.profile.name) {
      document.title = `Admin - ${config.profile.name}`
    } else {
      document.title = 'Admin - deployd'
    }
  }, [config?.profile.name])

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
      setSaveError(err instanceof Error ? err.message : 'Error saving')
    } finally {
      setSaving(false)
    }
  }

  const handleDiscard = () => {
    if (!config) return
    if (hasChanges && !confirm('Discard all changes?')) return
    setDraftConfig(structuredClone(config))
    setHasChanges(false)
    setSaveError(null)
  }

  const handleReset = () => {
    if (!config || !draftConfig) return

    const confirmed = confirm(
      'Do you really want to reset the configuration?\n\n' +
      'This will delete:\n' +
      '• All projects\n' +
      '• Profile information (name, bio, avatar, links)\n\n' +
      'This will be retained:\n' +
      '• Standard tags\n' +
      '• Theme settings\n' +
      '• Other settings'
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
      <div className="min-h-screen flex items-center justify-center bg-bg font-body">
        <p className="text-text-muted">Loading...</p>
      </div>
    )
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg font-body">
        <div className="text-center">
          <p className="text-error mb-4">{error}</p>
          <button
            onClick={reload}
            className="px-5 py-2 rounded-md bg-accent text-card border-none text-[13px] font-semibold cursor-pointer"
          >Try Again</button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-bg font-body">
      <div className="flex flex-1 flex-col md:flex-row">
        <AdminSidebar
          activeSection={activeSection}
          onSectionChange={setActiveSection}
          hasChanges={hasChanges}
          onSave={handleSave}
          onDiscard={handleDiscard}
          saving={saving}
          saveError={saveError}
        />

        <main className="flex-1 px-4 py-5 md:px-10 md:py-8 max-w-[800px] animate-fade-in">
          {activeSection === 'projects' && (
            <ProjectsSection
              projects={draftConfig.projects}
              settings={draftConfig.settings}
              onUpdateProjects={(projects) => updateDraft(d => { d.projects = projects })}
              password={password ?? undefined}
            />
          )}

          {activeSection === 'profile' && (
            <ProfileSection
              profile={draftConfig.profile}
              settings={draftConfig.settings}
              onUpdateProfile={(profile) => updateDraft(d => { d.profile = profile })}
              onNavigateToSettings={() => setActiveSection('settings')}
              password={password ?? undefined}
            />
          )}

          {activeSection === 'themes' && (
            <ThemeSection
              activeTheme={draftConfig.theme.active}
              onSelectTheme={(themeName) => updateDraft(d => { d.theme.active = themeName })}
            />
          )}

          {activeSection === 'media' && (
            <MediaSection
              password={password ?? undefined}
              draftConfig={draftConfig}
            />
          )}

          {activeSection === 'settings' && (
            <SettingsSection
              settings={draftConfig.settings}
              projects={draftConfig.projects}
              onUpdateSettings={(settings) => updateDraft(d => { d.settings = settings })}
              onReset={handleReset}
              password={password ?? undefined}
            />
          )}
        </main>
      </div>
    </div>
  )
}
