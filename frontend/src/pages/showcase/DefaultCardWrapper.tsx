import type { CardWrapperProps } from '@core/types'

export function DefaultCardWrapper({
  project,
  index,
  hovered,
  onHover,
  onClick,
  children
}: CardWrapperProps) {
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
      onMouseEnter={() => onHover(index)}
      onMouseLeave={() => onHover(null)}
      aria-label={`View details for ${project.title}`}
      style={{
        backgroundColor: hovered ? 'var(--color-card-hover)' : 'var(--color-card)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
        boxShadow: hovered
          ? '0 12px 24px rgba(0, 0, 0, 0.15)'
          : '0 2px 8px rgba(0, 0, 0, 0.1)',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        outline: 'none'
      }}
      onFocus={() => onHover(index)}
      onBlur={() => onHover(null)}
    >
      {children}
    </div>
  )
}
