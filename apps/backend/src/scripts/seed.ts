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

export default async function seedDemoData({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const query = container.resolve(ContainerRegistrationKeys.QUERY);
  const fulfillmentModuleService = container.resolve(Modules.FULFILLMENT);

  logger.info("Restoring catalogue for The Blissful Soul...");

  // 1. Get Sales Channel
  const { data: salesChannels } = await query.graph({ entity: "sales_channel", fields: ["id"] });
  const salesChannelId = salesChannels[0]?.id;

  // 2. Fetch Collections
  const { data: finalCollections } = await query.graph({ entity: "product_collection", fields: ["id", "handle"] });

  // 3. Ensuring Categories
  const { data: currentCategories } = await query.graph({ entity: "product_category", fields: ["id", "name"] });

  // 4. Products Data
  const productsData = [
    {
      title: "Pyrite - MONEY KEYCHAIN (Assorted)",
      handle: "pyrite-money-keychain",
      category: "Other",
      price: 299,
      image: "https://theblissfulsoul.in/cdn/shop/files/pyrite-keychain.jpg",
      collection: "hot-seller"
    },
    {
      title: "MONEY PYRAMID",
      handle: "money-pyramid",
      category: "Pyramids",
      price: 899,
      image: "https://theblissfulsoul.in/cdn/shop/files/money-pyramid.jpg",
      collection: "hot-seller"
    },
    {
      title: "Amethyst Natural Bracelet",
      handle: "amethyst-natural-bracelet",
      category: "Bracelets",
      price: 999,
      image: "https://theblissfulsoul.in/cdn/shop/files/amethyst-bracelet.jpg",
      collection: "healing-crystals"
    },
    {
      title: "Rose Quartz Natural Bracelet",
      handle: "rose-quartz-natural-bracelet",
      category: "Bracelets",
      price: 899,
      image: "https://theblissfulsoul.in/cdn/shop/files/rose-quartz-bracelet.jpg",
      collection: "healing-crystals"
    },
    {
      title: "Money Magnet Bracelet",
      handle: "money-magnet-bracelet",
      category: "Bracelets",
      price: 999,
      image: "https://theblissfulsoul.in/cdn/shop/files/money-magnet.jpg",
      collection: "hot-seller"
    },
    {
      title: "Crystal Charger - Selenite Plate",
      handle: "selenite-charging-plate",
      category: "Other",
      price: 699,
      image: "https://theblissfulsoul.in/cdn/shop/files/selenite-plate.jpg",
      collection: "healing-crystals"
    }
  ];

  const sProfiles = await fulfillmentModuleService.listShippingProfiles();
  const shippingProfileId = sProfiles[0].id;

  const ts = Date.now();

  for (const item of productsData) {
    const cat = currentCategories.find(c => c.name === item.category);
    const coll = finalCollections.find(c => c.handle === item.collection);

    await createProductsWorkflow(container).run({
      input: {
        products: [
          {
            title: item.title,
            handle: item.handle,
            status: ProductStatus.PUBLISHED,
            shipping_profile_id: shippingProfileId,
            category_ids: cat ? [cat.id] : [],
            collection_id: coll ? coll.id : null,
            images: [{ url: item.image }],
            thumbnail: item.image,
            options: [{ title: "Title", values: ["Default"] }],
            variants: [
              {
                title: "Standard",
                // No SKU to avoid inventory issues if they're stuck in DB
                prices: [
                  { amount: item.price, currency_code: "inr" },
                ],
                options: { "Title": "Default" },
              },
            ],
            sales_channels: [{ id: salesChannelId }],
          },
        ],
      },
    });
    logger.info(`Restored: ${item.title}`);
  }
}
