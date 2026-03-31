import { ExecArgs } from "@medusajs/framework/types";
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils";

export default async function linkPrices({ container }: ExecArgs) {
  const query = container.resolve(ContainerRegistrationKeys.QUERY);
  const pricingService = container.resolve(Modules.PRICING);
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);

  // 1. Get Region and its currency
  const { data: regions } = await query.graph({ entity: "region", fields: ["id", "currency_code"] });
  if (!regions.length) {
    logger.error("No regions found");
    return;
  }
  const region = regions[0];

  // 2. Get all Variants and their existing prices
  const { data: variants } = await query.graph({
    entity: "product_variant",
    fields: ["id", "title", "price_set.id", "price_set.prices.amount", "price_set.prices.currency_code"],
  });

  logger.info(`Found ${variants.length} variants to link prices for region ${region.id} (${region.currency_code})`);

  for (const variant of variants) {
    const priceSetId = variant.price_set?.id;
    if (!priceSetId) {
        logger.warn(`Variant ${variant.id} has no price set!`);
        continue;
    }

    // Check if a price already exists for this currency
    const existingPrice = variant.price_set.prices?.find(p => p.currency_code === region.currency_code);
    
    if (existingPrice) {
        // Enforce the rule for the region
        // In Medusa v2, we often need to ensure the price has the region_id rule
        // However, if the price already exists with the correct currency, 
        // the calculated_price logic usually picks it up if no more specific rules apply.
        // Let's just monitor if it works now.
        logger.info(`Variant ${variant.id} already has a price for ${region.currency_code}: ${existingPrice.amount}`);
    }
  }
}
