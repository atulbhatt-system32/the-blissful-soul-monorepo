import { ExecArgs } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"

/**
 * Builds the "Shop Collection" category tree for physical crystals and files
 * the existing products into it.
 *
 * The catalog already groups these products with tags ("bracelet", "lockets",
 * …) but tags are flat, so they cannot express Shop Collection > Categories >
 * Crystal Bracelets, and the /categories/[...category] route has nothing to
 * resolve. This creates real categories and assigns products from the tag they
 * already carry, so nothing has to be re-tagged by hand.
 *
 * Idempotent: re-running updates names and picks up newly tagged products
 * without duplicating anything.
 *
 *   npx medusa exec ./src/scripts/setup-shop-categories.ts
 *   DRY_RUN=1 npx medusa exec ./src/scripts/setup-shop-categories.ts
 */

const ROOT = { name: "Shop Collection", handle: "shop-collection" }

/**
 * Display names are placeholders pending the client's final list — change
 * `name` here and re-run; `handle` is the URL and `tag` is the existing product
 * tag it pulls from, so those should stay put.
 */
const CATEGORIES = [
  { name: "CRYSTAL BRACELETS", handle: "crystal-bracelets", tag: "bracelet" },
  { name: "CRYSTAL LOCKETS", handle: "crystal-lockets", tag: "lockets" },
  { name: "CRYSTAL PYRAMIDS", handle: "crystal-pyramids", tag: "pyramids" },
  { name: "CRYSTAL TUMBLES", handle: "crystal-tumbles", tag: "tumbles" },
  { name: "CRYSTAL KEYCHAINS", handle: "crystal-keychains", tag: "keychain" },
]

export default async function setupShopCategories({ container }: ExecArgs) {
  const logger = container.resolve("logger")
  const productModule = container.resolve(Modules.PRODUCT)

  const dryRun = process.env.DRY_RUN === "1"

  // 1. Root category
  const [existingRoot] = await productModule.listProductCategories({
    handle: ROOT.handle,
  })

  let root = existingRoot

  if (!root) {
    if (dryRun) {
      logger.info(`[Shop Categories] (dry run) would create root "${ROOT.name}"`)
      logger.info(
        `[Shop Categories] (dry run) the categories below would be created under it:`
      )
    } else {
      root = await productModule.createProductCategories({
        name: ROOT.name,
        handle: ROOT.handle,
        is_active: true,
      })
      logger.info(`[Shop Categories] Created root "${ROOT.name}" (${root.id})`)
    }
  }

  // 2. Child categories, one per existing tag
  for (const [index, def] of CATEGORIES.entries()) {
    // Pull current categories too: several of these products already sit in
    // the Intentions tree that powers "Shop by Intent", and category_ids
    // replaces rather than appends, so they have to be merged.
    const products = await productModule.listProducts(
      { tags: { value: [def.tag] } } as any,
      { select: ["id", "title"], relations: ["categories"] }
    )

    const [existing] = await productModule.listProductCategories({
      handle: def.handle,
    })

    if (dryRun) {
      logger.info(
        `[Shop Categories] (dry run) ${existing ? "update" : "create"} ` +
          `"${def.name}" (/${def.handle}) — ${products.length} product(s) from tag "${def.tag}"`
      )
      continue
    }

    let category = existing

    if (category) {
      await productModule.updateProductCategories(category.id, {
        name: def.name,
        rank: index,
        is_active: true,
      })
    } else {
      category = await productModule.createProductCategories({
        name: def.name,
        handle: def.handle,
        is_active: true,
        rank: index,
        parent_category_id: root!.id,
      })
    }

    let assigned = 0

    for (const product of products as any[]) {
      const current: string[] = (product.categories ?? []).map((c: any) => c.id)

      if (current.includes(category!.id)) {
        continue
      }

      await productModule.updateProducts(product.id, {
        category_ids: [...current, category!.id],
      } as any)

      assigned++
    }

    logger.info(
      `[Shop Categories] "${def.name}" (/${def.handle}) — ` +
        `${products.length} tagged, ${assigned} newly assigned`
    )
  }

  if (!dryRun) {
    logger.info(
      `[Shop Categories] Done. Tiles resolve to /categories/<handle>; ` +
        `rename in CATEGORIES and re-run to change display names.`
    )
  }
}
