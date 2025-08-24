'use client'

import { useState } from 'react'

const testimonials = [
  {
    id: 1,
    name: 'Priya Sharma',
    location: 'Mumbai',
    rating: 5,
    text: 'Absolutely authentic Bengali food! The fish curry reminded me of my grandmother&apos;s cooking. Will definitely visit again.',
    date: '2 weeks ago'
  },
  {
    id: 2,
    name: 'Rajesh Kumar',
    location: 'Delhi',
    rating: 5,
    text: 'The Kolkata biryani here is the best I&apos;ve had outside of Kolkata. The staff is also very courteous and the ambiance is perfect.',
    date: '1 month ago'
  },
  {
    id: 3,
    name: 'Anita Ghosh',
    location: 'Kolkata',
    rating: 5,
    text: 'Being a Bengali, I can say this restaurant truly captures the essence of our cuisine. The posto and fish curry are exceptional!',
    date: '3 weeks ago'
  },
  {
    id: 4,
    name: 'Michael Johnson',
    location: 'California, USA',
    rating: 5,
    text: 'Discovered Bengali cuisine through this restaurant during my visit to India. Amazing flavors and very welcoming atmosphere.',
    date: '1 week ago'
  },
  {
    id: 5,
    name: 'Deepika Patel',
    location: 'Ahmedabad',
    rating: 4,
    text: 'Great food and service. The roshogolla is heavenly! Perfect place for a family dinner.',
    date: '2 months ago'
  },
  {
    id: 6,
    name: 'Amit Roy',
    location: 'Bangalore',
    rating: 5,
    text: 'Feels like home! The traditional recipes and warm hospitality make this place special.',
    date: '3 days ago'
  }
]

export default function Testimonials() {
  const [currentPage, setCurrentPage] = useState(0)
  const testimonialsPerPage = 3
  const totalPages = Math.ceil(testimonials.length / testimonialsPerPage)

  const getCurrentTestimonials = () => {
    const start = currentPage * testimonialsPerPage
    return testimonials.slice(start, start + testimonialsPerPage)
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        className={`text-lg ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
      >
        ★
      </span>
    ))
  }

  return (
    <section className="py-16 bg-[#FFE6A7]">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#6F1D1B] font-gupter mb-4">
            What Our Guests Say
          </h2>
          <p className="text-[#432818] text-lg max-w-2xl mx-auto">
            Real experiences from food lovers who have tasted our authentic Bengali cuisine
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {getCurrentTestimonials().map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="font-bold text-[#6F1D1B] font-gupter">
                    {testimonial.name}
                  </h4>
                  <p className="text-[#99582A] text-sm">{testimonial.location}</p>
                </div>
                <div className="flex">
                  {renderStars(testimonial.rating)}
                </div>
              </div>

              {/* Testimonial Text */}
              <blockquote className="text-[#432818] mb-4 leading-relaxed">
                &ldquo;{testimonial.text}&rdquo;
              </blockquote>

              {/* Date */}
              <div className="text-[#99582A] text-sm">
                {testimonial.date}
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-4">
            <button
              onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
              disabled={currentPage === 0}
              className="px-4 py-2 bg-white text-[#6F1D1B] rounded-lg hover:bg-[#BB9457] hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            <div className="flex space-x-2">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i)}
                  className={`w-10 h-10 rounded-full transition-colors ${
                    i === currentPage
                      ? 'bg-[#6F1D1B] text-white'
                      : 'bg-white text-[#6F1D1B] hover:bg-[#BB9457] hover:text-white'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <button
              onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
              disabled={currentPage === totalPages - 1}
              className="px-4 py-2 bg-white text-[#6F1D1B] rounded-lg hover:bg-[#BB9457] hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}

        {/* Summary Stats */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-[#6F1D1B] font-gupter mb-2">
              4.8/5
            </div>
            <p className="text-[#432818]">Average Rating</p>
            <div className="flex justify-center mt-2">
              {renderStars(5)}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-[#6F1D1B] font-gupter mb-2">
              500+
            </div>
            <p className="text-[#432818]">Happy Customers</p>
            <p className="text-[#99582A] text-sm mt-1">This month</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-[#6F1D1B] font-gupter mb-2">
              98%
            </div>
            <p className="text-[#432818]">Recommend Us</p>
            <p className="text-[#99582A] text-sm mt-1">Would visit again</p>
          </div>
        </div>
      </div>
    </section>
  )
}
