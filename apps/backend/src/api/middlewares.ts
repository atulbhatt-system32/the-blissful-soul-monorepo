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
  ],
}
