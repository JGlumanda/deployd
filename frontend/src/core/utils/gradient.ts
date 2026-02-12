/**
 * Generates a deterministic gradient CSS string from a title hash
 * @param title - Project title to hash
 * @returns CSS gradient string
 */
export function generateGradient(title: string): string {
  // Simple hash function
  let hash = 0
  for (let i = 0; i < title.length; i++) {
    const char = title.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32bit integer
  }

  // Generate colors based on hash
  const hue1 = Math.abs(hash) % 360
  const hue2 = (hue1 + 60) % 360
  const hue3 = (hue1 + 120) % 360

  const saturation = 65 + (Math.abs(hash >> 8) % 20)
  const lightness = 55 + (Math.abs(hash >> 16) % 15)

  const color1 = `hsl(${hue1}, ${saturation}%, ${lightness}%)`
  const color2 = `hsl(${hue2}, ${saturation}%, ${lightness}%)`
  const color3 = `hsl(${hue3}, ${saturation}%, ${lightness}%)`

  // Choose gradient direction based on hash
  const directions = [
    '135deg',
    '45deg',
    '225deg',
    '315deg'
  ]
  const direction = directions[Math.abs(hash >> 24) % directions.length]

  return `linear-gradient(${direction}, ${color1}, ${color2}, ${color3})`
}
