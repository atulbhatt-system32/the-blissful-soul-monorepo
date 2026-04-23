import { loadEnv, defineConfig } from '@medusajs/framework/utils'

loadEnv(process.env.NODE_ENV || 'development', process.cwd())

module.exports = defineConfig({
  admin: {
    path: '/dashboard',
  },
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    redisUrl: process.env.REDIS_URL,
    http: {
      storeCors: process.env.BACKEND_CORS_ORIGIN!,
      adminCors: process.env.BACKEND_CORS_ORIGIN!,
      authCors: process.env.BACKEND_CORS_ORIGIN!,
      jwtSecret: process.env.BACKEND_JWT_SECRET || "supersecret",
      cookieSecret: process.env.BACKEND_COOKIE_SECRET || "supersecret",
    }
  },
  modules: {
    payment: {
      resolve: "@medusajs/medusa/payment",
      options: {
        providers: [
          {
            resolve: "@tsc_tech/medusa-plugin-razorpay-payment/providers/razorpay",
            id: "razorpay",
            options: {
              key_id: process.env.RAZORPAY_ID,
              key_secret: process.env.RAZORPAY_SECRET,
            },
          },
        ],
      },
    },
    file: {
      resolve: "@medusajs/medusa/file",
      options: {
        providers: [
          {
            resolve: "@medusajs/medusa/file-local",
            id: "local",
            options: {
              upload_dir: "static",
              backend_url: `${process.env.BACKEND_URL}/static`,
            },
          },
        ],
      },
    },
    notification: {
      resolve: "@medusajs/medusa/notification",
      options: {
        providers: [
          {
            resolve: "./src/modules/notification-smtp",
            id: "google-smtp",
            options: {
              channels: ["email"],
              scope: "all"
            },
          },
        ],
      },
    },
  },
})
