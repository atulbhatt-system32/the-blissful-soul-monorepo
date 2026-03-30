import { type SubscriberConfig, type SubscriberArgs } from "@medusajs/medusa"
import { addToCartWorkflow, deleteLineItemsWorkflow } from "@medusajs/medusa/core-flows"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

export default async function autoAddGift({
    event: { data },
    container,
}: SubscriberArgs<{ id: string }>) {
    const query = container.resolve(ContainerRegistrationKeys.QUERY)
    const logger = container.resolve(ContainerRegistrationKeys.LOGGER)

    try {
        const { data: carts } = await query.graph({
            entity: "cart",
            fields: ["id", "subtotal", "items.product_uri", "items.product_id", "items.id", "items.variant_id"],
            filters: { id: data.id }
        })

        if (!carts || carts.length === 0) return
        const cart = carts[0]

        // Find gift variant
        const { data: giftProducts } = await query.graph({
            entity: "product",
            fields: ["variants.id", "id", "handle"],
            filters: { handle: "money-potli-free-gift" }
        })

        if (!giftProducts || giftProducts.length === 0) return

        const giftProduct = giftProducts[0]
        const giftVariantId = giftProduct.variants?.[0]?.id

        if (!giftVariantId) return

        const hasGift = cart.items?.some((i: any) => i.product_id === giftProduct.id)
        const giftItem = cart.items?.find((i: any) => i.product_id === giftProduct.id)

        // subtotal doesn't include the discount, which is good
        const cartTotal = (cart as any).subtotal || 0

        if (cartTotal >= 1499) {
            if (!hasGift) {
                logger.info(`Auto-adding Free Potli to cart ${cart.id}`)
                await addToCartWorkflow(container).run({
                    input: {
                        cart_id: cart.id,
                        items: [{ variant_id: giftVariantId, quantity: 1 }]
                    }
                })
            }
        } else {
            if (hasGift && giftItem) {
                logger.info(`Removing Free Potli from cart ${cart.id} because subtotal dropped`)
                // Need to remove it
                await deleteLineItemsWorkflow(container).run({
                    input: {
                        cart_id: cart.id,
                        ids: [giftItem.id]
                    }
                })
            }
        }
    } catch (error) {
        logger.error("Error in autoAddGift subscriber:", error)
    }
}

export const config: SubscriberConfig = {
    event: ["cart.updated", "cart.created"],
}
