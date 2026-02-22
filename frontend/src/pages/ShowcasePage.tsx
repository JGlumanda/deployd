import { useState, useEffect } from 'react'
import { useConfig } from '@core/hooks/useConfig'
import { useTheme } from '@core/hooks/useTheme'
import { useProjects } from '@core/hooks/useProjects'
import type { Project } from '@core/types'

// Default components
import { DefaultHeroLayout } from './showcase/DefaultHeroLayout'
import { DefaultCardWrapper } from './showcase/DefaultCardWrapper'
import { DefaultPageLayout } from './showcase/DefaultPageLayout'
import { DefaultModalWrapper } from './showcase/DefaultModalWrapper'

// Shared content components
import { CardContent } from './showcase/CardContent'
import { CardListItem } from './showcase/CardListItem'
import { ModalContent } from './showcase/ModalContent'
import { Toolbar } from './showcase/Toolbar'
import { TagFilterBar } from './showcase/TagFilterBar'
import { ScanlineOverlay } from './showcase/ScanlineOverlay'

export default function ShowcasePage() {
  const { config, loading, error } = useConfig()
  const theme = useTheme(config?.theme.active || 'nordic')

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  // Initialize projects hook
  const projectsHook = useProjects({ projects: config?.projects || [] })

  // Update document title based on profile name
  useEffect(() => {
    if (config?.profile.name) {
      document.title = config.profile.name
    } else {
      document.title = 'deployd'
    }
  }, [config?.profile.name])

  // Lock body scroll when modal is open
  useEffect(() => {
    if (selectedProject) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [selectedProject])

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen font-sans bg-[#f5f5f5]">
        <div className="text-center">
          <h1 className="text-2xl text-[#333]">Loading...</h1>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen font-sans bg-[#f5f5f5] p-8">
        <div className="text-center max-w-[600px]">
          <h1 className="text-2xl text-[#ef4444] mb-4">Error</h1>
          <p className="text-[#666]">{error}</p>
        </div>
      </div>
    )
  }

  // No config state
  if (!config) {
    return (
      <div className="flex items-center justify-center min-h-screen font-sans bg-[#f5f5f5]">
        <div className="text-center">
          <h1 className="text-2xl text-[#333] mb-2">
            No Configuration
          </h1>
          <p className="text-[#666]">Configuration data is not available.</p>
        </div>
      </div>
    )
  }

  // Resolve theme overrides
  const HeroLayout = theme?.overrides?.HeroLayout || DefaultHeroLayout
  const CardWrapper = theme?.overrides?.CardWrapper || DefaultCardWrapper
  const PageLayout = theme?.overrides?.PageLayout || DefaultPageLayout
  const ModalWrapper = theme?.overrides?.ModalWrapper || DefaultModalWrapper

  // Get animation style from theme
  const animationStyle = theme?.effects?.animationStyle || 'fade'

  // Render hero
  const hero = <HeroLayout profile={config.profile} />

  // Render toolbar (Terminal theme uses custom toolbar)
  const isTerminal = theme?.name === 'terminal'
  const toolbar = isTerminal ? (
    <div>
      {/* Terminal search */}
      <div className="mb-6 flex items-center gap-2">
        <span style={{ color: '#1A331A', fontSize: 14 }}>$ grep</span>
        <input
          type="text"
          value={projectsHook.search}
          onChange={(e) => projectsHook.setSearch(e.target.value)}
          placeholder="..."
          style={{
            background: 'transparent',
            border: 'none',
            borderBottom: '1px solid #1A331A',
            color: '#39FF14',
            fontSize: 14,
            fontFamily: 'inherit',
            outline: 'none',
            padding: '5px 0',
            width: 260,
          }}
        />
      </div>

      {/* Terminal count */}
      <div style={{ fontSize: 12, color: '#1A331A', marginBottom: 18 }}>
        --- {projectsHook.filtered.length} processes found ---
      </div>
    </div>
  ) : (
    <Toolbar
      search={projectsHook.search}
      onSearchChange={projectsHook.setSearch}
      statusFilter={projectsHook.statusFilter}
      onStatusFilterChange={projectsHook.setStatusFilter}
      viewMode={viewMode}
      onViewModeChange={setViewMode}
      sortKey={projectsHook.sortKey}
      onSortKeyChange={projectsHook.setSortKey}
    />
  )

  // Render tag filter (Terminal theme doesn't show tag filter)
  const tagFilter = isTerminal ? null : (
    <TagFilterBar
      tags={projectsHook.allTags}
      activeTag={projectsHook.tagFilter}
      onTagClick={projectsHook.setTagFilter}
      theme={theme}
      settings={config.settings}
    />
  )

  // Render grid or list
  const grid = (
    <div className="py-8">
      {/* Project count (Terminal shows this in toolbar) */}
      {!isTerminal && (
        <div className="mb-6 text-sm font-body text-text-muted">
          {projectsHook.filtered.length} {projectsHook.filtered.length === 1 ? 'project' : 'projects'} found
        </div>
      )}

      {/* Empty state */}
      {projectsHook.filtered.length === 0 ? (
        <div className="text-center py-16 px-8 text-text-muted">
          <p className="text-lg font-body">
            {config.projects.length === 0
              ? 'No projects yet. Add your first project in the admin panel.'
              : 'No projects found matching your filters.'}
          </p>
        </div>
      ) : viewMode === 'grid' ? (
        // Grid view
        <div
          className="grid gap-grid-gap"
          style={{
            gridTemplateColumns: isTerminal
              ? 'repeat(auto-fill, minmax(290px, 1fr))'
              : 'repeat(auto-fill, minmax(320px, 1fr))'
          }}
        >
          {projectsHook.filtered.map((project: Project, index: number) => {
            // Calculate staggered animation delay
            const delay = getAnimationDelay(index, animationStyle)

            return (
              <div
                key={project.id}
                style={{
                  animation: `${getAnimationKeyframes(animationStyle)} 0.5s ease-out ${delay}s both`
                }}
              >
                <CardWrapper
                  project={project}
                  index={index}
                  hovered={hoveredIndex === index}
                  onHover={setHoveredIndex}
                  onClick={setSelectedProject}
                >
                  <CardContent
                    project={project}
                    maxVisibleTags={config.settings.maxVisibleTags}
                    titleMaxLines={config.settings.cardTitleMaxLines}
                    descriptionMaxChars={config.settings.cardDescriptionMaxChars}
                    theme={theme}
                    settings={config.settings}
                  />
                </CardWrapper>
              </div>
            )
          })}
        </div>
      ) : (
        // List view
        <div className="flex flex-col gap-4">
          {projectsHook.filtered.map((project: Project, index: number) => {
            const delay = getAnimationDelay(index, animationStyle)

            return (
              <div
                key={project.id}
                style={{
                  animation: `${getAnimationKeyframes(animationStyle)} 0.5s ease-out ${delay}s both`
                }}
              >
                <CardListItem
                  project={project}
                  maxVisibleTags={config.settings.maxVisibleTags}
                  descriptionMaxChars={config.settings.cardDescriptionMaxChars}
                  onClick={setSelectedProject}
                  theme={theme}
                  settings={config.settings}
                />
              </div>
            )
          })}
        </div>
      )}
    </div>
  )

  // Render footer
  const footer = (
    <footer className="border-t border-border py-8 px-4 mt-16 text-center">
      <p className="m-0 text-sm font-body text-text-muted">
        Built with deployd
      </p>
    </footer>
  )

  return (
    <>
      {/* Main page layout */}
      <PageLayout hero={hero} toolbar={toolbar} tagFilter={tagFilter} grid={grid} footer={footer} />

      {/* Modal */}
      {selectedProject && (
        <ModalWrapper project={selectedProject} onClose={() => setSelectedProject(null)}>
          <ModalContent project={selectedProject} theme={theme} settings={config.settings} />
        </ModalWrapper>
      )}

      {/* Scanline overlay (if theme enables it) */}
      {theme?.effects?.scanlines && <ScanlineOverlay />}
    </>
  )
}

/**
 * Get animation keyframe name based on style
 */
function getAnimationKeyframes(style: string): string {
  switch (style) {
    case 'fade':
      return 'fadeIn'
    case 'slide':
      return 'slideUp'
    case 'pop':
      return 'popIn'
    case 'type':
      return 'typeIn'
    default:
      return 'fadeIn'
  }
}

/**
 * Calculate staggered animation delay
 */
function getAnimationDelay(index: number, style: string): number {
  // Different stagger amounts based on animation style
  const staggerAmount = style === 'type' ? 0.05 : style === 'pop' ? 0.08 : 0.06
  return index * staggerAmount
}
