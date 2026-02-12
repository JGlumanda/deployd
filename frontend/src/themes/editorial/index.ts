import type { Theme } from '@core/types'
import { PageLayout } from './PageLayout'
import { HeroLayout } from './HeroLayout'

export const editorial: Theme = {
  name: 'editorial',
  displayName: 'Editorial',
  description: 'Magazine-style layout with elegant typography and 2-column design',
  tokens: {
    colors: {
      bg: '#F5F0E8',
      bgAlt: '#FFFDF8',
      card: '#FFFDF8',
      cardHover: '#FAF7F2',
      border: '#D4C9B8',
      text: '#777',
      textMuted: '#999',
      heading: '#1A1A1A',
      accent: '#1A1A1A',
      accentSoft: '#1A1A1A14',
      error: '#C44536',
      errorBg: '#FFEAE8',
      statusActive: '#2D6A4F',
      statusWip: '#B8860B',
      statusArchived: '#999',
      // Input field colors
      inputBg: '#FFFDF8',
      inputText: '#1A1A1A',
      inputBorder: '#D4C9B8',
      inputBorderFocus: '#1A1A1A',
      inputPlaceholder: '#AAA',
    },
    fonts: {
      heading: "'Playfair Display', Georgia, serif",
      body: "'Source Sans 3', 'Segoe UI', sans-serif",
      mono: "'Cormorant Garamond', serif",
      googleFontsUrls: [
        'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700;800;900&family=Source+Sans+3:wght@300;400;500;600;700&family=Cormorant+Garamond:wght@400;500;600;700&display=swap',
      ],
    },
    radius: {
      sm: '0px',
      md: '0px',
      lg: '0px',
    },
    spacing: {
      cardPadding: '20px 0',
      gridGap: '0px',
      sectionGap: '48px',
      section: '32px',
    },
  },
  overrides: {
    PageLayout,
    HeroLayout,
  },
  effects: {
    animationStyle: 'fade',
    cardShadow: 'none',
  },
}
