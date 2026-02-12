import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import { readFile, writeFile } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import type { AppConfig, HealthCheckResult } from './types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const CONFIG_PATH = join(__dirname, '..', 'config.json');
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || '';

// Middleware
app.use(express.json());

// CORS for development
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Auth middleware for protected routes
const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid authorization header' });
  }

  const token = authHeader.substring(7); // Remove "Bearer " prefix

  if (token !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  next();
};

// Default config to use when config.json doesn't exist
const DEFAULT_CONFIG: AppConfig = {
  profile: {
    name: 'Your Name',
    tagline: 'Software Developer',
    bio: 'Welcome to my project showcase. Edit this in the admin panel.',
    avatar: null,
    links: {}
  },
  projects: [],
  theme: {
    active: 'nordic'
  },
  settings: {
    maxVisibleTags: 4,
    cardDescriptionMaxChars: 120,
    cardTitleMaxLines: 1,
    healthCheck: {
      enabled: false,
      intervalMinutes: 5
    },
    tags: {
      predefined: [
        { name: 'TypeScript', color: '#3178c6' },
        { name: 'React', color: '#61dafb' },
        { name: 'Node.js', color: '#339933' },
        { name: 'Python', color: '#3776ab' },
        { name: 'Docker', color: '#2496ed' }
      ],
      custom: []
    }
  }
};

// Helper function to read config
async function readConfig(): Promise<AppConfig> {
  try {
    const data = await readFile(CONFIG_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (error: any) {
    // If file doesn't exist, create it with default config
    if (error.code === 'ENOENT') {
      console.log('config.json not found, creating default configuration');
      await saveConfig(DEFAULT_CONFIG);
      return DEFAULT_CONFIG;
    }
    throw new Error('Failed to read config.json');
  }
}

// Helper function to write config
async function saveConfig(config: AppConfig): Promise<void> {
  try {
    await writeFile(CONFIG_PATH, JSON.stringify(config, null, 2), 'utf-8');
  } catch (error) {
    throw new Error('Failed to write config.json');
  }
}

// API Routes

// GET /api/config - Read config.json, return JSON
app.get('/api/config', async (req: Request, res: Response) => {
  try {
    const config = await readConfig();
    res.json(config);
  } catch (error) {
    res.status(500).json({ error: 'Failed to load configuration' });
  }
});

// PUT /api/config - Update config (requires auth)
app.put('/api/config', requireAuth, async (req: Request, res: Response) => {
  try {
    const newConfig = req.body;

    // Validate that required fields are present
    if (!newConfig.profile || !newConfig.projects || !newConfig.theme) {
      return res.status(400).json({
        error: 'Invalid config: must contain profile, projects, and theme'
      });
    }

    await saveConfig(newConfig);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save configuration' });
  }
});

// GET /api/health?url=<url> - Check if URL is reachable
app.get('/api/health', async (req: Request, res: Response) => {
  const url = req.query.url as string;

  if (!url) {
    return res.status(400).json({ error: 'Missing url parameter' });
  }

  // Validate URL format
  try {
    new URL(url);
  } catch {
    return res.json({
      online: false,
      error: 'Invalid URL format'
    });
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const response = await fetch(url, {
      method: 'HEAD',
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const result: HealthCheckResult = {
      online: response.ok,
      statusCode: response.status,
    };

    res.json(result);
  } catch (error: any) {
    // URL is not reachable - return graceful failure
    const result: HealthCheckResult = {
      online: false,
      error: error.name === 'AbortError' ? 'Timeout' : 'Unreachable'
    };
    res.json(result);
  }
});

// GET /api/themes - Return available theme names
app.get('/api/themes', (req: Request, res: Response) => {
  res.json(['nordic', 'terminal', 'editorial', 'brutalist']);
});

// GitHub API proxy routes

// GET /api/github/user/:username - Proxy to GitHub users API
app.get('/api/github/user/:username', async (req: Request, res: Response) => {
  const { username } = req.params;

  try {
    const headers: HeadersInit = {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'Project-Showcase',
    };

    if (GITHUB_TOKEN) {
      headers['Authorization'] = `token ${GITHUB_TOKEN}`;
    }

    const response = await fetch(`https://api.github.com/users/${username}`, {
      headers,
    });

    if (!response.ok) {
      return res.status(response.status).json({
        error: `GitHub API error: ${response.statusText}`
      });
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch GitHub user data' });
  }
});

// GET /api/github/repos/:username - Proxy to GitHub repos API
app.get('/api/github/repos/:username', async (req: Request, res: Response) => {
  const { username } = req.params;

  try {
    const headers: HeadersInit = {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'Project-Showcase',
    };

    if (GITHUB_TOKEN) {
      headers['Authorization'] = `token ${GITHUB_TOKEN}`;
    }

    const response = await fetch(
      `https://api.github.com/users/${username}/repos?per_page=100&sort=updated`,
      { headers }
    );

    if (!response.ok) {
      return res.status(response.status).json({
        error: `GitHub API error: ${response.statusText}`
      });
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch GitHub repositories' });
  }
});

// GET /api/github/socials/:username - Proxy to GitHub social accounts API
app.get('/api/github/socials/:username', async (req: Request, res: Response) => {
  const { username } = req.params;

  try {
    const headers: HeadersInit = {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'Project-Showcase',
    };

    if (GITHUB_TOKEN) {
      headers['Authorization'] = `token ${GITHUB_TOKEN}`;
    }

    const response = await fetch(
      `https://api.github.com/users/${username}/social_accounts`,
      { headers }
    );

    if (!response.ok) {
      return res.status(response.status).json({
        error: `GitHub API error: ${response.statusText}`
      });
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch GitHub social accounts' });
  }
});

// Static file serving for production (frontend/dist/)
const DIST_PATH = join(__dirname, '..', 'frontend', 'dist');
app.use(express.static(DIST_PATH));

// SPA fallback - serve index.html for all other routes
// Note: In Express 5, we need to handle the catch-all differently
app.use((req: Request, res: Response) => {
  res.sendFile(join(DIST_PATH, 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Config path: ${CONFIG_PATH}`);
  console.log(`Admin auth: ${ADMIN_PASSWORD ? 'enabled' : 'disabled (set ADMIN_PASSWORD)'}`);
  console.log(`GitHub token: ${GITHUB_TOKEN ? 'configured' : 'not set (rate limited)'}`);
});
