import { MedusaContainer } from "@medusajs/framework/types"

export default async function myScript({ container }: { container: MedusaContainer }) {
  const query = container.resolve("query")
  
  const { data: categories } = await (query as any).graph({
    entity: "product_category",
    fields: [
      "*",
      "metadata"
    ]
  })

  console.log("Found categories:", JSON.stringify(categories, null, 2))
}
