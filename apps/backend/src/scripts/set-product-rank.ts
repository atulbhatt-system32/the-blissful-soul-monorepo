import { ExecArgs } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"
import { PRODUCT_RANK_MODULE } from "../modules/product-rank"
import { ensureProductRanked } from "../modules/product-rank/utils"

/**
 * Manual stopgap for setting a product's global rank until the admin
 * PATCH /admin/products/:id/rank route and "Product Ranking" page are
 * wired up. Safe to run repeatedly on any product, any time.
 *
 *   npx medusa exec ./src/scripts/set-product-rank.ts <product-handle> <rank>
 *
 * If the product has never been ranked before, it's appended to the end
 * of the list first, then moved to the requested spot — same behavior the
 * real API route will have. Prints the full ranking afterward so you can
 * see the result immediately.
 */
export default async function setProductRank({ container, args }: ExecArgs) {
  const logger = container.resolve("logger")
  const [handle, rankStr] = args

  if (!handle || rankStr === undefined) {
    logger.error(
      "Usage: npx medusa exec ./src/scripts/set-product-rank.ts <product-handle> <rank>"
    )
    return
  }

  const rank = parseInt(rankStr, 10)
  if (!Number.isFinite(rank)) {
    logger.error(`"${rankStr}" is not a valid number`)
    return
  }

  const productModule = container.resolve(Modules.PRODUCT)
  const productRankService: any = container.resolve(PRODUCT_RANK_MODULE)

  const [product] = await productModule.listProducts({ handle })
  if (!product) {
    logger.error(`No product found with handle "${handle}"`)
    return
  }

  await ensureProductRanked(container, product.id)

  const updated = await productRankService.reorderProduct(product.id, rank)

  logger.info(`"${product.title}" is now at rank ${rank} (clamped to valid range if needed).`)
  logger.info("Current ranking:")
  for (const row of updated) {
    const p = await productModule.retrieveProduct(row.product_id)
    logger.info(`  ${row.rank}: ${p.title} (${p.handle})`)
  }
}
