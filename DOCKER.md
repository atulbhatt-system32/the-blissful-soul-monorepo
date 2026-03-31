# Docker Usage Instructions

This monorepo is configured to run entirely within Docker for a consistent development environment across Mac and Linux.

## Prerequisites
- Docker and Docker Compose (OrbStack recommended on Mac).
- At least 8GB of RAM allocated to Docker.

## Quick Start (Clean Setup)

If you are running the project for the first time or want a fresh start:

1.  **Stop and clean existing data**:
    ```bash
    docker-compose down -v
    ```
2.  **Build and start all services**:
    ```bash
    docker-compose up --build -d
    ```
3.  **Wait for initialization**:
    - Backend: `http://localhost:9000`
    - Storefront: `http://localhost:8001`
    - CMS: `http://localhost:1337`

4.  **Seed Data (Optional)**:
    If the database is empty, run these commands inside the backend container:
    ```bash
    docker-compose exec backend npx medusa exec ./src/scripts/init-key.ts
    docker-compose exec backend pnpm run seed
    ```

## Services Architecture

- **Postgres**: Medusa database.
- **Redis**: Medusa cache/events.
- **Backend (Medusa v2)**: The e-commerce engine.
- **Storefront (Next.js 15)**: The customer-facing website.
- **CMS (Strapi 5)**: Content management.

## Troubleshooting

### Native Binding Errors (better-sqlite3 / sharp)
If you see `Could not locate the bindings file`, it means `node_modules` contains Mac binaries instead of Linux ones. 
**Fix**: Our `docker-compose.yml` is configured to NOT mount `node_modules` from your host. If you still see this, run:
```bash
docker-compose down -v
docker-compose up --build -d
```

### Slow Builds
We have optimized the build by:
1. Using `node:20-slim` (Debian) instead of Alpine.
2. Removing `supportedArchitectures` from `package.json` to prevent downloading 4x binary bloat.
3. Adding build tools to the CMS image for native compilation.

## Useful Commands

- **View logs**: `docker-compose logs -f [service_name]`
- **Restart**: `docker-compose restart [service_name]`
- **Shell access**: `docker-compose exec [service_name] sh`

