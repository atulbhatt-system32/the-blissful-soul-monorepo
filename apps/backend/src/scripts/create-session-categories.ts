import { ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"

export default async function createSessionCategories({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const productModuleService = container.resolve(Modules.PRODUCT)

  logger.info("Creating session category hierarchy...")

  try {
    // 1. Check if parent 'Sessions' category exists
    const existing = await productModuleService.listProductCategories({
      handle: "sessions"
    })

    let parentId: string

    if (existing.length > 0) {
      parentId = existing[0].id
      logger.info(`Parent 'Sessions' category already exists: ${parentId}`)
    } else {
      const parent = await productModuleService.createProductCategories({
        name: "Sessions",
        handle: "sessions",
        is_active: true,
        is_internal: false,
      })
      parentId = parent.id
      logger.info(`Created parent 'Sessions' category: ${parentId}`)
    }

    // 2. Create child categories
    const children = [
      { name: "Audio Sessions", handle: "audio-sessions" },
      { name: "Video Sessions", handle: "video-sessions" },
      { name: "Tarot Services", handle: "tarot-services" },
    ]

    for (const child of children) {
      const existingChild = await productModuleService.listProductCategories({
        handle: child.handle
      })

      if (existingChild.length > 0) {
        logger.info(`Child '${child.name}' already exists: ${existingChild[0].id}`)
      } else {
        const created = await productModuleService.createProductCategories({
          name: child.name,
          handle: child.handle,
          parent_category_id: parentId,
          is_active: true,
          is_internal: false,
        })
        logger.info(`Created child '${child.name}': ${created.id}`)
      }
    }

    // 3. Verify all categories
    const allCats = await productModuleService.listProductCategories({
      handle: ["sessions", "audio-sessions", "video-sessions", "tarot-services"]
    })
    logger.info("Final category list:")
    allCats.forEach(c => {
      logger.info(`  - ${c.name} | handle: ${c.handle} | id: ${c.id} | parent: ${c.parent_category_id || "none"}`)
    })

    logger.info("Done! Categories are ready.")

  } catch (error: any) {
    logger.error(`Failed: ${error.message}`)
  }
}
