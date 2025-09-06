'use client'

import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { useCart } from '@/contexts/CartContext'

const CartPage = () => {
  const { user, loading } = useAuth()
  const { state: cartState, updateQuantity, removeFromCart } = useCart()
  const router = useRouter()

  // Calculate pricing breakdown
  const subtotal = cartState.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const deliveryFee = 40
  const taxRate = 0.18
  const tax = Math.round(subtotal * taxRate)
  const total = subtotal + tax + deliveryFee

  // Redirect if not authenticated
  if (!loading && !user) {
    router.push('/login')
    return null
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFE6A7] flex items-center justify-center">
        <div className="text-[#6F1D1B] text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FFE6A7] py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl font-bold text-[#6F1D1B] text-center mb-8">Your Cart</h1>
        
        {cartState.items.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🛒</div>
            <h2 className="text-2xl font-bold text-[#6F1D1B] mb-4">Your cart is empty</h2>
            <p className="text-[#432818] mb-6">Add some delicious Bengali dishes to get started!</p>
            <button
              onClick={() => router.push('/app/menu')}
              className="bg-[#6F1D1B] text-white px-6 py-3 rounded-md hover:bg-[#432818] transition-colors font-medium"
            >
              Browse Menu
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-[#6F1D1B] mb-4">Cart Items</h2>
                
                <div className="space-y-4">
                  {cartState.items.map((item) => (
                    <div key={`${item.id}-${item.variantIndex || 0}`} className="flex items-center space-x-4 py-4 border-b border-gray-200">
                      <div className="flex-1">
                        <h3 className="font-medium text-[#6F1D1B]">{item.name}</h3>
                        <p className="text-gray-600">₹{item.price} each</p>
                        {item.specialInstructions && (
                          <p className="text-sm text-gray-500 mt-1">
                            Note: {item.specialInstructions}
                          </p>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => updateQuantity(item.menuItem, item.variantIndex, item.quantity - 1)}
                          className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors"
                        >
                          -
                        </button>
                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.menuItem, item.variantIndex, item.quantity + 1)}
                          className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors"
                        >
                          +
                        </button>
                      </div>
                      
                      <div className="text-right">
                        <p className="font-medium text-[#6F1D1B]">₹{item.price * item.quantity}</p>
                        <button
                          onClick={() => removeFromCart(item.menuItem, item.variantIndex)}
                          className="text-red-500 hover:text-red-700 text-sm mt-1 transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 flex justify-between items-center">
                  <button
                    onClick={() => router.push('/app/menu')}
                    className="text-[#6F1D1B] hover:text-[#432818] font-medium transition-colors"
                  >
                    ← Continue Shopping
                  </button>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
                <h2 className="text-xl font-bold text-[#6F1D1B] mb-4">Order Summary</h2>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span>Subtotal ({cartState.items.length} items):</span>
                    <span>₹{subtotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax (18%):</span>
                    <span>₹{tax}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Fee:</span>
                    <span>₹{deliveryFee}</span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between font-bold text-lg text-[#6F1D1B]">
                      <span>Total:</span>
                      <span>₹{total}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => router.push('/app/checkout')}
                  className="w-full bg-[#6F1D1B] text-white py-3 px-4 rounded-md hover:bg-[#432818] transition-colors font-medium"
                >
                  Proceed to Checkout
                </button>

                <div className="mt-4 text-center text-sm text-gray-600">
                  <p>🚚 Free delivery on orders above ₹500</p>
                  <p>⏰ Estimated delivery: 45-60 minutes</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CartPage
