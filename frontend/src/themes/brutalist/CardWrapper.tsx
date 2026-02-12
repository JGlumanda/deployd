import type { CardWrapperProps } from '@core/types'

const statusMap = {
  active: { label: 'LIVE!', bg: '#A8E6CF', color: '#000' },
  wip: { label: 'WIP', bg: '#FFE66D', color: '#000' },
  archived: { label: 'RIP', bg: '#DDD', color: '#666' },
} as const

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
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        width: '100%',
        background: '#FFF',
        border: '3px solid #000',
        padding: 0,
        cursor: 'pointer',
        transition: 'all 0.15s',
        transform: hovered
          ? `rotate(0deg) translateY(-6px)`
          : `rotate(${rotation}deg)`,
        boxShadow: hovered ? '8px 8px 0 #000' : '4px 4px 0 #000',
      }}
    >
      {/* Color bar */}
      <div
        style={{
          height: 8,
          background: barColor,
          borderBottom: '3px solid #000',
        }}
      />
      <div
        style={{
          padding: '16px 18px 18px',
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
        }}
      >
        {/* Top row */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 8,
          }}
        >
          {project.featured ? <span style={{ fontSize: 18 }}>⭐</span> : <span />}
          <span
            style={{
              fontSize: 10,
              fontWeight: 900,
              padding: '2px 8px',
              background: status.bg,
              color: status.color,
              fontFamily: 'var(--font-heading)',
              border: '2px solid #000',
              textTransform: 'uppercase',
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
