import { revalidateTag } from "next/cache"
import { NextRequest, NextResponse } from "next/server"

/**
 * Clears cached CMS content when an editor publishes in Strapi.
 *
 * lib/data/strapi.ts caches every CMS response for CMS_REVALIDATE_SECONDS and
 * tags it by page. Without this endpoint that window is also the worst-case
 * delay before an edit appears, which is why the default is only 5 minutes.
 * With Strapi calling it on publish, the timer stops being "how stale can the
 * site get" and becomes a safety net for a webhook that never arrived — so the
 * window can be raised to hours without the site feeling stale.
 */

/** Strapi content-type (model) name -> the cache tag it feeds. */
const MODEL_TAGS: Record<string, string[]> = {
  homepage: ["strapi-homepage"],
  "about-page": ["strapi-about"],
  "contact-page": ["strapi-contact"],
  "store-page": ["strapi-store"],
  "services-page": ["strapi-services"],
  "course-page": ["strapi-course"],
  product: ["strapi-products"],
}

const ALL_TAGS = Array.from(new Set(Object.values(MODEL_TAGS).flat()))

export async function POST(request: NextRequest) {
  const secret = process.env.CMS_REVALIDATE_SECRET

  // Without a configured secret the endpoint stays closed rather than open:
  // anything that can clear the cache on demand can also be used to force
  // every request through to Strapi.
  if (!secret) {
    console.error("[revalidate] CMS_REVALIDATE_SECRET is not set; refusing")
    return NextResponse.json(
      { message: "Revalidation is not configured" },
      { status: 503 }
    )
  }

  // Strapi sends its webhook headers verbatim, so accept either a bearer
  // token or a plain custom header depending on how the hook is set up.
  const provided =
    request.headers.get("x-revalidate-secret") ??
    request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ??
    ""

  if (provided !== secret) {
    // Deliberately vague: a caller that guesses wrong learns nothing about
    // whether the endpoint exists or what it expects.
    return NextResponse.json({ message: "Not found" }, { status: 404 })
  }

  let model: string | undefined
  let event: string | undefined

  try {
    const body = await request.json()
    // Strapi 5 sends { event, model, entry, ... }; older shapes nest the model
    // under the entry, so fall back rather than failing outright.
    model = body?.model ?? body?.entry?.__type ?? body?.uid?.split(".").pop()
    event = body?.event
  } catch {
    // A body-less ping is a valid way to say "clear everything".
  }

  const tags = model && MODEL_TAGS[model] ? MODEL_TAGS[model] : ALL_TAGS

  for (const tag of tags) {
    revalidateTag(tag)
  }

  console.log(
    `[revalidate] event=${event ?? "-"} model=${model ?? "-"} cleared=${tags.join(",")}`
  )

  return NextResponse.json({ revalidated: true, model: model ?? null, tags })
}

/**
 * Lets you confirm the route is deployed and whether the secret is set,
 * without revealing it and without clearing anything.
 */
export async function GET() {
  return NextResponse.json({
    ok: true,
    configured: Boolean(process.env.CMS_REVALIDATE_SECRET),
    tags: ALL_TAGS,
  })
}
