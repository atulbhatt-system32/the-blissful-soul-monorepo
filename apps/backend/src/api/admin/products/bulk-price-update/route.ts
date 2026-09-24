import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { Modules, PriceListStatus, PriceListType } from "@medusajs/framework/utils"
import {
  createPriceListsWorkflow,
  deletePriceListsWorkflow,
  updateProductVariantsWorkflow,
} from "@medusajs/medusa/core-flows"

/**
 * POST /admin/products/bulk-price-update
 *
 * Bulk-updates variant prices (and, optionally, catalog "sale" prices) from
 * a CSV parsed client-side into rows of
 * { sku?, variant_id?, product_id?, price?, sale_price? }.
 *
 * Each row identifies its target by variant SKU, variant ID, or product ID —
 * whichever column the CSV has (checked in that order of precedence when a
 * row has more than one). Variant ID is the most precise — it addresses one
 * variant directly, no lookup ambiguity possible. Product ID only resolves
 * unambiguously for single-variant products: a product with more than one
 * variant fails that row rather than guessing which variant to price.
 *
 * `price` is written straight onto each variant via the same workflow the
 * native admin "Edit prices" screen uses — it upserts the INR money amount
 * by currency_code, so no existing price id is needed.
 *
 * `sale_price` goes into a single shared price list ("Bulk Sale Prices",
 * type: sale) so the storefront shows a struck-through price directly on
 * the shop page (see get-product-price.ts), not just at checkout. Every
 * run that touches sale prices deletes and recreates that price list from
 * the *complete* set of sale_price rows in the upload — mirroring the
 * idempotent delete+recreate pattern setup-crystal-discount.ts already uses
 * for its promotion. That means a partial upload (only some rows carrying
 * sale_price) will drop sale prices for any product left out this time.
 *
 * CLAUDE.md warns that a sale price list and the AUTO_CRYSTAL_50 cart
 * promotion must not run at once (they'd stack) — this route does not
 * touch that promotion, so keeping them apart is on the caller.
 */

const CURRENCY_CODE = "inr"
const SALE_PRICE_LIST_TITLE = "Bulk Sale Prices"

type Row = {
  identifier: string
  sku?: string
  variant_id?: string
  product_id?: string
  price?: number
  sale_price?: number
}

type RowResult = {
  identifier: string
  status: "ok" | "error"
  message?: string
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const { rows } = req.body as { rows?: unknown }

  if (!Array.isArray(rows) || rows.length === 0) {
    return res.status(400).json({ success: false, message: "`rows` must be a non-empty array" })
  }

  const cleaned: Row[] = []
  const results: RowResult[] = []

  for (const raw of rows as any[]) {
    const sku = typeof raw?.sku === "string" ? raw.sku.trim() : ""
    const variantId = typeof raw?.variant_id === "string" ? raw.variant_id.trim() : ""
    const productId = typeof raw?.product_id === "string" ? raw.product_id.trim() : ""
    const identifier = sku || variantId || productId

    if (!identifier) {
      results.push({
        identifier: "",
        status: "error",
        message: "Missing sku, variant_id, or product_id",
      })
      continue
    }

    const row: Row = sku
      ? { identifier, sku }
      : variantId
      ? { identifier, variant_id: variantId }
      : { identifier, product_id: productId }

    if (raw.price !== undefined && raw.price !== null && raw.price !== "") {
      const price = Number(raw.price)
      if (!Number.isFinite(price) || price < 0) {
        results.push({ identifier, status: "error", message: `Invalid price "${raw.price}"` })
        continue
      }
      row.price = price
    }

    if (raw.sale_price !== undefined && raw.sale_price !== null && raw.sale_price !== "") {
      const salePrice = Number(raw.sale_price)
      if (!Number.isFinite(salePrice) || salePrice < 0) {
        results.push({
          identifier,
          status: "error",
          message: `Invalid sale_price "${raw.sale_price}"`,
        })
        continue
      }
      row.sale_price = salePrice
    }

    if (row.price === undefined && row.sale_price === undefined) {
      results.push({ identifier, status: "error", message: "Row has neither price nor sale_price" })
      continue
    }

    cleaned.push(row)
  }

  if (cleaned.length === 0) {
    return res.json({ success: true, results })
  }

  const productModule = req.scope.resolve(Modules.PRODUCT)
  const pricingModule = req.scope.resolve(Modules.PRICING)

  const skus = cleaned.filter((r) => r.sku).map((r) => r.sku as string)
  const variantIds = cleaned.filter((r) => r.variant_id).map((r) => r.variant_id as string)
  const productIds = cleaned.filter((r) => r.product_id).map((r) => r.product_id as string)

  const variants = skus.length
    ? await productModule.listProductVariants(
        { sku: skus } as any,
        { select: ["id", "sku", "product_id"] }
      )
    : []
  const bySku = new Map(variants.map((v: any) => [v.sku, v]))

  const variantsById = variantIds.length
    ? await productModule.listProductVariants(
        { id: variantIds } as any,
        { select: ["id", "sku", "product_id"] }
      )
    : []
  const byVariantId = new Map(variantsById.map((v: any) => [v.id, v]))

  const products = productIds.length
    ? await productModule.listProducts(
        { id: productIds } as any,
        { select: ["id"], relations: ["variants"] }
      )
    : []
  const byProductId = new Map(products.map((p: any) => [p.id, p]))

  const priceUpdates: { id: string; prices: { amount: number; currency_code: string }[] }[] = []
  const saleRows: { variant_id: string; currency_code: string; amount: number }[] = []

  for (const row of cleaned) {
    let variant: any

    if (row.sku) {
      variant = bySku.get(row.sku)
      if (!variant) {
        results.push({ identifier: row.identifier, status: "error", message: "SKU not found" })
        continue
      }
    } else if (row.variant_id) {
      variant = byVariantId.get(row.variant_id)
      if (!variant) {
        results.push({
          identifier: row.identifier,
          status: "error",
          message: "Variant ID not found",
        })
        continue
      }
    } else {
      const product: any = byProductId.get(row.product_id as string)
      if (!product) {
        results.push({
          identifier: row.identifier,
          status: "error",
          message: "Product ID not found",
        })
        continue
      }
      if (!product.variants || product.variants.length !== 1) {
        results.push({
          identifier: row.identifier,
          status: "error",
          message: `Product has ${product.variants?.length ?? 0} variants — ambiguous, use SKU instead`,
        })
        continue
      }
      variant = product.variants[0]
    }

    if (row.price !== undefined) {
      priceUpdates.push({
        id: variant.id,
        prices: [{ amount: row.price, currency_code: CURRENCY_CODE }],
      })
    }

    if (row.sale_price !== undefined) {
      saleRows.push({
        variant_id: variant.id,
        currency_code: CURRENCY_CODE,
        amount: row.sale_price,
      })
    }

    results.push({ identifier: row.identifier, status: "ok" })
  }

  if (priceUpdates.length) {
    await updateProductVariantsWorkflow(req.scope).run({
      input: { product_variants: priceUpdates },
    })
  }

  if (saleRows.length) {
    const existingLists = await pricingModule.listPriceLists({
      q: SALE_PRICE_LIST_TITLE,
    } as any)
    const existing = existingLists.find((pl: any) => pl.title === SALE_PRICE_LIST_TITLE)

    if (existing) {
      await deletePriceListsWorkflow(req.scope).run({ input: { ids: [existing.id] } })
    }

    await createPriceListsWorkflow(req.scope).run({
      input: {
        price_lists_data: [
          {
            title: SALE_PRICE_LIST_TITLE,
            name: SALE_PRICE_LIST_TITLE,
            description: "Sale prices uploaded via the Bulk Price Update admin page.",
            type: PriceListType.SALE,
            status: PriceListStatus.ACTIVE,
            prices: saleRows,
          } as any,
        ],
      },
    })
  }

  const failed = results.filter((r) => r.status === "error").length

  return res.json({
    success: true,
    results,
    summary: { total: rows.length, updated: results.length - failed, failed },
  })
}
