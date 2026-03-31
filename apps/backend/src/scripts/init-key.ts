import { ExecArgs } from "@medusajs/framework/types";
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils";

export default async function initKey({ container }: ExecArgs) {
  const apiKeyModuleService = container.resolve(Modules.API_KEY);
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const query = container.resolve(ContainerRegistrationKeys.QUERY);

  const { data: channels } = await query.graph({ entity: "sales_channel", fields: ["id"] });
  let channelId = channels[0]?.id;

  if (!channelId) {
     // Create a default sales channel if none exists
     const scModuleService = container.resolve(Modules.SALES_CHANNEL);
     const sc = await scModuleService.createSalesChannels({
       name: "Default Sales Channel",
       description: "Created by init script"
     });
     channelId = sc.id;
  }

  const keys = await apiKeyModuleService.listApiKeys({ type: ["publishable"] });
  if (keys.length > 0) {
     logger.info(`Existing key found: ${keys[0].token}`);
     console.log(`__KEY__${keys[0].token}__KEY__`);
  } else {
     const key = await apiKeyModuleService.createApiKeys({
       title: "Storefront Key",
       type: "publishable",
       created_by: "system"
     });
     
     const remoteLink = container.resolve(ContainerRegistrationKeys.REMOTE_LINK);
     await remoteLink.create({
        [Modules.API_KEY]: { api_key_id: key.id },
        [Modules.SALES_CHANNEL]: { sales_channel_id: channelId }
     });

     logger.info(`Created new key`);
     console.log(`__KEY__${key.token}__KEY__`);
  }
}
