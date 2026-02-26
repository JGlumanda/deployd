import type { HeroLayoutProps } from '@core/types'
import { MarkdownBio } from '@core/components/MarkdownBio'

export function DefaultHeroLayout({ profile }: HeroLayoutProps) {
  const initials = profile.name
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <div className="flex flex-col items-center gap-6 py-12 px-4 text-center">
      {/* Avatar or Initials */}
      <div className="w-[120px] h-[120px] rounded-full overflow-hidden border-[3px] border-accent bg-accent-soft flex items-center justify-center">
        {profile.avatar ? (
          <img
            src={profile.avatar}
            alt={profile.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-[2.5rem] font-heading font-bold text-accent">
            {initials}
          </span>
        )}
      </div>

      {/* Name */}
      <h1 className="m-0 text-[2.5rem] font-heading font-bold text-heading leading-[1.2]">
        {profile.name}
      </h1>

      {/* Tagline */}
      {profile.tagline && (
        <p className="m-0 text-xl font-body text-text-muted max-w-[600px]">
          {profile.tagline}
        </p>
      )}

      {/* Bio */}
      {profile.bio && (
        <MarkdownBio
          content={profile.bio}
          style={{
            margin: 0,
            fontSize: '1rem',
            maxWidth: '700px',
            textAlign: 'left',
          }}
        />
      )}

      {/* Social Links */}
      {Object.keys(profile.links).length > 0 && (
        <div className="flex gap-4 flex-wrap justify-center mt-2">
          {Object.entries(profile.links).map(([key, url]) => {
            if (!url || typeof url !== 'string') return null

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
            const iconUrl = profile.customLinkIcons?.[key]

            return (
              <a
                key={key}
                href={href}
                target={key === 'email' ? undefined : '_blank'}
                rel={key === 'email' ? undefined : 'noopener noreferrer'}
                className="px-4 py-2 text-sm font-body font-medium text-text bg-card border border-border rounded-md no-underline transition-all duration-200 hover:bg-accent hover:border-accent hover:text-white flex items-center gap-2"
              >
                {iconUrl && (
                  <img src={iconUrl} alt="" className="w-4 h-4 object-contain" />
                )}
                {label}
              </a>
            )
          })}
        </div>
      )}
    </div>
  )
}
