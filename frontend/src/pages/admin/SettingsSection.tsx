import { useState } from 'react'
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
      <h1 style={{
        fontSize: 24,
        fontWeight: 700,
        color: 'var(--color-heading)',
        fontFamily: "'Libre Baskerville', serif",
        marginBottom: 28,
      }}>Settings</h1>

      {/* GitHub Integration */}
      <div style={{ marginBottom: 32 }}>
        <p style={{
          fontSize: 11,
          fontWeight: 600,
          color: 'var(--color-text-muted)',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          marginBottom: 8,
        }}>GitHub Integration</p>

        <div style={{
          background: 'var(--color-card)',
          border: '1px solid var(--color-border)',
          borderRadius: 12,
          padding: 20,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <img src="https://cdn.simpleicons.org/github/2C3E50" width="16" height="16" alt="" />
            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-heading)' }}>
              Default GitHub Username
            </span>
          </div>
          <p style={{ fontSize: 12, color: 'var(--color-text-muted)', marginBottom: 14 }}>
            Set your GitHub username once to quickly import repos and profile data throughout the admin panel.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <img
                src="https://cdn.simpleicons.org/github/A0ADB8"
                width="14"
                height="14"
                alt=""
                style={{
                  position: 'absolute',
                  left: 12,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  pointerEvents: 'none',
                }}
              />
              <input
                type="text"
                value={settings.githubUsername || ''}
                onChange={(e) => updateSetting('githubUsername', e.target.value || undefined)}
                placeholder="your-github-username"
                style={{
                  width: '100%',
                  padding: '10px 14px 10px 36px',
                  borderRadius: 8,
                  border: '1px solid var(--color-border)',
                  background: 'var(--color-card)',
                  color: 'var(--color-heading)',
                  fontSize: 14,
                  outline: 'none',
                  fontFamily: "'IBM Plex Mono', monospace",
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Card Display */}
      <div style={{ marginBottom: 32 }}>
        <p style={{
          fontSize: 11,
          fontWeight: 600,
          color: 'var(--color-text-muted)',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          marginBottom: 12,
        }}>Card Display</p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 16,
          marginBottom: 16,
        }}>
          <div>
            <label style={{
              display: 'block',
              fontSize: 11,
              fontWeight: 600,
              color: 'var(--color-text-muted)',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              marginBottom: 6,
            }}>Max visible tags</label>
            <input
              type="number"
              value={settings.maxVisibleTags}
              onChange={(e) => updateSetting('maxVisibleTags', parseInt(e.target.value) || 1)}
              min={1}
              max={10}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: 8,
                border: '1px solid var(--color-border)',
                background: 'var(--color-card)',
                color: 'var(--color-heading)',
                fontSize: 14,
                outline: 'none',
              }}
            />
            <p style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 6 }}>
              Additional tags as "+X" badge.
            </p>
          </div>

          <div>
            <label style={{
              display: 'block',
              fontSize: 11,
              fontWeight: 600,
              color: 'var(--color-text-muted)',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              marginBottom: 6,
            }}>Title max lines</label>
            <select
              value={settings.cardTitleMaxLines}
              onChange={(e) => updateSetting('cardTitleMaxLines', parseInt(e.target.value))}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: 8,
                border: '1px solid var(--color-border)',
                background: 'var(--color-card)',
                color: 'var(--color-heading)',
                fontSize: 14,
                outline: 'none',
              }}
            >
              <option value="1">1 line</option>
              <option value="2">2 lines</option>
            </select>
          </div>
        </div>

        <div>
          <label style={{
            display: 'block',
            fontSize: 11,
            fontWeight: 600,
            color: 'var(--color-text-muted)',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            marginBottom: 6,
          }}>Truncate description after</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <input
              type="range"
              min={80}
              max={300}
              value={descriptionMaxChars}
              onChange={(e) => setDescriptionMaxChars(parseInt(e.target.value))}
              onMouseUp={(e) => updateSetting('cardDescriptionMaxChars', parseInt((e.target as HTMLInputElement).value))}
              onTouchEnd={(e) => updateSetting('cardDescriptionMaxChars', parseInt((e.target as HTMLInputElement).value))}
              style={{ flex: 1, accentColor: 'var(--color-accent)' }}
            />
            <span style={{
              fontSize: 12,
              color: 'var(--color-heading)',
              fontFamily: "'IBM Plex Mono', monospace",
              width: 100,
              textAlign: 'right',
            }}>{descriptionMaxChars} characters</span>
          </div>
          <p style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 6 }}>
            Text on the card will be truncated after this number of characters with "...". The full text is always shown in the modal.
          </p>
        </div>
      </div>

      {/* Health Check */}
      <div style={{ marginBottom: 32 }}>
        <p style={{
          fontSize: 11,
          fontWeight: 600,
          color: 'var(--color-text-muted)',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          marginBottom: 12,
        }}>Health Check</p>

        <div style={{
          background: 'var(--color-card)',
          border: '1px solid var(--color-border)',
          borderRadius: 10,
          padding: 18,
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 14,
          }}>
            <div>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-heading)' }}>
                Check availability
              </span>
              <p style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 2 }}>
                Checks if live demo URLs are reachable.
              </p>
            </div>

            {/* Toggle */}
            <button
              onClick={() => updateHealthCheck('enabled', !settings.healthCheck.enabled)}
              style={{
                width: 44,
                height: 24,
                borderRadius: 12,
                border: 'none',
                background: settings.healthCheck.enabled ? 'var(--color-accent)' : 'var(--color-border)',
                position: 'relative',
                cursor: 'pointer',
                transition: 'background 0.3s',
              }}
            >
              <span style={{
                position: 'absolute',
                top: 3,
                left: settings.healthCheck.enabled ? 23 : 3,
                width: 18,
                height: 18,
                borderRadius: '50%',
                background: 'var(--color-card)',
                transition: 'left 0.3s',
              }} />
            </button>
          </div>

          {settings.healthCheck.enabled && (
            <div>
              <label style={{
                display: 'block',
                fontSize: 11,
                fontWeight: 600,
                color: 'var(--color-text-muted)',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                marginBottom: 6,
              }}>Check interval</label>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {[1, 5, 15, 30, 60].map(minutes => (
                  <button
                    key={minutes}
                    onClick={() => updateHealthCheck('intervalMinutes', minutes)}
                    style={{
                      padding: '6px 14px',
                      borderRadius: 8,
                      cursor: 'pointer',
                      fontSize: 12,
                      fontWeight: 600,
                      border: settings.healthCheck.intervalMinutes === minutes
                        ? '1px solid var(--color-accent-soft)'
                        : '1px solid var(--color-border)',
                      background: settings.healthCheck.intervalMinutes === minutes
                        ? 'var(--color-accent-soft)'
                        : 'var(--color-card)',
                      color: settings.healthCheck.intervalMinutes === minutes
                        ? 'var(--color-accent)'
                        : 'var(--color-text-muted)',
                    }}
                  >{minutes === 60 ? '1h' : `${minutes}m`}</button>
                ))}
              </div>
              <p style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 6 }}>
                How often to check. Shorter intervals = more requests to your project URLs.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Tag Management */}
      <div style={{ marginBottom: 32 }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 14,
        }}>
          <p style={{
            fontSize: 11,
            fontWeight: 600,
            color: 'var(--color-text-muted)',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
          }}>Tag Management</p>
          <button
            onClick={addTag}
            style={{
              padding: '4px 12px',
              borderRadius: 8,
              background: 'transparent',
              color: 'var(--color-accent)',
              border: '1px solid var(--color-accent-soft)',
              fontSize: 11,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >+ New Tag</button>
        </div>

        <p style={{ fontSize: 12, color: 'var(--color-text-muted)', marginBottom: 14 }}>
          Manage standard tags and custom tags. Color per tag optional.
        </p>

        {/* Search Input */}
        <div style={{ marginBottom: 12 }}>
          <input
            type="text"
            placeholder="Search tags..."
            value={tagSearch}
            onChange={(e) => setTagSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 14px',
              borderRadius: 8,
              border: '1px solid var(--color-border)',
              background: 'var(--color-card)',
              color: 'var(--color-heading)',
              fontSize: 13,
              outline: 'none',
            }}
          />
        </div>

        <div style={{
          background: 'var(--color-card)',
          border: '1px solid var(--color-border)',
          borderRadius: 10,
          overflow: 'hidden',
        }}>
          {/* Header */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '20px 40px 1fr 150px 100px 30px',
            gap: 8,
            padding: '8px 14px',
            borderBottom: '1px solid var(--color-border)',
            background: 'var(--color-bg-alt)',
          }}>
            <span style={{
              fontSize: 9,
              color: 'var(--color-text-muted)',
              fontWeight: 600,
            }}></span>
            <span style={{
              fontSize: 9,
              color: 'var(--color-text-muted)',
              fontWeight: 600,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}>Icon</span>
            <span style={{
              fontSize: 9,
              color: 'var(--color-text-muted)',
              fontWeight: 600,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}>Name</span>
            <span style={{
              fontSize: 9,
              color: 'var(--color-text-muted)',
              fontWeight: 600,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}>Icon URL</span>
            <span style={{
              fontSize: 9,
              color: 'var(--color-text-muted)',
              fontWeight: 600,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}>Farbe</span>
            <span></span>
          </div>

          {/* Rows - Scrollable */}
          <div style={{
            maxHeight: '400px',
            overflowY: 'auto',
          }}>
          {filteredTags.map((tag, i) => {
            const usage = getTagUsage(tag.name)
            const canDelete = usage === 0 && !tag.isPredefined

            return (
              <div
                key={`${tag.isPredefined ? 'pred' : 'custom'}-${tag.index}`}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '20px 40px 1fr 150px 100px 30px',
                  gap: 8,
                  padding: '10px 14px',
                  alignItems: 'center',
                  borderBottom: i < filteredTags.length - 1 ? '1px solid var(--color-bg-alt)' : 'none',
                  background: i % 2 === 0 ? 'var(--color-card)' : 'var(--color-bg-alt)',
                }}
              >
                {/* Color dot */}
                <div style={{
                  width: 12,
                  height: 12,
                  borderRadius: 3,
                  background: tag.color || 'var(--color-border)',
                  border: '1px solid var(--color-border)',
                }} />

                {/* Icon preview */}
                <div style={{
                  width: 32,
                  height: 32,
                  borderRadius: 4,
                  border: '1px solid var(--color-border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  background: 'var(--color-bg-alt)',
                }}>
                  {tag.icon ? (
                    <img
                      src={tag.icon}
                      alt={tag.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                      }}
                      onError={(e) => {
                        e.currentTarget.style.display = 'none'
                      }}
                    />
                  ) : (
                    <span style={{
                      fontSize: 8,
                      color: 'var(--color-text-muted)',
                    }}>-</span>
                  )}
                </div>

                {/* Name + info */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <input
                    type="text"
                    value={tag.name}
                    onChange={(e) => updateTag(tag.isPredefined, tag.index, { name: e.target.value })}
                    style={{
                      border: 'none',
                      background: 'transparent',
                      fontSize: 13,
                      fontWeight: 500,
                      color: 'var(--color-heading)',
                      outline: 'none',
                      padding: 0,
                      width: '100%',
                    }}
                  />
                  {tag.isPredefined && (
                    <span style={{
                      fontSize: 8,
                      fontWeight: 700,
                      color: 'var(--color-text-muted)',
                      background: 'var(--color-bg-alt)',
                      padding: '1px 6px',
                      borderRadius: 3,
                      textTransform: 'uppercase',
                      flexShrink: 0,
                    }}>Standard</span>
                  )}
                  <span style={{ fontSize: 10, color: 'var(--color-text-muted)', flexShrink: 0 }}>
                    ({usage}×)
                  </span>
                </div>

                {/* Icon URL input */}
                <input
                  type="text"
                  value={tag.icon || ''}
                  onChange={(e) => updateTag(tag.isPredefined, tag.index, { icon: e.target.value || undefined })}
                  placeholder="Icon URL"
                  style={{
                    border: '1px solid var(--color-border)',
                    background: 'transparent',
                    fontSize: 11,
                    color: 'var(--color-heading)',
                    outline: 'none',
                    padding: '4px 8px',
                    borderRadius: 4,
                    fontFamily: "'IBM Plex Mono', monospace",
                  }}
                />

                {/* Color picker */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <input
                    type="color"
                    value={tag.color || getComputedStyle(document.documentElement).getPropertyValue('--color-accent').trim()}
                    onChange={(e) => updateTag(tag.isPredefined, tag.index, { color: e.target.value })}
                    style={{
                      width: 24,
                      height: 24,
                      border: '1px solid var(--color-border)',
                      borderRadius: 4,
                      cursor: 'pointer',
                      padding: 0,
                    }}
                  />
                  <span style={{
                    fontSize: 10,
                    color: 'var(--color-text-muted)',
                    fontFamily: "'IBM Plex Mono', monospace",
                  }}>{tag.color || 'auto'}</span>
                </div>

                {/* Delete */}
                <button
                  onClick={() => canDelete && deleteTag(tag.isPredefined, tag.index)}
                  disabled={!canDelete}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: canDelete ? 'var(--color-error)' : 'var(--color-border)',
                    cursor: canDelete ? 'pointer' : 'not-allowed',
                    fontSize: 16,
                    padding: 0,
                  }}
                >×</button>
              </div>
            )
          })}
          </div>
        </div>

        <p style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 8 }}>
          Tags that are not used in any project can be deleted. Standard tags can be renamed but not deleted.
        </p>
      </div>

      {/* GitHub Token */}
      <div>
        <p style={{
          fontSize: 11,
          fontWeight: 600,
          color: 'var(--color-text-muted)',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          marginBottom: 12,
        }}>GitHub</p>

        <label style={{
          display: 'block',
          fontSize: 11,
          fontWeight: 600,
          color: 'var(--color-text-muted)',
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          marginBottom: 6,
        }}>API Token (optional)</label>

        <input
          type="password"
          value={githubToken}
          onChange={(e) => setGithubToken(e.target.value)}
          placeholder="ghp_..."
          style={{
            width: '100%',
            padding: '10px 14px',
            borderRadius: 8,
            border: '1px solid var(--color-border)',
            background: 'var(--color-card)',
            color: 'var(--color-heading)',
            fontSize: 14,
            outline: 'none',
          }}
        />

        <p style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 6 }}>
          Increases the rate limit from 60 to 5,000 requests/hour. Token must be set as <code style={{
            background: 'var(--color-bg-alt)',
            padding: '2px 6px',
            borderRadius: 4,
            fontFamily: "'IBM Plex Mono', monospace",
          }}>GITHUB_TOKEN</code> environment variable.
        </p>
      </div>

      {/* Danger Zone - Reset Config */}
      <div style={{
        marginTop: 32,
        padding: 20,
        background: 'var(--color-card)',
        borderRadius: 8,
        border: '2px solid var(--color-error)',
      }}>
        <h3 style={{
          fontSize: 16,
          fontWeight: 700,
          color: 'var(--color-error)',
          marginBottom: 8,
        }}>⚠️ Danger Zone</h3>

        <p style={{
          fontSize: 13,
          color: 'var(--color-text)',
          marginBottom: 16,
          lineHeight: 1.5,
        }}>
          Reset the configuration and delete all custom data.
          Standard tags and settings will be preserved.
        </p>

        <button
          onClick={onReset}
          style={{
            padding: '10px 20px',
            borderRadius: 8,
            background: 'var(--color-error)',
            color: 'var(--color-card)',
            border: 'none',
            fontSize: 13,
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'color-mix(in srgb, var(--color-error) 80%, black)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'var(--color-error)'
          }}
        >
          🗑️ Reset Configuration
        </button>
      </div>
    </div>
  )
}
