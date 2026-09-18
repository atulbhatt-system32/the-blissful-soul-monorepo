import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { Modules } from "@medusajs/framework/utils"
import { PRODUCT_RANK_MODULE } from "../../../../../modules/product-rank"
import { ensureProductRanked } from "../../../../../modules/product-rank/utils"

/**
 * PATCH /admin/products/:id/rank
 *
 * Moves a product to the given global rank, shifting every product between
 * its old and new position by one (see ProductRankModuleService.reorderProduct
 * for the actual algorithm). Auto-protected by Medusa's standard admin auth
 * like every other /admin/* route — no custom auth needed here.
 *
 * Body: { rank: number }
 *
 * If the product has never been ranked before (e.g. created before this
 * feature existed, or before the product.created subscriber assigns one),
 * it's first appended to the end of the list, then moved to the requested
 * spot — so this endpoint works whether or not the product already has a
 * rank row.
 */
export async function PATCH(req: MedusaRequest, res: MedusaResponse) {
  const { id } = req.params
  const { rank } = req.body as { rank?: unknown }

  if (typeof rank !== "number" || !Number.isFinite(rank)) {
    return res.status(400).json({
      success: false,
      message: "`rank` must be a number",
    })
  }

  const productModule = req.scope.resolve(Modules.PRODUCT)
  const productRankService: any = req.scope.resolve(PRODUCT_RANK_MODULE)

  try {
    await productModule.retrieveProduct(id)
  } catch {
    return res.status(404).json({
      success: false,
      message: `Product ${id} not found`,
    })
  }

  await ensureProductRanked(req.scope, id)

  try {
    const updated = await productRankService.reorderProduct(id, Math.trunc(rank))

    return res.json({
      success: true,
      ranking: updated.map((r: any) => ({ product_id: r.product_id, rank: r.rank })),
    })
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to update rank",
    })
  }
}

/**
 * GET /admin/products/:id/rank
 *
 * Returns a product's current rank (and the total ranked count, so the
 * admin UI can show "3 of 12" style context), or 404 if it isn't ranked yet.
 */
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const { id } = req.params
  const productRankService: any = req.scope.resolve(PRODUCT_RANK_MODULE)

  const [existing] = await productRankService.listProductRanks({ product_id: id })

  if (!existing) {
    return res.status(404).json({
      success: false,
      message: `Product ${id} has no rank yet`,
    })
  }

  const total = await productRankService.listProductRanks({})

  return res.json({
    success: true,
    rank: existing.rank,
    total: total.length,
  })
}
