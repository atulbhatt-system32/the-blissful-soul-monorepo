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
    /**
     * Keep optimised images for 30 days.
     *
     * Medusa serves its uploads with `Cache-Control: max-age=0`, and Next takes
     * the larger of that and this value, so it was falling back to the 60s
     * default. Every product image therefore expired each minute: browsers
     * re-downloaded it, and the optimiser re-fetched the original — PNGs of up
     * to 2.5MB — and re-encoded it to AVIF on the storefront's half-core CPU.
     * A miss measured 1.4s against 0.14s for a hit.
     *
     * A long TTL is safe because uploads are never overwritten in place:
     * Medusa prefixes each file with an upload timestamp and Strapi appends a
     * hash, so replacing an image produces a new URL rather than a stale one.
     */
    minimumCacheTTL: 60 * 60 * 24 * 30,
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
