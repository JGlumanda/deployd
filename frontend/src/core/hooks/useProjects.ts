import { useState, useMemo } from 'react'
import type { Project, ProjectStatus } from '@core/types'

export type SortKey = 'featured' | 'date' | 'title' | 'status' | 'manual'

interface UseProjectsParams {
  projects: Project[]
}

export function useProjects({ projects }: UseProjectsParams) {
  const [search, setSearch] = useState('')
  const [tagFilter, setTagFilter] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | 'all'>('all')
  const [sortKey, setSortKey] = useState<SortKey>('featured')

  // Extract all unique tags from projects
  const allTags = useMemo(() => {
    const tagSet = new Set<string>()
    projects.forEach((project) => {
      project.tags.forEach((tag) => tagSet.add(tag))
    })
    return Array.from(tagSet).sort()
  }, [projects])

  // Filtered and sorted projects
  const filtered = useMemo(() => {
    let result = [...projects]

    // Search filter (title, description, tags)
    if (search.trim()) {
      const searchLower = search.toLowerCase().trim()
      result = result.filter((project) => {
        return (
          project.title.toLowerCase().includes(searchLower) ||
          project.description.toLowerCase().includes(searchLower) ||
          project.tags.some((tag) => tag.toLowerCase().includes(searchLower))
        )
      })
    }

    // Tag filter
    if (tagFilter) {
      result = result.filter((project) => project.tags.includes(tagFilter))
    }

    // Status filter
    if (statusFilter !== 'all') {
      result = result.filter((project) => project.status === statusFilter)
    }

    // Sort
    switch (sortKey) {
      case 'featured':
        result.sort((a, b) => {
          if (a.featured && !b.featured) return -1
          if (!a.featured && b.featured) return 1
          // Secondary sort by date (newest first)
          return b.date.localeCompare(a.date)
        })
        break
      case 'date':
        result.sort((a, b) => b.date.localeCompare(a.date))
        break
      case 'title':
        result.sort((a, b) => a.title.localeCompare(b.title))
        break
      case 'status':
        result.sort((a, b) => {
          const statusOrder = { active: 0, wip: 1, archived: 2 }
          return statusOrder[a.status] - statusOrder[b.status]
        })
        break
      case 'manual':
        break
    }

    return result
  }, [projects, search, tagFilter, statusFilter, sortKey])

  return {
    // State
    search,
    tagFilter,
    statusFilter,
    sortKey,

    // Setters
    setSearch,
    setTagFilter,
    setStatusFilter,
    setSortKey,

    // Computed
    filtered,
    allTags,
  }
}
