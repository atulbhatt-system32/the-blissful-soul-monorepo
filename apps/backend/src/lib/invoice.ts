import PDFDocument from "pdfkit"

function formatCurrency(amount: number, currencyCode: string) {
  return `${Number(amount).toFixed(2)} ${currencyCode.toUpperCase()}`
}

function generateHeader(doc: PDFKit.PDFDocument, order: any) {
  doc
    .fillColor("#000000")
    .fontSize(28)
    .text("The Blissful Soul", 50, 50)
    .fontSize(10)
    .fillColor("#333333")
    .text("Premium Crystals & Services", 50, 80)
    
    .fontSize(24)
    .font("Helvetica-Bold")
    .text("INVOICE", 50, 50, { align: "right" })
    .font("Helvetica")
    .fontSize(10)
    .text(`Invoice Number: #${order.display_id}`, 50, 75, { align: "right" })
    .text(`Date: ${new Date(order.created_at).toLocaleDateString()}`, 50, 90, { align: "right" })
    
  doc.moveTo(50, 115).lineTo(550, 115).lineWidth(1).strokeColor("#DDDDDD").stroke()
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
    .fontSize(12)
    .font("Helvetica-Bold")
    .text("Bill To:", 50, 135)
    .font("Helvetica")
    .fontSize(10)
    .text(name, 50, 155)
    .text(address1, 50, 170)
  
  if (address2) doc.text(address2, 50, 185)
  
  doc.text(`${city}, ${postal}`, 50, address2 ? 200 : 185)
  doc.text(country, 50, address2 ? 215 : 200)

  // Order Details
  doc
    .font("Helvetica-Bold")
    .text("Payment Method:", 300, 135)
    .font("Helvetica")
    .text(order.payment_collections?.[0]?.payments?.[0]?.provider_id ? order.payment_collections[0].payments[0].provider_id.replace("_", " ").toUpperCase() : "Online Payment", 300, 155)
    .font("Helvetica-Bold")
    .text("Email:", 300, 180)
    .font("Helvetica")
    .text(order.email, 300, 195)
}

function generateTableRow(doc: PDFKit.PDFDocument, y: number, item: string, unitCost: string, quantity: string, lineTotal: string) {
  doc
    .fontSize(10)
    .text(item, 50, y)
    .text(unitCost, 280, y, { width: 90, align: "right" })
    .text(quantity, 370, y, { width: 90, align: "right" })
    .text(lineTotal, 0, y, { align: "right" })
}

function generateInvoiceTable(doc: PDFKit.PDFDocument, order: any) {
  let i
  const invoiceTableTop = 270

  doc.font("Helvetica-Bold")
  generateTableRow(doc, invoiceTableTop, "Item", "Unit Cost", "Quantity", "Total")
  doc.moveTo(50, invoiceTableTop + 15).lineTo(550, invoiceTableTop + 15).strokeColor("#AAAAAA").stroke()
  doc.font("Helvetica")

  const items = order.items || []
  let position = 0

  for (i = 0; i < items.length; i++) {
    const item = items[i]
    position = invoiceTableTop + 30 + (i * 30)
    
    generateTableRow(
      doc,
      position,
      item.title,
      formatCurrency(item.unit_price, order.currency_code),
      item.quantity.toString(),
      formatCurrency(item.subtotal ?? item.unit_price * item.quantity, order.currency_code)
    )
    
    doc.moveTo(50, position + 20).lineTo(550, position + 20).lineWidth(0.5).strokeColor("#EEEEEE").stroke()
  }

  // Summary section — compute subtotal from items since order-level totals
  // may not be populated by query.graph()
  const computedSubtotal = items.reduce((sum: number, item: any) => {
    return sum + (item.subtotal ?? item.unit_price * item.quantity)
  }, 0)
  const taxTotal = order.tax_total || 0
  const shippingTotal = order.shipping_total || 0
  const subtotal = order.subtotal || computedSubtotal
  const total = order.total || (subtotal + taxTotal + shippingTotal)

  const subtotalPosition = position + 40
  doc.font("Helvetica-Bold")

  doc.text("Subtotal:", 370, subtotalPosition + 10, { width: 90, align: "right" })
  doc.text(formatCurrency(subtotal, order.currency_code), 0, subtotalPosition + 10, { align: "right" })

  doc.text("GST:", 370, subtotalPosition + 30, { width: 90, align: "right" })
  doc.text(formatCurrency(taxTotal, order.currency_code), 0, subtotalPosition + 30, { align: "right" })

  doc.text("Shipping:", 370, subtotalPosition + 50, { width: 90, align: "right" })
  doc.text(formatCurrency(shippingTotal, order.currency_code), 0, subtotalPosition + 50, { align: "right" })

  doc.moveTo(370, subtotalPosition + 65).lineTo(550, subtotalPosition + 65).lineWidth(1).strokeColor("#000000").stroke()

  doc.fontSize(12)
  doc.text("Total:", 370, subtotalPosition + 80, { width: 90, align: "right" })
  doc.text(formatCurrency(total, order.currency_code), 0, subtotalPosition + 80, { align: "right" })
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
