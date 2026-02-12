interface TagListProps {
  tags: string[]
  max: number
  onClick?: (tag: string) => void
  activeTag?: string | null
  size?: 'sm' | 'md'
}

export function TagList({ tags, max, onClick, activeTag, size = 'md' }: TagListProps) {
  const visibleTags = tags.slice(0, max)
  const remainingCount = tags.length - max

  const fontSize = size === 'sm' ? '0.75rem' : '0.8125rem'
  const padding = size === 'sm' ? '0.25rem 0.5rem' : '0.3rem 0.625rem'

  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '0.5rem',
        alignItems: 'center'
      }}
    >
      {visibleTags.map((tag) => (
        <span
          key={tag}
          onClick={onClick ? () => onClick(tag) : undefined}
          style={{
            display: 'inline-block',
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
          {tag}
        </span>
      ))}
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
