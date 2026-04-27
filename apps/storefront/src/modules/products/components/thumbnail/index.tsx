import { Container, clx } from "@medusajs/ui"
import Image from "next/image"
import React from "react"

import PlaceholderImage from "@modules/common/icons/placeholder-image"

type ThumbnailProps = {
  thumbnail?: string | null
  // TODO: Fix image typings
  images?: any[] | null
  size?: "small" | "medium" | "large" | "full" | "square"
  isFeatured?: boolean
  className?: string
  "data-testid"?: string
}

const Thumbnail: React.FC<ThumbnailProps> = ({
  thumbnail,
  images,
  size = "small",
  isFeatured,
  className,
  "data-testid": dataTestid,
}) => {
  const initialImage = thumbnail || images?.[0]?.url

  return (
    <Container
      className={clx(
        "relative w-full overflow-hidden p-0 bg-transparent shadow-none rounded-none",
        className,
        {
          "aspect-[11/14]": isFeatured && !className?.includes("aspect-"),
          "aspect-[9/16]": !isFeatured && size !== "square" && !className?.includes("aspect-"),
          "aspect-[1/1]": size === "square" && !className?.includes("aspect-"),
          "w-[180px]": size === "small",
          "w-[290px]": size === "medium",
          "w-[440px]": size === "large",
          "w-full": size === "full",
        }
      )}
      data-testid={dataTestid}
    >
      <ImageOrPlaceholder image={initialImage} size={size} />
    </Container>
  )
}

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337"

const ImageOrPlaceholder = ({
  image,
  size,
}: Pick<ThumbnailProps, "size"> & { image?: string }) => {
  if (!image) {
    return (
      <div className="w-full h-full absolute inset-0 flex items-center justify-center">
        <PlaceholderImage size={size === "small" ? 16 : 24} />
      </div>
    )
  }

  const imageUrl = image.startsWith("http") ? image : `${STRAPI_URL}${image}`

  return (
    <Image
      src={imageUrl}
      alt="Thumbnail"
      className="absolute inset-0 object-cover object-center"
      draggable={false}
      quality={50}
      sizes="(max-width: 576px) 280px, (max-width: 768px) 360px, (max-width: 992px) 480px, 800px"
      fill
    />
  )
}

export default Thumbnail
