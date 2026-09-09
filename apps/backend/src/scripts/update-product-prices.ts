import fs from "fs"
import path from "path"
import { ExecArgs } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"
import { updateProductVariantsWorkflow } from "@medusajs/medusa/core-flows"
import { batchPriceListPricesWorkflow } from "@medusajs/medusa/core-flows"

/**
 * Bulk price update from a CSV exported by the product export, edited in Excel.
 *
 * Expected columns (extra columns are ignored, order does not matter):
 *
 *   Variant ID        required — the row is skipped without it
 *   Original Price    optional — the variant's base price
 *   Sale Price        optional — its price in the "Sale Price" price list
 *
 * A blank price cell means "leave this one alone", so a sheet can carry only
 * the prices being changed without wiping the rest. Use the literal word
 * REMOVE in Sale Price to take a variant off the sale list.
 *
 * Amounts are read as plain rupees ("1499" or "1,499"), matching the export.
 *
 *   DRY_RUN=1   npx medusa exec ./src/scripts/update-product-prices.ts -- prices.csv
 *   SKIP_BASE=1 npx medusa exec ./src/scripts/update-product-prices.ts -- prices.csv
 *   npx medusa exec ./src/scripts/update-product-prices.ts -- prices.csv
 *
 * SKIP_BASE=1 ignores the Original Price column entirely, for sheets where only
 * the sale column was edited and the base figures are just context.
 *
 * Always run DRY_RUN first: it prints every change without touching anything.
 */

const SALE_PRICE_LIST_TITLE = "Sale Price"
const CURRENCY = "inr"

type Row = {
  line: number
  variantId: string
  title: string
  basePrice?: number
  salePrice?: number | "REMOVE"
}

/** Minimal CSV reader that understands quoted fields containing commas. */
function parseCsv(text: string): string[][] {
  const rows: string[][] = []
  let row: string[] = []
  let field = ""
  let quoted = false

  for (let i = 0; i < text.length; i++) {
    const char = text[i]

    if (quoted) {
      if (char === '"') {
        if (text[i + 1] === '"') {
          field += '"'
          i++
        } else {
          quoted = false
        }
      } else {
        field += char
      }
      continue
    }

    if (char === '"') {
      quoted = true
    } else if (char === ",") {
      row.push(field)
      field = ""
    } else if (char === "\n") {
      row.push(field)
      rows.push(row)
      row = []
      field = ""
    } else if (char !== "\r") {
      field += char
    }
  }

  if (field.length || row.length) {
    row.push(field)
    rows.push(row)
  }

  return rows.filter((r) => r.some((c) => c.trim() !== ""))
}

/** "1,499" and " 1499 " both mean 1499. Blank means "not supplied". */
function parseAmount(raw: string | undefined): number | undefined {
  const value = (raw ?? "").replace(/[,\s₹]/g, "")
  if (!value) return undefined

  const amount = Number(value)
  if (!Number.isFinite(amount) || amount < 0) return undefined

  return Math.round(amount)
}

export default async function updateProductPrices({ container, args }: ExecArgs) {
  const logger = container.resolve("logger")
  const pricingModule = container.resolve(Modules.PRICING)
  const query = container.resolve("query")

  const dryRun = process.env.DRY_RUN === "1"
  const skipBase = process.env.SKIP_BASE === "1"
  const csvArg = args?.[0] ?? process.env.CSV

  if (!csvArg) {
    throw new Error(
      "Pass the CSV path, e.g. `npx medusa exec ./src/scripts/update-product-prices.ts -- prices.csv`"
    )
  }

  const csvPath = path.isAbsolute(csvArg) ? csvArg : path.resolve(process.cwd(), csvArg)

  if (!fs.existsSync(csvPath)) {
    throw new Error(`CSV not found at ${csvPath}`)
  }

  // 1. Read the sheet
  const table = parseCsv(fs.readFileSync(csvPath, "utf-8"))
  const header = table[0].map((h) => h.trim().toLowerCase())

  const col = (name: string) => header.indexOf(name.toLowerCase())
  const variantIdCol = col("Variant ID")
  const baseCol = col("Original Price")
  const saleCol = col("Sale Price")
  const titleCol = col("Product Title")

  if (variantIdCol === -1) {
    throw new Error(`CSV needs a "Variant ID" column. Found: ${table[0].join(", ")}`)
  }

  const rows: Row[] = []
  const skipped: string[] = []

  for (let i = 1; i < table.length; i++) {
    const cells = table[i]
    const variantId = (cells[variantIdCol] ?? "").trim()

    if (!variantId) {
      skipped.push(`line ${i + 1}: no Variant ID`)
      continue
    }

    const rawSale = (saleCol === -1 ? "" : cells[saleCol] ?? "").trim()

    rows.push({
      line: i + 1,
      variantId,
      title: (titleCol === -1 ? "" : cells[titleCol] ?? "").trim(),
      basePrice: baseCol === -1 ? undefined : parseAmount(cells[baseCol]),
      salePrice:
        rawSale.toUpperCase() === "REMOVE" ? "REMOVE" : parseAmount(rawSale),
    })
  }

  // Later rows win if a variant appears twice — the export repeats a variant
  // per price row, so duplicates are expected.
  const byVariant = new Map<string, Row>()
  for (const row of rows) {
    byVariant.set(row.variantId, { ...byVariant.get(row.variantId), ...row })
  }

  logger.info(
    `[Price Update] ${csvPath}: ${byVariant.size} unique variant(s) from ${rows.length} row(s)` +
      (skipped.length ? `, ${skipped.length} skipped` : "") +
      (skipBase ? " — SKIP_BASE set, sale prices only" : "")
  )

  // 2. Current prices, so unchanged rows can be left alone
  const { data: variants } = await query.graph({
    entity: "variant",
    fields: [
      "id",
      "title",
      "product.title",
      "price_set.id",
      "price_set.prices.id",
      "price_set.prices.amount",
      "price_set.prices.currency_code",
      "price_set.prices.price_list_id",
    ],
    filters: { id: [...byVariant.keys()] },
  })

  const found = new Map(variants.map((v: any) => [v.id, v]))

  for (const id of byVariant.keys()) {
    if (!found.has(id)) {
      skipped.push(`${id}: variant not found`)
      byVariant.delete(id)
    }
  }

  // 3. The sale price list, and its current prices.
  // `title` is not in FilterablePriceListProps, so match in memory instead.
  const priceLists = await pricingModule.listPriceLists({})
  const salePriceList = priceLists.find(
    (list) => list.title === SALE_PRICE_LIST_TITLE
  )

  // query.graph excludes price-list prices from price_set.prices — it returns
  // only the base price — so read them from the pricing module and join on
  // price_set_id. Without this every variant looks like it has no sale price
  // and the run would add duplicates instead of updating.
  const salePriceBySet = new Map<string, { id: string; amount: number }>()

  if (salePriceList) {
    const salePrices = await pricingModule.listPrices({
      price_list_id: [salePriceList.id],
    } as any)

    for (const price of salePrices as any[]) {
      if (price.price_set_id) {
        salePriceBySet.set(price.price_set_id, {
          id: price.id,
          amount: price.amount,
        })
      }
    }
  }

  const variantUpdates: any[] = []
  const saleCreate: any[] = []
  const saleUpdate: any[] = []
  const saleDelete: string[] = []
  let unchanged = 0

  for (const [variantId, row] of byVariant) {
    const variant: any = found.get(variantId)
    const prices: any[] = variant?.price_set?.prices ?? []
    const label = row.title || variant?.product?.title || variantId

    const currentBase = prices.find(
      (p) => !p.price_list_id && p.currency_code === CURRENCY
    )
    const currentSale = variant?.price_set?.id
      ? salePriceBySet.get(variant.price_set.id)
      : undefined

    let touched = false

    // Base price
    if (
      !skipBase &&
      row.basePrice !== undefined &&
      row.basePrice !== currentBase?.amount
    ) {
      logger.info(
        `[Price Update]   ${label}: base ${currentBase?.amount ?? "—"} → ${row.basePrice}`
      )
      variantUpdates.push({
        id: variantId,
        prices: [{ amount: row.basePrice, currency_code: CURRENCY }],
      })
      touched = true
    }

    // Sale price
    if (row.salePrice === "REMOVE") {
      if (currentSale) {
        logger.info(`[Price Update]   ${label}: sale ${currentSale.amount} → removed`)
        saleDelete.push(currentSale.id)
        touched = true
      }
    } else if (row.salePrice !== undefined) {
      if (!salePriceList) {
        skipped.push(`${label}: no "${SALE_PRICE_LIST_TITLE}" price list exists`)
      } else if (!currentSale) {
        logger.info(`[Price Update]   ${label}: sale — → ${row.salePrice}`)
        saleCreate.push({
          amount: row.salePrice,
          currency_code: CURRENCY,
          variant_id: variantId,
        })
        touched = true
      } else if (currentSale.amount !== row.salePrice) {
        logger.info(
          `[Price Update]   ${label}: sale ${currentSale.amount} → ${row.salePrice}`
        )
        saleUpdate.push({
          id: currentSale.id,
          amount: row.salePrice,
          currency_code: CURRENCY,
          variant_id: variantId,
        })
        touched = true
      }
    }

    if (!touched) unchanged++
  }

  logger.info(
    `[Price Update] ${variantUpdates.length} base price(s), ` +
      `${saleCreate.length} sale added, ${saleUpdate.length} sale changed, ` +
      `${saleDelete.length} sale removed, ${unchanged} unchanged`
  )

  for (const reason of skipped) {
    logger.warn(`[Price Update] skipped — ${reason}`)
  }

  if (dryRun) {
    logger.info("[Price Update] (dry run) nothing was written.")
    return
  }

  if (variantUpdates.length) {
    await updateProductVariantsWorkflow(container).run({
      input: { product_variants: variantUpdates },
    })
  }

  if (salePriceList && (saleCreate.length || saleUpdate.length || saleDelete.length)) {
    await batchPriceListPricesWorkflow(container).run({
      input: {
        data: {
          id: salePriceList.id,
          create: saleCreate,
          update: saleUpdate,
          delete: saleDelete,
        },
      },
    })
  }

  logger.info("[Price Update] Done.")
}
