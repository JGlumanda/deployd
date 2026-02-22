import type { CardWrapperProps, ProjectStatus } from '@core/types'
import { getProjectImageStyle } from '@core/utils/projectImage'
import { getTheme } from '@themes/registry'

const statusMap: Record<ProjectStatus, { label: string; color: string }> = {
  active: { label: 'RUNNING', color: '#39FF14' },
  wip: { label: 'BUILDING', color: '#FFD700' },
  archived: { label: 'STOPPED', color: '#666' },
}

const MAX_TAGS = 4

export function CardWrapper({
  project,
  index,
  hovered,
  onHover,
  onClick,
}: CardWrapperProps) {
  const status = statusMap[project.status] || statusMap.active
  const tags = project.tags.slice(0, MAX_TAGS)
  const extra = Math.max(0, project.tags.length - MAX_TAGS)
  const theme = getTheme('terminal') || null
  const imageStyle = getProjectImageStyle(theme, project.title)

  return (
    <div
      onClick={() => onClick(project)}
      onMouseEnter={() => onHover(index)}
      onMouseLeave={() => onHover(null)}
      className="flex flex-col h-full w-full cursor-pointer overflow-hidden"
      style={{
        background: hovered ? '#0D1A0D' : '#0A0A0A',
        border: `1px solid ${hovered ? '#39FF14' : '#1A331A'}`,
        fontFamily: "'Fira Code', monospace",
        transition: 'all 0.15s',
        boxShadow: hovered
          ? '0 0 20px rgba(57,255,20,0.08), inset 0 0 20px rgba(57,255,20,0.03)'
          : 'none',
      }}
    >
      {/* Image/Title area */}
      <div
        className="w-full h-[140px] flex items-center justify-center mb-3"
        style={{
          background: project.image ? `url(${project.image})` : imageStyle.background,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          border: '1px solid #1A331A',
        }}
      >
        {!project.image && (
          <div
            className="text-center p-4 max-w-[90%] leading-[1.15] break-words"
            style={{
              fontSize: '1.75rem',
              fontWeight: 700,
              color: imageStyle.titleColor,
              textShadow: imageStyle.titleShadow,
            }}
          >
            {project.title}
          </div>
        )}
      </div>

      {/* Content area with padding */}
      <div
        className="flex flex-col flex-1"
        style={{ padding: '0 16px 16px 16px' }}
      >
      {/* Top line with PID and status */}
      <div
        className="flex justify-between items-center mb-2.5"
        style={{ fontSize: 11 }}
      >
        <span style={{ color: '#39FF14', opacity: 0.5 }}>
          {project.featured ? '★ ' : ''}PID:{project.id}
        </span>
        <span
          style={{
            color: status.color,
            display: 'flex',
            alignItems: 'center',
            gap: 4,
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: status.color,
              animation:
                project.status === 'active' ? 'blink 2s infinite' : 'none',
            }}
          />
          {status.label}
        </span>
      </div>

      {/* Title with > prefix */}
      <div
        className="truncate mb-2"
        style={{
          color: '#39FF14',
          fontSize: 16,
          fontWeight: 700,
        }}
      >
        {'>'} {project.title}
      </div>

      {/* Description with # prefix */}
      <div
        className="overflow-hidden [-webkit-box-orient:vertical] [display:-webkit-box] [-webkit-line-clamp:2] mb-3.5"
        style={{
          color: '#4A8C4A',
          fontSize: 13,
          lineHeight: 1.5,
        }}
      >
        # {project.description}
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Tags */}
      {project.tags.length > 0 && (
        <div className="flex gap-1.5 flex-nowrap overflow-hidden mb-3">
          {tags.map((t) => (
            <span
              key={t}
              style={{
                fontSize: 11,
                color: '#2D7A2D',
                background: '#0F1F0F',
                border: '1px solid #1A331A',
                padding: '2px 10px',
                whiteSpace: 'nowrap',
              }}
            >
              {t}
            </span>
          ))}
          {extra > 0 && (
            <span
              style={{
                fontSize: 11,
                color: '#1A331A',
                padding: '2px 8px',
              }}
            >
              +{extra}
            </span>
          )}
        </div>
      )}

      {/* Links */}
      <div
        className="flex gap-2.5"
        style={{ fontSize: 11, color: '#2D7A2D' }}
      >
        {project.links.live && (
          <span style={{ color: '#39FF14' }}>[demo]</span>
        )}
        {project.links.github && <span>[src]</span>}
        {project.links.docs && <span>[man]</span>}
      </div>
      </div>
    </div>
  )
}
