import { ExecArgs } from "@medusajs/framework/types"
import {
  ApplicationMethodAllocation,
  ApplicationMethodTargetType,
  ApplicationMethodType,
  Modules,
  PromotionRuleOperator,
  PromotionStatus,
  PromotionType,
} from "@medusajs/framework/utils"

/**
 * Creates the automatic "50% off crystals" promotion.
 *
 * Physical goods are told apart from sessions by **product type**, because
 * that is the only discriminator Medusa promotions can read: target rules
 * accept just items.product.{id,categories.id,collection_id,type_id,tags.id}.
 * The codebase's usual marker, product.metadata.is_service, is invisible to the
 * promotion engine — see the note in CLAUDE.md.
 *
 * The rule is an explicit include on the "product" type, so an untyped product
 * simply misses the discount rather than a session accidentally getting 50% off.
 *
 *   npx medusa exec ./src/scripts/setup-crystal-discount.ts
 *   DISCOUNT_PERCENT=30 npx medusa exec ./src/scripts/setup-crystal-discount.ts
 *   DRY_RUN=1 npx medusa exec ./src/scripts/setup-crystal-discount.ts
 */

const PROMO_CODE = "AUTO_CRYSTAL_50"
// The catalog already separates physical goods from bookings with these two
// product types; the discount reuses them rather than introducing a third.
const PHYSICAL_TYPE = "product"
const SESSION_TYPE = "session"

export default async function setupCrystalDiscount({ container }: ExecArgs) {
  const logger = container.resolve("logger")
  const productModule = container.resolve(Modules.PRODUCT)
  const promotionModule = container.resolve(Modules.PROMOTION)

  const percent = Number(process.env.DISCOUNT_PERCENT ?? 50)
  const dryRun = process.env.DRY_RUN === "1"

  if (!Number.isFinite(percent) || percent <= 0 || percent > 100) {
    throw new Error(`DISCOUNT_PERCENT must be between 1 and 100, got "${percent}"`)
  }

  // 1. Ensure both product types exist. They normally already do — this only
  //    backfills them on a fresh database.
  const existingTypes = await productModule.listProductTypes({
    value: [PHYSICAL_TYPE, SESSION_TYPE],
  } as any)

  const byValue = new Map(existingTypes.map((t) => [t.value, t]))

  for (const value of [PHYSICAL_TYPE, SESSION_TYPE]) {
    if (byValue.has(value)) continue

    if (dryRun) {
      logger.info(`[Crystal Discount] (dry run) would create product type "${value}"`)
      continue
    }

    const [created] = await productModule.createProductTypes([{ value }])
    byValue.set(value, created)
    logger.info(`[Crystal Discount] Created product type "${value}" (${created.id})`)
  }

  const physicalType = byValue.get(PHYSICAL_TYPE)

  if (!physicalType) {
    logger.info(
      `[Crystal Discount] (dry run) stopping — product type "${PHYSICAL_TYPE}" does not exist yet`
    )
    return
  }

  // 2. Recreate the promotion so re-running picks up a changed percentage.
  const [existing] = await promotionModule.listPromotions(
    { code: PROMO_CODE },
    // Target rules hang off the application method, not the promotion, so they
    // have to be pulled in explicitly to be cleaned up.
    { relations: ["application_method", "application_method.target_rules"] }
  )

  if (existing) {
    if (dryRun) {
      logger.info(`[Crystal Discount] (dry run) would replace existing promotion ${existing.id}`)
    } else {
      // Detach the target rules before deleting: deleting the promotion alone
      // leaves its promotion_rule rows orphaned, so they pile up on re-runs.
      const staleRules =
        (existing.application_method as any)?.target_rules ?? []

      if (staleRules.length) {
        await promotionModule
          .removePromotionTargetRules(
            existing.id,
            staleRules.map((r) => r.id)
          )
          .catch(() => undefined)
      }

      await promotionModule.deletePromotions([existing.id])

      logger.info(
        `[Crystal Discount] Removed previous promotion ${existing.id}` +
          (staleRules.length ? ` and ${staleRules.length} target rule(s)` : "")
      )
    }
  }

  if (dryRun) {
    logger.info(
      `[Crystal Discount] (dry run) would create ${percent}% automatic promotion ` +
        `targeting product type ${physicalType.id}`
    )
    return
  }

  const [promotion] = await promotionModule.createPromotions([
    {
      code: PROMO_CODE,
      type: PromotionType.STANDARD,
      status: PromotionStatus.ACTIVE,
      // Applies as soon as a matching item is in the cart — no coupon code.
      is_automatic: true,
      application_method: {
        type: ApplicationMethodType.PERCENTAGE,
        target_type: ApplicationMethodTargetType.ITEMS,
        // ACROSS applies the percentage to the matching subtotal, which for a
        // percentage promotion is the same as taking it off each line — and
        // unlike EACH it needs no max_quantity, so the discount is never
        // capped at N units.
        allocation: ApplicationMethodAllocation.ACROSS,
        value: percent,
        target_rules: [
          {
            description: `Physical products of type "${PHYSICAL_TYPE}"`,
            attribute: "items.product.type_id",
            operator: PromotionRuleOperator.IN,
            values: [physicalType.id],
          },
        ],
      },
    },
  ])

  logger.info(
    `[Crystal Discount] Created ${percent}% automatic promotion ${promotion.id} (${PROMO_CODE})`
  )

  const untyped = await productModule.listProducts(
    { type_id: null } as any,
    { take: 1 }
  )
  if (untyped.length) {
    logger.warn(
      `[Crystal Discount] Some products have no product type and will NOT be discounted. ` +
        `Set their type to "${PHYSICAL_TYPE}" in the admin.`
    )
  }
}
