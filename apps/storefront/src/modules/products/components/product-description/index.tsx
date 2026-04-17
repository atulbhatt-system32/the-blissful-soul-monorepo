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
        heading: ({ children, level }) => {
          if (level === 1) return <h1 className="text-xl font-semibold text-ui-fg-base mt-4 mb-2">{children}</h1>
          if (level === 2) return <h2 className="text-lg font-semibold text-ui-fg-base mt-4 mb-2">{children}</h2>
          return <h3 className="text-base font-semibold text-ui-fg-base mt-4 mb-1">{children}</h3>
        },
        list: ({ children, format }) =>
          format === "ordered" ? (
            <ol className="list-decimal list-outside ml-5 mb-2 space-y-1">{children}</ol>
          ) : (
            <ul className="list-disc list-outside ml-5 mb-2 space-y-1">{children}</ul>
          ),
        paragraph: ({ children }) => (
          <p className="mb-2 text-ui-fg-subtle">{children}</p>
        ),
      }}
    />
  )
}

export default ProductDescription
