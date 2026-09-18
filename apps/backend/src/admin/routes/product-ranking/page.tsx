import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Adjustments } from "@medusajs/icons"
import { Container, Heading, Input, Text, Button, toast } from "@medusajs/ui"
import { useEffect, useState } from "react"

type RankedProduct = {
  id: string
  title: string
  handle: string
  thumbnail: string | null
  rank: number | null
}

const fetchProducts = async (): Promise<RankedProduct[]> => {
  const res = await fetch(
    "/admin/products?fields=id,title,handle,thumbnail,%2Bproduct_rank.rank&limit=200",
    { credentials: "include" }
  )
  const data = await res.json()

  const products: RankedProduct[] = (data.products || []).map((p: any) => ({
    id: p.id,
    title: p.title,
    handle: p.handle,
    thumbnail: p.thumbnail,
    rank: p.product_rank?.rank ?? null,
  }))

  // Unranked products (rank === null) sort to the end, in whatever order
  // the API returned them.
  return products.sort((a, b) => (a.rank ?? Infinity) - (b.rank ?? Infinity))
}

const ProductRankingPage = () => {
  const [products, setProducts] = useState<RankedProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [draftRanks, setDraftRanks] = useState<Record<string, string>>({})
  const [savingId, setSavingId] = useState<string | null>(null)

  const load = async () => {
    setLoading(true)
    try {
      const data = await fetchProducts()
      setProducts(data)
      setDraftRanks(
        Object.fromEntries(data.map((p) => [p.id, p.rank !== null ? String(p.rank) : ""]))
      )
    } catch {
      toast.error("Failed to load products")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const saveRank = async (product: RankedProduct) => {
    const raw = draftRanks[product.id]
    const rank = parseInt(raw, 10)

    if (isNaN(rank)) {
      toast.error("Enter a valid number")
      return
    }

    setSavingId(product.id)
    try {
      const res = await fetch(`/admin/products/${product.id}/rank`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ rank }),
      })
      const json = await res.json()

      if (!json.success) {
        toast.error(json.message || "Failed to update rank")
        return
      }

      toast.success(`"${product.title}" moved to rank ${rank}`)
      await load()
    } catch {
      toast.error("Failed to connect to server")
    } finally {
      setSavingId(null)
    }
  }

  return (
    <Container>
      <div className="py-8">
        <div className="mb-6">
          <Heading level="h1" className="mb-2">
            Product Ranking
          </Heading>
          <Text className="text-ui-fg-muted">
            Controls the default display order of products on the storefront (lowest rank
            first). Changing a product's rank automatically shifts everything between its
            old and new position — ranks always stay unique, 1..N with no gaps.
          </Text>
        </div>

        {loading ? (
          <Text className="text-ui-fg-muted">Loading products...</Text>
        ) : (
          <div className="bg-ui-bg-field border border-ui-border-base rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-ui-border-base bg-ui-bg-subtle">
                  <th className="text-left py-3 px-4 text-ui-fg-muted font-medium w-20">
                    Image
                  </th>
                  <th className="text-left py-3 px-4 text-ui-fg-muted font-medium">
                    Product
                  </th>
                  <th className="text-left py-3 px-4 text-ui-fg-muted font-medium w-40">
                    Rank
                  </th>
                  <th className="w-32" />
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id} className="border-b border-ui-border-base last:border-0">
                    <td className="py-2 px-4">
                      {p.thumbnail ? (
                        <img
                          src={p.thumbnail}
                          alt={p.title}
                          className="w-10 h-10 object-cover rounded"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-ui-bg-subtle rounded" />
                      )}
                    </td>
                    <td className="py-2 px-4">
                      <Text className="font-medium">{p.title}</Text>
                      <Text className="text-ui-fg-muted text-xs">{p.handle}</Text>
                    </td>
                    <td className="py-2 px-4">
                      <Input
                        type="number"
                        min={1}
                        value={draftRanks[p.id] ?? ""}
                        onChange={(e) =>
                          setDraftRanks((prev) => ({ ...prev, [p.id]: e.target.value }))
                        }
                        placeholder="unranked"
                        className="max-w-[100px]"
                      />
                    </td>
                    <td className="py-2 px-4">
                      <Button
                        size="small"
                        variant="secondary"
                        isLoading={savingId === p.id}
                        disabled={
                          savingId === p.id ||
                          draftRanks[p.id] === (p.rank !== null ? String(p.rank) : "")
                        }
                        onClick={() => saveRank(p)}
                      >
                        Save
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Container>
  )
}

export const config = defineRouteConfig({
  label: "Product Ranking",
  icon: Adjustments,
})

export default ProductRankingPage
