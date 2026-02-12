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
const CONFIG_PATH = join(__dirname, '..', 'config.json');
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

// Default config to use when config.json doesn't exist
const DEFAULT_CONFIG: AppConfig = {
  profile: {
    name: 'deployd',
    tagline: 'Self-hosted Project Showcase',
    bio: 'Welcome to deployd - a modern, themeable project showcase platform. Edit this profile in the admin panel to get started.',
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
        // Frontend Frameworks & Libraries
        { name: 'React', color: '#61dafb' },
        { name: 'Vue', color: '#4fc08d' },
        { name: 'Angular', color: '#dd0031' },
        { name: 'Svelte', color: '#ff3e00' },
        { name: 'Next.js', color: '#000000' },
        { name: 'Nuxt', color: '#00dc82' },
        { name: 'Astro', color: '#ff5d01' },
        { name: 'SolidJS', color: '#446b9e' },
        { name: 'Preact', color: '#673ab8' },
        { name: 'Qwik', color: '#18b6f6' },

        // Backend Frameworks
        { name: 'Node.js', color: '#339933' },
        { name: 'Express', color: '#000000' },
        { name: 'Fastify', color: '#000000' },
        { name: 'NestJS', color: '#e0234e' },
        { name: 'Django', color: '#092e20' },
        { name: 'Flask', color: '#000000' },
        { name: 'FastAPI', color: '#009688' },
        { name: 'Spring Boot', color: '#6db33f' },
        { name: 'Laravel', color: '#ff2d20' },
        { name: 'Ruby on Rails', color: '#cc0000' },
        { name: 'ASP.NET', color: '#512bd4' },
        { name: 'Go Fiber', color: '#00add8' },

        // Programming Languages
        { name: 'TypeScript', color: '#3178c6' },
        { name: 'JavaScript', color: '#f7df1e' },
        { name: 'Python', color: '#3776ab' },
        { name: 'Java', color: '#007396' },
        { name: 'Go', color: '#00add8' },
        { name: 'Rust', color: '#000000' },
        { name: 'C++', color: '#00599c' },
        { name: 'C#', color: '#239120' },
        { name: 'PHP', color: '#777bb4' },
        { name: 'Ruby', color: '#cc342d' },
        { name: 'Swift', color: '#f05138' },
        { name: 'Kotlin', color: '#7f52ff' },
        { name: 'Dart', color: '#0175c2' },
        { name: 'Elixir', color: '#4b275f' },
        { name: 'Scala', color: '#dc322f' },

        // Databases
        { name: 'PostgreSQL', color: '#4169e1' },
        { name: 'MySQL', color: '#4479a1' },
        { name: 'MongoDB', color: '#47a248' },
        { name: 'Redis', color: '#dc382d' },
        { name: 'SQLite', color: '#003b57' },
        { name: 'MariaDB', color: '#003545' },
        { name: 'Supabase', color: '#3ecf8e' },
        { name: 'Firebase', color: '#ffca28' },
        { name: 'Prisma', color: '#2d3748' },
        { name: 'Drizzle', color: '#c5f74f' },

        // DevOps & Cloud
        { name: 'Docker', color: '#2496ed' },
        { name: 'Kubernetes', color: '#326ce5' },
        { name: 'AWS', color: '#ff9900' },
        { name: 'Azure', color: '#0078d4' },
        { name: 'GCP', color: '#4285f4' },
        { name: 'Vercel', color: '#000000' },
        { name: 'Netlify', color: '#00c7b7' },
        { name: 'Heroku', color: '#430098' },
        { name: 'DigitalOcean', color: '#0080ff' },
        { name: 'Cloudflare', color: '#f38020' },
        { name: 'Terraform', color: '#7b42bc' },
        { name: 'Ansible', color: '#ee0000' },

        // Mobile Development
        { name: 'React Native', color: '#61dafb' },
        { name: 'Flutter', color: '#02569b' },
        { name: 'Expo', color: '#000020' },
        { name: 'Ionic', color: '#3880ff' },
        { name: 'Capacitor', color: '#119eff' },

        // CSS & Styling
        { name: 'Tailwind CSS', color: '#06b6d4' },
        { name: 'Sass', color: '#cc6699' },
        { name: 'CSS', color: '#1572b6' },
        { name: 'Styled Components', color: '#db7093' },
        { name: 'Emotion', color: '#d36ac2' },
        { name: 'Material-UI', color: '#007fff' },
        { name: 'Chakra UI', color: '#319795' },
        { name: 'shadcn/ui', color: '#000000' },

        // State Management
        { name: 'Redux', color: '#764abc' },
        { name: 'Zustand', color: '#443e38' },
        { name: 'Jotai', color: '#000000' },
        { name: 'Recoil', color: '#3578e5' },
        { name: 'MobX', color: '#ff9955' },
        { name: 'Pinia', color: '#ffd859' },

        // Testing
        { name: 'Jest', color: '#c21325' },
        { name: 'Vitest', color: '#6e9f18' },
        { name: 'Cypress', color: '#17202c' },
        { name: 'Playwright', color: '#2ead33' },
        { name: 'Testing Library', color: '#e33332' },

        // Build Tools & Bundlers
        { name: 'Vite', color: '#646cff' },
        { name: 'Webpack', color: '#8dd6f9' },
        { name: 'Turbopack', color: '#0a7ea4' },
        { name: 'esbuild', color: '#ffcf00' },
        { name: 'Rollup', color: '#ec4a3f' },
        { name: 'Parcel', color: '#e7a87b' },

        // GraphQL & APIs
        { name: 'GraphQL', color: '#e10098' },
        { name: 'Apollo', color: '#311c87' },
        { name: 'tRPC', color: '#2596be' },
        { name: 'REST API', color: '#009688' },
        { name: 'gRPC', color: '#244c5a' },

        // Tools & Others
        { name: 'Git', color: '#f05032' },
        { name: 'GitHub', color: '#181717' },
        { name: 'GitLab', color: '#fc6d26' },
        { name: 'GitHub Actions', color: '#2088ff' },
        { name: 'Jenkins', color: '#d24939' },
        { name: 'CircleCI', color: '#343434' },
        { name: 'Nginx', color: '#009639' },
        { name: 'Apache', color: '#d22128' },
        { name: 'Linux', color: '#fcc624' },
        { name: 'Ubuntu', color: '#e95420' },
        { name: 'VS Code', color: '#007acc' },
        { name: 'Figma', color: '#f24e1e' },
        { name: 'Postman', color: '#ff6c37' },
        { name: 'Stripe', color: '#008cdd' },
        { name: 'OpenAI', color: '#412991' },
        { name: 'TensorFlow', color: '#ff6f00' },
        { name: 'PyTorch', color: '#ee4c2c' },
        { name: 'Electron', color: '#47848f' },
        { name: 'Tauri', color: '#ffc131' }
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
  } catch (error: unknown) {
    // If file doesn't exist, create it with default config
    if (error && typeof error === 'object' && 'code' in error && error.code === 'ENOENT') {
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
