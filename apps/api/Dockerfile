FROM node:20-bookworm-slim

WORKDIR /app

ENV NODE_ENV=production

# Copy everything from repo
COPY . .

# Skip npm CI install - packages are already in node_modules from build
# Just install runtime dependency if missing
RUN npm install --omit=dev --legacy-peer-deps 2>&1 || true

# Assume app/api/dist exists from pre-build
WORKDIR /app/apps/api

EXPOSE 3001

CMD ["node", "-r", "tsconfig-paths/register", "dist/src/main.js"]
