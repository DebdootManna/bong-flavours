import Link from 'next/link'

export default function PublicMenuPage() {
  return (
    <div className="min-h-screen bg-[#FFE6A7] pt-24 pb-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-[#6F1D1B] mb-4">Our Menu</h1>
          <p className="text-xl text-[#432818] mb-8">
            Discover the authentic flavors of Bengal
          </p>
          
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-[#6F1D1B] mb-6">Choose Your Experience</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Static Menu */}
              <div className="bg-[#BB9457] rounded-lg p-6 text-center">
                <div className="text-4xl mb-4">📖</div>
                <h3 className="text-xl font-bold text-white mb-3">View Menu</h3>
                <p className="text-[#FFE6A7] mb-4 text-sm">
                  Browse our complete menu with all dishes and prices
                </p>
                <Link
                  href="/menu.html"
                  target="_blank"
                  className="inline-block bg-[#6F1D1B] text-[#FFE6A7] px-6 py-3 rounded-lg hover:bg-[#99582A] transition-colors font-medium"
                >
                  View Full Menu
                </Link>
              </div>

              {/* Interactive Menu with Ordering */}
              <div className="bg-[#99582A] rounded-lg p-6 text-center">
                <div className="text-4xl mb-4">🛒</div>
                <h3 className="text-xl font-bold text-white mb-3">Order Online</h3>
                <p className="text-[#FFE6A7] mb-4 text-sm">
                  Interactive menu with cart and online ordering
                </p>
                <Link
                  href="/app/menu"
                  className="inline-block bg-[#6F1D1B] text-[#FFE6A7] px-6 py-3 rounded-lg hover:bg-[#432818] transition-colors font-medium"
                >
                  Order Now
                </Link>
              </div>
            </div>
            
            <div className="mt-8 text-center">
              <p className="text-[#432818] text-sm">
                💡 <strong>Tip:</strong> Create an account to save favorites and track orders!
              </p>
            </div>
          </div>
        </div>

        {/* Quick Menu Preview */}
        <div className="mt-12">
          <h2 className="text-3xl font-bold text-[#6F1D1B] text-center mb-8">Featured Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[
              { name: 'Shorbot', emoji: '🥤', desc: 'Traditional drinks' },
              { name: 'Starters', emoji: '🥗', desc: 'Appetizers' },
              { name: 'Biryani', emoji: '🍛', desc: 'Fragrant rice dishes' },
              { name: 'Main Course', emoji: '🍽️', desc: 'Traditional curries' },
              { name: 'Chinese', emoji: '🥢', desc: 'Indo-Chinese fusion' },
              { name: 'Roti & Paratha', emoji: '🫓', desc: 'Fresh breads' },
              { name: 'Desserts', emoji: '🍮', desc: 'Sweet treats' },
              { name: 'Kathi Rolls', emoji: '🌯', desc: 'Wrap delights' },
            ].map((category) => (
              <div key={category.name} className="bg-white rounded-lg p-4 text-center shadow-md hover:shadow-lg transition-shadow">
                <div className="text-3xl mb-2">{category.emoji}</div>
                <h3 className="font-bold text-[#6F1D1B] text-sm">{category.name}</h3>
                <p className="text-[#432818] text-xs mt-1">{category.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
