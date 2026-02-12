import type { Project } from '@core/types'
import { StatusBadge } from '@core/components/StatusBadge'
import { TagList } from '@core/components/TagList'
import { ProjectLinks } from '@core/components/ProjectLinks'
import { generateGradient } from '@core/utils/gradient'

interface CardContentProps {
  project: Project
  maxVisibleTags: number
  titleMaxLines: number
  descriptionMaxChars: number
}

export function CardContent({
  project,
  maxVisibleTags,
  titleMaxLines,
  descriptionMaxChars
}: CardContentProps) {
  const truncatedDescription =
    project.description.length > descriptionMaxChars
      ? project.description.slice(0, descriptionMaxChars) + '...'
      : project.description

  return (
    <>
      {/* Thumbnail */}
      <div
        style={{
          width: '100%',
          height: '200px',
          background: project.image ? `url(${project.image})` : generateGradient(project.title),
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'relative'
        }}
      >
        {/* Featured Badge */}
        {project.featured && (
          <div
            role="img"
            aria-label="Featured project"
            style={{
              position: 'absolute',
              top: '0.75rem',
              right: '0.75rem',
              padding: '0.375rem 0.75rem',
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              color: '#fbbf24',
              fontSize: '0.75rem',
              fontFamily: 'var(--font-mono)',
              fontWeight: 600,
              borderRadius: 'var(--radius-sm)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem'
            }}
          >
            <span>★</span>
            <span>Featured</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div
        style={{
          padding: 'var(--spacing-card-padding)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          flex: 1
        }}
      >
        {/* Status Badge */}
        <StatusBadge status={project.status} size="sm" />

        {/* Title */}
        <h3
          style={{
            margin: 0,
            fontSize: '1.25rem',
            fontFamily: 'var(--font-heading)',
            fontWeight: 700,
            color: 'var(--color-heading)',
            lineHeight: 1.3,
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: titleMaxLines,
            WebkitBoxOrient: 'vertical',
            wordBreak: 'break-word'
          }}
        >
          {project.title}
        </h3>

        {/* Description */}
        <p
          style={{
            margin: 0,
            fontSize: '0.9375rem',
            fontFamily: 'var(--font-body)',
            color: 'var(--color-text)',
            lineHeight: 1.6
          }}
        >
          {truncatedDescription}
        </p>

        {/* Spacer to push tags and links to bottom */}
        <div style={{ flex: 1 }} />

        {/* Tags */}
        {project.tags.length > 0 && (
          <TagList tags={project.tags} max={maxVisibleTags} size="sm" />
        )}

        {/* Links */}
        <ProjectLinks links={project.links} size="sm" />
      </div>
    </>
  )
}
