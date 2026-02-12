import type { HeroLayoutProps } from '@core/types'

export function HeroLayout({ profile, children }: HeroLayoutProps) {
  return (
    <header
      style={{
        textAlign: 'center',
        marginBottom: 48,
        paddingBottom: 28,
        borderBottom: '2px solid #1A1A1A',
      }}
    >
      <div
        style={{
          fontSize: 9,
          fontWeight: 600,
          letterSpacing: '0.25em',
          textTransform: 'uppercase',
          color: '#999',
          fontFamily: 'var(--font-body)',
          marginBottom: 12,
        }}
      >
        Portfolio & Werkschau
      </div>
      <h1
        style={{
          fontSize: 52,
          fontWeight: 900,
          color: '#1A1A1A',
          fontFamily: 'var(--font-heading)',
          letterSpacing: '-0.03em',
          lineHeight: 1,
          marginBottom: 10,
        }}
      >
        {profile.name}
      </h1>
      <div
        style={{
          width: 40,
          height: 2,
          background: '#1A1A1A',
          margin: '0 auto 12px',
        }}
      />
      <p
        style={{
          fontSize: 15,
          color: '#888',
          fontFamily: "'Cormorant Garamond', serif",
          fontStyle: 'italic',
          fontWeight: 500,
        }}
      >
        {profile.tagline}
      </p>
      {children}
    </header>
  )
}
