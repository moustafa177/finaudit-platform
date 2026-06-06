FROM node:20-alpine AS builder

WORKDIR /app

# Copy monorepo root files
COPY package*.json ./
COPY turbo.json ./
COPY .npmrc* ./

# Copy packages with all source files
COPY packages/shared-types ./packages/shared-types/
COPY packages/zatca-validator ./packages/zatca-validator/
COPY apps/api/ ./apps/api/

# Install all dependencies (including devDeps for build)
RUN npm install --legacy-peer-deps 2>&1

# Build packages first (if needed)
WORKDIR /app/packages/shared-types
RUN npm run build 2>&1 || true

WORKDIR /app/packages/zatca-validator
RUN npm run build 2>&1 || true

# Build NestJS API
WORKDIR /app/apps/api
RUN npm run build 2>&1

# Verify build output
RUN ls -la dist/src/

# ============================================
# Production
# ============================================
FROM node:20-alpine

WORKDIR /app

ENV NODE_ENV=production

# Copy root workspace files
COPY package*.json ./

# Copy packages with built files
COPY --from=builder /app/packages/ ./packages/

# Copy API dist
COPY --from=builder /app/apps/api/dist ./apps/api/dist
COPY --from=builder /app/apps/api/package*.json ./apps/api/

# Install production dependencies only
RUN npm install --legacy-peer-deps --omit=dev 2>&1

WORKDIR /app/apps/api

EXPOSE 3001

# Verify files before startup
RUN ls -la dist/src/ && node -r tsconfig-paths/register -e "console.log('✓ tsconfig-paths loaded')"

# Run with tsconfig-paths/register for @finaudit/* path resolution
CMD ["node", "-r", "tsconfig-paths/register", "dist/src/main.js"]
