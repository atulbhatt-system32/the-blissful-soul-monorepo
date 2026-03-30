import {
    createWorkflow,
    WorkflowResponse,
    StepResponse,
    createStep
} from "@medusajs/framework/workflows-sdk"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"
import axios from "axios"

const syncToStrapiStep = createStep(
    "sync-to-strapi",
    async (input: any, { container }) => {
        const query = container.resolve(ContainerRegistrationKeys.QUERY)
        const { data: products } = await query.graph({
            entity: "product",
            fields: ["id", "title", "handle", "description", "status", "thumbnail"]
        })

        const STRAPI_URL = process.env.STRAPI_URL || "http://localhost:1337"
        const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN

        const syncResults: string[] = []

        for (const product of products) {
            try {
                // Search if exists
                const existing = await axios.get(`${STRAPI_URL}/api/products?filters[medusa_id][$eq]=${product.id}`, {
                    headers: { Authorization: `Bearer ${STRAPI_TOKEN}` }
                })

                const strapiData = {
                    data: {
                        medusa_id: product.id,
                        title: product.title ?? "",
                        handle: product.handle ?? "",
                        description: product.description ?? "",
                        thumbnail_url: product.thumbnail ?? "",
                    }
                }

                if (existing.data.data.length > 0) {
                    const entryId = existing.data.data[0].id
                    await axios.put(`${STRAPI_URL}/api/products/${entryId}`, strapiData, {
                        headers: { Authorization: `Bearer ${STRAPI_TOKEN}` }
                    })
                    syncResults.push(`Updated ${product.title}`)
                } else {
                    await axios.post(`${STRAPI_URL}/api/products`, strapiData, {
                        headers: { Authorization: `Bearer ${STRAPI_TOKEN}` }
                    })
                    syncResults.push(`Created ${product.title}`)
                }
            } catch (error: any) {
                const errorMsg = error.response?.data ? JSON.stringify(error.response.data, null, 2) : error.message
                syncResults.push(`Failed ${product.title}: ${errorMsg}`)
            }
        }

        return new StepResponse(syncResults)
    }
)

export const syncAllProductsWorkflow = createWorkflow(
    "sync-all-products",
    () => {
        const result = syncToStrapiStep({})
        return new WorkflowResponse(result)
    }
)

export default async function runSync({ container }: any) {
    const { result } = await syncAllProductsWorkflow(container).run({})
    console.log("Sync Results:", result)
}
