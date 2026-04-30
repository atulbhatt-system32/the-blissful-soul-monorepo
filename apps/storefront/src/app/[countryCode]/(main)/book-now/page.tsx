import { Metadata } from "next"
import { getRegion } from "@lib/data/regions"
import { listProducts } from "@lib/data/products"
import { listCategories, getServiceCategories } from "@lib/data/categories"
import BookNowClient from "@modules/booking/components/book-now-wizard"
import { retrieveCustomer } from "@lib/data/customer"

export const metadata: Metadata = {
  title: "Book Now",
  description: "Book your astrology, tarot reading, or healing session with our masters.",
}

export default async function BookNowPage(props: {
  params: Promise<{ countryCode: string }>
  searchParams: Promise<{ service_id?: string; variant_id?: string }>
}) {
  const params = await props.params
  const searchParams = await props.searchParams

  const { countryCode } = params
  const { service_id, variant_id } = searchParams
  
  const region = await getRegion(countryCode)
  const customer = await retrieveCustomer()

  if (!region) {
    return null
  }

  // Fetch Categories (only those under the "Services" parent)
  const categories = await getServiceCategories()
  
  // Fetch a base list of session products (all products that are sessions)
  // We can just fetch all products for now, or filter by a specific category if needed
  // To keep it simple, we load everything and filter on the client, assuming small catalog
  const productsResponse = await listProducts({
    regionId: region.id,
    includeHidden: true,
    queryParams: {
      limit: 100,
      fields: "*variants.calculated_price,*tags,+metadata,*categories,+thumbnail,*images,*variants.images"
    }
  })
  
  const products = productsResponse?.response?.products || []

  return (
    <div className="bg-[#FAF9F6] min-h-screen">
      {/* Header section similar to the design */}
      <section className="bg-[#0A0A0A] py-16 flex items-center justify-center text-center">
        <h1 className="text-white text-4xl md:text-5xl font-serif uppercase tracking-tight">
          Book Now
        </h1>
      </section>

      <section className="py-12 max-w-5xl mx-auto px-4 md:px-8">
        <BookNowClient 
          categories={categories} 
          products={products} 
          region={region} 
          initialServiceId={service_id} 
          initialVariantId={variant_id}
          countryCode={countryCode}
          customer={customer}
        />
      </section>
    </div>
  )
}
