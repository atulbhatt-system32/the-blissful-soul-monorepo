import type { MetadataRoute } from "next"

import { getBaseURL } from "@lib/util/env"

/**
 * Serves /robots.txt.
 *
 * Without this the path fell through to the country-code routing, which
 * rewrote it to /in/robots.txt, found no page there and returned the 404 page
 * as HTML with a 200 status — telling crawlers the file existed and handing
 * them a web page. The middleware matcher had to be narrowed too, or it would
 * still redirect the request before this handler ran.
 */
export default function robots(): MetadataRoute.Robots {
  const baseUrl = getBaseURL()

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Nothing here is secret — these pages are either per-visitor or
        // transient, so indexing them wastes crawl budget and can surface
        // stale carts and empty account screens in search results.
        disallow: [
          "/api/",
          "/*/account",
          "/*/account/",
          "/*/cart",
          "/*/checkout",
          "/*/order/",
          "/*/wishlist",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  }
}
