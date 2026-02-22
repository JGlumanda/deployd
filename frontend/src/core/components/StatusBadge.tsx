import { cn } from '@core/utils/cn'
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
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 font-body font-medium rounded-sm bg-card border border-border text-text',
        size === 'sm' ? 'text-xs px-2 py-1' : 'text-sm px-3 py-1.5'
      )}
    >
      <span
        className={cn('rounded-full shrink-0', size === 'sm' ? 'w-1.5 h-1.5' : 'w-2 h-2')}
        style={{ backgroundColor: `var(--color-status-${status})` }}
      />
      {statusLabels[status]}
      {healthStatus && (
        <span
          role="img"
          aria-label={healthStatus === 'online' ? 'Online' : healthStatus === 'offline' ? 'Offline' : 'Checking status'}
          className={cn('rounded-full shrink-0 ml-1', size === 'sm' ? 'w-1.5 h-1.5' : 'w-2 h-2')}
          style={{
            backgroundColor:
              healthStatus === 'online'
                ? '#10b981'
                : healthStatus === 'offline'
                ? '#ef4444'
                : '#94a3b8'
          }}
          title={healthStatus === 'online' ? 'Online' : healthStatus === 'offline' ? 'Offline' : 'Checking...'}
        />
      )}
    </span>
  )
}
