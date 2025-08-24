'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useAuth } from '@/contexts/AuthContext'
import { useCart } from '@/contexts/CartContext'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user, logout } = useAuth()
  const { state: cartState } = useCart()

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Menu', href: '/menu' },
    { name: 'Gallery', href: '/gallery' },
    { name: 'Booking', href: '/booking' },
  ]

  return (
    <header className="bg-brand-dark border-b-2 border-brand-tan sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-12 h-12 bg-brand-maroon rounded-full flex items-center justify-center">
                <span className="text-2xl">🍛</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-brand-cream">Bong Flavours</h1>
                <p className="text-sm text-brand-tan">Authentic Bengali Cuisine</p>
              </div>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <motion.div
                key={item.name}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href={item.href}
                  className="text-brand-cream hover:text-brand-tan transition-colors duration-200 font-medium"
                >
                  {item.name}
                </Link>
              </motion.div>
            ))}
          </div>

          {/* User Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <Link
                  href="/app/menu"
                  className="text-brand-cream hover:text-brand-tan transition-colors duration-200"
                >
                  Order Online
                </Link>
                
                {/* Cart Icon */}
                <Link href="/app/cart" className="relative">
                  <div className="text-brand-cream hover:text-brand-tan transition-colors duration-200">
                    🛒
                    {cartState.items.length > 0 && (
                      <span className="absolute -top-2 -right-2 bg-brand-maroon text-brand-cream text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {cartState.items.reduce((sum, item) => sum + item.quantity, 0)}
                      </span>
                    )}
                  </div>
                </Link>
                
                <div className="flex items-center space-x-2">
                  <span className="text-brand-cream text-sm">Hi, {user.name.split(' ')[0]}</span>
                  <button
                    onClick={logout}
                    className="text-brand-tan hover:text-brand-cream transition-colors duration-200 text-sm"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  href="/login"
                  className="text-brand-cream hover:text-brand-tan transition-colors duration-200"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="btn-primary"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-brand-cream hover:text-brand-tan transition-colors duration-200"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-brand-tan pt-4 pb-4"
          >
            <div className="space-y-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block text-brand-cream hover:text-brand-tan transition-colors duration-200 font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              
              {user ? (
                <>
                  <Link
                    href="/app/menu"
                    className="block text-brand-cream hover:text-brand-tan transition-colors duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Order Online
                  </Link>
                  <Link
                    href="/account"
                    className="block text-brand-cream hover:text-brand-tan transition-colors duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    My Account
                  </Link>
                  <button
                    onClick={() => {
                      logout()
                      setIsMenuOpen(false)
                    }}
                    className="block text-brand-tan hover:text-brand-cream transition-colors duration-200"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="block text-brand-cream hover:text-brand-tan transition-colors duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    href="/signup"
                    className="block btn-primary inline-block"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </nav>
    </header>
  )
}
