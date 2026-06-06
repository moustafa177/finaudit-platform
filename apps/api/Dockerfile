FROM node:20-bookworm-slim AS builder

WORKDIR /app

# Copy root workspace config
COPY package*.json turbo.json ./

# Copy all packages and apps
COPY packages ./packages
COPY apps/api ./apps/api

# Install dependencies with node-gyp support
RUN npm ci --legacy-peer-deps

# Build API service
WORKDIR /app/apps/api
RUN npm run build

# ============================================
# Production Stage
# ============================================
FROM node:20-bookworm-slim

WORKDIR /app

ENV NODE_ENV=production

# Copy minimal files for production
COPY package*.json turbo.json ./
COPY packages ./packages
COPY apps/api/package*.json ./apps/api/
COPY --from=builder /app/apps/api/dist ./apps/api/dist

# Install production dependencies only
RUN npm ci --legacy-peer-deps --omit=dev && npm cache clean --force

WORKDIR /app/apps/api

EXPOSE 3001

# Use tsconfig-paths/register to resolve @finaudit/* imports
CMD ["node", "-r", "tsconfig-paths/register", "dist/src/main.js"]
