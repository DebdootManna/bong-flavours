import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Order from '@/models/Order'
import Booking from '@/models/Booking'
import User from '@/models/User'
import { verifyToken } from '@/lib/auth'

// GET /api/admin/dashboard - Get admin dashboard statistics
export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('auth-token')?.value
    
    if (!token) {
      return NextResponse.json({ message: 'Not authenticated' }, { status: 401 })
    }

    const payload = verifyToken(token)
    
    // Check if user is admin
    if (payload.role !== 'admin') {
      return NextResponse.json({ message: 'Access denied' }, { status: 403 })
    }

    await dbConnect()

    // Get date ranges
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const thisWeek = new Date(today)
    thisWeek.setDate(today.getDate() - 7)
    
    const thisMonth = new Date(today)
    thisMonth.setMonth(today.getMonth() - 1)

    // Orders statistics
    const totalOrders = await Order.countDocuments()
    const todayOrders = await Order.countDocuments({ createdAt: { $gte: today } })
    const weekOrders = await Order.countDocuments({ createdAt: { $gte: thisWeek } })
    const monthOrders = await Order.countDocuments({ createdAt: { $gte: thisMonth } })

    // Revenue statistics
    const totalRevenue = await Order.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $group: { _id: null, total: { $sum: '$total' } } }
    ])
    
    const todayRevenue = await Order.aggregate([
      { $match: { paymentStatus: 'paid', createdAt: { $gte: today } } },
      { $group: { _id: null, total: { $sum: '$total' } } }
    ])
    
    const weekRevenue = await Order.aggregate([
      { $match: { paymentStatus: 'paid', createdAt: { $gte: thisWeek } } },
      { $group: { _id: null, total: { $sum: '$total' } } }
    ])
    
    const monthRevenue = await Order.aggregate([
      { $match: { paymentStatus: 'paid', createdAt: { $gte: thisMonth } } },
      { $group: { _id: null, total: { $sum: '$total' } } }
    ])

    // Order status distribution
    const ordersByStatus = await Order.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ])

    // Payment status distribution
    const ordersByPayment = await Order.aggregate([
      { $group: { _id: '$paymentStatus', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ])

    // Booking statistics
    const totalBookings = await Booking.countDocuments()
    const todayBookings = await Booking.countDocuments({ createdAt: { $gte: today } })
    const weekBookings = await Booking.countDocuments({ createdAt: { $gte: thisWeek } })
    const monthBookings = await Booking.countDocuments({ createdAt: { $gte: thisMonth } })

    // Booking status distribution
    const bookingsByStatus = await Booking.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ])

    // User statistics
    const totalUsers = await User.countDocuments()
    const newUsersToday = await User.countDocuments({ createdAt: { $gte: today } })
    const newUsersWeek = await User.countDocuments({ createdAt: { $gte: thisWeek } })
    const newUsersMonth = await User.countDocuments({ createdAt: { $gte: thisMonth } })

    // Popular items (from orders)
    const popularItems = await Order.aggregate([
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.name',
          totalOrdered: { $sum: '$items.quantity' },
          totalRevenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } }
        }
      },
      { $sort: { totalOrdered: -1 } },
      { $limit: 10 }
    ])

    // Recent orders
    const recentOrders = await Order.find()
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .limit(10)
      .select('orderNumber customerInfo total status paymentStatus createdAt')

    // Recent bookings
    const recentBookings = await Booking.find()
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .limit(10)
      .select('name email date time numPersons status createdAt')

    const stats = {
      orders: {
        total: totalOrders,
        today: todayOrders,
        week: weekOrders,
        month: monthOrders,
        byStatus: ordersByStatus,
        byPayment: ordersByPayment
      },
      revenue: {
        total: totalRevenue[0]?.total || 0,
        today: todayRevenue[0]?.total || 0,
        week: weekRevenue[0]?.total || 0,
        month: monthRevenue[0]?.total || 0
      },
      bookings: {
        total: totalBookings,
        today: todayBookings,
        week: weekBookings,
        month: monthBookings,
        byStatus: bookingsByStatus
      },
      users: {
        total: totalUsers,
        newToday: newUsersToday,
        newWeek: newUsersWeek,
        newMonth: newUsersMonth
      },
      popularItems,
      recentOrders,
      recentBookings
    }

    return NextResponse.json(stats)

  } catch (error) {
    console.error('Dashboard stats error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
