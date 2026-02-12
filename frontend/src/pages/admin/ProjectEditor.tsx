import { useState, useEffect } from 'react'
import type { Project, Settings, ProjectStatus, Tag } from '@core/types'
import { PROJECT_STATUSES } from '@core/types'
import ChipInput from './ChipInput'

interface ProjectEditorProps {
  project: Project | null
  settings: Settings
  onSave: (project: Project) => void
  onCancel: () => void
}

export default function ProjectEditor({ project, settings, onSave, onCancel }: ProjectEditorProps) {
  const [formData, setFormData] = useState<Project>(
    project || {
      id: Date.now(),
      title: '',
      description: '',
      tags: [],
      status: 'active',
      featured: false,
      links: {},
      image: null,
      date: new Date().toISOString().slice(0, 7), // YYYY-MM
    }
  )
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (project) {
      setFormData(project)
    }
  }, [project])

  const allTags = [
    ...settings.tags.predefined.map((t: Tag) => t.name),
    ...settings.tags.custom.map((t: Tag) => t.name),
  ]

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) {
      newErrors.title = 'Titel ist erforderlich'
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Beschreibung ist erforderlich'
    }

    if (!/^\d{4}-\d{2}$/.test(formData.date)) {
      newErrors.date = 'Format muss YYYY-MM sein'
    }

    if (formData.links.live && !isValidUrl(formData.links.live)) {
      newErrors.live = 'Ungültige URL'
    }

    if (formData.links.github && !isValidUrl(formData.links.github)) {
      newErrors.github = 'Ungültige URL'
    }

    if (formData.links.docs && !isValidUrl(formData.links.docs)) {
      newErrors.docs = 'Ungültige URL'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  const handleSubmit = () => {
    if (validate()) {
      onSave(formData)
    }
  }

  return (
    <div>
      <button
        onClick={onCancel}
        style={{
          background: 'none',
          border: 'none',
          color: '#6B8FA3',
          cursor: 'pointer',
          fontSize: 13,
          fontWeight: 600,
          marginBottom: 16,
          padding: 0,
        }}
      >← Zurück</button>

      <h1 style={{
        fontSize: 24,
        fontWeight: 700,
        color: '#2C3E50',
        fontFamily: "'Libre Baskerville', serif",
        marginBottom: 28,
      }}>
        {project ? 'Projekt bearbeiten' : 'Neues Projekt'}
      </h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {/* Title */}
        <div>
          <label style={{
            display: 'block',
            fontSize: 11,
            fontWeight: 600,
            color: '#A0ADB8',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            marginBottom: 6,
          }}>Titel *</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            onBlur={() => validate()}
            style={{
              width: '100%',
              padding: '10px 14px',
              borderRadius: 8,
              border: errors.title ? '1px solid #D4A0A0' : '1px solid #E2DDD5',
              background: '#FFF',
              color: '#2C3E50',
              fontSize: 14,
              outline: 'none',
            }}
          />
          {errors.title && (
            <p style={{ fontSize: 11, color: '#D4A0A0', marginTop: 4 }}>{errors.title}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label style={{
            display: 'block',
            fontSize: 11,
            fontWeight: 600,
            color: '#A0ADB8',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            marginBottom: 6,
          }}>Beschreibung *</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            onBlur={() => validate()}
            rows={4}
            style={{
              width: '100%',
              padding: '10px 14px',
              borderRadius: 8,
              border: errors.description ? '1px solid #D4A0A0' : '1px solid #E2DDD5',
              background: '#FFF',
              color: '#2C3E50',
              fontSize: 14,
              outline: 'none',
              resize: 'vertical',
            }}
          />
          {errors.description && (
            <p style={{ fontSize: 11, color: '#D4A0A0', marginTop: 4 }}>{errors.description}</p>
          )}
        </div>

        {/* Tags */}
        <div>
          <label style={{
            display: 'block',
            fontSize: 11,
            fontWeight: 600,
            color: '#A0ADB8',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            marginBottom: 6,
          }}>Tags</label>
          <ChipInput
            values={formData.tags}
            onChange={(tags) => setFormData({ ...formData, tags })}
            suggestions={allTags}
            placeholder="Tag hinzufügen..."
          />
        </div>

        {/* Status and Date */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div>
            <label style={{
              display: 'block',
              fontSize: 11,
              fontWeight: 600,
              color: '#A0ADB8',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              marginBottom: 6,
            }}>Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as ProjectStatus })}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: 8,
                border: '1px solid #E2DDD5',
                background: '#FFF',
                color: '#2C3E50',
                fontSize: 14,
                outline: 'none',
              }}
            >
              {PROJECT_STATUSES.map((status: ProjectStatus) => (
                <option key={status} value={status}>
                  {status === 'active' ? 'Active' : status === 'wip' ? 'In Progress' : 'Archived'}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{
              display: 'block',
              fontSize: 11,
              fontWeight: 600,
              color: '#A0ADB8',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              marginBottom: 6,
            }}>Datum</label>
            <input
              type="text"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              onBlur={() => validate()}
              placeholder="YYYY-MM"
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: 8,
                border: errors.date ? '1px solid #D4A0A0' : '1px solid #E2DDD5',
                background: '#FFF',
                color: '#2C3E50',
                fontSize: 14,
                outline: 'none',
              }}
            />
            {errors.date && (
              <p style={{ fontSize: 11, color: '#D4A0A0', marginTop: 4 }}>{errors.date}</p>
            )}
          </div>
        </div>

        {/* Featured toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <input
            type="checkbox"
            checked={formData.featured}
            onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
            id="featured"
            style={{ width: 16, height: 16, accentColor: '#6B8FA3' }}
          />
          <label htmlFor="featured" style={{ fontSize: 13, color: '#2C3E50', fontWeight: 500 }}>
            Featured Projekt
          </label>
        </div>

        {/* Links */}
        <div style={{ borderTop: '1px solid #E2DDD5', paddingTop: 20 }}>
          <p style={{
            fontSize: 11,
            fontWeight: 600,
            color: '#A0ADB8',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            marginBottom: 12,
          }}>Links</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div>
              <label style={{
                display: 'block',
                fontSize: 10,
                fontWeight: 600,
                color: '#A0ADB8',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                marginBottom: 4,
              }}>Live Demo URL</label>
              <input
                type="text"
                value={formData.links.live || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  links: { ...formData.links, live: e.target.value || undefined },
                })}
                onBlur={() => validate()}
                placeholder="https://..."
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: 8,
                  border: errors.live ? '1px solid #D4A0A0' : '1px solid #E2DDD5',
                  background: '#FFF',
                  color: '#2C3E50',
                  fontSize: 13,
                  outline: 'none',
                }}
              />
              {errors.live && (
                <p style={{ fontSize: 11, color: '#D4A0A0', marginTop: 4 }}>{errors.live}</p>
              )}
            </div>

            <div>
              <label style={{
                display: 'block',
                fontSize: 10,
                fontWeight: 600,
                color: '#A0ADB8',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                marginBottom: 4,
              }}>GitHub URL</label>
              <input
                type="text"
                value={formData.links.github || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  links: { ...formData.links, github: e.target.value || undefined },
                })}
                onBlur={() => validate()}
                placeholder="https://github.com/..."
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: 8,
                  border: errors.github ? '1px solid #D4A0A0' : '1px solid #E2DDD5',
                  background: '#FFF',
                  color: '#2C3E50',
                  fontSize: 13,
                  outline: 'none',
                }}
              />
              {errors.github && (
                <p style={{ fontSize: 11, color: '#D4A0A0', marginTop: 4 }}>{errors.github}</p>
              )}
            </div>

            <div>
              <label style={{
                display: 'block',
                fontSize: 10,
                fontWeight: 600,
                color: '#A0ADB8',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                marginBottom: 4,
              }}>Docs URL</label>
              <input
                type="text"
                value={formData.links.docs || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  links: { ...formData.links, docs: e.target.value || undefined },
                })}
                onBlur={() => validate()}
                placeholder="https://..."
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: 8,
                  border: errors.docs ? '1px solid #D4A0A0' : '1px solid #E2DDD5',
                  background: '#FFF',
                  color: '#2C3E50',
                  fontSize: 13,
                  outline: 'none',
                }}
              />
              {errors.docs && (
                <p style={{ fontSize: 11, color: '#D4A0A0', marginTop: 4 }}>{errors.docs}</p>
              )}
            </div>
          </div>
        </div>

        {/* Image URL */}
        <div>
          <label style={{
            display: 'block',
            fontSize: 11,
            fontWeight: 600,
            color: '#A0ADB8',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            marginBottom: 6,
          }}>Bild URL (optional)</label>
          <input
            type="text"
            value={formData.image || ''}
            onChange={(e) => setFormData({ ...formData, image: e.target.value || null })}
            placeholder="https://..."
            style={{
              width: '100%',
              padding: '10px 14px',
              borderRadius: 8,
              border: '1px solid #E2DDD5',
              background: '#FFF',
              color: '#2C3E50',
              fontSize: 14,
              outline: 'none',
            }}
          />
          <p style={{ fontSize: 11, color: '#A0ADB8', marginTop: 4 }}>
            Wenn leer, wird ein generierter Gradient verwendet.
          </p>
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
          <button
            onClick={handleSubmit}
            style={{
              flex: 1,
              padding: '10px 20px',
              borderRadius: 8,
              background: '#6B8FA3',
              color: '#FFF',
              border: 'none',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >Speichern</button>
          <button
            onClick={onCancel}
            style={{
              padding: '10px 20px',
              borderRadius: 8,
              background: 'transparent',
              color: '#6B8FA3',
              border: '1px solid #6B8FA344',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >Abbrechen</button>
        </div>
      </div>
    </div>
  )
}
