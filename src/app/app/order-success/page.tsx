'use client'

import { useState, useEffect, useCallback, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

interface Order {
  _id: string
  orderNumber: string
  customerInfo: {
    name: string
    email: string
    phone: string
  }
  items: Array<{
    name: string
    price: number
    quantity: number
  }>
  subtotal: number
  tax: number
  total: number
  status: string
  paymentMethod: string
  createdAt: string
  deliveryInfo: {
    estimatedTime?: string
  }
}

const OrderSuccessContent = () => {
  const searchParams = useSearchParams()
  const orderId = searchParams.get('orderId')
  
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchOrderDetails = useCallback(async () => {
    if (!orderId) {
      setError('No order ID provided')
      setLoading(false)
      return
    }

    try {
      const response = await fetch(`/api/orders/${orderId}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch order details')
      }

      const data = await response.json()
      setOrder(data.order)
    } catch (error) {
      console.error('Error fetching order:', error)
      setError('Failed to load order details')
    } finally {
      setLoading(false)
    }
  }, [orderId])

  useEffect(() => {
    fetchOrderDetails()
  }, [orderId, fetchOrderDetails])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFE6A7] flex items-center justify-center">
        <div className="text-[#6F1D1B] text-xl">Loading order details...</div>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-[#FFE6A7] flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">{error || 'Order not found'}</div>
          <Link
            href="/app/menu"
            className="bg-[#6F1D1B] text-white px-6 py-2 rounded-md hover:bg-[#432818] transition-colors"
          >
            Back to Menu
          </Link>
        </div>
      </div>
    )
  }

  const estimatedDeliveryTime = order.deliveryInfo?.estimatedTime 
    ? new Date(order.deliveryInfo.estimatedTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : '45-60 minutes'

  return (
    <div className="min-h-screen bg-[#FFE6A7] py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-[#6F1D1B] mb-2">Order Placed Successfully!</h1>
          <p className="text-[#432818] text-lg">Thank you for choosing Bong Flavours</p>
        </div>

        {/* Order Details Card */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="border-b pb-4 mb-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-[#6F1D1B]">Order #{order.orderNumber}</h2>
                <p className="text-gray-600">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-[#6F1D1B]">₹{order.total}</div>
                <div className="text-sm text-gray-600 capitalize">{order.paymentMethod} Payment</div>
              </div>
            </div>
          </div>

          {/* Customer Info */}
          <div className="mb-4">
            <h3 className="font-semibold text-[#6F1D1B] mb-2">Customer Information</h3>
            <div className="text-gray-700">
              <p><strong>Name:</strong> {order.customerInfo.name}</p>
              <p><strong>Phone:</strong> {order.customerInfo.phone}</p>
              {order.customerInfo.email && (
                <p><strong>Email:</strong> {order.customerInfo.email}</p>
              )}
            </div>
          </div>

          {/* Order Items */}
          <div className="mb-4">
            <h3 className="font-semibold text-[#6F1D1B] mb-2">Order Items</h3>
            <div className="space-y-2">
              {order.items.map((item, index) => (
                <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100">
                  <div>
                    <span className="font-medium">{item.name}</span>
                    <span className="text-gray-600 ml-2">x{item.quantity}</span>
                  </div>
                  <span className="font-medium">₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="border-t pt-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>₹{order.subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax (18%):</span>
                <span>₹{order.tax}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee:</span>
                <span>₹{order.total - order.subtotal - order.tax}</span>
              </div>
              <div className="flex justify-between font-bold text-lg text-[#6F1D1B] border-t pt-2">
                <span>Total:</span>
                <span>₹{order.total}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Delivery Information */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="font-semibold text-[#6F1D1B] mb-3">Delivery Information</h3>
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-[#6F1D1B] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <div className="font-medium text-[#6F1D1B]">Estimated Delivery Time</div>
              <div className="text-gray-600">{estimatedDeliveryTime}</div>
              <div className="text-sm text-gray-500 mt-1">
                We&apos;ll call you when your order is ready for delivery
              </div>
            </div>
          </div>
        </div>

        {/* Order Status */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="font-semibold text-[#6F1D1B] mb-3">Order Status</h3>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <div className="font-medium capitalize">{order.status}</div>
              <div className="text-sm text-gray-600">
                Your order is being processed. You&apos;ll receive updates via SMS/WhatsApp.
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/app/profile"
            className="flex-1 bg-[#6F1D1B] text-white py-3 px-6 rounded-md hover:bg-[#432818] transition-colors text-center font-medium"
          >
            View Order History
          </Link>
          <Link
            href="/app/menu"
            className="flex-1 bg-gray-500 text-white py-3 px-6 rounded-md hover:bg-gray-600 transition-colors text-center font-medium"
          >
            Order More Food
          </Link>
        </div>

        {/* Contact Information */}
        <div className="mt-8 text-center text-gray-600">
          <p>Need help with your order?</p>
          <p className="font-medium">Call us at <span className="text-[#6F1D1B]">8238018577</span></p>
        </div>
      </div>
    </div>
  )
}

const OrderSuccessPage = () => {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#6F1D1B] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <OrderSuccessContent />
    </Suspense>
  )
}

export default OrderSuccessPage
