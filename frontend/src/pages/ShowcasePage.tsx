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
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          fontFamily: 'system-ui',
          backgroundColor: '#f5f5f5'
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: '1.5rem', color: '#333' }}>Loading...</h1>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          fontFamily: 'system-ui',
          backgroundColor: '#f5f5f5',
          padding: '2rem'
        }}
      >
        <div style={{ textAlign: 'center', maxWidth: '600px' }}>
          <h1 style={{ fontSize: '1.5rem', color: '#ef4444', marginBottom: '1rem' }}>Error</h1>
          <p style={{ color: '#666' }}>{error}</p>
        </div>
      </div>
    )
  }

  // No config state
  if (!config) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          fontFamily: 'system-ui',
          backgroundColor: '#f5f5f5'
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: '1.5rem', color: '#333', marginBottom: '0.5rem' }}>
            No Configuration
          </h1>
          <p style={{ color: '#666' }}>Configuration data is not available.</p>
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
      <div
        style={{
          marginBottom: 24,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}
      >
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
      <div
        style={{
          fontSize: 12,
          color: '#1A331A',
          marginBottom: 18,
        }}
      >
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
    />
  )

  // Render grid or list
  const grid = (
    <div
      style={{
        padding: '2rem 0'
      }}
    >
      {/* Project count (Terminal shows this in toolbar) */}
      {!isTerminal && (
        <div
          style={{
            marginBottom: '1.5rem',
            fontSize: '0.875rem',
            fontFamily: 'var(--font-body)',
            color: 'var(--color-text-muted)'
          }}
        >
          {projectsHook.filtered.length} {projectsHook.filtered.length === 1 ? 'project' : 'projects'} found
        </div>
      )}

      {/* Empty state */}
      {projectsHook.filtered.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            padding: '4rem 2rem',
            color: 'var(--color-text-muted)'
          }}
        >
          <p style={{ fontSize: '1.125rem', fontFamily: 'var(--font-body)' }}>
            {config.projects.length === 0
              ? 'No projects yet. Add your first project in the admin panel.'
              : 'No projects found matching your filters.'}
          </p>
        </div>
      ) : viewMode === 'grid' ? (
        // Grid view
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: isTerminal
              ? 'repeat(auto-fill, minmax(290px, 1fr))'
              : 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: 'var(--spacing-grid-gap)'
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
                  />
                </CardWrapper>
              </div>
            )
          })}
        </div>
      ) : (
        // List view
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}
        >
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
    <footer
      style={{
        borderTop: '1px solid var(--color-border)',
        padding: '2rem 1rem',
        marginTop: '4rem',
        textAlign: 'center'
      }}
    >
      <p
        style={{
          margin: 0,
          fontSize: '0.875rem',
          fontFamily: 'var(--font-body)',
          color: 'var(--color-text-muted)'
        }}
      >
        Built with deployd
      </p>
    </footer>
  )

  return (
    <>
      {/* Inject animation keyframes */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }

          @keyframes slideUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes popIn {
            0% {
              opacity: 0;
              transform: scale(0.8);
            }
            50% {
              transform: scale(1.05);
            }
            100% {
              opacity: 1;
              transform: scale(1);
            }
          }

          @keyframes typeIn {
            from {
              opacity: 0;
              transform: translateX(-10px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }

          @keyframes modalFadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }

          @keyframes modalSlideUp {
            from {
              opacity: 0;
              transform: translateY(20px) translateZ(0);
            }
            to {
              opacity: 1;
              transform: translateY(0) translateZ(0);
            }
          }

          @media (max-width: 768px) {
            [style*="gridTemplateColumns"] {
              grid-template-columns: 1fr !important;
            }
          }

          @media (min-width: 769px) and (max-width: 1024px) {
            [style*="gridTemplateColumns"] {
              grid-template-columns: repeat(2, 1fr) !important;
            }
          }
        `}
      </style>

      {/* Main page layout */}
      <PageLayout hero={hero} toolbar={toolbar} tagFilter={tagFilter} grid={grid} footer={footer} />

      {/* Modal */}
      {selectedProject && (
        <ModalWrapper project={selectedProject} onClose={() => setSelectedProject(null)}>
          <ModalContent project={selectedProject} theme={theme} />
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
