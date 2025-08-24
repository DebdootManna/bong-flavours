import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Order from '@/models/Order'
import { verifyToken } from '@/lib/auth'

// GET /api/payments/status/[orderId] - Get payment status for an order
export async function GET(
  req: NextRequest,
  { params }: { params: { orderId: string } }
) {
  try {
    const token = req.cookies.get('auth-token')?.value
    
    if (!token) {
      return NextResponse.json({ message: 'Not authenticated' }, { status: 401 })
    }

    const payload = verifyToken(token)

    await dbConnect()

    // Find order
    const query: { _id: string; userId?: string } = { _id: params.orderId }
    
    // If not admin, only allow access to own orders
    if (payload.role !== 'admin') {
      query.userId = payload.id
    }

    const order = await Order.findOne(query)
      .select('orderNumber paymentStatus paymentMethod total transactionId')

    if (!order) {
      return NextResponse.json({ message: 'Order not found' }, { status: 404 })
    }

    return NextResponse.json({
      orderNumber: order.orderNumber,
      paymentStatus: order.paymentStatus,
      paymentMethod: order.paymentMethod,
      total: order.total,
      transactionId: order.transactionId
    })

  } catch (error) {
    console.error('Get payment status error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
