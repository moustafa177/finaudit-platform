FROM node:20-bookworm-slim AS builder

WORKDIR /app

# Copy everything
COPY . .

# Install and build
RUN npm ci --legacy-peer-deps && \
    npm run build --workspace=@finaudit/api

# ============================================
# Production
# ============================================
FROM node:20-bookworm-slim

WORKDIR /app

ENV NODE_ENV=production

# Copy built dist and package files
COPY --from=builder /app/apps/api/dist /app/dist
COPY --from=builder /app/apps/api/package.json /app/
COPY --from=builder /app/package*.json /app/
COPY --from=builder /app/packages /app/packages

# Install production deps
RUN npm ci --legacy-peer-deps --omit=dev --workspace=@finaudit/api && npm cache clean --force

EXPOSE 3001

CMD ["node", "-r", "tsconfig-paths/register", "/app/dist/src/main.js"]
