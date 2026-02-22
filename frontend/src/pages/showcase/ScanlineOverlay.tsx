export function ScanlineOverlay() {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-[9999] opacity-50"
      style={{
        background: `
          repeating-linear-gradient(
            0deg,
            rgba(0, 0, 0, 0.05),
            rgba(0, 0, 0, 0.05) 1px,
            transparent 1px,
            transparent 2px
          )
        `
      }}
    />
  )
}
