import type { CardWrapperProps } from '@core/types'
import { cn } from '@core/utils/cn'

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
      onFocus={() => onHover(index)}
      onBlur={() => onHover(null)}
      aria-label={`View details for ${project.title}`}
      className={cn(
        "border border-border rounded-md overflow-hidden cursor-pointer transition-all duration-300 h-full flex flex-col outline-none",
        hovered
          ? "bg-card-hover -translate-y-1 shadow-[0_12px_24px_rgba(0,0,0,0.15)]"
          : "bg-card shadow-[0_2px_8px_rgba(0,0,0,0.1)]"
      )}
    >
      {children}
    </div>
  )
}
