import { ExecArgs } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"
import { canonicalPhone, phonesMatch } from "../lib/phone"

/**
 * Rewrites every customer.phone into the canonical "+<digits>" form.
 *
 * Sign-in by phone narrows candidates with an `$in` filter over a fixed set of
 * likely spellings (see phoneMatchVariants). Rows written before phones were
 * normalised can use separators that set does not cover — "+91 98765-43210" —
 * and would never be returned by the filter. Canonicalising the column once
 * closes that gap.
 *
 *   npx medusa exec ./src/scripts/backfill-customer-phones.ts
 *   DRY_RUN=1 npx medusa exec ./src/scripts/backfill-customer-phones.ts
 */
export default async function backfillCustomerPhones({ container }: ExecArgs) {
  const logger = container.resolve("logger")
  const customerModule = container.resolve(Modules.CUSTOMER)

  const dryRun = process.env.DRY_RUN === "1"
  const pageSize = 500

  let offset = 0
  let scanned = 0
  let updated = 0
  let skipped = 0

  for (;;) {
    const customers = await customerModule.listCustomers(
      {},
      { take: pageSize, skip: offset, order: { id: "ASC" } }
    )

    if (!customers.length) break

    for (const customer of customers) {
      scanned++

      const current = customer.phone
      if (!current) continue

      const canonical = canonicalPhone(current)
      if (!canonical || canonical === current) continue

      // Never let normalisation change which subscriber the row points at.
      if (!phonesMatch(current, canonical)) {
        logger.warn(
          `[Backfill Phones] Skipping ${customer.id}: "${current}" does not normalise safely`
        )
        skipped++
        continue
      }

      if (dryRun) {
        logger.info(`[Backfill Phones] ${customer.id}: "${current}" -> "${canonical}"`)
      } else {
        await customerModule.updateCustomers(customer.id, { phone: canonical })
      }

      updated++
    }

    offset += customers.length
  }

  logger.info(
    `[Backfill Phones] ${dryRun ? "(dry run) " : ""}scanned ${scanned}, ` +
      `${dryRun ? "would update" : "updated"} ${updated}, skipped ${skipped}`
  )
}
