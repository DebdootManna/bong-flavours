'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface MenuItem {
  _id: string
  name: string
  description: string
  price: number
  category: string
  isVeg: boolean
  isAvailable: boolean
  image?: string
}

const MenuPage = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [showVegOnly, setShowVegOnly] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchMenu()
  }, [])

  const fetchMenu = async () => {
    try {
      const response = await fetch('/api/menu')
      if (response.ok) {
        const data = await response.json()
        setMenuItems(data.items || [])
      } else {
        setError('Failed to load menu')
      }
    } catch (error) {
      console.error('Error fetching menu:', error)
      setError('Failed to load menu')
    } finally {
      setLoading(false)
    }
  }

  const categories = [
    { id: 'all', name: 'All Items' },
    { id: 'Shorbot', name: 'Shorbot (Drinks)' },
    { id: 'Starters', name: 'Starters' },
    { id: 'Kolkata Kathi Roll & Mughlai Paratha', name: 'Kathi Rolls & Parathas' },
    { id: 'Kolkata Biryani', name: 'Biryani' },
    { id: 'Kolkata Chinese', name: 'Chinese' },
    { id: 'Main Course', name: 'Main Course' },
    { id: 'Rice', name: 'Rice' },
    { id: 'Roti/Paratha/Loochi (Puri)', name: 'Bread' },
    { id: 'Accompaniments & Desserts', name: 'Desserts & Sides' }
  ]

  const filteredItems = selectedCategory === 'all' 
    ? menuItems 
    : menuItems.filter(item => item.category === selectedCategory)

  const finalFilteredItems = showVegOnly 
    ? filteredItems.filter(item => item.isVeg)
    : filteredItems

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6F1D1B] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading delicious Bengali menu...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Unable to Load Menu</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={fetchMenu}
            className="bg-[#6F1D1B] text-white px-6 py-3 rounded-md hover:bg-[#432818] transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Our Menu</h1>
              <p className="text-gray-600 mt-1">Authentic Bengali Cuisine</p>
            </div>
            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2 text-sm">
                <input
                  type="checkbox"
                  checked={showVegOnly}
                  onChange={(e) => setShowVegOnly(e.target.checked)}
                  className="rounded border-gray-300 text-[#6F1D1B] focus:ring-[#6F1D1B]"
                />
                <span className="text-gray-700">Vegetarian Only</span>
              </label>
              <Link
                href="/login"
                className="bg-[#6F1D1B] text-white px-6 py-2 rounded-md hover:bg-[#432818] transition-colors"
              >
                Login to Order
              </Link>
              <Link
                href="/signup"
                className="border border-[#6F1D1B] text-[#6F1D1B] px-6 py-2 rounded-md hover:bg-[#6F1D1B] hover:text-white transition-colors"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Category Sidebar */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Categories</h3>
              <div className="space-y-2">
                {categories.map((category) => {
                  const categoryItems = category.id === 'all' 
                    ? menuItems 
                    : menuItems.filter(item => item.category === category.id)
                  const itemCount = showVegOnly 
                    ? categoryItems.filter(item => item.isVeg).length
                    : categoryItems.length
                  
                  return (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full text-left px-4 py-2 rounded-md transition-colors ${
                        selectedCategory === category.id
                          ? 'bg-[#6F1D1B] text-white'
                          : 'hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-sm">{category.name}</span>
                        <span className="text-xs opacity-75">({itemCount})</span>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="lg:w-3/4">
            {finalFilteredItems.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium text-gray-900 mb-2">No items found</h3>
                <p className="text-gray-600">Try selecting a different category or toggle the vegetarian filter.</p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2">
                {finalFilteredItems.map((item) => (
                  <div key={item._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              item.isVeg 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {item.isVeg ? '🌱 Veg' : '🍖 Non-Veg'}
                            </span>
                          </div>
                          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.description}</p>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-xl font-bold text-[#6F1D1B]">₹{item.price}</span>
                        <div className="text-sm text-gray-500">
                          {item.isAvailable ? (
                            <span className="text-green-600 font-medium">Available</span>
                          ) : (
                            <span className="text-red-600 font-medium">Out of Stock</span>
                          )}
                        </div>
                      </div>

                      {/* Login Prompt */}
                      <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                        <p className="text-sm text-yellow-800 text-center">
                          <Link href="/login" className="font-medium underline hover:no-underline">
                            Login
                          </Link>
                          {' '}to add items to cart and place orders
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-[#6F1D1B] text-white py-12">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl font-bold mb-4">Ready to Order?</h2>
          <p className="text-xl mb-6 opacity-90">
            Create an account to start adding items to your cart and enjoy our delicious Bengali cuisine!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/signup"
              className="bg-white text-[#6F1D1B] px-8 py-3 rounded-md font-semibold hover:bg-gray-100 transition-colors"
            >
              Sign Up Now
            </Link>
            <Link
              href="/login"
              className="border-2 border-white text-white px-8 py-3 rounded-md font-semibold hover:bg-white hover:text-[#6F1D1B] transition-colors"
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MenuPage
