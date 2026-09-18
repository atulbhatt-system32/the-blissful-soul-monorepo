import { Modules } from "@medusajs/framework/utils"
import { PRODUCT_RANK_MODULE } from "."

/**
 * Gives a product its first rank (appended to the end) if it doesn't have
 * one yet, and — critically — registers the module link so remote queries
 * like `fields=+product_rank.rank` on /admin/products and /store/products
 * can actually find it.
 *
 * Creating a ProductRank row alone is not enough: module links are backed
 * by their own separate link table, populated only by the "link" service,
 * exactly like the category-images plugin does in its own route handler
 * (createProductCategoryImages + link.create). Skipping this step is why
 * the field expansion silently returned null even though the row existed.
 *
 * Returns the product's current rank either way.
 */
export async function ensureProductRanked(
  container: any,
  productId: string
): Promise<number> {
  const productRankService: any = container.resolve(PRODUCT_RANK_MODULE)
  const link = container.resolve("link")

  const [existing] = await productRankService.listProductRanks({ product_id: productId })
  if (existing) {
    return existing.rank
  }

  const nextRank = await productRankService.getNextRank()
  const [created] = await productRankService.createProductRanks([
    { product_id: productId, rank: nextRank },
  ])

  await link.create({
    [Modules.PRODUCT]: { product_id: productId },
    [PRODUCT_RANK_MODULE]: { product_rank_id: created.id },
  })

  return nextRank
}
