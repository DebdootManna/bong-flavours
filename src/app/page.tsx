'use client'

import { motion } from 'framer-motion'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Hero from '@/components/Hero'
import FeaturedMenu from '@/components/FeaturedMenu'
import Testimonials from '@/components/Testimonials'
import ContactInfo from '@/components/ContactInfo'

export default function Home() {
  return (
    <main className="min-h-screen bg-brand-dark">
      <Header />
      
      <Hero />
      
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="py-20 px-4"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-brand-cream mb-6">
              Authentic Bengali Flavours
            </h2>
            <p className="text-xl text-brand-tan max-w-3xl mx-auto leading-relaxed">
              Experience the rich heritage of Bengali cuisine with our traditional recipes, 
              passed down through generations and crafted with love.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="card text-center"
            >
              <div className="w-16 h-16 bg-brand-maroon rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🍛</span>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-brand-maroon">Traditional Recipes</h3>
              <p className="text-brand-dark leading-relaxed">
                Authentic Bengali dishes prepared with traditional cooking methods and the finest ingredients.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="card text-center"
            >
              <div className="w-16 h-16 bg-brand-maroon rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🚚</span>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-brand-maroon">Fast Delivery</h3>
              <p className="text-brand-dark leading-relaxed">
                Hot, fresh meals delivered to your doorstep with our efficient delivery service.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="card text-center"
            >
              <div className="w-16 h-16 bg-brand-maroon rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⭐</span>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-brand-maroon">Quality Assured</h3>
              <p className="text-brand-dark leading-relaxed">
                Every dish is carefully prepared and quality-checked before reaching your table.
              </p>
            </motion.div>
          </div>
        </div>
      </motion.section>
      
      <FeaturedMenu />
      
      <section className="py-20 px-4 bg-brand-maroon">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-brand-cream mb-8">
              Ready to Experience Bengali Cuisine?
            </h2>
            <p className="text-xl text-brand-cream mb-10 leading-relaxed">
              Join thousands of satisfied customers who have made Bong Flavours their go-to destination for authentic Bengali food.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.a
                href="/app/menu"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-secondary inline-block"
              >
                Order Online
              </motion.a>
              <motion.a
                href="/booking"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-transparent border-2 border-brand-cream text-brand-cream px-6 py-3 rounded-lg font-medium hover:bg-brand-cream hover:text-brand-maroon transition-all duration-200"
              >
                Book a Table
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>
      
      <Testimonials />
      <ContactInfo />
      <Footer />
    </main>
  )
}
