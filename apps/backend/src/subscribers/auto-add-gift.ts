import { type SubscriberConfig, type SubscriberArgs } from "@medusajs/medusa"
import { addToCartWorkflow, deleteLineItemsWorkflow } from "@medusajs/medusa/core-flows"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

// Handle of the product that should be auto-gifted
const GIFT_PRODUCT_HANDLE = "money-potli-free-gift"

// Cart subtotal (in smallest currency unit, e.g. paise) required to qualify
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
                "subtotal",
                "items.id",
                "items.product_id",
                "items.variant_id",
                "items.metadata",
            ],
            filters: { id: data.id },
        })

        if (!carts || carts.length === 0) return
        const cart = carts[0]

        // Skip if the only items in the cart are the gift itself — avoids
        // reacting to our own addToCartWorkflow triggering cart.updated.
        const nonGiftItems = (cart.items ?? []).filter(
            (i: any) => !i.metadata?.[GIFT_METADATA_KEY]
        )
        if (nonGiftItems.length === 0 && (cart.items ?? []).length > 0) return

        // Resolve the gift product once
        const { data: giftProducts } = await query.graph({
            entity: "product",
            fields: ["id", "variants.id", "metadata"],
            filters: { handle: GIFT_PRODUCT_HANDLE },
        })

        if (!giftProducts || giftProducts.length === 0) {
            logger.warn(`Gift product "${GIFT_PRODUCT_HANDLE}" not found — skipping`)
            return
        }

        const giftProduct = giftProducts[0]
        const giftVariantId = giftProduct.variants?.[0]?.id
        if (!giftVariantId) return

        // Client-configurable threshold — edit via Medusa admin > Product > Metadata
        // Key: gift_threshold, Value: e.g. 1499
        const threshold = Number((giftProduct as any).metadata?.gift_threshold ?? GIFT_THRESHOLD)

        const giftItem = (cart.items ?? []).find(
            (i: any) => i.product_id === giftProduct.id && i.metadata?.[GIFT_METADATA_KEY]
        )
        const hasGift = Boolean(giftItem)

        // subtotal excludes promotions/discounts, which is exactly what we want
        const cartTotal = (cart as any).subtotal ?? 0

        if (cartTotal >= threshold) {
            if (!hasGift) {
                logger.info(`[auto-gift] Adding free gift to cart ${cart.id} (subtotal: ${cartTotal}, threshold: ${threshold})`)
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
                logger.info(`[auto-gift] Removing free gift from cart ${cart.id} (subtotal dropped to ${cartTotal}, threshold: ${threshold})`)
                await deleteLineItemsWorkflow(container).run({
                    input: {
                        cart_id: cart.id,
                        ids: [giftItem.id],
                    },
                })
            }
        }
    } catch (error) {
        logger.error("[auto-gift] Error in autoAddGift subscriber:", error)
    }
}

export const config: SubscriberConfig = {
    event: ["cart.updated", "cart.created"],
}
