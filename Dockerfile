FROM node:20-slim AS builder

WORKDIR /app/client
COPY client/package*.json ./
RUN npm ci
COPY client/ ./
RUN node "./node_modules/vite/bin/vite.js" build

WORKDIR /app/server
COPY server/package*.json ./
RUN npm ci --omit=dev
COPY server/ ./

FROM node:20-slim AS production

RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

WORKDIR /app
ENV NODE_ENV=production
ENV MONGOMS_DOWNLOAD_DIR=/tmp/mongodb-binaries

COPY --from=builder /app/server ./server
COPY --from=builder /app/client/dist ./client/dist

EXPOSE 8080
ENV PORT=8080

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:8080/api/health || exit 1

WORKDIR /app/server
CMD ["node", "src/server.js"]
