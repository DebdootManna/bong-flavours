import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Order from '@/models/Order'
import { verifyToken } from '@/lib/auth'

// GET /api/payments/status/[orderId] - Check payment status
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await context.params
    
    // Verify authentication
    let token = req.headers.get('authorization')?.replace('Bearer ', '')
    
    if (!token) {
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

    const order = await Order.findOne(query).select('paymentStatus paymentMethod total orderNumber')

    if (!order) {
      return NextResponse.json({ message: 'Order not found' }, { status: 404 })
    }

    return NextResponse.json({
      orderId: order.orderNumber,
      paymentStatus: order.paymentStatus,
      paymentMethod: order.paymentMethod,
      total: order.total,
      message: order.paymentStatus === 'paid' ? 'Payment completed successfully' : 'Payment pending'
    })

  } catch (error) {
    console.error('Payment status check error:', error)
    return NextResponse.json(
      { 
        message: 'Failed to check payment status',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}