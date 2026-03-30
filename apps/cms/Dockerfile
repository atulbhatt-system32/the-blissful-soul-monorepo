FROM node:20-alpine

# Install build dependencies for better-sqlite3 and other sharp dependencies
RUN apk add --no-cache build-base gcc autoconf automake libtool zlib-dev libpng-dev nasm vips-dev
RUN npm install -g pnpm

WORKDIR /app

COPY package*.json pnpm-lock.yaml* ./

RUN pnpm install --no-frozen-lockfile

COPY . .

EXPOSE 1337

CMD ["pnpm", "run", "dev"]
