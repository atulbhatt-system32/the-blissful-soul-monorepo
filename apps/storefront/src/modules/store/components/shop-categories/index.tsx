import { getShopCategories } from "@lib/data/categories"
import CategorySlider from "./category-slider"
import CategoryTile, { ShopCategoryTile, isComingSoon } from "./category-tile"

/**
 * Category tiles shown at the top of the shop page, linking through to
 * /categories/<handle>.
 *
 * Everything shown here is managed in the Medusa admin under Shop Collection:
 * order is the category rank, the image is its first uploaded image, and
 * metadata `coming_soon: true` shows a badge instead of a link.
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

  // Only what a tile renders crosses to the client slider.
  const tiles: ShopCategoryTile[] = categories.map((category: any) => ({
    id: category.id,
    handle: category.handle,
    name: category.name,
    image: category.product_category_images?.[0]?.url,
    comingSoon: isComingSoon(category.metadata),
  }))

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

      {/* Phones: a swipeable row, just over three tiles across */}
      <CategorySlider categories={tiles} />

      {/* Tablet and up: a grid — six across on desktop for the client's six */}
      <div className="hidden md:grid md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-5">
        {tiles.map((tile) => (
          <CategoryTile key={tile.id} tile={tile} variant="grid" />
        ))}
      </div>
    </section>
  )
}

export default ShopCategories
