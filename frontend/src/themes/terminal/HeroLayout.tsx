import type { HeroLayoutProps } from '@core/types'
import { MarkdownBio } from '@core/components/MarkdownBio'

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
          fontSize: 13,
          color: '#1A331A',
          marginBottom: 8,
        }}
      >
        Last login: {new Date().toDateString()} on ttys001
      </div>
      <div
        style={{
          fontSize: 28,
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
          fontSize: 14,
          color: '#2D7A2D',
          lineHeight: 1.6,
          maxWidth: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <div style={{ maxWidth: 800, width: '100%' }}>
          <div>
            $ whoami
            <br />
          </div>
          {profile.bio ? (
            <MarkdownBio
              content={profile.bio}
              style={{
                color: '#4A8C4A',
                fontSize: 14,
                textAlign: 'left',
              }}
            />
          ) : (
            <span style={{ color: '#4A8C4A' }}>{profile.tagline}</span>
          )}
        </div>
      </div>
      {children}
    </header>
  )
}
