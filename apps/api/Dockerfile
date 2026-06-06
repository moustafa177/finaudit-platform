FROM node:20-alpine

WORKDIR /app

ENV NODE_ENV=production

# Debug: list Node version
RUN node --version && npm --version

# Install dependencies
COPY package*.json turbo.json ./
RUN npm install --legacy-peer-deps --verbose 2>&1 | tail -20 || true

# Copy packages (already npm installed)
COPY packages ./packages

# Copy API code
COPY apps/api ./apps/api

# Build just the API
WORKDIR /app/apps/api
RUN npm run build 2>&1 || (echo "BUILD FAILED"; ls -la dist/ 2>/dev/null || echo "No dist dir"; exit 1)

WORKDIR /app

# Remove dev deps
RUN npm prune --omit=dev --legacy-peer-deps

WORKDIR /app/apps/api

EXPOSE 3001

CMD ["node", "-r", "tsconfig-paths/register", "dist/src/main.js"]
