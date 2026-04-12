import PDFDocument from "pdfkit"

function formatCurrency(amount: number, currencyCode: string) {
  const code = (currencyCode || "INR").toUpperCase()
  const val = isNaN(Number(amount)) ? 0 : Number(amount)
  return `${val.toFixed(2)} ${code}`
}

function generateHeader(doc: PDFKit.PDFDocument, order: any) {
  doc
    .fillColor("#000000")
    .fontSize(22)
    .font("Helvetica-Bold")
    .text("The Blissful Soul", 50, 50)
    .fontSize(10)
    .font("Helvetica")
    .fillColor("#666666")
    .text("Premium Crystals & Services", 50, 75)
    .text("Shakti Nagar, Delhi 110007", 50, 88)
    .text("GSTIN: 07AAAAA0000A1Z5", 50, 101) // Placeholder GSTIN
    
    .fontSize(24)
    .fillColor("#000000")
    .font("Helvetica-Bold")
    .text("TAX INVOICE", 50, 50, { align: "right" })
    .font("Helvetica")
    .fontSize(10)
    .text(`Invoice No: INV-${order.display_id}`, 50, 80, { align: "right" })
    .text(`Order ID: #${order.display_id}`, 50, 93, { align: "right" })
    .text(`Date: ${new Date(order.created_at).toLocaleDateString()}`, 50, 106, { align: "right" })
    
  doc.moveTo(50, 125).lineTo(550, 125).lineWidth(1).strokeColor("#EEEEEE").stroke()
}

function generateCustomerInformation(doc: PDFKit.PDFDocument, order: any) {
  const name = `${order.shipping_address?.first_name || ""} ${order.shipping_address?.last_name || ""}`.trim()
  const address1 = order.shipping_address?.address_1 || ""
  const address2 = order.shipping_address?.address_2 || ""
  const city = order.shipping_address?.city || ""
  const postal = order.shipping_address?.postal_code || ""
  const country = order.shipping_address?.country_code?.toUpperCase() || ""

  doc
    .fillColor("#000000")
    .fontSize(11)
    .font("Helvetica-Bold")
    .text("BILL TO:", 50, 145)
    .font("Helvetica")
    .fontSize(10)
    .text(name, 50, 165)
    .text(address1, 50, 180)
  
  if (address2) doc.text(address2, 50, 195)
  
  doc.text(`${city}, ${postal}`, 50, address2 ? 210 : 195)
  doc.text(country, 50, address2 ? 225 : 210)

  // Order Details
  doc
    .font("Helvetica-Bold")
    .text("PAYMENT INFO:", 350, 145)
    .font("Helvetica")
    .text(`Method: ${order.payment_collections?.[0]?.payments?.[0]?.provider_id ? order.payment_collections[0].payments[0].provider_id.replace("_", " ").toUpperCase() : "Online Payment"}`, 350, 165)
    .text(`Email: ${order.email}`, 350, 180)
    .text(`Phone: ${order.shipping_address?.phone || "N/A"}`, 350, 195)
}

function generateTableRow(doc: PDFKit.PDFDocument, y: number, item: string, unitPrice: string, quantity: string, lineTotal: string, originalTotal?: string) {
  doc
    .fontSize(10)
    .fillColor("#000000")
    .text(item, 50, y, { width: 220 })
    .text(unitPrice, 280, y, { width: 90, align: "right" })
    .text(quantity, 370, y, { width: 90, align: "right" })

  if (originalTotal && originalTotal !== lineTotal) {
    const originalWidth = doc.widthOfString(originalTotal)
    const totalX = 550 - originalWidth // Align right
    
    doc
      .fillColor("#999999")
      .text(originalTotal, 0, y, { align: "right" })
    
    // Draw strikeout line
    doc
      .moveTo(550 - originalWidth, y + 5)
      .lineTo(550, y + 5)
      .lineWidth(0.5)
      .strokeColor("#999999")
      .stroke()
      
    doc
      .fillColor("#4F46E5")
      .font("Helvetica-Bold")
      .text(lineTotal, 0, y + 12, { align: "right" })
      .font("Helvetica")
      .fillColor("#000000")
  } else {
    doc.text(lineTotal, 0, y, { align: "right" })
  }
}

function generateInvoiceTable(doc: PDFKit.PDFDocument, order: any) {
  let i
  const invoiceTableTop = 270

  doc.font("Helvetica-Bold")
    .fillColor("#333333")
  generateTableRow(doc, invoiceTableTop, "Description", "Unit Price", "Qty", "Amount")
  doc.moveTo(50, invoiceTableTop + 15).lineTo(550, invoiceTableTop + 15).strokeColor("#AAAAAA").stroke()
  doc.font("Helvetica").fillColor("#000000")

  const items = order.items || []
  let currentY = invoiceTableTop + 30

  for (i = 0; i < items.length; i++) {
    const item = items[i]
    
    const itemSubtotal = (item.unit_price || 0) * (item.quantity || 0)
    const adjustmentTotal = (item.adjustments || []).reduce((sum: number, adj: any) => sum + (adj.amount ?? 0), 0)
    const itemTotal = item.total ?? (itemSubtotal - adjustmentTotal)

    generateTableRow(
      doc,
      currentY,
      item.title,
      formatCurrency(item.unit_price, order.currency_code),
      item.quantity.toString(),
      formatCurrency(itemTotal, order.currency_code),
      formatCurrency(itemSubtotal, order.currency_code)
    )
    
    const adjustmentLabels = (item.adjustments || [])
      .map((a: any) => a.description || a.code)
      .filter(Boolean)

    if (adjustmentLabels.length > 0) {
      doc
        .fontSize(8)
        .fillColor("#4F46E5")
        .text(`Applied: ${adjustmentLabels.join(", ")} (-${formatCurrency(adjustmentTotal, order.currency_code)})`, 50, currentY + 12)
        .fillColor("#000000")
        .fontSize(10)
      
      currentY += (itemSubtotal !== itemTotal ? 15 : 12)
    }
    
    doc.moveTo(50, currentY + 18).lineTo(550, currentY + 18).lineWidth(0.5).strokeColor("#EEEEEE").stroke()
    currentY += (itemSubtotal !== itemTotal ? 35 : 30)
  }

  // Summary section — compute robust totals
  const rawItemSubtotal = items.reduce((sum: number, item: any) => {
    return sum + ((item.unit_price || 0) * (item.quantity || 0))
  }, 0)

  const shippingTotal = order.shipping_total ?? (order.shipping_methods || []).reduce(
    (sum: number, sm: any) => sum + (sm.amount ?? 0),
    0
  )

  const itemDiscounts = items.reduce((sum: number, item: any) => {
    return sum + (item.adjustments || []).reduce((s: number, a: any) => s + (a.amount ?? 0), 0)
  }, 0)
  
  const shippingDiscounts = (order.shipping_methods || []).reduce((sum: number, sm: any) => {
    return sum + (sm.adjustments || []).reduce((s: number, a: any) => s + (a.amount ?? 0), 0)
  }, 0)

  const discountTotal = order.discount_total || (itemDiscounts + shippingDiscounts)
  const taxTotal = order.tax_total || 0
  
  const subtotal = order.subtotal || (rawItemSubtotal + shippingTotal)
  const total = order.total || (subtotal - discountTotal + taxTotal)

  const shippingMethodName = order.shipping_methods?.[0]?.name || "Shipping"

  const subtotalPosition = currentY + 10
  doc.font("Helvetica-Bold")

  doc.text("Gross Subtotal:", 370, subtotalPosition + 10, { width: 90, align: "right" })
  doc.text(formatCurrency(subtotal, order.currency_code), 0, subtotalPosition + 10, { align: "right" })

  let currentSummaryY = subtotalPosition + 30

  if (discountTotal > 0) {
    doc.text("Total Savings:", 370, currentSummaryY, { width: 90, align: "right" })
    doc.text(`- ${formatCurrency(discountTotal, order.currency_code)}`, 0, currentSummaryY, { align: "right" })
    currentSummaryY += 20
  }

  doc.text("Tax/GST:", 370, currentSummaryY, { width: 90, align: "right" })
  doc.text(formatCurrency(taxTotal, order.currency_code), 0, currentSummaryY, { align: "right" })
  currentSummaryY += 20

  doc.text(`${shippingMethodName}:`, 370, currentSummaryY, { width: 90, align: "right" })
  doc.text(formatCurrency(shippingTotal, order.currency_code), 0, currentSummaryY, { align: "right" })
  currentSummaryY += 20

  doc.moveTo(370, currentSummaryY + 5).lineTo(550, currentSummaryY + 5).lineWidth(1).strokeColor("#000000").stroke()

  doc.fontSize(12)
  doc.text("Grand Total:", 370, currentSummaryY + 20, { width: 90, align: "right" })
  doc.text(formatCurrency(total, order.currency_code), 0, currentSummaryY + 20, { align: "right" })
  doc.fontSize(10)
}

function generateFooter(doc: PDFKit.PDFDocument) {
  doc
    .fontSize(10)
    .font("Helvetica-Oblique")
    .text(
      "Thank you for shopping with The Blissful Soul!",
      50,
      700,
      { align: "center", width: 500 }
    )
    .fontSize(8)
    .font("Helvetica")
    .text(
      "This is a computer-generated invoice and does not require a physical signature.",
      50,
      720,
      { align: "center", width: 500 }
    )
    .fontSize(10)
    .font("Helvetica-Bold")
    .text(
      "Authorized Signatory [The Blissful Soul]",
      50,
      740,
      { align: "right", width: 500 }
    )
}

export async function generateInvoice(order: any): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50, size: "A4" })
      const buffers: Buffer[] = []
      
      doc.on("data", buffers.push.bind(buffers))
      doc.on("end", () => resolve(Buffer.concat(buffers)))
      doc.on("error", reject)

      generateHeader(doc, order)
      generateCustomerInformation(doc, order)
      generateInvoiceTable(doc, order)
      generateFooter(doc)

      doc.end()
    } catch (e) {
      reject(e)
    }
  })
}
