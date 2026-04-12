import { HttpTypes } from "@medusajs/types"
import { Heading, Text } from "@medusajs/ui"
import { BlocksRenderer } from "@strapi/blocks-react-renderer"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

type ProductInfoProps = {
  product: HttpTypes.StoreProduct
  strapiContent?: any
}

const ProductInfo = ({ product, strapiContent }: ProductInfoProps) => {
  return (
    <div id="product-info">
      <div className="flex flex-col gap-y-4 lg:max-w-[500px] mx-auto">
        {product.collection && (
          <LocalizedClientLink
            href={`/collections/${product.collection.handle}`}
            className="text-medium text-ui-fg-muted hover:text-ui-fg-subtle"
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

        {strapiContent?.rich_description && Array.isArray(strapiContent.rich_description) && strapiContent.rich_description.length > 0 ? (
          <div className="text-medium text-ui-fg-subtle prose prose-sm max-w-none" data-testid="product-description">
            <BlocksRenderer content={strapiContent.rich_description} />
          </div>
        ) : (
          <Text
            className="text-medium text-ui-fg-subtle"
            data-testid="product-description"
          >
            {product.description}
          </Text>
        )}
      </div>
    </div>
  )
}

export default ProductInfo
