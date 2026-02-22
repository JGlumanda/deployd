import type { Project } from '@core/types'
import { cn } from '@core/utils/cn'

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
    <div className="flex gap-4 flex-wrap items-center py-8 border-b border-border">
      {/* Search */}
      <input
        type="text"
        placeholder="Search projects..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        aria-label="Search projects"
        className="flex-[1_1_300px] px-4 py-3 text-[0.9375rem] font-body text-text bg-card border border-border rounded-md outline-none transition-all duration-200 focus:border-accent"
      />

      {/* Status Filter */}
      <select
        value={statusFilter}
        onChange={(e) => onStatusFilterChange(e.target.value as 'all' | Project['status'])}
        aria-label="Filter projects by status"
        className="px-4 py-3 text-[0.9375rem] font-body text-text bg-card border border-border rounded-md cursor-pointer outline-none"
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
        className="px-4 py-3 text-[0.9375rem] font-body text-text bg-card border border-border rounded-md cursor-pointer outline-none"
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
        className="flex gap-2 p-1 bg-card border border-border rounded-md"
      >
        <button
          onClick={() => onViewModeChange('grid')}
          aria-label="Grid view"
          aria-pressed={viewMode === 'grid'}
          className={cn(
            "px-4 py-2 text-sm font-body font-medium border-none rounded-sm cursor-pointer transition-all duration-200",
            viewMode === 'grid'
              ? "text-white bg-accent"
              : "text-text bg-transparent"
          )}
        >
          Grid
        </button>
        <button
          onClick={() => onViewModeChange('list')}
          aria-label="List view"
          aria-pressed={viewMode === 'list'}
          className={cn(
            "px-4 py-2 text-sm font-body font-medium border-none rounded-sm cursor-pointer transition-all duration-200",
            viewMode === 'list'
              ? "text-white bg-accent"
              : "text-text bg-transparent"
          )}
        >
          List
        </button>
      </div>
    </div>
  )
}
