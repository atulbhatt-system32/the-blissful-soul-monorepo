FROM node:20-slim AS builder
RUN apt-get update && apt-get install -y --no-install-recommends patch && rm -rf /var/lib/apt/lists/*
RUN npm install -g pnpm@10.5.2

WORKDIR /app

# Copy root monorepo files
COPY package.json pnpm-lock.yaml* pnpm-workspace.yaml ./
COPY patches ./patches

# Copy ONLY backend package.json to avoid busting cache on code changes
COPY apps/backend/package.json ./apps/backend/

# Install all dependencies (frozen to ensure reproducible builds)
RUN pnpm install --filter backend... --frozen-lockfile

# Now copy the backend app source code
COPY apps/backend ./apps/backend

WORKDIR /app/apps/backend

# Build outputs to .medusa/server/ — do NOT set NODE_ENV=production before build
RUN pnpm run build

# Copy static assets not handled by the TypeScript compiler
RUN cp src/lib/logo.png .medusa/server/src/lib/logo.png

# Install production dependencies inside the build output.
# Mounts a persistent pnpm store cache so repeat CI builds reuse already-fetched
# packages/metadata instead of re-querying the registry (avoids 429 rate limits) —
# this RUN step can't rely on the Docker layer cache since .medusa/server changes
# almost every build. The retry loop must `exit` explicitly: a bare `for` loop's
# exit code is that of its last command (sleep/echo = 0), which previously let
# a fully-failed install report success and silently skip node_modules.
RUN --mount=type=cache,target=/root/.local/share/pnpm/store,sharing=locked \
    cd .medusa/server && \
    pnpm config set fetch-retries 5 && \
    pnpm config set fetch-retry-mintimeout 15000 && \
    pnpm config set fetch-retry-maxtimeout 90000 && \
    for i in 1 2 3; do \
      pnpm install --prod --ignore-workspace && exit 0; \
      echo "⚠️ pnpm install attempt $i/3 failed, retrying in 15s..."; \
      sleep 15; \
    done; \
    echo "❌ pnpm install failed after 3 attempts" && exit 1

# Re-apply the full Razorpay refund patch — npm install above pulls from registry without pnpm patches
RUN cd /app/apps/backend/.medusa/server/node_modules/@tsc_tech/medusa-plugin-razorpay-payment \
    && patch -p1 --forward --ignore-whitespace < /app/patches/@tsc_tech__medusa-plugin-razorpay-payment@0.0.11.patch

# Verify admin build is present
RUN test -f .medusa/server/public/admin/index.html || (echo "ERROR: Admin build missing. medusa build did not produce admin assets." && exit 1)

# ── Runtime stage ─────────────────────────────────────────────────────────────
# Ships only the compiled output — no source, no dev deps, no pnpm.
FROM node:20-slim AS runtime

ENV NODE_ENV=production
WORKDIR /app/apps/backend/.medusa/server

# --chown avoids a slow recursive chown pass over the full tree
COPY --from=builder --chown=node:node /app/apps/backend/.medusa/server ./

USER node
EXPOSE 9000

CMD ["sh", "-c", "node_modules/.bin/medusa db:migrate && node_modules/.bin/medusa exec setup-weight-shipping.js && node_modules/.bin/medusa start"]
