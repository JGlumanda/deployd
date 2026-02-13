# Stage 1: Build frontend
FROM node:20-alpine AS frontend-builder

WORKDIR /app/frontend

# Copy frontend package files
COPY frontend/package*.json ./

# Install dependencies
RUN npm ci

# Copy frontend source
COPY frontend/ ./

# Build frontend
RUN npm run build

# Stage 2: Production image
FROM node:20-alpine

WORKDIR /app

# Install dependencies for backend
COPY backend/package*.json ./backend/
RUN cd backend && npm ci --omit=dev

# Copy backend source
COPY backend/ ./backend/

# Copy built frontend from stage 1
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

# Copy config templates
COPY config/ ./config/

# Create data directory (will be mounted in production)
RUN mkdir -p data

# Expose port
EXPOSE 3000

# Set working directory to backend for running the server
WORKDIR /app/backend

# Run backend with tsx
# Backend automatically creates config.json with defaults if missing
CMD ["npx", "tsx", "server.ts"]
