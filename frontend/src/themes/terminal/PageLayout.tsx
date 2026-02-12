import type { PageLayoutProps } from '@core/types'

export function PageLayout({ hero, toolbar, tagFilter, grid, footer }: PageLayoutProps) {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#050505',
        fontFamily: "'Fira Code', monospace",
        color: '#39FF14',
      }}
    >
      <div
        style={{
          maxWidth: 900,
          margin: '0 auto',
          padding: '48px 24px 80px',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {hero}
        {toolbar}
        {tagFilter}
        {grid}

        {/* Terminal-specific footer */}
        <footer
          style={{
            marginTop: 48,
            paddingTop: 16,
            borderTop: '1px solid #0F1F0F',
            fontSize: 11,
            color: '#1A331A',
            textAlign: 'center',
          }}
        >
          EOF
        </footer>
      </div>
    </div>
  )
}
