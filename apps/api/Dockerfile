FROM node:20-bookworm-slim AS base

WORKDIR /app

# Copy package files
COPY package*.json turbo.json ./
COPY packages ./packages
COPY apps/api ./apps/api

# ============================================
# Build Stage
# ============================================
FROM base AS builder

RUN npm ci --legacy-peer-deps

WORKDIR /app/apps/api
RUN npm run build

# ============================================
# Runtime Stage
# ============================================
FROM node:20-bookworm-slim

WORKDIR /app

ENV NODE_ENV=production

COPY package*.json turbo.json ./
COPY packages ./packages
COPY --from=builder /app/apps/api/dist ./apps/api/dist
COPY apps/api/package*.json ./apps/api/

RUN npm ci --legacy-peer-deps --omit=dev

WORKDIR /app/apps/api

EXPOSE 3001

CMD ["node", "-r", "tsconfig-paths/register", "dist/src/main.js"]
