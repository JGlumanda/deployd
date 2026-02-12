import { useState, type FormEvent } from 'react'

interface AdminAuthProps {
  onAuthenticated: (password: string) => void
}

export default function AdminAuth({ onAuthenticated }: AdminAuthProps) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

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
      background: '#F5F1EB',
      fontFamily: "'Karla', sans-serif",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:wght@400;700&family=Karla:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap');
      `}</style>

      <div style={{
        width: '100%',
        maxWidth: 380,
        padding: 40,
        background: '#FFFFFF',
        border: '1px solid #E2DDD5',
        borderRadius: 12,
        boxShadow: '0 4px 16px rgba(44,62,80,0.08)',
      }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <h1 style={{
            fontSize: 24,
            fontWeight: 700,
            color: '#2C3E50',
            fontFamily: "'Libre Baskerville', serif",
            marginBottom: 4,
          }}>Admin</h1>
          <p style={{
            fontSize: 11,
            color: '#A0ADB8',
            fontFamily: "'IBM Plex Mono', monospace",
          }}>Project Showcase</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 20 }}>
            <label style={{
              display: 'block',
              fontSize: 11,
              fontWeight: 600,
              color: '#A0ADB8',
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
                borderRadius: 8,
                border: error ? '1px solid #D4A0A0' : '1px solid #E2DDD5',
                background: '#FFF',
                color: '#2C3E50',
                fontSize: 14,
                outline: 'none',
                fontFamily: "'Karla', sans-serif",
              }}
            />
            {error && (
              <p style={{
                fontSize: 12,
                color: '#D4A0A0',
                marginTop: 8,
              }}>{error}</p>
            )}
          </div>

          <button
            type="submit"
            style={{
              width: '100%',
              padding: '12px 16px',
              borderRadius: 8,
              background: '#6B8FA3',
              color: '#FFF',
              border: 'none',
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: "'Karla', sans-serif",
            }}
          >Anmelden</button>
        </form>

        <p style={{
          fontSize: 11,
          color: '#A0ADB8',
          textAlign: 'center',
          marginTop: 24,
          lineHeight: 1.5,
        }}>
          Das Passwort ist die <code style={{
            background: '#F5F1EB',
            padding: '2px 6px',
            borderRadius: 4,
            fontFamily: "'IBM Plex Mono', monospace",
          }}>ADMIN_PASSWORD</code> Environment Variable.
        </p>
      </div>
    </div>
  )
}
