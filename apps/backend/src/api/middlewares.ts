import { MiddlewaresConfig } from "@medusajs/medusa"
import express from "express"
import path from "path"

export const config: MiddlewaresConfig = {
  routes: [
    {
      matcher: "/static*",
      middlewares: [
        express.static(path.resolve(process.cwd())) as any
      ],
    },
    {
      matcher: "/store/payment-collections*",
      bodyParserConfig: {
        sizeLimit: "10mb",
      },
    },
  ],
}
