'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface User {
  id: string
  name: string
  email: string
  role: 'customer' | 'admin'
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<User>
  logout: () => void
  signup: (name: string, email: string, phone: string, password: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      // First check localStorage for immediate user state
      const storedUser = localStorage.getItem('user')
      const storedToken = localStorage.getItem('auth-token')
      
      if (storedUser) {
        setUser(JSON.parse(storedUser))
      }
      
      // Then verify with server using stored token
      const headers: HeadersInit = {
        'Content-Type': 'application/json'
      }
      
      if (storedToken) {
        headers['Authorization'] = `Bearer ${storedToken}`
      }
      
      const response = await fetch('/api/auth/profile-v2', {
        headers,
        credentials: 'include'
      })
      
      if (response.ok) {
        const userData = await response.json()
        setUser(userData.user)
        localStorage.setItem('user', JSON.stringify(userData.user))
      } else {
        // Clear localStorage if server auth fails
        localStorage.removeItem('user')
        localStorage.removeItem('auth-token')
        setUser(null)
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      // Clear localStorage on error
      localStorage.removeItem('user')
      localStorage.removeItem('auth-token')
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    const response = await fetch('/api/auth/login-v2', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Login failed')
    }

    const data = await response.json()
    setUser(data.user)
    
    // Store both user data and auth token in localStorage
    localStorage.setItem('user', JSON.stringify(data.user))
    if (data.token) {
      localStorage.setItem('auth-token', data.token)
    }
    
    return data.user
  }

  const signup = async (name: string, email: string, phone: string, password: string) => {
    const response = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, phone, password }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Signup failed')
    }

    const data = await response.json()
    setUser(data.user)
    
    // Store both user data and auth token in localStorage
    localStorage.setItem('user', JSON.stringify(data.user))
    if (data.token) {
      localStorage.setItem('auth-token', data.token)
    }
  }

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setUser(null)
      localStorage.removeItem('user') // Clear localStorage
      localStorage.removeItem('auth-token') // Clear auth token
      window.location.href = '/'
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, signup }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
