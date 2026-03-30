import { ExecArgs } from "@medusajs/framework/types"
import { createProductsWorkflow, createPromotionsWorkflow } from "@medusajs/medusa/core-flows"
import { ContainerRegistrationKeys, Modules, ProductStatus } from "@medusajs/framework/utils";

export default async function seedPromotions({ container }: ExecArgs) {
    const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
    const query = container.resolve(ContainerRegistrationKeys.QUERY)
    const fulfillmentModuleService = container.resolve(Modules.FULFILLMENT)

    try {
        const { data: salesChannels } = await query.graph({ entity: "sales_channel", fields: ["id"] })
        const salesChannelId = salesChannels[0]?.id

        const sProfiles = await fulfillmentModuleService.listShippingProfiles()
        const shippingProfileId = sProfiles[0]?.id

        logger.info("Creating Money Potli free gift...")

        let freeGiftId = ""

        // Check if already exists
        const { data: existing } = await query.graph({ entity: "product", fields: ["id", "handle"], filters: { handle: "money-potli-free-gift" } })

        if (existing.length > 0) {
            logger.info("Free Gift product already exists.")
            freeGiftId = existing[0].id
        } else {
            // Create the Free Gift Product
            const { result: products } = await createProductsWorkflow(container).run({
                input: {
                    products: [
                        {
                            title: "Money Potli (Free Gift)",
                            handle: "money-potli-free-gift",
                            status: ProductStatus.PUBLISHED,
                            shipping_profile_id: shippingProfileId,
                            sales_channels: salesChannelId ? [{ id: salesChannelId }] : undefined,
                            options: [{ title: "Default", values: ["Default"] }],
                            variants: [
                                {
                                    title: "Default",
                                    options: { Default: "Default" },
                                    prices: [{ amount: 0, currency_code: "inr" }],
                                    manage_inventory: false,
                                },
                            ],
                        },
                    ],
                }
            })

            freeGiftId = products[0].id
            logger.info(`Created free gift product: ${freeGiftId}`)
        }

        // Create a Buy 2 Get 1 Promotion
        /*
        logger.info("Creating Buy 2 Get 1 Promotion...")
        const { result: b2g1 } = await createPromotionsWorkflow(container).run({
            input: {
                promotionsData: [
                    {
                        code: "BUY-2-GET-1",
                        type: "buyget",
                        is_automatic: true,
                        status: "active",
                        application_method: {
                            type: "percentage",
                            target_type: "items",
                            value: 100, // 100% off 1 item
                            max_quantity: 1,
                            allocation: "each",
                            buy_rules_min_quantity: 2,
                            apply_to_quantity: 1,
                            buy_rules: [
                                {
                                    attribute: "id",
                                    operator: "ne",
                                    values: ["prod_no_exist"]
                                }
                            ],
                            target_rules: [
                                {
                                    attribute: "id",
                                    operator: "ne",
                                    values: ["prod_no_exist"]
                                }
                            ]
                        }
                    }
                ]
            }
        })
        */

        // Create Free Gift > 1500 promotion
        logger.info("Creating order > 1500 promotion...")
        // We'll create a standard promotion that applies to the cart if type is standard
        const { result: freeP } = await createPromotionsWorkflow(container).run({
            input: {
                promotionsData: [
                    {
                        code: "FREE-POTLI-OVER-1500",
                        type: "standard",
                        is_automatic: true,
                        status: "active",
                        application_method: {
                            type: "percentage",
                            target_type: "items",
                            value: 100,
                            allocation: "each",
                            max_quantity: 1,
                            target_rules: [
                                {
                                    attribute: "id",
                                    operator: "eq",
                                    values: [freeGiftId]
                                }
                            ]
                        },
                        rules: [
                            {
                                attribute: "cart_subtotal",
                                operator: "gte",
                                values: ["1500"]
                            }
                        ]
                    }
                ]
            }
        })

        logger.info("Promotions configured successfully.")
    } catch (error: any) {
        logger.error("Failed to seed promotions")
        logger.error(error.message)
        if (error.transaction) {
            logger.error(JSON.stringify(error.transaction, null, 2))
        }
    }
}
