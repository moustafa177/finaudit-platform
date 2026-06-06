FROM node:20-alpine AS builder

WORKDIR /app

# Copy root workspace files
COPY package*.json ./
COPY turbo.json ./

# Copy packages source
COPY packages/ ./packages/

# Copy web source
COPY apps/web/ ./apps/web/

# Install ALL dependencies
RUN npm install --legacy-peer-deps

# Build Next.js
WORKDIR /app/apps/web
RUN npm run build

# ============================================
# Production stage
# ============================================
FROM node:20-alpine AS production

WORKDIR /app

COPY package*.json ./
COPY packages/ ./packages/
COPY apps/web/package*.json ./apps/web/

# Copy Next.js build output
COPY --from=builder /app/apps/web/.next ./apps/web/.next
COPY --from=builder /app/apps/web/public ./apps/web/public
COPY apps/web/next.config.js ./apps/web/

# Install production dependencies only
RUN npm install --legacy-peer-deps --omit=dev
RUN cd apps/web && npm install --legacy-peer-deps --omit=dev

EXPOSE 3000

ENV NODE_ENV=production

WORKDIR /app/apps/web

CMD ["npm", "start"]
