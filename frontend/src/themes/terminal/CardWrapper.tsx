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
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        width: '100%',
        background: hovered ? '#0D1A0D' : '#0A0A0A',
        border: `1px solid ${hovered ? '#39FF14' : '#1A331A'}`,
        cursor: 'pointer',
        fontFamily: "'Fira Code', monospace",
        transition: 'all 0.15s',
        boxShadow: hovered
          ? '0 0 20px rgba(57,255,20,0.08), inset 0 0 20px rgba(57,255,20,0.03)'
          : 'none',
        overflow: 'hidden',
      }}
    >
      {/* Image/Title area */}
      {!project.image && (
        <div
          style={{
            width: '100%',
            height: '140px',
            background: imageStyle.background,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '12px',
            border: '1px solid #1A331A',
          }}
        >
          <div
            style={{
              fontSize: '1.75rem',
              fontWeight: 700,
              color: imageStyle.titleColor,
              textAlign: 'center',
              padding: '1rem',
              textShadow: imageStyle.titleShadow,
              wordWrap: 'break-word',
              overflowWrap: 'break-word',
              maxWidth: '90%',
              lineHeight: 1.15,
            }}
          >
            {project.title}
          </div>
        </div>
      )}

      {/* Content area with padding */}
      <div
        style={{
          padding: '0 16px 16px 16px',
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
        }}
      >
      {/* Top line with PID and status */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 10,
          fontSize: 11,
        }}
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
        style={{
          color: '#39FF14',
          fontSize: 16,
          fontWeight: 700,
          marginBottom: 8,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {'>'} {project.title}
      </div>

      {/* Description with # prefix */}
      <div
        style={{
          color: '#4A8C4A',
          fontSize: 13,
          lineHeight: 1.5,
          marginBottom: 14,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}
      >
        # {project.description}
      </div>

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* Tags */}
      {project.tags.length > 0 && (
        <div
          style={{
            display: 'flex',
            gap: 6,
            flexWrap: 'nowrap',
            overflow: 'hidden',
            marginBottom: 12,
          }}
        >
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
        style={{
          fontSize: 11,
          color: '#2D7A2D',
          display: 'flex',
          gap: 10,
        }}
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
