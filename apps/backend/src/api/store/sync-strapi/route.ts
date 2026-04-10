import { 
  MedusaRequest, 
  MedusaResponse 
} from "@medusajs/framework/http"
import axios from "axios"

export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const productService = req.scope.resolve("product")
  
  let products: any[] = []
  try {
    const listRes = await productService.listProducts({}, { take: 200 })
    products = Array.isArray(listRes) ? listRes : []
  } catch (e: any) {
    try {
      const [listAndCountRes] = await productService.listAndCountProducts({}, { take: 200 })
      products = listAndCountRes || []
    } catch (e2: any) {
      return res.json({ message: "Could not list products", error: e2.message })
    }
  }

  const strapiUrl = process.env.STRAPI_URL || "http://cms:1337"
  const strapiToken = process.env.CMS_API_TOKEN

  if (!strapiToken) {
    return res.json({ message: "ERROR: CMS_API_TOKEN is not set in backend .env" })
  }

  const results: any[] = []

  for (const product of products) {
    try {
      const { data: strapiProducts } = await axios.get(
        `${strapiUrl}/api/products?filters[medusa_id][$eq]=${product.id}`,
        { headers: { Authorization: `Bearer ${strapiToken}` } }
      )

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

      if (strapiProducts.data && strapiProducts.data.length > 0) {
        const strapiId = strapiProducts.data[0].id
        await axios.put(`${strapiUrl}/api/products/${strapiId}`, payload, {
          headers: { Authorization: `Bearer ${strapiToken}` }
        })
        results.push({ title: product.title, status: "updated" })
      } else {
        await axios.post(`${strapiUrl}/api/products`, payload, {
          headers: { Authorization: `Bearer ${strapiToken}` }
        })
        results.push({ title: product.title, status: "created" })
      }
    } catch (error) {
      results.push({ title: product.title, status: "error", error: error.message })
    }
  }

  res.json({
    message: `Sync complete! Processed ${results.length} products.`,
    results
  })
}
