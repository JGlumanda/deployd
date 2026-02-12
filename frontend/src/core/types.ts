// Core Data Types

export interface AppConfig {
  profile: Profile;
  projects: Project[];
  theme: { active: string };
  settings: Settings;
}

export interface Profile {
  name: string;
  tagline: string;
  bio: string;
  avatar?: string | null;
  links: {
    github?: string;
    linkedin?: string;
    email?: string;
    website?: string;
    [key: string]: string | undefined;
  };
}

export interface Tag {
  name: string;
  color?: string;
}

export const PROJECT_STATUSES = ["active", "wip", "archived"] as const;
export type ProjectStatus = typeof PROJECT_STATUSES[number];

export interface Project {
  id: string | number;
  title: string;
  description: string;
  tags: string[];
  status: ProjectStatus;
  featured: boolean;
  links: {
    live?: string;
    github?: string;
    docs?: string;
  };
  image?: string | null;
  date: string; // Format: "YYYY-MM"
}

export interface Settings {
  maxVisibleTags: number;
  cardDescriptionMaxChars: number;
  cardTitleMaxLines: number;
  healthCheck: {
    enabled: boolean;
    intervalMinutes: number;
  };
  tags: {
    predefined: Tag[];
    custom: Tag[];
  };
}

export interface HealthCheckResult {
  online: boolean;
  statusCode?: number;
  error?: string;
}

// Theme Types

export interface ThemeTokens {
  colors: {
    bg: string;
    bgAlt: string;
    card: string;
    cardHover: string;
    border: string;
    text: string;
    textMuted: string;
    heading: string;
    accent: string;
    accentSoft: string;
    error: string;
    statusActive: string;
    statusWip: string;
    statusArchived: string;
  };
  fonts: {
    heading: string;
    body: string;
    mono: string;
    googleFontsUrls?: string[];
  };
  radius: {
    sm: string;
    md: string;
    lg: string;
  };
  spacing: {
    cardPadding: string;
    gridGap: string;
    sectionGap: string;
    section: string;
  };
}

export const ANIMATION_STYLES = ["fade", "slide", "pop", "type"] as const;
export type AnimationStyle = typeof ANIMATION_STYLES[number];

export const CARD_SHADOW_STYLES = ["none", "soft", "medium", "hard", "offset"] as const;
export type CardShadowStyle = typeof CARD_SHADOW_STYLES[number];

export interface ThemeEffects {
  scanlines?: boolean;
  cardRotation?: boolean | number;
  animationStyle?: AnimationStyle;
  cardShadow?: CardShadowStyle;
}

export interface ThemeOverrides {
  CardWrapper?: React.ComponentType<CardWrapperProps>;
  HeroLayout?: React.ComponentType<HeroLayoutProps>;
  PageLayout?: React.ComponentType<PageLayoutProps>;
  ModalWrapper?: React.ComponentType<ModalWrapperProps>;
}

export interface Theme {
  name: string;
  displayName: string;
  description?: string;
  tokens: ThemeTokens;
  overrides?: ThemeOverrides;
  effects?: ThemeEffects;
}

// Component Prop Types

export interface CardWrapperProps {
  project: Project;
  index: number;
  hovered: boolean;
  onHover: (index: number | null) => void;
  onClick: (project: Project) => void;
  children: React.ReactNode;
}

export interface HeroLayoutProps {
  profile: Profile;
  children?: React.ReactNode;
}

export interface PageLayoutProps {
  hero: React.ReactNode;
  toolbar: React.ReactNode;
  tagFilter?: React.ReactNode;
  grid: React.ReactNode;
  footer: React.ReactNode;
  sidebar?: React.ReactNode;
}

export interface ModalWrapperProps {
  project: Project;
  onClose: () => void;
  children: React.ReactNode;
}
