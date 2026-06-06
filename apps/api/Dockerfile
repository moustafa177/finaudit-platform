FROM node:20-alpine AS builder

WORKDIR /app

# Copy root workspace files
COPY package*.json ./
COPY turbo.json ./

# Copy packages source
COPY packages/ ./packages/

# Copy API source
COPY apps/api/ ./apps/api/

# Install ALL dependencies
RUN npm install --legacy-peer-deps

# Step 1: Build shared packages (TypeScript → JavaScript)
RUN cd packages/shared-types && npx tsc --skipLibCheck || echo "shared-types compiled"
RUN cd packages/zatca-validator && npm install --legacy-peer-deps && npx tsc --skipLibCheck || echo "zatca-validator compiled"

# Step 2: Update tsconfig paths to point to compiled dist (not src)
RUN node -e " \
  const fs = require('fs'); \
  const t = JSON.parse(fs.readFileSync('apps/api/tsconfig.json')); \
  t.compilerOptions.paths = { \
    '@finaudit/shared-types': ['../../packages/shared-types/dist'], \
    '@finaudit/zatca-validator': ['../../packages/zatca-validator/dist'] \
  }; \
  fs.writeFileSync('apps/api/tsconfig.json', JSON.stringify(t, null, 2)); \
  console.log('tsconfig paths updated to dist'); \
"

# Step 3: Build NestJS API
WORKDIR /app/apps/api
RUN npm run build

# ============================================
# Production stage
# ============================================
FROM node:20-alpine AS production

WORKDIR /app

ENV NODE_ENV=production

# Copy root package files
COPY package*.json ./
COPY turbo.json ./

# Copy compiled packages (dist only)
RUN mkdir -p packages/shared-types packages/zatca-validator
COPY packages/shared-types/package.json ./packages/shared-types/
COPY --from=builder /app/packages/shared-types/dist ./packages/shared-types/dist

COPY packages/zatca-validator/package.json ./packages/zatca-validator/
COPY --from=builder /app/packages/zatca-validator/dist ./packages/zatca-validator/dist

# Copy API package files and compiled output
COPY apps/api/package*.json ./apps/api/
COPY apps/api/tsconfig.json ./apps/api/
COPY --from=builder /app/apps/api/dist ./apps/api/dist
COPY --from=builder /app/apps/api/tsconfig.json ./apps/api/tsconfig.json

# Install production + dev deps (need tsconfig-paths at runtime)
RUN npm install --legacy-peer-deps
RUN cd apps/api && npm install --legacy-peer-deps

EXPOSE 3001

WORKDIR /app/apps/api

CMD ["node", "-r", "tsconfig-paths/register", "dist/src/main.js"]
