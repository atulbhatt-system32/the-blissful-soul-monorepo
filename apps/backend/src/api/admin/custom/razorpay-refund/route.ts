import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { Modules } from "@medusajs/framework/utils"
import * as crypto from "crypto"

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const { order_id, amount } = req.body as { order_id: string; amount: number }

  if (!order_id || !amount || amount <= 0) {
    return res.status(400).json({ message: "order_id and a positive amount are required" })
  }

  const razorpayKeyId = process.env.RAZORPAY_ID
  const razorpaySecret = process.env.RAZORPAY_SECRET

  if (!razorpayKeyId || !razorpaySecret) {
    return res.status(500).json({ message: "Razorpay credentials not configured" })
  }

  try {
    const orderModuleService = req.scope.resolve(Modules.ORDER) as any
    const [orders] = await orderModuleService.listAndCountOrders(
      { id: order_id },
      { select: ["id", "display_id", "metadata"] }
    )

    const order = orders?.[0]
    if (!order) {
      return res.status(404).json({ message: `Order ${order_id} not found` })
    }

    const razorpayPaymentId = order.metadata?.razorpay_id as string | undefined
    if (!razorpayPaymentId) {
      return res.status(400).json({ message: "No Razorpay payment ID found on this order. Only orders created via UPI/Razorpay webhook can be refunded here." })
    }

    // Amount comes in as rupees from the widget — convert to paise
    const amountPaise = Math.round(amount * 100)

    console.log(`[Razorpay Refund] Initiating refund of ₹${amount} (${amountPaise} paise) for order #${order.display_id} | payment: ${razorpayPaymentId}`)

    const authHeader = "Basic " + Buffer.from(`${razorpayKeyId}:${razorpaySecret}`).toString("base64")

    const response = await fetch(`https://api.razorpay.com/v1/payments/${razorpayPaymentId}/refund`, {
      method: "POST",
      headers: {
        "Authorization": authHeader,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ amount: amountPaise }),
    })

    const result = await response.json() as any

    if (!response.ok) {
      console.error(`[Razorpay Refund] Failed for order #${order.display_id}:`, result)
      return res.status(400).json({
        message: result?.error?.description || "Razorpay refund failed",
        razorpay_error: result?.error,
      })
    }

    console.log(`[Razorpay Refund] Success for order #${order.display_id} — refund ID: ${result.id}`)

    // Mark the refund on the order metadata
    await orderModuleService.updateOrders([{
      id: order.id,
      metadata: {
        ...order.metadata,
        razorpay_refund_id: result.id,
        razorpay_refunded_amount: amount,
        razorpay_refunded_at: new Date().toISOString(),
      }
    }])

    return res.status(200).json({
      success: true,
      refund_id: result.id,
      amount: amount,
      status: result.status,
    })

  } catch (error: any) {
    console.error("[Razorpay Refund] Error:", error.message)
    return res.status(500).json({ message: error.message })
  }
}
