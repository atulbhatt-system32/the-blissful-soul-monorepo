FROM node:20-alpine

RUN npm install -g pnpm

WORKDIR /app

COPY package*.json pnpm-lock.yaml* ./

RUN pnpm install --no-frozen-lockfile

COPY . .

EXPOSE 8001

CMD ["pnpm", "run", "dev"]
