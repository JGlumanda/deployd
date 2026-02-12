import type { Theme } from '@core/types'
import { CardWrapper } from './CardWrapper'
import { HeroLayout } from './HeroLayout'

export const terminal: Theme = {
  name: 'terminal',
  displayName: 'Terminal',
  description: 'Retro green-on-black terminal aesthetic with scanlines and monospace fonts',
  tokens: {
    colors: {
      bg: '#050505',
      bgAlt: '#0A0A0A',
      card: '#0A0A0A',
      cardHover: '#0D1A0D',
      border: '#1A331A',
      text: '#4A8C4A',
      textMuted: '#2D7A2D',
      heading: '#39FF14',
      accent: '#39FF14',
      accentSoft: '#39FF1414',
      statusActive: '#39FF14',
      statusWip: '#FFD700',
      statusArchived: '#666',
    },
    fonts: {
      heading: "'Fira Code', monospace",
      body: "'Fira Code', monospace",
      mono: "'Fira Code', monospace",
      googleFontsUrls: [
        'https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500;600;700&display=swap',
      ],
    },
    radius: {
      sm: '0px',
      md: '0px',
      lg: '0px',
    },
    spacing: {
      cardPadding: '16px 18px',
      gridGap: '12px',
      sectionGap: '40px',
    },
  },
  overrides: {
    CardWrapper,
    HeroLayout,
  },
  effects: {
    scanlines: true,
    animationStyle: 'type',
    cardShadow: 'none',
  },
}
