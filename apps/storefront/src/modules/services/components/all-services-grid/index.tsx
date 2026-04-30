import { getAllServicesGrouped } from "@lib/data/categories"
import { getStrapiProductsByHandles } from "@lib/data/strapi"
import ProductPreview from "@modules/products/components/product-preview"

export default async function AllServicesGrid({
  countryCode,
}: {
  countryCode: string
}) {
  const grouped = await getAllServicesGrouped(countryCode)

  if (!grouped.length) {
    return (
      <section className="py-32 bg-[#FAF9F6]">
        <div className="content-container text-center">
          <p className="text-[#2C1E36]/40 font-serif italic text-lg">
            Services coming soon.
          </p>
        </div>
      </section>
    )
  }

  const allProducts = grouped.flatMap(({ products }) => products)
  const region = grouped[0].region

  const allHandles = allProducts.map((p) => p.handle).filter(Boolean) as string[]
  const strapiMap = allHandles.length
    ? await getStrapiProductsByHandles(allHandles)
    : {}

  return (
    <section className="py-16 md:py-24 bg-[#FAF9F6]">
      <div className="content-container">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {region && allProducts.map((product) => (
            <ProductPreview
              key={product.id}
              product={product}
              region={region}
              isFeatured
              strapiContent={strapiMap[product.handle ?? ""]}
            />
          ))}
        </div>

        <p className="text-center text-[#C5A059] text-[11px] font-bold uppercase tracking-[0.3em] flex items-center justify-center gap-3 mt-16">
          <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059]" />
          All charges are inclusive of 18% GST
          <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059]" />
        </p>
      </div>
    </section>
  )
}
