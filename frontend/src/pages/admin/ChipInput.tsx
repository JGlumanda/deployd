import { useState, useRef, type KeyboardEvent } from 'react'
import { cn } from '@core/utils/cn'

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

  const handleInputChange = (value: string) => {
    setInputValue(value)
    setShowSuggestions(true)
    setSelectedSuggestionIndex(0)
  }

  return (
    <div className="relative">
      <div
        onClick={() => inputRef.current?.focus()}
        className="flex flex-wrap gap-1.5 px-3 py-2 rounded-lg border border-border bg-card min-h-[42px] cursor-text"
      >
        {values.map((value, index) => (
          <span
            key={index}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-accent-soft border border-accent-soft text-heading text-[13px] font-medium"
          >
            {value}
            <button
              onClick={(e) => {
                e.stopPropagation()
                removeChip(index)
              }}
              className="bg-none border-none text-text-muted cursor-pointer text-sm p-0 w-4 h-4 flex items-center justify-center"
            >{'\u00D7'}</button>
          </span>
        ))}

        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          onKeyDown={handleKeyDown}
          placeholder={values.length === 0 ? placeholder : ''}
          className="flex-1 min-w-[120px] border-none outline-none bg-transparent text-sm text-heading"
        />
      </div>

      {/* Suggestions dropdown */}
      {showSuggestions && filteredSuggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 max-h-[200px] overflow-y-auto bg-card border border-border rounded-lg shadow-md z-10">
          {filteredSuggestions.map((suggestion, index) => (
            <button
              key={suggestion}
              onMouseDown={() => addChip(suggestion)}
              onMouseEnter={() => setSelectedSuggestionIndex(index)}
              className={cn(
                'w-full px-3 py-2 border-none text-heading text-[13px] text-left cursor-pointer transition-all duration-150',
                index === selectedSuggestionIndex ? 'bg-bg-alt' : 'bg-transparent'
              )}
            >{suggestion}</button>
          ))}
        </div>
      )}

      <p className="text-[10px] text-text-muted mt-1.5">Enter or comma to add, Backspace to delete</p>
    </div>
  )
}
