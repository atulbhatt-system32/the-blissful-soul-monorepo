FROM node:20-slim AS builder
RUN apt-get update && apt-get install -y --no-install-recommends patch && rm -rf /var/lib/apt/lists/*
RUN npm install -g pnpm@10.5.2

# Lower concurrency + longer retry/backoff budget for both installs below —
# large, heavily-depended-on packages (e.g. @medusajs/js-sdk, types, modules-sdk,
# pulled in transitively by dozens of @medusajs/* packages) get hit with bursts
# of concurrent packument requests on a cold store, which trips npm's per-package
# rate limit regardless of registry/mirror chosen.
RUN pnpm config set network-concurrency 8 && \
    pnpm config set fetch-retries 5 && \
    pnpm config set fetch-retry-mintimeout 15000 && \
    pnpm config set fetch-retry-maxtimeout 90000

WORKDIR /app

# Copy root monorepo files
COPY package.json pnpm-lock.yaml* pnpm-workspace.yaml ./
COPY patches ./patches

# Copy ONLY backend package.json to avoid busting cache on code changes
COPY apps/backend/package.json ./apps/backend/

# Install all dependencies (frozen to ensure reproducible builds).
# Shares the same pnpm store cache mount as the .medusa/server install below —
# without this, that later step's cache mount shadows this step's on-disk store
# and re-fetches everything (including packages already pulled here) from scratch.
RUN --mount=type=cache,target=/root/.local/share/pnpm/store,sharing=locked \
    pnpm install --filter backend... --frozen-lockfile

# Now copy the backend app source code
COPY apps/backend ./apps/backend

WORKDIR /app/apps/backend

# Build outputs to .medusa/server/ — do NOT set NODE_ENV=production before build
RUN pnpm run build

# Copy static assets not handled by the TypeScript compiler
RUN cp src/lib/logo.png .medusa/server/src/lib/logo.png

# Install production dependencies inside the build output.
# --ignore-workspace means this has no lockfile of its own, so pnpm would normally
# re-resolve every package fresh against the registry — even though the workspace
# install above (frozen to pnpm-lock.yaml) already resolved metadata for the same
# packages at the same pinned versions. --prefer-offline tells pnpm to trust that
# already-cached metadata/store content instead of re-querying the registry,
# which is what was tripping npm's per-package rate limit on a few heavily
# depended-on packages (@medusajs/js-sdk, types, modules-sdk) on every build.
# Mounts the same persistent pnpm store cache as the workspace install so that
# cached content actually carries over between the two steps.
RUN --mount=type=cache,target=/root/.local/share/pnpm/store,sharing=locked \
    cd .medusa/server && \
    for i in 1 2 3; do \
      pnpm install --prod --ignore-workspace --prefer-offline && exit 0; \
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
