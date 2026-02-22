import type { CardWrapperProps, ProjectStatus } from '@core/types'

const statusMap: Record<ProjectStatus, { label: string; bg: string; color: string }> = {
  active: { label: 'LIVE!', bg: '#A8E6CF', color: '#000' },
  wip: { label: 'WIP', bg: '#FFE66D', color: '#000' },
  archived: { label: 'RIP', bg: '#DDD', color: '#666' },
}

// Deterministic color generator from string
const COLORS = [
  '#FF6B6B',
  '#4ECDC4',
  '#FFE66D',
  '#A8E6CF',
  '#FF8B94',
  '#DDA0DD',
  '#98D8C8',
  '#F7DC6F',
  '#BB8FCE',
  '#85C1E9',
]

function getColor(str: string): string {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }
  return COLORS[Math.abs(hash) % COLORS.length]
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
  const barColor = getColor(project.title)
  const rotation = ((index % 5) - 2) * 0.4

  return (
    <div
      onClick={() => onClick(project)}
      onMouseEnter={() => onHover(index)}
      onMouseLeave={() => onHover(null)}
      className="flex flex-col h-full w-full cursor-pointer"
      style={{
        background: '#FFF',
        border: '3px solid #000',
        transition: 'all 0.15s',
        transform: hovered
          ? `rotate(0deg) translateY(-6px)`
          : `rotate(${rotation}deg)`,
        boxShadow: hovered ? '8px 8px 0 #000' : '4px 4px 0 #000',
      }}
    >
      {/* Color bar */}
      <div
        className="h-2"
        style={{
          background: barColor,
          borderBottom: '3px solid #000',
        }}
      />
      <div
        className="flex flex-col flex-1"
        style={{ padding: '16px 18px 18px' }}
      >
        {/* Top row */}
        <div className="flex justify-between items-center mb-2">
          {project.featured ? <span style={{ fontSize: 18 }}>⭐</span> : <span />}
          <span
            className="uppercase font-heading"
            style={{
              fontSize: 10,
              fontWeight: 900,
              padding: '2px 8px',
              background: status.bg,
              color: status.color,
              border: '2px solid #000',
            }}
          >
            {status.label}
          </span>
        </div>
        {children}
      </div>
    </div>
  )
}
