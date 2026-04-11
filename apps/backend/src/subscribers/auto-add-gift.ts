import { type SubscriberConfig, type SubscriberArgs } from "@medusajs/medusa"
import { addToCartWorkflow, deleteLineItemsWorkflow } from "@medusajs/medusa/core-flows"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

// Handle of the product that should be auto-gifted
const GIFT_PRODUCT_HANDLE = "money-potli-free-gift"

// Fallback threshold in paise (₹1499). Client can override via the gift
// product's metadata: key = gift_threshold, value = e.g. 1499
const GIFT_THRESHOLD = 1499

// Metadata key used to mark auto-added gift line items
const GIFT_METADATA_KEY = "is_auto_gift"

export default async function autoAddGift({
    event: { data },
    container,
}: SubscriberArgs<{ id: string }>) {
    const query = container.resolve(ContainerRegistrationKeys.QUERY)
    const logger = container.resolve(ContainerRegistrationKeys.LOGGER)

    try {
        const { data: carts } = await query.graph({
            entity: "cart",
            fields: [
                "id",
                "items.id",
                "items.product_id",
                "items.unit_price",
                "items.quantity",
                "items.metadata",
            ],
            filters: { id: data.id },
        })

        if (!carts || carts.length === 0) return
        const cart = carts[0]

        // Separate gift items from regular items
        const nonGiftItems = (cart.items ?? []).filter(
            (i: any) => !i.metadata?.[GIFT_METADATA_KEY]
        )

        // Skip if every item in the cart is already a gift — avoids reacting
        // to our own addToCartWorkflow triggering another cart.updated event
        if (nonGiftItems.length === 0 && (cart.items ?? []).length > 0) return

        // Resolve the gift product and its client-configurable threshold
        const { data: giftProducts } = await query.graph({
            entity: "product",
            fields: ["id", "variants.id", "metadata"],
            filters: { handle: GIFT_PRODUCT_HANDLE },
        })

        if (!giftProducts || giftProducts.length === 0) {
            logger.warn(`[auto-gift] Product "${GIFT_PRODUCT_HANDLE}" not found — skipping`)
            return
        }

        const giftProduct = giftProducts[0]
        const giftVariantId = giftProduct.variants?.[0]?.id
        if (!giftVariantId) return

        const threshold = Number((giftProduct as any).metadata?.gift_threshold ?? GIFT_THRESHOLD)

        // Calculate subtotal from non-gift items only (unit_price is in paise)
        const cartTotal = nonGiftItems.reduce(
            (sum: number, item: any) => sum + (item.unit_price ?? 0) * (item.quantity ?? 1),
            0
        )

        logger.info(`[auto-gift] cart ${cart.id} — total: ${cartTotal}, threshold: ${threshold}`)

        const giftItem = (cart.items ?? []).find(
            (i: any) => i.product_id === giftProduct.id && i.metadata?.[GIFT_METADATA_KEY]
        )
        const hasGift = Boolean(giftItem)

        if (cartTotal >= threshold) {
            if (!hasGift) {
                logger.info(`[auto-gift] Adding free gift to cart ${cart.id}`)
                await addToCartWorkflow(container).run({
                    input: {
                        cart_id: cart.id,
                        items: [{
                            variant_id: giftVariantId,
                            quantity: 1,
                            metadata: { [GIFT_METADATA_KEY]: true },
                        }],
                    },
                })
            }
        } else {
            if (hasGift && giftItem) {
                logger.info(`[auto-gift] Removing free gift from cart ${cart.id} (total dropped to ${cartTotal})`)
                await deleteLineItemsWorkflow(container).run({
                    input: {
                        cart_id: cart.id,
                        ids: [(giftItem as any).id],
                    },
                })
            }
        }
    } catch (error) {
        logger.error("[auto-gift] Error:", error)
    }
}

export const config: SubscriberConfig = {
    event: ["cart.updated", "cart.created"],
}
