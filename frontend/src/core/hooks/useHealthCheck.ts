import { useState, useEffect, useCallback } from 'react'
import type { HealthCheckResult } from '@core/types'

const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes in milliseconds

interface CacheEntry {
  result: HealthCheckResult
  timestamp: number
}

// In-memory cache shared across all hook instances
const cache = new Map<string, CacheEntry>()

/**
 * Single URL health check hook with 5-minute client-side cache
 */
export function useHealthCheck(url: string | undefined) {
  const [result, setResult] = useState<HealthCheckResult | null>(null)
  const [loading, setLoading] = useState(false)

  const checkHealth = useCallback(async () => {
    if (!url) {
      setResult(null)
      return
    }

    // Check cache first
    const cached = cache.get(url)
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      setResult(cached.result)
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`/api/health?url=${encodeURIComponent(url)}`)
      if (!response.ok) {
        throw new Error('Health check request failed')
      }
      const data = await response.json() as HealthCheckResult

      // Update cache
      cache.set(url, { result: data, timestamp: Date.now() })
      setResult(data)
    } catch {
      // On error, consider offline
      const errorResult: HealthCheckResult = { online: false }
      cache.set(url, { result: errorResult, timestamp: Date.now() })
      setResult(errorResult)
    } finally {
      setLoading(false)
    }
  }, [url])

  useEffect(() => {
    checkHealth()
  }, [checkHealth])

  return { result, loading, refresh: checkHealth }
}

/**
 * Batch health check hook for multiple URLs
 */
export function useHealthChecks(urls: string[]) {
  const [results, setResults] = useState<Map<string, HealthCheckResult>>(new Map())
  const [loading, setLoading] = useState(false)

  const checkAll = useCallback(async () => {
    if (urls.length === 0) {
      setResults(new Map())
      return
    }

    setLoading(true)
    const newResults = new Map<string, HealthCheckResult>()

    // Check each URL, using cache where available
    await Promise.all(
      urls.map(async (url) => {
        // Check cache first
        const cached = cache.get(url)
        if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
          newResults.set(url, cached.result)
          return
        }

        try {
          const response = await fetch(`/api/health?url=${encodeURIComponent(url)}`)
          if (!response.ok) {
            throw new Error('Health check request failed')
          }
          const data = await response.json() as HealthCheckResult

          // Update cache
          cache.set(url, { result: data, timestamp: Date.now() })
          newResults.set(url, data)
        } catch {
          // On error, consider offline
          const errorResult: HealthCheckResult = { online: false }
          cache.set(url, { result: errorResult, timestamp: Date.now() })
          newResults.set(url, errorResult)
        }
      })
    )

    setResults(newResults)
    setLoading(false)
  }, [urls])

  useEffect(() => {
    checkAll()
  }, [checkAll])

  return { results, loading, refresh: checkAll }
}
