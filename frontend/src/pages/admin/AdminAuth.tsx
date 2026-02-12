import { useState, type FormEvent } from 'react'
import { useConfig } from '@core/hooks/useConfig'
import { useTheme } from '@core/hooks/useTheme'

interface AdminAuthProps {
  onAuthenticated: (password: string) => void
}

export default function AdminAuth({ onAuthenticated }: AdminAuthProps) {
  const { config } = useConfig()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  // Apply theme even on auth page
  useTheme(config?.theme.active || 'nordic')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!password.trim()) {
      setError('Bitte gib ein Passwort ein')
      return
    }
    setError('')
    onAuthenticated(password)
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--color-bg)',
      fontFamily: 'var(--font-body)',
    }}>
      <div style={{
        width: '100%',
        maxWidth: 380,
        padding: 40,
        background: 'var(--color-card)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
      }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <h1 style={{
            fontSize: 24,
            fontWeight: 700,
            color: 'var(--color-heading)',
            fontFamily: 'var(--font-heading)',
            marginBottom: 4,
          }}>Admin</h1>
          <p style={{
            fontSize: 11,
            color: 'var(--color-text-muted)',
            fontFamily: 'var(--font-mono)',
          }}>Project Showcase</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 20 }}>
            <label style={{
              display: 'block',
              fontSize: 11,
              fontWeight: 600,
              color: 'var(--color-text-muted)',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              marginBottom: 8,
            }}>Passwort</label>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                setError('')
              }}
              placeholder="Gib dein Admin-Passwort ein"
              autoFocus
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: 'var(--radius-md)',
                border: error ? '1px solid var(--color-error)' : '1px solid var(--color-border)',
                background: 'var(--color-card)',
                color: 'var(--color-text)',
                fontSize: 14,
                outline: 'none',
                fontFamily: 'var(--font-body)',
              }}
            />
            {error && (
              <p style={{
                fontSize: 12,
                color: 'var(--color-error)',
                marginTop: 8,
              }}>{error}</p>
            )}
          </div>

          <button
            type="submit"
            style={{
              width: '100%',
              padding: '12px 16px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--color-accent)',
              color: 'var(--color-card)',
              border: 'none',
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: 'var(--font-body)',
            }}
          >Anmelden</button>
        </form>

        <p style={{
          fontSize: 11,
          color: 'var(--color-text-muted)',
          textAlign: 'center',
          marginTop: 24,
          lineHeight: 1.5,
        }}>
          Das Passwort ist die <code style={{
            background: 'var(--color-bg)',
            padding: '2px 6px',
            borderRadius: 'var(--radius-sm)',
            fontFamily: 'var(--font-mono)',
            color: 'var(--color-text)',
          }}>ADMIN_PASSWORD</code> Environment Variable.
        </p>
      </div>
    </div>
  )
}
