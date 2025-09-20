import { NextRequest, NextResponse } from 'next/server'
import { generateInvoicePDF } from '@/lib/invoice'
import { sendOrderEmail } from '@/lib/mailer'
import { verifyToken } from '@/lib/auth'
import dbConnect from '@/lib/mongodb'
import Order from '@/models/Order'

interface OrderItem {
  menuItemId: string
  name: string
  price: number
  quantity: number
  variant?: string
  specialInstructions?: string
}

export async function POST(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    // Verify authentication
    const token = req.cookies.get('auth-token')?.value
    
    if (!token) {
      return NextResponse.json({ message: 'Not authenticated' }, { status: 401 })
    }

    const payload = verifyToken(token)
    await dbConnect()

    // Await params for Next.js 15 compatibility
    const params = await context.params

    // Get order details
    const order = await Order.findById(params.id).populate('userId', 'name email phone')
    
    if (!order) {
      return NextResponse.json({ message: 'Order not found' }, { status: 404 })
    }

    // Check if user can access this order (admin or order owner)
    if (payload.role !== 'admin' && order.userId._id.toString() !== payload.id) {
      return NextResponse.json({ message: 'Not authorized to access this order' }, { status: 403 })
    }

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

    // Generate PDF invoice
    console.log('Generating PDF invoice for order:', order.orderNumber)
    const invoicePdf = await generateInvoicePDF(invoiceData)

    // Prepare email data
    const emailData = {
      orderId: order.orderNumber,
      customerName: order.customerInfo.name,
      customerEmail: order.customerInfo.email,
      items: order.items.map((item: OrderItem) => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price
      })),
      total: order.total,
      address: order.deliveryInfo.address,
      phone: order.customerInfo.phone
    }

    // Send emails with invoice to both customer and admin
    console.log('Sending invoice emails...')
    await sendOrderEmail(emailData, invoicePdf)

    // Update order to mark invoice as sent
    await Order.findByIdAndUpdate(params.id, {
      invoiceUrl: `invoice-${order.orderNumber}.pdf`,
      updatedAt: new Date()
    })

    return NextResponse.json({
      message: 'Invoice generated and sent successfully',
      invoiceGenerated: true
    })

  } catch (error) {
    console.error('Bill generation error:', error)
    return NextResponse.json(
      { 
        message: 'Failed to generate and send invoice',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}