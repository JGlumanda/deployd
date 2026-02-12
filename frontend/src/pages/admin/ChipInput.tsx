import { useState, useRef, useEffect, type KeyboardEvent } from 'react'

interface ChipInputProps {
  values: string[]
  onChange: (values: string[]) => void
  suggestions?: string[]
  placeholder?: string
}

export default function ChipInput({ values, onChange, suggestions = [], placeholder }: ChipInputProps) {
  const [inputValue, setInputValue] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const filteredSuggestions = suggestions.filter(
    s => !values.includes(s) && s.toLowerCase().includes(inputValue.toLowerCase())
  )

  const addChip = (value: string) => {
    const trimmed = value.trim()
    if (!trimmed || values.includes(trimmed)) return
    onChange([...values, trimmed])
    setInputValue('')
    setShowSuggestions(false)
  }

  const removeChip = (index: number) => {
    onChange(values.filter((_, i) => i !== index))
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      if (showSuggestions && filteredSuggestions.length > 0) {
        addChip(filteredSuggestions[selectedSuggestionIndex])
      } else if (inputValue.trim()) {
        addChip(inputValue)
      }
    } else if (e.key === 'Backspace' && !inputValue && values.length > 0) {
      removeChip(values.length - 1)
    } else if (e.key === 'ArrowDown' && showSuggestions) {
      e.preventDefault()
      setSelectedSuggestionIndex((prev) =>
        prev < filteredSuggestions.length - 1 ? prev + 1 : prev
      )
    } else if (e.key === 'ArrowUp' && showSuggestions) {
      e.preventDefault()
      setSelectedSuggestionIndex((prev) => (prev > 0 ? prev - 1 : prev))
    } else if (e.key === 'Escape') {
      setShowSuggestions(false)
    } else if (e.key === ',') {
      e.preventDefault()
      if (inputValue.trim()) {
        addChip(inputValue)
      }
    }
  }

  useEffect(() => {
    setSelectedSuggestionIndex(0)
  }, [inputValue])

  return (
    <div style={{ position: 'relative' }}>
      <div
        onClick={() => inputRef.current?.focus()}
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 6,
          padding: '8px 12px',
          borderRadius: 8,
          border: '1px solid var(--color-border)',
          background: 'var(--color-card)',
          minHeight: 42,
          cursor: 'text',
        }}
      >
        {values.map((value, index) => (
          <span
            key={index}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '4px 10px',
              borderRadius: 6,
              background: 'var(--color-accent-soft)',
              border: '1px solid var(--color-accent-soft)',
              color: 'var(--color-heading)',
              fontSize: 13,
              fontWeight: 500,
            }}
          >
            {value}
            <button
              onClick={(e) => {
                e.stopPropagation()
                removeChip(index)
              }}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--color-text-muted)',
                cursor: 'pointer',
                fontSize: 14,
                padding: 0,
                width: 16,
                height: 16,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >×</button>
          </span>
        ))}

        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value)
            setShowSuggestions(true)
          }}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          onKeyDown={handleKeyDown}
          placeholder={values.length === 0 ? placeholder : ''}
          style={{
            flex: 1,
            minWidth: 120,
            border: 'none',
            outline: 'none',
            background: 'transparent',
            fontSize: 14,
            color: '#2C3E50',
          }}
        />
      </div>

      {/* Suggestions dropdown */}
      {showSuggestions && filteredSuggestions.length > 0 && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          marginTop: 4,
          maxHeight: 200,
          overflowY: 'auto',
          background: 'var(--color-card)',
          border: '1px solid var(--color-border)',
          borderRadius: 8,
          boxShadow: '0 4px 12px rgba(44,62,80,0.1)',
          zIndex: 10,
        }}>
          {filteredSuggestions.map((suggestion, index) => (
            <button
              key={suggestion}
              onMouseDown={() => addChip(suggestion)}
              onMouseEnter={() => setSelectedSuggestionIndex(index)}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: 'none',
                background: index === selectedSuggestionIndex ? 'var(--color-bg-alt)' : 'transparent',
                color: 'var(--color-heading)',
                fontSize: 13,
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'background 0.15s',
              }}
            >{suggestion}</button>
          ))}
        </div>
      )}

      <p style={{
        fontSize: 10,
        color: 'var(--color-text-muted)',
        marginTop: 6,
      }}>Enter oder Komma zum Hinzufügen, Backspace zum Löschen</p>
    </div>
  )
}
