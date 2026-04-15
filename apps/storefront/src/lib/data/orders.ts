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
          "*payment_collections.payments,*items,+items.thumbnail,*items.adjustments,*items.metadata,*items.variant,*items.variant.product,+items.variant.product.thumbnail,*items.variant.product.images",
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
        fields: "+email,*items,+items.thumbnail,*items.adjustments,+items.metadata,*items.variant,*items.variant.product,+items.variant.product.thumbnail,*items.variant.product.images",
        ...filters,
      },
      headers,
      next,
      cache: "force-cache",
    })
    .then(({ orders }) => {
      return orders.filter((order: any) => {
        const isSessionOrder = order.metadata?.is_session === true || 
          order.items?.some((item: any) => {
          const product = item.variant?.product
          return (
            item.metadata?.booking_date || 
            item.title?.toLowerCase().includes("session booking") ||
            product?.type?.value === "session" || 
            product?.tags?.some((t: any) => t.value === "session") ||
            product?.metadata?.is_service === true ||
            product?.metadata?.is_service === "true" ||
            product?.categories?.some((c: any) => c.handle?.includes("session"))
          )
        }) || order.metadata?.type === "session" || order.metadata?.booking_id;

        return !isSessionOrder;
      });
    })
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
          "*,*items,*items.variant,*items.variant.product,*items.variant.product.thumbnail,*items.variant.product.images,*payment_collections.payments,*shipping_methods,*shipping_address,+metadata,+subtotal,+total,+shipping_total,+tax_total,+discount_total,+item_subtotal,+shipping_subtotal,+items.total,+items.original_total,+items.subtotal,+items.unit_price",
      },
      headers,
    })
    .then(async ({ order }) => {
      // Step 2: Since the /lookup endpoint might have limited expansion capabilities,
      // we use the retrieved ID to fetch the full order details using the standard 
      // retrieve endpoint which we know supports full field expansion (thumbnails, etc.)
      let finalOrder = order
      try {
        const fullOrder = await retrieveOrder(order.id)
        if (fullOrder) {
          finalOrder = fullOrder
        }
      } catch (e) {
        console.error("[lookupOrder] Fallback retrieval failed:", e)
      }

      // Check if this is a session booking instead of a product order
      const isSessionOrder = finalOrder.metadata?.is_session === true || 
        finalOrder.items?.some((item: any) => {
          const product = item.variant?.product
          return (
            item.metadata?.booking_id || 
            item.title?.toLowerCase().includes("session") ||
            product?.type?.value === "session" || 
            product?.metadata?.is_service === true ||
            product?.metadata?.is_service === "true"
          )
        })

      if (isSessionOrder) {
        return {
          success: false,
          error: "This is a Session ID, not a physical Order ID. Tracking is only available for product shipments. Please check 'My Sessions' in your account to manage your bookings.",
          order: null,
        }
      }

      return {
        success: true,
        order: finalOrder,
        error: null,
      }
    })
    .catch((err) => {
      console.error("Order lookup error:", err)
      return { success: false, error: "Order not found", order: null }
    })
}
