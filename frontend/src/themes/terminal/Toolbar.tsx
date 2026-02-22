interface TerminalToolbarProps {
  search: string
  onSearchChange: (value: string) => void
  projectCount: number
}

export function Toolbar({ search, onSearchChange, projectCount }: TerminalToolbarProps) {
  return (
    <div>
      {/* Search */}
      <div className="mb-6 flex items-center gap-2">
        <span style={{ color: '#1A331A', fontSize: 13 }}>$ grep</span>
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="..."
          className="bg-transparent border-none outline-none w-[240px]"
          style={{
            borderBottom: '1px solid #1A331A',
            color: '#39FF14',
            fontSize: 13,
            fontFamily: 'inherit',
            padding: '4px 0',
          }}
        />
      </div>

      {/* Count */}
      <div
        className="mb-4"
        style={{ fontSize: 11, color: '#1A331A' }}
      >
        --- {projectCount} processes found ---
      </div>
    </div>
  )
}
