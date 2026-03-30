import { ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"

export default async function createSessionTag({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const productModuleService = container.resolve(Modules.PRODUCT)

  logger.info("Ensuring 'session' tag exists...")

  try {
    const [existing] = await productModuleService.listProductTags({
      value: "session"
    })

    if (existing) {
      logger.info(`Tag 'session' already exists with ID: ${existing.id}`)
    } else {
      const created = await productModuleService.createProductTags({
        value: "session"
      })
      logger.info(`Created 'session' tag with ID: ${created.id}`)
    }
  } catch (error) {
    logger.error(`Failed to create session tag: ${error.message}`)
  }
}
