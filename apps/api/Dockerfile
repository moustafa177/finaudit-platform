FROM node:20-alpine AS builder

WORKDIR /app

# Copy workspace config
COPY package*.json turbo.json ./

# Copy packages
COPY packages/shared-types/package*.json ./packages/shared-types/
COPY packages/zatca-validator/package*.json ./packages/zatca-validator/
COPY packages/shared-types/src ./packages/shared-types/src
COPY packages/zatca-validator/src ./packages/zatca-validator/src

# Copy API
COPY apps/api/package*.json ./apps/api/
COPY apps/api/src ./apps/api/src
COPY apps/api/tsconfig*.json ./apps/api/
COPY apps/api/nest-cli.json ./apps/api/

# Install all deps
RUN npm install --legacy-peer-deps

# Build API
WORKDIR /app/apps/api
RUN npm run build

# ── Production ──────────────────────────────
FROM node:20-alpine

WORKDIR /app

ENV NODE_ENV=production

COPY package*.json turbo.json ./
COPY packages/shared-types/package*.json ./packages/shared-types/
COPY packages/zatca-validator/package*.json ./packages/zatca-validator/
COPY packages/shared-types/src ./packages/shared-types/src
COPY packages/zatca-validator/src ./packages/zatca-validator/src
COPY apps/api/package*.json ./apps/api/
COPY --from=builder /app/apps/api/dist ./apps/api/dist

RUN npm install --legacy-peer-deps --omit=dev

WORKDIR /app/apps/api

EXPOSE 3001

CMD ["node", "-r", "tsconfig-paths/register", "dist/src/main.js"]
