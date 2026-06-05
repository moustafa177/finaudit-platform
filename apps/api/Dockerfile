FROM node:20-alpine

WORKDIR /app

# Copy root package files
COPY package*.json ./
COPY turbo.json ./

# Copy packages
COPY packages/ ./packages/

# Copy app
COPY apps/api/ ./apps/api/

# Install ALL dependencies (including dev for build)
RUN npm install --legacy-peer-deps

# Build packages first
RUN cd packages/shared-types && npm install --legacy-peer-deps && npx tsc --skipLibCheck 2>/dev/null || true
RUN cd packages/zatca-validator && npm install --legacy-peer-deps && npx tsc --skipLibCheck 2>/dev/null || true

# Build API
RUN cd apps/api && npm run build

EXPOSE 3001

CMD ["node", "-r", "tsconfig-paths/register", "apps/api/dist/src/main.js"]
