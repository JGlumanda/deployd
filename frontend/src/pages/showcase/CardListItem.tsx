import type { Project, Theme, Settings } from '@core/types'
import { StatusBadge } from '@core/components/StatusBadge'
import { TagList } from '@core/components/TagList'
import { formatDate } from '@core/utils/formatDate'

interface CardListItemProps {
  project: Project
  maxVisibleTags: number
  descriptionMaxChars: number
  onClick: (project: Project) => void
  theme?: Theme | null
  settings?: Settings
}

export function CardListItem({
  project,
  maxVisibleTags,
  descriptionMaxChars,
  onClick,
  theme = null,
  settings
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
      className="flex gap-6 p-6 bg-card border border-border rounded-md cursor-pointer transition-all duration-200 outline-none hover:bg-card-hover hover:border-accent focus:bg-card-hover focus:border-accent"
    >
      {/* Left: Title & Status */}
      <div className="flex-1 flex flex-col gap-3 min-w-0">
        {/* Title Row */}
        <div className="flex items-center gap-3">
          {project.featured && (
            <span
              role="img"
              aria-label="Featured project"
              className="text-[#fbbf24] text-lg shrink-0"
              title="Featured"
            >
              &#9733;
            </span>
          )}
          <h3 className="font-heading font-bold text-heading truncate flex-1 min-w-0 text-lg">
            {project.title}
          </h3>
          <StatusBadge status={project.status} size="sm" />
        </div>

        {/* Description */}
        <p className="text-[0.9375rem] font-body text-text leading-relaxed overflow-hidden [-webkit-box-orient:vertical] [display:-webkit-box] [-webkit-line-clamp:2]">
          {truncatedDescription}
        </p>

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
      </div>

      {/* Right: Date */}
      <div className="shrink-0 text-sm font-mono text-text-muted self-start">
        {formatDate(project.date)}
      </div>
    </div>
  )
}
