import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Order from '@/models/Order'
import { verifyToken } from '@/lib/auth'
import { generateInvoicePDF } from '@/lib/invoice'

interface OrderItem {
  menuItemId: string
  name: string
  price: number
  quantity: number
  variant?: string
  specialInstructions?: string
}

// GET /api/invoices/[orderId] - Generate and download invoice
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await context.params

    // Verify authentication - check both header and cookie
    let token = req.headers.get('authorization')?.replace('Bearer ', '')

    if (!token) {
      // Fallback to cookie
      token = req.cookies.get('auth-token')?.value
    }

    if (!token) {
      return NextResponse.json({ message: 'Not authenticated' }, { status: 401 })
    }

    const payload = verifyToken(token)

    await dbConnect()

    // Find order
    const query: { _id: string; userId?: string } = { _id: orderId }

    // If not admin, only allow access to own orders
    if (payload.role !== 'admin') {
      query.userId = payload.id
    }

    const order = await Order.findOne(query)
      .populate('userId', 'name email phone')

    if (!order) {
      return NextResponse.json({ message: 'Order not found' }, { status: 404 })
    }

    // Allow invoice generation for all orders (removed status restriction)
    // In a real app, you might want to restrict this based on business rules

    // Prepare invoice data
    const invoiceData = {
      orderId: order.orderNumber,
      customerName: order.customerInfo.name,
      customerEmail: order.customerInfo.email,
      customerPhone: order.customerInfo.phone,
      deliveryAddress: order.deliveryInfo.address,
      items: order.items.map((item: OrderItem) => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price
      })),
      subtotal: order.subtotal,
      tax: order.tax,
      deliveryFee: order.deliveryFee || 40,
      total: order.total,
      orderDate: new Date(order.createdAt).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      paymentMethod: order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'
    }

    // Try PDF generation first
    try {
      console.log('📄 Attempting PDF generation for order:', order.orderNumber)
      const pdfBuffer = await generateInvoicePDF(invoiceData)

      // Update order with invoice URL
      await Order.findByIdAndUpdate(order._id, { invoiceUrl: `/api/invoices/${order._id}` })

      console.log('✅ PDF generated successfully, returning PDF')
      return new NextResponse(pdfBuffer as unknown as BodyInit, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="invoice-${order.orderNumber}.pdf"`,
          'Content-Length': pdfBuffer.length.toString()
        }
      })

    } catch (pdfError) {
      console.error('❌ PDF generation failed:', pdfError)
      console.log('🔄 Falling back to HTML invoice')

      // Return enhanced HTML invoice as fallback
      const htmlInvoice = generateInvoiceHTML(order)

      return new NextResponse(htmlInvoice, {
        headers: {
          'Content-Type': 'text/html',
          'Content-Disposition': `inline; filename="invoice-${order.orderNumber}.html"`,
          'Cache-Control': 'no-cache'
        }
      })
    }

  } catch (error) {
    console.error('Generate invoice error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Enhanced HTML invoice generator with better styling and print support
function generateInvoiceHTML(order: {
  orderNumber: string
  createdAt: Date
  status: string
  paymentMethod: string
  paymentStatus: string
  customerInfo: { name: string; email: string; phone: string; address: string }
  deliveryInfo?: { address: string; phone: string; deliveryNotes?: string }
  items: Array<{ name: string; quantity: number; price: number; variant?: string; specialInstructions?: string }>
  subtotal: number
  tax: number
  deliveryFee?: number
  total: number
  notes?: string
}): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Invoice - ${order.orderNumber}</title>
  <style>
    * { box-sizing: border-box; }
    body {
      font-family: 'Arial', sans-serif;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
      color: #333;
      line-height: 1.6;
      background: white;
    }
    .header {
      text-align: center;
      border-bottom: 3px solid #6F1D1B;
      padding-bottom: 20px;
      margin-bottom: 30px;
    }
    .restaurant-name {
      font-size: 2.5em;
      color: #6F1D1B;
      margin: 0;
      font-weight: bold;
    }
    .restaurant-info {
      margin-top: 10px;
      color: #666;
      font-size: 14px;
    }
    .invoice-details {
      display: flex;
      justify-content: space-between;
      margin-bottom: 30px;
      flex-wrap: wrap;
    }
    .invoice-number {
      font-size: 1.3em;
      font-weight: bold;
      color: #6F1D1B;
    }
    .customer-details {
      background: #f9f9f9;
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 30px;
      border-left: 4px solid #6F1D1B;
    }
    .customer-details h3 {
      color: #6F1D1B;
      margin-top: 0;
    }
    .items-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 30px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .items-table th,
    .items-table td {
      border: 1px solid #ddd;
      padding: 12px;
      text-align: left;
    }
    .items-table th {
      background-color: #6F1D1B;
      color: white;
      font-weight: bold;
    }
    .items-table .price {
      text-align: right;
      font-weight: 500;
    }
    .items-table tbody tr:nth-child(even) {
      background-color: #f8f9fa;
    }
    .totals {
      text-align: right;
      margin-top: 20px;
      background: #f8f9fa;
      padding: 20px;
      border-radius: 8px;
    }
    .totals .total-line {
      margin: 8px 0;
      padding: 5px 0;
      display: flex;
      justify-content: space-between;
      max-width: 300px;
      margin-left: auto;
    }
    .totals .grand-total {
      border-top: 2px solid #6F1D1B;
      font-size: 1.3em;
      font-weight: bold;
      color: #6F1D1B;
      padding-top: 10px;
      margin-top: 10px;
    }
    .footer {
      margin-top: 50px;
      text-align: center;
      color: #666;
      border-top: 1px solid #ddd;
      padding-top: 20px;
      font-size: 14px;
    }
    .fallback-notice {
      background: #fff3cd;
      border: 1px solid #ffeaa7;
      color: #856404;
      padding: 10px;
      border-radius: 5px;
      margin-bottom: 20px;
      text-align: center;
    }
    .print-button {
      background: #6F1D1B;
      color: white;
      padding: 12px 24px;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      font-size: 16px;
      margin: 10px;
      transition: background 0.3s;
    }
    .print-button:hover {
      background: #5a1716;
    }
    @media print {
      body { margin: 0; padding: 10px; }
      .no-print { display: none !important; }
      .fallback-notice { display: none !important; }
      .header { border-bottom: 2px solid #6F1D1B; }
    }
    @media (max-width: 600px) {
      body { padding: 10px; }
      .invoice-details { flex-direction: column; }
      .restaurant-name { font-size: 2em; }
      .items-table { font-size: 14px; }
      .totals { padding: 15px; }
    }
  </style>
</head>
<body>
  <div class="fallback-notice no-print">
    <strong>📄 HTML Invoice</strong> - PDF generation unavailable. You can print this page to save as PDF.
  </div>

  <div class="header">
    <h1 class="restaurant-name">Bong Flavours</h1>
    <div class="restaurant-info">
      <p><strong>Authentic Bengali Cuisine</strong></p>
      <p>📧 mannadebdoot007@gmail.com | 📞 8238018577</p>
      <p>🌐 Experience the authentic taste of Bengal</p>
    </div>
  </div>

  <div class="invoice-details">
    <div>
      <div class="invoice-number">Invoice #${order.orderNumber}</div>
      <p><strong>Date:</strong> ${new Date(order.createdAt).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })}</p>
      <p><strong>Status:</strong> ${order.status.toUpperCase()}</p>
    </div>
    <div>
      <p><strong>Payment Method:</strong> ${order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}</p>
      <p><strong>Payment Status:</strong> ${order.paymentStatus.toUpperCase()}</p>
    </div>
  </div>

  <div class="customer-details">
    <h3>👤 Customer Details</h3>
    <p><strong>Name:</strong> ${order.customerInfo.name}</p>
    <p><strong>Email:</strong> ${order.customerInfo.email}</p>
    <p><strong>Phone:</strong> ${order.customerInfo.phone}</p>
    <p><strong>Address:</strong> ${order.customerInfo.address}</p>
    ${order.deliveryInfo ? `
    <h4>🚚 Delivery Information</h4>
    <p><strong>Delivery Address:</strong> ${order.deliveryInfo.address}</p>
    <p><strong>Delivery Phone:</strong> ${order.deliveryInfo.phone}</p>
    ${order.deliveryInfo.deliveryNotes ? `<p><strong>Special Notes:</strong> ${order.deliveryInfo.deliveryNotes}</p>` : ''}
    ` : ''}
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
      ${order.items.map((item) => `
        <tr>
          <td>
            <strong>${item.name}</strong>
            ${item.variant ? `<br><small style="color: #666;">(${item.variant})</small>` : ''}
            ${item.specialInstructions ? `<br><small style="color: #856404; font-style: italic;">${item.specialInstructions}</small>` : ''}
          </td>
          <td style="text-align: center;">${item.quantity}</td>
          <td class="price">₹${item.price.toFixed(2)}</td>
          <td class="price"><strong>₹${(item.price * item.quantity).toFixed(2)}</strong></td>
        </tr>
      `).join('')}
    </tbody>
  </table>

  <div class="totals">
    <div class="total-line">
      <span>Subtotal:</span>
      <span>₹${order.subtotal.toFixed(2)}</span>
    </div>
    <div class="total-line">
      <span>Tax (18% GST):</span>
      <span>₹${order.tax.toFixed(2)}</span>
    </div>
    ${order.deliveryFee ? `
    <div class="total-line">
      <span>Delivery Fee:</span>
      <span>₹${order.deliveryFee.toFixed(2)}</span>
    </div>
    ` : ''}
    <div class="total-line grand-total">
      <span>TOTAL:</span>
      <span>₹${order.total.toFixed(2)}</span>
    </div>
  </div>

  ${order.notes ? `
  <div style="margin-top: 30px; background: #f8f9fa; padding: 15px; border-radius: 5px;">
    <h3 style="color: #6F1D1B; margin-top: 0;">📝 Order Notes</h3>
    <p style="margin-bottom: 0;">${order.notes}</p>
  </div>
  ` : ''}

  <div class="footer">
    <p><strong>Thank you for dining with Bong Flavours!</strong></p>
    <p>For any queries regarding this invoice, please contact us at <strong>8238018577</strong></p>
    <p style="margin-top: 20px; font-size: 12px; color: #999;">
      Invoice generated on ${new Date().toLocaleString('en-IN')}
    </p>
  </div>

  <div class="no-print" style="text-align: center; margin-top: 30px; padding: 20px;">
    <button onclick="window.print()" class="print-button">🖨️ Print / Save as PDF</button>
    <button onclick="window.close()" class="print-button" style="background: #6c757d;">❌ Close</button>
    <p style="margin-top: 15px; color: #666; font-size: 14px;">
      <strong>Tip:</strong> Use your browser's "Print" function and select "Save as PDF" to download this invoice.
    </p>
  </div>
</body>
</html>
  `
}
