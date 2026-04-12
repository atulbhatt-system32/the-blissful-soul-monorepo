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
}

const STRAPI_URL = process.env.STOREFRONT_STRAPI_URL || "http://localhost:1337"
const STRAPI_TOKEN = process.env.CMS_API_TOKEN

export async function getStrapiProduct(medusaId: string) {
    try {
        const query = qs.stringify({
            filters: {
                medusa_id: { $eq: medusaId },
            },
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
                }
            },
        })

        const url = `${STRAPI_URL}/api/homepage?${query}`;
        const response = await fetch(url, {
            headers: {
                Authorization: `Bearer ${STRAPI_TOKEN}`,
            },
            cache: "no-store",
        })

        const data = await response.json()
        return (data.data as HomepageData) || null
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

        const data = await response.json()
        return (data.data as any) || null
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

        const data = await response.json()
        return (data.data as any) || null
    } catch (error: any) {
        if (error?.digest === "DYNAMIC_SERVER_USAGE") throw error;
        console.error("Error fetching contact page data:", error)
        return null
    }
}

export async function getBookSessionPageData() {
    try {
        const query = qs.stringify({
            populate: {
                top_services: true,
                audio_sessions: true,
                video_sessions: true,
                seo: true,
            },
        })

        const response = await fetch(`${STRAPI_URL}/api/book-session-page?${query}`, {
            headers: {
                Authorization: `Bearer ${STRAPI_TOKEN}`,
            },
            cache: "no-store",
        })

        const data = await response.json()
        return (data.data as any) || null
    } catch (error: any) {
        if (error?.digest === "DYNAMIC_SERVER_USAGE") throw error;
        console.error("Error fetching book session page data:", error)
        return null
    }
}

export async function getStorePageData() {
    try {
        const query = qs.stringify({
            populate: {
                hero_image: true,
                seo: true,
                announcements: true,
                product_offers: true,
            },
        })

        const url = `${STRAPI_URL}/api/store-config?${query}`
        console.log("[Strapi] Fetching store config:", url)
        
        const response = await fetch(url, {
            headers: {
                Authorization: `Bearer ${STRAPI_TOKEN}`,
            },
            cache: "no-store",
        })

        const json = await response.json()
        return json.data?.attributes || json.data || null
    } catch (error: any) {
        if (error?.digest === "DYNAMIC_SERVER_USAGE") throw error;
        console.error("Error fetching store page data:", error)
        return null
    }
}
