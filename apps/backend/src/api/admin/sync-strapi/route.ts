import { MedusaRequest, MedusaResponse, IProductModuleService } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"

export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> => {
  const productService: IProductModuleService = req.scope.resolve(Modules.PRODUCT)
  
  let products: any[] = []
  try {
    const result = await productService.listAndCountProducts({}, { take: 100 })
    products = result[0] || []
  } catch (e: any) {
    res.json({ message: "Medusa Error", error: e.message })
    return
  }

  // Use the same URL the storefront uses
  const strapiUrl = process.env.STRAPI_URL || "http://cms:1337"
  const strapiToken = process.env.CMS_API_TOKEN

  if (!strapiToken) {
    res.json({ message: "ERROR: CMS_API_TOKEN is missing in backend .env" })
    return
  }

  const results: any[] = []

  for (const product of products) {
    try {
      // EXACT same fetch logic as storefront/src/lib/data/strapi.ts
      const searchResponse = await fetch(`${strapiUrl}/api/products?filters[medusa_id][$eq]=${product.id}`, {
        headers: {
          Authorization: `Bearer ${strapiToken.trim()}`,
        },
        method: "GET"
      })

      if (searchResponse.status === 404) {
        throw new Error(`Strapi says 404 Not Found for ${strapiUrl}/api/products. Please check if the 'Product' content type plural name is correct.`)
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
        // In Strapi v5, use documentId if id is missing or for specific calls
        const strapiId = existingProduct.documentId || existingProduct.id
        const updateResponse = await fetch(`${strapiUrl}/api/products/${strapiId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${strapiToken.trim()}`,
          },
          body: JSON.stringify(payload)
        })
        results.push({ title: product.title, status: "updated", strapi_status: updateResponse.status })
      } else {
        const createResponse = await fetch(`${strapiUrl}/api/products`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${strapiToken.trim()}`,
          },
          body: JSON.stringify(payload)
        })
        results.push({ title: product.title, status: "created", strapi_status: createResponse.status })
      }
    } catch (error: any) {
      results.push({ 
        title: product.title, 
        status: "error", 
        error: error.message
      })
    }
  }

  res.json({
    message: "Sync complete!",
    processed: results.length,
    results
  })
}
