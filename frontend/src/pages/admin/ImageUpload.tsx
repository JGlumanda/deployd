import { useState, useRef, useCallback } from 'react'
import { cn } from '@core/utils/cn'

interface ImageUploadProps {
  value: string | null | undefined
  onChange: (value: string | null) => void
  password?: string
  label: string
  placeholder?: string
}

type Mode = 'upload' | 'url'

export default function ImageUpload({ value, onChange, password, label, placeholder }: ImageUploadProps) {
  const [mode, setMode] = useState<Mode>('upload')
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const uploadFile = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Only image files are allowed')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('File too large (max 5 MB)')
      return
    }

    setUploading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const headers: HeadersInit = {}
      if (password) {
        headers['Authorization'] = `Bearer ${password}`
      }

      const res = await fetch('/api/upload', {
        method: 'POST',
        headers,
        body: formData,
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({ error: 'Upload failed' }))
        throw new Error(data.error || 'Upload failed')
      }

      const data = await res.json()
      onChange(data.url)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploading(false)
    }
  }, [password, onChange])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) uploadFile(file)
  }, [uploadFile])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) uploadFile(file)
    // Reset input so the same file can be selected again
    e.target.value = ''
  }, [uploadFile])

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="block text-[11px] font-semibold text-text-muted tracking-wider uppercase">{label}</label>
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => setMode('upload')}
            className={cn(
              'px-2 py-0.5 text-[10px] font-semibold rounded border-none cursor-pointer',
              mode === 'upload'
                ? 'bg-accent text-card'
                : 'bg-transparent text-text-muted hover:text-heading'
            )}
          >Upload</button>
          <button
            type="button"
            onClick={() => setMode('url')}
            className={cn(
              'px-2 py-0.5 text-[10px] font-semibold rounded border-none cursor-pointer',
              mode === 'url'
                ? 'bg-accent text-card'
                : 'bg-transparent text-text-muted hover:text-heading'
            )}
          >URL</button>
        </div>
      </div>

      {/* Preview */}
      {value && (
        <div className="relative inline-block mb-2">
          <img
            src={value}
            alt="Preview"
            className="h-20 rounded-lg border border-border object-cover"
          />
          <button
            type="button"
            onClick={() => onChange(null)}
            className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-error text-white border-none text-xs cursor-pointer flex items-center justify-center leading-none"
          >×</button>
        </div>
      )}

      {mode === 'upload' ? (
        <>
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
            className={cn(
              'flex flex-col items-center justify-center gap-1.5 px-4 py-6 rounded-lg border-2 border-dashed cursor-pointer transition-colors',
              dragOver
                ? 'border-accent bg-accent/5'
                : 'border-border hover:border-accent/50'
            )}
          >
            {uploading ? (
              <span className="text-xs text-text-muted">Uploading...</span>
            ) : (
              <>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-text-muted">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" />
                </svg>
                <span className="text-xs text-text-muted">Drop image here or click to browse</span>
                <span className="text-[10px] text-text-muted/60">Max 5 MB</span>
              </>
            )}
          </div>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
        </>
      ) : (
        <input
          type="text"
          value={value || ''}
          onChange={(e) => onChange(e.target.value || null)}
          placeholder={placeholder || 'https://...'}
          className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-card text-heading text-sm outline-none"
        />
      )}

      {error && (
        <p className="text-[11px] text-error mt-1">{error}</p>
      )}

      {mode === 'url' && !value && (
        <p className="text-[11px] text-text-muted mt-1">
          If empty, a generated gradient will be used.
        </p>
      )}
    </div>
  )
}
