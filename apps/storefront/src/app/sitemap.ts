import type { MetadataRoute } from "next"

import { getBaseURL } from "@lib/util/env"

/**
 * Serves /sitemap.xml.
 *
 * The static pages are listed unconditionally; products, categories and
 * collections are fetched from Medusa so new ones appear without a code
 * change. If that fetch fails the sitemap still returns the static pages
 * rather than erroring — a backend hiccup should cost us the product URLs for
 * one crawl, not the whole file.
 *
 * Requests go straight to the store API rather than through lib/data, because
 * those helpers read cookies to resolve the cart and require a region for
 * pricing. A sitemap needs neither, and every dependency here is another way
 * for it to break.
 */

const REGION = process.env.NEXT_PUBLIC_DEFAULT_REGION || "in"
const MEDUSA_URL =
  process.env.STOREFRONT_MEDUSA_URL || "http://localhost:9000"
const PUBLISHABLE_KEY =
  process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || ""

/** Pages that always exist, in rough order of importance. */
const STATIC_PATHS: Array<{
  path: string
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"]
  priority: number
}> = [
  { path: "", changeFrequency: "daily", priority: 1 },
  { path: "/store", changeFrequency: "daily", priority: 0.9 },
  { path: "/book-now", changeFrequency: "weekly", priority: 0.9 },
  { path: "/services", changeFrequency: "weekly", priority: 0.8 },
  { path: "/about", changeFrequency: "monthly", priority: 0.7 },
  { path: "/contact", changeFrequency: "monthly", priority: 0.6 },
  { path: "/terms", changeFrequency: "yearly", priority: 0.3 },
  { path: "/privacy", changeFrequency: "yearly", priority: 0.3 },
  { path: "/refund-policy", changeFrequency: "yearly", priority: 0.3 },
]

type Handled = { handle?: string | null; updated_at?: string | null }

async function fetchHandles(
  path: string,
  key: string
): Promise<Handled[]> {
  try {
    const res = await fetch(`${MEDUSA_URL}${path}`, {
      headers: { "x-publishable-api-key": PUBLISHABLE_KEY },
      // Rebuilt at most hourly: the catalog changes rarely and a crawler
      // hitting this should not trigger a fresh set of queries each time.
      next: { revalidate: 3600 },
    })

    if (!res.ok) {
      console.warn(`[sitemap] ${path} returned ${res.status}`)
      return []
    }

    const json = await res.json()
    return Array.isArray(json?.[key]) ? json[key] : []
  } catch (error: any) {
    console.warn(`[sitemap] ${path} failed:`, error?.message ?? error)
    return []
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getBaseURL()
  const prefix = `${baseUrl}/${REGION}`
  const now = new Date()

  const entries: MetadataRoute.Sitemap = STATIC_PATHS.map(
    ({ path, changeFrequency, priority }) => ({
      url: `${prefix}${path}`,
      lastModified: now,
      changeFrequency,
      priority,
    })
  )

  // One failure must not take the others down, so they settle independently.
  const [products, categories, collections] = await Promise.all([
    fetchHandles(
      "/store/products?limit=1000&fields=handle,updated_at",
      "products"
    ),
    fetchHandles(
      "/store/product-categories?limit=1000&fields=handle,updated_at",
      "product_categories"
    ),
    fetchHandles(
      "/store/collections?limit=1000&fields=handle,updated_at",
      "collections"
    ),
  ])

  const push = (
    items: Handled[],
    segment: string,
    priority: number,
    changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"]
  ) => {
    for (const item of items) {
      if (!item?.handle) continue
      entries.push({
        url: `${prefix}/${segment}/${item.handle}`,
        lastModified: item.updated_at ? new Date(item.updated_at) : now,
        changeFrequency,
        priority,
      })
    }
  }

  push(products, "products", 0.8, "weekly")
  push(categories, "categories", 0.7, "weekly")
  push(collections, "collections", 0.7, "weekly")

  return entries
}
