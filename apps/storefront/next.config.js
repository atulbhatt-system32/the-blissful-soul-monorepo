const path = require("path")
const checkEnvVariables = require("./check-env-variables")

checkEnvVariables()

/**
 * Medusa Cloud-related environment variables
 */
const S3_HOSTNAME = process.env.MEDUSA_CLOUD_S3_HOSTNAME
const S3_PATHNAME = process.env.MEDUSA_CLOUD_S3_PATHNAME

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  output: "standalone",
  outputFileTracingRoot: path.join(__dirname, "../../"),
  reactStrictMode: true,
  experimental: {
    /**
     * Rewrites barrel imports so only the components actually used are
     * bundled.
     *
     * `@medusajs/ui` depends on prismjs and prism-react-renderer for its
     * CodeBlock component, which this storefront never renders. Importing
     * anything from the package root — Text, Button, Heading and clx, across
     * 87 files — pulled Prism and its language grammars in anyway, producing a
     * 676KB chunk the browser had to parse before the page became
     * interactive. That chunk was four times larger than any other and is the
     * main contributor to a 1.75s Total Blocking Time.
     */
    optimizePackageImports: ["@medusajs/ui", "@medusajs/icons"],
  },
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
      },
      {
        protocol: "https",
        hostname: "medusa-public-images.s3.eu-west-1.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "medusa-server-testing.s3.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "medusa-server-testing.s3.us-east-1.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "backend.pragyavijh.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "pragyavijh.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "cms.pragyavijh.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
      ...(S3_HOSTNAME && S3_PATHNAME
        ? [
          {
            protocol: "https",
            hostname: S3_HOSTNAME,
            pathname: S3_PATHNAME,
          },
        ]
        : []),
    ],
  },
}

module.exports = nextConfig
