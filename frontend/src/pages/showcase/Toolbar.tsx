import type { Project } from '@core/types'

interface ToolbarProps {
  search: string
  onSearchChange: (value: string) => void
  statusFilter: 'all' | Project['status']
  onStatusFilterChange: (status: 'all' | Project['status']) => void
  viewMode: 'grid' | 'list'
  onViewModeChange: (mode: 'grid' | 'list') => void
  sortKey: 'featured' | 'date' | 'title' | 'status'
  onSortKeyChange: (key: 'featured' | 'date' | 'title' | 'status') => void
}

export function Toolbar({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  viewMode,
  onViewModeChange,
  sortKey,
  onSortKeyChange
}: ToolbarProps) {
  const statusOptions: Array<{ value: 'all' | Project['status']; label: string }> = [
    { value: 'all', label: 'All' },
    { value: 'active', label: 'Active' },
    { value: 'wip', label: 'In Progress' },
    { value: 'archived', label: 'Archived' }
  ]

  const sortOptions: Array<{ value: typeof sortKey; label: string }> = [
    { value: 'featured', label: 'Featured First' },
    { value: 'date', label: 'Date' },
    { value: 'title', label: 'Title' },
    { value: 'status', label: 'Status' }
  ]

  return (
    <div
      style={{
        display: 'flex',
        gap: '1rem',
        flexWrap: 'wrap',
        alignItems: 'center',
        padding: '2rem 0',
        borderBottom: '1px solid var(--color-border)'
      }}
    >
      {/* Search */}
      <input
        type="text"
        placeholder="Search projects..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        aria-label="Search projects"
        style={{
          flex: '1 1 300px',
          padding: '0.75rem 1rem',
          fontSize: '0.9375rem',
          fontFamily: 'var(--font-body)',
          color: 'var(--color-text)',
          backgroundColor: 'var(--color-card)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-md)',
          outline: 'none',
          transition: 'all 0.2s ease'
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = 'var(--color-accent)'
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = 'var(--color-border)'
        }}
      />

      {/* Status Filter */}
      <select
        value={statusFilter}
        onChange={(e) => onStatusFilterChange(e.target.value as 'all' | Project['status'])}
        aria-label="Filter projects by status"
        style={{
          padding: '0.75rem 1rem',
          fontSize: '0.9375rem',
          fontFamily: 'var(--font-body)',
          color: 'var(--color-text)',
          backgroundColor: 'var(--color-card)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-md)',
          cursor: 'pointer',
          outline: 'none'
        }}
      >
        {statusOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {/* Sort */}
      <select
        value={sortKey}
        onChange={(e) =>
          onSortKeyChange(e.target.value as 'featured' | 'date' | 'title' | 'status')
        }
        aria-label="Sort projects"
        style={{
          padding: '0.75rem 1rem',
          fontSize: '0.9375rem',
          fontFamily: 'var(--font-body)',
          color: 'var(--color-text)',
          backgroundColor: 'var(--color-card)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-md)',
          cursor: 'pointer',
          outline: 'none'
        }}
      >
        {sortOptions.map((option) => (
          <option key={option.value} value={option.value}>
            Sort: {option.label}
          </option>
        ))}
      </select>

      {/* View Toggle */}
      <div
        role="group"
        aria-label="View mode"
        style={{
          display: 'flex',
          gap: '0.5rem',
          padding: '0.25rem',
          backgroundColor: 'var(--color-card)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-md)'
        }}
      >
        <button
          onClick={() => onViewModeChange('grid')}
          aria-label="Grid view"
          aria-pressed={viewMode === 'grid'}
          style={{
            padding: '0.5rem 1rem',
            fontSize: '0.875rem',
            fontFamily: 'var(--font-body)',
            fontWeight: 500,
            color: viewMode === 'grid' ? '#fff' : 'var(--color-text)',
            backgroundColor: viewMode === 'grid' ? 'var(--color-accent)' : 'transparent',
            border: 'none',
            borderRadius: 'var(--radius-sm)',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          Grid
        </button>
        <button
          onClick={() => onViewModeChange('list')}
          aria-label="List view"
          aria-pressed={viewMode === 'list'}
          style={{
            padding: '0.5rem 1rem',
            fontSize: '0.875rem',
            fontFamily: 'var(--font-body)',
            fontWeight: 500,
            color: viewMode === 'list' ? '#fff' : 'var(--color-text)',
            backgroundColor: viewMode === 'list' ? 'var(--color-accent)' : 'transparent',
            border: 'none',
            borderRadius: 'var(--radius-sm)',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          List
        </button>
      </div>
    </div>
  )
}
