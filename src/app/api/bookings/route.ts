import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Booking from '@/models/Booking'
import { verifyToken } from '@/lib/auth'
import { z } from 'zod'

// Create booking schema
const createBookingSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Invalid phone number'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Time must be in HH:MM format'),
  numPersons: z.number().int().min(1, 'Must be at least 1 person').max(20, 'Cannot exceed 20 persons'),
  notes: z.string().optional()
})

// GET /api/bookings - Get bookings
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const status = searchParams.get('status')
    const date = searchParams.get('date')
    
    // Check if user is authenticated (optional for public bookings)
    const token = req.cookies.get('auth-token')?.value
    let userRole = 'guest'
    let userId = null
    
    if (token) {
      try {
        const payload = verifyToken(token)
        userRole = payload.role
        userId = payload.id
      } catch {
        // Invalid token, continue as guest
      }
    }

    await dbConnect()

    // Build query
    const query: Record<string, string | Date> = {}
    
    // If not admin, only show user's bookings or require authentication
    if (userRole !== 'admin') {
      if (!userId) {
        return NextResponse.json({ message: 'Authentication required' }, { status: 401 })
      }
      query.userId = userId
    }
    
    // Filter by status if provided
    if (status && status !== 'all') {
      query.status = status
    }
    
    // Filter by date if provided
    if (date) {
      query.date = new Date(date)
    }

    // Get bookings with pagination
    const bookings = await Booking.find(query)
      .populate('userId', 'name email phone')
      .sort({ date: -1, time: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)

    const total = await Booking.countDocuments(query)

    return NextResponse.json({
      bookings,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    })

  } catch (error) {
    console.error('Get bookings error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/bookings - Create new booking
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    
    // Validate input
    const validatedData = createBookingSchema.parse(body)

    await dbConnect()

    // Check if the requested date/time is available
    const existingBooking = await Booking.findOne({
      date: new Date(validatedData.date),
      time: validatedData.time,
      status: { $in: ['requested', 'confirmed'] }
    })

    if (existingBooking) {
      return NextResponse.json(
        { message: 'This time slot is already booked' },
        { status: 400 }
      )
    }

    // Check if booking is for a future date
    const bookingDate = new Date(validatedData.date)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    if (bookingDate < today) {
      return NextResponse.json(
        { message: 'Cannot book for past dates' },
        { status: 400 }
      )
    }

    // Get user ID if authenticated
    let userId = null
    const token = req.cookies.get('auth-token')?.value
    
    if (token) {
      try {
        const payload = verifyToken(token)
        userId = payload.id
      } catch {
        // Invalid token, continue without user ID
      }
    }

    // Create booking data
    const bookingData = {
      userId,
      name: validatedData.name,
      email: validatedData.email,
      phone: validatedData.phone,
      date: new Date(validatedData.date),
      time: validatedData.time,
      numPersons: validatedData.numPersons,
      status: 'requested' as const,
      notes: validatedData.notes
    }

    // Create booking
    const booking = await Booking.create(bookingData)

    return NextResponse.json({
      message: 'Booking request submitted successfully',
      booking
    }, { status: 201 })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: 'Validation error', errors: error.errors },
        { status: 400 }
      )
    }

    console.error('Create booking error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
