FROM node:20-slim
RUN npm install -g pnpm@10.5.2

WORKDIR /app

# Copy root monorepo files
COPY package.json pnpm-lock.yaml* pnpm-workspace.yaml ./

# Copy backend app files
COPY apps/backend ./apps/backend

# Install dependencies (frozen to ensure reproducible builds)
RUN pnpm install --frozen-lockfile

WORKDIR /app/apps/backend

# Build outputs to .medusa/server/ — do NOT set NODE_ENV=production before build
RUN pnpm run build

# Install production dependencies inside the build output (required by Medusa docs)
# --legacy-peer-deps matches pnpm's peer dep resolution used above
RUN cd .medusa/server && npm install --omit=dev --legacy-peer-deps

# Verify admin build is present
RUN test -f .medusa/server/public/admin/index.html || (echo "ERROR: Admin build missing. medusa build did not produce admin assets." && exit 1)

# Run as non-root
RUN chown -R node:node /app
USER node

ENV NODE_ENV=production
WORKDIR /app/apps/backend/.medusa/server
EXPOSE 9000

# Run migrations from build output dir, then start from build output dir
CMD ["sh", "-c", "node_modules/.bin/medusa db:migrate && node_modules/.bin/medusa start"]
