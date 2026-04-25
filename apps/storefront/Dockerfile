FROM node:20-slim AS builder
RUN npm install -g pnpm@10.5.2

WORKDIR /app

# Copy root monorepo files
COPY package.json pnpm-lock.yaml* pnpm-workspace.yaml ./
COPY patches ./patches

# Copy ONLY storefront package.json to avoid busting cache on code changes
COPY apps/storefront/package.json ./apps/storefront/

# Install dependencies (frozen to ensure reproducible builds)
RUN pnpm install --filter storefront... --frozen-lockfile

# Now copy the storefront app source code
COPY apps/storefront ./apps/storefront

WORKDIR /app/apps/storefront

ARG NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY
ARG NEXT_PUBLIC_STRAPI_URL
ARG NEXT_PUBLIC_CAL_API_KEY
ARG NEXT_PUBLIC_CAL_USERNAME
ARG NEXT_PUBLIC_CAL_EVENT_SLUG
ARG NEXT_PUBLIC_RAZORPAY_KEY
ARG NEXT_PUBLIC_MEDUSA_BACKEND_URL

ENV NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=$NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY
ENV NEXT_PUBLIC_STRAPI_URL=$NEXT_PUBLIC_STRAPI_URL
ENV NEXT_PUBLIC_CAL_API_KEY=$NEXT_PUBLIC_CAL_API_KEY
ENV NEXT_PUBLIC_CAL_USERNAME=$NEXT_PUBLIC_CAL_USERNAME
ENV NEXT_PUBLIC_CAL_EVENT_SLUG=$NEXT_PUBLIC_CAL_EVENT_SLUG
ENV NEXT_PUBLIC_RAZORPAY_KEY=$NEXT_PUBLIC_RAZORPAY_KEY
ENV NEXT_PUBLIC_MEDUSA_BACKEND_URL=$NEXT_PUBLIC_MEDUSA_BACKEND_URL

RUN pnpm run build

# ── Runtime stage ─────────────────────────────────────────────────────────────
# Standalone output contains only the traced runtime dependencies — no source,
# no dev deps, no pnpm. Typically 70-80% smaller than a full build image.
FROM node:20-slim AS runtime

ENV NODE_ENV=production
ENV PORT=8000
ENV HOSTNAME=0.0.0.0

WORKDIR /app

# outputFileTracingRoot points to the monorepo root, so standalone mirrors that
# structure: server entry is at apps/storefront/server.js inside the output.
COPY --from=builder --chown=node:node /app/apps/storefront/.next/standalone ./
COPY --from=builder --chown=node:node /app/apps/storefront/.next/static ./apps/storefront/.next/static
COPY --from=builder --chown=node:node /app/apps/storefront/public ./apps/storefront/public

USER node
EXPOSE 8000

CMD ["node", "apps/storefront/server.js"]
