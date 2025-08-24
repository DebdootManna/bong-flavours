'use client'

import { useState, useEffect } from 'react'

// Sample featured items - in a real app, this would come from the database
const featuredItems = [
  {
    id: 1,
    name: 'Hilsa Fish Curry',
    description: 'Traditional Bengali hilsa fish cooked in mustard gravy',
    price: 450,
    image: '/placeholder-dish.jpg',
    veg: false
  },
  {
    id: 2,
    name: 'Kolkata Biryani',
    description: 'Aromatic basmati rice with tender mutton and boiled egg',
    price: 380,
    image: '/placeholder-dish.jpg',
    veg: false
  },
  {
    id: 3,
    name: 'Aloo Posto',
    description: 'Potatoes cooked in poppy seed paste - a Bengali classic',
    price: 220,
    image: '/placeholder-dish.jpg',
    veg: true
  },
  {
    id: 4,
    name: 'Roshogolla',
    description: 'Soft, spongy cottage cheese balls in sugar syrup',
    price: 120,
    image: '/placeholder-dish.jpg',
    veg: true
  }
]

export default function FeaturedMenu() {
  const [activeIndex, setActiveIndex] = useState(0)

  // Auto-rotate featured items
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % featuredItems.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#6F1D1B] font-gupter mb-4">
            Featured Dishes
          </h2>
          <p className="text-[#432818] text-lg max-w-2xl mx-auto">
            Discover our chef&apos;s special recommendations and signature Bengali delicacies
          </p>
        </div>

        {/* Featured Item Showcase */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-[#FFE6A7] rounded-2xl overflow-hidden shadow-xl">
            <div className="md:flex">
              {/* Image */}
              <div className="md:w-1/2">
                <div className="h-64 md:h-80 bg-gradient-to-r from-[#BB9457] to-[#99582A] flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="text-4xl mb-2">🍛</div>
                    <p className="text-lg font-gupter">{featuredItems[activeIndex].name}</p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="md:w-1/2 p-8 flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-3">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    featuredItems[activeIndex].veg 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {featuredItems[activeIndex].veg ? '🟢 Veg' : '🔴 Non-Veg'}
                  </span>
                  <span className="bg-[#6F1D1B] text-white px-3 py-1 rounded-full text-sm font-medium">
                    Chef&apos;s Special
                  </span>
                </div>

                <h3 className="text-2xl md:text-3xl font-bold text-[#6F1D1B] font-gupter mb-3">
                  {featuredItems[activeIndex].name}
                </h3>

                <p className="text-[#432818] mb-4 leading-relaxed">
                  {featuredItems[activeIndex].description}
                </p>

                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-[#6F1D1B]">
                    ₹{featuredItems[activeIndex].price}
                  </span>
                  <button className="bg-[#6F1D1B] text-white px-6 py-2 rounded-lg hover:bg-[#432818] transition-colors">
                    Order Now
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Dots */}
          <div className="flex justify-center mt-6 space-x-2">
            {featuredItems.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === activeIndex ? 'bg-[#6F1D1B]' : 'bg-[#BB9457]'
                }`}
              />
            ))}
          </div>
        </div>

        {/* All Featured Items Grid */}
        <div className="mt-16">
          <h3 className="text-2xl font-bold text-[#6F1D1B] font-gupter text-center mb-8">
            All Featured Items
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
                onClick={() => setActiveIndex(item.id - 1)}
              >
                <div className="h-40 bg-gradient-to-r from-[#BB9457] to-[#99582A] flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="text-2xl mb-1">🍛</div>
                    <p className="text-sm font-gupter">{item.name}</p>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-bold text-[#6F1D1B] font-gupter">
                      {item.name}
                    </h4>
                    <span className={`w-3 h-3 rounded-full ${
                      item.veg ? 'bg-green-500' : 'bg-red-500'
                    }`} />
                  </div>
                  <p className="text-[#432818] text-sm mb-3 line-clamp-2">
                    {item.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-[#6F1D1B]">
                      ₹{item.price}
                    </span>
                    <button className="text-[#6F1D1B] hover:text-[#432818] font-medium text-sm">
                      View →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
