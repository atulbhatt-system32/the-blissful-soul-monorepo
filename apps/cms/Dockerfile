FROM node:20-alpine

# Install build dependencies for better-sqlite3 and other sharp dependencies
RUN apk add --no-cache build-base gcc autoconf automake libtool zlib-dev libpng-dev nasm vips-dev python3

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 1337

CMD ["npm", "run", "dev"]
