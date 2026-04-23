import { Metadata } from "next"
import { notFound } from "next/navigation"
import Image from "next/image"
import { getServiceCategoryDetail } from "@lib/data/categories"
import { getStrapiProductsByHandles } from "@lib/data/strapi"
import ProductPreview from "@modules/products/components/product-preview"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; countryCode: string }>
}): Promise<Metadata> {
  const { slug, countryCode } = await params
  const data = await getServiceCategoryDetail(slug, countryCode)

  if (!data) return { title: "Service Not Found" }

  return {
    title: `${data.category.name} | The Blissful Soul`,
    description: data.category.description || `${data.category.name} services`,
  }
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string; countryCode: string }>
}) {
  const { slug, countryCode } = await params
  const data = await getServiceCategoryDetail(slug, countryCode)

  if (!data) notFound()

  const { category, products, region } = data
  const images = category.product_category_images as
    | Array<{ url: string }>
    | undefined
  const heroImage = images?.[0]?.url

  const uniqueHandles = products
    .map((p) => p.handle)
    .filter(Boolean) as string[]
  const strapiMap = uniqueHandles.length
    ? await getStrapiProductsByHandles(uniqueHandles)
    : {}

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <div className="bg-[#FDF2F4] py-16 md:py-24">
        <div className="content-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="max-w-xl">
              <span className="text-[12px] md:text-sm uppercase tracking-[0.4em] font-bold text-primary font-sans block mb-4">
                SERVICE
              </span>
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-[#2C1E36] leading-tight font-bold mb-8">
                {category.name}
              </h1>
              {category.description && (
                <p className="text-[#665D6B] text-base md:text-lg font-sans leading-relaxed">
                  {category.description}
                </p>
              )}
            </div>

            <div className="relative aspect-[4/3] rounded-[32px] overflow-hidden shadow-2xl">
              {heroImage ? (
                <Image
                  src={heroImage}
                  alt={category.name}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="w-full h-full bg-[#F0E6F0] flex items-center justify-center">
                  <span className="text-6xl text-[#C5A059]/40">✦</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Products / Sessions Section */}
      {products.length > 0 && region && (
        <div className="py-20 md:py-32 bg-[#FAF9F6]">
          <div className="content-container">
            <div className="text-center mb-12">
              <span className="text-[11px] uppercase tracking-[0.4em] font-bold text-[#C5A059] font-sans mb-2 block">
                Choose Your Session
              </span>
              <h2 className="text-2xl md:text-3xl font-serif text-[#2C1E36] uppercase tracking-tighter leading-tight">
                {category.name} Packages
              </h2>
            </div>

            <div
              className={`grid grid-cols-1 gap-8 ${
                products.length === 1
                  ? "sm:grid-cols-1 max-w-sm mx-auto"
                  : products.length === 2
                  ? "sm:grid-cols-2 max-w-2xl mx-auto"
                  : "sm:grid-cols-2 lg:grid-cols-4"
              }`}
            >
              {products.map((product) => (
                <ProductPreview
                  key={product.id}
                  product={product}
                  region={region}
                  isFeatured
                  strapiContent={strapiMap[product.handle ?? ""]}
                />
              ))}
            </div>

            <div className="mt-20 text-center">
              <p className="text-[#C5A059] text-[11px] font-bold uppercase tracking-[0.3em] flex items-center justify-center gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059]" />
                All charges are inclusive of 18% GST
                <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059]" />
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
