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

# Populate .medusa/server's production dependencies via `pnpm deploy` instead of
# a second `pnpm install`. A plain install there has no lockfile of its own
# (--ignore-workspace), so pnpm must freshly resolve every package's metadata
# against the registry on every build — unlike the frozen-lockfile install above,
# which reads resolved versions/tarball URLs straight out of pnpm-lock.yaml and
# never queries the metadata endpoint at all. That's why the frozen install never
# hit a 429 while the ignore-workspace one reliably did on the same few heavily
# depended-on packages (@medusajs/js-sdk, types, modules-sdk): no amount of
# tarball caching or offline preference fixes it, because metadata resolution —
# not tarball fetching — was the actual bottleneck.
# `pnpm deploy` sidesteps this by producing a self-contained, non-symlinked
# node_modules directly from backend's already-resolved dependency graph — zero
# registry calls of any kind, since nothing needs re-resolving.
RUN --mount=type=cache,target=/root/.local/share/pnpm/store,sharing=locked \
    pnpm --filter backend deploy --prod /tmp/backend-deploy && \
    rm -rf .medusa/server/node_modules && \
    cp -a /tmp/backend-deploy/node_modules .medusa/server/node_modules

# Re-apply the full Razorpay refund patch — the deployed node_modules above has no pnpm patch support
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
