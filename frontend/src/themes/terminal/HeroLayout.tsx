import type { HeroLayoutProps } from '@core/types'

export function HeroLayout({ profile, children }: HeroLayoutProps) {
  return (
    <header
      style={{
        marginBottom: 40,
        borderBottom: '1px solid #1A331A',
        paddingBottom: 24,
      }}
    >
      <div
        style={{
          fontSize: 11,
          color: '#1A331A',
          marginBottom: 8,
        }}
      >
        Last login: {new Date().toDateString()} on ttys001
      </div>
      <div
        style={{
          fontSize: 24,
          fontWeight: 700,
          marginBottom: 4,
          color: '#39FF14',
        }}
      >
        {profile.name.toLowerCase().replace(/\s+/g, '')}@showcase{' '}
        <span style={{ animation: 'cursor 1s infinite' }}>_</span>
      </div>
      <div
        style={{
          fontSize: 12,
          color: '#2D7A2D',
          lineHeight: 1.6,
          maxWidth: 560,
        }}
      >
        $ whoami
        <br />
        <span style={{ color: '#4A8C4A' }}>{profile.bio || profile.tagline}</span>
      </div>
      {children}
    </header>
  )
}
