import { cn } from '@core/utils/cn'

type Section = 'projects' | 'profile' | 'themes' | 'media' | 'settings'

interface AdminSidebarProps {
  activeSection: Section
  onSectionChange: (section: Section) => void
  hasChanges: boolean
  onSave: () => void
  onDiscard: () => void
  saving: boolean
  saveError: string | null
}

const sections = [
  { id: 'projects' as const, label: 'Projects', icon: '\u25EB' },
  { id: 'profile' as const, label: 'Profile', icon: '\u25C9' },
  { id: 'themes' as const, label: 'Theme', icon: '\u25C6' },
  { id: 'media' as const, label: 'Media', icon: '\u25A3' },
  { id: 'settings' as const, label: 'Settings', icon: '\u2699' },
]

export default function AdminSidebar({
  activeSection,
  onSectionChange,
  hasChanges,
  onSave,
  onDiscard,
  saving,
  saveError,
}: AdminSidebarProps) {

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:flex-col w-[220px] bg-card border-r border-border py-[var(--spacing-section)]">
        <div className="px-6 mb-8">
          <h2 className="text-lg font-bold text-text font-heading mb-0.5">Admin</h2>
          <p className="text-[11px] text-text-muted font-mono">deployd</p>
        </div>

        <nav>
          {sections.map(s => (
            <button
              key={s.id}
              onClick={() => onSectionChange(s.id)}
              className={cn(
                'flex items-center gap-2.5 w-full px-6 py-2.5 border-none cursor-pointer text-[13px] transition-all duration-200 text-left',
                activeSection === s.id
                  ? 'bg-accent-soft border-r-2 border-r-accent text-text font-semibold'
                  : 'bg-transparent border-r-2 border-r-transparent text-text-muted font-medium'
              )}
            >
              <span className="text-sm opacity-70">{s.icon}</span> {s.label}
            </button>
          ))}
        </nav>

        <div className="flex-1" />

        {/* Save/Discard Buttons */}
        <div className="px-6">
          {saveError && (
            <p className="text-[11px] text-error mb-3 leading-snug">{saveError}</p>
          )}

          {hasChanges && (
            <button
              onClick={onDiscard}
              disabled={saving}
              className={cn(
                'w-full px-4 py-2 rounded-md bg-transparent text-text-muted border border-border text-xs font-semibold mb-2',
                saving ? 'cursor-not-allowed opacity-50' : 'cursor-pointer opacity-100'
              )}
            >Discard</button>
          )}

          <button
            onClick={onSave}
            disabled={!hasChanges || saving}
            className={cn(
              'w-full px-4 py-2.5 rounded-md border-none text-[13px] font-semibold flex items-center justify-center gap-2',
              hasChanges
                ? 'bg-accent text-card'
                : 'bg-border text-text-muted',
              hasChanges && !saving ? 'cursor-pointer' : 'cursor-not-allowed'
            )}
          >
            {saving ? (
              <>
                <span className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin-slow inline-block opacity-40" />
                Saving...
              </>
            ) : (
              'Save'
            )}
          </button>
        </div>
      </aside>

      {/* Mobile Tabs */}
      <div className="flex md:hidden flex-col bg-card border-b border-border overflow-x-auto">
        <div className="flex px-4 py-3 gap-2">
          {sections.map(s => (
            <button
              key={s.id}
              onClick={() => onSectionChange(s.id)}
              className={cn(
                'px-4 py-2 rounded-md text-xs font-semibold cursor-pointer whitespace-nowrap flex items-center gap-1.5',
                activeSection === s.id
                  ? 'border border-accent bg-accent-soft text-accent'
                  : 'border border-border bg-card text-text-muted'
              )}
            >
              <span>{s.icon}</span>
              <span>{s.label}</span>
            </button>
          ))}
        </div>

        {/* Mobile save button */}
        {hasChanges && (
          <div className="px-4 pb-3 flex gap-2">
            <button
              onClick={onDiscard}
              disabled={saving}
              className={cn(
                'flex-1 px-4 py-2 rounded-md bg-transparent text-text-muted border border-border text-xs font-semibold',
                saving ? 'cursor-not-allowed opacity-50' : 'cursor-pointer opacity-100'
              )}
            >Discard</button>

            <button
              onClick={onSave}
              disabled={saving}
              className={cn(
                'flex-2 px-4 py-2 rounded-md bg-accent text-card border-none text-xs font-semibold',
                saving ? 'cursor-not-allowed' : 'cursor-pointer'
              )}
            >
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        )}

        {saveError && (
          <p className="text-[11px] text-error px-4 pb-3 leading-snug">{saveError}</p>
        )}
      </div>
    </>
  )
}
