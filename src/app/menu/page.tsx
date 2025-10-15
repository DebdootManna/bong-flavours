'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'

interface MenuItem {
  name: string
  description: string
  price: string
  image: string
}

interface MenuSection {
  title: string
  items: MenuItem[]
  sectionImage: string
  imagePosition: 'left' | 'right'
}

export default function MenuPage() {
  const [activeCategory, setActiveCategory] = useState('Starters')
  
  const categories = ['Starters', 'Biryani', 'Main Course', 'Chinese', 'Rolls']
  
  const menuSections: MenuSection[] = [
    {
      title: 'Bengali Starters',
      imagePosition: 'left',
      sectionImage: 'https://api.builder.io/api/v1/image/assets/TEMP/ad3077ce26008547ddd77e39f9c3d1a7645a35d4?width=800',
      items: [
        {
          name: 'VEG CHOP (2PCS)',
          description: 'Traditional Bengali vegetable cutlets with a crispy exterior and spiced vegetable filling.',
          price: '₹80',
          image: 'https://api.builder.io/api/v1/image/assets/TEMP/422df1958dd42a273898b16dc7d78ca333b9e1c7?width=150'
        },
        {
          name: 'BEGUNI (2PCS)',
          description: 'Golden fried eggplant fritters, a classic Bengali tea-time snack.',
          price: '₹50',
          image: 'https://api.builder.io/api/v1/image/assets/TEMP/4d79f9abe682a889332b1439bb871c07a0aa9065?width=150'
        },
        {
          name: 'FISH CUTLET (1PC)',
          description: 'Crispy fish cutlet made with fresh fish and aromatic Bengali spices.',
          price: '₹70',
          image: 'https://api.builder.io/api/v1/image/assets/TEMP/5904f8807a18837d49d010edcac231ada87c28bd?width=150'
        },
        {
          name: 'EGG DEVIL (2PCS)',
          description: 'Spiced egg preparation with a fiery kick, perfect for egg lovers.',
          price: '₹90',
          image: 'https://api.builder.io/api/v1/image/assets/TEMP/4dbb66b59be35bbde58be203c604dbc940c010ab?width=150'
        }
      ]
    },
    {
      title: 'Kolkata Biryani',
      imagePosition: 'right',
      sectionImage: 'https://api.builder.io/api/v1/image/assets/TEMP/d12904c8afa5f62fe8c4d325d25b9d3288aa5284?width=800',
      items: [
        {
          name: 'KOLKATA STYLE EGG DUM BIRYANI',
          description: 'Aromatic basmati rice with perfectly cooked eggs, aloo, and signature Kolkata biryani spices.',
          price: '₹250',
          image: 'https://api.builder.io/api/v1/image/assets/TEMP/efcf97bc058b9ec0abb1c6ab3a3ff69aac8bef32?width=150'
        },
        {
          name: 'KOLKATA STYLE CHICKEN DUM BIRYANI',
          description: 'Traditional Kolkata biryani with tender chicken, aloo, egg, and fragrant rice.',
          price: '₹280',
          image: 'https://api.builder.io/api/v1/image/assets/TEMP/8db2d5581152a7c3231c7393690835cd4da13c0d?width=150'
        },
        {
          name: 'KOLKATA STYLE MUTTON DUM BIRYANI',
          description: 'Rich and flavorful mutton biryani with tender meat, aloo, egg, and aromatic rice.',
          price: '₹400',
          image: 'https://api.builder.io/api/v1/image/assets/TEMP/73dbb9c2e09afda9aeac4ca14fac3a702d8b4fc0?width=150'
        },
        {
          name: 'SPECIAL CHICKEN DUM BIRYANI',
          description: 'Special serving with 2 aloo, 2 eggs, 2 chicken pieces, served with rayta.',
          price: '₹610',
          image: 'https://api.builder.io/api/v1/image/assets/TEMP/d533aad74532cbfccf9bf33948d9d58ced8a0f9d?width=150'
        }
      ]
    },
    {
      title: 'Bengali Main Course',
      imagePosition: 'left',
      sectionImage: 'https://api.builder.io/api/v1/image/assets/TEMP/b09140ea039e2b64d4efd8e738f37bef35c046e6?width=800',
      items: [
        {
          name: 'FISH CURRY (2PCS)',
          description: 'Traditional Bengali fish curry with fresh fish pieces in aromatic mustard-based gravy.',
          price: '₹270',
          image: 'https://api.builder.io/api/v1/image/assets/TEMP/1b0559b79ff74c4fd6aa49d98fe2ce0285afb40f?width=150'
        },
        {
          name: 'FISH IN MUSTARD GRAVY (2PCS)',
          description: 'Fresh fish cooked in traditional Bengali mustard sauce with green chilies.',
          price: '₹360',
          image: 'https://api.builder.io/api/v1/image/assets/TEMP/b3e5c2b7e5ea5d3a3a4d5b5c6d7e8f9a0b1c2d3e?width=150'
        },
        {
          name: 'DOI MACH (2PCS)',
          description: 'Fish cooked in creamy yogurt gravy with authentic Bengali spices.',
          price: '₹380',
          image: 'https://api.builder.io/api/v1/image/assets/TEMP/e6f7d5c4b3a2918e7d6c5b4a3928f1e0d9c8b7a6?width=150'
        },
        {
          name: 'PRAWN MALAI CURRY',
          description: 'Succulent prawns in rich coconut milk curry, a Bengali delicacy.',
          price: '₹420',
          image: 'https://api.builder.io/api/v1/image/assets/TEMP/a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0?width=150'
        }
      ]
    },
    {
      title: 'Kolkata Chinese',
      imagePosition: 'right',
      sectionImage: 'https://api.builder.io/api/v1/image/assets/TEMP/a1b64ea749c2716cfb7e2f0b7e88cc321b2e3adc?width=800',
      items: [
        {
          name: 'VEG HAKKA NOODLES',
          description: 'Stir-fried noodles with fresh vegetables in authentic Kolkata Chinese style.',
          price: '₹200',
          image: 'https://api.builder.io/api/v1/image/assets/TEMP/504e5e20aadf910fd3293446dc5e16d818745a7d?width=150'
        },
        {
          name: 'VEG FRIED RICE',
          description: 'Wok-tossed rice with mixed vegetables and soy sauce, Kolkata street food favorite.',
          price: '₹200',
          image: 'https://api.builder.io/api/v1/image/assets/TEMP/66192ccbf6b95ae818de63ee5f06ee699a3abcd8?width=150'
        },
        {
          name: 'PANEER CHILLY GRAVY (6PCS)',
          description: 'Cottage cheese cubes in spicy Indo-Chinese gravy with bell peppers.',
          price: '₹290',
          image: 'https://api.builder.io/api/v1/image/assets/TEMP/a2eb88db5dd6a2ae46336f7ff4f68330177616ef?width=150'
        },
        {
          name: 'CHICKEN CHILLY DRY',
          description: 'Crispy chicken pieces tossed with onions and peppers in Indo-Chinese sauce.',
          price: '₹320',
          image: 'https://api.builder.io/api/v1/image/assets/TEMP/8bc4af53f912d078a2ab157db041bf4c8430b28b?width=150'
        }
      ]
    },
    {
      title: 'Kolkata Kathi Rolls',
      imagePosition: 'left',
      sectionImage: 'https://api.builder.io/api/v1/image/assets/TEMP/b09140ea039e2b64d4efd8e738f37bef35c046e6?width=800',
      items: [
        {
          name: 'VEG KATHI ROLL',
          description: 'Fresh vegetables wrapped in soft paratha with tangy sauces and chutneys.',
          price: '₹110',
          image: 'https://api.builder.io/api/v1/image/assets/TEMP/1b0559b79ff74c4fd6aa49d98fe2ce0285afb40f?width=150'
        },
        {
          name: 'EGG KATHI ROLL',
          description: 'Scrambled eggs wrapped in paratha with onions and green chilies, Kolkata style.',
          price: '₹99',
          image: 'https://api.builder.io/api/v1/image/assets/TEMP/b3e5c2b7e5ea5d3a3a4d5b5c6d7e8f9a0b1c2d3e?width=150'
        },
        {
          name: 'CHICKEN KATHI ROLL',
          description: 'Tender chicken pieces with onions and spices wrapped in soft paratha.',
          price: '₹140',
          image: 'https://api.builder.io/api/v1/image/assets/TEMP/e6f7d5c4b3a2918e7d6c5b4a3928f1e0d9c8b7a6?width=150'
        },
        {
          name: 'MUTTON KATHI ROLL',
          description: 'Succulent mutton pieces with aromatic spices wrapped in fresh paratha.',
          price: '₹180',
          image: 'https://api.builder.io/api/v1/image/assets/TEMP/a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0?width=150'
        }
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-[#090909]">
      {/* Navigation */}
      <nav className="bg-[#3C1518] px-6 md:px-12 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <Link href="/" className="flex items-center">
            <img 
              src="https://api.builder.io/api/v1/image/assets/TEMP/2cd0cf921443e8b6d1f9d96559f8eb2f48b75fe2?width=344" 
              alt="Logo" 
              className="h-20"
            />
          </Link>
          
          <div className="flex items-center gap-6">
            <Link href="/" className="text-white text-lg font-['Instrument_Sans'] hover:text-[#D22020]">Home</Link>
            <Link href="/menu" className="text-[#D22020] text-lg font-['Instrument_Sans'] underline">Restaurant Menu</Link>
            <Link href="/wines" className="text-white text-lg font-['Instrument_Sans'] hover:text-[#D22020]">Wines</Link>
          </div>

          <div className="flex items-center border border-white rounded-full px-4 py-2 gap-2 w-full md:w-auto max-w-sm">
            <input 
              type="text" 
              placeholder="Find Great Food" 
              className="bg-transparent text-white placeholder-gray-400 outline-none flex-1 font-['Poppins']"
            />
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </nav>

      {/* Menu Content */}
      <div className="bg-[#3C1518] px-6 md:px-12 py-12">
        {/* Menu Title */}
        <div className="flex flex-col items-center mb-12">
          <h1 className="text-white text-4xl md:text-5xl font-bold font-['Poppins'] tracking-tight mb-4">Menu</h1>
          <div className="flex items-center gap-2">
            <div className="w-12 h-0.5 bg-[#D22020]"></div>
            <svg className="w-5 h-5 text-[#D22020]" viewBox="0 0 18 22" fill="currentColor">
              <path fillRule="evenodd" clipRule="evenodd" d="M11.7069 0.305288C11.8944 0.492816 11.9997 0.747124 11.9997 1.01229C11.9997 1.27745 11.8944 1.53176 11.7069 1.71929L7.41393 6.01229H9.58593L15.2929 0.305288C15.3852 0.209778 15.4955 0.133596 15.6175 0.0811869C15.7395 0.0287779 15.8707 0.00119157 16.0035 3.77567e-05C16.1363 -0.00111606 16.268 0.0241857 16.3909 0.0744666C16.5138 0.124747 16.6254 0.199001 16.7193 0.292893C16.8132 0.386786 16.8875 0.498438 16.9377 0.621334C16.988 0.744231 17.0133 0.87591 17.0122 1.00869C17.011 1.14147 16.9834 1.27269 16.931 1.39469C16.8786 1.5167 16.8024 1.62704 16.7069 1.71929L12.4139 6.01229H16.9379C17.1816 6.01236 17.4169 6.10141 17.5996 6.26272C17.7822 6.42402 17.8997 6.64648 17.9299 6.88829C18.1731 8.81799 17.7847 10.7746 16.8228 12.465C15.8608 14.1554 14.3771 15.4887 12.5939 16.2653L12.9699 17.7703C13.0067 17.9177 13.0094 18.0715 12.9778 18.2201C12.9463 18.3687 12.8813 18.5081 12.7878 18.6278C12.6943 18.7475 12.5747 18.8444 12.4382 18.911C12.3017 18.9776 12.1518 19.0122 11.9999 19.0123H5.99993C5.84803 19.0122 5.69814 18.9776 5.56163 18.911C5.42512 18.8444 5.30558 18.7475 5.21208 18.6278C5.11859 18.5081 5.05359 18.3687 5.02203 18.2201C4.99047 18.0715 4.99317 17.9177 5.02993 17.7703L5.40593 16.2653C3.62271 15.4887 2.13904 14.1554 1.17709 12.465C0.215152 10.7746 -0.173294 8.81799 0.0699269 6.88829C0.100145 6.64648 0.217622 6.42402 0.400288 6.26272C0.582953 6.10141 0.818234 6.01236 1.06193 6.01229H4.58593L10.2929 0.305288C10.4805 0.117817 10.7348 0.0125018 10.9999 0.0125018C11.2651 0.0125018 11.5194 0.117817 11.7069 0.305288ZM1.99993 8.01229C1.99937 9.50106 2.47348 10.9512 3.3534 12.1522C4.23331 13.3531 5.4732 14.2422 6.89293 14.6903C7.13594 14.7668 7.3406 14.9331 7.46512 15.1554C7.58963 15.3777 7.62462 15.6391 7.56293 15.8863L7.27993 17.0123H10.7179L10.4369 15.8863C10.3752 15.6391 10.4102 15.3777 10.5347 15.1554C10.6593 14.9331 10.8639 14.7668 11.1069 14.6903C12.5267 14.2422 13.7665 13.3531 14.6465 12.1522C15.5264 10.9512 16.0005 9.50106 15.9999 8.01229H1.99993Z"/>
            </svg>
            <div className="w-12 h-0.5 bg-[#D22020]"></div>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-8 md:gap-16 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`text-lg md:text-xl font-bold font-['Albert_Sans'] transition-colors ${
                activeCategory === category ? 'text-[#D22020]' : 'text-white hover:text-[#D22020]'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Menu Sections */}
        <div className="space-y-16">
          {menuSections.map((section, sectionIndex) => (
            <motion.section
              key={section.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              {/* Section Title */}
              <div className="flex items-center justify-center gap-4">
                <div className="hidden md:block w-32 h-0.5 bg-white"></div>
                <h2 className="text-white text-3xl md:text-4xl font-bold font-['Poppins']">{section.title}</h2>
                <div className="hidden md:block w-32 h-0.5 bg-white"></div>
              </div>

              {/* Section Content */}
              <div className={`flex flex-col ${section.imagePosition === 'left' ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-8 lg:gap-12 items-center max-w-7xl mx-auto`}>
                {/* Section Image */}
                <div className="w-full lg:w-96 h-96 flex-shrink-0">
                  <img 
                    src={section.sectionImage} 
                    alt={section.title}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>

                {/* Menu Items */}
                <div className="flex-1 space-y-8">
                  {section.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex gap-3">
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-16 h-12 object-cover rounded flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start gap-2 mb-1">
                          <h3 className="text-white text-xs md:text-sm font-['Poppins'] tracking-wide">{item.name}</h3>
                          <svg className="w-3 h-3 text-white flex-shrink-0 mt-1" viewBox="0 0 10 12" fill="currentColor">
                            <path fillRule="evenodd" clipRule="evenodd" d="M6.599 0.654L6.593 0.655L6.558 0.672L6.548 0.674L6.541 0.672L6.505 0.654C6.5 0.653 6.496 0.654 6.493 0.657L6.491 0.662L6.483 0.876L6.485 0.886L6.49 0.892L6.542 0.929L6.55 0.931L6.556 0.929L6.608 0.892L6.614 0.884L6.616 0.876L6.607 0.663C6.606 0.657 6.603 0.654 6.599 0.654ZM6.731 0.597L6.724 0.598L6.632 0.645L6.627 0.65L6.625 0.655L6.634 0.87L6.637 0.876L6.641 0.88L6.741 0.926C6.748 0.927 6.752 0.926 6.756 0.922L6.758 0.915L6.741 0.608C6.739 0.602 6.736 0.598 6.731 0.597ZM6.374 0.598C6.372 0.597 6.369 0.597 6.367 0.597C6.364 0.598 6.362 0.599 6.361 0.601L6.358 0.608L6.341 0.915C6.341 0.921 6.344 0.925 6.349 0.927L6.357 0.926L6.457 0.879L6.462 0.875L6.463 0.87L6.472 0.655L6.471 0.649L6.466 0.644L6.374 0.598Z"/>
                            <path fillRule="evenodd" clipRule="evenodd" d="M7.653 2.193C7.747 2.286 7.799 2.413 7.799 2.545C7.799 2.678 7.747 2.805 7.653 2.898L5.511 5.04H6.595L9.443 2.193C9.489 2.145 9.544 2.107 9.605 2.081C9.665 2.055 9.731 2.041 9.797 2.04C9.863 2.04 9.929 2.052 9.99 2.077C10.052 2.103 10.107 2.14 10.154 2.186C10.201 2.233 10.238 2.289 10.263 2.35C10.288 2.412 10.301 2.477 10.3 2.544C10.3 2.61 10.286 2.675 10.26 2.736C10.234 2.797 10.196 2.852 10.148 2.898L8.006 5.04H10.263C10.385 5.04 10.502 5.085 10.594 5.165C10.685 5.246 10.743 5.357 10.758 5.477C10.88 6.44 10.686 7.417 10.206 8.26C9.726 9.104 8.986 9.769 8.096 10.156L8.283 10.907C8.302 10.981 8.303 11.058 8.287 11.132C8.272 11.206 8.239 11.276 8.193 11.335C8.146 11.395 8.086 11.443 8.018 11.477C7.95 11.51 7.875 11.527 7.799 11.527H4.806C4.73 11.527 4.655 11.51 4.587 11.477C4.519 11.443 4.459 11.395 4.412 11.335C4.366 11.276 4.333 11.206 4.318 11.132C4.302 11.058 4.303 10.981 4.322 10.907L4.509 10.156C3.619 9.769 2.879 9.104 2.399 8.26C1.919 7.417 1.725 6.44 1.847 5.477C1.862 5.357 1.92 5.246 2.011 5.165C2.103 5.085 2.22 5.04 2.342 5.04H4.1L6.948 2.193C7.041 2.099 7.168 2.047 7.3 2.047C7.433 2.047 7.56 2.099 7.653 2.193ZM2.81 6.038C2.809 6.781 3.046 7.505 3.485 8.104C3.924 8.703 4.543 9.147 5.251 9.371C5.372 9.409 5.474 9.492 5.537 9.603C5.599 9.714 5.616 9.844 5.585 9.967L5.444 10.529H7.16L7.02 9.967C6.989 9.844 7.006 9.714 7.068 9.603C7.13 9.492 7.233 9.409 7.354 9.371C8.062 9.147 8.681 8.703 9.12 8.104C9.559 7.505 9.796 6.781 9.795 6.038H2.81Z"/>
                          </svg>
                        </div>
                        <div className="flex items-start gap-1">
                          <div className="flex-1 border-b border-dashed border-white/30 mb-1"></div>
                          <span className="text-white text-xs font-['Poppins'] whitespace-nowrap">{item.price}</span>
                        </div>
                        <p className="text-white text-xs font-['Poppins'] leading-relaxed">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.section>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#3C1518] py-12 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-8">
            <div className="flex flex-col gap-4">
              <img 
                src="https://api.builder.io/api/v1/image/assets/TEMP/8a347caf596d250bb4f4ea1c56040680102d7157?width=244" 
                alt="Logo" 
                className="w-28 h-20"
              />
              <div className="text-white font-['Instrument_Sans']">
                <p className="text-base">Phone number</p>
                <p className="text-base">+34 911 72 07 45</p>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-6 md:gap-8 text-white font-['Instrument_Sans'] text-lg">
              <Link href="/menu" className="hover:text-[#D22020]">Menu</Link>
              <Link href="/wines" className="hover:text-[#D22020]">Wines</Link>
              <Link href="/christmas" className="hover:text-[#D22020]">Christmas Dinner</Link>
            </div>
          </div>

          <div className="border-t border-white/20 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-white text-sm font-['Instrument_Sans']">copyright © 2024 Brastra</p>
              
              <div className="flex items-center gap-3">
                <a href="#" className="text-white hover:text-[#D22020]">
                  <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 30 31">
                    <path d="M27.5 15.5C27.5 8.6 21.9 3 15 3C8.1 3 2.5 8.6 2.5 15.5C2.5 21.55 6.8 26.5875 12.5 27.75V19.25H10V15.5H12.5V12.375C12.5 9.9625 14.4625 8 16.875 8H20V11.75H17.5C16.8125 11.75 16.25 12.3125 16.25 13V15.5H20V19.25H16.25V27.9375C22.5625 27.3125 27.5 21.9875 27.5 15.5Z"/>
                  </svg>
                </a>
                <a href="#" className="text-white hover:text-[#D22020]">
                  <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 30 31">
                    <path d="M16.285 3C17.6912 3.00375 18.405 3.01125 19.0212 3.02875L19.2637 3.0375C19.5437 3.0475 19.82 3.06 20.1537 3.075C21.4837 3.1375 22.3912 3.3475 23.1875 3.65625C24.0125 3.97375 24.7075 4.40375 25.4025 5.0975C26.0383 5.72217 26.5302 6.47809 26.8437 7.3125C27.1525 8.10875 27.3625 9.01625 27.425 10.3475C27.44 10.68 27.4525 10.9563 27.4625 11.2375L27.47 11.48C27.4887 12.095 27.4962 12.8088 27.4987 14.215L27.5 15.1475V16.785C27.503 17.6968 27.4934 18.6085 27.4712 19.52L27.4637 19.7625C27.4537 20.0437 27.4412 20.32 27.4262 20.6525C27.3637 21.9837 27.1512 22.89 26.8437 23.6875C26.5302 24.5219 26.0383 25.2778 25.4025 25.9025C24.7778 26.5384 24.0219 27.0302 23.1875 27.3438C22.3912 27.6525 21.4837 27.8625 20.1537 27.925L19.2637 27.9625L19.0212 27.97C18.405 27.9875 17.6912 27.9963 16.285 27.9988L15.3525 28H13.7162C12.8041 28.0032 11.8919 27.9936 10.98 27.9712L10.7375 27.9638C10.4407 27.9525 10.1441 27.9396 9.84748 27.925C8.51748 27.8625 7.60998 27.6525 6.81248 27.3438C5.97852 27.0301 5.22303 26.5382 4.59873 25.9025C3.96241 25.278 3.47011 24.522 3.15623 23.6875C2.84748 22.8912 2.63748 21.9837 2.57498 20.6525L2.53748 19.7625L2.53123 19.52C2.50819 18.6085 2.49777 17.6968 2.49998 16.785V14.215C2.49652 13.3033 2.50569 12.3915 2.52748 11.48L2.53623 11.2375C2.54623 10.9563 2.55873 10.68 2.57373 10.3475C2.63623 9.01625 2.84623 8.11 3.15498 7.3125C3.4696 6.47775 3.96276 5.7218 4.59998 5.0975C5.22392 4.46194 5.97896 3.97009 6.81248 3.65625C7.60998 3.3475 8.51623 3.1375 9.84748 3.075C10.18 3.06 10.4575 3.0475 10.7375 3.0375L10.98 3.03C11.8915 3.00779 12.8032 2.99821 13.715 3.00125L16.285 3ZM15 9.25C13.3424 9.25 11.7527 9.90848 10.5806 11.0806C9.40846 12.2527 8.74998 13.8424 8.74998 15.5C8.74998 17.1576 9.40846 18.7473 10.5806 19.9194C11.7527 21.0915 13.3424 21.75 15 21.75C16.6576 21.75 18.2473 21.0915 19.4194 19.9194C20.5915 18.7473 21.25 17.1576 21.25 15.5C21.25 13.8424 20.5915 12.2527 19.4194 11.0806C18.2473 9.90848 16.6576 9.25 15 9.25ZM15 11.75C15.4924 11.7499 15.9801 11.8468 16.4351 12.0352C16.8901 12.2236 17.3035 12.4997 17.6518 12.8479C18.0001 13.1961 18.2764 13.6094 18.4649 14.0644C18.6534 14.5193 18.7505 15.0069 18.7506 15.4994C18.7507 15.9918 18.6538 16.4795 18.4654 16.9345C18.277 17.3895 18.0009 17.8029 17.6527 18.1512C17.3045 18.4995 16.8912 18.7758 16.4362 18.9643C15.9813 19.1528 15.4937 19.2499 15.0012 19.25C14.0067 19.25 13.0528 18.8549 12.3496 18.1517C11.6463 17.4484 11.2512 16.4946 11.2512 15.5C11.2512 14.5054 11.6463 13.5516 12.3496 12.8483C13.0528 12.1451 14.0067 11.75 15.0012 11.75M21.5637 7.375C21.1493 7.375 20.7519 7.53962 20.4589 7.83265C20.1658 8.12567 20.0012 8.5231 20.0012 8.9375C20.0012 9.3519 20.1658 9.74933 20.4589 10.0424C20.7519 10.3354 21.1493 10.5 21.5637 10.5C21.9781 10.5 22.3756 10.3354 22.6686 10.0424C22.9616 9.74933 23.1262 9.3519 23.1262 8.9375C23.1262 8.5231 22.9616 8.12567 22.6686 7.83265C22.3756 7.53962 21.9781 7.375 21.5637 7.375Z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
