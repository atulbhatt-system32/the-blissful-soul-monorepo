FROM node:20-slim

# Install build tools for better-sqlite3 native compilation
RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*

RUN npm install -g pnpm@10.5.2

WORKDIR /app

# Copy root monorepo files
COPY package.json pnpm-lock.yaml* pnpm-workspace.yaml ./

# Copy cms app files
COPY apps/cms ./apps/cms

# Install dependencies (frozen to ensure reproducible builds)
RUN pnpm install --frozen-lockfile

# Force rebuild better-sqlite3 for this platform (suppress known benign warnings)
RUN cd /app/node_modules/.pnpm/better-sqlite3@*/node_modules/better-sqlite3 && \
    CXXFLAGS="-Wno-cast-function-type -Wno-implicit-fallthrough" npx --yes node-gyp rebuild

WORKDIR /app/apps/cms
RUN pnpm run build

# Pre-create the SQLite data directory so the named volume inherits correct ownership
RUN mkdir -p /app/apps/cms/.tmp

# Run as non-root
RUN chown -R node:node /app
USER node

EXPOSE 1337

CMD ["pnpm", "run", "start"]
