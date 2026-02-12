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
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
        gap: 16,
        flexWrap: 'wrap',
      }}>
        <h1 style={{
          fontSize: 24,
          fontWeight: 700,
          color: '#2C3E50',
          fontFamily: "'Libre Baskerville', serif",
        }}>Projects</h1>

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button
            onClick={() => setView('import')}
            style={{
              padding: '8px 16px',
              borderRadius: 8,
              background: 'transparent',
              color: '#6B8FA3',
              border: '1px solid #6B8FA344',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <img src="https://cdn.simpleicons.org/github/6B8FA3" width="14" height="14" alt="" />
            Import from GitHub
          </button>

          <button
            onClick={handleAddProject}
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
          >+ New Project</button>
        </div>
      </div>

      {projects.length === 0 ? (
        <div style={{
          padding: 48,
          textAlign: 'center',
          background: 'var(--color-card)',
          border: '1px solid var(--color-border)',
          borderRadius: 12,
        }}>
          <p style={{
            fontSize: 14,
            color: '#A0ADB8',
            marginBottom: 16,
          }}>No projects available yet.</p>
          <button
            onClick={handleAddProject}
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
          >Create First Project</button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {projects.map(project => (
            <div
              key={project.id}
              onClick={() => handleEditProject(project)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                padding: '16px 20px',
                background: 'var(--color-card)',
                border: '1px solid var(--color-border)',
                borderRadius: 10,
                cursor: 'pointer',
                transition: 'box-shadow 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(44,62,80,0.08)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              {/* Status dot */}
              <div style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: STATUS_COLORS[project.status],
                flexShrink: 0,
              }} />

              {/* Content */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                  <span style={{
                    fontSize: 15,
                    fontWeight: 600,
                    color: '#2C3E50',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}>{project.title}</span>

                  {project.featured && (
                    <span style={{
                      fontSize: 9,
                      fontWeight: 700,
                      color: '#6B8FA3',
                      background: '#6B8FA314',
                      padding: '1px 8px',
                      borderRadius: 4,
                      textTransform: 'uppercase',
                      flexShrink: 0,
                    }}>Featured</span>
                  )}
                </div>

                <span style={{
                  fontSize: 12,
                  color: '#A0ADB8',
                }}>
                  {project.tags.slice(0, 3).join(', ')}
                  {project.tags.length > 3 && ` +${project.tags.length - 3}`}
                </span>
              </div>

              {/* Date */}
              <span style={{
                fontSize: 11,
                color: '#A0ADB8',
                fontFamily: "'IBM Plex Mono', monospace",
                flexShrink: 0,
              }}>{project.date}</span>

              {/* Delete button */}
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleDeleteProject(project)
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#D4A0A0',
                  cursor: 'pointer',
                  fontSize: 18,
                  padding: 4,
                  width: 24,
                  height: 24,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >×</button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
