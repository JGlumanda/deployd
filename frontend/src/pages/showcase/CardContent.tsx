import type { Project, Theme, Settings } from '@core/types'
import { StatusBadge } from '@core/components/StatusBadge'
import { TagList } from '@core/components/TagList'
import { ProjectLinks } from '@core/components/ProjectLinks'
import { getProjectImageStyle } from '@core/utils/projectImage'

interface CardContentProps {
  project: Project
  maxVisibleTags: number
  titleMaxLines: number
  descriptionMaxChars: number
  theme?: Theme | null
  settings?: Settings
}

export function CardContent({
  project,
  maxVisibleTags,
  titleMaxLines,
  descriptionMaxChars,
  theme = null,
  settings
}: CardContentProps) {
  const imageStyle = getProjectImageStyle(theme, project.title)

  const truncatedDescription =
    project.description.length > descriptionMaxChars
      ? project.description.slice(0, descriptionMaxChars) + '...'
      : project.description

  return (
    <>
      {/* Thumbnail */}
      <div
        className="w-full h-[200px] relative flex items-center justify-center overflow-hidden"
        style={{
          background: project.image ? `url(${project.image})` : imageStyle.background,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        {/* Project Title Overlay (shown when no image) */}
        {!project.image && (
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

        {/* Featured Badge */}
        {project.featured && (
          <div
            role="img"
            aria-label="Featured project"
            className="absolute top-3 right-3 px-3 py-1.5 bg-black/80 text-[#fbbf24] text-xs font-mono font-semibold rounded-sm flex items-center gap-1 z-[1]"
          >
            <span>&#9733;</span>
            <span>Featured</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-card-padding flex flex-col gap-4 flex-1">
        {/* Status Badge */}
        <StatusBadge status={project.status} size="sm" />

        {/* Title */}
        <h3
          className="text-xl font-heading font-bold text-heading leading-snug overflow-hidden [-webkit-box-orient:vertical] [display:-webkit-box] break-words"
          style={{ WebkitLineClamp: titleMaxLines }}
        >
          {project.title}
        </h3>

        {/* Description */}
        <p className="text-[0.9375rem] font-body text-text leading-relaxed">
          {truncatedDescription}
        </p>

        {/* Spacer to push tags and links to bottom */}
        <div className="flex-1" />

        {/* Tags */}
        {project.tags.length > 0 && (
          <TagList
            tags={project.tags}
            max={maxVisibleTags}
            size="sm"
            showIcons={theme?.effects?.showTagIcons ?? false}
            tagData={settings ? [...settings.tags.predefined, ...settings.tags.custom] : []}
          />
        )}

        {/* Links */}
        <ProjectLinks links={project.links} size="sm" />
      </div>
    </>
  )
}
