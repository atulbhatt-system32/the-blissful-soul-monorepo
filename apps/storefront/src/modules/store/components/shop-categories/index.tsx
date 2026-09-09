import Image from "next/image"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { getShopCategories } from "@lib/data/categories"

/**
 * Category tiles shown at the top of the shop page, linking through to
 * /categories/<handle>.
 *
 * Renders nothing when the Shop Collection tree is missing, so the shop page
 * is unaffected in environments where the categories have not been created yet
 * (see apps/backend/src/scripts/setup-shop-categories.ts).
 */
const ShopCategories = async () => {
  const categories = await getShopCategories()

  if (!categories?.length) {
    return null
  }

  return (
    <section className="w-full" data-testid="shop-categories">
      <div className="flex flex-col gap-y-1 mb-6 md:mb-8">
        <span className="text-[10px] md:text-xs uppercase tracking-[0.4em] font-bold text-[#C5A059] font-sans">
          Shop Collection
        </span>
        <h2 className="text-2xl md:text-4xl font-serif text-[#2C1E36] leading-tight">
          Browse by <span className="italic font-normal">Category</span>
        </h2>
        <div className="h-1 w-16 bg-[#C5A059] rounded-full mt-2" />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-5">
        {categories.map((category: any) => {
          const image = category.product_category_images?.[0]?.url

          return (
            <LocalizedClientLink
              key={category.id}
              href={`/categories/${category.handle}`}
              className="group flex flex-col rounded-[1.25rem] md:rounded-[2rem] overflow-hidden bg-white border border-purple-50/60 shadow-sm hover:shadow-xl hover:shadow-purple-900/10 transition-all duration-500"
              data-testid="shop-category-link"
            >
              <div className="relative w-full aspect-square bg-[#FAF9F6] overflow-hidden">
                {image ? (
                  <Image
                    src={image}
                    alt={category.name}
                    fill
                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                ) : (
                  // Placeholder until category images are uploaded in the admin
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#2C1E36]/5 to-[#C5A059]/10">
                    <span className="font-serif italic text-2xl md:text-3xl text-[#2C1E36]/30">
                      {category.name?.charAt(0)}
                    </span>
                  </div>
                )}
              </div>

              <div className="p-3 md:p-4 text-center">
                <span className="text-[11px] md:text-sm font-bold uppercase tracking-[0.12em] text-[#2C1E36] leading-snug">
                  {category.name}
                </span>
              </div>
            </LocalizedClientLink>
          )
        })}
      </div>
    </section>
  )
}

export default ShopCategories
