import { useState } from 'react'
import type { Project, Settings, ProjectStatus } from '@core/types'
import ProjectEditor from './ProjectEditor'
import GitHubImport from './GitHubImport'

interface ProjectsSectionProps {
  projects: Project[]
  settings: Settings
  onUpdateProjects: (projects: Project[]) => void
}

type View = 'list' | 'editor' | 'import'

const STATUS_COLORS: Record<ProjectStatus, string> = {
  active: 'var(--color-status-active)',
  wip: 'var(--color-status-wip)',
  archived: 'var(--color-status-archived)',
}

export default function ProjectsSection({ projects, settings, onUpdateProjects }: ProjectsSectionProps) {
  const [view, setView] = useState<View>('list')
  const [editingProject, setEditingProject] = useState<Project | null>(null)

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
    onUpdateProjects([...projects, ...importedProjects])
    setView('list')
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
          <button
            onClick={() => setView('import')}
            className="px-4 py-2 rounded-lg bg-transparent text-accent border border-accent/25 text-[13px] font-semibold cursor-pointer flex items-center gap-1.5"
          >
            <img src="https://cdn.simpleicons.org/github/6B8FA3" width="14" height="14" alt="" />
            Import from GitHub
          </button>

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
        <div className="flex flex-col gap-2">
          {projects.map(project => (
            <div
              key={project.id}
              onClick={() => handleEditProject(project)}
              className="flex items-center gap-4 px-5 py-4 bg-card border border-border rounded-[10px] cursor-pointer transition-shadow hover:shadow-md"
            >
              {/* Status dot */}
              <div
                className="w-2 h-2 rounded-full shrink-0"
                style={{ background: STATUS_COLORS[project.status] }}
              />

              {/* Content */}
              <div className="flex-1 min-w-0">
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
                  handleDeleteProject(project)
                }}
                className="bg-none border-none text-error cursor-pointer text-lg p-1 w-6 h-6 flex items-center justify-center"
              >×</button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
