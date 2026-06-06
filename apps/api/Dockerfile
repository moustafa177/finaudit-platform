FROM node:20-alpine

WORKDIR /app

ENV NODE_ENV=production

# Copy all source files
COPY . .

# Single step: install deps and build
RUN npm install --no-save tsconfig-paths && \
    npm install && \
    npm run build --workspace=@finaudit/api

WORKDIR /app/apps/api

EXPOSE 3001

CMD ["node", "-r", "tsconfig-paths/register", "dist/src/main.js"]
