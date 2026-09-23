import { defineRouteConfig } from "@medusajs/admin-sdk"
import { CurrencyDollar } from "@medusajs/icons"
import { Container, Heading, Text, Button, Badge, toast } from "@medusajs/ui"
import { useRef, useState } from "react"

type ParsedRow = {
  identifier: string
  sku?: string
  variant_id?: string
  product_id?: string
  price?: number
  sale_price?: number
  error?: string
}

type RowResult = {
  identifier: string
  status: "ok" | "error"
  message?: string
}

// Minimal CSV parser: no embedded-comma/quote handling, which is fine for a
// sku/product_id/price/sale_price sheet. Blank lines are skipped.
const parseCsv = (text: string): { header: string[]; rows: string[][] } => {
  const lines = text.split(/\r\n|\n|\r/).filter((l) => l.trim().length > 0)
  const parseLine = (line: string) =>
    line.split(",").map((cell) => cell.trim().replace(/^"|"$/g, ""))

  const [headerLine, ...rest] = lines
  if (!headerLine) {
    return { header: [], rows: [] }
  }
  return { header: parseLine(headerLine).map((h) => h.toLowerCase()), rows: rest.map(parseLine) }
}

const parseNumericCell = (raw: string | undefined): { value?: number; error?: string } => {
  if (raw === undefined || raw.trim() === "") {
    return {}
  }
  const value = Number(raw)
  if (!Number.isFinite(value) || value < 0) {
    return { error: `invalid number "${raw}"` }
  }
  return { value }
}

const rowsToCsv = (
  rows: ParsedRow[]
): { sku?: string; variant_id?: string; product_id?: string; price?: number; sale_price?: number }[] =>
  rows
    .filter((r) => !r.error)
    .map((r) => ({
      sku: r.sku,
      variant_id: r.variant_id,
      product_id: r.product_id,
      price: r.price,
      sale_price: r.sale_price,
    }))

const TEMPLATE_CSV =
  "sku,variant_id,product_id,price,sale_price\nin0001,,,1499,749\n,variant_01KPDJ5N3RQZ0Q3H6M8V,,999,\n"

// CSV field quoting: wraps in quotes and escapes embedded quotes whenever the
// value could otherwise break column alignment (comma, quote, or newline).
const csvField = (value: string): string =>
  /[",\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value

// Paginates through /admin/products fetching every variant's SKU and INR
// price, since a single ?limit=200 call would silently truncate a larger
// catalog.
const fetchAllProductsForExport = async (): Promise<any[]> => {
  const limit = 200
  let offset = 0
  let all: any[] = []

  while (true) {
    const res = await fetch(
      `/admin/products?fields=id,title,variants.sku,variants.prices.amount,variants.prices.currency_code&limit=${limit}&offset=${offset}`,
      { credentials: "include" }
    )
    const data = await res.json()
    const batch = data.products ?? []
    all = all.concat(batch)
    offset += limit
    if (batch.length === 0 || offset >= (data.count ?? all.length)) {
      break
    }
  }

  return all
}

const BulkPriceUpdatePage = () => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [fileName, setFileName] = useState<string | null>(null)
  const [rows, setRows] = useState<ParsedRow[]>([])
  const [parseError, setParseError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [results, setResults] = useState<RowResult[] | null>(null)
  const [exporting, setExporting] = useState(false)

  const reset = () => {
    setFileName(null)
    setRows([])
    setParseError(null)
    setResults(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleFile = async (file: File) => {
    setResults(null)
    setFileName(file.name)

    const text = await file.text()
    const { header, rows: rawRows } = parseCsv(text)

    const skuIdx = header.indexOf("sku")
    const variantIdIdx = header.indexOf("variant_id")
    const productIdIdx = header.indexOf("product_id")
    const priceIdx = header.indexOf("price")
    const saleIdx = header.indexOf("sale_price")

    if (skuIdx === -1 && variantIdIdx === -1 && productIdIdx === -1) {
      setParseError('CSV must have a "sku", "variant_id", and/or "product_id" column.')
      setRows([])
      return
    }
    if (priceIdx === -1 && saleIdx === -1) {
      setParseError('CSV must have a "price" and/or "sale_price" column.')
      setRows([])
      return
    }

    setParseError(null)

    const parsed: ParsedRow[] = rawRows.map((cells) => {
      const sku = skuIdx !== -1 ? cells[skuIdx]?.trim() ?? "" : ""
      const variantId = variantIdIdx !== -1 ? cells[variantIdIdx]?.trim() ?? "" : ""
      const productId = productIdIdx !== -1 ? cells[productIdIdx]?.trim() ?? "" : ""
      const identifier = sku || variantId || productId

      if (!identifier) {
        return { identifier: "", error: "missing sku, variant_id, or product_id" }
      }

      const priceResult = priceIdx !== -1 ? parseNumericCell(cells[priceIdx]) : {}
      if (priceResult.error) {
        return { identifier, error: `price: ${priceResult.error}` }
      }

      const saleResult = saleIdx !== -1 ? parseNumericCell(cells[saleIdx]) : {}
      if (saleResult.error) {
        return { identifier, error: `sale_price: ${saleResult.error}` }
      }

      if (priceResult.value === undefined && saleResult.value === undefined) {
        return { identifier, error: "neither price nor sale_price set" }
      }

      return {
        identifier,
        sku: sku || undefined,
        variant_id: !sku && variantId ? variantId : undefined,
        product_id: !sku && !variantId && productId ? productId : undefined,
        price: priceResult.value,
        sale_price: saleResult.value,
      }
    })

    setRows(parsed)
  }

  const validRows = rows.filter((r) => !r.error)
  const invalidCount = rows.length - validRows.length

  const apply = async () => {
    if (validRows.length === 0) {
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch("/admin/products/bulk-price-update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ rows: rowsToCsv(validRows) }),
      })
      const json = await res.json()

      if (!json.success) {
        toast.error(json.message || "Bulk update failed")
        return
      }

      setResults(json.results)
      const failed = (json.results as RowResult[]).filter((r) => r.status === "error").length
      const updated = json.results.length - failed

      if (failed === 0) {
        toast.success(`Updated ${updated} product${updated === 1 ? "" : "s"}`)
      } else {
        toast.error(`Updated ${updated}, failed ${failed} — see details below`)
      }
    } catch {
      toast.error("Failed to connect to server")
    } finally {
      setSubmitting(false)
    }
  }

  const downloadTemplate = () => {
    const blob = new Blob([TEMPLATE_CSV], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "bulk-price-template.csv"
    a.click()
    URL.revokeObjectURL(url)
  }

  // Exports every variant's SKU, product title, and current INR price as a
  // CSV in the same sku,price shape the importer above expects — edit the
  // price column and re-upload it. sale_price is left blank: the export
  // has no reliable way to tell a base price apart from a price-list price
  // in the raw `prices` array, so it isn't included here.
  const exportCsv = async () => {
    setExporting(true)
    try {
      const products = await fetchAllProductsForExport()
      const lines = ["sku,title,price,sale_price"]

      for (const product of products) {
        for (const variant of product.variants ?? []) {
          if (!variant.sku) {
            continue
          }
          const inrPrice = (variant.prices ?? []).find(
            (p: any) => p.currency_code === "inr"
          )
          const price = inrPrice?.amount ?? ""
          lines.push(
            [csvField(variant.sku), csvField(product.title ?? ""), price, ""].join(",")
          )
        }
      }

      const blob = new Blob([lines.join("\n")], { type: "text/csv" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "products-export.csv"
      a.click()
      URL.revokeObjectURL(url)

      toast.success(`Exported ${lines.length - 1} variant${lines.length - 1 === 1 ? "" : "s"}`)
    } catch {
      toast.error("Failed to export products")
    } finally {
      setExporting(false)
    }
  }

  return (
    <Container>
      <div className="py-8">
        <div className="mb-6">
          <Heading level="h1" className="mb-2">
            Bulk Price Update
          </Heading>
          <Text className="text-ui-fg-muted">
            Upload a CSV with an identifier column — <code>sku</code>, <code>variant_id</code>,
            and/or <code>product_id</code> — plus <code>price</code> and/or{" "}
            <code>sale_price</code>, to update variant prices in one go. <code>sku</code> and{" "}
            <code>variant_id</code> address one variant directly; <code>product_id</code> only
            resolves for single-variant products (a product with more than one variant fails that
            row rather than guessing). <code>price</code> updates the variant's regular price
            directly. <code>sale_price</code> is written to a shared "Bulk Sale Prices" catalog
            price list (shown struck-through on the shop page) — each upload that includes sale
            prices replaces that entire list, so include every product you want discounted, not
            just the ones changing.
          </Text>
        </div>

        <div className="bg-ui-bg-field border border-ui-border-base rounded-lg p-6 mb-6">
          <div className="flex items-center gap-3 flex-wrap">
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,text/csv"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) {
                  handleFile(file)
                }
              }}
            />
            <Button
              size="small"
              variant="secondary"
              onClick={() => fileInputRef.current?.click()}
              disabled={submitting}
            >
              Choose CSV
            </Button>
            <Button size="small" variant="transparent" onClick={downloadTemplate}>
              Download template
            </Button>
            <Button
              size="small"
              variant="transparent"
              isLoading={exporting}
              disabled={exporting}
              onClick={exportCsv}
            >
              Export current prices
            </Button>
            {fileName && (
              <Text className="text-ui-fg-muted text-sm">
                {fileName} — {rows.length} row{rows.length === 1 ? "" : "s"}
                {invalidCount > 0 ? `, ${invalidCount} invalid` : ""}
              </Text>
            )}
            {rows.length > 0 && (
              <Button size="small" variant="transparent" onClick={reset} disabled={submitting}>
                Clear
              </Button>
            )}
          </div>

          {parseError && (
            <Text className="text-ui-fg-error text-sm mt-3">{parseError}</Text>
          )}
        </div>

        {rows.length > 0 && (
          <div className="bg-ui-bg-field border border-ui-border-base rounded-lg overflow-hidden mb-6">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-ui-border-base bg-ui-bg-subtle">
                  <th className="text-left py-3 px-4 text-ui-fg-muted font-medium">
                    Identifier
                  </th>
                  <th className="text-left py-3 px-4 text-ui-fg-muted font-medium">Price</th>
                  <th className="text-left py-3 px-4 text-ui-fg-muted font-medium">
                    Sale price
                  </th>
                  <th className="text-left py-3 px-4 text-ui-fg-muted font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => {
                  const result = results?.find((res) => res.identifier === r.identifier)
                  return (
                    <tr key={i} className="border-b border-ui-border-base last:border-0">
                      <td className="py-2 px-4">
                        {r.identifier || <span className="text-ui-fg-muted">—</span>}
                      </td>
                      <td className="py-2 px-4">{r.price ?? <span className="text-ui-fg-muted">—</span>}</td>
                      <td className="py-2 px-4">
                        {r.sale_price ?? <span className="text-ui-fg-muted">—</span>}
                      </td>
                      <td className="py-2 px-4">
                        {result ? (
                          <Badge color={result.status === "ok" ? "green" : "red"} size="2xsmall">
                            {result.status === "ok" ? "Updated" : result.message ?? "Failed"}
                          </Badge>
                        ) : r.error ? (
                          <Badge color="red" size="2xsmall">
                            {r.error}
                          </Badge>
                        ) : (
                          <Badge color="grey" size="2xsmall">
                            Ready
                          </Badge>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

        {rows.length > 0 && (
          <Button
            variant="primary"
            isLoading={submitting}
            disabled={submitting || validRows.length === 0}
            onClick={apply}
          >
            Apply {validRows.length} price update{validRows.length === 1 ? "" : "s"}
          </Button>
        )}
      </div>
    </Container>
  )
}

export const config = defineRouteConfig({
  label: "Bulk Price Update",
  icon: CurrencyDollar,
})

export default BulkPriceUpdatePage
