import { HttpTypes } from "@medusajs/types"
import { Heading } from "@medusajs/ui"
import ProductDescription from "@modules/products/components/product-description"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Accordion from "@modules/products/components/product-tabs/accordion"

type ProductInfoProps = {
  product: HttpTypes.StoreProduct
  strapiContent?: any
}

const hasBlocks = (val: any) => Array.isArray(val) && val.length > 0

const ProductInfo = ({ product, strapiContent }: ProductInfoProps) => {
  const hasDetail = hasBlocks(strapiContent?.rich_detail)
  const hasIngredients = hasBlocks(strapiContent?.rich_ingredients)

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

        {hasBlocks(strapiContent?.rich_description) && (
          <div className="text-medium text-ui-fg-subtle" data-testid="product-description">
            <ProductDescription content={strapiContent.rich_description} />
          </div>
        )}

        {(hasDetail || hasIngredients) && (
          <Accordion type="multiple">
            {hasDetail && (
              <Accordion.Item value="detail" title="Product Details">
                <ProductDescription content={strapiContent.rich_detail} />
              </Accordion.Item>
            )}
            {hasIngredients && (
              <Accordion.Item value="ingredients" title="Ingredients">
                <ProductDescription content={strapiContent.rich_ingredients} />
              </Accordion.Item>
            )}
          </Accordion>
        )}
      </div>
    </div>
  )
}

export default ProductInfo
