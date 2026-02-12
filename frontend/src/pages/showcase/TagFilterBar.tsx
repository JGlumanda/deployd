interface TagFilterBarProps {
  tags: string[]
  activeTag: string | null
  onTagClick: (tag: string | null) => void
}

export function TagFilterBar({ tags, activeTag, onTagClick }: TagFilterBarProps) {
  if (tags.length === 0) return null

  return (
    <div
      style={{
        padding: '1.5rem 0',
        borderBottom: '1px solid var(--color-border)'
      }}
    >
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.75rem',
          alignItems: 'center'
        }}
      >
        <span
          style={{
            fontSize: '0.875rem',
            fontFamily: 'var(--font-body)',
            fontWeight: 600,
            color: 'var(--color-text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}
        >
          Filter by tag:
        </span>

        {/* Clear filter button */}
        {activeTag && (
          <button
            onClick={() => onTagClick(null)}
            aria-label="Clear tag filter"
            style={{
              padding: '0.375rem 0.75rem',
              fontSize: '0.8125rem',
              fontFamily: 'var(--font-mono)',
              fontWeight: 500,
              color: 'var(--color-text-muted)',
              backgroundColor: 'transparent',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-sm)',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--color-accent)'
              e.currentTarget.style.color = 'var(--color-accent)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--color-border)'
              e.currentTarget.style.color = 'var(--color-text-muted)'
            }}
          >
            Clear ×
          </button>
        )}

        {/* Tag chips */}
        {tags.map((tag) => (
          <button
            key={tag}
            onClick={() => onTagClick(activeTag === tag ? null : tag)}
            aria-label={`Filter by ${tag}`}
            aria-pressed={activeTag === tag}
            style={{
              padding: '0.375rem 0.75rem',
              fontSize: '0.8125rem',
              fontFamily: 'var(--font-mono)',
              fontWeight: 500,
              color: activeTag === tag ? '#fff' : 'var(--color-text)',
              backgroundColor: activeTag === tag ? 'var(--color-accent)' : 'var(--color-accent-soft)',
              border: '1px solid',
              borderColor: activeTag === tag ? 'var(--color-accent)' : 'transparent',
              borderRadius: 'var(--radius-sm)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              userSelect: 'none'
            }}
            onMouseEnter={(e) => {
              if (activeTag !== tag) {
                e.currentTarget.style.backgroundColor = 'var(--color-accent)'
                e.currentTarget.style.color = '#fff'
              }
            }}
            onMouseLeave={(e) => {
              if (activeTag !== tag) {
                e.currentTarget.style.backgroundColor = 'var(--color-accent-soft)'
                e.currentTarget.style.color = 'var(--color-text)'
              }
            }}
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  )
}
