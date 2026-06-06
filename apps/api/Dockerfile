FROM node:20-alpine

WORKDIR /app

ENV NODE_ENV=production

# Install dependencies first
COPY package*.json turbo.json ./
RUN npm install --legacy-peer-deps

# Copy code
COPY packages ./packages
COPY apps/api ./apps/api

# Build API
RUN npm run build --workspace=@finaudit/api

# Clean up dev dependencies
RUN npm prune --omit=dev

WORKDIR /app/apps/api

EXPOSE 3001

CMD ["node", "-r", "tsconfig-paths/register", "dist/src/main.js"]
