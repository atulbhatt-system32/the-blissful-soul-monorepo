"use client"

import React from "react"
import Image from "next/image"

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337"

/**
 * Strapi media arrives in three shapes depending on the API version and
 * whether the field was populated flat or nested.
 */
function resolveMedia(media?: any) {
  const node = media?.data?.attributes ?? media?.attributes ?? media
  const url = node?.url

  if (!url) return null

  return {
    url: url.startsWith("http") ? url : `${STRAPI_URL}${url}`,
    // Use the asset's real dimensions so the reserved space matches the image.
    // Hardcoding 1200x400 distorts the layout for any other aspect ratio.
    width: node?.width ?? 1200,
    height: node?.height ?? 400,
  }
}

const InstagramBanner = ({
  banner,
  mobileBanner,
  handle,
}: {
  banner?: any
  mobileBanner?: any
  handle?: string
}) => {
  const instagramUrl = handle
    ? `https://www.instagram.com/${handle.replace("@", "")}/`
    : "https://www.instagram.com/pragya.vijh_astrotalks/"

  const desktop = resolveMedia(banner)
  const mobile = resolveMedia(mobileBanner)

  if (!desktop) return null

  // Only render a second <Image> when a genuinely different asset exists,
  // so a single banner is never downloaded twice.
  const hasSeparateMobile = !!mobile && mobile.url !== desktop.url

  return (
    <section className="py-10 md:py-20 bg-[#FAF9F6] overflow-hidden">
      {/*
        Full-bleed below `sm`. The artwork is a wide banner with text baked
        into it, so the container's 24px side padding was shrinking it further
        on exactly the screens where it is already hardest to read.
      */}
      <div className="w-full sm:max-w-[1440px] sm:mx-auto sm:px-6">
        <a
          href={instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Follow ${handle || "us"} on Instagram`}
          className="block w-full overflow-hidden rounded-none sm:rounded-[24px] md:rounded-[40px] shadow-xl hover:shadow-2xl sm:hover:scale-[1.01] transition-all duration-500 group relative"
        >
          {hasSeparateMobile ? (
            <>
              <Image
                src={mobile!.url}
                alt="Connect with us on Instagram"
                className="w-full h-auto block sm:hidden"
                width={mobile!.width}
                height={mobile!.height}
                sizes="100vw"
              />
              <Image
                src={desktop.url}
                alt="Connect with us on Instagram"
                className="w-full h-auto hidden sm:block"
                width={desktop.width}
                height={desktop.height}
                sizes="(max-width: 1440px) 100vw, 1440px"
              />
            </>
          ) : (
            <Image
              src={desktop.url}
              alt="Connect with us on Instagram"
              className="w-full h-auto block"
              width={desktop.width}
              height={desktop.height}
              sizes="(max-width: 640px) 100vw, (max-width: 1440px) 100vw, 1440px"
            />
          )}

          {/* Subtle overlay on hover */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500" />
        </a>
      </div>
    </section>
  )
}

export default InstagramBanner
