FROM node:20-slim
RUN npm install -g pnpm

WORKDIR /app

# Copy root monorepo files
COPY package.json pnpm-lock.yaml* pnpm-workspace.yaml ./

# Copy backend app files
COPY apps/backend ./apps/backend

# Install dependencies for the whole monorepo
RUN pnpm install

WORKDIR /app/apps/backend

EXPOSE 9000

# Run migrations and setup before starting
CMD ["sh", "-c", "pnpm exec medusa db:migrate && pnpm exec medusa develop"]
