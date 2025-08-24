import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Order from '@/models/Order'
import { verifyToken } from '@/lib/auth'
import { z } from 'zod'

// Update order status schema
const updateStatusSchema = z.object({
  status: z.enum(['placed', 'confirmed', 'preparing', 'ready', 'out-for-delivery', 'delivered', 'cancelled']),
  estimatedTime: z.string().optional(),
  actualDeliveryTime: z.string().optional()
})

// GET /api/orders/[id] - Get specific order
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
    
    // Verify authentication
    const token = req.cookies.get('auth-token')?.value
    
    if (!token) {
      return NextResponse.json({ message: 'Not authenticated' }, { status: 401 })
    }

    const payload = verifyToken(token)
    
    await dbConnect()

    // Find order
    const query: { _id: string; userId?: string } = { _id: params.id }
    
    // If not admin, only allow access to own orders
    if (payload.role !== 'admin') {
      query.userId = payload.id
    }

    const order = await Order.findOne(query)
      .populate('userId', 'name email phone')

    if (!order) {
      return NextResponse.json({ message: 'Order not found' }, { status: 404 })
    }

    return NextResponse.json({ order })

  } catch (error) {
    console.error('Get order error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT /api/orders/[id] - Update order status (admin only)
export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
    // Verify authentication
    const token = req.cookies.get('auth-token')?.value
    
    if (!token) {
      return NextResponse.json({ message: 'Not authenticated' }, { status: 401 })
    }

    const payload = verifyToken(token)
    
    // Check if user is admin
    if (payload.role !== 'admin') {
      return NextResponse.json({ message: 'Access denied' }, { status: 403 })
    }

    const body = await req.json()
    
    // Validate input
    const validatedData = updateStatusSchema.parse(body)

    await dbConnect()

    // Update order
    const updateData: Record<string, string | Date> = { status: validatedData.status }
    
    if (validatedData.estimatedTime) {
      updateData['deliveryInfo.estimatedTime'] = new Date(validatedData.estimatedTime)
    }
    
    if (validatedData.actualDeliveryTime) {
      updateData['deliveryInfo.actualDeliveryTime'] = new Date(validatedData.actualDeliveryTime)
    }

    const order = await Order.findByIdAndUpdate(
      params.id,
      updateData,
      { new: true }
    ).populate('userId', 'name email phone')

    if (!order) {
      return NextResponse.json({ message: 'Order not found' }, { status: 404 })
    }

    return NextResponse.json({
      message: 'Order updated successfully',
      order
    })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: 'Validation error', errors: error.errors },
        { status: 400 }
      )
    }

    console.error('Update order error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/orders/[id] - Cancel order
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verify authentication
    const token = req.cookies.get('auth-token')?.value
    
    if (!token) {
      return NextResponse.json({ message: 'Not authenticated' }, { status: 401 })
    }

    const payload = verifyToken(token)
    
    await dbConnect()

    // Find order
    const query: { _id: string; userId?: string } = { _id: params.id }
    
    // If not admin, only allow access to own orders
    if (payload.role !== 'admin') {
      query.userId = payload.id
    }

    const order = await Order.findOne(query)

    if (!order) {
      return NextResponse.json({ message: 'Order not found' }, { status: 404 })
    }

    // Check if order can be cancelled
    if (['delivered', 'cancelled'].includes(order.status)) {
      return NextResponse.json(
        { message: 'Order cannot be cancelled' },
        { status: 400 }
      )
    }

    // Update order status to cancelled
    order.status = 'cancelled'
    await order.save()

    return NextResponse.json({
      message: 'Order cancelled successfully',
      order
    })

  } catch (error) {
    console.error('Cancel order error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
