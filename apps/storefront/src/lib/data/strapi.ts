import qs from "qs"

export interface HomepageData {
    hero_slideshow?: any[]
    pop_up?: any
    intro_section?: {
        label?: string
        heading?: string
        description?: string
        button_text?: string
        button_link?: string
    }
    featured_products_label?: string
    featured_products_title?: string
    featured_products?: any[]
    hot_seller_title?: string
    hot_sellers?: any[]
    healing_crystals_title?: string
    healing_crystals?: any[]
    book_session_title?: string
    tarot_services?: any[]
    audio_sessions?: any[]
    video_sessions?: any[]
    testimonials_title?: string
    testimonials?: any[]
    trust_cards?: any[]
    faqs?: any[]
    instagram_handle?: string
    instagram_banner?: any
    stats?: any[]
    shop_by_intent_title?: string
    show_hot_sellers?: boolean
    show_featured_products?: boolean
    show_book_session?: boolean
    show_services?: boolean
    show_trust_carousel?: boolean
    show_faq?: boolean
    show_instagram?: boolean
    marquee_items?: Array<{ id: number; text: string }>
}

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337"
const STRAPI_INTERNAL_URL = process.env.STOREFRONT_STRAPI_URL || "http://cms:1337"
const STRAPI_TOKEN = process.env.CMS_API_TOKEN

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
        const response = await fetch(`${STRAPI_URL}/api/products?${query}`, {
            headers: { Authorization: `Bearer ${STRAPI_TOKEN}` },
            cache: "no-store",
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

        const response = await fetch(`${STRAPI_URL}/api/products?${query}`, {
            headers: {
                Authorization: `Bearer ${STRAPI_TOKEN}`,
            },
            cache: "no-store",
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
                tarot_services: true,
                audio_sessions: true,
                video_sessions: true,
                testimonials: {
                    populate: "image"
                },
                pop_up: {
                    populate: "image"
                },
                hot_sellers: {
                    populate: "*"
                },
                healing_crystals: {
                    populate: "*"
                },
                intro_section: true,
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

        const url = `${STRAPI_URL}/api/homepage?${query}`;
        const response = await fetch(url, {
            headers: {
                Authorization: `Bearer ${STRAPI_TOKEN}`,
            },
            cache: "no-store",
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

        const response = await fetch(`${STRAPI_URL}/api/about-page?${query}`, {
            headers: {
                Authorization: `Bearer ${STRAPI_TOKEN}`,
            },
            cache: "no-store",
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

        const response = await fetch(`${STRAPI_URL}/api/contact-page?${query}`, {
            headers: {
                Authorization: `Bearer ${STRAPI_TOKEN}`,
            },
            cache: "no-store",
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
            cache: "no-store",
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
                announcements: true,
                seo: true,
            },
        })

        const url = `${baseUrl}/api/services-page?${query}&cb=${Date.now()}`
        console.log("[Strapi] Attempting fetch from:", url)
        
        const response = await fetch(url, {
            headers: {
                Authorization: `Bearer ${STRAPI_TOKEN}`,
            },
            cache: "no-store",
            next: { revalidate: 0 }
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
