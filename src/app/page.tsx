"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";

export default function Home() {
  const { user, loading } = useAuth();
  const menuItems = [
    {
      name: "Kolkata Style Mutton Dum Biryani",
      price: "₹400",
      image:
        "https://api.builder.io/api/v1/image/assets/TEMP/d1e67d9c2b4a491671e811f1e68f8bf01eabfb14?width=590",
    },
    {
      name: "Fish Curry (2pcs)",
      price: "₹270",
      image:
        "https://api.builder.io/api/v1/image/assets/TEMP/b1c875b81eb62c4300dbc3f32558ebf90bcc4201?width=590",
    },
    {
      name: "Aloo Dum",
      price: "₹150",
      image:
        "https://api.builder.io/api/v1/image/assets/TEMP/472ff2101e58ac22d6afad96149805e835c76311?width=590",
    },
    {
      name: "Egg Kathi Roll",
      price: "₹99",
      image:
        "https://api.builder.io/api/v1/image/assets/TEMP/aa45e90ba1cd0c1c6a06a672ce99e59530a42e7d?width=590",
    },
  ];

  return (
    <main className="min-h-screen bg-[#3C1518]">
      {/* Navigation */}
      <nav className="flex justify-between items-center px-6 md:px-12 py-4 md:py-6">
        <Link href="/" className="flex items-center">
          <img
            src="https://api.builder.io/api/v1/image/assets/TEMP/0bea0de8ff44bcd3f28eccaf1a18318ed4b2032a?width=180"
            alt="Bong Flavours Logo"
            className="h-16 md:h-20 w-auto"
          />
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <Link
            href="/"
            className="text-[#D22020] text-lg underline font-instrument-sans"
          >
            Home
          </Link>
          <Link
            href="/gallery"
            className="text-white text-lg font-instrument-sans hover:text-[#D22020]"
          >
            Gallery
          </Link>
          <Link
            href="/booking"
            className="text-white text-lg font-instrument-sans hover:text-[#D22020]"
          >
            Booking
          </Link>
        </div>

        <div className="flex items-center gap-4 border border-white rounded-full px-4 py-2">
          {!loading && user ? (
            <Link
              href="/app/profile"
              className="text-white text-base md:text-lg underline font-instrument-sans"
            >
              View Profile
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="text-white text-base md:text-lg underline font-instrument-sans"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="text-white text-base md:text-lg underline font-instrument-sans"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-start px-6 md:px-24 py-12 overflow-hidden">
        <div className="absolute right-0 top-0 w-1/2 h-full opacity-80 pointer-events-none hidden lg:block">
          <img
            src="https://api.builder.io/api/v1/image/assets/TEMP/dbf30f6f8482436a0607e6746afed162a36de331?width=1702"
            alt="Bengali Food"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="relative z-10 max-w-4xl">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold text-[#F2F3AE] leading-tight mb-6 font-poppins"
          >
            Taste the{" "}
            <span
              className="text-3xl md:text-5xl"
              style={{ fontFamily: "Playwrite US Trad, cursive" }}
            >
              Authentic
            </span>
            <br />
            <span className="text-5xl md:text-7xl lg:text-8xl">
              Bengali Heritage
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-[#D58936] text-lg md:text-xl max-w-2xl mb-8 font-albert-sans"
          >
            From traditional fish curry to aromatic biryani, experience the rich
            flavours of Bengal crafted with authentic recipes and the finest
            ingredients.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Link
              href="/menu"
              className="inline-flex items-center justify-center px-8 py-3 border-2 border-white text-white rounded-full hover:bg-white hover:text-[#3C1518] transition-all font-poppins"
            >
              View Menu
            </Link>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section className="relative py-20 px-6 md:px-12 bg-black overflow-hidden">
        <div className="absolute inset-0 opacity-50">
          <img
            src="https://api.builder.io/api/v1/image/assets/TEMP/f91e990d022998aba3a76e9b86e0bf26387c82ff?width=3096"
            alt="Background"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent"></div>

        <div className="relative z-10 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12">
          <div className="lg:w-1/2">
            <div className="relative">
              <img
                src="https://api.builder.io/api/v1/image/assets/TEMP/96c8516cc5075aaf5b21beebd92cd21a7fdd507a?width=320"
                alt="Quote decoration"
                className="absolute -top-8 -left-8 w-12 h-12"
              />
              <img
                src="https://api.builder.io/api/v1/image/assets/TEMP/acf3fa249d4a768b615d042725807dbd32eb38b5?width=64"
                alt="Quote"
                className="w-8 h-8 mb-4"
              />
            </div>
          </div>

          <div className="lg:w-1/2 text-center lg:text-left">
            <p className="text-white text-xl md:text-2xl leading-relaxed font-albert-sans mb-8">
              Indulge in the authentic taste of Bengal with our traditional
              recipes, lovingly passed down through generations. Each dish on
              our menu is crafted to bring you closer to the vibrant stories and
              rich flavours of Bengali culture. From Kolkata-style biryani and
              spicy rolls to homely thalis and sweet rasgullas, Bong Flavours
              delivers a diverse experience that honours tradition while
              inviting you to explore new tastes. Experience true Bengali
              hospitality—where every plate tells a story of heritage and
              flavour.
            </p>
            <div className="flex flex-col md:flex-row gap-4 text-white text-lg">
              <div>
                <p className="font-albert-sans">
                  5th Eve, Colombo Road, Galle.
                </p>
                <p className="font-albert-sans">+94 111 123 457</p>
                <p className="font-albert-sans">brastra@gmail.com</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Menu Section */}
      <section className="py-20 px-6 md:px-12 bg-[#3C1518]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-red-500 text-base font-bold tracking-wider uppercase font-prata mb-4">
              Slice of Heaven
            </p>
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="h-0.5 w-24 bg-[#D22020]"></div>
              <h2 className="text-3xl md:text-4xl font-bold text-white font-albert-sans">
                Essence of Traditional Flavors
              </h2>
              <div className="h-0.5 w-24 bg-[#D22020]"></div>
            </div>
          </div>

          <div className="rounded-2xl bg-white/10 p-8 md:p-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {menuItems.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-black/40 rounded-lg overflow-hidden"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full aspect-square object-cover"
                  />
                  <div className="p-6 text-center">
                    <h3 className="text-[#F2F3AE] text-xl font-poppins uppercase tracking-wide mb-2">
                      {item.name}
                    </h3>
                    <p className="text-[#A44200] text-lg font-bold font-poppins mb-4">
                      {item.price}
                    </p>
                    <button className="w-full bg-gradient-to-b from-[#A44200] to-[#A44200] text-[#F2F3AE] px-6 py-2 rounded-md font-albert-sans font-bold hover:opacity-90 transition-opacity">
                      View
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Our Special Environment Section */}
      <section className="py-20 px-6 md:px-12 bg-[#3C1518]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-red-500 text-base font-bold font-prata mb-4">
              Feast your eyes
            </p>
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="h-0.5 w-16 bg-red-500"></div>
              <h2 className="text-3xl md:text-4xl font-bold text-white font-albert-sans">
                Our Special Environment
              </h2>
              <div className="h-0.5 w-16 bg-red-500"></div>
            </div>
          </div>

          <div className="bg-white/10 rounded-2xl p-8 md:p-12">
            <div className="flex flex-col items-center text-center">
              <img
                src="https://api.builder.io/api/v1/image/assets/TEMP/0fc8685d17efac8ccea0b9ab37e2d8a6cad8b6d2?width=190"
                alt="Logo"
                className="w-24 h-24 mb-6"
              />
              <h3 className="text-white text-3xl font-bold font-albert-sans mb-8">
                Foundation
              </h3>
              <p className="text-white text-xl md:text-2xl leading-relaxed max-w-3xl font-albert-sans">
                Bong Flavours is the vision of Kakoli Mallick, who has
                passionately blended her Bengali heritage with a love for
                culinary excellence. As the owner and founder, Kakoli brings
                traditional recipes from her family kitchen to the heart of
                Vadodara, ensuring each dish reflects the warmth, stories, and
                authenticity of Bengal. Guided by her expertise and dedication,
                she leads the team at Bong Flavours, curating a menu that stays
                true to its roots while appealing to both nostalgic and new
                palates. Under her stewardship, Bong Flavours stands as a
                testament to handcrafted taste and heartfelt hospitality.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section className="relative py-20 px-6 md:px-12">
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative z-10 max-w-7xl mx-auto">
          <p className="text-[#D22020] text-base font-bold tracking-wider uppercase font-poppins mb-4">
            discount
          </p>
          <h2 className="text-white text-4xl md:text-5xl font-bold tracking-wider font-poppins mb-4">
            Upcoming Events
          </h2>
          <p className="text-white text-lg font-poppins max-w-2xl">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc
            vulputate libero et velit interdum, ac aliquet odio mattis.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#090909] py-12 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-8">
            <div className="flex flex-col gap-4">
              <img
                src="https://api.builder.io/api/v1/image/assets/TEMP/63047cdba7b780fc9682ff004805bb15d36d3cd0?width=180"
                alt="Logo"
                className="w-20 h-20"
              />
              <div className="text-white font-instrument-sans">
                <p className="text-base">Phone number</p>
                <p className="text-base">+34 911 72 07 45</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-6 md:gap-8 text-white font-instrument-sans text-lg">
              <Link href="/" className="hover:text-[#D22020]">
                Home
              </Link>
              <Link href="/menu" className="hover:text-[#D22020]">
                Menu
              </Link>
              <Link href="/wines" className="hover:text-[#D22020]">
                Wines
              </Link>
              <Link href="/christmas" className="hover:text-[#D22020]">
                Christmas Dinner
              </Link>
            </div>
          </div>

          <div className="border-t border-white/20 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-white text-sm font-instrument-sans">
                © 2024 Bong Flavours. All rights reserved.
              </p>

              <div className="flex items-center gap-3">
                <a href="#" className="text-white hover:text-[#D22020]">
                  <svg
                    className="w-7 h-7"
                    fill="currentColor"
                    viewBox="0 0 30 31"
                  >
                    <path d="M27.5 15.5C27.5 8.6 21.9 3 15 3C8.1 3 2.5 8.6 2.5 15.5C2.5 21.55 6.8 26.5875 12.5 27.75V19.25H10V15.5H12.5V12.375C12.5 9.9625 14.4625 8 16.875 8H20V11.75H17.5C16.8125 11.75 16.25 12.3125 16.25 13V15.5H20V19.25H16.25V27.9375C22.5625 27.3125 27.5 21.9875 27.5 15.5Z" />
                  </svg>
                </a>
                <a href="#" className="text-white hover:text-[#D22020]">
                  <svg
                    className="w-7 h-7"
                    fill="currentColor"
                    viewBox="0 0 30 31"
                  >
                    <path d="M16.285 3C17.6912 3.00375 18.405 3.01125 19.0212 3.02875L19.2637 3.0375C19.5437 3.0475 19.82 3.06 20.1537 3.075C21.4837 3.1375 22.3912 3.3475 23.1875 3.65625C24.0125 3.97375 24.7075 4.40375 25.4025 5.0975C26.0383 5.72217 26.5302 6.47809 26.8437 7.3125C27.1525 8.10875 27.3625 9.01625 27.425 10.3475C27.44 10.68 27.4525 10.9563 27.4625 11.2375L27.47 11.48C27.4887 12.095 27.4962 12.8088 27.4987 14.215L27.5 15.1475V16.785C27.503 17.6968 27.4934 18.6085 27.4712 19.52L27.4637 19.7625C27.4537 20.0437 27.4412 20.32 27.4262 20.6525C27.3637 21.9837 27.1512 22.89 26.8437 23.6875C26.5302 24.5219 26.0383 25.2778 25.4025 25.9025C24.7778 26.5384 24.0219 27.0302 23.1875 27.3438C22.3912 27.6525 21.4837 27.8625 20.1537 27.925L19.2637 27.9625L19.0212 27.97C18.405 27.9875 17.6912 27.9963 16.285 27.9988L15.3525 28H13.7162C12.8041 28.0032 11.8919 27.9936 10.98 27.9712L10.7375 27.9638C10.4407 27.9525 10.1441 27.9396 9.84748 27.925C8.51748 27.8625 7.60998 27.6525 6.81248 27.3438C5.97852 27.0301 5.22303 26.5382 4.59873 25.9025C3.96241 25.278 3.47011 24.522 3.15623 23.6875C2.84748 22.8912 2.63748 21.9837 2.57498 20.6525L2.53748 19.7625L2.53123 19.52C2.50819 18.6085 2.49777 17.6968 2.49998 16.785V14.215C2.49652 13.3033 2.50569 12.3915 2.52748 11.48L2.53623 11.2375C2.54623 10.9563 2.55873 10.68 2.57373 10.3475C2.63623 9.01625 2.84623 8.11 3.15498 7.3125C3.4696 6.47775 3.96276 5.7218 4.59998 5.0975C5.22392 4.46194 5.97896 3.97009 6.81248 3.65625C7.60998 3.3475 8.51623 3.1375 9.84748 3.075C10.18 3.06 10.4575 3.0475 10.7375 3.0375L10.98 3.03C11.8915 3.00779 12.8032 2.99821 13.715 3.00125L16.285 3ZM15 9.25C13.3424 9.25 11.7527 9.90848 10.5806 11.0806C9.40846 12.2527 8.74998 13.8424 8.74998 15.5C8.74998 17.1576 9.40846 18.7473 10.5806 19.9194C11.7527 21.0915 13.3424 21.75 15 21.75C16.6576 21.75 18.2473 21.0915 19.4194 19.9194C20.5915 18.7473 21.25 17.1576 21.25 15.5C21.25 13.8424 20.5915 12.2527 19.4194 11.0806C18.2473 9.90848 16.6576 9.25 15 9.25ZM15 11.75C15.4924 11.7499 15.9801 11.8468 16.4351 12.0352C16.8901 12.2236 17.3035 12.4997 17.6518 12.8479C18.0001 13.1961 18.2764 13.6094 18.4649 14.0644C18.6534 14.5193 18.7505 15.0069 18.7506 15.4994C18.7507 15.9918 18.6538 16.4795 18.4654 16.9345C18.277 17.3895 18.0009 17.8029 17.6527 18.1512C17.3045 18.4995 16.8912 18.7758 16.4362 18.9643C15.9813 19.1528 15.4937 19.2499 15.0012 19.25C14.0067 19.25 13.0528 18.8549 12.3496 18.1517C11.6463 17.4484 11.2512 16.4946 11.2512 15.5C11.2512 14.5054 11.6463 13.5516 12.3496 12.8483C13.0528 12.1451 14.0067 11.75 15.0012 11.75M21.5637 7.375C21.1493 7.375 20.7519 7.53962 20.4589 7.83265C20.1658 8.12567 20.0012 8.5231 20.0012 8.9375C20.0012 9.3519 20.1658 9.74933 20.4589 10.0424C20.7519 10.3354 21.1493 10.5 21.5637 10.5C21.9781 10.5 22.3756 10.3354 22.6686 10.0424C22.9616 9.74933 23.1262 9.3519 23.1262 8.9375C23.1262 8.5231 22.9616 8.12567 22.6686 7.83265C22.3756 7.53962 21.9781 7.375 21.5637 7.375Z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
