import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import User from '@/models/User'
import { hashPassword, signToken } from '@/lib/auth'
import { z } from 'zod'

const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Phone number must be 10 digits starting with 6-9'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    console.log('Signup attempt with data:', { ...body, password: '[REDACTED]' })
    
    // Validate input
    const validatedData = signupSchema.parse(body)
    
    // Connect to database
    await dbConnect()
    
    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [
        { email: validatedData.email },
        { phone: validatedData.phone }
      ]
    })
    
    if (existingUser) {
      return NextResponse.json(
        { message: 'User with this email or phone already exists' },
        { status: 400 }
      )
    }
    
    // Hash password
    const hashedPassword = await hashPassword(validatedData.password)
    
    // Create user
    const user = await User.create({
      name: validatedData.name,
      email: validatedData.email,
      phone: validatedData.phone,
      password: hashedPassword,
      role: 'customer'
    })
    
    // Generate JWT token
    const token = signToken({
      id: user._id.toString(),
      email: user.email,
      role: user.role,
      name: user.name
    })
    
    // Set HTTP-only cookie
    const response = NextResponse.json({
      message: 'User created successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      token // Include token in response body for localStorage storage
    })
    
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 // 7 days
    })
    
    return response
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.log('Validation errors:', error.errors)
      return NextResponse.json(
        { message: 'Validation error', errors: error.errors },
        { status: 400 }
      )
    }
    
    console.error('Signup error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
