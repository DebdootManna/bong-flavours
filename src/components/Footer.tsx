'use client'

import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-[#432818] text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <h3 className="text-2xl font-bold font-gupter mb-4 text-[#FFE6A7]">
              Bong Flavours
            </h3>
            <p className="text-[#BB9457] mb-4 max-w-md">
              Experience the authentic taste of Bengal with our traditional recipes passed down through generations. Every dish tells a story of heritage and flavor.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-[#BB9457] hover:text-[#FFE6A7] transition-colors">
                Facebook
              </a>
              <a href="#" className="text-[#BB9457] hover:text-[#FFE6A7] transition-colors">
                Instagram
              </a>
              <a href="#" className="text-[#BB9457] hover:text-[#FFE6A7] transition-colors">
                Twitter
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-[#FFE6A7]">Quick Links</h4>
            <ul className="space-y-2">
              <Link href="/" className="text-[#BB9457] hover:text-[#FFE6A7] transition-colors">
                Home
              </Link>
              <li>
                <a href="/menu" className="text-[#BB9457] hover:text-[#FFE6A7] transition-colors">
                  Menu
                </a>
              </li>
              <li>
                <a href="/gallery" className="text-[#BB9457] hover:text-[#FFE6A7] transition-colors">
                  Gallery
                </a>
              </li>
              <li>
                <a href="/booking" className="text-[#BB9457] hover:text-[#FFE6A7] transition-colors">
                  Book Table
                </a>
              </li>
              <li>
                <a href="/app/menu" className="text-[#BB9457] hover:text-[#FFE6A7] transition-colors">
                  Order Online
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-[#FFE6A7]">Contact Us</h4>
            <div className="space-y-2 text-[#BB9457]">
              <p>📍 123 Park Street</p>
              <p>Kolkata 700016</p>
              <p>📞 +91 98765 43210</p>
              <p>✉️ info@bongflavours.com</p>
              <p>🕒 11:00 AM - 10:00 PM</p>
              <p>(Daily)</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[#6F1D1B] mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-[#BB9457] text-sm">
            © 2024 Bong Flavours. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-[#BB9457] hover:text-[#FFE6A7] transition-colors text-sm">
              Privacy Policy
            </a>
            <a href="#" className="text-[#BB9457] hover:text-[#FFE6A7] transition-colors text-sm">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
