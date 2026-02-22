import type { PageLayoutProps } from '@core/types'

export function PageLayout({
  hero,
  toolbar,
  grid,
  footer,
  sidebar,
}: PageLayoutProps) {
  return (
    <div className="min-h-screen bg-bg font-body">
      <div
        className="max-w-[940px] mx-auto"
        style={{ padding: '48px 28px 80px' }}
      >
        {hero}

        {/* Two-column magazine layout */}
        <div
          className="grid gap-12"
          style={{ gridTemplateColumns: '1fr 280px' }}
        >
          {/* Main content column */}
          <div>
            {toolbar}
            {grid}
          </div>

          {/* Sidebar */}
          {sidebar && <aside>{sidebar}</aside>}
        </div>

        {footer}
      </div>
    </div>
  )
}
