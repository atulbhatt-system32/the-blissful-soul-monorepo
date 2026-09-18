import { defineLink } from "@medusajs/framework/utils"
import ProductModule from "@medusajs/medusa/product"
import ProductRankModule from "../modules/product-rank"

/**
 * One-to-one: each product has exactly one product_rank row (enforced by
 * the unique index on product_id in the product_rank model itself).
 * Lets `fields=+product_rank.rank` be requested on /admin/products and
 * /store/products, and sorted on, without touching the core product table.
 */
export default defineLink(ProductModule.linkable.product, {
  linkable: ProductRankModule.linkable.productRank,
  isList: false,
})
