'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Order {
  _id: string
  orderNumber: string
  items: Array<{
    name: string
    price: number
    quantity: number
  }>
  total: number
  status: string
  paymentMethod: string
  createdAt: string
}

interface UserProfile {
  name: string
  email: string
  phone: string
  address?: string
  city?: string
  zipCode?: string
}

const ProfilePage = () => {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'profile' | 'orders'>('profile')
  const [editMode, setEditMode] = useState(false)
  const [updateMessage, setUpdateMessage] = useState('')

  const fetchProfile = useCallback(async () => {
    if (!user) return
    
    try {
      // Get token from localStorage
      const token = localStorage.getItem('auth-token')
      const headers: HeadersInit = {
        'Content-Type': 'application/json'
      }
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }
      
      const response = await fetch('/api/auth/profile-v2', {
        headers,
        credentials: 'include'
      })
      
      if (response.ok) {
        const data = await response.json()
        setProfile({
          name: data.user.name || '',
          email: data.user.email || '',
          phone: data.user.phone || '',
          address: data.user.address || '',
          city: data.user.city || '',
          zipCode: data.user.zipCode || ''
        })
      } else {
        // Fallback to basic user data
        setProfile({
          name: user.name || '',
          email: user.email || '',
          phone: '',
          address: '',
          city: '',
          zipCode: ''
        })
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
      // Fallback to basic user data
      setProfile({
        name: user.name || '',
        email: user.email || '',
        phone: '',
        address: '',
        city: '',
        zipCode: ''
      })
    }
  }, [user])

  const fetchOrders = useCallback(async () => {
    try {
      // Get token from localStorage
      const token = localStorage.getItem('auth-token')
      const headers: HeadersInit = {
        'Content-Type': 'application/json'
      }
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }
      
      const response = await fetch('/api/orders', {
        headers,
        credentials: 'include'
      })
      
      if (response.ok) {
        const data = await response.json()
        setOrders(data.orders || [])
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!user) {
      router.push('/login')
      return
    }

    fetchProfile()
    fetchOrders()
  }, [user, router, fetchProfile, fetchOrders])

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!profile) return

    try {
      // Get token from localStorage
      const token = localStorage.getItem('auth-token')
      const headers: HeadersInit = {
        'Content-Type': 'application/json'
      }
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }
      
      const response = await fetch('/api/auth/profile-v2', {
        method: 'PUT',
        headers,
        credentials: 'include',
        body: JSON.stringify(profile)
      })

      if (response.ok) {
        setEditMode(false)
        setUpdateMessage('Profile updated successfully!')
        setTimeout(() => setUpdateMessage(''), 3000)
      } else {
        setUpdateMessage('Failed to update profile. Please try again.')
        setTimeout(() => setUpdateMessage(''), 3000)
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      setUpdateMessage('Failed to update profile. Please try again.')
      setTimeout(() => setUpdateMessage(''), 3000)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'confirmed':
        return 'bg-blue-100 text-blue-800'
      case 'preparing':
        return 'bg-purple-100 text-purple-800'
      case 'ready':
        return 'bg-green-100 text-green-800'
      case 'delivered':
        return 'bg-gray-100 text-gray-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (!user) {
    return null
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#6F1D1B]"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">My Account</h1>
              <p className="text-gray-600">Welcome back, {user.name}!</p>
            </div>
            <div className="mt-4 md:mt-0 flex space-x-4">
              <Link
                href="/app/menu"
                className="bg-[#6F1D1B] text-white px-4 py-2 rounded-md hover:bg-[#432818] transition-colors"
              >
                Order Food
              </Link>
              <button
                onClick={logout}
                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('profile')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'profile'
                    ? 'border-[#6F1D1B] text-[#6F1D1B]'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Profile Information
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'orders'
                    ? 'border-[#6F1D1B] text-[#6F1D1B]'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Order History ({orders.length})
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* Success Message */}
            {updateMessage && (
              <div className={`mb-4 p-4 rounded-md ${
                updateMessage.includes('success') 
                  ? 'bg-green-100 text-green-800 border border-green-200'
                  : 'bg-red-100 text-red-800 border border-red-200'
              }`}>
                {updateMessage}
              </div>
            )}

            {activeTab === 'profile' && profile && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Profile Information</h2>
                  <button
                    onClick={() => setEditMode(!editMode)}
                    className="bg-[#6F1D1B] text-white px-4 py-2 rounded-md hover:bg-[#432818] transition-colors"
                  >
                    {editMode ? 'Cancel' : 'Edit Profile'}
                  </button>
                </div>

                {editMode ? (
                  <form onSubmit={handleProfileUpdate} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Full Name
                        </label>
                        <input
                          type="text"
                          value={profile.name}
                          onChange={(e) => setProfile({...profile, name: e.target.value})}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#6F1D1B]"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email
                        </label>
                        <input
                          type="email"
                          value={profile.email}
                          onChange={(e) => setProfile({...profile, email: e.target.value})}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#6F1D1B]"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Phone
                        </label>
                        <input
                          type="tel"
                          value={profile.phone}
                          onChange={(e) => setProfile({...profile, phone: e.target.value})}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#6F1D1B]"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          City
                        </label>
                        <input
                          type="text"
                          value={profile.city}
                          onChange={(e) => setProfile({...profile, city: e.target.value})}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#6F1D1B]"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Address
                        </label>
                        <textarea
                          value={profile.address}
                          onChange={(e) => setProfile({...profile, address: e.target.value})}
                          rows={3}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#6F1D1B]"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          ZIP Code
                        </label>
                        <input
                          type="text"
                          value={profile.zipCode}
                          onChange={(e) => setProfile({...profile, zipCode: e.target.value})}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#6F1D1B]"
                        />
                      </div>
                    </div>
                    <div className="flex space-x-4">
                      <button
                        type="submit"
                        className="bg-[#6F1D1B] text-white px-6 py-2 rounded-md hover:bg-[#432818] transition-colors"
                      >
                        Save Changes
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditMode(false)}
                        className="bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Full Name</h3>
                      <p className="text-gray-900">{profile.name}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Email</h3>
                      <p className="text-gray-900">{profile.email}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Phone</h3>
                      <p className="text-gray-900">{profile.phone}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">City</h3>
                      <p className="text-gray-900">{profile.city || 'Not provided'}</p>
                    </div>
                    <div className="md:col-span-2">
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Address</h3>
                      <p className="text-gray-900">{profile.address || 'Not provided'}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">ZIP Code</h3>
                      <p className="text-gray-900">{profile.zipCode || 'Not provided'}</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'orders' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Order History</h2>
                
                {orders.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-gray-400 mb-4">
                      <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
                    <p className="text-gray-600 mb-4">You haven&apos;t placed any orders yet.</p>
                    <Link
                      href="/app/menu"
                      className="inline-block bg-[#6F1D1B] text-white px-6 py-3 rounded-md hover:bg-[#432818] transition-colors"
                    >
                      Order Now
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div key={order._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-3">
                          <div>
                            <h3 className="font-semibold text-gray-900">Order #{order.orderNumber}</h3>
                            <p className="text-sm text-gray-600">
                              {new Date(order.createdAt).toLocaleDateString('en-IN', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                          <div className="flex items-center space-x-3 mt-2 md:mt-0">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                              {order.status}
                            </span>
                            <span className="font-semibold text-[#6F1D1B]">₹{order.total.toFixed(2)}</span>
                          </div>
                        </div>
                        
                        <div className="mb-3">
                          <p className="text-sm text-gray-600 mb-1">Items:</p>
                          <div className="text-sm text-gray-900">
                            {order.items.map((item, index) => (
                              <span key={index}>
                                {item.name} (×{item.quantity})
                                {index < order.items.length - 1 && ', '}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                          <p className="text-sm text-gray-600 capitalize">
                            Payment: {order.paymentMethod}
                          </p>
                          <Link
                            href={`/app/order-success?orderId=${order._id}`}
                            className="mt-2 sm:mt-0 text-[#6F1D1B] hover:underline text-sm font-medium"
                          >
                            View Details →
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
