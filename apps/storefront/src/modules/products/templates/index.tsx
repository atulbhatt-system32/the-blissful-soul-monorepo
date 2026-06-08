import React, { Suspense } from "react"

import ImageGallery from "@modules/products/components/image-gallery"
import ProductActions from "@modules/products/components/product-actions"
import ProductOnboardingCta from "@modules/products/components/product-onboarding-cta"
import RelatedProducts from "@modules/products/components/related-products"
import ProductInfo from "@modules/products/templates/product-info"
import SkeletonRelatedProducts from "@modules/skeletons/templates/skeleton-related-products"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { notFound } from "next/navigation"
import { HttpTypes } from "@medusajs/types"
import { Heading } from "@medusajs/ui"

import ProductActionsWrapper from "./product-actions-wrapper"

type ProductTemplateProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  countryCode: string
  images: HttpTypes.StoreProductImage[]
  strapiContent?: any
  storeConfig?: any
}

const ProductTemplate: React.FC<ProductTemplateProps> = ({
  product,
  region,
  countryCode,
  images,
  strapiContent,
  storeConfig,
}) => {
  if (!product || !product.id) {
    return notFound()
  }

  return (
    <>
      <div className="content-container py-4">
        <nav className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-bold uppercase tracking-[0.2em] text-[#C5A059]">
          <LocalizedClientLink href="/" className="hover:text-[#2C1E36] transition-colors">
            Home
          </LocalizedClientLink>
          <span className="text-gray-300">/</span>
          <LocalizedClientLink href="/store" className="hover:text-[#2C1E36] transition-colors">
            Shop Crystals
          </LocalizedClientLink>
          <span className="text-gray-300">/</span>
          <span className="text-[#2C1E36]/60">{product.title}</span>
        </nav>
      </div>
      <div
        className="content-container  flex flex-col small:flex-row small:items-start py-6 relative"
        data-testid="product-container"
      >
        <div className="flex flex-col small:sticky small:top-48 small:py-0 small:max-w-[300px] w-full py-8 gap-y-6">
          <ProductInfo product={product} strapiContent={strapiContent} />
        </div>
        <div className="flex-1 min-w-0 w-full relative order-first small:order-none flex flex-col gap-y-4">
          <ImageGallery images={images} />
          <div className="flex flex-col small:mx-16 w-full max-w-[600px] mx-auto px-4 small:px-0">
            {product.collection && (
              <LocalizedClientLink
                href={`/collections/${product.collection.handle}`}
                className="text-medium text-ui-fg-muted hover:text-ui-fg-subtle mb-1"
              >
                {product.collection.title}
              </LocalizedClientLink>
            )}
            <Heading
              level="h2"
              className="text-3xl leading-10 text-ui-fg-base"
              data-testid="product-title"
            >
              {product.title}
            </Heading>
          </div>
        </div>
        <div className="flex flex-col small:sticky small:top-48 small:py-0 small:max-w-[300px] w-full py-8 gap-y-12">
          <ProductOnboardingCta />
          <Suspense
            fallback={
              <ProductActions
                disabled={true}
                product={product}
                region={region}
                storeConfig={storeConfig}
              />
            }
          >
            <ProductActionsWrapper id={product.id} region={region} storeConfig={storeConfig} />
          </Suspense>
        </div>
      </div>
      <div
        className="content-container my-16 small:my-32"
        data-testid="related-products-container"
      >
        <Suspense fallback={<SkeletonRelatedProducts />}>
          <RelatedProducts product={product} countryCode={countryCode} />
        </Suspense>
      </div>
    </>
  )
}

export default ProductTemplate
