"use client"

import { BlocksRenderer } from "@strapi/blocks-react-renderer"

type ProductDescriptionProps = {
  content: any[]
}

const ProductDescription = ({ content }: ProductDescriptionProps) => {
  return (
    <BlocksRenderer
      content={content}
      blocks={{
        list: ({ children, format }) =>
          format === "ordered" ? (
            <ol className="list-decimal list-outside ml-5 mb-2 space-y-1">{children}</ol>
          ) : (
            <ul className="list-disc list-outside ml-5 mb-2 space-y-1">{children}</ul>
          ),
      }}
    />
  )
}

export default ProductDescription
