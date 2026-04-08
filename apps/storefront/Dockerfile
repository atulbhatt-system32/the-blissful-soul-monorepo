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

ARG NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY
ARG NEXT_PUBLIC_STRAPI_URL
ARG NEXT_PUBLIC_CAL_API_KEY
ARG NEXT_PUBLIC_CAL_USERNAME
ARG NEXT_PUBLIC_CAL_EVENT_SLUG
ARG NEXT_PUBLIC_RAZORPAY_KEY

ENV NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=$NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY
ENV NEXT_PUBLIC_STRAPI_URL=$NEXT_PUBLIC_STRAPI_URL
ENV NEXT_PUBLIC_CAL_API_KEY=$NEXT_PUBLIC_CAL_API_KEY
ENV NEXT_PUBLIC_CAL_USERNAME=$NEXT_PUBLIC_CAL_USERNAME
ENV NEXT_PUBLIC_CAL_EVENT_SLUG=$NEXT_PUBLIC_CAL_EVENT_SLUG
ENV NEXT_PUBLIC_RAZORPAY_KEY=$NEXT_PUBLIC_RAZORPAY_KEY

RUN pnpm run build

# Run as non-root
RUN chown -R node:node /app
USER node

EXPOSE 8000

CMD ["pnpm", "run", "start"]
