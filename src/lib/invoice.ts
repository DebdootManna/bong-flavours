// import puppeteer from 'puppeteer'
// Puppeteer temporarily disabled for faster deployment
// TODO: Re-enable for invoice generation feature

interface InvoiceData {
  orderId: string
  customerName: string
  customerEmail: string
  customerPhone: string
  deliveryAddress: string
  items: Array<{
    name: string
    quantity: number
    price: number
  }>
  subtotal: number
  tax: number
  total: number
  orderDate: string
  paymentMethod: string
}

// Temporarily disabled for faster deployment
// TODO: Re-enable for invoice functionality
/*
function generateInvoiceHTML(data: InvoiceData): string {
  const itemsHTML = data.items.map(item => `
    <tr>
      <td class="item-name">${item.name}</td>
      <td class="item-qty">${item.quantity}</td>
      <td class="item-price">₹${item.price.toFixed(2)}</td>
      <td class="item-total">₹${(item.quantity * item.price).toFixed(2)}</td>
    </tr>
  `).join('')

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Invoice #${data.orderId}</title>
      <style>
        body {
          font-family: 'Arial', sans-serif;
          margin: 0;
          padding: 20px;
          color: #333;
          background: white;
        }
        .invoice-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 30px;
          border-bottom: 3px solid #6F1D1B;
          padding-bottom: 20px;
        }
        .company-info h1 {
          color: #6F1D1B;
          margin: 0;
          font-size: 28px;
          font-weight: bold;
        }
        .company-info p {
          margin: 5px 0;
          color: #666;
        }
        .invoice-info {
          text-align: right;
        }
        .invoice-info h2 {
          color: #6F1D1B;
          margin: 0;
          font-size: 24px;
        }
        .invoice-info p {
          margin: 5px 0;
          color: #666;
        }
        .customer-info {
          background: #f9f9f9;
          padding: 20px;
          border-radius: 8px;
          margin-bottom: 30px;
        }
        .customer-info h3 {
          color: #6F1D1B;
          margin: 0 0 15px 0;
          font-size: 18px;
        }
        .customer-info p {
          margin: 5px 0;
          color: #333;
        }
        .items-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 30px;
        }
        .items-table th {
          background: #6F1D1B;
          color: white;
          padding: 12px;
          text-align: left;
          font-weight: bold;
        }
        .items-table td {
          padding: 12px;
          border-bottom: 1px solid #ddd;
        }
        .item-qty, .item-price, .item-total {
          text-align: right;
        }
        .totals {
          float: right;
          width: 300px;
        }
        .totals table {
          width: 100%;
          border-collapse: collapse;
        }
        .totals td {
          padding: 8px 12px;
          border-bottom: 1px solid #ddd;
        }
        .totals .label {
          text-align: right;
          font-weight: bold;
        }
        .totals .amount {
          text-align: right;
        }
        .total-row {
          background: #f0f0f0;
          font-weight: bold;
          font-size: 16px;
        }
        .total-row .amount {
          color: #6F1D1B;
        }
        .footer {
          clear: both;
          margin-top: 50px;
          padding-top: 20px;
          border-top: 2px solid #6F1D1B;
          text-align: center;
          color: #666;
        }
        .payment-info {
          background: #fff3cd;
          border: 1px solid #ffeaa7;
          border-radius: 5px;
          padding: 15px;
          margin: 20px 0;
          text-align: center;
        }
        .payment-info strong {
          color: #856404;
        }
      </style>
    </head>
    <body>
      <div class="invoice-header">
        <div class="company-info">
          <h1>Bong Flavours</h1>
          <p>Authentic Bengali Restaurant</p>
          <p>Phone: ${process.env.NEXT_PUBLIC_RESTAURANT_PHONE || '8238018577'}</p>
          <p>Email: ${process.env.NEXT_PUBLIC_RESTAURANT_EMAIL || 'mannadebdoot007@gmail.com'}</p>
        </div>
        <div class="invoice-info">
          <h2>INVOICE</h2>
          <p><strong>Invoice #:</strong> ${data.orderId}</p>
          <p><strong>Date:</strong> ${data.orderDate}</p>
        </div>
      </div>

      <div class="customer-info">
        <h3>Bill To:</h3>
        <p><strong>${data.customerName}</strong></p>
        <p>Email: ${data.customerEmail}</p>
        <p>Phone: ${data.customerPhone}</p>
        <p>Delivery Address: ${data.deliveryAddress}</p>
      </div>

      <table class="items-table">
        <thead>
          <tr>
            <th>Item Description</th>
            <th style="width: 80px;">Qty</th>
            <th style="width: 100px;">Price</th>
            <th style="width: 100px;">Total</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHTML}
        </tbody>
      </table>

      <div class="totals">
        <table>
          <tr>
            <td class="label">Subtotal:</td>
            <td class="amount">₹${data.subtotal.toFixed(2)}</td>
          </tr>
          <tr>
            <td class="label">Tax:</td>
            <td class="amount">₹${data.tax.toFixed(2)}</td>
          </tr>
          <tr class="total-row">
            <td class="label">Total:</td>
            <td class="amount">₹${data.total.toFixed(2)}</td>
          </tr>
        </table>
      </div>

      <div class="payment-info">
        <strong>Payment Method: ${data.paymentMethod}</strong>
      </div>

      <div class="footer">
        <p>Thank you for choosing Bong Flavours!</p>
        <p>For any queries regarding this invoice, please contact us at ${process.env.NEXT_PUBLIC_RESTAURANT_PHONE || '8238018577'}</p>
      </div>
    </body>
    </html>
  `
}
*/

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function generateInvoicePDF(_data: InvoiceData): Promise<Buffer> {
  // Temporarily disabled for faster deployment
  // TODO: Re-enable puppeteer functionality
  throw new Error('PDF generation temporarily disabled')
  
  /*
  const html = generateInvoiceHTML(data)
  
  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
    headless: true
  })
  
  try {
    const page = await browser.newPage()
    await page.setContent(html, { waitUntil: 'networkidle0' })
    
    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20px',
        right: '20px',
        bottom: '20px',
        left: '20px'
      }
    })
    
    return Buffer.from(pdf)
  } finally {
    await browser.close()
  }
  */
}

export function calculateOrderTotals(items: Array<{ price: number; quantity: number }>) {
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const taxRate = 0.05 // 5% tax
  const tax = subtotal * taxRate
  const total = subtotal + tax
  
  return { subtotal, tax, total }
}
