FROM node:20-alpine AS builder

WORKDIR /app

# Copy full monorepo
COPY package*.json ./
COPY turbo.json ./
COPY packages/ ./packages/
COPY apps/api/ ./apps/api/

# Install everything (including devDependencies for nest build)
RUN npm install --legacy-peer-deps

# Build NestJS API (packages/src/*.js already compiled locally)
WORKDIR /app/apps/api
RUN npm run build

# ============================================
# Production
# ============================================
FROM node:20-alpine

WORKDIR /app

ENV NODE_ENV=production

# Copy package files
COPY package*.json ./
COPY turbo.json ./

# Copy packages WITH their compiled src/*.js files
COPY packages/ ./packages/

# Copy API
COPY apps/api/package*.json ./apps/api/
COPY apps/api/tsconfig.json ./apps/api/
COPY --from=builder /app/apps/api/dist ./apps/api/dist

# Install deps (workspace + runtime)
RUN npm install --legacy-peer-deps
RUN cd apps/api && npm install --legacy-peer-deps

WORKDIR /app/apps/api

EXPOSE 3001

CMD ["node", "-r", "tsconfig-paths/register", "dist/src/main.js"]
