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
      alert('Tag existiert bereits')
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
      alert('Tag wird noch in Projekten verwendet und kann nicht gelöscht werden.')
      return
    }

    if (!confirm(`Tag "${tag.name}" wirklich löschen?`)) return

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

  return (
    <div>
      <h1 style={{
        fontSize: 24,
        fontWeight: 700,
        color: 'var(--color-heading)',
        fontFamily: "'Libre Baskerville', serif",
        marginBottom: 28,
      }}>Einstellungen</h1>

      {/* Card Display */}
      <div style={{ marginBottom: 32 }}>
        <p style={{
          fontSize: 11,
          fontWeight: 600,
          color: 'var(--color-text-muted)',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          marginBottom: 12,
        }}>Card-Anzeige</p>

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
            }}>Max sichtbare Tags</label>
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
              Weitere Tags als "+X" Badge.
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
            }}>Titel Max Zeilen</label>
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
              <option value="1">1 Zeile</option>
              <option value="2">2 Zeilen</option>
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
          }}>Beschreibung abschneiden nach</label>
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
            }}>{descriptionMaxChars} Zeichen</span>
          </div>
          <p style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 6 }}>
            Auf der Card wird der Text nach dieser Zeichenanzahl mit "..." abgeschnitten. Im Modal wird immer der volle Text angezeigt.
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
                Erreichbarkeit prüfen
              </span>
              <p style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 2 }}>
                Prüft ob Live-Demo URLs erreichbar sind.
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
              }}>Prüf-Intervall</label>
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
                Wie oft geprüft wird. Kürzere Intervalle = mehr Requests an deine Projekt-URLs.
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
          }}>Tag-Verwaltung</p>
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
          >+ Neuer Tag</button>
        </div>

        <p style={{ fontSize: 12, color: 'var(--color-text-muted)', marginBottom: 14 }}>
          Standard-Tags und eigene Tags verwalten. Farbe pro Tag optional.
        </p>

        <div style={{
          background: 'var(--color-card)',
          border: '1px solid var(--color-border)',
          borderRadius: 10,
          overflow: 'hidden',
        }}>
          {/* Header */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '20px 1fr 100px 30px',
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
            }}>Name</span>
            <span style={{
              fontSize: 9,
              color: 'var(--color-text-muted)',
              fontWeight: 600,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}>Farbe</span>
            <span></span>
          </div>

          {/* Rows */}
          {allTags.map((tag, i) => {
            const usage = getTagUsage(tag.name)
            const canDelete = usage === 0 && !tag.isPredefined

            return (
              <div
                key={`${tag.isPredefined ? 'pred' : 'custom'}-${tag.index}`}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '20px 1fr 100px 30px',
                  gap: 8,
                  padding: '10px 14px',
                  alignItems: 'center',
                  borderBottom: i < allTags.length - 1 ? '1px solid var(--color-bg-alt)' : 'none',
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

        <p style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 8 }}>
          Tags die in keinem Projekt verwendet werden können gelöscht werden. Standard-Tags können umbenannt aber nicht gelöscht werden.
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
          Erhöht das Rate-Limit von 60 auf 5.000 Requests/Stunde. Token muss als <code style={{
            background: 'var(--color-bg-alt)',
            padding: '2px 6px',
            borderRadius: 4,
            fontFamily: "'IBM Plex Mono', monospace",
          }}>GITHUB_TOKEN</code> Environment Variable gesetzt werden.
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
          Setze die Konfiguration zurück und lösche alle benutzerdefinierten Daten.
          Standard-Tags und Einstellungen bleiben erhalten.
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
          🗑️ Konfiguration zurücksetzen
        </button>
      </div>
    </div>
  )
}
