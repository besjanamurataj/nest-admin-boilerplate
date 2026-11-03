# syntax=docker/dockerfile:1

# Debian-based images (not Alpine) so the native modules (bcrypt, sqlite3) use their prebuilt binaries

# ---- Build stage: compile TypeScript to dist/ ----
FROM node:22-slim AS build
WORKDIR /workspace

# Install dependencies in their own layer so it stays cached until the lockfile changes
COPY package.json package-lock.json ./
RUN npm ci

COPY . .
# Build, then drop dev dependencies so only what the app needs at runtime is copied below
RUN npm run build && npm prune --omit=dev

# ---- Runtime stage: production dependencies and compiled code only ----
FROM node:22-slim
WORKDIR /app
ENV NODE_ENV=production

COPY --from=build --chown=node:node /workspace/package.json ./
COPY --from=build --chown=node:node /workspace/node_modules ./node_modules
COPY --from=build --chown=node:node /workspace/dist ./dist

USER node
EXPOSE 3000
CMD ["node", "dist/main"]
