import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Order from '@/models/Order'
import User from '@/models/User'
import { verifyToken } from '@/lib/auth'
import { z } from 'zod'

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
    // Verify authentication
    const token = req.cookies.get('auth-token')?.value
    
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
    // Verify authentication
    const token = req.cookies.get('auth-token')?.value
    
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
