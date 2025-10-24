import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import User from '@/models/User'
import { verifyToken } from '@/lib/auth'

// GET /api/admin/users - Get all users
export async function GET(req: NextRequest) {
  try {
    // Check authentication
    const token = req.cookies.get('auth-token')?.value || req.headers.get('Authorization')?.replace('Bearer ', '')

    if (!token) {
      return NextResponse.json({ message: 'Not authenticated' }, { status: 401 })
    }

    const payload = verifyToken(token)

    // Check if user is admin
    if (payload.role !== 'admin') {
      return NextResponse.json({ message: 'Access denied' }, { status: 403 })
    }

    await dbConnect()

    // Get all users with basic info
    const users = await User.find({})
      .select('name email role phone createdAt')
      .sort({ createdAt: -1 })

    return NextResponse.json({
      success: true,
      users: users || []
    })

  } catch (error) {
    console.error('Admin users fetch error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
