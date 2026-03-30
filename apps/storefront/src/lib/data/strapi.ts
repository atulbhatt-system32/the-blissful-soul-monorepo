import qs from "qs"

const STRAPI_URL = process.env.STRAPI_URL || "http://localhost:1337"
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN

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
        return data.data?.[0] || null
    } catch (error) {
        console.error("Error fetching Strapi product:", error)
        return null
    }
}

export async function getHomepageData() {
    try {
        const query = qs.stringify({
            populate: {
                hero_slideshow: {
                    populate: "*"
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
                hot_sellers: true,
                healing_crystals: true
            },
        })

        const response = await fetch(`${STRAPI_URL}/api/homepage?${query}`, {
            headers: {
                Authorization: `Bearer ${STRAPI_TOKEN}`,
            },
            cache: "no-store",
        })

        const data = await response.json()
        return data.data || null
    } catch (error) {
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
        return data.data || null
    } catch (error) {
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
        return data.data || null
    } catch (error) {
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
        return data.data || null
    } catch (error) {
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
            },
        })

        const response = await fetch(`${STRAPI_URL}/api/store-config?${query}`, {
            headers: {
                Authorization: `Bearer ${STRAPI_TOKEN}`,
            },
            cache: "no-store",
        })

        const data = await response.json()
        return data.data || null
    } catch (error) {
        console.error("Error fetching store page data:", error)
        return null
    }
}
