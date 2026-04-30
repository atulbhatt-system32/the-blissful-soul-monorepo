import { type SubscriberConfig, type SubscriberArgs } from "@medusajs/medusa"
import { addToCartWorkflow, deleteLineItemsWorkflow } from "@medusajs/medusa/core-flows"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

// Metadata key used to mark auto-added gift line items
const GIFT_METADATA_KEY = "is_auto_gift"

export default async function autoAddGift({
    event: { data },
    container,
}: SubscriberArgs<{ id: string }>) {
    const query = container.resolve(ContainerRegistrationKeys.QUERY)
    const logger = container.resolve(ContainerRegistrationKeys.LOGGER)

    try {
        // 1. Fetch the cart with items
        const { data: carts } = await query.graph({
            entity: "cart",
            fields: [
                "id",
                "items.id",
                "items.product_id",
                "items.unit_price",
                "items.quantity",
                "items.metadata",
                "items.adjustments.amount",
            ],
            filters: { id: data.id },
        })

        if (!carts || carts.length === 0) return
        const cart = carts[0]

        const allItems = cart.items ?? []
        const giftItems = allItems.filter((i: any) => i.metadata?.[GIFT_METADATA_KEY])
        const nonGiftItems = allItems.filter((i: any) => !i.metadata?.[GIFT_METADATA_KEY])

        // 2. Load hamper products — tagged "gift-hamper" with "hamper_threshold" in metadata.
        //    No handles or thresholds are hardcoded here; everything comes from the product.
        const { data: hamperProducts } = await query.graph({
            entity: "product",
            fields: ["id", "variants.id", "metadata", "title"],
            filters: { status: "published", tags: { value: "gift-hamper" } },
        })

        const hamperTiers = (hamperProducts ?? [])
            .filter((p: any) => p.metadata?.hamper_threshold != null && p.variants?.[0]?.id)
            .map((p: any) => ({
                productId: p.id,
                variantId: p.variants[0].id,
                threshold: Number(p.metadata.hamper_threshold),
                title: p.title,
            }))
            .filter((t: any) => !isNaN(t.threshold))
            .sort((a: any, b: any) => b.threshold - a.threshold) // highest first

        if (hamperTiers.length === 0) {
            logger.info(`[auto-gift] No hamper tiers configured. Skipping.`)
            return
        }

        // 3. Cart total from non-gift items only
        const cartTotal = nonGiftItems.reduce((sum: number, item: any) => {
            const lineTotal = (item.unit_price ?? 0) * (item.quantity ?? 1)
            const adjustments = (item.adjustments ?? []).reduce(
                (adj: number, a: any) => adj + (a.amount ?? 0),
                0
            )
            return sum + lineTotal - adjustments
        }, 0)

        logger.info(
            `[auto-gift] Cart ${cart.id} total: ${cartTotal}. Tiers: ${hamperTiers.map((t) => `${t.title}@${t.threshold}`).join(", ")}`
        )

        // Skip transitional state where items exist but total hasn't resolved yet
        if (nonGiftItems.length > 0 && cartTotal === 0) {
            logger.info(`[auto-gift] Transitional state — items present but total is 0. Skipping.`)
            return
        }

        // 4. Highest tier the cart qualifies for (null if below all thresholds)
        const qualifiedTier = hamperTiers.find((t: any) => cartTotal >= t.threshold) ?? null

        // 5. Any gift item that doesn't belong to the qualified tier is "wrong"
        const wrongGiftItems = giftItems.filter(
            (i: any) => !qualifiedTier || i.product_id !== qualifiedTier.productId
        )

        // 6. Remove wrong-tier items, then RETURN EARLY.
        //    deleteLineItemsWorkflow fires cart.updated, which triggers a fresh subscriber
        //    run. That clean run handles the add — avoiding concurrent duplicate adds.
        if (wrongGiftItems.length > 0) {
            logger.info(`[auto-gift] Removing ${wrongGiftItems.length} incorrect hamper(s)`)
            await deleteLineItemsWorkflow(container).run({
                input: {
                    cart_id: cart.id,
                    ids: wrongGiftItems.map((i: any) => i.id),
                },
            })
            return
        }

        // 7. No wrong items in cart at this point
        if (!qualifiedTier) {
            logger.info(`[auto-gift] Cart total ${cartTotal} is below all thresholds. Nothing to add.`)
            return
        }

        const correctGiftItems = giftItems.filter(
            (i: any) => i.product_id === qualifiedTier.productId
        )

        if (correctGiftItems.length === 0) {
            logger.info(`[auto-gift] Adding "${qualifiedTier.title}" to cart`)
            await addToCartWorkflow(container).run({
                input: {
                    cart_id: cart.id,
                    items: [
                        {
                            variant_id: qualifiedTier.variantId,
                            quantity: 1,
                            metadata: { [GIFT_METADATA_KEY]: true },
                        },
                    ],
                },
            })
        } else if (correctGiftItems.length > 1) {
            // Deduplicate if somehow more than one slipped in
            logger.info(`[auto-gift] Removing ${correctGiftItems.length - 1} duplicate hamper(s)`)
            await deleteLineItemsWorkflow(container).run({
                input: {
                    cart_id: cart.id,
                    ids: correctGiftItems.slice(1).map((i: any) => i.id),
                },
            })
        } else {
            logger.info(`[auto-gift] "${qualifiedTier.title}" already in cart. Nothing to do.`)
        }
    } catch (error) {
        logger.error("[auto-gift] Error processing cart gift logic:", error)
    }
}

export const config: SubscriberConfig = {
    event: ["cart.updated", "cart.created"],
}
