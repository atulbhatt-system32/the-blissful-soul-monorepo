import { ExecArgs } from "@medusajs/framework/types";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";
import { deleteProductsWorkflow } from "@medusajs/medusa/core-flows";

export default async function cleanCatalogue({ container }: ExecArgs) {
    const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
    const query = container.resolve(ContainerRegistrationKeys.QUERY);

    logger.info("Cleaning up placeholder products...");

    const { data: currentProducts } = await query.graph({
        entity: "product",
        fields: ["id", "handle"]
    });

    const placeholders = ["t-shirt", "sweatshirt", "sweatpants", "shorts"];
    const idsToDelete = currentProducts
        .filter(p => placeholders.includes(p.handle))
        .map(p => p.id);

    if (idsToDelete.length > 0) {
        logger.info(`Deleting ${idsToDelete.length} placeholder products...`);
        await deleteProductsWorkflow(container).run({
            input: { ids: idsToDelete }
        });
        logger.info("Placeholder products removed successfully.");
    } else {
        logger.info("No placeholder products found.");
    }
}
