import type { HeroLayoutProps } from '@core/types'
import { MarkdownBio } from '@core/components/MarkdownBio'

export function HeroLayout({ profile, children }: HeroLayoutProps) {
  return (
    <header
      className="mb-10 pb-6"
      style={{ borderBottom: '1px solid #1A331A' }}
    >
      <div
        className="mb-2"
        style={{ fontSize: 13, color: '#1A331A' }}
      >
        Last login: {new Date().toDateString()} on ttys001
      </div>
      <div
        className="mb-1"
        style={{
          fontSize: 28,
          fontWeight: 700,
          color: '#39FF14',
        }}
      >
        {profile.name.toLowerCase().replace(/\s+/g, '')}@showcase{' '}
        <span style={{ animation: 'cursor 1s infinite' }}>_</span>
      </div>
      <div
        className="flex flex-col items-center"
        style={{
          fontSize: 14,
          color: '#2D7A2D',
          lineHeight: 1.6,
          maxWidth: '100%',
        }}
      >
        <div className="max-w-[800px] w-full">
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
