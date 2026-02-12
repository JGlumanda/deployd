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
  const [validating, setValidating] = useState(false)
  const [isRateLimited, setIsRateLimited] = useState(false)

  // Apply theme even on auth page
  useTheme(config?.theme.active || 'nordic')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!password.trim()) {
      setError('Bitte gib ein Passwort ein')
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
        setError('Falsches Passwort')
        setValidating(false)
        return
      }

      if (response.status === 429) {
        // Rate limit erreicht
        const data = await response.json().catch(() => ({}))
        setIsRateLimited(true)
        setError(data.message || 'Zu viele fehlgeschlagene Login-Versuche. Bitte warte 15 Minuten.')
        setValidating(false)
        return
      }

      if (!response.ok) {
        setError('Fehler bei der Authentifizierung')
        setValidating(false)
        return
      }

      // Password is valid, authenticate user
      onAuthenticated(password)
    } catch (err) {
      setError('Verbindungsfehler zum Server')
      setValidating(false)
    }
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
        padding: '40px',
        background: 'var(--color-card)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
      }}>
        <style>{`
          @media (max-width: 480px) {
            div[style*="maxWidth: 380"] {
              padding: 24px !important;
              margin: 0 16px !important;
            }
          }
        `}</style>
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
          }}>deployd</p>
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
                setIsRateLimited(false)
              }}
              placeholder="Gib dein Admin-Passwort ein"
              autoFocus
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: 'var(--radius-md)',
                border: error ? '1px solid var(--color-error)' : '1px solid var(--color-input-border)',
                background: 'var(--color-input-bg)',
                color: 'var(--color-input-text)',
                fontSize: 14,
                outline: 'none',
                fontFamily: 'var(--font-body)',
              }}
            />
            {error && (
              <div style={{
                marginTop: 8,
                padding: isRateLimited ? '12px' : '8px 0',
                background: isRateLimited ? 'var(--color-error-bg)' : 'transparent',
                borderRadius: isRateLimited ? 'var(--radius-md)' : '0',
                border: isRateLimited ? '1px solid var(--color-error)' : 'none',
              }}>
                <p style={{
                  fontSize: 12,
                  color: 'var(--color-error)',
                  fontWeight: isRateLimited ? 600 : 400,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  margin: 0,
                }}>
                  {isRateLimited && <span style={{ fontSize: 16 }}>⏱️</span>}
                  {error}
                </p>
                {isRateLimited && (
                  <p style={{
                    fontSize: 11,
                    color: 'var(--color-text-muted)',
                    marginTop: 6,
                    marginBottom: 0,
                  }}>
                    Nach 5 fehlgeschlagenen Versuchen wird der Login für 15 Minuten gesperrt.
                  </p>
                )}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={validating || isRateLimited}
            style={{
              width: '100%',
              padding: '12px 16px',
              borderRadius: 'var(--radius-md)',
              background: (validating || isRateLimited) ? 'var(--color-text-muted)' : 'var(--color-accent)',
              color: 'var(--color-card)',
              border: 'none',
              fontSize: 14,
              fontWeight: 600,
              cursor: (validating || isRateLimited) ? 'not-allowed' : 'pointer',
              fontFamily: 'var(--font-body)',
              opacity: (validating || isRateLimited) ? 0.6 : 1,
            }}
          >
            {validating ? 'Prüfe Passwort...' : isRateLimited ? 'Rate Limit erreicht' : 'Anmelden'}
          </button>
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
