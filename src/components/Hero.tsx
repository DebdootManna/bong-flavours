'use client'

import { motion } from 'framer-motion'

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-brand-dark via-brand-dark to-brand-maroon overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 text-6xl">🍛</div>
        <div className="absolute top-32 right-20 text-4xl">🐟</div>
        <div className="absolute bottom-32 left-20 text-5xl">🍚</div>
        <div className="absolute bottom-20 right-10 text-3xl">🥘</div>
        <div className="absolute top-1/2 left-1/4 text-2xl">🍤</div>
        <div className="absolute top-1/3 right-1/3 text-4xl">🌶️</div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl md:text-7xl font-bold text-brand-cream mb-6 leading-tight">
            Taste the{' '}
            <span className="text-brand-tan">Authentic</span>
            <br />
            Bengali Heritage
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-xl md:text-2xl text-brand-cream mb-8 max-w-3xl mx-auto leading-relaxed"
        >
          From traditional fish curry to aromatic biryani, experience the rich flavors of Bengal 
          crafted with authentic recipes and the finest ingredients.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-6 justify-center items-center"
        >
          <motion.a
            href="/app/menu"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn-secondary text-lg px-8 py-4"
          >
            Order Now
          </motion.a>
          
          <motion.a
            href="/menu"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-transparent border-2 border-brand-cream text-brand-cream px-8 py-4 rounded-lg font-medium hover:bg-brand-cream hover:text-brand-dark transition-all duration-200 text-lg"
          >
            View Menu
          </motion.a>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
        >
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-brand-tan mb-2">500+</div>
            <div className="text-brand-cream">Happy Customers</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-brand-tan mb-2">50+</div>
            <div className="text-brand-cream">Authentic Dishes</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-brand-tan mb-2">4.8</div>
            <div className="text-brand-cream">Average Rating</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-brand-tan mb-2">30min</div>
            <div className="text-brand-cream">Delivery Time</div>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-brand-cream text-2xl"
        >
          ↓
        </motion.div>
      </motion.div>
    </section>
  )
}
