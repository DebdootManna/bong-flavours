'use client'

export default function ContactInfo() {
  return (
    <section className="py-16 bg-[#432818] text-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold font-gupter mb-4 text-[#FFE6A7]">
            Visit Us Today
          </h2>
          <p className="text-[#BB9457] text-lg max-w-2xl mx-auto">
            Experience authentic Bengali cuisine in the heart of the city. We&apos;re here to serve you!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div>
            <h3 className="text-2xl font-bold font-gupter mb-6 text-[#FFE6A7]">
              Get in Touch
            </h3>
            
            <div className="space-y-6">
              {/* Address */}
              <div className="flex items-start space-x-4">
                <div className="text-[#FFE6A7] text-xl mt-1">📍</div>
                <div>
                  <h4 className="font-semibold text-[#FFE6A7] mb-1">Address</h4>
                  <p className="text-[#BB9457]">
                    123 Park Street<br />
                    Kolkata 700016<br />
                    West Bengal, India
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start space-x-4">
                <div className="text-[#FFE6A7] text-xl mt-1">📞</div>
                <div>
                  <h4 className="font-semibold text-[#FFE6A7] mb-1">Phone</h4>
                  <p className="text-[#BB9457]">
                    +91 98765 43210<br />
                    +91 98765 43211
                  </p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start space-x-4">
                <div className="text-[#FFE6A7] text-xl mt-1">✉️</div>
                <div>
                  <h4 className="font-semibold text-[#FFE6A7] mb-1">Email</h4>
                  <p className="text-[#BB9457]">
                    info@bongflavours.com<br />
                    reservations@bongflavours.com
                  </p>
                </div>
              </div>

              {/* Hours */}
              <div className="flex items-start space-x-4">
                <div className="text-[#FFE6A7] text-xl mt-1">🕒</div>
                <div>
                  <h4 className="font-semibold text-[#FFE6A7] mb-1">Opening Hours</h4>
                  <div className="text-[#BB9457] space-y-1">
                    <p>Monday - Sunday: 11:00 AM - 10:00 PM</p>
                    <p className="text-sm">Last order: 9:30 PM</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div className="mt-8">
              <h4 className="font-semibold text-[#FFE6A7] mb-4">Follow Us</h4>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="bg-[#6F1D1B] text-white p-3 rounded-full hover:bg-[#99582A] transition-colors"
                >
                  FB
                </a>
                <a
                  href="#"
                  className="bg-[#6F1D1B] text-white p-3 rounded-full hover:bg-[#99582A] transition-colors"
                >
                  IG
                </a>
                <a
                  href="#"
                  className="bg-[#6F1D1B] text-white p-3 rounded-full hover:bg-[#99582A] transition-colors"
                >
                  TW
                </a>
                <a
                  href="#"
                  className="bg-[#6F1D1B] text-white p-3 rounded-full hover:bg-[#99582A] transition-colors"
                >
                  YT
                </a>
              </div>
            </div>
          </div>

          {/* Map Placeholder & Quick Actions */}
          <div>
            <h3 className="text-2xl font-bold font-gupter mb-6 text-[#FFE6A7]">
              Find Us
            </h3>
            
            {/* Map Placeholder */}
            <div className="bg-[#6F1D1B] rounded-xl p-8 mb-6 h-64 flex items-center justify-center">
              <div className="text-center text-[#FFE6A7]">
                <div className="text-4xl mb-4">🗺️</div>
                <p className="text-lg font-gupter">Interactive Map</p>
                <p className="text-sm text-[#BB9457] mt-2">
                  123 Park Street, Kolkata
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button className="bg-[#6F1D1B] text-white py-3 px-6 rounded-lg hover:bg-[#99582A] transition-colors font-medium">
                Get Directions
              </button>
              <button className="bg-[#6F1D1B] text-white py-3 px-6 rounded-lg hover:bg-[#99582A] transition-colors font-medium">
                Call Now
              </button>
              <button className="bg-[#6F1D1B] text-white py-3 px-6 rounded-lg hover:bg-[#99582A] transition-colors font-medium">
                Book Table
              </button>
              <button className="bg-[#6F1D1B] text-white py-3 px-6 rounded-lg hover:bg-[#99582A] transition-colors font-medium">
                Order Online
              </button>
            </div>

            {/* Special Notes */}
            <div className="mt-6 bg-[#6F1D1B] rounded-lg p-4">
              <h4 className="font-semibold text-[#FFE6A7] mb-2">Special Notes</h4>
              <ul className="text-[#BB9457] text-sm space-y-1">
                <li>• Free parking available</li>
                <li>• Wheelchair accessible</li>
                <li>• Family-friendly environment</li>
                <li>• Takeaway & delivery available</li>
                <li>• Group bookings welcome</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="mt-16 bg-[#6F1D1B] rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-bold font-gupter mb-4 text-[#FFE6A7]">
            Stay Updated
          </h3>
          <p className="text-[#BB9457] mb-6 max-w-md mx-auto">
            Subscribe to our newsletter for special offers, new menu items, and Bengali food tips!
          </p>
          <div className="flex flex-col md:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg text-[#432818] focus:outline-none focus:ring-2 focus:ring-[#FFE6A7]"
            />
            <button className="bg-[#FFE6A7] text-[#432818] px-6 py-3 rounded-lg font-medium hover:bg-[#BB9457] hover:text-white transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
