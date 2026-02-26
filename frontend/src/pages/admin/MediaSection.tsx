import { useState, useEffect, useCallback } from 'react'
import { cn } from '@core/utils/cn'
import type { AppConfig } from '@core/types'

interface UploadedFile {
  filename: string
  url: string
  size: number
  modified: number
  inUse: boolean
}

interface MediaSectionProps {
  password?: string
  draftConfig: AppConfig
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export default function MediaSection({ password, draftConfig }: MediaSectionProps) {
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)

  const fetchFiles = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/uploads', {
        headers: { Authorization: `Bearer ${password}` },
      })
      if (!res.ok) throw new Error('Failed to load uploads')
      const data: UploadedFile[] = await res.json()

      // Merge with client-side check against draftConfig (catches unsaved references)
      const draftJson = JSON.stringify(draftConfig)
      const merged = data.map((f) => ({
        ...f,
        inUse: f.inUse || draftJson.includes(f.url),
      }))

      setFiles(merged)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }, [password, draftConfig])

  useEffect(() => {
    fetchFiles()
  }, [fetchFiles])

  const handleDelete = async (file: UploadedFile) => {
    const message = file.inUse
      ? `"${file.filename}" is currently in use. Deleting it will break references in your config.\n\nAre you sure?`
      : `Delete "${file.filename}"?`

    if (!confirm(message)) return

    setDeleting(file.filename)
    try {
      const res = await fetch(`/api/uploads/${encodeURIComponent(file.filename)}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${password}` },
      })
      if (!res.ok) throw new Error('Failed to delete file')
      setFiles((prev) => prev.filter((f) => f.filename !== file.filename))
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Delete failed')
    } finally {
      setDeleting(null)
    }
  }

  const totalSize = files.reduce((sum, f) => sum + f.size, 0)
  const orphanedCount = files.filter((f) => !f.inUse).length

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <span className="w-5 h-5 border-2 border-accent border-t-transparent rounded-full animate-spin-slow inline-block" />
        <span className="ml-3 text-text-muted text-sm">Loading media...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <p className="text-error text-sm">{error}</p>
        <button
          onClick={fetchFiles}
          className="px-4 py-2 rounded-md bg-accent text-card border-none text-xs font-semibold cursor-pointer"
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-xl font-bold text-text font-heading mb-1">Media</h2>
      <p className="text-sm text-text-muted mb-6">
        Manage uploaded images. Files not referenced in your config are marked as unused.
      </p>

      {/* Summary bar */}
      <div className="flex flex-wrap gap-4 mb-6 text-xs font-mono text-text-muted">
        <span>{files.length} file{files.length !== 1 ? 's' : ''}</span>
        <span>{formatSize(totalSize)} total</span>
        {orphanedCount > 0 && (
          <span className="text-warning">{orphanedCount} unused</span>
        )}
      </div>

      {files.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-text-muted">
          <span className="text-3xl mb-3 opacity-30">&#9744;</span>
          <p className="text-sm">No uploaded files yet.</p>
          <p className="text-xs mt-1">Upload images via the project editor or profile section.</p>
        </div>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-4">
          {files.map((file) => (
            <div
              key={file.filename}
              className={cn(
                'rounded-lg border overflow-hidden bg-card flex flex-col',
                file.inUse ? 'border-border' : 'border-border border-dashed'
              )}
            >
              {/* Thumbnail */}
              <div className="aspect-square bg-bg flex items-center justify-center overflow-hidden">
                <img
                  src={file.url}
                  alt={file.filename}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>

              {/* Info */}
              <div className="p-3 flex flex-col gap-2">
                <p
                  className="text-[11px] font-mono text-text truncate"
                  title={file.filename}
                >
                  {file.filename}
                </p>

                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-text-muted font-mono">
                    {formatSize(file.size)}
                  </span>
                  <span
                    className={cn(
                      'text-[10px] px-1.5 py-0.5 rounded font-semibold',
                      file.inUse
                        ? 'bg-accent-soft text-accent'
                        : 'bg-bg text-text-muted'
                    )}
                  >
                    {file.inUse ? 'In use' : 'Unused'}
                  </span>
                </div>

                <button
                  onClick={() => handleDelete(file)}
                  disabled={deleting === file.filename}
                  className={cn(
                    'w-full mt-1 px-3 py-1.5 rounded-md border text-[11px] font-semibold transition-colors',
                    deleting === file.filename
                      ? 'border-border text-text-muted cursor-not-allowed opacity-50'
                      : 'border-error/30 text-error bg-transparent cursor-pointer hover:bg-error/10'
                  )}
                >
                  {deleting === file.filename ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
