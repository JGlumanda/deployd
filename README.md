# Project Showcase

A self-hostable, themeable web application for presenting software projects. Built with React, TypeScript, Vite, and Express.

## Features

- **4 Built-in Themes**: Nordic, Terminal, Editorial, Brutalist
- **GitHub Integration**: Import projects and profile data directly from GitHub
- **Health Monitoring**: Optional live status checks for project URLs
- **Responsive Design**: Mobile-first, works on all screen sizes
- **Admin Panel**: Full-featured editor for projects, profile, and settings
- **Accessible**: Keyboard navigation, ARIA labels, focus management
- **Docker Ready**: Single-command deployment

## Quick Start with Docker

### Using docker-compose (Recommended)

1. Clone the repository:
```bash
git clone https://github.com/yourusername/project-showcase.git
cd project-showcase
```

2. Create a `.env` file (optional):
```bash
ADMIN_PASSWORD=your-secure-password
GITHUB_TOKEN=your-github-token
```

3. Start the application:
```bash
docker-compose up -d
```

4. Open http://localhost:3000

### Using Docker directly

```bash
docker build -t project-showcase .
docker run -p 3000:3000 \
  -e ADMIN_PASSWORD=your-password \
  -e GITHUB_TOKEN=your-token \
  -v $(pwd)/config.json:/app/config.json \
  project-showcase
```

## Local Development

### Prerequisites

- Node.js 20+
- npm or pnpm

### Setup

1. Install dependencies:
```bash
npm install
```

2. Set environment variables (optional):
```bash
export ADMIN_PASSWORD=admin
export GITHUB_TOKEN=ghp_yourtoken
```

3. Start the development servers:
```bash
npm run dev
```

This starts:
- Frontend dev server on http://localhost:5173
- Backend API server on http://localhost:3000

### Available Scripts

- `npm run dev` - Start both frontend and backend in development mode
- `npm run dev:frontend` - Start only frontend dev server
- `npm run dev:backend` - Start only backend dev server
- `npm run build` - Build frontend for production
- `npm run typecheck` - Run TypeScript type checking
- `npm run preview` - Preview production build locally

## Configuration

All data is stored in `config.json` at the project root. The file is created automatically with defaults if it doesn't exist.

### Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `ADMIN_PASSWORD` | No | `""` | Password for admin panel access |
| `GITHUB_TOKEN` | No | `""` | GitHub Personal Access Token (increases API rate limit from 60 to 5000 requests/hour) |
| `PORT` | No | `3000` | Server port |
| `NODE_ENV` | No | `development` | Environment mode |

### Config Structure

```json
{
  "profile": {
    "name": "Your Name",
    "tagline": "Your tagline",
    "bio": "Your bio",
    "avatar": "https://...",
    "links": {
      "github": "https://github.com/...",
      "linkedin": "https://linkedin.com/in/...",
      "email": "mailto:..."
    }
  },
  "projects": [
    {
      "id": 1,
      "title": "Project Name",
      "description": "Project description",
      "tags": ["React", "TypeScript"],
      "status": "active",
      "featured": true,
      "links": {
        "live": "https://...",
        "github": "https://github.com/...",
        "docs": "https://..."
      },
      "image": "https://...",
      "date": "2025-01"
    }
  ],
  "theme": {
    "active": "nordic"
  },
  "settings": {
    "maxVisibleTags": 4,
    "cardDescriptionMaxChars": 120,
    "cardTitleMaxLines": 1,
    "healthCheck": {
      "enabled": false,
      "intervalMinutes": 5
    },
    "tags": {
      "predefined": [...],
      "custom": [...]
    }
  }
}
```

## Admin Panel

Access the admin panel at `/admin`. You'll be prompted for the password if `ADMIN_PASSWORD` is set.

Features:
- **Projects**: Add, edit, delete, and import projects from GitHub
- **Profile**: Edit your profile information and import from GitHub
- **Theme**: Switch between 4 built-in themes
- **Settings**: Configure display options, health checks, and manage tags

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/config` | No | Get current configuration |
| PUT | `/api/config` | Yes | Update configuration |
| GET | `/api/health?url=<url>` | No | Check if URL is reachable |
| GET | `/api/themes` | No | List available themes |
| GET | `/api/github/user/:username` | No | Get GitHub user data |
| GET | `/api/github/repos/:username` | No | Get GitHub repositories |
| GET | `/api/github/socials/:username` | No | Get GitHub social accounts |

## Themes

### Nordic
Scandinavian-inspired design with pastel blues, serif typography, and soft shadows.

### Terminal
Retro CLI aesthetic with green-on-black, monospace fonts, and scanline effects.

### Editorial
Magazine-style layout with serif fonts, asymmetric grid, and elegant typography.

### Brutalist
Bold, colorful design with thick borders, offset shadows, and slight card rotations.

## Accessibility

- **Keyboard Navigation**: Full support for Tab, Enter, Escape, and Space keys
- **Focus Management**: Modal focus trap, visible focus indicators
- **ARIA Labels**: All interactive elements properly labeled
- **Screen Reader Support**: Status badges use both color and text
- **Color Contrast**: WCAG AA compliant contrast ratios

## Edge Cases Handled

- **Empty projects array**: Shows "No projects yet" message
- **Missing config.json**: Backend creates default configuration automatically
- **Long titles**: Proper ellipsis with CSS line clamping
- **No project image**: Generated gradient background based on title
- **Zero tags/links**: Components gracefully handle empty data
- **GitHub rate limiting**: Meaningful error messages in import UI
- **Invalid URLs in health check**: Graceful failure with error indication

## Technology Stack

- **Frontend**: React 19, Vite 8, TypeScript 5.9
- **Backend**: Node.js, Express 5
- **Routing**: React Router 7
- **Styling**: Inline styles with CSS variables (theme-driven)
- **Build**: Multi-stage Docker build
- **Deployment**: Docker + docker-compose

## Browser Support

- Chrome 90+
- Firefox 90+
- Safari 15+
- Edge 90+

## License

MIT

## Contributing

Contributions are welcome! Please open an issue or PR.

## Roadmap

Future features (out of scope for v1):
- Plugin system for external integrations
- Image upload for project screenshots
- Export/Import config as JSON
- Internationalization (i18n)
- Custom animation settings per theme
- Public theme marketplace
