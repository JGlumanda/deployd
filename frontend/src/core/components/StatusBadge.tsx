import type { Project } from '@core/types'

interface StatusBadgeProps {
  status: Project['status']
  healthStatus?: 'online' | 'offline' | 'checking' | null
  size?: 'sm' | 'md'
}

const statusLabels: Record<Project['status'], string> = {
  active: 'Active',
  wip: 'In Progress',
  archived: 'Archived'
}

export function StatusBadge({ status, healthStatus, size = 'md' }: StatusBadgeProps) {
  const fontSize = size === 'sm' ? '0.75rem' : '0.875rem'
  const dotSize = size === 'sm' ? '6px' : '8px'
  const padding = size === 'sm' ? '0.25rem 0.5rem' : '0.375rem 0.75rem'

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding,
        fontSize,
        fontFamily: 'var(--font-body)',
        fontWeight: 500,
        borderRadius: 'var(--radius-sm)',
        backgroundColor: 'var(--color-card)',
        border: '1px solid var(--color-border)',
        color: 'var(--color-text)'
      }}
    >
      <span
        style={{
          width: dotSize,
          height: dotSize,
          borderRadius: '50%',
          backgroundColor: `var(--color-status-${status})`,
          flexShrink: 0
        }}
      />
      {statusLabels[status]}
      {healthStatus && (
        <span
          role="img"
          aria-label={healthStatus === 'online' ? 'Online' : healthStatus === 'offline' ? 'Offline' : 'Checking status'}
          style={{
            width: dotSize,
            height: dotSize,
            borderRadius: '50%',
            backgroundColor:
              healthStatus === 'online'
                ? '#10b981'
                : healthStatus === 'offline'
                ? '#ef4444'
                : '#94a3b8',
            flexShrink: 0,
            marginLeft: '0.25rem'
          }}
          title={healthStatus === 'online' ? 'Online' : healthStatus === 'offline' ? 'Offline' : 'Checking...'}
        />
      )}
    </span>
  )
}
