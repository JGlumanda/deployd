
import type { Theme } from '@core/types'
import { CardWrapper } from './CardWrapper'

export const brutalist: Theme = {
  name: 'brutalist',
  displayName: 'Brutalist',
  description: 'Bold design with thick borders, offset shadows, and vibrant colors',
  tokens: {
    colors: {
      bg: '#F0EBE3',
      bgAlt: '#FFF',
      card: '#FFF',
      cardHover: '#FFF',
      border: '#000',
      text: '#555',
      textMuted: '#888',
      heading: '#000',
      accent: '#000',
      accentSoft: '#00000014',
      error: '#FF6B6B',
      errorBg: '#FFE5E5',
      statusActive: '#A8E6CF',
      statusWip: '#FFE66D',
      statusArchived: '#DDD',
      // Input field colors
      inputBg: '#FFF',
      inputText: '#000',
      inputBorder: '#000',
      inputBorderFocus: '#000',
      inputPlaceholder: '#999',
    },
    fonts: {
      heading: "'Syne', sans-serif",
      body: "'Work Sans', sans-serif",
      mono: "'Work Sans', sans-serif",
      googleFontsUrls: [
        'https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=Work+Sans:wght@400;500;600;700;800;900&display=swap',
      ],
    },
    radius: {
      sm: '0px',
      md: '0px',
      lg: '0px',
    },
    spacing: {
      cardPadding: '16px 18px 18px',
      gridGap: '20px',
      sectionGap: '48px',
      section: '28px',
    },
  },
  overrides: {
    CardWrapper,
  },
  effects: {
    cardRotation: 0.4,
    animationStyle: 'pop',
    cardShadow: 'offset',
  },
}
