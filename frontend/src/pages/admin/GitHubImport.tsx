import { useState } from 'react'
import { cn } from '@core/utils/cn'
import type { Project, Settings } from '@core/types'

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
  settings: Settings
  onImport: (projects: Project[]) => void
  onCancel: () => void
}

export default function GitHubImport({ existingProjects, settings, onImport, onCancel }: GitHubImportProps) {
  const [username, setUsername] = useState(settings.githubUsername || '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [repos, setRepos] = useState<GitHubRepo[]>([])
  const [selected, setSelected] = useState<Set<string>>(new Set())

  const fetchRepos = async () => {
    if (!username.trim()) {
      setError('Please enter a GitHub username')
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

        throw new Error(data.error || 'Could not load repos. Check the username.')
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
      setError(err instanceof Error ? err.message : 'Error loading repos')
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
      description: repo.description || 'No description available',
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
        className="bg-none border-none text-accent cursor-pointer text-[13px] font-semibold mb-4 p-0"
      >{'\u2190'} Back</button>

      <h1 className="text-2xl font-bold text-heading font-heading mb-2">Import from GitHub</h1>

      <p className="text-[13px] text-text-muted mb-6">Load your public repos and import them as projects.</p>

      {/* Username input */}
      <div className="mb-6">
        <div className="flex gap-2 mb-2">
          <div className="flex-1 relative">
            <img
              src="https://cdn.simpleicons.org/github/A0ADB8"
              width="14"
              height="14"
              alt=""
              className="absolute left-3 top-[11px]"
            />
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchRepos()}
              placeholder="GitHub Username"
              className="w-full py-2.5 pr-3.5 pl-[34px] rounded-lg border border-border bg-card text-heading text-sm outline-none"
            />
          </div>
          <button
            onClick={fetchRepos}
            disabled={loading}
            className={cn(
              'px-5 py-2 rounded-lg bg-[#24292f] text-white border-none text-[13px] font-semibold inline-flex items-center gap-1.5',
              loading ? 'cursor-not-allowed opacity-70' : 'cursor-pointer opacity-100'
            )}
          >
            {loading ? (
              <>
                <span className="w-3 h-3 border-2 border-[#FFF4] border-t-white rounded-full animate-spin-slow inline-block" />
                Loading...
              </>
            ) : (
              <>
                <img src="https://cdn.simpleicons.org/github/ffffff" width="14" height="14" alt="" />
                Load repos
              </>
            )}
          </button>
        </div>

        {/* Hints */}
        {username && username === settings.githubUsername && (
          <p className="text-xs text-text-muted mt-1">
            Using saved GitHub username from Settings
          </p>
        )}
        {!username && !settings.githubUsername && (
          <p className="text-xs text-text-muted mt-1">
            Tip: Set your GitHub username in Settings to pre-fill this field
          </p>
        )}
      </div>

      {error && (
        <div className="px-4 py-3 rounded-lg bg-[var(--color-error-bg)] border border-error text-error text-[13px] mb-6">{error}</div>
      )}

      {/* Results */}
      {repos.length > 0 && (
        <div>
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs text-text-muted font-mono">
              {repos.length} repos found · {selected.size} selected
            </span>
            {selected.size > 0 && (
              <button
                onClick={handleImport}
                className="px-5 py-2 rounded-lg bg-accent text-card border-none text-[13px] font-semibold cursor-pointer"
              >
                Import {selected.size} project{selected.size !== 1 ? 's' : ''}
              </button>
            )}
          </div>

          <div className="flex flex-col gap-2">
            {repos.map(repo => {
              const isSelected = selected.has(repo.name)
              const isAlreadyImported = existingUrls.has(repo.html_url)
              const isDisabled = isAlreadyImported

              return (
                <div
                  key={repo.name}
                  onClick={() => !isDisabled && toggleRepo(repo.name)}
                  className={cn(
                    'flex items-center gap-3.5 px-[18px] py-3.5 rounded-[10px] transition-all duration-200',
                    isSelected ? 'bg-accent-soft border border-accent' : 'bg-card border border-border',
                    isDisabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer opacity-100'
                  )}
                >
                  {/* Checkbox */}
                  <div className={cn(
                    'w-[18px] h-[18px] rounded flex items-center justify-center shrink-0 transition-all duration-150',
                    isSelected ? 'border-none bg-accent' : 'border-2 border-border bg-transparent'
                  )}>
                    {isSelected && (
                      <span className="text-card text-xs font-bold">{'\u2713'}</span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-semibold text-heading">{repo.name}</span>

                      {repo.language && (
                        <span className="text-[10px] font-semibold text-accent bg-accent-soft px-2 py-[1px] rounded font-mono">{repo.language}</span>
                      )}

                      {repo.fork && (
                        <span className="text-[9px] font-bold text-text-muted bg-bg-alt px-1.5 py-[1px] rounded-sm uppercase">Fork</span>
                      )}

                      {isAlreadyImported && (
                        <span className="text-[9px] font-bold text-[#7BAE7F] bg-[#7BAE7F14] px-1.5 py-[1px] rounded-sm uppercase">Already imported</span>
                      )}
                    </div>
                    <span className="text-xs text-text-muted block mt-0.5">{repo.description || 'No description'}</span>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-xs text-[#C4A35A] font-semibold flex items-center gap-[3px] justify-end">
                      <span className="text-[10px]">{'\u2605'}</span> {repo.stargazers_count}
                    </div>
                    <div className="text-[10px] text-text-muted font-mono mt-0.5">{repo.updated_at.slice(0, 7)}</div>
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
