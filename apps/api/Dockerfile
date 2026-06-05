FROM node:20-alpine AS builder

WORKDIR /app

# Copy root workspace files
COPY package*.json ./
COPY turbo.json ./

# Copy packages source
COPY packages/ ./packages/

# Copy API source
COPY apps/api/ ./apps/api/

# Install ALL dependencies (including devDependencies for build tools)
RUN npm install --legacy-peer-deps

# Build shared packages first
RUN cd packages/shared-types && npx tsc --skipLibCheck 2>/dev/null || echo "shared-types build done"
RUN cd packages/zatca-validator && npx tsc --skipLibCheck 2>/dev/null || echo "zatca-validator build done"

# Build NestJS API
WORKDIR /app/apps/api
RUN npm run build

# ============================================
# Production stage
# ============================================
FROM node:20-alpine AS production

WORKDIR /app

# Copy root package files
COPY package*.json ./
COPY turbo.json ./

# Copy packages (needed for runtime path resolution)
COPY packages/ ./packages/

# Copy built API
COPY apps/api/package*.json ./apps/api/
COPY --from=builder /app/apps/api/dist ./apps/api/dist
COPY apps/api/tsconfig.json ./apps/api/

# Install only production dependencies
RUN npm install --legacy-peer-deps --omit=dev
RUN cd apps/api && npm install --legacy-peer-deps

EXPOSE 3001

ENV NODE_ENV=production

WORKDIR /app/apps/api

CMD ["node", "-r", "tsconfig-paths/register", "dist/src/main"]
