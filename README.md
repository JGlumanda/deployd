<div align="center">

# 🎨 Project Showcase

**A beautiful, self-hostable portfolio platform with 4 stunning themes**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker&logoColor=white)](https://www.docker.com/)
[![Docker Image](https://img.shields.io/badge/ghcr.io-latest-2496ED?logo=docker&logoColor=white)](https://github.com/jglumanda/deployd/pkgs/container/project-showcase)

[Demo](#-themes) • [Quick Start](#-quick-start) • [Documentation](#-documentation) • [Contributing](#-contributing)

</div>

---

## ✨ Features

<table>
<tr>
<td width="50%">

### 🎭 **4 Beautiful Themes**
Switch between Nordic, Terminal, Editorial, and Brutalist themes instantly

### 🔌 **GitHub Integration**
Import projects and profile data directly from your GitHub account

### 📊 **Health Monitoring**
Optional live status checks for all your project URLs

</td>
<td width="50%">

### 🎯 **Admin Panel**
Full-featured editor with real-time preview

### 🚀 **Production Ready**
Docker deployment, automated builds via GitHub Actions

### ♿ **Fully Accessible**
WCAG AA compliant, keyboard navigation, ARIA labels

</td>
</tr>
</table>

---

## 🚀 Quick Start

### Deploy with Docker (30 seconds)

**Using Pre-built Image** (fastest)

```bash
# Pull and run the latest image
docker run -d \
  -p 3000:3000 \
  -e ADMIN_PASSWORD=admin \
  -v $(pwd)/config.json:/app/config.json \
  ghcr.io/jglumanda/deployd:latest

# Open http://localhost:3000
```

**Or with docker-compose**

```bash
# Clone the repository
git clone https://github.com/jglumanda/deployd.git
cd project-showcase

# Start with docker-compose
docker-compose up -d

# Open http://localhost:3000
```

### Local Development

```bash
# Install dependencies
npm install

# Set admin password (optional)
export ADMIN_PASSWORD=your-password

# Start dev servers (frontend + backend)
npm run dev

# Open http://localhost:5173
```

**That's it!** 🎉 Your portfolio is now running.

---

## 🎨 Themes

Switch between 4 professionally designed themes to match your style:

### Nordic 🌊
<sup>Scandinavian-inspired design with pastel colors and serif typography</sup>

```
Warm beiges • Soft shadows • Elegant serifs
Perfect for: Professional portfolios, design agencies
```

### Terminal 💻
<sup>Retro CLI aesthetic with green-on-black and monospace fonts</sup>

```
Matrix green • Scanline effects • Monospace everywhere
Perfect for: Developers, hackers, system admins
```

### Editorial 📰
<sup>Magazine-style layout with sophisticated typography</sup>

```
Two-column grid • Editorial fonts • Clean lines
Perfect for: Writers, journalists, content creators
```

### Brutalist 🎨
<sup>Bold, unapologetic design with thick borders and vibrant colors</sup>

```
Thick borders • Offset shadows • Card rotation
Perfect for: Artists, designers, creative studios
```

> 💡 **Tip:** Every theme is fully customizable through CSS variables and supports dark/light modes automatically.

---

## 📸 Screenshots

<details>
<summary><b>Click to see all 4 themes in action</b></summary>

### Nordic Theme
![Nordic Theme Preview](https://via.placeholder.com/800x500/F5F1EB/6B8FA3?text=Nordic+Theme)

### Terminal Theme
![Terminal Theme Preview](https://via.placeholder.com/800x500/050505/39FF14?text=Terminal+Theme)

### Editorial Theme
![Editorial Theme Preview](https://via.placeholder.com/800x500/F5F0E8/1A1A1A?text=Editorial+Theme)

### Brutalist Theme
![Brutalist Theme Preview](https://via.placeholder.com/800x500/F0EBE3/000000?text=Brutalist+Theme)

### Admin Panel
![Admin Panel Preview](https://via.placeholder.com/800x500/FFFFFF/2C3E50?text=Admin+Panel)

</details>

---

## 🛠️ Tech Stack

<div align="center">

[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)

</div>

| Layer | Technology | Version |
|-------|-----------|---------|
| **Frontend** | React | 19 |
| **Build Tool** | Vite | 8 |
| **Language** | TypeScript | 5.9 |
| **Routing** | React Router | 7 |
| **Backend** | Express | 5 |
| **Runtime** | Node.js | 20+ |
| **Container** | Docker | Latest |

---

## 📖 Documentation

### Table of Contents

- [Installation](#installation)
- [Configuration](#configuration)
- [Admin Panel](#admin-panel)
- [API Reference](#api-reference)
- [Theming](#theming)
- [Deployment](#deployment)

---

### Installation

#### Prerequisites

- **Node.js** 20 or higher
- **npm**, **yarn**, or **pnpm**
- **Docker** (optional, for containerized deployment)

#### Install Dependencies

```bash
npm install
```

#### Environment Variables

Create a `.env` file in the project root:

```env
# Admin panel password (optional, but recommended)
ADMIN_PASSWORD=your-secure-password

# GitHub Personal Access Token (optional)
# Increases API rate limit from 60 to 5000 requests/hour
GITHUB_TOKEN=ghp_your_github_token

# Server configuration
PORT=3000
NODE_ENV=production
```

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `ADMIN_PASSWORD` | No | `""` | Password for `/admin` access |
| `GITHUB_TOKEN` | No | `""` | GitHub PAT for higher rate limits |
| `PORT` | No | `3000` | Server port |
| `NODE_ENV` | No | `development` | Environment mode |

---

### Configuration

All data is stored in `config.json` at the project root. The file is auto-created with sensible defaults if missing.

#### Config Structure

```json
{
  "profile": {
    "name": "Your Name",
    "tagline": "Full-Stack Developer & Designer",
    "bio": "Building beautiful web experiences with modern technologies.",
    "avatar": "https://avatars.githubusercontent.com/u/your-id",
    "links": {
      "github": "https://github.com/username",
      "linkedin": "https://linkedin.com/in/username",
      "email": "mailto:your@email.com",
      "website": "https://yoursite.com"
    }
  },
  "projects": [
    {
      "id": 1,
      "title": "Amazing Project",
      "description": "A revolutionary app that changes everything.",
      "tags": ["React", "TypeScript", "Docker"],
      "status": "active",
      "featured": true,
      "links": {
        "live": "https://demo.com",
        "github": "https://github.com/user/repo",
        "docs": "https://docs.com"
      },
      "image": "https://...",
      "date": "2026-02"
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
      "enabled": true,
      "intervalMinutes": 5
    },
    "tags": {
      "predefined": [
        { "name": "React", "color": "#61DAFB" },
        { "name": "TypeScript", "color": "#3178C6" }
      ],
      "custom": []
    }
  }
}
```

---

### Admin Panel

Access the admin panel at **`/admin`**. You'll be prompted for the password if `ADMIN_PASSWORD` is set.

#### Features

| Section | Description |
|---------|-------------|
| **Projects** | Add, edit, delete projects. Import from GitHub. |
| **Profile** | Edit profile info. Import from GitHub. |
| **Themes** | Switch between 4 built-in themes with live preview. |
| **Settings** | Configure display options, health checks, manage tags. |

#### GitHub Integration

<details>
<summary><b>Import Projects from GitHub</b></summary>

1. Go to Admin Panel → Projects
2. Click "Import from GitHub"
3. Enter your GitHub username
4. Select repositories to import
5. Click "Import X Projects"

Projects are auto-filled with:
- Repository name as title
- Description from GitHub
- Topics as tags
- Language as a tag
- Repository URL as GitHub link
- Homepage as live link (if set)
- Archive status

</details>

<details>
<summary><b>Import Profile from GitHub</b></summary>

1. Go to Admin Panel → Profile
2. Click "Import from GitHub"
3. Enter your GitHub username
4. Select which fields to import
5. Click "Import Selected Fields"

Fields available:
- Name
- Bio
- Avatar
- GitHub URL
- Website
- Twitter/X
- LinkedIn

</details>

---

### API Reference

All API endpoints are available at `/api/*`.

#### Public Endpoints

```bash
# Get current configuration
GET /api/config

# Check if a URL is online
GET /api/health?url=https://example.com

# List available themes
GET /api/themes

# Get GitHub user data
GET /api/github/user/:username

# Get GitHub repositories
GET /api/github/repos/:username

# Get GitHub social accounts
GET /api/github/socials/:username
```

#### Authenticated Endpoints

```bash
# Update configuration (requires Bearer token)
PUT /api/config
Authorization: Bearer your-admin-password

Content-Type: application/json
{
  "profile": { ... },
  "projects": [ ... ],
  "theme": { "active": "nordic" },
  "settings": { ... }
}
```

#### Response Formats

<details>
<summary><b>GET /api/config</b></summary>

```json
{
  "profile": { ... },
  "projects": [ ... ],
  "theme": { "active": "nordic" },
  "settings": { ... }
}
```

</details>

<details>
<summary><b>GET /api/health?url=...</b></summary>

```json
{
  "online": true,
  "statusCode": 200
}
```

```json
{
  "online": false,
  "error": "ENOTFOUND"
}
```

</details>

---

### Theming

Create custom themes by adding to `frontend/src/themes/`:

```typescript
// frontend/src/themes/custom/index.ts
import type { Theme } from '@core/types'

export const custom: Theme = {
  name: 'custom',
  displayName: 'Custom Theme',
  description: 'Your custom theme description',
  tokens: {
    colors: {
      bg: '#...',
      card: '#...',
      text: '#...',
      // ... see types.ts for all required colors
    },
    fonts: {
      heading: "'Your Font', serif",
      body: "'Your Font', sans-serif",
      mono: "'Fira Code', monospace",
      googleFontsUrls: ['https://fonts.googleapis.com/...']
    },
    radius: {
      sm: '4px',
      md: '8px',
      lg: '12px'
    },
    spacing: {
      cardPadding: '24px',
      gridGap: '18px',
      sectionGap: '56px'
    }
  },
  effects: {
    scanlines: false,
    animationStyle: 'fade',
    cardShadow: 'soft'
  }
}
```

Register your theme in `frontend/src/themes/index.ts`:

```typescript
import { custom } from './custom'

registerTheme(custom)
```

---

### Deployment

#### Docker (Recommended)

**Option 1: Use Pre-built Image from GitHub Container Registry**

```bash
# Pull the latest image
docker pull ghcr.io/jglumanda/deployd:latest

# Run the container
docker run -d \
  -p 3000:3000 \
  -e ADMIN_PASSWORD=your-password \
  -e GITHUB_TOKEN=your-token \
  -v $(pwd)/config.json:/app/config.json \
  --name project-showcase \
  ghcr.io/jglumanda/deployd:latest
```

**Option 2: Build from Source**

```bash
# Build the image locally
docker build -t project-showcase .

# Run the container
docker run -d \
  -p 3000:3000 \
  -e ADMIN_PASSWORD=your-password \
  -e GITHUB_TOKEN=your-token \
  -v $(pwd)/config.json:/app/config.json \
  --name project-showcase \
  project-showcase
```

#### Docker Compose

**Option 1: Use Pre-built Image**

```yaml
services:
  showcase:
    image: ghcr.io/jglumanda/deployd:latest
    ports:
      - "3000:3000"
    environment:
      - ADMIN_PASSWORD=${ADMIN_PASSWORD:-admin}
      - GITHUB_TOKEN=${GITHUB_TOKEN:-}
    volumes:
      - ./config.json:/app/config.json
    restart: unless-stopped
```

```bash
docker-compose up -d
```

**Option 2: Build from Source**

```yaml
services:
  showcase:
    build: .
    ports:
      - "3000:3000"
    environment:
      - ADMIN_PASSWORD=${ADMIN_PASSWORD:-admin}
      - GITHUB_TOKEN=${GITHUB_TOKEN:-}
    volumes:
      - ./config.json:/app/config.json
    restart: unless-stopped
```

```bash
docker-compose up -d
```

#### Manual Deployment

```bash
# Build frontend
npm run build

# Start backend (serves frontend)
npm start
```

#### Nginx Reverse Proxy

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## 🎯 Usage Examples

### Basic Portfolio

Perfect for showcasing your personal projects:

1. Set up profile with name, bio, and social links
2. Import projects from GitHub or add manually
3. Choose Nordic or Editorial theme
4. Deploy to your domain

### Developer Showcase

Highlight your technical skills:

1. Use Terminal theme for that hacker aesthetic
2. Enable health monitoring for live projects
3. Tag projects by technology
4. Add live demos and documentation links

### Agency Portfolio

Present client work professionally:

1. Use Editorial theme for magazine-style layout
2. Mark key projects as "featured"
3. Add project screenshots
4. Include case study links

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'feat: add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Development Guidelines

- Follow the existing code style
- Write meaningful commit messages (use [Conventional Commits](https://www.conventionalcommits.org/))
- Add tests for new features
- Update documentation as needed
- Ensure all checks pass before submitting PR

### Reporting Issues

Found a bug? Please [open an issue](https://github.com/jglumanda/deployd/issues) with:

- Clear description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Screenshots (if applicable)
- Browser/OS information

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2026 Jonas Berger

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

[Full MIT License text...]
```

---

<div align="center">

**[⬆ back to top](#-project-showcase)**

Made with ❤️ by [Jonas Berger](https://github.com/jglumanda)

[![Star on GitHub](https://img.shields.io/github/stars/jglumanda/deployd?style=social)](https://github.com/jglumanda/deployd)
[![Follow on GitHub](https://img.shields.io/github/followers/jglumanda?style=social)](https://github.com/jglumanda)

</div>
