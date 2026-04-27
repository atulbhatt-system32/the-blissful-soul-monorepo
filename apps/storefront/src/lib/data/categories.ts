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
      return products.sort((a: any, b: any) => {
        const rankA = a.metadata?.[`rank_${handle}`]
        const rankB = b.metadata?.[`rank_${handle}`]
        
        if (rankA !== undefined && rankB !== undefined) return Number(rankA) - Number(rankB)
        if (rankA !== undefined) return -1
        if (rankB !== undefined) return 1
        return 0
      })
    })

  return { category, products, region }
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
          fields: "*category_children, *products",
          handle,
        },
        next,
        cache: "force-cache",
      }
    )
    .then(({ product_categories }) => product_categories[0])
}
