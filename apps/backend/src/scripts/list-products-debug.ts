import { ExecArgs } from "@medusajs/framework/types";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";

export default async function listProductsDebug({ container }: ExecArgs) {
  const query = container.resolve(ContainerRegistrationKeys.QUERY);
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);

  // We need to provide the region_id to context so calculated_price is populated
  const { data: regions } = await query.graph({ entity: "region", fields: ["id"] });
  const regionId = regions[0]?.id;

  const { data: products } = await query.graph({
    entity: "product",
    fields: ["title", "handle", "variants.id", "variants.title", "variants.calculated_price"],
    context: {
        region_id: regionId
    }
  });

  logger.info(`Using region_id: ${regionId}`);
  logger.info(`Found ${products.length} products`);
  products.forEach(p => {
    logger.info(`Product: ${p.title} (${p.handle})`);
    p.variants?.forEach(v => {
      logger.info(`  Variant: ${v.title} - Price: ${JSON.stringify(v.calculated_price)}`);
    });
  });
}
