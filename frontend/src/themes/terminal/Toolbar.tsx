interface TerminalToolbarProps {
  search: string
  onSearchChange: (value: string) => void
  projectCount: number
}

export function Toolbar({ search, onSearchChange, projectCount }: TerminalToolbarProps) {
  return (
    <div>
      {/* Search */}
      <div
        style={{
          marginBottom: 24,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <span style={{ color: '#1A331A', fontSize: 13 }}>$ grep</span>
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="..."
          style={{
            background: 'transparent',
            border: 'none',
            borderBottom: '1px solid #1A331A',
            color: '#39FF14',
            fontSize: 13,
            fontFamily: 'inherit',
            outline: 'none',
            padding: '4px 0',
            width: 240,
          }}
        />
      </div>

      {/* Count */}
      <div
        style={{
          fontSize: 11,
          color: '#1A331A',
          marginBottom: 16,
        }}
      >
        --- {projectCount} processes found ---
      </div>
    </div>
  )
}
