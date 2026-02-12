import type { PageLayoutProps } from '@core/types'

export function PageLayout({
  hero,
  toolbar,
  grid,
  footer,
  sidebar,
}: PageLayoutProps) {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--color-bg)',
        fontFamily: 'var(--font-body)',
      }}
    >
      <div
        style={{
          maxWidth: 940,
          margin: '0 auto',
          padding: '48px 28px 80px',
        }}
      >
        {hero}

        {/* Two-column magazine layout */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 280px',
            gap: 48,
          }}
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
