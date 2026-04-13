"use server"

import { sdk } from "@lib/config"
import medusaError from "@lib/util/medusa-error"
import { getAuthHeaders, getCacheOptions } from "./cookies"
import { HttpTypes } from "@medusajs/types"

export const retrieveOrder = async (id: string) => {
  const headers = {
    ...(await getAuthHeaders()),
  }

  const next = {
    ...(await getCacheOptions("orders")),
  }

  return sdk.client
    .fetch<HttpTypes.StoreOrderResponse>(`/store/orders/${id}`, {
      method: "GET",
      query: {
        fields:
          "*payment_collections.payments,*items,*items.adjustments,*items.metadata,*items.variant,*items.variant.product,*items.variant.product.images",
      },
      headers,
      next,
      cache: "force-cache",
    })
    .then(({ order }) => order)
    .catch((err) => medusaError(err))
}

export const listOrders = async (
  limit: number = 10,
  offset: number = 0,
  filters?: Record<string, any>
) => {
  const headers = {
    ...(await getAuthHeaders()),
  }

  const next = {
    ...(await getCacheOptions("orders")),
  }

  return sdk.client
    .fetch<HttpTypes.StoreOrderListResponse>(`/store/orders`, {
      method: "GET",
      query: {
        limit,
        offset,
        order: "-created_at",
        fields: "*items,*items.adjustments,+items.metadata,*items.variant,*items.variant.product,*items.variant.product.images",
        ...filters,
      },
      headers,
      next,
      cache: "force-cache",
    })
    .then(({ orders }) => orders)
    .catch((err) => medusaError(err))
}

export const createTransferRequest = async (
  state: {
    success: boolean
    error: string | null
    order: HttpTypes.StoreOrder | null
  },
  formData: FormData
): Promise<{
  success: boolean
  error: string | null
  order: HttpTypes.StoreOrder | null
}> => {
  const id = formData.get("order_id") as string

  if (!id) {
    return { success: false, error: "Order ID is required", order: null }
  }

  const headers = await getAuthHeaders()

  return await sdk.store.order
    .requestTransfer(
      id,
      {},
      {
        fields: "id, email",
      },
      headers
    )
    .then(({ order }) => ({ success: true, error: null, order }))
    .catch((err) => ({ success: false, error: err.message, order: null }))
}

export const acceptTransferRequest = async (id: string, token: string) => {
  const headers = await getAuthHeaders()

  return await sdk.store.order
    .acceptTransfer(id, { token }, {}, headers)
    .then(({ order }) => ({ success: true, error: null, order }))
    .catch((err) => ({ success: false, error: err.message, order: null }))
}

export const declineTransferRequest = async (id: string, token: string) => {
  const headers = await getAuthHeaders()

  return await sdk.store.order
    .declineTransfer(id, { token }, {}, headers)
    .then(({ order }) => ({ success: true, error: null, order }))
    .catch((err) => ({ success: false, error: err.message, order: null }))
}
export const lookupOrder = async (
  state: {
    success: boolean
    error: string | null
    order: HttpTypes.StoreOrder | null
  },
  formData: FormData
): Promise<{
  success: boolean
  error: string | null
  order: HttpTypes.StoreOrder | null
}> => {
  const displayIdString = (formData.get("display_id") as string).replace("#", "").trim()
  const email = (formData.get("email") as string).trim()

  if (!displayIdString || !email) {
    return {
      success: false,
      error: "Order ID and Email are required",
      order: null,
    }
  }

  const displayId = parseInt(displayIdString)
  if (isNaN(displayId)) {
    return {
      success: false,
      error: "Invalid Order ID format",
      order: null,
    }
  }

  const headers = await getAuthHeaders()

  return await sdk.client
    .fetch<{ order: any }>(`/store/orders/lookup`, {
      method: "POST",
      body: {
        display_id: displayId,
        email,
      },
      query: {
        fields:
          "*payment_collections.payments,*items,*items.adjustments,*items.metadata,*items.variant,*items.variant.product,*items.variant.product.images,*shipping_methods,*shipping_address,+subtotal,+total,+shipping_total,+tax_total,+discount_total,+item_subtotal,+shipping_subtotal,+items.total,+items.original_total,+items.subtotal,+items.unit_price",
      },
      headers,
    })
    .then(({ order }) => {
      const allSessions = order.items?.every((item: any) => {
        const product = item.variant?.product
        return (
          product?.type?.value === "session" || 
          product?.tags?.some((t: any) => t.value === "session") ||
          product?.metadata?.is_service === true ||
          product?.metadata?.is_service === "true"
        )
      })

      if (allSessions && order.items?.length > 0) {
        return { 
          success: false, 
          error: "Tracking is only available for physical products. For sessions, please check your account.", 
          order: null 
        }
      }

      return { success: true, error: null, order }
    })
    .catch((err) => {
      console.error("Order lookup error:", err)
      return { success: false, error: "Order not found", order: null }
    })
}
