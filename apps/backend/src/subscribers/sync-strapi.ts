import { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"

export default async function strapiProductSync({
    event,
    container,
}: SubscriberArgs<{ id: string }>) {
    const productService = container.resolve("product")
    const product = await productService.retrieveProduct(event.data.id)

    const strapiUrl = process.env.STRAPI_URL || "http://cms:1337"
    const strapiToken = process.env.CMS_API_TOKEN

    if (!strapiToken) {
        console.error("STRAPI_API_TOKEN is missing in environment.")
        return
    }

    try {
        // 1. Check if product exists in Strapi (using fetch for v5 compatibility)
        const searchResponse = await fetch(`${strapiUrl}/api/products?filters[medusa_id][$eq]=${product.id}`, {
            headers: { Authorization: `Bearer ${strapiToken.trim()}` }
        })

        if (!searchResponse.ok) {
            console.error(`Failed to fetch from Strapi: ${searchResponse.statusText}`)
            return
        }

        const searchData = await searchResponse.json()
        
        const payload = {
            data: {
                medusa_id: product.id,
                title: product.title,
                handle: product.handle,
                description: product.description || "",
                thumbnail_url: product.thumbnail || "",
                publishedAt: new Date(),
            }
        }

        const existingProduct = searchData.data?.[0]

        if (existingProduct) {
            // 2. Update existing (v5 uses documentId)
            const strapiId = existingProduct.documentId || existingProduct.id
            const updateResponse = await fetch(`${strapiUrl}/api/products/${strapiId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${strapiToken.trim()}`,
                },
                body: JSON.stringify(payload)
            })
            if (updateResponse.ok) {
                console.log(`Synced product ${product.id} (updated) to Strapi`)
            }
        } else {
            // 3. Create new
            const createResponse = await fetch(`${strapiUrl}/api/products`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${strapiToken.trim()}`,
                },
                body: JSON.stringify(payload)
            })
            if (createResponse.ok) {
                console.log(`Synced product ${product.id} (created) to Strapi`)
            }
        }
    } catch (error: any) {
        console.error(`Error syncing product ${product.id} to Strapi:`, error.message)
    }
}

export const config: SubscriberConfig = {
    event: ["product.created", "product.updated"],
}
