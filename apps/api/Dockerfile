# Production-only image - assumes API is already built locally
FROM node:20-bookworm-slim

WORKDIR /app

ENV NODE_ENV=production

# Copy pre-built dist
COPY apps/api/dist ./dist
COPY apps/api/package*.json ./
COPY packages ./packages
COPY package*.json ./

# Install only production dependencies
RUN npm install --omit=dev tsconfig-paths

EXPOSE 3001

CMD ["node", "-r", "tsconfig-paths/register", "dist/src/main.js"]
