import type { Theme, Settings } from '@core/types'
import { cn } from '@core/utils/cn'

interface TagFilterBarProps {
  tags: string[]
  activeTag: string | null
  onTagClick: (tag: string | null) => void
  theme?: Theme | null
  settings?: Settings
}

export function TagFilterBar({ tags, activeTag, onTagClick, theme = null, settings }: TagFilterBarProps) {
  if (tags.length === 0) return null

  const showIcons = theme?.effects?.showTagIcons ?? false
  const allTags = settings ? [...settings.tags.predefined, ...settings.tags.custom] : []

  // Helper function to get tag icon
  const getTagIcon = (tagName: string): string | undefined => {
    const tagInfo = allTags.find(t => t.name === tagName)
    return tagInfo?.icon
  }

  return (
    <div className="py-6 border-b border-border">
      <div className="flex flex-wrap gap-3 items-center">
        <span className="text-sm font-body font-semibold text-text-muted uppercase tracking-wider">
          Filter by tag:
        </span>

        {/* Clear filter button */}
        {activeTag && (
          <button
            onClick={() => onTagClick(null)}
            aria-label="Clear tag filter"
            className="px-3 py-1.5 text-[0.8125rem] font-mono font-medium text-text-muted bg-transparent border border-border rounded-sm cursor-pointer transition-all duration-200 hover:border-accent hover:text-accent"
          >
            Clear &times;
          </button>
        )}

        {/* Tag chips */}
        {tags.map((tag) => {
          const icon = showIcons ? getTagIcon(tag) : undefined

          return (
            <button
              key={tag}
              onClick={() => onTagClick(activeTag === tag ? null : tag)}
              aria-label={`Filter by ${tag}`}
              aria-pressed={activeTag === tag}
              className={cn(
                "inline-flex items-center gap-1.5 px-3 py-1.5 text-[0.8125rem] font-mono font-medium border rounded-sm cursor-pointer transition-all duration-200 select-none",
                activeTag === tag
                  ? "text-white bg-accent border-accent"
                  : "text-text bg-accent-soft border-transparent hover:bg-accent hover:text-white"
              )}
            >
              {icon && (
                <img
                  src={icon}
                  alt=""
                  className="w-3.5 h-3.5 object-contain shrink-0"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                  }}
                />
              )}
              <span>{tag}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
