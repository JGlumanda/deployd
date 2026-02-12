// Import all themes
import { nordic } from './nordic'
import { terminal } from './terminal'
import { editorial } from './editorial'
import { brutalist } from './brutalist'

// Import and re-export registry functions
import {
  registerTheme,
  getTheme,
  getAllThemes,
  getThemeNames,
} from './registry'

// Register all themes
registerTheme(nordic)
registerTheme(terminal)
registerTheme(editorial)
registerTheme(brutalist)

// Re-export registry functions
export { registerTheme, getTheme, getAllThemes, getThemeNames }
