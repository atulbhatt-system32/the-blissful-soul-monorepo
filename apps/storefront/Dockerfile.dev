FROM node:20-slim

RUN npm install -g pnpm

WORKDIR /app

# Copy root monorepo files
COPY package.json pnpm-lock.yaml* pnpm-workspace.yaml ./

# Copy storefront app files
COPY apps/storefront ./apps/storefront

# Install dependencies for the whole monorepo
RUN pnpm install

WORKDIR /app/apps/storefront

EXPOSE 8001

CMD ["pnpm", "run", "dev"]
