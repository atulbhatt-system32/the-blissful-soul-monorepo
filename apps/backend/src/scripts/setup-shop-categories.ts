import { ExecArgs } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"

/**
 * Builds the "Shop Collection" category tree shown as tiles at the top of the
 * shop page, and files the existing products into it.
 *
 * Tags are flat, so they cannot express Shop Collection > Categories >
 * Crystal Bracelets, and the /categories/[...category] route has nothing to
 * resolve. This creates real categories and assigns products to them.
 *
 * This sets up the client's initial layout; day to day the categories are
 * managed in the Medusa admin:
 *
 *   - order        the category's rank (drag to reorder under Shop Collection)
 *   - coming soon  metadata `coming_soon` = `true`; remove it or set `false`
 *                  to launch — the tile becomes clickable
 *   - products     assigned on the product or category page
 *   - image        the first image uploaded to the category
 *
 * Re-running resets names and order to CATEGORIES below and picks up newly
 * tagged products without duplicating anything. It never touches
 * `coming_soon` on a category that already exists, so a launch made in the
 * admin cannot be undone by a re-run. Categories under Shop Collection that are
 * not listed here are left exactly as they are.
 *
 *   DRY_RUN=1 npx medusa exec ./src/scripts/setup-shop-categories.ts
 *   npx medusa exec ./src/scripts/setup-shop-categories.ts
 */

const ROOT = { name: "Shop Collection", handle: "shop-collection" }

type CategoryDef = {
  name: string
  /** The URL — /categories/<handle>. Keep stable once live. */
  handle: string
  /** Products to file in: everything carrying this tag… */
  tag?: string
  /** …or these specific products, for groups that share no tag. */
  productHandles?: string[]
  /** Only applied when the category is first created. */
  comingSoon?: boolean
}

/** In display order — the client's list, Zodiac first as it is launching. */
const CATEGORIES: CategoryDef[] = [
  { name: "ZODIAC BRACELETS", handle: "zodiac-bracelets", comingSoon: true },
  { name: "CRYSTAL BRACELETS", handle: "crystal-bracelets", tag: "bracelet" },
  { name: "CRYSTAL LOCKETS", handle: "crystal-lockets", tag: "lockets" },
  {
    name: "SALTS & DHOOP",
    handle: "salts-and-dhoop",
    productHandles: ["love-sea-salt", "money-sea-salt", "in0012", "in0032"],
  },
  { name: "MIXELS", handle: "mixels", comingSoon: true },
  { name: "PERFUME / ATTAR", handle: "perfume-attar", comingSoon: true },
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

  // 2. Child categories
  for (const [index, def] of CATEGORIES.entries()) {
    // Pull current categories too: several of these products already sit in
    // the Intentions tree that powers "Shop by Intent", and category_ids
    // replaces rather than appends, so they have to be merged.
    const products =
      def.tag || def.productHandles?.length
        ? await productModule.listProducts(
            (def.tag
              ? { tags: { value: [def.tag] } }
              : { handle: def.productHandles }) as any,
            { select: ["id", "title", "handle"], relations: ["categories"] }
          )
        : []

    const source = def.tag
      ? `tag "${def.tag}"`
      : def.productHandles?.length
        ? "listed products"
        : "no products yet"

    // A listed handle that matched nothing is almost always a typo or a
    // product renamed in the admin; say so rather than silently filing fewer.
    const missing = (def.productHandles ?? []).filter(
      (h) => !(products as any[]).some((p) => p.handle === h)
    )

    if (missing.length) {
      logger.warn(
        `[Shop Categories] "${def.name}": no product with handle ${missing.join(", ")}`
      )
    }

    const [existing] = await productModule.listProductCategories({
      handle: def.handle,
    })

    if (dryRun) {
      logger.info(
        `[Shop Categories] (dry run) ${existing ? "update" : "create"} ` +
          `#${index + 1} "${def.name}" (/${def.handle}) — ${products.length} product(s) from ${source}` +
          (!existing && def.comingSoon ? " — coming soon" : "")
      )
      continue
    }

    let category = existing

    if (category) {
      // coming_soon is deliberately not written here: once a category exists,
      // launching it is the admin's decision and a re-run must not revert it.
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
        // A string, not a boolean, to match what the admin's metadata editor
        // saves; the storefront accepts either.
        metadata: def.comingSoon ? { coming_soon: "true" } : undefined,
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
      `[Shop Categories] #${index + 1} "${def.name}" (/${def.handle}) — ` +
        `${products.length} from ${source}, ${assigned} newly assigned`
    )
  }

  if (!dryRun) {
    logger.info(
      `[Shop Categories] Done. Manage order, coming soon, products and images ` +
        `in the Medusa admin from here.`
    )
  }
}
