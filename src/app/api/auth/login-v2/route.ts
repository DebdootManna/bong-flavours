import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import User from '@/models/User'
import { verifyPassword, signToken } from '@/lib/auth'
import { z } from 'zod'

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    
    // Validate input
    const validatedData = loginSchema.parse(body)
    
    // Connect to database
    await dbConnect()

    // Find user by email
    const user = await User.findOne({ email: validatedData.email.toLowerCase() })
    
    if (!user) {
      return NextResponse.json(
        { message: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Verify password
    const isValidPassword = await verifyPassword(validatedData.password, user.password)
    
    if (!isValidPassword) {
      return NextResponse.json(
        { message: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Create JWT token
    const token = signToken({
      id: user._id.toString(),
      email: user.email,
      role: user.role,
      name: user.name
    })

    // Return token in response body for localStorage storage
    const response = NextResponse.json({
      message: 'Login successful',
      token: token, // Include token in response for localStorage
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    })
    
    // Also set cookie as fallback
    console.log('Setting auth-token cookie for user:', user.email)
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 // 7 days
    })
    
    return response
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: 'Validation error', errors: error.errors },
        { status: 400 }
      )
    }
    
    console.error('Login error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}