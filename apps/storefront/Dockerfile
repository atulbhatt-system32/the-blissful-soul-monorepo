FROM node:20-slim
RUN npm install -g pnpm@10.5.2

WORKDIR /app

# Copy root monorepo files
COPY package.json pnpm-lock.yaml* pnpm-workspace.yaml ./

# Copy storefront app files
COPY apps/storefront ./apps/storefront

# Install dependencies (frozen to ensure reproducible builds)
RUN pnpm install --frozen-lockfile

WORKDIR /app/apps/storefront
RUN pnpm run build

# Run as non-root
RUN chown -R node:node /app
USER node

EXPOSE 8001

CMD ["pnpm", "run", "start"]
