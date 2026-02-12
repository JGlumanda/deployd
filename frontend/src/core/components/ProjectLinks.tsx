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
  live: '↗',
  github: '⌘',
  docs: '📖'
}

export function ProjectLinks({ links, size = 'md' }: ProjectLinksProps) {
  const availableLinks = Object.entries(links).filter(([_, url]) => url) as Array<[keyof typeof linkLabels, string]>

  if (availableLinks.length === 0) return null

  const fontSize = size === 'sm' ? '0.8125rem' : '0.875rem'
  const padding = size === 'sm' ? '0.375rem 0.75rem' : '0.5rem 1rem'

  return (
    <div
      style={{
        display: 'flex',
        gap: '0.5rem',
        flexWrap: 'wrap'
      }}
    >
      {availableLinks.map(([key, url]) => (
        <a
          key={key}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.375rem',
            padding,
            fontSize,
            fontFamily: 'var(--font-body)',
            fontWeight: 500,
            color: 'var(--color-text)',
            backgroundColor: 'transparent',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-sm)',
            textDecoration: 'none',
            transition: 'all 0.2s ease',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--color-accent)'
            e.currentTarget.style.borderColor = 'var(--color-accent)'
            e.currentTarget.style.color = '#fff'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent'
            e.currentTarget.style.borderColor = 'var(--color-border)'
            e.currentTarget.style.color = 'var(--color-text)'
          }}
        >
          <span>{linkIcons[key]}</span>
          <span>{linkLabels[key]}</span>
        </a>
      ))}
    </div>
  )
}
