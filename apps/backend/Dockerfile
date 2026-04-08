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
ENV NODE_ENV=production
RUN pnpm run build

# Run as non-root
RUN chown -R node:node /app
USER node

EXPOSE 9000

# Run migrations and start in production mode
CMD ["sh", "-c", "pnpm exec medusa db:migrate && pnpm exec medusa start"]
