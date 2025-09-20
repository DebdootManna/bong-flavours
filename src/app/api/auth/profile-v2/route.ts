import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import User from '@/models/User'
import { verifyToken } from '@/lib/auth'

function getTokenFromRequest(request: NextRequest): string | null {
  // Try cookie first
  const cookieToken = request.cookies.get('auth-token')?.value
  if (cookieToken) {
    return cookieToken
  }
  
  // Try Authorization header
  const authHeader = request.headers.get('Authorization')
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7)
  }
  
  return null
}

// GET /api/auth/profile-v2 - Get user profile (supports both cookie and bearer token)
export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const token = getTokenFromRequest(request)
    console.log('Profile V2 GET - Token found via:', token ? (request.cookies.get('auth-token')?.value ? 'cookie' : 'header') : 'none')
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized - No token' }, { status: 401 })
    }

    try {
      const decoded = verifyToken(token)
      console.log('Profile V2 GET - Token decoded successfully, user ID:', decoded.id)
      const user = await User.findById(decoded.id).select('-password')

      if (!user) {
        console.log('Profile V2 GET - User not found for ID:', decoded.id)
        return NextResponse.json({ error: 'User not found' }, { status: 404 })
      }

      console.log('Profile V2 GET - User found:', user.name)
      return NextResponse.json({ user })
    } catch (tokenError) {
      console.log('Profile V2 GET - Token verification failed:', tokenError)
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }
  } catch (error) {
    console.error('Profile V2 fetch error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT /api/auth/profile-v2 - Update user profile (supports both cookie and bearer token)
export async function PUT(request: NextRequest) {
  try {
    await connectDB()

    const token = getTokenFromRequest(request)
    console.log('Profile V2 PUT - Token found via:', token ? (request.cookies.get('auth-token')?.value ? 'cookie' : 'header') : 'none')
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized - No token' }, { status: 401 })
    }

    try {
      const decoded = verifyToken(token)
      console.log('Profile V2 PUT - Token decoded successfully, user ID:', decoded.id)
      const user = await User.findById(decoded.id)

      if (!user) {
        console.log('Profile V2 PUT - User not found for ID:', decoded.id)
        return NextResponse.json({ error: 'User not found' }, { status: 404 })
      }

      const body = await request.json()
      console.log('Profile V2 PUT - Update data:', body)
      const { name, email, phone, address, city, zipCode } = body

      // Update user fields
      user.name = name || user.name
      user.email = email || user.email
      user.phone = phone || user.phone
      user.address = address || user.address
      user.city = city || user.city
      user.zipCode = zipCode || user.zipCode

      await user.save()
      console.log('Profile V2 PUT - User updated successfully')

      // Return updated user without password
      const updatedUser = await User.findById(user._id).select('-password')

      return NextResponse.json({ 
        message: 'Profile updated successfully',
        user: updatedUser 
      })
    } catch (tokenError) {
      console.log('Profile V2 PUT - Token verification failed:', tokenError)
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }
  } catch (error) {
    console.error('Profile V2 update error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}