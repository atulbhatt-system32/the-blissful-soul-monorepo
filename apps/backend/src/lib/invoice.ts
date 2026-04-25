import PDFDocument from "pdfkit"

// ──────────────────────────────────────────────
// Constants
// ──────────────────────────────────────────────
const COMPANY = {
  name: "The Blissful Soul",
  tagline: "The Blissful Soul Shakti Nagar",
  gstin: "07APLPV9864M1ZN",
  email: "theblissfulsoul27x1@gmail.com",
  website: "theblissfulsoul.in",
  phone: "PRAGYA VUH : 9811611341",
  state: "Delhi",
  stateCode: "07",
  signatory: "PRAGYA VUH",
}

const INDIA_STATE_CODES: Record<string, string> = {
  "jammu and kashmir": "01", "jammu & kashmir": "01",
  "himachal pradesh": "02",
  "punjab": "03",
  "chandigarh": "04",
  "uttarakhand": "05", "uttaranchal": "05",
  "haryana": "06",
  "delhi": "07",
  "rajasthan": "08",
  "uttar pradesh": "09",
  "bihar": "10",
  "sikkim": "11",
  "arunachal pradesh": "12",
  "nagaland": "13",
  "manipur": "14",
  "mizoram": "15",
  "tripura": "16",
  "meghalaya": "17",
  "assam": "18",
  "west bengal": "19",
  "jharkhand": "20",
  "odisha": "21", "orissa": "21",
  "chhattisgarh": "22",
  "madhya pradesh": "23",
  "gujarat": "24",
  "dadra and nagar haveli and daman and diu": "26",
  "maharashtra": "27",
  "karnataka": "29",
  "goa": "30",
  "lakshadweep": "31",
  "kerala": "32",
  "tamil nadu": "33",
  "puducherry": "34", "pondicherry": "34",
  "andaman and nicobar islands": "35",
  "telangana": "36",
  "andhra pradesh": "37",
  "ladakh": "38",
}

function getIndiaStateCode(province: string | null | undefined): string {
  if (!province) return ""
  return INDIA_STATE_CODES[province.trim().toLowerCase()] ?? ""
}

const GST_RATE_FALLBACK = 3 // Fallback GST % if no tax lines present on item


const MARGIN = 40
const PAGE_WIDTH = 595.28     // A4
const INNER_LEFT = MARGIN + 5
const INNER_RIGHT = PAGE_WIDTH - MARGIN - 5
const INNER_WIDTH = INNER_RIGHT - INNER_LEFT

// ──────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────
function fmt(n: number): string {
  return n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function numberToWords(num: number): string {
  const ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
    "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen",
    "Seventeen", "Eighteen", "Nineteen"]
  const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"]

  if (num === 0) return "Zero"

  function convert(n: number): string {
    if (n < 0) return "Minus " + convert(-n)
    let str = ""
    if (n >= 10000000) { str += convert(Math.floor(n / 10000000)) + " Crore "; n %= 10000000 }
    if (n >= 100000) { str += convert(Math.floor(n / 100000)) + " Lakh "; n %= 100000 }
    if (n >= 1000) { str += convert(Math.floor(n / 1000)) + " Thousand "; n %= 1000 }
    if (n >= 100) { str += convert(Math.floor(n / 100)) + " Hundred "; n %= 100 }
    if (n > 0) {
      if (str !== "") str += "and "
      if (n < 20) str += ones[n]
      else { str += tens[Math.floor(n / 10)]; if (n % 10) str += " " + ones[n % 10] }
    }
    return str.trim()
  }

  const whole = Math.floor(Math.round(num))
  return convert(whole) + " Rupees Only"
}

// Draw a bordered cell with text
function cell(
  doc: PDFKit.PDFDocument,
  x: number, y: number, w: number, h: number,
  text: string,
  opts?: { bold?: boolean; fontSize?: number; align?: "left" | "center" | "right"; bg?: string; color?: string; noBorder?: boolean; borderColor?: string }
) {
  const o = opts || {}
  const fs = o.fontSize || 7
  const border = o.borderColor || "#000000"

  if (o.bg) {
    doc.save().rect(x, y, w, h).fillColor(o.bg).fill().restore()
  }

  if (!o.noBorder) {
    doc.save().rect(x, y, w, h).lineWidth(0.5).strokeColor(border).stroke().restore()
  }

  doc
    .font(o.bold ? "Helvetica-Bold" : "Helvetica")
    .fontSize(fs)
    .fillColor(o.color || "#000000")
    .text(text, x + 2, y + (h - fs) / 2, {
      width: w - 4,
      height: h,
      align: o.align || "left",
      lineBreak: true,
    })
}

// Thin horizontal line
function hLine(doc: PDFKit.PDFDocument, x1: number, x2: number, y: number) {
  doc.save().moveTo(x1, y).lineTo(x2, y).lineWidth(0.5).strokeColor("#000000").stroke().restore()
}

// ──────────────────────────────────────────────
// MAIN GENERATOR
// ──────────────────────────────────────────────
export async function generateInvoice(order: any): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: MARGIN, size: "A4" })
      const buffers: Buffer[] = []
      doc.on("data", buffers.push.bind(buffers))
      doc.on("end", () => resolve(Buffer.concat(buffers)))
      doc.on("error", reject)

      // ── Outer border ──
      doc.rect(MARGIN, MARGIN, PAGE_WIDTH - MARGIN * 2, 770).lineWidth(1).strokeColor("#000000").stroke()

      let y = MARGIN + 5

      // ══════════════════════════════════════════
      // HEADER
      // ══════════════════════════════════════════
      doc.font("Helvetica-Bold").fontSize(18).fillColor("#000000")
        .text("Tax Invoice", INNER_LEFT, y + 5, { width: 200 })

      // "ORIGINAL" badge top-right
      doc.font("Helvetica-Bold").fontSize(10).fillColor("#D42B2B")
        .text("ORIGINAL", INNER_RIGHT - 70, y + 5, { width: 70, align: "right" })

      // GSTIN
      doc.font("Helvetica-Bold").fontSize(7).fillColor("#000000")
        .text(`GSTIN : ${COMPANY.gstin}`, INNER_LEFT, y + 30, { width: 250 })

      // Centered logo area – draw a diamond shape
      const logoX = PAGE_WIDTH / 2
      const logoY = y + 18
      const logoSize = 22
      doc.save()
        .moveTo(logoX, logoY - logoSize)
        .lineTo(logoX + logoSize, logoY)
        .lineTo(logoX, logoY + logoSize)
        .lineTo(logoX - logoSize, logoY)
        .closePath()
        .lineWidth(1.5)
        .strokeColor("#C5A059")
        .fillColor("#2C1E36")
        .fillAndStroke()
        .restore()

      // TBS text inside diamond
      doc.font("Helvetica-Bold").fontSize(5).fillColor("#C5A059")
        .text("TBS", logoX - 7, logoY - 3, { width: 14, align: "center" })

      // Company name under logo
      const nameBlockY = logoY + logoSize + 5
      doc.font("Helvetica-Bold").fontSize(8).fillColor("#000000")
        .text("The Blissful Soul", MARGIN, nameBlockY, { width: INNER_WIDTH, align: "center" })
      doc.font("Helvetica-Bold").fontSize(7).fillColor("#000000")
        .text("The Blissful Soul", MARGIN, nameBlockY + 10, { width: INNER_WIDTH, align: "center" })
      doc.font("Helvetica").fontSize(6).fillColor("#000000")
        .text(COMPANY.tagline, MARGIN, nameBlockY + 20, { width: INNER_WIDTH, align: "center" })

      // Contact row
      const contactY = nameBlockY + 34
      hLine(doc, INNER_LEFT, INNER_RIGHT, contactY)

      const contactRowH = 14
      const halfW = INNER_WIDTH / 2

      doc.font("Helvetica").fontSize(6).fillColor("#000000")
        .text(`✉ ${COMPANY.email}`, INNER_LEFT + 5, contactY + 3, { width: halfW - 10 })
      doc.text(`⊙ ${COMPANY.website}`, INNER_LEFT + halfW * 0.55, contactY + 3, { width: halfW * 0.45 })
      doc.text(`✆ ${COMPANY.phone}`, INNER_LEFT + halfW + 30, contactY + 3, { width: halfW - 35, align: "right" })

      hLine(doc, INNER_LEFT, INNER_RIGHT, contactY + contactRowH)

      // ══════════════════════════════════════════
      // INVOICE META (two rows)
      // ══════════════════════════════════════════
      const metaY = contactY + contactRowH
      const metaH = 14
      const col3 = INNER_WIDTH / 3
      const orderDate = new Date(order.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "2-digit", year: "numeric" })

      // Row 1
      cell(doc, INNER_LEFT, metaY, col3, metaH,
        `Invoice No: ${order.display_id}`, { fontSize: 6.5 })
      cell(doc, INNER_LEFT + col3, metaY, col3 * 0.7, metaH,
        `Order No: ${order.display_id}`, { fontSize: 6.5 })
      cell(doc, INNER_LEFT + col3 + col3 * 0.7, metaY, INNER_WIDTH - col3 - col3 * 0.7, metaH,
        `Order Date: ${orderDate}`, { fontSize: 6.5 })

      // Row 2
      const metaY2 = metaY + metaH
      cell(doc, INNER_LEFT, metaY2, col3, metaH,
        `Invoice Date: ${orderDate}`, { fontSize: 6.5 })
      cell(doc, INNER_LEFT + col3, metaY2, col3 * 0.7, metaH,
        `Date of Supply: ${orderDate}`, { fontSize: 6.5 })

      // Row 3 — State/Code/Place of supply
      const metaY3 = metaY2 + metaH
      const stateW1 = INNER_WIDTH * 0.35
      const codeW = INNER_WIDTH * 0.12
      const placeW = INNER_WIDTH - stateW1 - codeW

      cell(doc, INNER_LEFT, metaY3, stateW1, metaH,
        `State: ${COMPANY.state}`, { fontSize: 6.5 })
      cell(doc, INNER_LEFT + stateW1, metaY3, codeW, metaH,
        `Code  ${COMPANY.stateCode}`, { fontSize: 6.5 })
      cell(doc, INNER_LEFT + stateW1 + codeW, metaY3, placeW, metaH,
        `Place of Supply: ${COMPANY.state}`, { fontSize: 6.5 })

      // ══════════════════════════════════════════
      // BILL TO / SHIP TO SECTION
      // ══════════════════════════════════════════
      const billY = metaY3 + metaH + 8
      const halfCol = INNER_WIDTH / 2
      const addrRowH = 13

      // Section Header
      cell(doc, INNER_LEFT, billY, halfCol, addrRowH + 2,
        "BILL TO PARTY", { bold: true, fontSize: 7, align: "center", bg: "#F0F0F0" })
      cell(doc, INNER_LEFT + halfCol, billY, halfCol, addrRowH + 2,
        "SHIP TO PARTY / DELIVERY ADDRESS", { bold: true, fontSize: 7, align: "center", bg: "#F0F0F0" })

      const name = `${order.shipping_address?.first_name || ""} ${order.shipping_address?.last_name || ""}`.trim()
      const addr1 = order.shipping_address?.address_1 || ""
      const addr2 = order.shipping_address?.address_2 || ""
      const fullAddr = `${addr1}${addr2 ? ", " + addr2 : ""}, ${order.shipping_address?.city || ""}, Pin code - ${order.shipping_address?.postal_code || ""}`
      const phone = order.shipping_address?.phone || ""
      const customerState = order.shipping_address?.province || COMPANY.state
      const customerCountry = (order.shipping_address?.country_code || "IN").toUpperCase() === "IN" ? "India" : (order.shipping_address?.country_code || "").toUpperCase()

      // Billing Name
      const billToLeft = INNER_LEFT
      const shipToLeft = INNER_LEFT + halfCol
      let addrY = billY + addrRowH + 2

      cell(doc, billToLeft, addrY, halfCol, addrRowH, name, { fontSize: 7, bold: true })
      cell(doc, shipToLeft, addrY, halfCol, addrRowH, name, { fontSize: 7, bold: true })
      addrY += addrRowH

      // Address
      cell(doc, billToLeft, addrY, halfCol, addrRowH * 1.5, fullAddr, { fontSize: 6 })
      cell(doc, shipToLeft, addrY, halfCol, addrRowH * 1.5, fullAddr, { fontSize: 6 })
      addrY += addrRowH * 1.5

      // Phone
      cell(doc, billToLeft, addrY, halfCol, addrRowH, `Phone: ${phone}`, { fontSize: 6.5 })
      cell(doc, shipToLeft, addrY, halfCol, addrRowH, `Phone: ${phone}`, { fontSize: 6.5 })
      addrY += addrRowH

      // GSTIN
      cell(doc, billToLeft, addrY, halfCol, addrRowH, `GSTIN:`, { fontSize: 6.5 })
      cell(doc, shipToLeft, addrY, halfCol, addrRowH, `GSTIN:`, { fontSize: 6.5 })
      addrY += addrRowH

      // State / Code / Country
      const sW = halfCol * 0.42
      const cW = halfCol * 0.18
      const ctW = halfCol * 0.40

      const customerStateCode = getIndiaStateCode(order.shipping_address?.province)
      cell(doc, billToLeft, addrY, sW, addrRowH, `State: ${customerState}`, { fontSize: 6.5 })
      cell(doc, billToLeft + sW, addrY, cW, addrRowH, `Code  ${customerStateCode}`, { fontSize: 6.5 })
      cell(doc, billToLeft + sW + cW, addrY, ctW, addrRowH, `Country: ${customerCountry}`, { fontSize: 6.5 })
      cell(doc, shipToLeft, addrY, sW, addrRowH, `State: ${customerState}`, { fontSize: 6.5 })
      cell(doc, shipToLeft + sW, addrY, cW, addrRowH, `Code  ${customerStateCode}`, { fontSize: 6.5 })
      cell(doc, shipToLeft + sW + cW, addrY, ctW, addrRowH, `Country: ${customerCountry}`, { fontSize: 6.5 })
      addrY += addrRowH

      // ══════════════════════════════════════════
      // ITEMS TABLE
      // ══════════════════════════════════════════
      const items = order.items || []
      const tableY = addrY + 10
      const tH = 14 // row height
      // Column widths: #, ITEM-SKU, QTY, RATE, DISCOUNT, TAXABLE, HSN, GST%, CGST, SGST, TOTAL
      // Total must fit INNER_WIDTH (~505px)
      const cols = [18, 88, 24, 52, 52, 55, 24, 24, 52, 52, 65]
      const colHeaders = ["#", "ITEM - SKU", "QTY", "RATE PER\nITEM(₹)", "DISCOUNT\nITEM(₹)", "TAXABLE\nITEM(₹)", "HSN", "GST\n(%)", "CGST\n(₹)", "SGST\n(₹)", "TOTAL\n(₹)"]

      // Table Header
      let colX = INNER_LEFT
      for (let i = 0; i < cols.length; i++) {
        cell(doc, colX, tableY, cols[i], tH + 6, colHeaders[i], {
          bold: true, fontSize: 5.8, align: "center", bg: "#F5F5F5"
        })
        colX += cols[i]
      }

      // Table rows
      let rowY = tableY + tH + 6
      let totalQty = 0
      let grandItemTotal = 0

      const itemRows: Array<{
        title: string; qty: number; rate: number; discount: number;
        taxable: number; gstPct: number; cgst: number; sgst: number; total: number
      }> = []

      for (let i = 0; i < items.length; i++) {
        const item = items[i]
        const qty = item.quantity || 1
        const rate = item.unit_price || 0
        const grossAmount = rate * qty
        const adjustmentTotal = (item.adjustments || []).reduce((s: number, a: any) => s + (a.amount ?? 0), 0)

        // Read GST rate from Medusa tax lines; fall back to default if not present
        const taxLines = item.tax_lines || []
        const gstPct = taxLines.reduce((sum: number, t: any) => sum + (t.rate ?? 0), 0) || GST_RATE_FALLBACK

        // Scale pre-tax adjustment to tax-inclusive so discount matches the price customer sees
        const discount = Math.min(grossAmount, adjustmentTotal * (1 + gstPct / 100))
        const grossAfterDiscount = grossAmount - discount

        // Prices are tax-inclusive — back-calculate the pre-tax (taxable) amount
        const taxable = grossAfterDiscount / (1 + gstPct / 100)
        const cgst = (grossAfterDiscount - taxable) / 2
        const sgst = (grossAfterDiscount - taxable) / 2
        const total = grossAfterDiscount // total is the tax-inclusive price

        totalQty += qty
        grandItemTotal += total

        itemRows.push({ title: item.title || "Item", qty, rate, discount, taxable, gstPct, cgst, sgst, total })

        // Determine row height based on title length
        const titleLines = Math.ceil((item.title || "Item").length / 14)
        const rH = Math.max(tH, titleLines * 8 + 6)

        colX = INNER_LEFT
        cell(doc, colX, rowY, cols[0], rH, `${i + 1}`, { fontSize: 6.5, align: "center" }); colX += cols[0]
        cell(doc, colX, rowY, cols[1], rH, item.title || "Item", { fontSize: 6 }); colX += cols[1]
        cell(doc, colX, rowY, cols[2], rH, `${qty}`, { fontSize: 6.5, align: "center" }); colX += cols[2]
        cell(doc, colX, rowY, cols[3], rH, fmt(rate), { fontSize: 6.5, align: "right" }); colX += cols[3]
        cell(doc, colX, rowY, cols[4], rH, fmt(discount), { fontSize: 6.5, align: "right" }); colX += cols[4]
        cell(doc, colX, rowY, cols[5], rH, fmt(taxable), { fontSize: 6.5, align: "right" }); colX += cols[5]
        const hsnCode = item.variant?.hs_code || item.variant?.product?.hs_code || item.metadata?.hs_code || ""
        cell(doc, colX, rowY, cols[6], rH, hsnCode, { fontSize: 6.5, align: "center" }); colX += cols[6]
        cell(doc, colX, rowY, cols[7], rH, `${gstPct}`, { fontSize: 6.5, align: "center" }); colX += cols[7]
        cell(doc, colX, rowY, cols[8], rH, fmt(cgst), { fontSize: 6.5, align: "right" }); colX += cols[8]
        cell(doc, colX, rowY, cols[9], rH, fmt(sgst), { fontSize: 6.5, align: "right" }); colX += cols[9]
        cell(doc, colX, rowY, cols[10], rH, fmt(total), { fontSize: 6.5, align: "right" })

        rowY += rH
      }

      // TOTAL row
      colX = INNER_LEFT
      cell(doc, colX, rowY, cols[0] + cols[1], tH, "TOTAL", { bold: true, fontSize: 7, align: "center", bg: "#F5F5F5" }); colX = INNER_LEFT + cols[0] + cols[1]
      cell(doc, colX, rowY, cols[2], tH, `${totalQty}`, { bold: true, fontSize: 7, align: "center", bg: "#F5F5F5" }); colX += cols[2]
      // Empty cells for rate through sgst
      for (let c = 3; c < cols.length - 1; c++) {
        cell(doc, colX, rowY, cols[c], tH, "", { bg: "#F5F5F5" }); colX += cols[c]
      }
      cell(doc, colX, rowY, cols[cols.length - 1], tH, fmt(grandItemTotal), { bold: true, fontSize: 7, align: "right", bg: "#F5F5F5" })

      rowY += tH

      // ══════════════════════════════════════════
      // SUMMARY SECTION (bottom half)
      // ══════════════════════════════════════════
      const summaryY = rowY + 5
      const sumH = 13
      const leftHalf = INNER_WIDTH * 0.55
      const rightHalf = INNER_WIDTH * 0.45

      // Compute totals
      const totalTaxableAmount = itemRows.reduce((s, r) => s + r.taxable, 0)
      const totalCGST = itemRows.reduce((s, r) => s + r.cgst, 0)
      const totalSGST = itemRows.reduce((s, r) => s + r.sgst, 0)
      const totalTax = totalCGST + totalSGST
      // Use Medusa's own computed shipping_total (net after all promos — already 0 for free shipping)
      const shippingTotal = order.shipping_total ?? 0
      // Use tax-inclusive discount from itemRows (already scaled above)
      const itemDiscounts = itemRows.reduce((s, r) => s + r.discount, 0)
      const shippingGross = (order.shipping_methods || []).reduce((sum: number, sm: any) => sum + (sm.amount ?? 0), 0)
      const shippingDiscounts = Math.max(0, shippingGross - shippingTotal)
      const discountTotal = itemDiscounts + shippingDiscounts

      const totalAfterTax = totalTaxableAmount + totalTax + shippingTotal
      const roundedTotal = Math.round(totalAfterTax)
      const roundOff = roundedTotal - totalAfterTax

      // Payment Mode + Terms (left), Totals (right)
      const paymentMethod = order.payment_collections?.[0]?.payments?.[0]?.provider_id
        ? order.payment_collections[0].payments[0].provider_id.replace(/_/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase())
        : "Credit Card/Debit Card/NetBanking"

      // LEFT Side
      cell(doc, INNER_LEFT, summaryY, leftHalf, sumH,
        `Payment Mode : ${paymentMethod}`, { fontSize: 6, bold: true })

      // RIGHT Side — Total amount before Tax
      const rX = INNER_LEFT + leftHalf
      const labelW = rightHalf * 0.6
      const valW = rightHalf * 0.4

      let rY = summaryY
      cell(doc, rX, rY, labelW, sumH, "Total amount before Tax(₹)", { fontSize: 6 })
      cell(doc, rX + labelW, rY, valW, sumH, fmt(totalTaxableAmount), { fontSize: 6, align: "right" })
      rY += sumH

      // Terms left
      cell(doc, INNER_LEFT, summaryY + sumH, leftHalf, sumH,
        "Terms and Conditions", { fontSize: 6, bold: true })

      cell(doc, rX, rY, labelW, sumH, "Total tax Amount(₹)", { fontSize: 6 })
      cell(doc, rX + labelW, rY, valW, sumH, fmt(totalTax), { fontSize: 6, align: "right" })
      rY += sumH

      // Promotion Discount
      const promoCodes = (order.promotions || []).map((p: any) => p.code).filter(Boolean).join(", ")
      const promoLabel = promoCodes ? `Promo Discount (${promoCodes})(₹)` : "Promotion Discount(₹)"
      cell(doc, rX, rY, labelW, sumH, promoLabel, { fontSize: 6 })
      cell(doc, rX + labelW, rY, valW, sumH, discountTotal > 0 ? `- ${fmt(discountTotal)}` : "-", { fontSize: 6, align: "right" })
      rY += sumH

      // Total Invoice Amount in Words (left)
      const wordsY = summaryY + sumH * 2
      cell(doc, INNER_LEFT, wordsY, leftHalf, sumH,
        "Total Invoice Amount in Words", { fontSize: 6, bold: true })
      cell(doc, INNER_LEFT, wordsY + sumH, leftHalf, sumH * 2,
        numberToWords(roundedTotal), { fontSize: 6 })

      // Shipping
      cell(doc, rX, rY, labelW, sumH, "Shipping Amount(₹)", { fontSize: 6 })
      cell(doc, rX + labelW, rY, valW, sumH, fmt(shippingTotal), { fontSize: 6, align: "right" })
      rY += sumH

      // Total amount after Tax
      cell(doc, rX, rY, labelW, sumH, "Total amount after Tax(₹)", { fontSize: 6 })
      cell(doc, rX + labelW, rY, valW, sumH, fmt(totalAfterTax), { fontSize: 6, align: "right" })
      rY += sumH

      // Round Off
      cell(doc, rX, rY, labelW, sumH, "Round Off", { fontSize: 6 })
      cell(doc, rX + labelW, rY, valW, sumH, `${roundOff >= 0 ? "(+)" : "(-)"}${fmt(Math.abs(roundOff))}`, { fontSize: 6, align: "right" })
      rY += sumH

      // FINAL TOTAL
      cell(doc, rX, rY, labelW, sumH + 2, "TOTAL(₹)", { fontSize: 7, bold: true, bg: "#F5F5F5" })
      cell(doc, rX + labelW, rY, valW, sumH + 2, fmt(roundedTotal), { fontSize: 7, bold: true, align: "right", bg: "#F5F5F5" })
      rY += sumH + 2

      // ══════════════════════════════════════════
      // FOOTER
      // ══════════════════════════════════════════
      const footerTop = Math.max(rY + 12, wordsY + sumH * 3 + 12)

      // E. & O.E.
      doc.font("Helvetica").fontSize(6).fillColor("#000000")
        .text("E. & O.E", INNER_LEFT, footerTop)

      // "For, The Blissful Soul" — right side
      doc.font("Helvetica-Bold").fontSize(8).fillColor("#000000")
        .text("For, The Blissful Soul", INNER_RIGHT - 160, footerTop, { width: 160, align: "right" })

      // Signatory name
      doc.font("Helvetica-Bold").fontSize(7).fillColor("#C5A059")
        .text(COMPANY.signatory, INNER_RIGHT - 160, footerTop + 30, { width: 160, align: "right" })
      doc.font("Helvetica").fontSize(6).fillColor("#000000")
        .text("Authorised Signature", INNER_RIGHT - 160, footerTop + 42, { width: 160, align: "right" })

      // Computer generated notice
      doc.font("Helvetica").fontSize(5).fillColor("#999999")
        .text("This is a computer-generated invoice.", MARGIN, footerTop + 50, { width: INNER_WIDTH, align: "center" })

      doc.end()
    } catch (e) {
      reject(e)
    }
  })
}
