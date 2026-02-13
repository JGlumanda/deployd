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

  const fontSize = size === 'sm' ? '0.75rem' : '0.8125rem'
  const padding = size === 'sm' ? '0.25rem 0.5rem' : '0.3rem 0.625rem'

  // Helper function to get tag icon
  const getTagIcon = (tagName: string): string | undefined => {
    const tagInfo = tagData.find(t => t.name === tagName)
    return tagInfo?.icon
  }

  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '0.5rem',
        alignItems: 'center'
      }}
    >
      {visibleTags.map((tag) => {
        const icon = showIcons ? getTagIcon(tag) : undefined

        return (
          <span
            key={tag}
            onClick={onClick ? () => onClick(tag) : undefined}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.375rem',
              padding,
              fontSize,
              fontFamily: 'var(--font-mono)',
              fontWeight: 500,
              borderRadius: 'var(--radius-sm)',
              backgroundColor:
                activeTag === tag ? 'var(--color-accent)' : 'var(--color-accent-soft)',
              color: activeTag === tag ? '#fff' : 'var(--color-text)',
              cursor: onClick ? 'pointer' : 'default',
              transition: 'all 0.2s ease',
              userSelect: 'none'
            }}
            onMouseEnter={(e) => {
              if (onClick && activeTag !== tag) {
                e.currentTarget.style.backgroundColor = 'var(--color-accent)'
                e.currentTarget.style.color = '#fff'
              }
            }}
            onMouseLeave={(e) => {
              if (onClick && activeTag !== tag) {
                e.currentTarget.style.backgroundColor = 'var(--color-accent-soft)'
                e.currentTarget.style.color = 'var(--color-text)'
              }
            }}
          >
            {icon && (
              <img
                src={icon}
                alt=""
                style={{
                  width: size === 'sm' ? '14px' : '16px',
                  height: size === 'sm' ? '14px' : '16px',
                  objectFit: 'contain',
                  flexShrink: 0
                }}
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
          style={{
            display: 'inline-block',
            padding,
            fontSize,
            fontFamily: 'var(--font-mono)',
            fontWeight: 600,
            borderRadius: 'var(--radius-sm)',
            backgroundColor: 'var(--color-bg-alt)',
            color: 'var(--color-text-muted)',
            border: '1px solid var(--color-border)'
          }}
        >
          +{remainingCount}
        </span>
      )}
    </div>
  )
}
