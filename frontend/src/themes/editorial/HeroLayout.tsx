import type { HeroLayoutProps } from '@core/types'
import { MarkdownBio } from '@core/components/MarkdownBio'

export function HeroLayout({ profile, children }: HeroLayoutProps) {
  return (
    <header
      className="text-center mb-12 pb-7"
      style={{ borderBottom: '2px solid #1A1A1A' }}
    >
      <h1
        className="font-black font-heading leading-none mb-2.5"
        style={{
          fontSize: 52,
          color: '#1A1A1A',
          letterSpacing: '-0.03em',
        }}
      >
        {profile.name}
      </h1>
      <div
        className="mx-auto mb-3"
        style={{ width: 40, height: 2, background: '#1A1A1A' }}
      />
      <div className="flex justify-center">
        {profile.bio ? (
          <MarkdownBio
            content={profile.bio}
            style={{
              fontSize: 15,
              color: '#888',
              fontFamily: "'Cormorant Garamond', serif",
              fontStyle: 'italic',
              fontWeight: 500,
              textAlign: 'left',
              maxWidth: 800,
            }}
          />
        ) : (
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
        )}
      </div>
      {children}
    </header>
  )
}
