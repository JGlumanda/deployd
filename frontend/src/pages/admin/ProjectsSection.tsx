import { useState } from 'react'
import type { Project, Settings, ProjectStatus } from '@core/types'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import ProjectEditor from './ProjectEditor'
import GitHubImport from './GitHubImport'

interface ProjectsSectionProps {
  projects: Project[]
  settings: Settings
  onUpdateProjects: (projects: Project[]) => void
  password?: string
}

type View = 'list' | 'editor' | 'import'

const STATUS_COLORS: Record<ProjectStatus, string> = {
  active: 'var(--color-status-active)',
  wip: 'var(--color-status-wip)',
  archived: 'var(--color-status-archived)',
}

function SortableProjectRow({
  project,
  onEdit,
  onDelete,
}: {
  project: Project
  onEdit: (project: Project) => void
  onDelete: (project: Project) => void
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: project.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-4 px-5 py-4 bg-card border border-border rounded-[10px] cursor-pointer transition-shadow hover:shadow-md"
    >
      {/* Drag handle */}
      <button
        {...attributes}
        {...listeners}
        onClick={(e) => e.stopPropagation()}
        className="bg-none border-none cursor-grab active:cursor-grabbing p-0 text-text-muted hover:text-heading shrink-0 touch-none"
        aria-label="Drag to reorder"
      >
        <svg width="12" height="18" viewBox="0 0 12 18" fill="currentColor">
          <circle cx="3" cy="3" r="1.5" />
          <circle cx="9" cy="3" r="1.5" />
          <circle cx="3" cy="9" r="1.5" />
          <circle cx="9" cy="9" r="1.5" />
          <circle cx="3" cy="15" r="1.5" />
          <circle cx="9" cy="15" r="1.5" />
        </svg>
      </button>

      {/* Status dot */}
      <div
        className="w-2 h-2 rounded-full shrink-0"
        style={{ background: STATUS_COLORS[project.status] }}
      />

      {/* Content */}
      <div className="flex-1 min-w-0" onClick={() => onEdit(project)}>
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-[15px] font-semibold text-heading truncate">{project.title}</span>

          {project.featured && (
            <span className="text-[9px] font-bold text-accent bg-accent-soft px-2 py-px rounded uppercase shrink-0">Featured</span>
          )}
        </div>

        <span className="text-xs text-text-muted">
          {project.tags.slice(0, 3).join(', ')}
          {project.tags.length > 3 && ` +${project.tags.length - 3}`}
        </span>
      </div>

      {/* Date */}
      <span className="text-[11px] text-text-muted font-mono shrink-0">{project.date}</span>

      {/* Delete button */}
      <button
        onClick={(e) => {
          e.stopPropagation()
          onDelete(project)
        }}
        className="bg-none border-none text-error cursor-pointer text-lg p-1 w-6 h-6 flex items-center justify-center"
      >×</button>
    </div>
  )
}

export default function ProjectsSection({ projects, settings, onUpdateProjects, password }: ProjectsSectionProps) {
  const [view, setView] = useState<View>('list')
  const [editingProject, setEditingProject] = useState<Project | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  const handleAddProject = () => {
    setEditingProject(null)
    setView('editor')
  }

  const handleEditProject = (project: Project) => {
    setEditingProject(project)
    setView('editor')
  }

  const handleDeleteProject = (project: Project) => {
    if (!confirm(`"${project.title}" really delete?`)) return
    onUpdateProjects(projects.filter(p => p.id !== project.id))
  }

  const handleSaveProject = (project: Project) => {
    if (editingProject) {
      // Update existing
      onUpdateProjects(projects.map(p => p.id === project.id ? project : p))
    } else {
      // Add new
      onUpdateProjects([...projects, project])
    }
    setView('list')
    setEditingProject(null)
  }

  const handleImportProjects = (importedProjects: Project[]) => {
    const importedUrls = new Set(importedProjects.map(p => p.links.github).filter(Boolean))
    // Remove existing projects that match by GitHub URL, then add the fresh imports
    const kept = projects.filter(p => !p.links.github || !importedUrls.has(p.links.github))
    onUpdateProjects([...kept, ...importedProjects])
    setView('list')
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = projects.findIndex(p => p.id === active.id)
    const newIndex = projects.findIndex(p => p.id === over.id)
    if (oldIndex === -1 || newIndex === -1) return

    onUpdateProjects(arrayMove(projects, oldIndex, newIndex))
  }

  if (view === 'editor') {
    return (
      <ProjectEditor
        key={editingProject?.id ?? 'new'}
        project={editingProject}
        settings={settings}
        onSave={handleSaveProject}
        onCancel={() => {
          setView('list')
          setEditingProject(null)
        }}
        password={password}
      />
    )
  }

  if (view === 'import') {
    return (
      <GitHubImport
        existingProjects={projects}
        settings={settings}
        onImport={handleImportProjects}
        onCancel={() => setView('list')}
      />
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6 gap-4 flex-wrap">
        <h1 className="text-2xl font-bold text-heading font-heading">Projects</h1>

        <div className="flex gap-2 flex-wrap">
          {settings.githubEnabled !== false && (
            <button
              onClick={() => setView('import')}
              className="px-4 py-2 rounded-lg bg-transparent text-accent border border-accent/25 text-[13px] font-semibold cursor-pointer flex items-center gap-1.5"
            >
              <img src="https://cdn.simpleicons.org/github/6B8FA3" width="14" height="14" alt="" />
              Import from GitHub
            </button>
          )}

          <button
            onClick={handleAddProject}
            className="px-5 py-2 rounded-lg bg-accent text-card border-none text-[13px] font-semibold cursor-pointer"
          >+ New Project</button>
        </div>
      </div>

      {projects.length === 0 ? (
        <div className="p-12 text-center bg-card border border-border rounded-xl">
          <p className="text-sm text-text-muted mb-4">No projects available yet.</p>
          <button
            onClick={handleAddProject}
            className="px-5 py-2 rounded-lg bg-accent text-card border-none text-[13px] font-semibold cursor-pointer"
          >Create First Project</button>
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={projects.map(p => p.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="flex flex-col gap-2">
              {projects.map(project => (
                <SortableProjectRow
                  key={project.id}
                  project={project}
                  onEdit={handleEditProject}
                  onDelete={handleDeleteProject}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  )
}
