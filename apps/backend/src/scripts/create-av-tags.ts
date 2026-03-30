import { ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"

export default async function createSessionTags({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const productModuleService = container.resolve(Modules.PRODUCT)

  const tagsToCreate = ["audio", "video"]

  for (const tagValue of tagsToCreate) {
    logger.info(`Ensuring '${tagValue}' tag exists...`)
    try {
      const [existing] = await productModuleService.listProductTags({
        value: tagValue
      })

      if (existing) {
        logger.info(`Tag '${tagValue}' already exists with ID: ${existing.id}`)
      } else {
        const created = await productModuleService.createProductTags({
          value: tagValue
        })
        logger.info(`Created '${tagValue}' tag with ID: ${created.id}`)
      }
    } catch (error) {
      logger.error(`Failed to create ${tagValue} tag: ${error.message}`)
    }
  }
}
