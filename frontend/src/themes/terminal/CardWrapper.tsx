import type { CardWrapperProps, ProjectStatus } from '@core/types'

const statusMap: Record<ProjectStatus, { label: string; color: string }> = {
  active: { label: 'RUNNING', color: '#39FF14' },
  wip: { label: 'BUILDING', color: '#FFD700' },
  archived: { label: 'STOPPED', color: '#666' },
}

export function CardWrapper({
  project,
  index,
  hovered,
  onHover,
  onClick,
  children,
}: CardWrapperProps) {
  const status = statusMap[project.status] || statusMap.active

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
        padding: '16px 18px',
        cursor: 'pointer',
        fontFamily: "'Fira Code', monospace",
        transition: 'all 0.15s',
        boxShadow: hovered
          ? '0 0 20px rgba(57,255,20,0.08), inset 0 0 20px rgba(57,255,20,0.03)'
          : 'none',
      }}
    >
      {/* Top line with PID and status */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 8,
          fontSize: 10,
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
              width: 5,
              height: 5,
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
          fontSize: 14,
          fontWeight: 700,
          marginBottom: 6,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {'>'} {project.title}
      </div>

      {children}
    </div>
  )
}
