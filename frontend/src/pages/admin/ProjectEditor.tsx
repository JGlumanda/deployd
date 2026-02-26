import { useState } from 'react'
import type { Project, Settings, ProjectStatus, Tag } from '@core/types'
import { PROJECT_STATUSES } from '@core/types'
import { cn } from '@core/utils/cn'
import ChipInput from './ChipInput'
import ImageUpload from './ImageUpload'

interface ProjectEditorProps {
  project: Project | null
  settings: Settings
  onSave: (project: Project) => void
  onCancel: () => void
  password?: string
}

export default function ProjectEditor({ project, settings, onSave, onCancel, password }: ProjectEditorProps) {
  const [formData, setFormData] = useState<Project>(
    () => project || {
      id: Math.floor(Math.random() * 1e15),
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

  const allTags = [
    ...settings.tags.predefined.map((t: Tag) => t.name),
    ...settings.tags.custom.map((t: Tag) => t.name),
  ]

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required'
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required'
    }

    if (!/^\d{4}-\d{2}$/.test(formData.date)) {
      newErrors.date = 'Format must be YYYY-MM'
    }

    if (formData.links.live && !isValidUrl(formData.links.live)) {
      newErrors.live = 'Invalid URL'
    }

    if (formData.links.github && !isValidUrl(formData.links.github)) {
      newErrors.github = 'Invalid URL'
    }

    if (formData.links.docs && !isValidUrl(formData.links.docs)) {
      newErrors.docs = 'Invalid URL'
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
        className="bg-none border-none text-accent cursor-pointer text-[13px] font-semibold mb-4 p-0"
      >← Back</button>

      <h1 className="text-2xl font-bold text-heading font-heading mb-7">
        {project ? 'Edit Project' : 'New Project'}
      </h1>

      <div className="flex flex-col gap-5">
        {/* Title */}
        <div>
          <label className="block text-[11px] font-semibold text-text-muted tracking-wider uppercase mb-1.5">Title *</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            onBlur={() => validate()}
            className={cn(
              'w-full px-3.5 py-2.5 rounded-lg bg-card text-heading text-sm outline-none border',
              errors.title ? 'border-error' : 'border-border'
            )}
          />
          {errors.title && (
            <p className="text-[11px] text-error mt-1">{errors.title}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block text-[11px] font-semibold text-text-muted tracking-wider uppercase mb-1.5">Description *</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            onBlur={() => validate()}
            rows={4}
            className={cn(
              'w-full px-3.5 py-2.5 rounded-lg bg-card text-heading text-sm outline-none resize-y border',
              errors.description ? 'border-error' : 'border-border'
            )}
          />
          {errors.description && (
            <p className="text-[11px] text-error mt-1">{errors.description}</p>
          )}
        </div>

        {/* Tags */}
        <div>
          <label className="block text-[11px] font-semibold text-text-muted tracking-wider uppercase mb-1.5">Tags</label>
          <ChipInput
            values={formData.tags}
            onChange={(tags) => setFormData({ ...formData, tags })}
            suggestions={allTags}
            placeholder="Add tag..."
          />
        </div>

        {/* Status and Date */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-semibold text-text-muted tracking-wider uppercase mb-1.5">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as ProjectStatus })}
              className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-card text-heading text-sm outline-none"
            >
              {PROJECT_STATUSES.map((status: ProjectStatus) => (
                <option key={status} value={status}>
                  {status === 'active' ? 'Active' : status === 'wip' ? 'In Progress' : 'Archived'}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-text-muted tracking-wider uppercase mb-1.5">Date</label>
            <input
              type="text"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              onBlur={() => validate()}
              placeholder="YYYY-MM"
              className={cn(
                'w-full px-3.5 py-2.5 rounded-lg bg-card text-heading text-sm outline-none border',
                errors.date ? 'border-error' : 'border-border'
              )}
            />
            {errors.date && (
              <p className="text-[11px] text-error mt-1">{errors.date}</p>
            )}
          </div>
        </div>

        {/* Featured toggle */}
        <div className="flex items-center gap-2.5">
          <input
            type="checkbox"
            checked={formData.featured}
            onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
            id="featured"
            className="w-4 h-4"
            style={{ accentColor: 'var(--color-accent)' }}
          />
          <label htmlFor="featured" className="text-[13px] text-heading font-medium">
            Featured Project
          </label>
        </div>

        {/* Links */}
        <div className="border-t border-border pt-5">
          <p className="text-[11px] font-semibold text-text-muted tracking-wider uppercase mb-3">Links</p>

          <div className="flex flex-col gap-2.5">
            <div>
              <label className="block text-[10px] font-semibold text-text-muted tracking-wider uppercase mb-1">Live Demo URL</label>
              <input
                type="text"
                value={formData.links.live || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  links: { ...formData.links, live: e.target.value || undefined },
                })}
                onBlur={() => validate()}
                placeholder="https://..."
                className={cn(
                  'w-full px-3 py-2 rounded-lg bg-card text-heading text-[13px] outline-none border',
                  errors.live ? 'border-error' : 'border-border'
                )}
              />
              {errors.live && (
                <p className="text-[11px] text-error mt-1">{errors.live}</p>
              )}
            </div>

            <div>
              <label className="block text-[10px] font-semibold text-text-muted tracking-wider uppercase mb-1">GitHub URL</label>
              <input
                type="text"
                value={formData.links.github || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  links: { ...formData.links, github: e.target.value || undefined },
                })}
                onBlur={() => validate()}
                placeholder="https://github.com/..."
                className={cn(
                  'w-full px-3 py-2 rounded-lg bg-card text-heading text-[13px] outline-none border',
                  errors.github ? 'border-error' : 'border-border'
                )}
              />
              {errors.github && (
                <p className="text-[11px] text-error mt-1">{errors.github}</p>
              )}
            </div>

            <div>
              <label className="block text-[10px] font-semibold text-text-muted tracking-wider uppercase mb-1">Docs URL</label>
              <input
                type="text"
                value={formData.links.docs || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  links: { ...formData.links, docs: e.target.value || undefined },
                })}
                onBlur={() => validate()}
                placeholder="https://..."
                className={cn(
                  'w-full px-3 py-2 rounded-lg bg-card text-heading text-[13px] outline-none border',
                  errors.docs ? 'border-error' : 'border-border'
                )}
              />
              {errors.docs && (
                <p className="text-[11px] text-error mt-1">{errors.docs}</p>
              )}
            </div>
          </div>
        </div>

        {/* Image */}
        <ImageUpload
          value={formData.image}
          onChange={(image) => setFormData({ ...formData, image })}
          password={password}
          label="Image (optional)"
          placeholder="https://..."
        />

        {/* Action buttons */}
        <div className="flex gap-2 mt-3">
          <button
            onClick={handleSubmit}
            className="flex-1 px-5 py-2.5 rounded-lg bg-accent text-card border-none text-[13px] font-semibold cursor-pointer"
          >Save</button>
          <button
            onClick={onCancel}
            className="px-5 py-2.5 rounded-lg bg-transparent text-accent border border-accent/25 text-[13px] font-semibold cursor-pointer"
          >Cancel</button>
        </div>
      </div>
    </div>
  )
}
