import { useState } from 'react'
import type { Project } from '@core/types'

interface GitHubRepo {
  name: string
  description: string | null
  topics: string[]
  language: string | null
  homepage: string | null
  html_url: string
  archived: boolean
  updated_at: string
  stargazers_count: number
  fork: boolean
}

interface GitHubImportProps {
  existingProjects: Project[]
  onImport: (projects: Project[]) => void
  onCancel: () => void
}

export default function GitHubImport({ existingProjects, onImport, onCancel }: GitHubImportProps) {
  const [username, setUsername] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [repos, setRepos] = useState<GitHubRepo[]>([])
  const [selected, setSelected] = useState<Set<string>>(new Set())

  const fetchRepos = async () => {
    if (!username.trim()) {
      setError('Bitte gib einen GitHub-Usernamen ein')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/github/repos/${username}`)

      if (!response.ok) {
        const data = await response.json()

        // Handle GitHub rate limiting specifically
        if (response.status === 403) {
          setError('GitHub API rate limit exceeded. Please add a GITHUB_TOKEN in settings or try again later.')
          return
        }

        if (response.status === 404) {
          setError(`User "${username}" not found on GitHub`)
          return
        }

        throw new Error(data.error || 'Repos konnten nicht geladen werden. Prüfe den Usernamen.')
      }

      const data = await response.json()

      if (!Array.isArray(data)) {
        setError('Invalid response from GitHub API')
        return
      }

      if (data.length === 0) {
        setError('This user has no public repositories')
        return
      }

      setRepos(data)

      // Auto-select non-fork repos that aren't already imported
      const existingUrls = new Set(existingProjects.map(p => p.links.github).filter(Boolean))
      const autoSelected = new Set<string>()
      data.forEach((repo: GitHubRepo) => {
        if (!repo.fork && !existingUrls.has(repo.html_url)) {
          autoSelected.add(repo.name)
        }
      })
      setSelected(autoSelected)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Fehler beim Laden der Repos')
    } finally {
      setLoading(false)
    }
  }

  const toggleRepo = (name: string) => {
    setSelected(prev => {
      const next = new Set(prev)
      if (next.has(name)) {
        next.delete(name)
      } else {
        next.add(name)
      }
      return next
    })
  }

  const handleImport = () => {
    const selectedRepos = repos.filter(r => selected.has(r.name))
    const projects: Project[] = selectedRepos.map(repo => ({
      id: Date.now() + Math.random(),
      title: repo.name,
      description: repo.description || 'Keine Beschreibung vorhanden',
      tags: [
        ...repo.topics,
        ...(repo.language ? [repo.language] : []),
      ],
      status: repo.archived ? 'archived' : 'active',
      featured: false,
      links: {
        github: repo.html_url,
        live: repo.homepage || undefined,
      },
      image: null,
      date: repo.updated_at.slice(0, 7), // YYYY-MM
    }))

    onImport(projects)
  }

  const existingUrls = new Set(existingProjects.map(p => p.links.github).filter(Boolean))

  return (
    <div>
      <button
        onClick={onCancel}
        style={{
          background: 'none',
          border: 'none',
          color: '#6B8FA3',
          cursor: 'pointer',
          fontSize: 13,
          fontWeight: 600,
          marginBottom: 16,
          padding: 0,
        }}
      >← Zurück</button>

      <h1 style={{
        fontSize: 24,
        fontWeight: 700,
        color: '#2C3E50',
        fontFamily: "'Libre Baskerville', serif",
        marginBottom: 8,
      }}>Import von GitHub</h1>

      <p style={{
        fontSize: 13,
        color: '#A0ADB8',
        marginBottom: 24,
      }}>Lade deine öffentlichen Repos und importiere sie als Projekte.</p>

      {/* Username input */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
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
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchRepos()}
            placeholder="GitHub Username"
            style={{
              width: '100%',
              padding: '10px 14px 10px 34px',
              borderRadius: 8,
              border: '1px solid #E2DDD5',
              background: '#FFF',
              color: '#2C3E50',
              fontSize: 14,
              outline: 'none',
            }}
          />
        </div>
        <button
          onClick={fetchRepos}
          disabled={loading}
          style={{
            padding: '8px 20px',
            borderRadius: 8,
            background: '#6B8FA3',
            color: '#FFF',
            border: 'none',
            fontSize: 13,
            fontWeight: 600,
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <span style={{
                width: 12,
                height: 12,
                border: '2px solid #FFF4',
                borderTopColor: '#FFF',
                borderRadius: '50%',
                animation: 'spin 0.6s linear infinite',
                display: 'inline-block',
              }} />
              Laden...
            </span>
          ) : 'Repos laden'}
        </button>
      </div>

      {error && (
        <div style={{
          padding: '12px 16px',
          borderRadius: 8,
          background: '#FFF0F0',
          border: '1px solid #D4A0A0',
          color: '#D4A0A0',
          fontSize: 13,
          marginBottom: 24,
        }}>{error}</div>
      )}

      {/* Results */}
      {repos.length > 0 && (
        <div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 12,
          }}>
            <span style={{
              fontSize: 12,
              color: '#A0ADB8',
              fontFamily: "'IBM Plex Mono', monospace",
            }}>
              {repos.length} Repos gefunden · {selected.size} ausgewählt
            </span>
            {selected.size > 0 && (
              <button
                onClick={handleImport}
                style={{
                  padding: '8px 20px',
                  borderRadius: 8,
                  background: '#6B8FA3',
                  color: '#FFF',
                  border: 'none',
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                {selected.size} Projekt{selected.size !== 1 ? 'e' : ''} importieren
              </button>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {repos.map(repo => {
              const isSelected = selected.has(repo.name)
              const isAlreadyImported = existingUrls.has(repo.html_url)
              const isDisabled = isAlreadyImported

              return (
                <div
                  key={repo.name}
                  onClick={() => !isDisabled && toggleRepo(repo.name)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 14,
                    padding: '14px 18px',
                    background: isSelected ? '#6B8FA308' : '#FFF',
                    border: isSelected ? '1px solid #6B8FA366' : '1px solid #E2DDD5',
                    borderRadius: 10,
                    cursor: isDisabled ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s',
                    opacity: isDisabled ? 0.5 : 1,
                  }}
                >
                  {/* Checkbox */}
                  <div style={{
                    width: 18,
                    height: 18,
                    borderRadius: 4,
                    border: isSelected ? 'none' : '2px solid #D4D0C8',
                    background: isSelected ? '#6B8FA3' : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    transition: 'all 0.15s',
                  }}>
                    {isSelected && (
                      <span style={{ color: '#FFF', fontSize: 12, fontWeight: 700 }}>✓</span>
                    )}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                      <span style={{
                        fontSize: 14,
                        fontWeight: 600,
                        color: '#2C3E50',
                      }}>{repo.name}</span>

                      {repo.language && (
                        <span style={{
                          fontSize: 10,
                          fontWeight: 600,
                          color: '#6B8FA3',
                          background: '#6B8FA314',
                          padding: '1px 8px',
                          borderRadius: 4,
                          fontFamily: "'IBM Plex Mono', monospace",
                        }}>{repo.language}</span>
                      )}

                      {repo.fork && (
                        <span style={{
                          fontSize: 9,
                          fontWeight: 700,
                          color: '#A0ADB8',
                          background: '#F0EDE6',
                          padding: '1px 6px',
                          borderRadius: 3,
                          textTransform: 'uppercase',
                        }}>Fork</span>
                      )}

                      {isAlreadyImported && (
                        <span style={{
                          fontSize: 9,
                          fontWeight: 700,
                          color: '#7BAE7F',
                          background: '#7BAE7F14',
                          padding: '1px 6px',
                          borderRadius: 3,
                          textTransform: 'uppercase',
                        }}>Bereits importiert</span>
                      )}
                    </div>
                    <span style={{
                      fontSize: 12,
                      color: '#A0ADB8',
                      display: 'block',
                      marginTop: 2,
                    }}>{repo.description || 'Keine Beschreibung'}</span>
                  </div>

                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{
                      fontSize: 12,
                      color: '#C4A35A',
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 3,
                      justifyContent: 'flex-end',
                    }}>
                      <span style={{ fontSize: 10 }}>★</span> {repo.stargazers_count}
                    </div>
                    <div style={{
                      fontSize: 10,
                      color: '#A0ADB8',
                      fontFamily: "'IBM Plex Mono', monospace",
                      marginTop: 2,
                    }}>{repo.updated_at.slice(0, 7)}</div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
