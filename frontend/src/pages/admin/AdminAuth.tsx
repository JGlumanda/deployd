import { useState, type FormEvent } from 'react'
import { cn } from '@core/utils/cn'
import { useConfig } from '@core/hooks/useConfig'
import { useTheme } from '@core/hooks/useTheme'

interface AdminAuthProps {
  onAuthenticated: (password: string) => void
}

export default function AdminAuth({ onAuthenticated }: AdminAuthProps) {
  const { config } = useConfig()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [validating, setValidating] = useState(false)
  const [isRateLimited, setIsRateLimited] = useState(false)

  // Apply theme even on auth page
  useTheme(config?.theme.active || 'nordic')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!password.trim()) {
      setError('Please enter a password')
      return
    }

    setError('')
    setValidating(true)

    try {
      // Validate password by making a test API call
      const response = await fetch('/api/config', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${password}`
        },
        body: JSON.stringify(config) // Send current config (no changes)
      })

      if (response.status === 401) {
        setError('Incorrect password')
        setValidating(false)
        return
      }

      if (response.status === 429) {
        // Rate limit reached
        const data = await response.json().catch(() => ({}))
        setIsRateLimited(true)
        setError(data.message || 'Too many failed login attempts. Please wait 15 minutes.')
        setValidating(false)
        return
      }

      if (!response.ok) {
        setError('Authentication error')
        setValidating(false)
        return
      }

      // Password is valid, authenticate user
      onAuthenticated(password)
    } catch {
      setError('Server connection error')
      setValidating(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg font-body">
      <div className="w-full max-w-[380px] p-6 sm:p-10 bg-card border border-border rounded-lg shadow-lg">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-heading font-heading mb-1">Admin</h1>
          <p className="text-[11px] text-text-muted font-mono">deployd</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-5">
            <label className="block text-[11px] font-semibold text-text-muted tracking-wider uppercase mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                setError('')
                setIsRateLimited(false)
              }}
              placeholder="Enter your admin password"
              autoFocus
              className={cn(
                'w-full px-3.5 py-3 rounded-md border bg-[var(--color-input-bg)] text-[var(--color-input-text)] text-sm outline-none font-body',
                error ? 'border-error' : 'border-[var(--color-input-border)]'
              )}
            />
            {error && (
              <div className={cn(
                'mt-2',
                isRateLimited ? 'p-3 bg-[var(--color-error-bg)] rounded-md border border-error' : 'py-2 px-0 bg-transparent rounded-none border-none'
              )}>
                <p className={cn(
                  'text-xs text-error flex items-center gap-2 m-0',
                  isRateLimited ? 'font-semibold' : 'font-normal'
                )}>
                  {isRateLimited && <span className="text-[16px]">{'\u23F1\uFE0F'}</span>}
                  {error}
                </p>
                {isRateLimited && (
                  <p className="text-[11px] text-text-muted mt-1.5 mb-0">
                    After 5 failed attempts, login will be blocked for 15 minutes.
                  </p>
                )}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={validating || isRateLimited}
            className={cn(
              'w-full px-4 py-3 rounded-md border-none text-sm font-semibold font-body text-card',
              (validating || isRateLimited)
                ? 'bg-text-muted cursor-not-allowed opacity-60'
                : 'bg-accent cursor-pointer opacity-100'
            )}
          >
            {validating ? 'Validating...' : isRateLimited ? 'Rate Limited' : 'Sign In'}
          </button>
        </form>

        <p className="text-[11px] text-text-muted text-center mt-6 leading-normal">
          The password is the <code className="bg-bg px-1.5 py-0.5 rounded-sm font-mono text-text">ADMIN_PASSWORD</code> environment variable.
        </p>
      </div>
    </div>
  )
}
