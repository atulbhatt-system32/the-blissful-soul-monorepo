import { ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"

export default async function createSessionsCategory({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const productModuleService = container.resolve(Modules.PRODUCT)

  logger.info("Ensuring 'Sessions' category exists...")

  try {
    const [existing] = await productModuleService.listProductCategories({
      name: "Sessions"
    })

    if (existing) {
      logger.info(`Category 'Sessions' already exists with ID: ${existing.id}`)
    } else {
      const created = await productModuleService.createProductCategories({
        name: "Sessions",
        handle: "sessions",
        is_active: true,
        is_internal: false
      })
      logger.info(`Created 'Sessions' category with ID: ${created.id}`)
    }
  } catch (error) {
    logger.error(`Failed to create category: ${error.message}`)
  }
}
