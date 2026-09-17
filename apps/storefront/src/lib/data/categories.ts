"use server"

import { sdk } from "@lib/config"
import { HttpTypes } from "@medusajs/types"
import { getCacheOptions } from "./cookies"
import { getRegion } from "./regions"

export const listCategories = async (query?: Record<string, any>) => {
  const nextOpts = {
    ...(await getCacheOptions("categories")),
  }

  const limit = query?.limit || 100

  return sdk.client
    .fetch<{ product_categories: HttpTypes.StoreProductCategory[] }>(
      "/store/product-categories",
      {
        query: {
          fields:
            "*category_children, *products, *parent_category, *parent_category.parent_category",
          limit,
          ...query,
        },
        next: nextOpts,
        cache: "no-store",
      }
    )
    .then(({ product_categories }) => product_categories)
    .catch((err) => {
      console.warn("[Medusa SDK] Error listing categories:", err.message || err)
      return []
    })
}

export const getServiceCategories = async () => {
  const nextOpts = {
    ...(await getCacheOptions("categories")),
  }

  return sdk.client
    .fetch<{ product_categories: HttpTypes.StoreProductCategory[] }>(
      "/store/product-categories",
      {
        query: {
          fields:
            "*category_children, *category_children.product_category_images, *category_children.metadata",
          handle: "services",
          limit: 1,
        },
        next: nextOpts,
        cache: "no-store",
      }
    )
    .then(({ product_categories }) => {
      const children = product_categories[0]?.category_children ?? []
      return children.sort((a: any, b: any) => (a.rank ?? 0) - (b.rank ?? 0))
    })
    .catch((err) => {
      console.warn("[Medusa SDK] Error getting service categories:", err.message || err)
      return []
    })
}

/**
 * Shop-page category tiles: the children of the "Shop Collection" root.
 *
 * Mirrors getServiceCategories() — same shape, same image/metadata fields — so
 * the shop tiles can reuse whatever the services flip cards already rely on.
 */
export const getShopCategories = async () => {
  const nextOpts = {
    ...(await getCacheOptions("categories")),
  }

  return sdk.client
    .fetch<{ product_categories: HttpTypes.StoreProductCategory[] }>(
      "/store/product-categories",
      {
        query: {
          fields:
            "*category_children, *category_children.product_category_images, *category_children.metadata",
          handle: "shop-collection",
          limit: 1,
        },
        next: nextOpts,
        cache: "no-store",
      }
    )
    .then(({ product_categories }) => {
      const children = product_categories[0]?.category_children ?? []
      return children.sort((a: any, b: any) => (a.rank ?? 0) - (b.rank ?? 0))
    })
    .catch((err) => {
      console.warn(
        "[Medusa SDK] Error getting shop categories:",
        err.message || err
      )
      return []
    })
}

export const getServiceCategoryDetail = async (
  handle: string,
  countryCode: string
) => {
  const nextOpts = {
    ...(await getCacheOptions("categories")),
  }

  const category = await sdk.client
    .fetch<{ product_categories: any[] }>("/store/product-categories", {
      query: {
        fields: "*product_category_images",
        handle,
      },
      next: nextOpts,
      cache: "no-store",
    })
    .then(({ product_categories }) => product_categories[0] ?? null)

  if (!category) return null

  const region = await getRegion(countryCode)

  const products = await sdk.client
    .fetch<{ products: HttpTypes.StoreProduct[] }>("/store/products", {
      query: {
        category_id: [category.id],
        fields:
          "*variants,*variants.calculated_price,+tags,+metadata,+images",
        ...(region ? { region_id: region.id } : {}),
        limit: 20,
      },
      next: nextOpts,
      cache: "no-store",
    })
    .then(({ products }) => {
      const getMinPrice = (product: any) => {
        if (!product.variants || !product.variants.length) return Infinity;
        return Math.min(
          ...product.variants.map((v: any) => v.calculated_price?.calculated_amount ?? Infinity)
        );
      };

      return products.sort((a: any, b: any) => getMinPrice(a) - getMinPrice(b));
    })

  return { category, products, region }
}

export const getAllServicesGrouped = async (countryCode: string) => {
  const categories = await getServiceCategories()
  if (!categories.length) return []

  const region = await getRegion(countryCode)
  const nextOpts = { ...(await getCacheOptions("categories")) }

  const grouped = await Promise.all(
    categories.map(async (category) => {
      const { products } = await sdk.client.fetch<{
        products: HttpTypes.StoreProduct[]
      }>("/store/products", {
        query: {
          category_id: [category.id],
          fields: "*variants,*variants.calculated_price,+tags,+metadata,+images",
          ...(region ? { region_id: region.id } : {}),
          limit: 20,
        },
        next: nextOpts,
        cache: "no-store",
      }).then(({ products }) => {
        const getMinPrice = (product: any) => {
          if (!product.variants || !product.variants.length) return Infinity;
          return Math.min(
            ...product.variants.map((v: any) => v.calculated_price?.calculated_amount ?? Infinity)
          );
        };
  
        return {
          products: products.sort((a: any, b: any) => getMinPrice(a) - getMinPrice(b))
        };
      })
      return { category, products, region }
    })
  )

  return grouped.filter((g) => g.products.length > 0)
}

export const getCategoryByHandle = async (categoryHandle: string[]) => {
  const handle = `${categoryHandle.join("/")}`

  const next = {
    ...(await getCacheOptions("categories")),
  }

  return sdk.client
    .fetch<HttpTypes.StoreProductCategoryListResponse>(
      `/store/product-categories`,
      {
        query: {
          // category_children for the sub-category pills, parent_category (two
          // levels) for the breadcrumb. Deliberately not *products — the
          // product grid is fetched separately by category_id, so expanding
          // it here is both unused and an expensive/unstable join.
          fields: "*category_children, *parent_category, *parent_category.parent_category",
          handle,
        },
        next,
        // Every other fetcher in this file uses no-store; force-cache here
        // combined with getCacheOptions() reading cookies() is exactly what
        // triggers Next's DYNAMIC_SERVER_USAGE on this route (it has
        // generateStaticParams, so Next tries to reconcile a cacheable fetch
        // with per-request dynamic data and throws instead).
        cache: "no-store",
      }
    )
    .then(({ product_categories }) => product_categories[0] ?? null)
    .catch((err) => {
      console.warn("[Medusa SDK] Error getting category by handle:", err.message || err)
      return null
    })
}
