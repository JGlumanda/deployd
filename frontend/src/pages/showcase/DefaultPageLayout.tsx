import type { PageLayoutProps } from '@core/types'

export function DefaultPageLayout({ hero, toolbar, tagFilter, grid, footer }: PageLayoutProps) {
  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--color-bg)',
        color: 'var(--color-text)'
      }}
    >
      {/* Hero Section */}
      {hero}

      {/* Main Content */}
      <div
        style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '0 1rem'
        }}
      >
        {/* Toolbar */}
        {toolbar}

        {/* Tag Filter */}
        {tagFilter}

        {/* Project Grid */}
        {grid}
      </div>

      {/* Footer */}
      {footer}
    </div>
  )
}
