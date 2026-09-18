import {
  InjectTransactionManager,
  InjectManager,
  MedusaContext,
  MedusaError,
} from "@medusajs/framework/utils"
import { Context } from "@medusajs/framework/types"
import ProductRank from "./models/product-rank"
import { MedusaService } from "@medusajs/framework/utils"

class ProductRankModuleService extends MedusaService({
  ProductRank,
}) {
  /**
   * The next free rank — current highest + 1, or 1 if nothing is ranked yet.
   * Used to give newly created products a sensible default position
   * (the end of the list) without disturbing anyone else's rank.
   */
  @InjectManager()
  async getNextRank(
    @MedusaContext() sharedContext: Context = {}
  ): Promise<number> {
    const [top] = await this.listProductRanks(
      {},
      { order: { rank: "DESC" }, take: 1 },
      sharedContext
    )
    return (top?.rank ?? 0) + 1
  }

  /**
   * Moves a product to `requestedRank`, shifting every product between its
   * old and new position by one to keep ranks a contiguous, unique
   * 1..N sequence. Runs entirely inside one transaction: the target row is
   * parked on a sentinel value first so the shift never has two rows
   * holding the same rank at once (the unique index on `rank` is not
   * deferrable, so that ordering matters), and either the whole move
   * commits or none of it does.
   *
   * Returns the full, freshly-ordered rank list so callers (the admin route)
   * can hand the new state straight back to the UI.
   */
  @InjectTransactionManager()
  async reorderProduct(
    productId: string,
    requestedRank: number,
    @MedusaContext() sharedContext: Context = {}
  ) {
    const all = await this.listProductRanks(
      {},
      { order: { rank: "ASC" } },
      sharedContext
    )

    const total = all.length
    const current = all.find((r) => r.product_id === productId)

    if (!current) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `No rank entry found for product ${productId}`
      )
    }

    if (!Number.isFinite(requestedRank) || requestedRank < 1) {
      requestedRank = 1
    }
    // Clamp: asking for a rank past the end just means "last position".
    if (requestedRank > total) {
      requestedRank = total
    }

    const oldRank = current.rank

    if (requestedRank === oldRank) {
      return all
    }

    // Sentinel: guaranteed free since real ranks are always >= 1.
    await this.updateProductRanks(
      { id: current.id, rank: -1 },
      sharedContext
    )

    if (requestedRank < oldRank) {
      // Moving earlier: everyone between the new and old spot shifts +1.
      // Process highest rank first so each row moves into a slot that was
      // just vacated, never one still occupied.
      const affected = all
        .filter((r) => r.id !== current.id && r.rank >= requestedRank && r.rank < oldRank)
        .sort((a, b) => b.rank - a.rank)

      for (const row of affected) {
        await this.updateProductRanks(
          { id: row.id, rank: row.rank + 1 },
          sharedContext
        )
      }
    } else {
      // Moving later: everyone between the old and new spot shifts -1.
      // Process lowest rank first for the same reason, in reverse.
      const affected = all
        .filter((r) => r.id !== current.id && r.rank > oldRank && r.rank <= requestedRank)
        .sort((a, b) => a.rank - b.rank)

      for (const row of affected) {
        await this.updateProductRanks(
          { id: row.id, rank: row.rank - 1 },
          sharedContext
        )
      }
    }

    await this.updateProductRanks(
      { id: current.id, rank: requestedRank },
      sharedContext
    )

    return this.listProductRanks({}, { order: { rank: "ASC" } }, sharedContext)
  }
}

export default ProductRankModuleService
