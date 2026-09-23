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
 * a CSV parsed client-side into rows of { sku, price?, sale_price? }.
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
 * for its promotion. That means a partial upload (only some SKUs carrying
 * sale_price) will drop sale prices for any SKU left out this time.
 *
 * CLAUDE.md warns that a sale price list and the AUTO_CRYSTAL_50 cart
 * promotion must not run at once (they'd stack) — this route does not
 * touch that promotion, so keeping them apart is on the caller.
 */

const CURRENCY_CODE = "inr"
const SALE_PRICE_LIST_TITLE = "Bulk Sale Prices"

type Row = {
  sku: string
  price?: number
  sale_price?: number
}

type RowResult = {
  sku: string
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
    if (!sku) {
      results.push({ sku: String(raw?.sku ?? ""), status: "error", message: "Missing SKU" })
      continue
    }

    const row: Row = { sku }

    if (raw.price !== undefined && raw.price !== null && raw.price !== "") {
      const price = Number(raw.price)
      if (!Number.isFinite(price) || price < 0) {
        results.push({ sku, status: "error", message: `Invalid price "${raw.price}"` })
        continue
      }
      row.price = price
    }

    if (raw.sale_price !== undefined && raw.sale_price !== null && raw.sale_price !== "") {
      const salePrice = Number(raw.sale_price)
      if (!Number.isFinite(salePrice) || salePrice < 0) {
        results.push({ sku, status: "error", message: `Invalid sale_price "${raw.sale_price}"` })
        continue
      }
      row.sale_price = salePrice
    }

    if (row.price === undefined && row.sale_price === undefined) {
      results.push({ sku, status: "error", message: "Row has neither price nor sale_price" })
      continue
    }

    cleaned.push(row)
  }

  if (cleaned.length === 0) {
    return res.json({ success: true, results })
  }

  const productModule = req.scope.resolve(Modules.PRODUCT)
  const pricingModule = req.scope.resolve(Modules.PRICING)

  const skus = cleaned.map((r) => r.sku)
  const variants = await productModule.listProductVariants(
    { sku: skus } as any,
    { select: ["id", "sku", "product_id"] }
  )
  const bySku = new Map(variants.map((v: any) => [v.sku, v]))

  const priceUpdates: { id: string; prices: { amount: number; currency_code: string }[] }[] = []
  const saleRows: { variant_id: string; currency_code: string; amount: number }[] = []

  for (const row of cleaned) {
    const variant: any = bySku.get(row.sku)
    if (!variant) {
      results.push({ sku: row.sku, status: "error", message: "SKU not found" })
      continue
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

    results.push({ sku: row.sku, status: "ok" })
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
