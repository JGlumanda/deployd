import type { HeroLayoutProps } from '@core/types'

export function DefaultHeroLayout({ profile }: HeroLayoutProps) {
  const initials = profile.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1.5rem',
        padding: '3rem 1rem',
        textAlign: 'center'
      }}
    >
      {/* Avatar or Initials */}
      <div
        style={{
          width: '120px',
          height: '120px',
          borderRadius: '50%',
          overflow: 'hidden',
          border: '3px solid var(--color-accent)',
          backgroundColor: 'var(--color-accent-soft)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {profile.avatar ? (
          <img
            src={profile.avatar}
            alt={profile.name}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
        ) : (
          <span
            style={{
              fontSize: '2.5rem',
              fontFamily: 'var(--font-heading)',
              fontWeight: 700,
              color: 'var(--color-accent)'
            }}
          >
            {initials}
          </span>
        )}
      </div>

      {/* Name */}
      <h1
        style={{
          margin: 0,
          fontSize: '2.5rem',
          fontFamily: 'var(--font-heading)',
          fontWeight: 700,
          color: 'var(--color-heading)',
          lineHeight: 1.2
        }}
      >
        {profile.name}
      </h1>

      {/* Tagline */}
      {profile.tagline && (
        <p
          style={{
            margin: 0,
            fontSize: '1.25rem',
            fontFamily: 'var(--font-body)',
            color: 'var(--color-text-muted)',
            maxWidth: '600px'
          }}
        >
          {profile.tagline}
        </p>
      )}

      {/* Bio */}
      {profile.bio && (
        <p
          style={{
            margin: 0,
            fontSize: '1rem',
            fontFamily: 'var(--font-body)',
            color: 'var(--color-text)',
            maxWidth: '700px',
            lineHeight: 1.6
          }}
        >
          {profile.bio}
        </p>
      )}

      {/* Social Links */}
      {Object.keys(profile.links).length > 0 && (
        <div
          style={{
            display: 'flex',
            gap: '1rem',
            flexWrap: 'wrap',
            justifyContent: 'center',
            marginTop: '0.5rem'
          }}
        >
          {Object.entries(profile.links).map(([key, url]) => {
            if (!url) return null

            const labels: Record<string, string> = {
              github: 'GitHub',
              linkedin: 'LinkedIn',
              email: 'Email',
              website: 'Website',
              x: 'X',
              mastodon: 'Mastodon'
            }

            const label = labels[key] || key.charAt(0).toUpperCase() + key.slice(1)
            const href = key === 'email' && !url.startsWith('mailto:') ? `mailto:${url}` : url

            return (
              <a
                key={key}
                href={href}
                target={key === 'email' ? undefined : '_blank'}
                rel={key === 'email' ? undefined : 'noopener noreferrer'}
                style={{
                  padding: '0.5rem 1rem',
                  fontSize: '0.875rem',
                  fontFamily: 'var(--font-body)',
                  fontWeight: 500,
                  color: 'var(--color-text)',
                  backgroundColor: 'var(--color-card)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-md)',
                  textDecoration: 'none',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--color-accent)'
                  e.currentTarget.style.borderColor = 'var(--color-accent)'
                  e.currentTarget.style.color = '#fff'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--color-card)'
                  e.currentTarget.style.borderColor = 'var(--color-border)'
                  e.currentTarget.style.color = 'var(--color-text)'
                }}
              >
                {label}
              </a>
            )
          })}
        </div>
      )}
    </div>
  )
}
