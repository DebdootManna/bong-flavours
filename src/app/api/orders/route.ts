import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Order from '@/models/Order'
import User from '@/models/User'
import { verifyToken } from '@/lib/auth'
import { z } from 'zod'
import { generateInvoicePDF } from '@/lib/invoice'
import { sendOrderEmail } from '@/lib/mailer'

interface OrderItem {
  menuItemId: string
  name: string
  price: number
  quantity: number
  variant?: string
  specialInstructions?: string
}

// Order item schema for validation
const orderItemSchema = z.object({
  menuItemId: z.string(),
  name: z.string(),
  price: z.number().positive(),
  quantity: z.number().int().positive(),
  variant: z.string().optional(),
  specialInstructions: z.string().optional()
})

// Create order schema
const createOrderSchema = z.object({
  items: z.array(orderItemSchema).min(1, 'At least one item is required'),
  customerInfo: z.object({
    name: z.string().min(1),
    email: z.string().email(),
    phone: z.string().regex(/^[6-9]\d{9}$/, 'Invalid phone number'),
    address: z.string().min(1)
  }),
  deliveryInfo: z.object({
    address: z.string().min(1),
    phone: z.string().regex(/^[6-9]\d{9}$/, 'Invalid phone number'),
    deliveryNotes: z.string().optional()
  }),
  paymentMethod: z.enum(['cod', 'online']).default('cod'),
  notes: z.string().optional()
})

// GET /api/orders - Get user's orders
export async function GET(req: NextRequest) {
  try {
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
    
    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const status = searchParams.get('status')

    await dbConnect()

    // Build query
    const query: { userId?: string; status?: string } = {}
    
    // If not admin, only show user's orders
    if (payload.role !== 'admin') {
      query.userId = payload.id
    }
    
    // Filter by status if provided
    if (status && status !== 'all') {
      query.status = status
    }

    // Get orders with pagination
    const orders = await Order.find(query)
      .populate('userId', 'name email phone')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)

    const total = await Order.countDocuments(query)

    return NextResponse.json({
      orders,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    })

  } catch (error) {
    console.error('Get orders error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/orders - Create new order
export async function POST(req: NextRequest) {
  try {
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

    const body = await req.json()
    
    // Validate input
    const validatedData = createOrderSchema.parse(body)

    await dbConnect()

    // Get user details
    const user = await User.findById(payload.id)
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }

    // Generate unique order number
    const generateOrderNumber = () => {
      const timestamp = Date.now().toString()
      const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
      return `BF${timestamp.slice(-8)}${random}`
    }

    let orderNumber = generateOrderNumber()
    
    // Ensure uniqueness
    let existingOrder = await Order.findOne({ orderNumber })
    while (existingOrder) {
      orderNumber = generateOrderNumber()
      existingOrder = await Order.findOne({ orderNumber })
    }

    // Calculate totals
    let subtotal = 0
    validatedData.items.forEach(item => {
      subtotal += item.price * item.quantity
    })

    // Calculate tax (5% GST)
    const tax = subtotal * 0.05
    const total = subtotal + tax

    // Create order data matching the Order model
    const orderData = {
      orderNumber,
      userId: payload.id,
      customerInfo: validatedData.customerInfo,
      items: validatedData.items,
      subtotal,
      tax,
      total,
      status: 'placed' as const,
      paymentMethod: validatedData.paymentMethod,
      paymentStatus: 'pending' as const,
      deliveryInfo: validatedData.deliveryInfo,
      notes: validatedData.notes
    }

    // Create order
    const order = await Order.create(orderData)

    // Populate user details for response
    await order.populate('userId', 'name email phone')

    // Generate and send invoice automatically
    try {
      console.log('Generating invoice for order:', order.orderNumber)
      
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
      await sendOrderEmail(emailData, invoicePdf)

      // Update order to mark invoice as sent
      await Order.findByIdAndUpdate(order._id, {
        invoiceUrl: `invoice-${order.orderNumber}.pdf`,
        updatedAt: new Date()
      })

      console.log('Invoice generated and sent successfully for order:', order.orderNumber)
    } catch (invoiceError) {
      console.error('Failed to generate/send invoice:', invoiceError)
      // Don't fail the order creation if invoice generation fails
      // The invoice can be generated later via the separate API endpoint
    }

    return NextResponse.json({
      message: 'Order created successfully',
      order
    }, { status: 201 })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: 'Validation error', errors: error.errors },
        { status: 400 }
      )
    }

    console.error('Create order error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
