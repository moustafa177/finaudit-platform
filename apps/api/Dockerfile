FROM node:20-alpine

WORKDIR /app

ENV NODE_ENV=production

# Copy minimal files
COPY package*.json ./
COPY packages ./packages
COPY apps/api/dist ./apps/api/dist
COPY apps/api/package.json ./apps/api/

# Install only essential prod deps - skip tsconfig-paths
RUN npm install --omit=dev --omit=optional --no-save tsconfig-paths reflect-metadata 2>&1 | tail -5

WORKDIR /app/apps/api

EXPOSE 3001

CMD ["node", "-r", "tsconfig-paths/register", "dist/src/main.js"]
