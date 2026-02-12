import type { Project } from '@core/types'
import { StatusBadge } from '@core/components/StatusBadge'
import { TagList } from '@core/components/TagList'
import { formatDate } from '@core/utils/formatDate'

interface CardListItemProps {
  project: Project
  maxVisibleTags: number
  descriptionMaxChars: number
  onClick: (project: Project) => void
}

export function CardListItem({
  project,
  maxVisibleTags,
  descriptionMaxChars,
  onClick
}: CardListItemProps) {
  const truncatedDescription =
    project.description.length > descriptionMaxChars
      ? project.description.slice(0, descriptionMaxChars) + '...'
      : project.description

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onClick(project)
    }
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onClick(project)}
      onKeyDown={handleKeyDown}
      aria-label={`View details for ${project.title}`}
      style={{
        display: 'flex',
        gap: '1.5rem',
        padding: '1.5rem',
        backgroundColor: 'var(--color-card)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-md)',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        outline: 'none'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = 'var(--color-card-hover)'
        e.currentTarget.style.borderColor = 'var(--color-accent)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = 'var(--color-card)'
        e.currentTarget.style.borderColor = 'var(--color-border)'
      }}
      onFocus={(e) => {
        e.currentTarget.style.backgroundColor = 'var(--color-card-hover)'
        e.currentTarget.style.borderColor = 'var(--color-accent)'
      }}
      onBlur={(e) => {
        e.currentTarget.style.backgroundColor = 'var(--color-card)'
        e.currentTarget.style.borderColor = 'var(--color-border)'
      }}
    >
      {/* Left: Title & Status */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
          minWidth: 0
        }}
      >
        {/* Title Row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}
        >
          {project.featured && (
            <span
              role="img"
              aria-label="Featured project"
              style={{
                color: '#fbbf24',
                fontSize: '1.125rem',
                flexShrink: 0
              }}
              title="Featured"
            >
              ★
            </span>
          )}
          <h3
            style={{
              margin: 0,
              fontSize: '1.125rem',
              fontFamily: 'var(--font-heading)',
              fontWeight: 700,
              color: 'var(--color-heading)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              flex: 1,
              minWidth: 0
            }}
          >
            {project.title}
          </h3>
          <StatusBadge status={project.status} size="sm" />
        </div>

        {/* Description */}
        <p
          style={{
            margin: 0,
            fontSize: '0.9375rem',
            fontFamily: 'var(--font-body)',
            color: 'var(--color-text)',
            lineHeight: 1.6,
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical'
          }}
        >
          {truncatedDescription}
        </p>

        {/* Tags */}
        {project.tags.length > 0 && (
          <TagList tags={project.tags} max={maxVisibleTags} size="sm" />
        )}
      </div>

      {/* Right: Date */}
      <div
        style={{
          flexShrink: 0,
          fontSize: '0.875rem',
          fontFamily: 'var(--font-mono)',
          color: 'var(--color-text-muted)',
          alignSelf: 'flex-start'
        }}
      >
        {formatDate(project.date)}
      </div>
    </div>
  )
}
