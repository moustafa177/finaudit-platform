FROM node:20-alpine

WORKDIR /app

# Copy everything from monorepo root
COPY . .

# Install all dependencies
RUN npm install --legacy-peer-deps

# Build API
RUN cd apps/api && npm run build

ENV NODE_ENV=production

WORKDIR /app/apps/api

EXPOSE 3001

CMD ["node", "-r", "tsconfig-paths/register", "dist/src/main.js"]
