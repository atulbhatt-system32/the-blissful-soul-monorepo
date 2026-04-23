# The Blissful Soul — Monorepo Guide for Claude

## Stack overview

Turborepo monorepo with pnpm workspaces. Three apps:
- `apps/backend` — Medusa v2 backend (port 9000)
- `apps/storefront` — Next.js 14 storefront (port 8001)
- `apps/cms` — Strapi CMS (port 1337)

All services run via Docker Compose (`docker-compose.yml` at the repo root).

---

## Docker

### Starting / restarting services
Always use `docker compose up -d <service>` — never `docker restart <container>`.

**Why:** `docker restart` reuses the existing container config and does NOT re-read `env_file`. Changes to `.env` files only take effect when the container is recreated via `docker compose up -d`.

### Backend config changes require a rebuild
After any change to `apps/backend/medusa-config.ts` (e.g. adding a plugin):
```bash
docker compose build backend
docker compose up -d backend
```
`medusa-config.ts` is baked into the image (not volume-mounted), so the running container won't see changes until a rebuild.

### Storefront — source is volume-mounted
`apps/storefront/src` is volume-mounted into the storefront container. Source code changes are picked up via hot reload with no rebuild needed. A **page reload** in the browser may be needed after server component changes to clear Next.js's RSC fetch cache.

---

## Credentials & URLs

| Resource | Value |
|---|---|
| Postgres password (docker-compose) | `TheBlissfulSoulP@$$W0rd` — docker-compose interprets `$$` as literal `$`, so actual password is `TheBlissfulSoulP@$W0rd` |
| DATABASE_URL (local, outside Docker) | `postgres://postgres:TheBlissfulSoulP%40%24W0rd@localhost:5432/medusa_db?sslmode=disable` |
| Redis | `redis://localhost:6379` |
| Backend (host) | `http://localhost:9000` |
| Storefront (host) | `http://localhost:8001` |

**URL-encode gotcha:** When constructing `DATABASE_URL` locally (e.g. for `medusa db:migrate`), the `@` and `$` in the password must be percent-encoded: `@` → `%40`, `$` → `%24`.

### Medusa publishable API key
Set in `apps/storefront/.env` as `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY`. After a DB reset, Medusa generates a new key and the old one becomes invalid ("A valid publishable key is required"). To fix:
```sql
SELECT token FROM api_key WHERE type = 'publishable';
```
Then update `apps/storefront/.env` and run `docker compose up -d storefront`.

### Storefront ↔ backend URL routing
- Server components fetch from `http://backend:9000` (Docker internal network)
- The browser accesses `http://localhost:9000` directly (port 9000 is mapped on the host)
- `next.config.js` has `hostname: "localhost"` in `remotePatterns` so Medusa static file URLs (`http://localhost:9000/static/...`) load fine in the browser

---

## Medusa category images

Plugin: `@alphabite/medusa-category-images` (installed in `apps/backend`).

### How it works
Images are stored in a separate `product_category_image` table, linked to categories via a Medusa remote link. The store API exposes them via the remote query graph.

### Fetching category images from the store API
Use `*product_category_images` as the field selector — **not** `*media` (that field doesn't exist and causes a 500 error):

```
GET /store/product-categories/:id?fields=*product_category_images
```

To fetch a parent category's children with their images and metadata in one call:
```
GET /store/product-categories?handle=services&fields=*category_children,*category_children.product_category_images,*category_children.metadata&limit=1
```

Response shape per child:
```json
{
  "name": "Kundali",
  "handle": "kundli-services",
  "metadata": { "color": "bg-blue-100", "one-liner": "..." },
  "product_category_images": [
    { "id": "cati_...", "url": "http://localhost:9000/static/...", "rank": 0 }
  ]
}
```

### Metadata conventions for service categories
Two keys are set per service category in the Medusa admin ("Edit Metadata"):
- `color` — Tailwind class for the flip card back (e.g. `bg-blue-100`, `bg-purple-100`)
- `one-liner` — Short description shown on the back of the flip card

### Admin routes (plugin adds, require auth)
- `GET /admin/product-category/:id` — fetch images
- `POST /admin/product-category/:id/images` — upload (body: `{ urls: string[] }`)
- `PUT /admin/product-category/:id/images` — reorder
- `DELETE /admin/product-category/:id/images` — delete by `images_id` query param
