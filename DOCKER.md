# Docker Usage Instructions

To run the entire project using Docker, follow these steps:

## Prerequisites
- Docker and Docker Compose installed on your machine.

## Quick Start

1.  **Clone the repository** (if you haven't already).
2.  **Environment Variables**: Ensure you have `.env` files in `apps/backend`, `apps/storefront`, and `apps/cms`.
3.  **Run Docker Compose**:
    ```bash
    docker-compose up --build
    ```
    This will build and start:
    - **Postgres**: Database for Medusa.
    - **Redis**: Cache/Queue for Medusa.
    - **Backend (Medusa)**: Accessible at `http://localhost:9000`.
    - **Storefront (Next.js)**: Accessible at `http://localhost:8001`.
    - **CMS (Strapi)**: Accessible at `http://localhost:1337`.

## Useful Commands

- **Stop all services**: `docker-compose down`
- **View logs**: `docker-compose logs -f`
- **Restart a specific service**: `docker-compose restart backend`
- **Run a command in a container**: `docker-compose exec backend sh`

## Note on Development
The `docker-compose.yml` mounts your local folders into the containers, so changes to your code will (usually) be reflected in the running container if the service supports hot-reloading (like Next.js and Medusa dev mode).
