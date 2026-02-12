import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import type { AppConfig } from '@core/types'

interface ConfigContextValue {
  config: AppConfig | null
  loading: boolean
  error: string | null
  reload: () => Promise<void>
  save: (config: AppConfig, password: string) => Promise<void>
}

const ConfigContext = createContext<ConfigContextValue | undefined>(undefined)

export function ConfigProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState<AppConfig | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadConfig = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/config')
      if (!response.ok) {
        throw new Error(`Failed to load config: ${response.statusText}`)
      }
      const data = await response.json()
      setConfig(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load config')
    } finally {
      setLoading(false)
    }
  }, [])

  const save = useCallback(async (newConfig: AppConfig, password: string) => {
    setError(null)
    try {
      const response = await fetch('/api/config', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${password}`,
        },
        body: JSON.stringify(newConfig),
      })

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Invalid password')
        }
        throw new Error(`Failed to save config: ${response.statusText}`)
      }

      setConfig(newConfig)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save config')
      throw err
    }
  }, [])

  useEffect(() => {
    loadConfig()
  }, [loadConfig])

  return (
    <ConfigContext.Provider value={{ config, loading, error, reload: loadConfig, save }}>
      {children}
    </ConfigContext.Provider>
  )
}

export function useConfig() {
  const context = useContext(ConfigContext)
  if (context === undefined) {
    throw new Error('useConfig must be used within ConfigProvider')
  }
  return context
}
