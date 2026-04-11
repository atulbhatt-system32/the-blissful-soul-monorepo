"use server"

import { sdk } from "@lib/config"
import { sortProducts } from "@lib/util/sort-products"
import { HttpTypes } from "@medusajs/types"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import { getAuthHeaders, getCacheOptions } from "./cookies"
import { getRegion, retrieveRegion } from "./regions"

export const listProducts = async ({
  pageParam = 1,
  queryParams,
  countryCode,
  regionId,
}: {
  pageParam?: number
  queryParams?: HttpTypes.FindParams & HttpTypes.StoreProductListParams
  countryCode?: string
  regionId?: string
}): Promise<{
  response: { products: HttpTypes.StoreProduct[]; count: number }
  nextPage: number | null
  queryParams?: HttpTypes.FindParams & HttpTypes.StoreProductListParams
}> => {
  if (!countryCode && !regionId) {
    throw new Error("Country code or region ID is required")
  }

  const limit = queryParams?.limit || 12
  const _pageParam = Math.max(pageParam, 1)
  const offset = _pageParam === 1 ? 0 : (_pageParam - 1) * limit

  let region: HttpTypes.StoreRegion | undefined | null

  if (countryCode) {
    region = await getRegion(countryCode)
  } else {
    region = await retrieveRegion(regionId!)
  }

  if (!region) {
    return {
      response: { products: [], count: 0 },
      nextPage: null,
    }
  }

  const headers = {
    ...(await getAuthHeaders()),
  }

  const next = {
    ...(await getCacheOptions("products")),
  }

  return sdk.client
    .fetch<{ products: HttpTypes.StoreProduct[]; count: number }>(
      `/store/products`,
      {
        method: "GET",
        query: {
          limit,
          offset,
          region_id: region?.id,
          fields:
            "*variants.calculated_price,+variants.inventory_quantity,*variants.images,+metadata,+tags,",
          ...queryParams,
        },
        headers,
        next,
        cache: "no-store",
      }
    )
    .then(({ products, count }) => {
      const nextPage = count > offset + limit ? pageParam + 1 : null

      // Filter out products tagged as 'free-gift' or 'hidden' OR marked in metadata
      const filteredProducts = products.filter(p => {
        const isExcludedTag = p.tags?.some(t => {
          const val = t.value.toLowerCase()
          return val === "free-gift" || val === "hidden"
        })
        const isHiddenMetadata = p.metadata?.hidden === "true" || p.metadata?.hidden === true
        const isFreeGiftMetadata = p.metadata?.is_free_gift === "true" || p.metadata?.is_free_gift === true

        return !isExcludedTag && !isHiddenMetadata && !isFreeGiftMetadata
      })

      return {
        response: {
          products: filteredProducts,
          count: count - (products.length - filteredProducts.length),
        },
        nextPage: nextPage,
        queryParams,
      }
    })
}

/**
 * This will fetch 100 products to the Next.js cache and sort them based on the sortBy parameter.
 * It will then return the paginated products based on the page and limit parameters.
 */
export const listProductsWithSort = async ({
  page = 0,
  queryParams,
  sortBy = "created_at",
  countryCode,
}: {
  page?: number
  queryParams?: HttpTypes.FindParams & HttpTypes.StoreProductParams
  sortBy?: SortOptions
  countryCode: string
}): Promise<{
  response: { products: HttpTypes.StoreProduct[]; count: number }
  nextPage: number | null
  queryParams?: HttpTypes.FindParams & HttpTypes.StoreProductParams
}> => {
  const limit = queryParams?.limit || 12

  const {
    response: { products, count },
  } = await listProducts({
    pageParam: 0,
    queryParams: {
      ...queryParams,
      limit: 100,
    },
    countryCode,
  })

  const sortedProducts = sortProducts(products, sortBy)

  // Further exclude 'session' products from general store views (if they aren't already tagged 'hidden')
  const excludeCategoryHandles = ["sessions", "audio-sessions", "video-sessions", "top-services"]

  const finalFilteredProducts = sortedProducts.filter(
    (p) => 
      !p.tags?.some((t: any) => t.value === "session") &&
      !p.categories?.some((c: any) => excludeCategoryHandles.includes(c.handle))
  )

  const pageParam = (page - 1) * limit

  // Recalculate count and pagination based on the filtered list
  const newCount = finalFilteredProducts.length
  const nextPage = newCount > pageParam + limit ? pageParam + limit : null

  const paginatedProducts = finalFilteredProducts.slice(pageParam, pageParam + limit)

  return {
    response: {
      products: paginatedProducts,
      count: newCount,
    },
    nextPage,
    queryParams,
  }
}
