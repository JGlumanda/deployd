// Backend type definitions (server-side subset, no React types)

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
  githubUsername?: string; // Saved GitHub username for quick import
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
  githubUsername?: string; // Saved GitHub username for quick import
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
