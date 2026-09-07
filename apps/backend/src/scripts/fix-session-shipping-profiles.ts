import { ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"

/**
 * Clears the two flags that make session/booking line items demand shipping.
 *
 * Medusa decides a line item's `requires_shipping` at add-to-cart time:
 *
 *   requiresShipping = isDefined(item.requires_shipping)
 *     ? item.requires_shipping
 *     : hasShippingProfile || someInventoryRequiresShipping
 *
 * (@medusajs/core-flows/dist/cart/utils/prepare-line-item-data.js)
 *
 * The store API accepts only variant_id/quantity/metadata, so the storefront
 * cannot override it. BOTH inputs have to be cleared: detaching the shipping
 * profile alone leaves the inventory item's own requires_shipping set, and the
 * `||` keeps the result true. Session products producing line items flagged
 * `requires_shipping: true`,
 * and because the checkout hides the shipping step for digital carts, no
 * method is ever attached. Cart completion then fails with "No shipping method
 * selected but the cart contains items that require shipping", and Medusa's
 * compensation step refunds the customer a payment it already captured.
 *
 * Existing carts keep the flag they were created with; this only affects items
 * added afterwards. isDigitalOnlyCart() defers to the flag so those older carts
 * still check out correctly.
 *
 *   npx medusa exec ./src/scripts/fix-session-shipping-profiles.ts
 *   DRY_RUN=1 npx medusa exec ./src/scripts/fix-session-shipping-profiles.ts
 */

const SESSION_TYPES = ["session", "booking", "course"]

export default async function fixSessionShippingProfiles({ container }: ExecArgs) {
  const logger = container.resolve("logger")
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  const link = container.resolve(ContainerRegistrationKeys.LINK)

  const dryRun = process.env.DRY_RUN === "1"

  const { data: products } = await query.graph({
    entity: "product",
    fields: [
      "id",
      "title",
      "type.value",
      "shipping_profile.id",
      "variants.id",
      "variants.inventory_items.inventory.id",
      "variants.inventory_items.inventory.requires_shipping",
    ],
    filters: {},
  })

  const sessionProducts = (products ?? []).filter((p: any) =>
    SESSION_TYPES.includes((p?.type?.value ?? "").toLowerCase())
  )

  const withProfile = sessionProducts.filter((p: any) => p?.shipping_profile?.id)

  // Inventory items are shared, so collect ids uniquely.
  const inventoryIds = [
    ...new Set(
      sessionProducts.flatMap((p: any) =>
        (p.variants ?? []).flatMap((v: any) =>
          (v.inventory_items ?? [])
            .filter((ii: any) => ii?.inventory?.requires_shipping)
            .map((ii: any) => ii.inventory.id)
        )
      )
    ),
  ] as string[]

  if (!withProfile.length && !inventoryIds.length) {
    logger.info("[Session Shipping] Nothing to do — sessions already require no shipping.")
    return
  }

  logger.info(
    `[Session Shipping] ${sessionProducts.length} session product(s): ` +
      `${withProfile.length} with a shipping profile, ` +
      `${inventoryIds.length} inventory item(s) flagged requires_shipping.`
  )

  if (dryRun) {
    logger.info("[Session Shipping] (dry run) no changes made.")
    return
  }

  for (const p of withProfile as any[]) {
    await link.dismiss({
      [Modules.PRODUCT]: { product_id: p.id },
      [Modules.FULFILLMENT]: { shipping_profile_id: p.shipping_profile.id },
    })
  }

  if (inventoryIds.length) {
    const inventoryModule = container.resolve(Modules.INVENTORY)
    await inventoryModule.updateInventoryItems(
      inventoryIds.map((id) => ({ id, requires_shipping: false }))
    )
  }

  logger.info(
    `[Session Shipping] Detached ${withProfile.length} shipping profile(s) and cleared ` +
      `requires_shipping on ${inventoryIds.length} inventory item(s). ` +
      `Items added to a cart from now on will have requires_shipping = false.`
  )
}
