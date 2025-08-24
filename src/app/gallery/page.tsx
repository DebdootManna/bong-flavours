'use client'

import { useState } from 'react'

const galleryImages = [
  {
    id: 1,
    url: '/images/gallery/fish-curry.jpg',
    alt: 'Traditional Bengali Fish Curry',
    category: 'Main Course'
  },
  {
    id: 2,
    url: '/images/gallery/biryani.jpg',
    alt: 'Authentic Kolkata Biryani',
    category: 'Biryani'
  },
  {
    id: 3,
    url: '/images/gallery/roshogolla.jpg',
    alt: 'Fresh Roshogolla',
    category: 'Desserts'
  },
  {
    id: 4,
    url: '/images/gallery/kathi-roll.jpg',
    alt: 'Kolkata Kathi Roll',
    category: 'Street Food'
  },
  {
    id: 5,
    url: '/images/gallery/restaurant-interior.jpg',
    alt: 'Restaurant Interior',
    category: 'Restaurant'
  },
  {
    id: 6,
    url: '/images/gallery/tea-setup.jpg',
    alt: 'Traditional Tea Setup',
    category: 'Beverages'
  },
]

const categories = ['All', 'Main Course', 'Biryani', 'Desserts', 'Street Food', 'Restaurant', 'Beverages']

export default function GalleryPage() {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedImage, setSelectedImage] = useState<typeof galleryImages[0] | null>(null)

  const filteredImages = selectedCategory === 'All' 
    ? galleryImages 
    : galleryImages.filter(image => image.category === selectedCategory)

  return (
    <div className="min-h-screen bg-[#FFE6A7] pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-[#6F1D1B] font-gupter mb-4">
            Gallery
          </h1>
          <p className="text-[#432818] text-lg max-w-2xl mx-auto">
            A visual journey through our authentic Bengali cuisine and warm hospitality
          </p>
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full transition-colors ${
                  selectedCategory === category
                    ? 'bg-[#6F1D1B] text-white'
                    : 'bg-white text-[#432818] hover:bg-[#BB9457] hover:text-white'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredImages.map((image) => (
            <div
              key={image.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
              onClick={() => setSelectedImage(image)}
            >
              <div className="aspect-w-4 aspect-h-3 relative h-64">
                <div className="w-full h-full bg-gradient-to-r from-[#BB9457] to-[#99582A] flex items-center justify-center">
                  <p className="text-white text-lg font-gupter">{image.alt}</p>
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-bold text-[#6F1D1B] font-gupter mb-2">
                  {image.alt}
                </h3>
                <span className="inline-block px-3 py-1 bg-[#FFE6A7] text-[#432818] text-sm rounded-full">
                  {image.category}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredImages.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📸</div>
            <h3 className="text-2xl font-bold text-[#6F1D1B] font-gupter mb-2">
              No images found
            </h3>
            <p className="text-[#432818]">
              Try selecting a different category
            </p>
          </div>
        )}

        {/* Modal */}
        {selectedImage && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedImage(null)}
          >
            <div className="max-w-4xl max-h-[90vh] relative">
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute -top-10 right-0 text-white text-xl hover:text-[#FFE6A7] transition-colors"
              >
                ✕ Close
              </button>
              <div className="bg-white rounded-xl p-4">
                <div className="aspect-w-4 aspect-h-3 relative h-96 bg-gradient-to-r from-[#BB9457] to-[#99582A] rounded-lg flex items-center justify-center mb-4">
                  <p className="text-white text-xl font-gupter">{selectedImage.alt}</p>
                </div>
                <h3 className="text-xl font-bold text-[#6F1D1B] font-gupter mb-2">
                  {selectedImage.alt}
                </h3>
                <span className="inline-block px-3 py-1 bg-[#FFE6A7] text-[#432818] text-sm rounded-full">
                  {selectedImage.category}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
