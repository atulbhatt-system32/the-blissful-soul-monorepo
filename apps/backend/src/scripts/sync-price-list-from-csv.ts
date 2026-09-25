import { ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { batchPriceListPricesWorkflow } from "@medusajs/core-flows"
import fs from "fs"
import path from "path"

/**
 * Syncs a price list's prices from the "Sale Price" column of the product
 * catalogue CSV export. Rows with an empty Sale Price are left untouched —
 * that column being blank (Consultations & Sessions, Distant Healing) means
 * "no sale price for this variant," not "set it to zero."
 *
 *   CSV_PATH=/path/to/catalogue.csv PRICE_LIST_ID=plist_xxx npx medusa exec ./src/scripts/sync-price-list-from-csv.ts
 *   DRY_RUN=1 CSV_PATH=... PRICE_LIST_ID=... npx medusa exec ./src/scripts/sync-price-list-from-csv.ts
 */

const CURRENCY_CODE = "inr"

function parseAmount(raw: string): number | null {
  const cleaned = raw.replace(/[^\d.]/g, "")
  if (!cleaned) return null
  const n = Number(cleaned)
  return Number.isFinite(n) ? n : null
}

// Minimal RFC4180 parser — handles quoted fields with embedded commas, which
// this export uses for prices like "1,299.00".
function parseCsv(text: string): Record<string, string>[] {
  const rows: string[][] = []
  let row: string[] = []
  let field = ""
  let inQuotes = false

  for (let i = 0; i < text.length; i++) {
    const c = text[i]
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"'
          i++
        } else {
          inQuotes = false
        }
      } else {
        field += c
      }
    } else if (c === '"') {
      inQuotes = true
    } else if (c === ",") {
      row.push(field)
      field = ""
    } else if (c === "\n") {
      row.push(field)
      rows.push(row)
      row = []
      field = ""
    } else if (c === "\r") {
      // skip
    } else {
      field += c
    }
  }
  if (field.length || row.length) {
    row.push(field)
    rows.push(row)
  }

  const header = rows[0]
  return rows
    .slice(1)
    .filter((r) => r.some((cell) => cell !== ""))
    .map((r) => {
      const obj: Record<string, string> = {}
      header.forEach((h, idx) => {
        obj[h] = r[idx] ?? ""
      })
      return obj
    })
}

export default async function syncPriceListFromCsv({ container }: ExecArgs) {
  const logger = container.resolve("logger")
  const query = container.resolve(ContainerRegistrationKeys.QUERY)

  const csvPath = process.env.CSV_PATH
  const priceListId = process.env.PRICE_LIST_ID
  const dryRun = process.env.DRY_RUN === "1"

  if (!csvPath) throw new Error("CSV_PATH env var is required")
  if (!priceListId) throw new Error("PRICE_LIST_ID env var is required")

  const rows = parseCsv(fs.readFileSync(path.resolve(csvPath), "utf-8"))

  const desired = new Map<string, { amount: number; title: string }>()
  for (const row of rows) {
    const salePrice = (row["Sale Price"] || "").trim()
    const variantId = (row["Variant ID"] || "").trim()
    if (!salePrice || !variantId) continue

    const amount = parseAmount(salePrice)
    if (amount === null) {
      logger.warn(
        `[Price List Sync] Skipping "${row["Product Title"]}" — could not parse Sale Price "${salePrice}"`
      )
      continue
    }
    desired.set(variantId, { amount, title: row["Product Title"] })
  }

  logger.info(`[Price List Sync] ${desired.size} variant(s) have a Sale Price in the CSV`)

  const { data: existingPrices } = await query.graph({
    entity: "price",
    fields: ["id", "amount", "currency_code", "price_set.variant.id"],
    filters: { price_list_id: priceListId },
  } as any)

  const existingByVariant = new Map<string, { id: string; amount: number }>()
  for (const p of existingPrices as any[]) {
    const variantId = p.price_set?.variant?.id
    if (variantId && p.currency_code === CURRENCY_CODE) {
      existingByVariant.set(variantId, { id: p.id, amount: Number(p.amount) })
    }
  }

  const create: any[] = []
  const update: any[] = []
  const unchanged: string[] = []

  for (const [variantId, { amount, title }] of desired) {
    const existing = existingByVariant.get(variantId)
    if (existing) {
      if (existing.amount !== amount) {
        update.push({ id: existing.id, variant_id: variantId, currency_code: CURRENCY_CODE, amount })
        logger.info(`[Price List Sync] UPDATE ${title} (${variantId}): ${existing.amount} -> ${amount}`)
      } else {
        unchanged.push(title)
      }
    } else {
      create.push({ variant_id: variantId, currency_code: CURRENCY_CODE, amount })
      logger.info(`[Price List Sync] CREATE ${title} (${variantId}): -> ${amount}`)
    }
  }

  logger.info(
    `[Price List Sync] ${create.length} to create, ${update.length} to update, ${unchanged.length} already correct`
  )

  if (dryRun) {
    logger.info(`[Price List Sync] Dry run — no changes written.`)
    return
  }

  if (!create.length && !update.length) {
    logger.info(`[Price List Sync] Nothing to do — all prices already match.`)
    return
  }

  const workflow = batchPriceListPricesWorkflow(container)
  const { result } = await workflow.run({
    input: { data: { id: priceListId, create, update, delete: [] } },
  })

  logger.info(`[Price List Sync] Created ${result.created.length}, updated ${result.updated.length} price(s).`)
}
