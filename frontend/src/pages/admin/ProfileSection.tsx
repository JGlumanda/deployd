import { useState } from 'react'
import { cn } from '@core/utils/cn'
import type { Profile, Settings, GitHubUserData } from '@core/types'
import ImageUpload from './ImageUpload'

interface ProfileSectionProps {
  profile: Profile
  settings: Settings
  onUpdateProfile: (profile: Profile) => void
  onNavigateToSettings?: () => void
  password?: string
}

interface CustomLink {
  id: string
  label: string
  url: string
  iconUrl?: string
}

const STANDARD_SOCIALS = [
  { key: 'github', label: 'GitHub', icon: 'https://cdn.simpleicons.org/github/2C3E50', placeholder: 'https://github.com/username' },
  { key: 'linkedin', label: 'LinkedIn', icon: 'https://cdn.simpleicons.org/linkedin/0A66C2', placeholder: 'https://linkedin.com/in/username' },
  { key: 'x', label: 'X / Twitter', icon: 'https://cdn.simpleicons.org/x/2C3E50', placeholder: 'https://x.com/username' },
  { key: 'mastodon', label: 'Mastodon', icon: 'https://cdn.simpleicons.org/mastodon/6364FF', placeholder: 'https://mastodon.social/@username' },
  { key: 'email', label: 'Email', icon: null, placeholder: 'mailto:you@example.com' },
  { key: 'website', label: 'Website', icon: null, placeholder: 'https://yoursite.com' },
]

export default function ProfileSection({ profile, settings, onUpdateProfile, onNavigateToSettings, password }: ProfileSectionProps) {
  const [showGithubImport, setShowGithubImport] = useState(false)
  const githubUsername = settings.githubUsername || ''
  const [githubLoading, setGithubLoading] = useState(false)
  const [githubError, setGithubError] = useState<string | null>(null)
  const [githubData, setGithubData] = useState<GitHubUserData | null>(null)
  const [githubReadme, setGithubReadme] = useState<string | null>(null)
  const [selectedFields, setSelectedFields] = useState<Set<string>>(new Set())

  // Extract custom links from profile (any links not in standard socials)
  const standardKeys = new Set(STANDARD_SOCIALS.map(s => s.key))
  const customLinks: CustomLink[] = Object.entries(profile.links)
    .filter(([key]) => !standardKeys.has(key))
    .map(([key, url]) => ({
      id: key,
      // Empty label for new links (starting with __new_), otherwise capitalize the key
      label: key.startsWith('__new_') ? '' : key.charAt(0).toUpperCase() + key.slice(1),
      url: (url as string) || '',
      iconUrl: profile.customLinkIcons?.[key],
    }))

  const updateProfileField = <K extends keyof Profile>(field: K, value: Profile[K]) => {
    onUpdateProfile({ ...profile, [field]: value })
  }

  const updateLink = (key: string, value: string | undefined) => {
    onUpdateProfile({
      ...profile,
      links: {
        ...profile.links,
        [key]: value || undefined,
      },
    })
  }

  const addCustomLink = () => {
    // Use a temporary unique key that won't show as label
    const newKey = `__new_${Date.now()}`
    updateLink(newKey, '')
  }

  const updateCustomLinkIcon = (key: string, iconUrl: string | null) => {
    const icons = { ...profile.customLinkIcons }
    if (iconUrl) {
      icons[key] = iconUrl
    } else {
      delete icons[key]
    }
    onUpdateProfile({ ...profile, customLinkIcons: icons })
  }

  const removeCustomLink = (key: string) => {
    const newLinks = { ...profile.links }
    delete newLinks[key]
    const icons = { ...profile.customLinkIcons }
    delete icons[key]
    onUpdateProfile({ ...profile, links: newLinks, customLinkIcons: icons })
  }

  const fetchGithubProfile = async () => {
    if (!githubUsername.trim()) {
      setGithubError('Please enter a GitHub username')
      return
    }

    setGithubLoading(true)
    setGithubError(null)
    setGithubReadme(null)

    try {
      const response = await fetch(`/api/github/user/${githubUsername}`)
      if (!response.ok) {
        throw new Error('Could not load profile')
      }

      const data = await response.json()
      setGithubData(data)

      // Try to fetch profile README (repo with same name as username)
      try {
        const readmeResponse = await fetch(`/api/github/readme/${githubUsername}`)
        if (readmeResponse.ok) {
          const readmeData = await readmeResponse.json()
          setGithubReadme(readmeData.content)
        }
      } catch {
        // Ignore README fetch errors - it's optional
      }

      // Auto-select fields that are different or empty
      const autoSelect = new Set<string>()
      if (data.name && data.name !== profile.name) autoSelect.add('name')
      if (data.bio && data.bio !== profile.bio) autoSelect.add('bio')
      if (data.avatar_url && data.avatar_url !== profile.avatar) autoSelect.add('avatar')
      if (data.blog && data.blog !== profile.links.website) autoSelect.add('website')
      if (data.twitter_username && !profile.links.x) autoSelect.add('x')
      if (data.email && data.email !== profile.links.email) autoSelect.add('email')
      if (data.html_url && data.html_url !== profile.links.github) autoSelect.add('github')

      setSelectedFields(autoSelect)
    } catch (err) {
      setGithubError(err instanceof Error ? err.message : 'Error loading')
    } finally {
      setGithubLoading(false)
    }
  }

  const applyGithubData = () => {
    if (!githubData) return

    const updates: Partial<Profile> = {}
    const linkUpdates: Record<string, string | undefined> = {}

    if (selectedFields.has('name') && githubData.name) {
      updates.name = githubData.name
    }
    if (selectedFields.has('readme') && githubReadme) {
      updates.bio = githubReadme
    } else if (selectedFields.has('bio') && githubData.bio) {
      updates.bio = githubData.bio
    }
    if (selectedFields.has('avatar') && githubData.avatar_url) {
      updates.avatar = githubData.avatar_url
    }
    // Always update tagline to GitHub username and save it
    if (githubData.login) {
      updates.tagline = githubData.login
      updates.githubUsername = githubData.login
    }
    if (selectedFields.has('website') && githubData.blog) {
      linkUpdates.website = githubData.blog
    }
    if (selectedFields.has('x') && githubData.twitter_username) {
      linkUpdates.x = `https://x.com/${githubData.twitter_username}`
    }
    if (selectedFields.has('email') && githubData.email) {
      linkUpdates.email = `mailto:${githubData.email}`
    }
    if (selectedFields.has('github') && githubData.html_url) {
      linkUpdates.github = githubData.html_url
    }

    onUpdateProfile({
      ...profile,
      ...updates,
      links: {
        ...profile.links,
        ...linkUpdates,
      },
    })

    setShowGithubImport(false)
    setGithubData(null)
    setGithubReadme(null)
    setSelectedFields(new Set())
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-2xl font-bold text-heading font-heading">Profile</h1>
        <button
          onClick={() => {
            if (!confirm('Clear all profile data? This will reset name, tagline, bio, avatar, and all links.')) return
            onUpdateProfile({
              ...profile,
              name: '',
              tagline: '',
              bio: '',
              avatar: null,
              links: {},
            })
          }}
          className="px-3 py-1.5 rounded-lg bg-transparent text-error border border-error/30 text-[11px] font-semibold cursor-pointer transition-all duration-200 hover:bg-error/10"
        >Clear Profile</button>
      </div>

      <p className="text-[13px] text-text-muted mb-6">Your information and social links.</p>

      {/* GitHub Import */}
      {settings.githubEnabled !== false && (
      <div className="bg-card border border-border rounded-xl p-5 mb-7">
        <div className="flex items-center gap-2 mb-1">
          <img src="https://cdn.simpleicons.org/github/2C3E50" width="16" height="16" alt="" />
          <span className="text-[13px] font-bold text-heading">
            Import from GitHub
          </span>
        </div>
        <p className="text-xs text-text-muted mb-3.5">
          Automatically import name, bio, avatar and links. If you have a repository with the same name as your username, the README.md will also be imported as bio (with Markdown formatting).
        </p>

        {!showGithubImport ? (
          <>
            {githubUsername ? (
              <button
                onClick={fetchGithubProfile}
                disabled={githubLoading}
                className={cn(
                  'px-5 py-2 rounded-lg bg-[#24292f] text-white border-none text-[13px] font-semibold flex items-center gap-1.5',
                  githubLoading ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'
                )}
              >
                <img src="https://cdn.simpleicons.org/github/ffffff" width="14" height="14" alt="" />
                {githubLoading ? 'Loading...' : 'Load from GitHub'}
              </button>
            ) : (
              <p className="text-xs text-text-muted">
                No GitHub username configured.{' '}
                {onNavigateToSettings ? (
                  <button
                    onClick={onNavigateToSettings}
                    className="bg-none border-none text-accent cursor-pointer text-xs font-semibold p-0 underline"
                  >Set it in Settings</button>
                ) : (
                  <span>Set it in Settings.</span>
                )}
              </p>
            )}
          </>
        ) : null}

        {githubError && (
          <p className="text-xs text-error mt-3">{githubError}</p>
        )}

        {githubData && (
          <div className="mt-3.5">
            {/* Preview */}
            <div className="flex gap-4 p-4 bg-bg-alt rounded-[10px] mb-3.5">
              {githubData.avatar_url && (
                <img
                  src={githubData.avatar_url}
                  alt=""
                  className="w-14 h-14 rounded-full"
                  style={{ border: '2px solid #E2DDD5' }}
                />
              )}
              <div className="flex-1">
                <div className="text-[15px] font-bold text-heading">
                  {githubData.name || githubData.login}
                </div>
                <div className="text-xs text-text-muted">
                  @{githubData.login}
                  {githubData.location && ` · ${githubData.location}`}
                </div>
                {githubData.bio && (
                  <div className="text-xs text-text-muted mt-1 leading-snug">{githubData.bio}</div>
                )}
              </div>
            </div>

            {/* Field selection */}
            <div className="text-[11px] font-semibold text-text-muted tracking-wider uppercase mb-2">Apply fields</div>

            <div className="flex flex-col gap-1">
              {[
                { key: 'name', label: 'Name', value: githubData.name, current: profile.name },
                ...(githubReadme ? [{ key: 'readme', label: 'Profile README', value: githubReadme, current: profile.bio, isMarkdown: true }] : []),
                { key: 'bio', label: 'Bio', value: githubData.bio, current: profile.bio },
                { key: 'avatar', label: 'Avatar', value: githubData.avatar_url, current: profile.avatar },
                { key: 'website', label: 'Website', value: githubData.blog, current: profile.links.website },
                { key: 'x', label: 'X / Twitter', value: githubData.twitter_username, current: profile.links.x },
                { key: 'email', label: 'Email', value: githubData.email, current: profile.links.email },
                { key: 'github', label: 'GitHub', value: githubData.html_url, current: profile.links.github },
              ].filter(f => f.value).map((field, i) => {
                const isMatch = field.value === field.current
                return (
                  <div
                    key={field.key}
                    className={cn(
                      'grid grid-cols-[18px_80px_1fr] gap-2 items-center px-2.5 py-2 rounded-md text-xs',
                      i % 2 === 0 ? 'bg-bg-alt' : 'bg-transparent'
                    )}
                  >
                    <input
                      type="checkbox"
                      checked={selectedFields.has(field.key)}
                      onChange={(e) => {
                        const next = new Set(selectedFields)
                        if (e.target.checked) {
                          next.add(field.key)
                        } else {
                          next.delete(field.key)
                        }
                        setSelectedFields(next)
                      }}
                      className="w-3.5 h-3.5"
                      style={{ accentColor: '#6B8FA3' }}
                    />
                    <span className="font-semibold text-heading text-[11px]">
                      {field.label}
                      {field.isMarkdown && (
                        <span className="ml-1.5 text-[9px] font-semibold text-accent bg-accent-soft px-1.5 py-0.5 rounded-sm">
                          Markdown
                        </span>
                      )}
                    </span>
                    <span className={cn(
                      'truncate font-mono text-[10px]',
                      isMatch ? 'text-[#7BAE7F]' : 'text-text-muted'
                    )}>
                      {isMatch ? '✓ identical' : (field.isMarkdown ? `${field.value.slice(0, 50)}...` : field.value)}
                    </span>
                  </div>
                )
              })}
            </div>

            <div className="flex gap-2 mt-3.5">
              <button
                onClick={applyGithubData}
                disabled={selectedFields.size === 0}
                className={cn(
                  'flex-1 px-5 py-2 rounded-lg border-none text-[13px] font-semibold',
                  selectedFields.size > 0
                    ? 'bg-accent text-card cursor-pointer'
                    : 'bg-border text-text-muted cursor-not-allowed'
                )}
              >Apply selected</button>
              <button
                onClick={() => {
                  setShowGithubImport(false)
                  setGithubData(null)
                  setGithubReadme(null)
                }}
                className="px-5 py-2 rounded-lg bg-transparent text-accent font-semibold text-[13px] cursor-pointer"
                style={{ border: '1px solid #6B8FA344' }}
              >Cancel</button>
            </div>
          </div>
        )}
      </div>
      )}

      {/* Manual fields */}
      <div className="flex flex-col gap-5">
        <div>
          <label className="block text-[11px] font-semibold text-text-muted tracking-wider uppercase mb-1.5">Name</label>
          <input
            type="text"
            value={profile.name}
            onChange={(e) => updateProfileField('name', e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-card text-heading text-sm outline-none"
          />
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-text-muted tracking-wider uppercase mb-1.5">Tagline</label>
          <input
            type="text"
            value={profile.tagline}
            onChange={(e) => updateProfileField('tagline', e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-card text-heading text-sm outline-none"
          />
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-text-muted tracking-wider uppercase mb-1.5">
            Bio
            <span className="ml-2 text-[10px] font-medium text-accent tracking-normal normal-case">
              (Markdown supported)
            </span>
          </label>
          <textarea
            value={profile.bio}
            onChange={(e) => updateProfileField('bio', e.target.value)}
            rows={5}
            placeholder="You can use Markdown: **bold**, *italic*, [Link](url), etc."
            className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-card text-heading text-sm outline-none resize-y font-mono"
          />
        </div>

        <ImageUpload
          value={profile.avatar}
          onChange={(avatar) => updateProfileField('avatar', avatar)}
          password={password}
          label="Avatar"
          placeholder="https://..."
        />

        {/* Social Links */}
        <div className="border-t border-border pt-6">
          <p className="text-[11px] font-semibold text-text-muted tracking-wider uppercase mb-1">Social Links</p>
          <p className="text-xs text-text-muted mb-4">
            Standard platforms and custom links.
          </p>

          <div className="flex flex-col gap-2.5 mb-5">
            {STANDARD_SOCIALS.map(social => (
              <div key={social.key} className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-bg-alt border border-border flex items-center justify-center shrink-0">
                  {social.icon ? (
                    <img src={social.icon} width="16" height="16" alt={social.label} />
                  ) : (
                    <span className="text-sm text-text-muted">
                      {social.key === 'email' ? '✉' : '🌐'}
                    </span>
                  )}
                </div>
                <span className="text-xs font-semibold text-heading w-20 shrink-0">{social.label}</span>
                <input
                  type="text"
                  value={profile.links[social.key] || ''}
                  onChange={(e) => updateLink(social.key, e.target.value)}
                  placeholder={social.placeholder}
                  className="flex-1 px-3 py-2 rounded-lg border border-border bg-card text-heading text-[13px] outline-none"
                />
              </div>
            ))}
          </div>

          {/* Custom links */}
          <div className="bg-bg-alt border border-border rounded-[10px] p-[18px]">
            <div className="flex justify-between items-center mb-3.5">
              <p className="text-[11px] font-bold text-accent tracking-wider uppercase font-mono">Custom Links</p>
              <button
                onClick={addCustomLink}
                className="px-3 py-1 rounded-lg bg-transparent text-accent text-[11px] font-semibold cursor-pointer"
                style={{ border: '1px solid #6B8FA344' }}
              >+ Add</button>
            </div>

            {customLinks.length === 0 && (
              <p className="text-xs text-text-muted italic">
                No custom links added yet.
              </p>
            )}

            {customLinks.map(link => (
              <div
                key={link.id}
                className="grid grid-cols-[auto_1fr_1fr_auto] gap-2 items-center mb-2"
              >
                {/* Icon upload */}
                <ImageUpload
                  compact
                  value={link.iconUrl || null}
                  onChange={(val) => updateCustomLinkIcon(link.id, val)}
                  password={password}
                  placeholder="Icon"
                />
                <input
                  type="text"
                  value={link.label}
                  onChange={(e) => {
                    // Update custom link label - need to recreate the key
                    const newKey = e.target.value.toLowerCase().replace(/\s+/g, '_')
                    const newLinks = { ...profile.links }
                    delete newLinks[link.id]
                    newLinks[newKey] = link.url
                    // Migrate icon to new key
                    const icons = { ...profile.customLinkIcons }
                    if (icons[link.id]) {
                      icons[newKey] = icons[link.id]
                      delete icons[link.id]
                    }
                    onUpdateProfile({ ...profile, links: newLinks, customLinkIcons: icons })
                  }}
                  placeholder="Label (e.g., Dribbble)"
                  className="px-2.5 py-1.5 rounded-lg border border-border bg-card text-heading text-xs outline-none"
                />
                <input
                  type="text"
                  value={link.url}
                  onChange={(e) => updateLink(link.id, e.target.value)}
                  placeholder="URL"
                  className="px-2.5 py-1.5 rounded-lg border border-border bg-card text-heading text-xs outline-none"
                />
                <button
                  onClick={() => removeCustomLink(link.id)}
                  className="bg-none border-none text-error cursor-pointer text-base p-1"
                >×</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
