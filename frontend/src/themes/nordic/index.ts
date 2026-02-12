import type { Theme } from '@core/types'

export const nordic: Theme = {
  name: 'nordic',
  displayName: 'Nordic',
  description: 'Warm, minimalist design with serif typography and soft shadows',
  tokens: {
    colors: {
      bg: '#F5F1EB',
      bgAlt: '#FFFFFF',
      card: '#FFFFFF',
      cardHover: '#FAFAFA',
      border: '#E2DDD5',
      text: '#6B7B8D',
      textMuted: '#A0ADB8',
      heading: '#2C3E50',
      accent: '#6B8FA3',
      accentSoft: '#6B8FA314',
      error: '#D4A0A0',
      statusActive: '#7BAE7F',
      statusWip: '#C4A35A',
      statusArchived: '#A0ADB8',
    },
    fonts: {
      heading: "'Libre Baskerville', Georgia, serif",
      body: "'Karla', sans-serif",
      mono: "'IBM Plex Mono', monospace",
      googleFontsUrls: [
        'https://fonts.googleapis.com/css2?family=Libre+Baskerville:wght@400;700&family=Karla:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap',
      ],
    },
    radius: {
      sm: '4px',
      md: '8px',
      lg: '12px',
    },
    spacing: {
      cardPadding: '24px',
      gridGap: '18px',
      sectionGap: '56px',
      section: '32px',
    },
  },
  effects: {
    animationStyle: 'fade',
    cardShadow: 'soft',
  },
}
