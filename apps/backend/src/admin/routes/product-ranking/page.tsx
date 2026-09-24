import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Adjustments, BarsThree } from "@medusajs/icons"
import { Container, Heading, Input, Text, Button, toast } from "@medusajs/ui"
import { useEffect, useRef, useState } from "react"

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

// Reorders `list` by moving the item with id `dragId` to the position
// currently occupied by the item with id `overId`.
const moveItem = (
  list: RankedProduct[],
  dragId: string,
  overId: string
): RankedProduct[] => {
  const fromIndex = list.findIndex((p) => p.id === dragId)
  const toIndex = list.findIndex((p) => p.id === overId)
  if (fromIndex === -1 || toIndex === -1 || fromIndex === toIndex) {
    return list
  }
  const next = [...list]
  const [moved] = next.splice(fromIndex, 1)
  next.splice(toIndex, 0, moved)
  return next
}

const ProductRankingPage = () => {
  const [products, setProducts] = useState<RankedProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [draftRanks, setDraftRanks] = useState<Record<string, string>>({})
  const [savingId, setSavingId] = useState<string | null>(null)
  const [savingAll, setSavingAll] = useState(false)
  const [dragId, setDragId] = useState<string | null>(null)
  const dragStartOrder = useRef<string[]>([])

  const isDirty = (p: RankedProduct) => {
    const raw = draftRanks[p.id]
    const original = p.rank !== null ? String(p.rank) : ""
    return raw !== undefined && raw !== original
  }

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

  // Saves every row whose rank input has been edited but not yet saved.
  // Applied one at a time, in on-screen order, so each PATCH sees the
  // shifts left behind by the ones before it.
  const saveAllRanks = async () => {
    const dirty = products.filter(isDirty)
    if (dirty.length === 0) {
      return
    }

    setSavingAll(true)
    let successCount = 0
    let failCount = 0

    for (const product of dirty) {
      const rank = parseInt(draftRanks[product.id], 10)
      if (isNaN(rank)) {
        failCount++
        continue
      }

      try {
        const res = await fetch(`/admin/products/${product.id}/rank`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ rank }),
        })
        const json = await res.json()
        json.success ? successCount++ : failCount++
      } catch {
        failCount++
      }
    }

    await load()
    setSavingAll(false)

    if (failCount === 0) {
      toast.success(`Saved ${successCount} rank${successCount === 1 ? "" : "s"}`)
    } else {
      toast.error(`Saved ${successCount}, failed ${failCount}`)
    }
  }

  // Persists the drag-and-drop position of `productId` by sending its new
  // 1-based index as the rank. The backend shifts every product between the
  // old and new position, so we just need the final index.
  const persistPosition = async (productId: string) => {
    const index = products.findIndex((p) => p.id === productId)
    if (index === -1) {
      return
    }
    const rank = index + 1

    setSavingId(productId)
    try {
      const res = await fetch(`/admin/products/${productId}/rank`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ rank }),
      })
      const json = await res.json()

      if (!json.success) {
        toast.error(json.message || "Failed to reorder")
        await load()
        return
      }

      toast.success("Order updated")
      await load()
    } catch {
      toast.error("Failed to connect to server")
      await load()
    } finally {
      setSavingId(null)
    }
  }

  const handleDragStart = (e: React.DragEvent, product: RankedProduct) => {
    // Only start a drag when it originates from the grip handle, so the
    // rank input and Save button inside the row stay usable.
    const path = e.nativeEvent.composedPath?.() ?? [e.target]
    const fromHandle = path.some(
      (el) => el instanceof HTMLElement && el.dataset.dragHandle !== undefined
    )
    if (!fromHandle || savingId !== null || savingAll) {
      e.preventDefault()
      return
    }
    dragStartOrder.current = products.map((p) => p.id)
    setDragId(product.id)
    e.dataTransfer.effectAllowed = "move"
    e.dataTransfer.setData("text/plain", product.id)
  }

  const handleDragOver = (e: React.DragEvent, overProduct: RankedProduct) => {
    if (!dragId || dragId === overProduct.id) {
      return
    }
    e.preventDefault()
    setProducts((prev) => moveItem(prev, dragId, overProduct.id))
  }

  const handleDragEnd = async () => {
    const movedId = dragId
    const startOrder = dragStartOrder.current
    setDragId(null)

    if (!movedId) {
      return
    }

    const currentOrder = products.map((p) => p.id)
    const unchanged =
      startOrder.length === currentOrder.length &&
      startOrder.every((id, i) => id === currentOrder[i])

    if (unchanged) {
      return
    }

    await persistPosition(movedId)
  }

  const dirtyCount = products.filter(isDirty).length

  return (
    <Container>
      <div className="py-8">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <Heading level="h1" className="mb-2">
              Product Ranking
            </Heading>
            <Text className="text-ui-fg-muted">
              Controls the default display order of products on the storefront (lowest rank
              first). Drag a row by its handle to reorder, or edit ranks below and save them
              all at once. Either way, everything between the old and new position shifts
              automatically — ranks always stay unique, 1..N with no gaps.
            </Text>
          </div>
          {dirtyCount > 0 && (
            <div className="flex items-center gap-3 shrink-0">
              <Text className="text-ui-fg-muted text-sm whitespace-nowrap">
                {dirtyCount} unsaved change{dirtyCount === 1 ? "" : "s"}
              </Text>
              <Button
                size="small"
                variant="primary"
                isLoading={savingAll}
                disabled={savingAll || savingId !== null}
                onClick={saveAllRanks}
              >
                Save all
              </Button>
            </div>
          )}
        </div>

        {loading ? (
          <Text className="text-ui-fg-muted">Loading products...</Text>
        ) : (
          <div className="bg-ui-bg-field border border-ui-border-base rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-ui-border-base bg-ui-bg-subtle">
                  <th className="w-10" />
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
                  <tr
                    key={p.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, p)}
                    onDragOver={(e) => handleDragOver(e, p)}
                    onDrop={(e) => e.preventDefault()}
                    onDragEnd={handleDragEnd}
                    className={`border-b border-ui-border-base last:border-0 ${
                      dragId === p.id ? "opacity-40" : ""
                    }`}
                  >
                    <td className="py-2 px-2 text-center">
                      <span
                        data-drag-handle
                        className="inline-flex cursor-grab active:cursor-grabbing text-ui-fg-muted"
                        title="Drag to reorder"
                      >
                        <BarsThree />
                      </span>
                    </td>
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
                        disabled={savingAll}
                        placeholder="unranked"
                        className="max-w-[100px]"
                      />
                    </td>
                    <td className="py-2 px-4">
                      <Button
                        size="small"
                        variant="secondary"
                        isLoading={savingId === p.id}
                        disabled={savingId === p.id || savingAll || !isDirty(p)}
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
