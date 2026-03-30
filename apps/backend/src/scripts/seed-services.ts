import { ExecArgs } from "@medusajs/framework/types";
import {
    ContainerRegistrationKeys,
    Modules,
    ProductStatus,
} from "@medusajs/framework/utils";
import {
    createProductCategoriesWorkflow,
    createProductsWorkflow,
} from "@medusajs/medusa/core-flows";

export default async function seedServices({ container }: ExecArgs) {
    const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
    const query = container.resolve(ContainerRegistrationKeys.QUERY);
    const fulfillmentModuleService = container.resolve(Modules.FULFILLMENT);

    logger.info("Seeding Services for The Blissful Soul...");

    // 1. Get Sales Channel
    const { data: salesChannels } = await query.graph({ entity: "sales_channel", fields: ["id"] });
    const salesChannelId = salesChannels[0]?.id;

    // 2. Ensuring Categories
    const { data: currentCategories } = await query.graph({ entity: "product_category", fields: ["id", "name"] });
    let serviceCat = currentCategories.find(c => c.name === "Services");

    if (!serviceCat) {
        await createProductCategoriesWorkflow(container).run({
            input: {
                product_categories: [
                    { name: "Services", is_active: true }
                ]
            }
        });
        const { data: updatedCategories } = await query.graph({ entity: "product_category", fields: ["id", "name"] });
        serviceCat = updatedCategories.find(c => c.name === "Services");
    }

    // 4. Products Data
    const productsData = [
        {
            title: "Audio Session",
            handle: "audio-session",
            category: "Services",
            price: 499,
            image: "https://theblissfulsoul.in/cdn/shop/files/tarot.jpg",
            is_service: true
        },
        {
            title: "Kundali Reading",
            handle: "kundali-reading",
            category: "Services",
            price: 999,
            image: "https://theblissfulsoul.in/cdn/shop/files/kundali.jpg",
            is_service: true
        }
    ];

    const sProfiles = await fulfillmentModuleService.listShippingProfiles();
    const shippingProfileId = sProfiles[0].id;

    for (const item of productsData) {
        // Check if already exists to avoid duplicate handles
        const { data: existing } = await query.graph({ entity: "product", fields: ["id", "handle"], filters: { handle: item.handle } });
        if (existing.length > 0) {
            logger.info(`Service ${item.title} already exists. Skipping.`);
            continue;
        }

        await createProductsWorkflow(container).run({
            input: {
                products: [
                    {
                        title: item.title,
                        handle: item.handle,
                        description: "Book an appointment for this session.",
                        status: ProductStatus.PUBLISHED,
                        shipping_profile_id: shippingProfileId,
                        category_ids: serviceCat ? [serviceCat.id] : [],
                        images: [{ url: item.image }],
                        thumbnail: item.image,
                        options: [{ title: "Duration", values: ["Tarot Reading ( 20 min )"] }],
                        variants: [
                            {
                                title: "Tarot Reading ( 20 min )",
                                prices: [
                                    { amount: item.price, currency_code: "inr" },
                                ],
                                options: { "Duration": "Tarot Reading ( 20 min )" },
                            },
                        ],
                        sales_channels: [{ id: salesChannelId }],
                        is_giftcard: false,
                        weight: 0,
                        metadata: {
                            is_service: true
                        }
                    },
                ],
            },
        });
        logger.info(`Restored: ${item.title}`);
    }
}
