FROM node:20-alpine

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3001

# Copy everything - single layer
COPY package*.json ./
COPY packages ./packages
COPY apps/api ./apps/api

# Install and build in one step
RUN npm ci --legacy-peer-deps && \
    npm run build --workspace=@finaudit/api && \
    npm prune --omit=dev

WORKDIR /app/apps/api

EXPOSE 3001

CMD ["node", "-r", "tsconfig-paths/register", "dist/src/main.js"]
