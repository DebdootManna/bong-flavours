import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Order from '@/models/Order'
import { verifyToken } from '@/lib/auth'
import { generateInvoicePDF } from '@/lib/invoice'

// GET /api/invoices/[orderId] - Generate and download invoice
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await context.params
    const token = req.cookies.get('auth-token')?.value
    
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

    // Check if order is in a valid state for invoice generation
    if (!['confirmed', 'preparing', 'ready', 'out-for-delivery', 'delivered'].includes(order.status)) {
      return NextResponse.json(
        { message: 'Invoice not available for this order status' },
        { status: 400 }
      )
    }

    try {
      // Generate PDF invoice
      const pdfBuffer = await generateInvoicePDF(order)
      
      // Update order with invoice URL (in a real app, you'd upload to S3/CDN)
      const invoiceUrl = `/api/invoices/${order._id}`
      await Order.findByIdAndUpdate(order._id, { invoiceUrl })

      // Return PDF as response
      return new NextResponse(pdfBuffer as unknown as BodyInit, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="invoice-${order.orderNumber}.pdf"`,
          'Content-Length': pdfBuffer.length.toString()
        }
      })

    } catch (pdfError) {
      console.error('PDF generation error:', pdfError)
      
      // Return HTML invoice as fallback
      const htmlInvoice = generateInvoiceHTML(order)
      
      return new NextResponse(htmlInvoice, {
        headers: {
          'Content-Type': 'text/html',
          'Content-Disposition': `inline; filename="invoice-${order.orderNumber}.html"`
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

// Helper function to generate HTML invoice as fallback
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
    body {
      font-family: Arial, sans-serif;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
      color: #333;
    }
    .header {
      text-align: center;
      border-bottom: 2px solid #6F1D1B;
      padding-bottom: 20px;
      margin-bottom: 30px;
    }
    .restaurant-name {
      font-size: 2.5em;
      color: #6F1D1B;
      margin: 0;
    }
    .restaurant-info {
      margin-top: 10px;
      color: #666;
    }
    .invoice-details {
      display: flex;
      justify-content: space-between;
      margin-bottom: 30px;
    }
    .invoice-number {
      font-size: 1.2em;
      font-weight: bold;
      color: #6F1D1B;
    }
    .customer-details {
      background: #f9f9f9;
      padding: 15px;
      border-radius: 5px;
      margin-bottom: 30px;
    }
    .items-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 30px;
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
    }
    .items-table .price {
      text-align: right;
    }
    .totals {
      text-align: right;
      margin-top: 20px;
    }
    .totals .total-line {
      margin: 5px 0;
      padding: 5px 0;
    }
    .totals .grand-total {
      border-top: 2px solid #6F1D1B;
      font-size: 1.2em;
      font-weight: bold;
      color: #6F1D1B;
      padding-top: 10px;
    }
    .footer {
      margin-top: 50px;
      text-align: center;
      color: #666;
      border-top: 1px solid #ddd;
      padding-top: 20px;
    }
    @media print {
      body { margin: 0; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  <div class="header">
    <h1 class="restaurant-name">Bong Flavours</h1>
    <div class="restaurant-info">
      <p>Authentic Bengali Cuisine</p>
      <p>📧 mannadebdoot007@gmail.com | 📞 8238018577</p>
    </div>
  </div>

  <div class="invoice-details">
    <div>
      <div class="invoice-number">Invoice #${order.orderNumber}</div>
      <p>Date: ${new Date(order.createdAt).toLocaleDateString()}</p>
      <p>Status: ${order.status.toUpperCase()}</p>
    </div>
    <div>
      <p><strong>Payment Method:</strong> ${order.paymentMethod.toUpperCase()}</p>
      <p><strong>Payment Status:</strong> ${order.paymentStatus.toUpperCase()}</p>
    </div>
  </div>

  <div class="customer-details">
    <h3>Customer Details</h3>
    <p><strong>Name:</strong> ${order.customerInfo.name}</p>
    <p><strong>Email:</strong> ${order.customerInfo.email}</p>
    <p><strong>Phone:</strong> ${order.customerInfo.phone}</p>
    <p><strong>Address:</strong> ${order.customerInfo.address}</p>
    ${order.deliveryInfo ? `
    <h4>Delivery Information</h4>
    <p><strong>Delivery Address:</strong> ${order.deliveryInfo.address}</p>
    <p><strong>Delivery Phone:</strong> ${order.deliveryInfo.phone}</p>
    ${order.deliveryInfo.deliveryNotes ? `<p><strong>Notes:</strong> ${order.deliveryInfo.deliveryNotes}</p>` : ''}
    ` : ''}
  </div>

  <table class="items-table">
    <thead>
      <tr>
        <th>Item</th>
        <th>Quantity</th>
        <th>Price</th>
        <th>Total</th>
      </tr>
    </thead>
    <tbody>
      ${order.items.map((item) => `
        <tr>
          <td>
            ${item.name}
            ${item.variant ? `<br><small>(${item.variant})</small>` : ''}
            ${item.specialInstructions ? `<br><small><em>${item.specialInstructions}</em></small>` : ''}
          </td>
          <td>${item.quantity}</td>
          <td class="price">₹${item.price.toFixed(2)}</td>
          <td class="price">₹${(item.price * item.quantity).toFixed(2)}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>

  <div class="totals">
    <div class="total-line">Subtotal: ₹${order.subtotal.toFixed(2)}</div>
    <div class="total-line">Tax (5% GST): ₹${order.tax.toFixed(2)}</div>
    <div class="total-line grand-total">Total: ₹${order.total.toFixed(2)}</div>
  </div>

  ${order.notes ? `
  <div style="margin-top: 30px;">
    <h3>Order Notes</h3>
    <p>${order.notes}</p>
  </div>
  ` : ''}

  <div class="footer">
    <p>Thank you for dining with Bong Flavours!</p>
    <p><em>Experience the authentic taste of Bengal</em></p>
  </div>

  <div class="no-print" style="text-align: center; margin-top: 30px;">
    <button onclick="window.print()" style="background: #6F1D1B; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer;">Print Invoice</button>
  </div>
</body>
</html>
  `
}
