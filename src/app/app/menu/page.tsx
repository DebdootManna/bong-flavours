'use client'

import { useEffect, useState, useCallback } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useCart } from '@/contexts/CartContext'
import { useRouter } from 'next/navigation'

interface MenuItem {
  id: string
  name: string
  category: string
  price: number
  description?: string
  veg: boolean
}

const MenuPage = () => {
  const { user, loading } = useAuth()
  const { addToCart } = useCart()
  const router = useRouter()
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [filteredItems, setFilteredItems] = useState<MenuItem[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchTerm, setSearchTerm] = useState('')
  const [showVegOnly, setShowVegOnly] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const filterItems = useCallback(() => {
    let filtered = menuItems

    if (selectedCategory !== 'All') {
      filtered = filtered.filter(item => item.category === selectedCategory)
    }

    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    if (showVegOnly) {
      filtered = filtered.filter(item => item.veg)
    }

    setFilteredItems(filtered)
  }, [menuItems, selectedCategory, searchTerm, showVegOnly])

  const fetchMenuItems = async () => {
    try {
      const response = await fetch('/api/menu')
      const data = await response.json()
      
      if (data.success) {
        setMenuItems(data.items)
        const uniqueCategories = Array.from(new Set(data.items.map((item: MenuItem) => item.category)))
        setCategories(['All', ...uniqueCategories.filter(cat => typeof cat === 'string')])
      }
    } catch (error) {
      console.error('Error fetching menu:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
      return
    }
  }, [user, loading, router])

  useEffect(() => {
    fetchMenuItems()
  }, [])

  useEffect(() => {
    filterItems()
  }, [filterItems])

  const handleAddToCart = (item: MenuItem) => {
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: 1,
      menuItem: item.id
    })
  }

  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFE6A7]">
        <div className="text-[#6F1D1B] text-xl">Loading menu...</div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-[#FFE6A7] py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-[#6F1D1B] text-center mb-8">Our Menu</h1>
        
        {/* Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-wrap gap-4 justify-center">
            <input
              type="text"
              placeholder="Search dishes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 border border-[#432818] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6F1D1B]"
            />
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={showVegOnly}
                onChange={(e) => setShowVegOnly(e.target.checked)}
                className="mr-2"
              />
              <span className="text-[#432818]">Vegetarian Only</span>
            </label>
          </div>
          
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  selectedCategory === category
                    ? 'bg-[#6F1D1B] text-[#FFE6A7]'
                    : 'bg-[#BB9457] text-[#432818] hover:bg-[#99582A] hover:text-[#FFE6A7]'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Menu Items */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-lg shadow-lg p-6 border border-[#BB9457]"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-semibold text-[#6F1D1B]">{item.name}</h3>
                <span className={`text-sm px-2 py-1 rounded ${
                  item.veg ? 'bg-green-100 text-green-800' : 'bg-[#6F1D1B] text-[#FFE6A7]'
                }`}>
                  {item.veg ? 'VEG' : 'NON-VEG'}
                </span>
              </div>
              
              {item.description && (
                <p className="text-[#432818] text-sm mb-4">{item.description}</p>
              )}
              
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-[#6F1D1B]">₹{item.price}</span>
                <button
                  onClick={() => handleAddToCart(item)}
                  className="bg-[#6F1D1B] text-[#FFE6A7] px-4 py-2 rounded-lg hover:bg-[#99582A] transition-colors"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <p className="text-[#432818] text-xl">No items found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default MenuPage
