FROM node:20-slim AS builder

# Build tools required only for better-sqlite3 native compilation
RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*

RUN npm install -g pnpm@10.5.2

WORKDIR /app

# Copy root monorepo files
COPY package.json pnpm-lock.yaml* pnpm-workspace.yaml ./

# Copy ONLY cms package.json to avoid busting cache on code changes
COPY apps/cms/package.json ./apps/cms/

# Install dependencies (frozen to ensure reproducible builds)
RUN pnpm install --filter cms... --frozen-lockfile

# Now copy the cms app source code
COPY apps/cms ./apps/cms

# Force rebuild better-sqlite3 for this platform (suppress known benign warnings)
RUN cd /app/node_modules/.pnpm/better-sqlite3@*/node_modules/better-sqlite3 && \
    CXXFLAGS="-Wno-cast-function-type -Wno-implicit-fallthrough" npx --yes node-gyp rebuild

WORKDIR /app/apps/cms
ARG CMS_PUBLIC_URL
ENV CMS_PUBLIC_URL=$CMS_PUBLIC_URL
RUN pnpm run build

# Pre-create the SQLite data directory so the named volume inherits correct ownership
RUN mkdir -p /app/apps/cms/.tmp

# ── Runtime stage ─────────────────────────────────────────────────────────────
# Strips python3/make/g++ (~300 MB) from the final image.
# The compiled better-sqlite3 .node binary is already baked into node_modules.
FROM node:20-slim AS runtime

RUN npm install -g pnpm@10.5.2

WORKDIR /app

# --chown avoids a slow recursive chown pass over the full tree
COPY --from=builder --chown=node:node /app/node_modules ./node_modules
COPY --from=builder --chown=node:node /app/package.json /app/pnpm-workspace.yaml ./
COPY --from=builder --chown=node:node /app/apps/cms ./apps/cms

USER node
WORKDIR /app/apps/cms
EXPOSE 1337

CMD ["pnpm", "run", "start"]
