FROM node:20-alpine AS builder

WORKDIR /app

# Copy full monorepo
COPY package*.json ./
COPY turbo.json ./
COPY packages/ ./packages/
COPY apps/api/ ./apps/api/

# Install everything
RUN npm install --legacy-peer-deps

# Build NestJS API
WORKDIR /app/apps/api
RUN npm run build

# ============================================
# Production
# ============================================
FROM node:20-alpine

WORKDIR /app

ENV NODE_ENV=production

# Copy package files for workspace setup
COPY package*.json ./
COPY turbo.json ./

# Copy packages (main now points to .js files)
COPY packages/ ./packages/

# Copy API
COPY apps/api/package*.json ./apps/api/
COPY --from=builder /app/apps/api/dist ./apps/api/dist

# Install (creates node_modules/@finaudit/* symlinks to packages/)
RUN npm install --legacy-peer-deps --omit=dev

WORKDIR /app/apps/api

EXPOSE 3001

# tsconfig-paths/register resolves path aliases (@finaudit/*) at runtime
CMD ["node", "-r", "tsconfig-paths/register", "dist/src/main.js"]
