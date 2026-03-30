import { ExecArgs } from "@medusajs/framework/types";
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils";

export default async function createRegion({ container }: ExecArgs) {
  const regionModuleService = container.resolve(Modules.REGION);
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);

  const regions = await regionModuleService.listRegions({ name: "India" });

  if (regions.length === 0) {
    const region = await regionModuleService.createRegions({
      name: "India",
      currency_code: "inr",
      countries: ["in"]
    });
    logger.info(`Created region: ${region.name}`);
  } else {
    logger.info("Region India already exists");
  }
}
