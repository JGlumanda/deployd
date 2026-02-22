import type { PageLayoutProps } from '@core/types'

export function PageLayout({ hero, toolbar, tagFilter, grid }: PageLayoutProps) {
  return (
    <div
      className="min-h-screen"
      style={{
        background: '#050505',
        fontFamily: "'Fira Code', monospace",
        color: '#39FF14',
      }}
    >
      <div
        className="max-w-[900px] mx-auto relative z-[1]"
        style={{ padding: '48px 24px 80px' }}
      >
        {hero}
        {toolbar}
        {tagFilter}
        {grid}

        {/* Terminal-specific footer */}
        <footer
          className="mt-12 pt-4 text-center"
          style={{
            borderTop: '1px solid #0F1F0F',
            fontSize: 11,
            color: '#1A331A',
          }}
        >
          EOF
        </footer>
      </div>
    </div>
  )
}
