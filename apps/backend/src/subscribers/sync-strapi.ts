import { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import axios from "axios"

export default async function strapiProductSync({
    event,
    container,
}: SubscriberArgs<{ id: string }>) {
    const productService = container.resolve("product")
    const product = await productService.retrieveProduct(event.data.id)

    const strapiUrl = process.env.STRAPI_URL || "http://localhost:1337"
    const strapiToken = process.env.STRAPI_API_TOKEN

    try {
        // 1. Check if product exists in Strapi
        const { data: strapiProducts } = await axios.get(`${strapiUrl}/api/products?filters[medusa_id][$eq]=${product.id}`, {
            headers: { Authorization: `Bearer ${strapiToken}` }
        })

        const payload = {
            data: {
                medusa_id: product.id,
                title: product.title,
                handle: product.handle,
                description: product.description,
                publishedAt: new Date(),
            }
        }

        if (strapiProducts.data.length > 0) {
            // 2. Update existing
            const strapiId = strapiProducts.data[0].id
            await axios.put(`${strapiUrl}/api/products/${strapiId}`, payload, {
                headers: { Authorization: `Bearer ${strapiToken}` }
            })
            console.log(`Synced product ${product.id} (updated) to Strapi`)
        } else {
            // 3. Create new
            await axios.post(`${strapiUrl}/api/products`, payload, {
                headers: { Authorization: `Bearer ${strapiToken}` }
            })
            console.log(`Synced product ${product.id} (created) to Strapi`)
        }
    } catch (error) {
        console.error(`Error syncing product ${product.id} to Strapi:`, error.message)
    }
}

export const config: SubscriberConfig = {
    event: ["product.created", "product.updated"],
}
