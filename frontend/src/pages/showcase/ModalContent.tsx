import type { Project, Theme, Settings } from '@core/types'
import { StatusBadge } from '@core/components/StatusBadge'
import { TagList } from '@core/components/TagList'
import { ProjectLinks } from '@core/components/ProjectLinks'
import { formatDate } from '@core/utils/formatDate'
import { getProjectImageStyle } from '@core/utils/projectImage'

interface ModalContentProps {
  project: Project
  theme?: Theme | null
  settings?: Settings
}

export function ModalContent({ project, theme = null, settings }: ModalContentProps) {
  const imageStyle = getProjectImageStyle(theme, project.title)

  return (
    <div>
      {/* Header Image */}
      <div
        style={{
          height: '200px',
          background: project.image ? `url(${project.image})` : imageStyle.background,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'relative',
          borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {/* Title Watermark - only show when user uploaded an image */}
        {project.image ? (
          <div
            style={{
              position: 'absolute',
              bottom: '1rem',
              left: '1.5rem',
              fontSize: '3rem',
              fontFamily: 'var(--font-heading)',
              fontWeight: 900,
              color: 'rgba(255, 255, 255, 0.2)',
              textTransform: 'uppercase',
              letterSpacing: '-0.05em',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              maxWidth: 'calc(100% - 3rem)',
              textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)'
            }}
          >
            {project.title}
          </div>
        ) : (
          /* Show title overlay when no image */
          <div
            style={{
              fontSize: '2.5rem',
              fontFamily: 'var(--font-heading)',
              fontWeight: 900,
              color: imageStyle.titleColor,
              textAlign: 'center',
              padding: '1.5rem',
              textShadow: imageStyle.titleShadow,
              maxWidth: '90%',
              lineHeight: 1.15,
              letterSpacing: '-0.02em',
              wordWrap: 'break-word',
              overflowWrap: 'break-word'
            }}
          >
            {project.title}
          </div>
        )}
      </div>

      {/* Content */}
      <div
        style={{
          padding: '2rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem'
        }}
      >
        {/* Header Row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: '1rem',
            flexWrap: 'wrap'
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
            {/* Title */}
            <h2
              style={{
                margin: 0,
                fontSize: '2rem',
                fontFamily: 'var(--font-heading)',
                fontWeight: 700,
                color: 'var(--color-heading)',
                lineHeight: 1.2
              }}
            >
              {project.title}
            </h2>

            {/* Status & Date */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <StatusBadge status={project.status} />
              <span
                style={{
                  fontSize: '0.875rem',
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--color-text-muted)'
                }}
              >
                {formatDate(project.date)}
              </span>
              {project.featured && (
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    padding: '0.375rem 0.75rem',
                    backgroundColor: 'var(--color-accent-soft)',
                    color: '#fbbf24',
                    fontSize: '0.875rem',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 600,
                    borderRadius: 'var(--radius-sm)'
                  }}
                >
                  <span>★</span>
                  <span>Featured</span>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Description */}
        <div>
          <p
            style={{
              margin: 0,
              fontSize: '1rem',
              fontFamily: 'var(--font-body)',
              color: 'var(--color-text)',
              lineHeight: 1.7,
              whiteSpace: 'pre-wrap'
            }}
          >
            {project.description}
          </p>
        </div>

        {/* Tech Stack */}
        {project.tags.length > 0 && (
          <div>
            <h3
              style={{
                margin: '0 0 0.75rem 0',
                fontSize: '1rem',
                fontFamily: 'var(--font-heading)',
                fontWeight: 600,
                color: 'var(--color-heading)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}
            >
              Tech Stack
            </h3>
            <TagList
              tags={project.tags}
              max={project.tags.length}
              showIcons={theme?.effects?.showTagIcons ?? false}
              tagData={settings ? [...settings.tags.predefined, ...settings.tags.custom] : []}
            />
          </div>
        )}

        {/* Links */}
        <div>
          <ProjectLinks links={project.links} size="md" />
        </div>
      </div>
    </div>
  )
}
