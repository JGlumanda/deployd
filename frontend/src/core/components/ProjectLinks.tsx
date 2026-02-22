import { cn } from '@core/utils/cn'
import type { Project } from '@core/types'

interface ProjectLinksProps {
  links: Project['links']
  size?: 'sm' | 'md'
}

const linkLabels = {
  live: 'Demo',
  github: 'Code',
  docs: 'Docs'
}

const linkIcons = {
  live: '\u2197',
  github: '\u2318',
  docs: '\uD83D\uDCD6'
}

export function ProjectLinks({ links, size = 'md' }: ProjectLinksProps) {
  const availableLinks = Object.entries(links).filter(([, url]) => url) as Array<[keyof typeof linkLabels, string]>

  if (availableLinks.length === 0) return null

  return (
    <div className="flex gap-2 flex-wrap">
      {availableLinks.map(([key, url]) => (
        <a
          key={key}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className={cn(
            'inline-flex items-center gap-1.5 font-body font-medium text-text bg-transparent border border-border rounded-sm no-underline transition-all duration-200 cursor-pointer hover:bg-accent hover:border-accent hover:text-white',
            size === 'sm' ? 'text-[0.8125rem] px-3 py-1.5' : 'text-sm px-4 py-2'
          )}
        >
          <span>{linkIcons[key]}</span>
          <span>{linkLabels[key]}</span>
        </a>
      ))}
    </div>
  )
}
