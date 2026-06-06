FROM node:20-bookworm-slim AS deps

WORKDIR /app

# Copy just package files
COPY package*.json turbo.json ./
COPY packages/shared-types/package*.json ./packages/shared-types/
COPY packages/zatca-validator/package*.json ./packages/zatca-validator/
COPY apps/api/package*.json ./apps/api/

# Install deps with timeout and retries
RUN npm install -g npm@latest && \
    npm ci --legacy-peer-deps --verbose 2>&1 | head -1000

# ============================================
# Builder
# ============================================
FROM deps AS builder

WORKDIR /app

# Copy source files only
COPY packages ./packages
COPY apps/api/src ./apps/api/src
COPY apps/api/tsconfig*.json ./apps/api/
COPY apps/api/nest-cli.json ./apps/api/

# Build API
WORKDIR /app/apps/api
RUN npm run build

# ============================================
# Production
# ============================================
FROM node:20-bookworm-slim

WORKDIR /app

ENV NODE_ENV=production

# Copy minimal files
COPY package*.json turbo.json ./
COPY packages ./packages
COPY apps/api/package*.json ./apps/api/
COPY --from=builder /app/apps/api/dist ./apps/api/dist

# Install only prod deps
RUN npm install -g npm@latest && \
    npm ci --legacy-peer-deps --omit=dev --verbose 2>&1 | head -500 && \
    npm cache clean --force

WORKDIR /app/apps/api
EXPOSE 3001

CMD ["node", "-r", "tsconfig-paths/register", "dist/src/main.js"]
