'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'

export default function BookingPage() {
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    guests: 2,
    specialRequests: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user) {
      setMessage('Please login to make a booking')
      return
    }

    setIsSubmitting(true)
    setMessage('')

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setMessage('Booking request submitted successfully! We will confirm your reservation shortly.')
        setFormData({
          name: '',
          email: '',
          phone: '',
          date: '',
          time: '',
          guests: 2,
          specialRequests: ''
        })
      } else {
        setMessage('Failed to submit booking. Please try again.')
      }
    } catch (error) {
      console.error('Booking error:', error)
      setMessage('An error occurred. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Get today's date for min date input
  const today = new Date().toISOString().split('T')[0]

  return (
    <div className="min-h-screen bg-[#FFE6A7] pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-[#6F1D1B] font-gupter mb-4">
            Book a Table
          </h1>
          <p className="text-[#432818] text-lg max-w-2xl mx-auto">
            Reserve your spot for an authentic Bengali dining experience
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          {/* Login Notice */}
          {!user && (
            <div className="bg-orange-100 border border-orange-200 rounded-lg p-4 mb-6">
              <p className="text-orange-800 text-center">
                Please <strong>login</strong> to make a reservation
              </p>
            </div>
          )}

          {/* Booking Form */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-[#432818] mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  disabled={!user}
                  className="w-full px-4 py-2 border border-[#BB9457] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6F1D1B] focus:border-transparent disabled:bg-gray-100"
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-[#432818] mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={!user}
                  className="w-full px-4 py-2 border border-[#BB9457] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6F1D1B] focus:border-transparent disabled:bg-gray-100"
                />
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-[#432818] mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  disabled={!user}
                  className="w-full px-4 py-2 border border-[#BB9457] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6F1D1B] focus:border-transparent disabled:bg-gray-100"
                />
              </div>

              {/* Date and Time */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="date" className="block text-sm font-medium text-[#432818] mb-2">
                    Date *
                  </label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    min={today}
                    required
                    disabled={!user}
                    className="w-full px-4 py-2 border border-[#BB9457] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6F1D1B] focus:border-transparent disabled:bg-gray-100"
                  />
                </div>
                <div>
                  <label htmlFor="time" className="block text-sm font-medium text-[#432818] mb-2">
                    Time *
                  </label>
                  <select
                    id="time"
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    required
                    disabled={!user}
                    className="w-full px-4 py-2 border border-[#BB9457] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6F1D1B] focus:border-transparent disabled:bg-gray-100"
                  >
                    <option value="">Select Time</option>
                    <option value="11:00">11:00 AM</option>
                    <option value="11:30">11:30 AM</option>
                    <option value="12:00">12:00 PM</option>
                    <option value="12:30">12:30 PM</option>
                    <option value="13:00">1:00 PM</option>
                    <option value="13:30">1:30 PM</option>
                    <option value="14:00">2:00 PM</option>
                    <option value="14:30">2:30 PM</option>
                    <option value="18:00">6:00 PM</option>
                    <option value="18:30">6:30 PM</option>
                    <option value="19:00">7:00 PM</option>
                    <option value="19:30">7:30 PM</option>
                    <option value="20:00">8:00 PM</option>
                    <option value="20:30">8:30 PM</option>
                    <option value="21:00">9:00 PM</option>
                    <option value="21:30">9:30 PM</option>
                  </select>
                </div>
              </div>

              {/* Number of Guests */}
              <div>
                <label htmlFor="guests" className="block text-sm font-medium text-[#432818] mb-2">
                  Number of Guests *
                </label>
                <select
                  id="guests"
                  name="guests"
                  value={formData.guests}
                  onChange={handleChange}
                  required
                  disabled={!user}
                  className="w-full px-4 py-2 border border-[#BB9457] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6F1D1B] focus:border-transparent disabled:bg-gray-100"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                    <option key={num} value={num}>
                      {num} {num === 1 ? 'Guest' : 'Guests'}
                    </option>
                  ))}
                  <option value="more">More than 10 (call us)</option>
                </select>
              </div>

              {/* Special Requests */}
              <div>
                <label htmlFor="specialRequests" className="block text-sm font-medium text-[#432818] mb-2">
                  Special Requests
                </label>
                <textarea
                  id="specialRequests"
                  name="specialRequests"
                  value={formData.specialRequests}
                  onChange={handleChange}
                  rows={4}
                  disabled={!user}
                  placeholder="Any dietary restrictions, celebration details, or special arrangements..."
                  className="w-full px-4 py-2 border border-[#BB9457] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6F1D1B] focus:border-transparent disabled:bg-gray-100"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!user || isSubmitting}
                className="w-full bg-[#6F1D1B] text-white py-3 px-6 rounded-lg font-medium hover:bg-[#432818] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Submitting...' : 'Book Table'}
              </button>
            </form>

            {/* Message */}
            {message && (
              <div className={`mt-4 p-4 rounded-lg ${
                message.includes('successfully') 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {message}
              </div>
            )}
          </div>

          {/* Contact Info */}
          <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-[#6F1D1B] font-gupter mb-4">
              Contact Information
            </h3>
            <div className="space-y-2 text-[#432818]">
              <p><strong>Phone:</strong> +91 98765 43210</p>
              <p><strong>Email:</strong> reservations@bongflavours.com</p>
              <p><strong>Address:</strong> 123 Park Street, Kolkata 700016</p>
              <p><strong>Hours:</strong> 11:00 AM - 10:00 PM (Daily)</p>
            </div>
            <div className="mt-4 p-4 bg-[#FFE6A7] rounded-lg">
              <p className="text-sm text-[#432818]">
                <strong>Note:</strong> For parties of 10 or more, please call us directly to discuss arrangements and special menu options.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
