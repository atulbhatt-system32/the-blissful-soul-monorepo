FROM node:20-alpine

# Install dependencies for Medusa
RUN apk add --no-cache python3 make g++ vips-dev
RUN npm install -g pnpm

WORKDIR /app

COPY package*.json pnpm-lock.yaml* ./

RUN pnpm install --no-frozen-lockfile

COPY . .

EXPOSE 9000

CMD ["pnpm", "run", "dev"]
