import { model } from "@medusajs/framework/utils"

/**
 * One row per product carrying its global storefront display order.
 * Kept in its own module (rather than product.metadata) so `rank` is a real,
 * indexed, uniquely-constrained integer column the database can sort and
 * paginate by directly — metadata is untyped JSON and can't be ordered or
 * indexed the same way.
 *
 * `rank` is enforced unique so every product has a distinct position; the
 * reorder algorithm (see ../service.ts) is responsible for shifting the
 * other rows before writing a new value here, never leaving two rows with
 * the same rank even momentarily within its transaction.
 */
const ProductRank = model
  .define("product_rank", {
    id: model.id({ prefix: "prank" }).primaryKey(),
    product_id: model.text(),
    rank: model.number(),
  })
  .indexes([
    { on: ["product_id"], unique: true },
    { on: ["rank"], unique: true },
  ])

export default ProductRank
