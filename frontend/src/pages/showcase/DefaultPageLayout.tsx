import type { PageLayoutProps } from '@core/types'

export function DefaultPageLayout({ hero, toolbar, tagFilter, grid, footer }: PageLayoutProps) {
  return (
    <div className="min-h-screen bg-bg text-text">
      {/* Hero Section */}
      {hero}

      {/* Main Content */}
      <div className="max-w-[1400px] mx-auto px-4">
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
