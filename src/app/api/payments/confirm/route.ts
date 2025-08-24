import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Order from '@/models/Order'
import { verifyToken } from '@/lib/auth'
import { z } from 'zod'

// Payment confirmation schema
const paymentSchema = z.object({
  orderId: z.string(),
  paymentMethod: z.enum(['cod', 'online']),
  transactionId: z.string().optional(),
  paymentStatus: z.enum(['paid', 'failed']).default('paid')
})

// POST /api/payments/confirm - Confirm payment for an order
export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('auth-token')?.value
    
    if (!token) {
      return NextResponse.json({ message: 'Not authenticated' }, { status: 401 })
    }

    const payload = verifyToken(token)
    const body = await req.json()
    
    // Validate input
    const validatedData = paymentSchema.parse(body)

    await dbConnect()

    // Find order
    const query: { _id: string; userId?: string } = { _id: validatedData.orderId }
    
    // If not admin, only allow access to own orders
    if (payload.role !== 'admin') {
      query.userId = payload.id
    }

    const order = await Order.findOne(query)

    if (!order) {
      return NextResponse.json({ message: 'Order not found' }, { status: 404 })
    }

    // Check if payment can be processed
    if (order.paymentStatus === 'paid') {
      return NextResponse.json(
        { message: 'Order already paid' },
        { status: 400 }
      )
    }

    if (order.status === 'cancelled') {
      return NextResponse.json(
        { message: 'Cannot process payment for cancelled order' },
        { status: 400 }
      )
    }

    // Update payment information
    const updateData: { paymentStatus: string; paymentMethod?: string; transactionId?: string; status?: string } = {
      paymentStatus: validatedData.paymentStatus,
    }

    if (validatedData.paymentMethod) {
      updateData.paymentMethod = validatedData.paymentMethod
    }

    if (validatedData.transactionId && validatedData.paymentMethod === 'online') {
      updateData.transactionId = validatedData.transactionId
    }

    // If payment is successful and order is still placed, confirm it
    if (validatedData.paymentStatus === 'paid' && order.status === 'placed') {
      updateData.status = 'confirmed'
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      validatedData.orderId,
      updateData,
      { new: true }
    ).populate('userId', 'name email phone')

    return NextResponse.json({
      message: 'Payment processed successfully',
      order: updatedOrder
    })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: 'Validation error', errors: error.errors },
        { status: 400 }
      )
    }

    console.error('Payment processing error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
