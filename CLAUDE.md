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
Set in **two** places — `apps/storefront/.env` as `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY` and `apps/backend/.env` as `MEDUSA_PUBLISHABLE_KEY`. Both must match the DB or requests fail with "A valid publishable key is required". After a DB reset, Medusa generates a new key and the old one becomes invalid. To fix:
```sql
SELECT token FROM api_key WHERE type = 'publishable';
```
Update both `.env` files, then run `docker compose up -d storefront`.

### After a DB reset, also recreate these
A reset wipes the admin user, regions and the sales-channel link, and this repo has **no seed script** (`src/scripts/seed.ts` was deleted in 41ed481, though `pnpm seed` still references it). Without a region the storefront middleware throws "No regions found" before any page renders.

```bash
# 1. Admin user (none exists after a reset — /app is unreachable without one)
docker compose exec backend npx medusa user -e admin@pragyavijh.com -p 'YourPassword123'

# 2. Store currency + India region, via the admin API
TOKEN=$(curl -s -X POST http://localhost:9000/auth/user/emailpass \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@pragyavijh.com","password":"YourPassword123"}' | jq -r .token)

curl -X POST "http://localhost:9000/admin/stores/<store_id>" \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"supported_currencies":[{"currency_code":"inr","is_default":true}]}'

curl -X POST http://localhost:9000/admin/regions \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"name":"India","currency_code":"inr","countries":["in"],"automatic_taxes":true}'
```
The storefront's `NEXT_PUBLIC_DEFAULT_REGION` is `in`, so the region must include country `in`.

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

---

## Automatic 50% crystal discount

An automatic promotion (`AUTO_CRYSTAL_50`) takes 50% off physical crystals in the
cart. No coupon code — it applies as soon as a matching item is added.

```bash
npx medusa exec ./src/scripts/setup-crystal-discount.ts          # create/refresh
DISCOUNT_PERCENT=30 npx medusa exec ./src/scripts/setup-crystal-discount.ts
DRY_RUN=1 npx medusa exec ./src/scripts/setup-crystal-discount.ts
```
The script is idempotent — it deletes and recreates the promotion, so re-running
with a different `DISCOUNT_PERCENT` updates the rate.

### Products are targeted by product TYPE, not metadata
**Medusa promotion target rules can only read these five attributes:**
`items.product.id`, `items.product.categories.id`, `items.product.collection_id`,
`items.product.type_id`, `items.product.tags.id` (operators: `eq`, `ne`, `in`,
`gt`, `gte`, `lt`, `lte`).

`metadata` is **not** among them — so the usual `product.metadata.is_service`
marker used everywhere else in this codebase (`is-digital-cart.ts`,
`lib/data/products.ts`, `lib/data/orders.ts`) is invisible to the promotion
engine. That is why the discount keys off product type instead.

The catalog's existing two product types are reused — `product` for physical
goods and `session` for bookings — so nothing new is introduced. The script only
backfills them if they are missing (e.g. on a fresh database).

**Every physical item must have its type set to `product` in the admin or it
will not be discounted.** The rule is an explicit include (`type_id in
[product]`) so it fails safe: an untyped item just misses the discount, rather
than a session accidentally getting 50% off.

### Allocation is `across`, not `each`
`each` requires `application_method.max_quantity`, which would cap the discount
at N units per line. `across` applies the percentage to the matching subtotal —
identical result for a percentage promotion, with no cap.

### This is a cart-level discount
Product cards and PDPs still show the full price; the 50% appears in the cart as
a discount line (`cart-totals` computes `discount_subtotal = item_subtotal -
item_total`). To strike through prices in the catalog instead, that needs a
**price list** of `type: sale` — `lib/util/get-product-price.ts` already renders
`original_price` and `percentage_diff` for that case. Do not run both at once or
they stack.
