import { useEffect } from 'react'
import type { ModalWrapperProps, ProjectStatus } from '@core/types'
import { getProjectImageStyle } from '@core/utils/projectImage'
import { getTheme } from '@themes/registry'

const statusMap: Record<ProjectStatus, { label: string; color: string }> = {
  active: { label: 'RUNNING', color: '#39FF14' },
  wip: { label: 'BUILDING', color: '#FFD700' },
  archived: { label: 'STOPPED', color: '#666' },
}

export function ModalWrapper({ project, onClose }: ModalWrapperProps) {
  const status = statusMap[project.status] || statusMap.active
  const theme = getTheme('terminal') || null
  const imageStyle = getProjectImageStyle(theme, project.title)

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [onClose])

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[100] flex items-center justify-center p-6"
      style={{
        background: 'rgba(0,0,0,0.85)',
        fontFamily: "'Fira Code', monospace",
        animation: 'modalFadeIn 0.2s ease-out',
        willChange: 'opacity',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-h-[80vh] overflow-auto"
        style={{
          background: '#0A0A0A',
          border: '1px solid #39FF14',
          maxWidth: 600,
          boxShadow: '0 0 40px rgba(57,255,20,0.1)',
          animation: 'modalSlideUp 0.25s ease-out',
          transform: 'translateZ(0)',
          willChange: 'transform, opacity',
        }}
      >
        {/* Title bar */}
        <div
          className="flex justify-between items-center px-4 py-2"
          style={{
            borderBottom: '1px solid #1A331A',
            background: '#0D1A0D',
          }}
        >
          <span style={{ fontSize: 12, color: '#39FF14' }}>
            process://{project.title.toLowerCase().replace(/\s/g, '-')}
          </span>
          <button
            onClick={onClose}
            className="cursor-pointer"
            style={{
              background: 'none',
              border: '1px solid #333',
              color: '#666',
              fontSize: 11,
              padding: '3px 10px',
              fontFamily: 'inherit',
            }}
          >
            [×]
          </button>
        </div>

        {/* Project Image */}
        <div
          className="w-full h-[180px] flex items-center justify-center"
          style={{
            background: project.image ? `url(${project.image})` : imageStyle.background,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            borderBottom: '1px solid #1A331A',
          }}
        >
          {!project.image && (
            <div
              style={{
                fontSize: '2rem',
                fontWeight: 700,
                color: imageStyle.titleColor,
                textAlign: 'center',
                padding: '1.5rem',
                textShadow: imageStyle.titleShadow,
                wordWrap: 'break-word',
                overflowWrap: 'break-word',
                maxWidth: '90%',
                lineHeight: 1.15,
              }}
            >
              {project.title}
            </div>
          )}
        </div>

        {/* Content */}
        <div style={{ padding: '22px 26px' }}>
          {/* Title */}
          <div
            className="mb-1.5"
            style={{
              color: '#39FF14',
              fontSize: 20,
              fontWeight: 700,
            }}
          >
            {'>'} {project.title}
          </div>

          {/* Status and Date */}
          <div
            className="flex gap-4 mb-[18px]"
            style={{ fontSize: 12 }}
          >
            <span style={{ color: status.color }}>{status.label}</span>
            <span style={{ color: '#333' }}>|</span>
            <span style={{ color: '#2D7A2D' }}>since {project.date}</span>
          </div>

          {/* Description */}
          <div
            className="mb-[22px]"
            style={{
              color: '#4A8C4A',
              fontSize: 14,
              lineHeight: 1.7,
              borderLeft: '2px solid #1A331A',
              paddingLeft: 16,
            }}
          >
            {project.description}
          </div>

          {/* Tags */}
          {project.tags.length > 0 && (
            <div className="mb-[22px]">
              <div
                style={{
                  fontSize: 11,
                  color: '#333',
                  marginBottom: 10,
                }}
              >
                ## dependencies
              </div>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((t) => (
                  <span
                    key={t}
                    style={{
                      fontSize: 12,
                      color: '#39FF14',
                      background: '#0F1F0F',
                      border: '1px solid #1A331A',
                      padding: '3px 12px',
                    }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Links */}
          <div className="flex gap-2.5">
            {project.links.live && (
              <a
                href={project.links.live}
                style={{
                  color: '#0A0A0A',
                  background: '#39FF14',
                  padding: '8px 18px',
                  fontSize: 12,
                  textDecoration: 'none',
                  fontFamily: 'inherit',
                  fontWeight: 700,
                }}
              >
                &gt; demo
              </a>
            )}
            {project.links.github && (
              <a
                href={project.links.github}
                style={{
                  color: '#39FF14',
                  border: '1px solid #1A331A',
                  padding: '8px 18px',
                  fontSize: 12,
                  textDecoration: 'none',
                  fontFamily: 'inherit',
                }}
              >
                &gt; source
              </a>
            )}
            {project.links.docs && (
              <a
                href={project.links.docs}
                style={{
                  color: '#2D7A2D',
                  border: '1px solid #1A331A',
                  padding: '8px 18px',
                  fontSize: 12,
                  textDecoration: 'none',
                  fontFamily: 'inherit',
                }}
              >
                &gt; man
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
