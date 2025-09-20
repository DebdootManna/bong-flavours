'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { useCart } from '@/contexts/CartContext'

interface DeliveryInfo {
  fullName: string
  phone: string
  email: string
  address: string
  city: string
  pincode: string
  landmark: string
  specialInstructions: string
}

const CheckoutPage = () => {
  const { user } = useAuth()
  const { state: cartState, clearCart } = useCart()
  const router = useRouter()

  const [deliveryInfo, setDeliveryInfo] = useState<DeliveryInfo>({
    fullName: user?.name || '',
    phone: '',
    email: user?.email || '',
    address: '',
    city: '',
    pincode: '',
    landmark: '',
    specialInstructions: ''
  })

  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'online'>('cash')
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Partial<DeliveryInfo>>({})

  // Calculate pricing breakdown
  const subtotal = cartState.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const deliveryFee = 40
  const taxRate = 0.18
  const tax = Math.round(subtotal * taxRate)
  const total = subtotal + tax + deliveryFee

  // Redirect if cart is empty (use useEffect to avoid SSR issues)
  useEffect(() => {
    if (cartState.items.length === 0) {
      router.push('/app/menu')
    }
  }, [cartState.items.length, router])

  // Return early if cart is empty to prevent rendering
  if (cartState.items.length === 0) {
    return null
  }

  const validateForm = () => {
    const newErrors: Partial<DeliveryInfo> = {}

    if (!deliveryInfo.fullName.trim()) newErrors.fullName = 'Full name is required'
    if (!deliveryInfo.phone.trim()) newErrors.phone = 'Phone number is required'
    if (!/^[0-9]{10}$/.test(deliveryInfo.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Please enter a valid 10-digit phone number'
    }
    if (!deliveryInfo.address.trim()) newErrors.address = 'Address is required'
    if (!deliveryInfo.city.trim()) newErrors.city = 'City is required'
    if (!deliveryInfo.pincode.trim()) newErrors.pincode = 'Pincode is required'
    if (!/^[0-9]{6}$/.test(deliveryInfo.pincode)) {
      newErrors.pincode = 'Please enter a valid 6-digit pincode'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setDeliveryInfo(prev => ({ ...prev, [name]: value }))
    // Clear error when user starts typing
    if (errors[name as keyof DeliveryInfo]) {
      setErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }

  const handlePlaceOrder = async () => {
    if (!validateForm()) return

    setIsLoading(true)
    try {
      const orderData = {
        items: cartState.items.map(item => ({
          menuItemId: item.menuItem,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          specialInstructions: deliveryInfo.specialInstructions || undefined
        })),
        customerInfo: {
          name: deliveryInfo.fullName,
          email: deliveryInfo.email || user?.email || '',
          phone: deliveryInfo.phone,
          address: deliveryInfo.address
        },
        deliveryInfo: {
          address: `${deliveryInfo.address}, ${deliveryInfo.city}, ${deliveryInfo.pincode}${deliveryInfo.landmark ? `, Near ${deliveryInfo.landmark}` : ''}`,
          phone: deliveryInfo.phone,
          deliveryNotes: deliveryInfo.specialInstructions || undefined
        },
        paymentMethod: paymentMethod === 'cash' ? 'cod' as const : 'online' as const,
        notes: deliveryInfo.specialInstructions || undefined
      }

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to place order')
      }

      const result = await response.json()
      
      // Clear cart and redirect to success page
      clearCart()
      router.push(`/app/order-success?orderId=${result.order._id}`)

    } catch (error) {
      console.error('Error placing order:', error)
      alert(error instanceof Error ? error.message : 'Failed to place order. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#FFE6A7] py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl font-bold text-[#6F1D1B] text-center mb-8">Checkout</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-[#6F1D1B] mb-4">Order Summary</h2>
            
            <div className="space-y-3 mb-4">
              {cartState.items.map((item) => (
                <div key={item.id} className="flex justify-between items-center py-2 border-b">
                  <div>
                    <h3 className="font-medium text-gray-900">{item.name}</h3>
                    <p className="text-sm text-gray-600">₹{item.price} × {item.quantity}</p>
                  </div>
                  <span className="font-medium text-gray-900">₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between text-gray-900">
                <span>Subtotal:</span>
                <span>₹{subtotal}</span>
              </div>
              <div className="flex justify-between text-gray-900">
                <span>Tax (18%):</span>
                <span>₹{tax}</span>
              </div>
              <div className="flex justify-between text-gray-900">
                <span>Delivery Fee:</span>
                <span>₹{deliveryFee}</span>
              </div>
              <div className="flex justify-between font-bold text-lg text-[#6F1D1B] border-t pt-2">
                <span>Total:</span>
                <span>₹{total}</span>
              </div>
            </div>
          </div>

          {/* Delivery Information */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-[#6F1D1B] mb-4">Delivery Information</h2>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={deliveryInfo.fullName}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#6F1D1B] ${
                      errors.fullName ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={deliveryInfo.phone}
                    onChange={handleInputChange}
                    placeholder="10-digit number"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#6F1D1B] ${
                      errors.phone ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={deliveryInfo.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6F1D1B]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address *
                </label>
                <textarea
                  name="address"
                  value={deliveryInfo.address}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="House number, street name, area"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#6F1D1B] ${
                    errors.address ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={deliveryInfo.city}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#6F1D1B] ${
                      errors.city ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pincode *
                  </label>
                  <input
                    type="text"
                    name="pincode"
                    value={deliveryInfo.pincode}
                    onChange={handleInputChange}
                    placeholder="6-digit code"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#6F1D1B] ${
                      errors.pincode ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.pincode && <p className="text-red-500 text-sm mt-1">{errors.pincode}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Landmark (Optional)
                </label>
                <input
                  type="text"
                  name="landmark"
                  value={deliveryInfo.landmark}
                  onChange={handleInputChange}
                  placeholder="Nearby landmark for easy delivery"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6F1D1B]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Special Instructions (Optional)
                </label>
                <textarea
                  name="specialInstructions"
                  value={deliveryInfo.specialInstructions}
                  onChange={handleInputChange}
                  rows={2}
                  placeholder="Any special instructions for the restaurant or delivery"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6F1D1B]"
                />
              </div>

              {/* Payment Method */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Method
                </label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cash"
                      checked={paymentMethod === 'cash'}
                      onChange={(e) => setPaymentMethod(e.target.value as 'cash' | 'online')}
                      className="mr-2"
                    />
                    Cash on Delivery
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="online"
                      checked={paymentMethod === 'online'}
                      onChange={(e) => setPaymentMethod(e.target.value as 'cash' | 'online')}
                      className="mr-2"
                    />
                    Online Payment (Coming Soon)
                  </label>
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <button
                onClick={handlePlaceOrder}
                disabled={isLoading || paymentMethod === 'online'}
                className="w-full bg-[#6F1D1B] text-white py-3 px-4 rounded-md hover:bg-[#432818] transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {isLoading ? 'Placing Order...' : `Place Order - ₹${total}`}
              </button>
              
              <button
                onClick={() => router.back()}
                className="w-full bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition-colors"
              >
                Back to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CheckoutPage
