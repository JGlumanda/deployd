import { useState } from 'react'
import type { Profile, Settings, GitHubUserData } from '@core/types'

interface ProfileSectionProps {
  profile: Profile
  settings: Settings
  onUpdateProfile: (profile: Profile) => void
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

export default function ProfileSection({ profile, settings, onUpdateProfile }: ProfileSectionProps) {
  const [showGithubImport, setShowGithubImport] = useState(false)
  const [githubUsername, setGithubUsername] = useState(settings.githubUsername || '')
  const [githubLoading, setGithubLoading] = useState(false)
  const [githubError, setGithubError] = useState<string | null>(null)
  const [githubData, setGithubData] = useState<GitHubUserData | null>(null)
  const [githubReadme, setGithubReadme] = useState<string | null>(null)
  const [selectedFields, setSelectedFields] = useState<Set<string>>(new Set())
  const [overwriteMode, setOverwriteMode] = useState(false)

  // Extract custom links from profile (any links not in standard socials)
  const standardKeys = new Set(STANDARD_SOCIALS.map(s => s.key))
  const customLinks: CustomLink[] = Object.entries(profile.links)
    .filter(([key]) => !standardKeys.has(key))
    .map(([key, url]) => ({
      id: key,
      // Empty label for new links (starting with __new_), otherwise capitalize the key
      label: key.startsWith('__new_') ? '' : key.charAt(0).toUpperCase() + key.slice(1),
      url: (url as string) || '',
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

  const removeCustomLink = (key: string) => {
    const newLinks = { ...profile.links }
    delete newLinks[key]
    onUpdateProfile({ ...profile, links: newLinks })
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

    // In overwrite mode, we clear fields that aren't in GitHub data
    if (overwriteMode) {
      // Set all fields - either to GitHub value or empty
      updates.name = selectedFields.has('name') && githubData.name ? githubData.name : ''
      updates.bio = selectedFields.has('readme') && githubReadme ? githubReadme : selectedFields.has('bio') && githubData.bio ? githubData.bio : ''
      updates.avatar = selectedFields.has('avatar') && githubData.avatar_url ? githubData.avatar_url : null
      updates.tagline = githubData.login || profile.tagline // Use GitHub username as tagline
      updates.githubUsername = githubData.login // Save GitHub username

      // Clear all links, then add selected ones
      linkUpdates.github = selectedFields.has('github') && githubData.html_url ? githubData.html_url : undefined
      linkUpdates.website = selectedFields.has('website') && githubData.blog ? githubData.blog : undefined
      linkUpdates.x = selectedFields.has('x') && githubData.twitter_username ? `https://x.com/${githubData.twitter_username}` : undefined
      linkUpdates.email = selectedFields.has('email') && githubData.email ? `mailto:${githubData.email}` : undefined
      linkUpdates.linkedin = undefined
      linkUpdates.mastodon = undefined
    } else {
      // Normal mode: only update selected fields if they have values
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
    }

    onUpdateProfile({
      ...profile,
      ...updates,
      links: overwriteMode ? linkUpdates : {
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
      <h1 style={{
        fontSize: 24,
        fontWeight: 700,
        color: 'var(--color-heading)',
        fontFamily: "'Libre Baskerville', serif",
        marginBottom: 8,
      }}>Profile</h1>

      <p style={{
        fontSize: 13,
        color: 'var(--color-text-muted)',
        marginBottom: 24,
      }}>Your information and social links.</p>

      {/* GitHub Import */}
      <div style={{
        background: 'var(--color-card)',
        border: '1px solid var(--color-border)',
        borderRadius: 12,
        padding: 20,
        marginBottom: 28,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <img src="https://cdn.simpleicons.org/github/2C3E50" width="16" height="16" alt="" />
          <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-heading)' }}>
            Import from GitHub
          </span>
        </div>
        <p style={{ fontSize: 12, color: 'var(--color-text-muted)', marginBottom: 14 }}>
          Automatically import name, bio, avatar and links. If you have a repository with the same name as your username, the README.md will also be imported as bio (with Markdown formatting).
        </p>

        {!showGithubImport ? (
          <>
            <div style={{ display: 'flex', gap: 8 }}>
              <div style={{ flex: 1, position: 'relative' }}>
                <img
                  src="https://cdn.simpleicons.org/github/A0ADB8"
                  width="14"
                  height="14"
                  alt=""
                  style={{ position: 'absolute', left: 12, top: 11 }}
                />
                <input
                  type="text"
                  value={githubUsername}
                  onChange={(e) => setGithubUsername(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && fetchGithubProfile()}
                  placeholder="GitHub Username"
                  style={{
                    width: '100%',
                    padding: '10px 14px 10px 34px',
                    borderRadius: 8,
                    border: '1px solid var(--color-border)',
                    background: 'var(--color-card)',
                    color: 'var(--color-heading)',
                    fontSize: 14,
                    outline: 'none',
                  }}
                />
              </div>
              <button
                onClick={fetchGithubProfile}
                disabled={githubLoading}
                style={{
                  padding: '8px 20px',
                  borderRadius: 8,
                  background: '#24292f',
                  color: '#ffffff',
                  border: 'none',
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: githubLoading ? 'not-allowed' : 'pointer',
                  opacity: githubLoading ? 0.7 : 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <img src="https://cdn.simpleicons.org/github/ffffff" width="14" height="14" alt="" />
                {githubLoading ? 'Loading...' : 'Load'}
              </button>
            </div>

            {!githubUsername && settings.githubUsername && (
              <p style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 8, display: 'flex', alignItems: 'center', gap: 4 }}>
                💡 Using saved username: <code style={{ background: 'var(--color-bg)', padding: '2px 6px', borderRadius: 4, fontFamily: 'var(--font-mono)' }}>{settings.githubUsername}</code>
              </p>
            )}

            {!githubUsername && !settings.githubUsername && (
              <p style={{ fontSize: 11, color: '#D4A0A0', marginTop: 8 }}>
                💡 Tip: Set your GitHub username in Settings to quickly load your profile
              </p>
            )}
          </>
        ) : null}

        {githubError && (
          <p style={{ fontSize: 12, color: '#D4A0A0', marginTop: 12 }}>{githubError}</p>
        )}

        {githubData && (
          <div style={{ marginTop: 14 }}>
            {/* Preview */}
            <div style={{
              display: 'flex',
              gap: 16,
              padding: 16,
              background: 'var(--color-bg-alt)',
              borderRadius: 10,
              marginBottom: 14,
            }}>
              {githubData.avatar_url && (
                <img
                  src={githubData.avatar_url}
                  alt=""
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: '50%',
                    border: '2px solid #E2DDD5',
                  }}
                />
              )}
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--color-heading)' }}>
                  {githubData.name || githubData.login}
                </div>
                <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>
                  @{githubData.login}
                  {githubData.location && ` · ${githubData.location}`}
                </div>
                {githubData.bio && (
                  <div style={{
                    fontSize: 12,
                    color: '#6B7B8D',
                    marginTop: 4,
                    lineHeight: 1.4,
                  }}>{githubData.bio}</div>
                )}
              </div>
            </div>

            {/* Field selection */}
            <div style={{
              fontSize: 11,
              fontWeight: 600,
              color: 'var(--color-text-muted)',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              marginBottom: 8,
            }}>Apply fields</div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
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
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '18px 80px 1fr',
                      gap: 8,
                      alignItems: 'center',
                      padding: '8px 10px',
                      background: i % 2 === 0 ? 'var(--color-bg-alt)' : 'transparent',
                      borderRadius: 6,
                      fontSize: 12,
                    }}
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
                      disabled={isMatch}
                      style={{ width: 14, height: 14, accentColor: '#6B8FA3' }}
                    />
                    <span style={{ fontWeight: 600, color: 'var(--color-heading)', fontSize: 11 }}>
                      {field.label}
                      {field.isMarkdown && (
                        <span style={{
                          marginLeft: 6,
                          fontSize: 9,
                          fontWeight: 600,
                          color: '#6B8FA3',
                          background: '#6B8FA314',
                          padding: '2px 6px',
                          borderRadius: 3,
                        }}>
                          Markdown
                        </span>
                      )}
                    </span>
                    <span style={{
                      color: isMatch ? '#7BAE7F' : '#6B7B8D',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      fontFamily: "'IBM Plex Mono', monospace",
                      fontSize: 10,
                    }}>
                      {isMatch ? '✓ identical' : (field.isMarkdown ? `${field.value.slice(0, 50)}...` : field.value)}
                    </span>
                  </div>
                )
              })}
            </div>

            {/* Overwrite mode checkbox */}
            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              marginTop: 14,
              padding: 10,
              background: overwriteMode ? 'var(--color-accent-soft)' : 'var(--color-bg-alt)',
              border: overwriteMode ? '1px solid #FFD700' : '1px solid transparent',
              borderRadius: 8,
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}>
              <input
                type="checkbox"
                checked={overwriteMode}
                onChange={(e) => setOverwriteMode(e.target.checked)}
                style={{ width: 14, height: 14, accentColor: '#FFD700' }}
              />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-heading)' }}>
                  Overwrite completely
                </div>
                <div style={{ fontSize: 11, color: '#7B8794', marginTop: 2, lineHeight: 1.3 }}>
                  Fields not present in GitHub will be cleared
                  {overwriteMode && ' (e.g. Bio, Avatar, Links)'}
                </div>
              </div>
            </label>

            <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
              <button
                onClick={applyGithubData}
                disabled={selectedFields.size === 0}
                style={{
                  flex: 1,
                  padding: '8px 20px',
                  borderRadius: 8,
                  background: selectedFields.size > 0 ? 'var(--color-accent)' : 'var(--color-border)',
                  color: selectedFields.size > 0 ? '#FFF' : '#A0ADB8',
                  border: 'none',
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: selectedFields.size > 0 ? 'pointer' : 'not-allowed',
                }}
              >Apply selected</button>
              <button
                onClick={() => {
                  setShowGithubImport(false)
                  setGithubData(null)
                  setGithubReadme(null)
                }}
                style={{
                  padding: '8px 20px',
                  borderRadius: 8,
                  background: 'transparent',
                  color: '#6B8FA3',
                  border: '1px solid #6B8FA344',
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >Cancel</button>
            </div>
          </div>
        )}
      </div>

      {/* Manual fields */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div>
          <label style={{
            display: 'block',
            fontSize: 11,
            fontWeight: 600,
            color: 'var(--color-text-muted)',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            marginBottom: 6,
          }}>Name</label>
          <input
            type="text"
            value={profile.name}
            onChange={(e) => updateProfileField('name', e.target.value)}
            style={{
              width: '100%',
              padding: '10px 14px',
              borderRadius: 8,
              border: '1px solid var(--color-border)',
              background: 'var(--color-card)',
              color: 'var(--color-heading)',
              fontSize: 14,
              outline: 'none',
            }}
          />
        </div>

        <div>
          <label style={{
            display: 'block',
            fontSize: 11,
            fontWeight: 600,
            color: 'var(--color-text-muted)',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            marginBottom: 6,
          }}>Tagline</label>
          <input
            type="text"
            value={profile.tagline}
            onChange={(e) => updateProfileField('tagline', e.target.value)}
            style={{
              width: '100%',
              padding: '10px 14px',
              borderRadius: 8,
              border: '1px solid var(--color-border)',
              background: 'var(--color-card)',
              color: 'var(--color-heading)',
              fontSize: 14,
              outline: 'none',
            }}
          />
        </div>

        <div>
          <label style={{
            display: 'block',
            fontSize: 11,
            fontWeight: 600,
            color: 'var(--color-text-muted)',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            marginBottom: 6,
          }}>
            Bio
            <span style={{
              marginLeft: 8,
              fontSize: 10,
              fontWeight: 500,
              color: '#6B8FA3',
              letterSpacing: 'normal',
              textTransform: 'none',
            }}>
              (Markdown supported)
            </span>
          </label>
          <textarea
            value={profile.bio}
            onChange={(e) => updateProfileField('bio', e.target.value)}
            rows={5}
            placeholder="You can use Markdown: **bold**, *italic*, [Link](url), etc."
            style={{
              width: '100%',
              padding: '10px 14px',
              borderRadius: 8,
              border: '1px solid var(--color-border)',
              background: 'var(--color-card)',
              color: 'var(--color-heading)',
              fontSize: 14,
              outline: 'none',
              resize: 'vertical',
              fontFamily: "'IBM Plex Mono', monospace",
            }}
          />
        </div>

        <div>
          <label style={{
            display: 'block',
            fontSize: 11,
            fontWeight: 600,
            color: 'var(--color-text-muted)',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            marginBottom: 6,
          }}>Avatar URL</label>
          <input
            type="text"
            value={profile.avatar || ''}
            onChange={(e) => updateProfileField('avatar', e.target.value || null)}
            placeholder="https://..."
            style={{
              width: '100%',
              padding: '10px 14px',
              borderRadius: 8,
              border: '1px solid var(--color-border)',
              background: 'var(--color-card)',
              color: 'var(--color-heading)',
              fontSize: 14,
              outline: 'none',
            }}
          />
        </div>

        {/* Social Links */}
        <div style={{ borderTop: '1px solid #E2DDD5', paddingTop: 24 }}>
          <p style={{
            fontSize: 11,
            fontWeight: 600,
            color: 'var(--color-text-muted)',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            marginBottom: 4,
          }}>Social Links</p>
          <p style={{ fontSize: 12, color: 'var(--color-text-muted)', marginBottom: 16 }}>
            Standard platforms and custom links.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
            {STANDARD_SOCIALS.map(social => (
              <div key={social.key} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  background: 'var(--color-bg-alt)',
                  border: '1px solid var(--color-border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  {social.icon ? (
                    <img src={social.icon} width="16" height="16" alt={social.label} />
                  ) : (
                    <span style={{ fontSize: 14, color: 'var(--color-text-muted)' }}>
                      {social.key === 'email' ? '✉' : '🌐'}
                    </span>
                  )}
                </div>
                <span style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: 'var(--color-heading)',
                  width: 80,
                  flexShrink: 0,
                }}>{social.label}</span>
                <input
                  type="text"
                  value={profile.links[social.key] || ''}
                  onChange={(e) => updateLink(social.key, e.target.value)}
                  placeholder={social.placeholder}
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    borderRadius: 8,
                    border: '1px solid var(--color-border)',
                    background: 'var(--color-card)',
                    color: 'var(--color-heading)',
                    fontSize: 13,
                    outline: 'none',
                  }}
                />
              </div>
            ))}
          </div>

          {/* Custom links */}
          <div style={{
            background: 'var(--color-bg-alt)',
            border: '1px solid var(--color-border)',
            borderRadius: 10,
            padding: 18,
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 14,
            }}>
              <p style={{
                fontSize: 11,
                fontWeight: 700,
                color: '#6B8FA3',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                fontFamily: "'IBM Plex Mono', monospace",
              }}>Custom Links</p>
              <button
                onClick={addCustomLink}
                style={{
                  padding: '4px 12px',
                  borderRadius: 8,
                  background: 'transparent',
                  color: '#6B8FA3',
                  border: '1px solid #6B8FA344',
                  fontSize: 11,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >+ Add</button>
            </div>

            {customLinks.length === 0 && (
              <p style={{ fontSize: 12, color: 'var(--color-text-muted)', fontStyle: 'italic' }}>
                No custom links added yet.
              </p>
            )}

            {customLinks.map(link => (
              <div
                key={link.id}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr auto',
                  gap: 8,
                  alignItems: 'center',
                  marginBottom: 8,
                }}
              >
                <input
                  type="text"
                  value={link.label}
                  onChange={(e) => {
                    // Update custom link label - need to recreate the key
                    const newKey = e.target.value.toLowerCase().replace(/\s+/g, '_')
                    const newLinks = { ...profile.links }
                    delete newLinks[link.id]
                    newLinks[newKey] = link.url
                    onUpdateProfile({ ...profile, links: newLinks })
                  }}
                  placeholder="Label (e.g., Dribbble)"
                  style={{
                    padding: '6px 10px',
                    borderRadius: 8,
                    border: '1px solid var(--color-border)',
                    background: 'var(--color-card)',
                    color: 'var(--color-heading)',
                    fontSize: 12,
                    outline: 'none',
                  }}
                />
                <input
                  type="text"
                  value={link.url}
                  onChange={(e) => updateLink(link.id, e.target.value)}
                  placeholder="URL"
                  style={{
                    padding: '6px 10px',
                    borderRadius: 8,
                    border: '1px solid var(--color-border)',
                    background: 'var(--color-card)',
                    color: 'var(--color-heading)',
                    fontSize: 12,
                    outline: 'none',
                  }}
                />
                <button
                  onClick={() => removeCustomLink(link.id)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#D4A0A0',
                    cursor: 'pointer',
                    fontSize: 16,
                    padding: 4,
                  }}
                >×</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
