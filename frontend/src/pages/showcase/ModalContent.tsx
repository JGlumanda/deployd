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
  healthStatus?: 'online' | 'offline' | 'checking' | null
}

export function ModalContent({ project, theme = null, settings, healthStatus }: ModalContentProps) {
  const imageStyle = getProjectImageStyle(theme, project.title)

  return (
    <div>
      {/* Header Image */}
      <div
        className="h-[200px] relative overflow-hidden flex items-center justify-center"
        style={{
          background: project.image ? `url(${project.image})` : imageStyle.background,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0'
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
            className="text-[2.5rem] font-heading font-black text-center p-6 max-w-[90%] leading-[1.15] -tracking-[0.02em] break-words"
            style={{
              color: imageStyle.titleColor,
              textShadow: imageStyle.titleShadow
            }}
          >
            {project.title}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-8 flex flex-col gap-6">
        {/* Header Row */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex flex-col gap-2 flex-1">
            {/* Title */}
            <h2 className="text-[2rem] font-heading font-bold text-heading leading-[1.2]">
              {project.title}
            </h2>

            {/* Status & Date */}
            <div className="flex items-center gap-4 flex-wrap">
              <StatusBadge status={project.status} />
              <span className="text-sm font-mono text-text-muted">
                {formatDate(project.date)}
              </span>
              {project.featured && (
                <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-accent-soft text-[#fbbf24] text-sm font-mono font-semibold rounded-sm">
                  <span>&#9733;</span>
                  <span>Featured</span>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Description */}
        <div>
          <p className="text-base font-body text-text leading-[1.7] whitespace-pre-wrap">
            {project.description}
          </p>
        </div>

        {/* Tech Stack */}
        {project.tags.length > 0 && (
          <div>
            <h3 className="mb-3 text-base font-heading font-semibold text-heading uppercase tracking-wider">
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
          <ProjectLinks links={project.links} size="md" healthStatus={healthStatus} />
        </div>
      </div>
    </div>
  )
}
