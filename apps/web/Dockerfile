FROM node:20-alpine

WORKDIR /app

# Copy root package files
COPY package*.json ./
COPY turbo.json ./

# Copy packages
COPY packages/ ./packages/

# Copy app
COPY apps/web/ ./apps/web/

# Install ALL dependencies
RUN npm install --legacy-peer-deps

# Build web
RUN cd apps/web && npm run build

EXPOSE 3000

ENV NODE_ENV=production

CMD ["sh", "-c", "cd apps/web && npm start"]
