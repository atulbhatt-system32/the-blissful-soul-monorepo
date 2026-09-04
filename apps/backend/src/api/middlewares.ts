import { MiddlewaresConfig } from "@medusajs/medusa"
import express from "express"
import path from "path"
import fs from "fs"

function deleteAfterDownload(req: any, res: any, next: any) {
  if (!req.path.endsWith(".csv")) return next()

  const filePath = path.resolve(process.cwd(), req.path.replace(/^\//, ""))
  if (!fs.existsSync(filePath)) return next()

  res.on("finish", () => {
    if (res.statusCode === 200) {
      fs.unlink(filePath, (err) => {
        if (err) console.error("[Auto-delete] Failed to delete", filePath, err.message)
        else console.log("[Auto-delete] Deleted after download:", filePath)
      })
    }
  })
  next()
}

type RateWindow = { count: number; resetAt: number }

const rateBuckets = new Map<string, RateWindow>()

/**
 * Fixed-window rate limiter for the unauthenticated auth routes, which would
 * otherwise allow unbounded password guessing and account enumeration.
 *
 * State is per-process and in-memory: with multiple Medusa workers the
 * effective limit is `max` per worker. That is enough to stop scripted abuse;
 * move the counters to Redis if a hard global limit is ever needed.
 */
function rateLimit({ windowMs, max }: { windowMs: number; max: number }) {
  return (req: any, res: any, next: any) => {
    const now = Date.now()

    // Opportunistic sweep so the map cannot grow without bound.
    if (rateBuckets.size > 5000) {
      for (const [key, window] of rateBuckets) {
        if (window.resetAt <= now) rateBuckets.delete(key)
      }
    }

    const ip = req.ip || req.socket?.remoteAddress || "unknown"
    const key = `${req.baseUrl || ""}${req.path}:${ip}`
    const window = rateBuckets.get(key)

    if (!window || window.resetAt <= now) {
      rateBuckets.set(key, { count: 1, resetAt: now + windowMs })
      return next()
    }

    if (window.count >= max) {
      res.setHeader("Retry-After", Math.ceil((window.resetAt - now) / 1000))
      return res.status(429).json({
        message: "Too many requests. Please try again shortly.",
      })
    }

    window.count++
    next()
  }
}

const FIFTEEN_MINUTES = 15 * 60 * 1000

export const config: MiddlewaresConfig = {
  routes: [
    {
      matcher: "/static*",
      middlewares: [
        deleteAfterDownload,
        express.static(path.resolve(process.cwd())) as any
      ],
    },
    {
      matcher: "/store/payment-collections*",
      bodyParser: {
        sizeLimit: "10mb",
      },
    },
    {
      matcher: "/store/custom/resolve-phone",
      middlewares: [rateLimit({ windowMs: FIFTEEN_MINUTES, max: 10 })],
    },
    {
      matcher: "/custom/password-update",
      middlewares: [rateLimit({ windowMs: FIFTEEN_MINUTES, max: 10 })],
    },
    {
      matcher: "/custom/password-reset-request",
      middlewares: [rateLimit({ windowMs: FIFTEEN_MINUTES, max: 5 })],
    },
    {
      matcher: "/custom/password-reset-update",
      middlewares: [rateLimit({ windowMs: FIFTEEN_MINUTES, max: 10 })],
    },
    {
      matcher: "/custom/check-account",
      middlewares: [rateLimit({ windowMs: FIFTEEN_MINUTES, max: 30 })],
    },
    {
      matcher: "/custom/guest-register",
      middlewares: [rateLimit({ windowMs: FIFTEEN_MINUTES, max: 10 })],
    },
  ],
}
