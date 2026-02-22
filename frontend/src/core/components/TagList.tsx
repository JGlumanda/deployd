import { cn } from '@core/utils/cn'
import type { Tag } from '@core/types'

interface TagListProps {
  tags: string[]
  max: number
  onClick?: (tag: string) => void
  activeTag?: string | null
  size?: 'sm' | 'md'
  showIcons?: boolean
  tagData?: Tag[]
}

export function TagList({ tags, max, onClick, activeTag, size = 'md', showIcons = false, tagData = [] }: TagListProps) {
  const visibleTags = tags.slice(0, max)
  const remainingCount = tags.length - max

  // Helper function to get tag icon
  const getTagIcon = (tagName: string): string | undefined => {
    const tagInfo = tagData.find(t => t.name === tagName)
    return tagInfo?.icon
  }

  return (
    <div className="flex flex-wrap gap-2 items-center">
      {visibleTags.map((tag) => {
        const icon = showIcons ? getTagIcon(tag) : undefined

        return (
          <span
            key={tag}
            onClick={onClick ? () => onClick(tag) : undefined}
            className={cn(
              'inline-flex items-center gap-1.5 font-mono font-medium rounded-sm transition-all duration-200 select-none',
              size === 'sm' ? 'text-xs px-2 py-1' : 'text-[0.8125rem] px-2.5 py-[0.3rem]',
              activeTag === tag
                ? 'bg-accent text-white'
                : 'bg-accent-soft text-text',
              onClick ? 'cursor-pointer' : 'cursor-default',
              onClick && activeTag !== tag && 'hover:bg-accent hover:text-white'
            )}
          >
            {icon && (
              <img
                src={icon}
                alt=""
                className={cn('object-contain shrink-0', size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4')}
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                }}
              />
            )}
            <span>{tag}</span>
          </span>
        )
      })}
      {remainingCount > 0 && (
        <span
          className={cn(
            'inline-block font-mono font-semibold rounded-sm bg-bg-alt text-text-muted border border-border',
            size === 'sm' ? 'text-xs px-2 py-1' : 'text-[0.8125rem] px-2.5 py-[0.3rem]'
          )}
        >
          +{remainingCount}
        </span>
      )}
    </div>
  )
}
