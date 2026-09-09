import qs from "qs"

export interface HomepageData {
    hero_slideshow?: any[]
    pop_up?: any
    featured_products_label?: string
    featured_products_title?: string
    featured_products?: any[]
    testimonials_title?: string
    testimonials?: any[]
    trust_cards?: any[]
    faqs?: any[]
    instagram_handle?: string
    instagram_banner?: any
    /** Optional phone-sized artwork; falls back to instagram_banner. */
    instagram_banner_mobile?: any
    stats?: any[]
    shop_by_intent_title?: string
    show_featured_products?: boolean
    show_services?: boolean
    show_trust_carousel?: boolean
    show_faq?: boolean
    show_instagram?: boolean
    marquee_items?: Array<{ id: number; text: string }>
}

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337"
const STRAPI_INTERNAL_URL = process.env.STOREFRONT_STRAPI_URL || "http://cms:1337"
const STRAPI_TOKEN = process.env.CMS_API_TOKEN

/**
 * Base URL for the fetches in this module.
 *
 * Every export here runs on the server, so requests should stay on the Docker
 * network. Several of them used NEXT_PUBLIC_STRAPI_URL, which in production is
 * the public domain — that sent each render out through DNS, TLS and the
 * reverse proxy to come back to a container sitting next door, and is what
 * produced `ConnectTimeoutError: cms.pragyavijh.com:443` on the homepage.
 *
 * NEXT_PUBLIC_STRAPI_URL is still the right value for building media URLs the
 * browser has to load; it is just wrong as a server-side fetch target.
 */
const STRAPI_SERVER_URL = STRAPI_INTERNAL_URL || STRAPI_URL

/**
 * How long CMS responses may be reused, in seconds.
 *
 * Content here changes rarely, so serving it from cache removes most of the
 * upstream calls a page render used to make. Editors do not have to wait for
 * the window to elapse — a Strapi webhook calling revalidateTag() clears the
 * relevant tag straight away.
 */
const CMS_REVALIDATE_SECONDS = Number(
  process.env.CMS_REVALIDATE_SECONDS ?? 300
)

// Returns a map keyed by product handle (stable across environments)
export async function getStrapiProductsByHandles(handles: string[]): Promise<Record<string, any>> {
    const nonEmpty = handles.filter(Boolean)
    if (!nonEmpty.length) return {}
    try {
        const query = qs.stringify({
            filters: { handle: { $in: nonEmpty } },
            populate: "*",
            pagination: { limit: 100 },
        })
        const response = await fetch(`${STRAPI_SERVER_URL}/api/products?${query}`, {
            headers: { Authorization: `Bearer ${STRAPI_TOKEN}` },
            // Cached for CMS_REVALIDATE_SECONDS instead of no-store: this is
            // global CMS content, not per-visitor data, and re-fetching it on
            // every request was the main contributor to server response time.
            // revalidateTag("strapi-products") makes an edit appear immediately.
            next: { revalidate: CMS_REVALIDATE_SECONDS, tags: ["strapi-products"] },
        })
        const data = await response.json()
        const items: any[] = data.data || []
        const result: Record<string, any> = {}
        for (const item of items) {
            const handle = item.handle ?? item.attributes?.handle
            if (handle) result[handle] = item
        }
        return result
    } catch (error: any) {
        if (error?.digest === "DYNAMIC_SERVER_USAGE") throw error
        console.error("Error fetching Strapi products by handle:", error)
        return {}
    }
}

export async function getStrapiProduct(medusaId: string, handle?: string) {
    try {
        const filter = handle
            ? { handle: { $eq: handle } }
            : { medusa_id: { $eq: medusaId } }
        const query = qs.stringify({
            filters: filter,
            populate: "*",
        })

        const response = await fetch(`${STRAPI_SERVER_URL}/api/products?${query}`, {
            headers: {
                Authorization: `Bearer ${STRAPI_TOKEN}`,
            },
            // Cached for CMS_REVALIDATE_SECONDS instead of no-store: this is
            // global CMS content, not per-visitor data, and re-fetching it on
            // every request was the main contributor to server response time.
            // revalidateTag("strapi-products") makes an edit appear immediately.
            next: { revalidate: CMS_REVALIDATE_SECONDS, tags: ["strapi-products"] },
        })

        const data = await response.json()
        return (data.data?.[0] as any) || null
    } catch (error: any) {
        if (error?.digest === "DYNAMIC_SERVER_USAGE") throw error;
        console.error("Error fetching Strapi product:", error)
        return null
    }
}

export async function getHomepageData() {
    try {
        const query = qs.stringify({
            populate: {
                hero_slideshow: {
                    populate: {
                        image: true,
                        mobile_image: true
                    }
                },
                seo: true,
                stats: true,
                testimonials: {
                    populate: "image"
                },
                pop_up: {
                    populate: "image"
                },
                featured_products: {
                    populate: "*"
                },
                trust_cards: {
                    populate: "image"
                },
                faqs: true,
                instagram_banner: true,
                marquee_items: true
            },
        })

        const url = `${STRAPI_SERVER_URL}/api/homepage?${query}`;
        const response = await fetch(url, {
            headers: {
                Authorization: `Bearer ${STRAPI_TOKEN}`,
            },
            // Cached for CMS_REVALIDATE_SECONDS instead of no-store: this is
            // global CMS content, not per-visitor data, and re-fetching it on
            // every request was the main contributor to server response time.
            // revalidateTag("strapi-homepage") makes an edit appear immediately.
            next: { revalidate: CMS_REVALIDATE_SECONDS, tags: ["strapi-homepage"] },
        })

        const json = await response.json()
        return (json.data?.attributes || json.data || null) as HomepageData
    } catch (error: any) {
        if (error?.digest === "DYNAMIC_SERVER_USAGE") throw error;
        console.error("Error fetching homepage data:", error)
        return null
    }
}

export async function getAboutPageData() {
    try {
        const query = qs.stringify({
            populate: {
                profile_image: true,
                bio_points: true,
                seo: true,
            },
        })

        const response = await fetch(`${STRAPI_SERVER_URL}/api/about-page?${query}`, {
            headers: {
                Authorization: `Bearer ${STRAPI_TOKEN}`,
            },
            // Cached for CMS_REVALIDATE_SECONDS instead of no-store: this is
            // global CMS content, not per-visitor data, and re-fetching it on
            // every request was the main contributor to server response time.
            // revalidateTag("strapi-about") makes an edit appear immediately.
            next: { revalidate: CMS_REVALIDATE_SECONDS, tags: ["strapi-about"] },
        })

        const json = await response.json()
        return (json.data?.attributes || json.data || null) as any
    } catch (error: any) {
        if (error?.digest === "DYNAMIC_SERVER_USAGE") throw error;
        console.error("Error fetching about page data:", error)
        return null
    }
}

export async function getContactPageData() {
    try {
        const query = qs.stringify({
            populate: {
                seo: true,
            },
        })

        const response = await fetch(`${STRAPI_SERVER_URL}/api/contact-page?${query}`, {
            headers: {
                Authorization: `Bearer ${STRAPI_TOKEN}`,
            },
            // Cached for CMS_REVALIDATE_SECONDS instead of no-store: this is
            // global CMS content, not per-visitor data, and re-fetching it on
            // every request was the main contributor to server response time.
            // revalidateTag("strapi-contact") makes an edit appear immediately.
            next: { revalidate: CMS_REVALIDATE_SECONDS, tags: ["strapi-contact"] },
        })

        const json = await response.json()
        return (json.data?.attributes || json.data || null) as any
    } catch (error: any) {
        if (error?.digest === "DYNAMIC_SERVER_USAGE") throw error;
        console.error("Error fetching contact page data:", error)
        return null
    }
}


export async function getStorePageData() {
    // In Docker, we must use the service name 'cms' instead of localhost
    const baseUrl = STRAPI_INTERNAL_URL
    
    try {
        const query = qs.stringify({
            populate: {
                hero_image: true,
                mobile_hero_image: true,
                announcements: true,
            },
        })

        const url = `${baseUrl}/api/store-page?${query}&cb=${Date.now()}`
        console.log("[Strapi] Attempting fetch from:", url)
        
        const response = await fetch(url, {
            headers: {
                Authorization: `Bearer ${STRAPI_TOKEN}`,
            },
            // Cached for CMS_REVALIDATE_SECONDS instead of no-store: this is
            // global CMS content, not per-visitor data, and re-fetching it on
            // every request was the main contributor to server response time.
            // revalidateTag("strapi-store") makes an edit appear immediately.
            next: { revalidate: CMS_REVALIDATE_SECONDS, tags: ["strapi-store"] },
        })

        if (!response.ok) {
            console.warn(`[Strapi] Fetch failed with status: ${response.status} at ${url}`)
            return null
        }

        const json = await response.json()
        
        // Handle Strapi 4 and Strapi 5 response structures
        const data = json.data?.attributes || json.data || json
        return data || null
    } catch (error: any) {
        console.error("[Strapi] Fetching Error:", error.message)
        return null
    }
}

export async function getServicesPageData() {
    // In Docker, we must use the service name 'cms' instead of localhost
    const baseUrl = STRAPI_INTERNAL_URL
    
    try {
        const query = qs.stringify({
            populate: {
                hero_image: true,
                mobile_hero_image: true,
                seo: true,
            },
        })

        const url = `${baseUrl}/api/services-page?${query}&cb=${Date.now()}`
        console.log("[Strapi] Attempting fetch from:", url)
        
        const response = await fetch(url, {
            headers: {
                Authorization: `Bearer ${STRAPI_TOKEN}`,
            },
            // Cached for CMS_REVALIDATE_SECONDS instead of no-store: this is
            // global CMS content, not per-visitor data, and re-fetching it on
            // every request was the main contributor to server response time.
            // revalidateTag("strapi-services") makes an edit appear immediately.
            next: { revalidate: CMS_REVALIDATE_SECONDS, tags: ["strapi-services"] },
        })

        if (!response.ok) {
            if (response.status === 404) return null
            console.error(`[Strapi] Fetch failed with status: ${response.status} at ${url}`)
            return null
        }

        const json = await response.json()
        
        // Handle Strapi 4 and Strapi 5 response structures
        const data = json.data?.attributes || json.data || json
        return data || null
    } catch (error: any) {
        console.error("[Strapi] Fetching Error:", error.message)
        return null
    }
}

export async function getCoursePageData() {
    const baseUrl = STRAPI_INTERNAL_URL
    
    try {
        const query = qs.stringify({
            populate: {
                hero_image: true,
            },
        })

        const url = `${baseUrl}/api/course-page?${query}&cb=${Date.now()}`
        
        const response = await fetch(url, {
            headers: {
                Authorization: `Bearer ${STRAPI_TOKEN}`,
            },
            // Cached for CMS_REVALIDATE_SECONDS instead of no-store: this is
            // global CMS content, not per-visitor data, and re-fetching it on
            // every request was the main contributor to server response time.
            // revalidateTag("strapi-course") makes an edit appear immediately.
            next: { revalidate: CMS_REVALIDATE_SECONDS, tags: ["strapi-course"] },
        })

        if (!response.ok) {
            return null
        }

        const json = await response.json()
        const data = json.data?.attributes || json.data || json
        return data || null
    } catch (error: any) {
        console.error("[Strapi] Fetching Error:", error.message)
        return null
    }
}
