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
      if (storedUser) {
        console.log('Found user in localStorage:', JSON.parse(storedUser))
        setUser(JSON.parse(storedUser))
      }
      
      // Then verify with server
      const response = await fetch('/api/auth/me')
      if (response.ok) {
        const userData = await response.json()
        console.log('Server auth verification successful:', userData.user)
        setUser(userData.user)
        localStorage.setItem('user', JSON.stringify(userData.user))
      } else {
        console.log('Server auth verification failed, clearing localStorage')
        // Clear localStorage if server auth fails
        localStorage.removeItem('user')
        setUser(null)
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      // Clear localStorage on error
      localStorage.removeItem('user')
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    const response = await fetch('/api/auth/login', {
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
    // Also store in localStorage for persistence
    localStorage.setItem('user', JSON.stringify(data.user))
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
    // Also store in localStorage for persistence
    localStorage.setItem('user', JSON.stringify(data.user))
  }

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setUser(null)
      localStorage.removeItem('user') // Clear localStorage
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
