import { config } from 'dotenv';
import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import { readFile, writeFile } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import rateLimit from 'express-rate-limit';
import bcrypt from 'bcrypt';
import type { AppConfig, HealthCheckResult } from './types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env from project root
config({ path: join(__dirname, '..', '.env') });

const app = express();

// Trust proxy - wichtig für korrekte IP-Erkennung hinter Caddy/Nginx
// Caddy setzt X-Forwarded-For Header mit echter Client-IP
app.set('trust proxy', true);

const PORT = process.env.PORT || 3000;
const CONFIG_PATH = join(__dirname, '..', 'data', 'config.json');
const DEFAULT_CONFIG_PATH = join(__dirname, '..', 'config', 'config.default.json');
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || '';
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || '*'; // For CORS

// Hash admin password on startup (cache it)
let ADMIN_PASSWORD_HASH = '';
if (ADMIN_PASSWORD) {
  ADMIN_PASSWORD_HASH = await bcrypt.hash(ADMIN_PASSWORD, 10);
  console.log('Admin password hashed successfully');
}

// Middleware
app.use(express.json());

// CORS - configurable via environment
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', ALLOWED_ORIGIN);
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Rate limiting for authentication endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Max 5 requests per window
  message: 'Too many authentication attempts, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
  // Skip rate limiting for successful requests
  skipSuccessfulRequests: true,
});

// Auth middleware for protected routes
const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid authorization header' });
  }

  const token = authHeader.substring(7); // Remove "Bearer " prefix

  // Use bcrypt to compare password hash
  try {
    const isValid = await bcrypt.compare(token, ADMIN_PASSWORD_HASH);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (error) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  next();
};

// Minimal fallback config (should never be used since config.default.json is always in the container)
// This exists only as a safety net if config.default.json is somehow missing
const DEFAULT_CONFIG: AppConfig = {
  profile: {
    name: 'deployd',
    tagline: 'Configuration Error: config.default.json is missing',
    bio: '**Error**: The default configuration file is missing from the container. Please rebuild the Docker image.',
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
        // No tags in fallback config - all tags are in config.default.json
      ],
      custom: []
    }
  }
};
// Helper function to load default config from template file
async function loadDefaultConfig(): Promise<AppConfig> {
  try {
    const data = await readFile(DEFAULT_CONFIG_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Warning: Could not read config.default.json, using minimal fallback');
    return DEFAULT_CONFIG; // Fallback to hardcoded minimal config
  }
}

// Helper function to read config
async function readConfig(): Promise<AppConfig> {
  try {
    const data = await readFile(CONFIG_PATH, 'utf-8');
    const config = JSON.parse(data);

    // If config is empty or missing required fields, use defaults from template
    if (!config || !config.profile || Object.keys(config).length === 0) {
      console.log('config.json is empty or invalid, loading default configuration from template');
      const defaultConfig = await loadDefaultConfig();
      await saveConfig(defaultConfig);
      return defaultConfig;
    }

    return config;
  } catch (error: unknown) {
    // If file doesn't exist, create it with default config from template
    if (error && typeof error === 'object' && 'code' in error && error.code === 'ENOENT') {
      console.log('config.json not found, loading default configuration from template');
      const defaultConfig = await loadDefaultConfig();
      await saveConfig(defaultConfig);
      return defaultConfig;
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

// PUT /api/config - Update config (requires auth + rate limiting)
app.put('/api/config', authLimiter, requireAuth, async (req: Request, res: Response) => {
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
  } catch (error: unknown) {
    // URL is not reachable - return graceful failure
    const isAbortError = error && typeof error === 'object' && 'name' in error && error.name === 'AbortError';
    const result: HealthCheckResult = {
      online: false,
      error: isAbortError ? 'Timeout' : 'Unreachable'
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

// GET /api/github/readme/:username - Get README from profile repository
app.get('/api/github/readme/:username', async (req: Request, res: Response) => {
  const { username } = req.params;

  try {
    const headers: HeadersInit = {
      'Accept': 'application/vnd.github.v3.raw',
      'User-Agent': 'Project-Showcase',
    };

    if (GITHUB_TOKEN) {
      headers['Authorization'] = `token ${GITHUB_TOKEN}`;
    }

    // Try to fetch README.md from the profile repository (repo name same as username)
    const response = await fetch(
      `https://api.github.com/repos/${username}/${username}/readme`,
      { headers }
    );

    if (!response.ok) {
      // If 404, the profile repo doesn't exist or has no README
      if (response.status === 404) {
        return res.status(404).json({
          error: 'Profile README not found'
        });
      }

      return res.status(response.status).json({
        error: `GitHub API error: ${response.statusText}`
      });
    }

    // Return the raw markdown content
    const markdown = await response.text();
    res.json({ content: markdown });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch GitHub README' });
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
