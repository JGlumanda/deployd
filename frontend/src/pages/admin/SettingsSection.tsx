import { useState } from 'react'
import { cn } from '@core/utils/cn'
import type { Settings, Project, Tag } from '@core/types'

interface SettingsSectionProps {
  settings: Settings
  projects: Project[]
  onUpdateSettings: (settings: Settings) => void
  onReset: () => void
}

export default function SettingsSection({ settings, projects, onUpdateSettings, onReset }: SettingsSectionProps) {
  const [githubToken, setGithubToken] = useState('')
  const [descriptionMaxChars, setDescriptionMaxChars] = useState(settings.cardDescriptionMaxChars)
  const [tagSearch, setTagSearch] = useState('')

  const updateSetting = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    onUpdateSettings({ ...settings, [key]: value })
  }

  const updateHealthCheck = <K extends keyof Settings['healthCheck']>(
    key: K,
    value: Settings['healthCheck'][K]
  ) => {
    onUpdateSettings({
      ...settings,
      healthCheck: { ...settings.healthCheck, [key]: value },
    })
  }

  const addTag = () => {
    const name = prompt('Tag Name:')
    if (!name || !name.trim()) return

    const trimmed = name.trim()
    const allTags = [...settings.tags.predefined, ...settings.tags.custom]
    if (allTags.some(t => t.name === trimmed)) {
      alert('Tag already exists')
      return
    }

    onUpdateSettings({
      ...settings,
      tags: {
        ...settings.tags,
        custom: [...settings.tags.custom, { name: trimmed, color: 'var(--color-accent)' }],
      },
    })
  }

  const updateTag = (isPredefined: boolean, index: number, updates: Partial<Tag>) => {
    const key = isPredefined ? 'predefined' : 'custom'
    const newTags = [...settings.tags[key]]
    newTags[index] = { ...newTags[index], ...updates }
    onUpdateSettings({
      ...settings,
      tags: { ...settings.tags, [key]: newTags },
    })
  }

  const deleteTag = (isPredefined: boolean, index: number) => {
    const key = isPredefined ? 'predefined' : 'custom'
    const tag = settings.tags[key][index]

    // Check if tag is used
    const isUsed = projects.some(p => p.tags.includes(tag.name))
    if (isUsed) {
      alert('Tag is still used in projects and cannot be deleted.')
      return
    }

    if (!confirm(`Really delete tag "${tag.name}"?`)) return

    const newTags = settings.tags[key].filter((_: Tag, i: number) => i !== index)
    onUpdateSettings({
      ...settings,
      tags: { ...settings.tags, [key]: newTags },
    })
  }

  // Count tag usage
  const getTagUsage = (tagName: string): number => {
    return projects.filter(p => p.tags.includes(tagName)).length
  }

  const allTags = [
    ...settings.tags.predefined.map((t: Tag, i: number) => ({ ...t, isPredefined: true, index: i })),
    ...settings.tags.custom.map((t: Tag, i: number) => ({ ...t, isPredefined: false, index: i })),
  ]

  const filteredTags = allTags.filter(tag =>
    tag.name.toLowerCase().includes(tagSearch.toLowerCase())
  )

  return (
    <div>
      <h1 className="text-2xl font-bold text-heading font-heading mb-7">Settings</h1>

      {/* GitHub Integration */}
      <div className="mb-8">
        <p className="text-[11px] font-semibold text-text-muted tracking-wider uppercase mb-2">GitHub Integration</p>

        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex justify-between items-center mb-3.5">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <img src="https://cdn.simpleicons.org/github/2C3E50" width="16" height="16" alt="" />
                <span className="text-[13px] font-bold text-heading">
                  GitHub Integration
                </span>
              </div>
              <p className="text-xs text-text-muted">
                Import repos and profile data from GitHub throughout the admin panel.
              </p>
            </div>

            {/* Toggle */}
            <button
              onClick={() => updateSetting('githubEnabled', settings.githubEnabled !== false ? false : undefined)}
              className="relative cursor-pointer border-none shrink-0"
              style={{
                width: 44,
                height: 24,
                borderRadius: 12,
                background: settings.githubEnabled !== false ? 'var(--color-accent)' : 'var(--color-border)',
                transition: 'background 0.3s',
              }}
            >
              <span
                className="absolute rounded-full bg-card"
                style={{
                  top: 3,
                  left: settings.githubEnabled !== false ? 23 : 3,
                  width: 18,
                  height: 18,
                  transition: 'left 0.3s',
                }}
              />
            </button>
          </div>

          {settings.githubEnabled !== false && (
            <>
              <p className="text-xs text-text-muted mb-3.5">
                Set your GitHub username once to quickly import repos and profile data throughout the admin panel.
              </p>

              <div className="flex items-center gap-2">
                <div className="flex-1 relative">
                  <img
                    src="https://cdn.simpleicons.org/github/A0ADB8"
                    width="14"
                    height="14"
                    alt=""
                    className="absolute pointer-events-none"
                    style={{
                      left: 12,
                      top: '50%',
                      transform: 'translateY(-50%)',
                    }}
                  />
                  <input
                    type="text"
                    value={settings.githubUsername || ''}
                    onChange={(e) => updateSetting('githubUsername', e.target.value || undefined)}
                    placeholder="your-github-username"
                    className="w-full py-2.5 pr-3.5 pl-[36px] rounded-lg border border-border bg-card text-heading text-sm outline-none font-mono"
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Card Display */}
      <div className="mb-8">
        <p className="text-[11px] font-semibold text-text-muted tracking-wider uppercase mb-3">Card Display</p>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4 mb-4">
          <div>
            <label className="block text-[11px] font-semibold text-text-muted tracking-wider uppercase mb-1.5">Max visible tags</label>
            <input
              type="number"
              value={settings.maxVisibleTags}
              onChange={(e) => updateSetting('maxVisibleTags', parseInt(e.target.value) || 1)}
              min={1}
              max={10}
              className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-card text-heading text-sm outline-none"
            />
            <p className="text-[11px] text-text-muted mt-1.5">
              Additional tags as "+X" badge.
            </p>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-text-muted tracking-wider uppercase mb-1.5">Title max lines</label>
            <select
              value={settings.cardTitleMaxLines}
              onChange={(e) => updateSetting('cardTitleMaxLines', parseInt(e.target.value))}
              className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-card text-heading text-sm outline-none"
            >
              <option value="1">1 line</option>
              <option value="2">2 lines</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-text-muted tracking-wider uppercase mb-1.5">Truncate description after</label>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min={80}
              max={300}
              value={descriptionMaxChars}
              onChange={(e) => setDescriptionMaxChars(parseInt(e.target.value))}
              onMouseUp={(e) => updateSetting('cardDescriptionMaxChars', parseInt((e.target as HTMLInputElement).value))}
              onTouchEnd={(e) => updateSetting('cardDescriptionMaxChars', parseInt((e.target as HTMLInputElement).value))}
              className="flex-1"
              style={{ accentColor: 'var(--color-accent)' }}
            />
            <span className="text-xs text-heading font-mono w-[100px] text-right">{descriptionMaxChars} characters</span>
          </div>
          <p className="text-[11px] text-text-muted mt-1.5">
            Text on the card will be truncated after this number of characters with "...". The full text is always shown in the modal.
          </p>
        </div>
      </div>

      {/* Health Check */}
      <div className="mb-8">
        <p className="text-[11px] font-semibold text-text-muted tracking-wider uppercase mb-3">Health Check</p>

        <div className="bg-card border border-border rounded-[10px] p-[18px]">
          <div className="flex justify-between items-center mb-3.5">
            <div>
              <span className="text-[13px] font-semibold text-heading">
                Check availability
              </span>
              <p className="text-[11px] text-text-muted mt-0.5">
                Checks if live demo URLs are reachable.
              </p>
            </div>

            {/* Toggle */}
            <button
              onClick={() => updateHealthCheck('enabled', !settings.healthCheck.enabled)}
              className="relative cursor-pointer border-none"
              style={{
                width: 44,
                height: 24,
                borderRadius: 12,
                background: settings.healthCheck.enabled ? 'var(--color-accent)' : 'var(--color-border)',
                transition: 'background 0.3s',
              }}
            >
              <span
                className="absolute rounded-full bg-card"
                style={{
                  top: 3,
                  left: settings.healthCheck.enabled ? 23 : 3,
                  width: 18,
                  height: 18,
                  transition: 'left 0.3s',
                }}
              />
            </button>
          </div>

          {settings.healthCheck.enabled && (
            <div>
              <label className="block text-[11px] font-semibold text-text-muted tracking-wider uppercase mb-1.5">Check interval</label>
              <div className="flex gap-1.5 flex-wrap">
                {[1, 5, 15, 30, 60].map(minutes => (
                  <button
                    key={minutes}
                    onClick={() => updateHealthCheck('intervalMinutes', minutes)}
                    className={cn(
                      'px-3.5 py-1.5 rounded-lg cursor-pointer text-xs font-semibold',
                      settings.healthCheck.intervalMinutes === minutes
                        ? 'border border-accent-soft bg-accent-soft text-accent'
                        : 'border border-border bg-card text-text-muted'
                    )}
                  >{minutes === 60 ? '1h' : `${minutes}m`}</button>
                ))}
              </div>
              <p className="text-[11px] text-text-muted mt-1.5">
                How often to check. Shorter intervals = more requests to your project URLs.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Tag Management */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-3.5">
          <p className="text-[11px] font-semibold text-text-muted tracking-wider uppercase">Tag Management</p>
          <button
            onClick={addTag}
            className="px-3 py-1 rounded-lg bg-transparent text-accent border border-accent-soft text-[11px] font-semibold cursor-pointer"
          >+ New Tag</button>
        </div>

        <p className="text-xs text-text-muted mb-3.5">
          Manage standard tags and custom tags. Color per tag optional.
        </p>

        {/* Search Input */}
        <div className="mb-3">
          <input
            type="text"
            placeholder="Search tags..."
            value={tagSearch}
            onChange={(e) => setTagSearch(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-card text-heading text-[13px] outline-none"
          />
        </div>

        <div className="bg-card border border-border rounded-[10px] overflow-hidden">
          {/* Header */}
          <div className="grid grid-cols-[20px_40px_1fr_150px_100px_30px] gap-2 px-3.5 py-2 border-b border-border bg-bg-alt">
            <span className="text-[9px] text-text-muted font-semibold"></span>
            <span className="text-[9px] text-text-muted font-semibold tracking-wider uppercase">Icon</span>
            <span className="text-[9px] text-text-muted font-semibold tracking-wider uppercase">Name</span>
            <span className="text-[9px] text-text-muted font-semibold tracking-wider uppercase">Icon URL</span>
            <span className="text-[9px] text-text-muted font-semibold tracking-wider uppercase">Farbe</span>
            <span></span>
          </div>

          {/* Rows - Scrollable */}
          <div className="max-h-[400px] overflow-y-auto">
          {filteredTags.map((tag, i) => {
            const usage = getTagUsage(tag.name)
            const canDelete = usage === 0 && !tag.isPredefined

            return (
              <div
                key={`${tag.isPredefined ? 'pred' : 'custom'}-${tag.index}`}
                className={cn(
                  'grid grid-cols-[20px_40px_1fr_150px_100px_30px] gap-2 px-3.5 py-2.5 items-center',
                  i % 2 === 0 ? 'bg-card' : 'bg-bg-alt'
                )}
                style={{
                  borderBottom: i < filteredTags.length - 1 ? '1px solid var(--color-bg-alt)' : 'none',
                }}
              >
                {/* Color dot */}
                <div
                  className="w-3 h-3 rounded-sm border border-border"
                  style={{ background: tag.color || 'var(--color-border)' }}
                />

                {/* Icon preview */}
                <div className="w-8 h-8 rounded border border-border flex items-center justify-center overflow-hidden bg-bg-alt">
                  {tag.icon ? (
                    <img
                      src={tag.icon}
                      alt={tag.name}
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none'
                      }}
                    />
                  ) : (
                    <span className="text-[8px] text-text-muted">-</span>
                  )}
                </div>

                {/* Name + info */}
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={tag.name}
                    onChange={(e) => updateTag(tag.isPredefined, tag.index, { name: e.target.value })}
                    className="border-none bg-transparent text-[13px] font-medium text-heading outline-none p-0 w-full"
                  />
                  {tag.isPredefined && (
                    <span className="text-[8px] font-bold text-text-muted bg-bg-alt px-1.5 py-px rounded-sm uppercase shrink-0">Standard</span>
                  )}
                  <span className="text-[10px] text-text-muted shrink-0">
                    ({usage}×)
                  </span>
                </div>

                {/* Icon URL input */}
                <input
                  type="text"
                  value={tag.icon || ''}
                  onChange={(e) => updateTag(tag.isPredefined, tag.index, { icon: e.target.value || undefined })}
                  placeholder="Icon URL"
                  className="border border-border bg-transparent text-[11px] text-heading outline-none px-2 py-1 rounded font-mono"
                />

                {/* Color picker */}
                <div className="flex items-center gap-1">
                  <input
                    type="color"
                    value={tag.color || getComputedStyle(document.documentElement).getPropertyValue('--color-accent').trim()}
                    onChange={(e) => updateTag(tag.isPredefined, tag.index, { color: e.target.value })}
                    className="w-6 h-6 border border-border rounded cursor-pointer p-0"
                  />
                  <span className="text-[10px] text-text-muted font-mono">{tag.color || 'auto'}</span>
                </div>

                {/* Delete */}
                <button
                  onClick={() => canDelete && deleteTag(tag.isPredefined, tag.index)}
                  disabled={!canDelete}
                  className={cn(
                    'bg-none border-none text-base p-0',
                    canDelete ? 'text-error cursor-pointer' : 'text-border cursor-not-allowed'
                  )}
                >×</button>
              </div>
            )
          })}
          </div>
        </div>

        <p className="text-[11px] text-text-muted mt-2">
          Tags that are not used in any project can be deleted. Standard tags can be renamed but not deleted.
        </p>
      </div>

      {/* GitHub Token */}
      {settings.githubEnabled !== false && (
        <div>
          <p className="text-[11px] font-semibold text-text-muted tracking-wider uppercase mb-3">GitHub</p>

          <label className="block text-[11px] font-semibold text-text-muted tracking-wider uppercase mb-1.5">API Token (optional)</label>

          <input
            type="password"
            value={githubToken}
            onChange={(e) => setGithubToken(e.target.value)}
            placeholder="ghp_..."
            className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-card text-heading text-sm outline-none"
          />

          <p className="text-[11px] text-text-muted mt-1.5">
            Increases the rate limit from 60 to 5,000 requests/hour. Token must be set as <code className="bg-bg-alt px-1.5 py-0.5 rounded font-mono">GITHUB_TOKEN</code> environment variable.
          </p>
        </div>
      )}

      {/* Danger Zone - Reset Config */}
      <div
        className="mt-8 p-5 bg-card rounded-lg"
        style={{ border: '2px solid var(--color-error)' }}
      >
        <h3 className="text-base font-bold text-error mb-2">⚠️ Danger Zone</h3>

        <p className="text-[13px] text-text mb-4 leading-normal">
          Reset the configuration and delete all custom data.
          Standard tags and settings will be preserved.
        </p>

        <button
          onClick={onReset}
          className="px-5 py-2.5 rounded-lg bg-error text-card border-none text-[13px] font-semibold cursor-pointer transition-all duration-200 hover:brightness-90"
        >
          🗑️ Reset Configuration
        </button>
      </div>
    </div>
  )
}
