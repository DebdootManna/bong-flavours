'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useCart } from '@/contexts/CartContext'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface MenuItem {
  _id: string
  name: string
  description: string
  price: number
  variants?: Array<{
    name: string
    price: number
  }>
  category: string
  isVeg: boolean
  isAvailable: boolean
  image?: string
}

const AuthenticatedMenuPage = () => {
  const { user, loading: authLoading } = useAuth()
  const { state, addToCart, removeFromCart, updateQuantity } = useCart()
  const router = useRouter()
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [showVegOnly, setShowVegOnly] = useState<boolean>(false)
  const [selectedVariants, setSelectedVariants] = useState<{[itemId: string]: number}>({}) // Track selected variant index for each item

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
      return
    }
  }, [user, authLoading, router])

  useEffect(() => {
    if (user) {
      fetchMenu()
    }
  }, [user])

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
    { id: 'All', name: 'All' },
    { id: 'Shorbot', name: 'Shorbot' },
    { id: 'Starters', name: 'Starters' },
    { id: 'Kolkata Kathi Roll & Mughlai Paratha', name: 'Kathi Roll & Mughlai Paratha' },
    { id: 'Kolkata Biryani', name: 'Kolkata Biryani' },
    { id: 'Kolkata Chinese', name: 'Kolkata Chinese' },
    { id: 'Main Course', name: 'Main Course' },
    { id: 'Rice', name: 'Rice' },
    { id: 'Roti/Paratha/Loochi (Puri)', name: 'Roti/Paratha/Loochi (Puri)' },
    { id: 'Accompaniments & Desserts', name: 'Accompaniments & Desserts' }
  ]

  const filteredItems = menuItems.filter(item => {
    if (selectedCategory !== 'All' && item.category !== selectedCategory) return false
    if (showVegOnly && !item.isVeg) return false
    if (searchTerm && !item.name.toLowerCase().includes(searchTerm.toLowerCase())) return false
    return true
  })

  const getItemQuantityInCart = (itemId: string, variantIndex?: number) => {
    const cartItemId = itemId + (variantIndex !== undefined ? `-variant-${variantIndex}` : '')
    const cartItem = state.items.find(item => item.id === cartItemId)
    return cartItem ? cartItem.quantity : 0
  }

  const handleAddToCart = (item: MenuItem, variantIndex?: number) => {
    const selectedVariantIndex = variantIndex ?? selectedVariants[item._id] ?? 0
    const price = item.variants && item.variants.length > selectedVariantIndex 
      ? item.variants[selectedVariantIndex].price 
      : item.price
    
    const variantName = item.variants && item.variants.length > selectedVariantIndex
      ? item.variants[selectedVariantIndex].name
      : undefined

    addToCart({
      id: item._id + (variantIndex !== undefined ? `-variant-${variantIndex}` : ''),
      menuItem: item._id,
      name: item.name + (variantName ? ` (${variantName})` : ''),
      price: price,
      quantity: 1,
      variantIndex: variantIndex,
      variantName: variantName
    })
  }

  const handleUpdateQuantity = (itemId: string, newQuantity: number, variantIndex?: number) => {
    const cartItemId = itemId + (variantIndex !== undefined ? `-variant-${variantIndex}` : '')
    if (newQuantity === 0) {
      removeFromCart(cartItemId, variantIndex)
    } else {
      updateQuantity(cartItemId, variantIndex, newQuantity)
    }
  }

  const getTotalItems = () => {
    return state.items.reduce((total, item) => total + item.quantity, 0)
  }

  const getTotalPrice = () => {
    return state.items.reduce((total, item) => total + (item.price * item.quantity), 0)
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6F1D1B] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading menu...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
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
    <div className="min-h-screen" style={{ backgroundColor: '#FFE6A7' }}>
      {/* Header */}
      <div className="bg-white shadow-md border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Our Menu</h1>
              <p className="text-gray-600 text-sm">Authentic Bengali Cuisine</p>
            </div>
            <div className="flex items-center space-x-4">
              {/* Cart Summary */}
              <Link 
                href="/app/cart"
                className="flex items-center bg-[#6F1D1B] text-white px-4 py-2 rounded-md hover:bg-[#432818] transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5 6m0 0h9m-9 0h9" />
                </svg>
                Cart ({getTotalItems()}) - ₹{getTotalPrice().toFixed(2)}
              </Link>
              
              {/* Profile Button */}
              <Link
                href="/app/profile"
                className="flex items-center bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Profile
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex items-center space-x-4">
              <input
                type="text"
                placeholder="Search dishes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6F1D1B]"
              />
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={showVegOnly}
                  onChange={(e) => setShowVegOnly(e.target.checked)}
                  className="rounded border-gray-300 text-[#6F1D1B] focus:ring-[#6F1D1B]"
                />
                <span className="text-gray-700">Vegetarian Only</span>
              </label>
            </div>
          </div>
          
          {/* Category Buttons */}
          <div className="flex flex-wrap gap-2 mt-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-[#6F1D1B] text-white'
                    : 'bg-[#BB9457] text-[#432818] hover:bg-[#99582A] hover:text-white'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Menu Items Grid */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No items found</h3>
            <p className="text-gray-600">Try adjusting your filters or search term.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredItems.map((item) => {
              const selectedVariantIndex = selectedVariants[item._id] ?? 0
              const displayPrice = item.variants && item.variants.length > 0
                ? item.variants[selectedVariantIndex]?.price ?? item.price
                : item.price
              const quantityInCart = getItemQuantityInCart(item._id, item.variants ? selectedVariantIndex : undefined)
              
              return (
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
                            {item.isVeg ? 'VEG' : 'NON-VEG'}
                          </span>
                        </div>
                        {item.description && (
                          <p className="text-gray-600 text-sm mb-3">{item.description}</p>
                        )}
                      </div>
                    </div>

                    {/* Variant Selection */}
                    {item.variants && item.variants.length > 0 && (
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Size/Variant:</label>
                        <select
                          value={selectedVariantIndex}
                          onChange={(e) => setSelectedVariants(prev => ({
                            ...prev,
                            [item._id]: parseInt(e.target.value)
                          }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6F1D1B]"
                        >
                          {item.variants.map((variant, index) => (
                            <option key={index} value={index}>
                              {variant.name} - ₹{variant.price}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                    
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-xl font-bold text-[#6F1D1B]">₹{displayPrice}</span>
                      <div className="text-sm">
                        {item.isAvailable ? (
                          <span className="text-green-600 font-medium">Available</span>
                        ) : (
                          <span className="text-red-600 font-medium">Out of Stock</span>
                        )}
                      </div>
                    </div>

                    {/* Add to Cart Controls */}
                    {!item.isAvailable ? (
                      <button
                        disabled
                        className="w-full bg-gray-300 text-gray-500 py-2 px-4 rounded-md cursor-not-allowed"
                      >
                        Out of Stock
                      </button>
                    ) : quantityInCart === 0 ? (
                      <button
                        onClick={() => handleAddToCart(item, item.variants ? selectedVariantIndex : undefined)}
                        className="w-full bg-[#6F1D1B] text-white py-2 px-4 rounded-md hover:bg-[#432818] transition-colors font-medium"
                      >
                        Add to Cart
                      </button>
                    ) : (
                      <div className="flex items-center justify-between bg-[#6F1D1B] text-white rounded-md">
                        <button
                          onClick={() => handleUpdateQuantity(item._id, quantityInCart - 1, item.variants ? selectedVariantIndex : undefined)}
                          className="px-4 py-2 hover:bg-[#432818] rounded-l-md transition-colors"
                        >
                          -
                        </button>
                        <span className="px-4 py-2 font-medium">{quantityInCart}</span>
                        <button
                          onClick={() => handleUpdateQuantity(item._id, quantityInCart + 1, item.variants ? selectedVariantIndex : undefined)}
                          className="px-4 py-2 hover:bg-[#432818] rounded-r-md transition-colors"
                        >
                          +
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Fixed Checkout Button */}
        {getTotalItems() > 0 && (
          <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
            <Link
              href="/app/checkout"
              className="bg-[#6F1D1B] text-white px-8 py-3 rounded-full shadow-lg hover:bg-[#432818] transition-colors font-semibold"
            >
              Proceed to Checkout ({getTotalItems()} items) - ₹{getTotalPrice().toFixed(2)}
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default AuthenticatedMenuPage
