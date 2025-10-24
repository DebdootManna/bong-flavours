"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

export default function GalleryPage() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-[#3C1518] font-instrument-sans">
      {/* Header / Nav Bar */}
      <nav className="flex justify-between items-center px-6 md:px-12 py-6 md:py-8">
        {/* Logo */}
        <div className="flex items-center">
          <img
            src="https://api.builder.io/api/v1/image/assets/TEMP/63047cdba7b780fc9682ff004805bb15d36d3cd0?width=180"
            alt="Bong Flavours Logo"
            className="w-16 h-16 md:w-[90px] md:h-[90px]"
          />
        </div>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-5 lg:gap-8">
          <Link
            href="/"
            className="text-white hover:text-[#BB9457] transition-colors text-lg lg:text-xl"
          >
            Home
          </Link>
          <Link
            href="/gallery"
            className="text-[#D22020] underline hover:text-[#BB9457] transition-colors text-lg lg:text-xl"
          >
            Gallery
          </Link>
          <Link
            href="/booking"
            className="text-white hover:text-[#BB9457] transition-colors text-lg lg:text-xl"
          >
            Booking
          </Link>
        </div>

        {/* Auth Buttons */}
        <div className="flex items-center gap-4 md:gap-9 border border-white rounded-[33px] px-3 md:px-4 py-1.5 md:py-2">
          {user ? (
            <Link
              href="/app/profile"
              className="text-white text-center underline hover:text-[#BB9457] transition-colors text-sm md:text-xl"
            >
              View Profile
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="text-white text-center underline hover:text-[#BB9457] transition-colors text-sm md:text-xl"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="text-white text-center underline hover:text-[#BB9457] transition-colors text-sm md:text-xl"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Gallery Grid */}
      <div className="px-6 md:px-12 lg:px-[120px] py-8 md:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {/* Row 1 - Large image spanning 2 columns on desktop */}
          <div className="lg:col-span-2 aspect-[623/200] overflow-hidden rounded-lg">
            <img
              src="https://api.builder.io/api/v1/image/assets/TEMP/b2a057941f533bd1d8192b1f710a4aa3eddf0fae?width=1246"
              alt="Gallery image 1"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>

          <div className="aspect-[303/200] overflow-hidden rounded-lg">
            <img
              src="https://api.builder.io/api/v1/image/assets/TEMP/8f5df4987bf1be412dbe113cb1f29fc046d5fcb5?width=606"
              alt="Gallery image 2"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>

          {/* Row 2 */}
          <div className="aspect-[3/2] overflow-hidden rounded-lg">
            <img
              src="https://api.builder.io/api/v1/image/assets/TEMP/a29f7b0b1945f6227b151af2125d3e50d5aa829a?width=600"
              alt="Gallery image 3"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>

          <div className="aspect-[3/2] overflow-hidden rounded-lg">
            <img
              src="https://api.builder.io/api/v1/image/assets/TEMP/71ce0feb3a4161e082663267fd1a1d4b79f9c565?width=600"
              alt="Gallery image 4"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>

          {/* Row 3 - Tall image on left */}
          <div className="lg:row-span-2 aspect-[75/106] overflow-hidden rounded-lg">
            <img
              src="https://api.builder.io/api/v1/image/assets/TEMP/b8408a75f96b0966619d13c2ae8d5e6877bd039f?width=600"
              alt="Gallery image 5"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>

          {/* Large horizontal spanning 2 columns */}
          <div className="lg:col-span-2 aspect-[623/200] overflow-hidden rounded-lg">
            <img
              src="https://api.builder.io/api/v1/image/assets/TEMP/a244c3d90530d89a8e9cea90061f640a846a1b92?width=1246"
              alt="Gallery image 6"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>

          {/* Row 4 */}
          <div className="aspect-[3/2] overflow-hidden rounded-lg">
            <img
              src="https://api.builder.io/api/v1/image/assets/TEMP/079b77b7adc0bd62bda674f0801e2d6d6a326c4e?width=600"
              alt="Gallery image 7"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>

          <div className="aspect-[3/2] overflow-hidden rounded-lg">
            <img
              src="https://api.builder.io/api/v1/image/assets/TEMP/f9eb6d454c6cc6a4074cfaef5e3e7bd005557a0f?width=600"
              alt="Gallery image 8"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>

          <div className="aspect-[303/200] overflow-hidden rounded-lg">
            <img
              src="https://api.builder.io/api/v1/image/assets/TEMP/7481ce6cd80caf6afd5f85af60281a7b92c5dd35?width=606"
              alt="Gallery image 9"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#090909] px-6 md:px-12 lg:px-[130px] py-10 md:py-16">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-8">
          {/* Logo and Contact */}
          <div className="flex flex-col gap-6">
            <img
              src="https://api.builder.io/api/v1/image/assets/TEMP/63047cdba7b780fc9682ff004805bb15d36d3cd0?width=180"
              alt="Bong Flavours Logo"
              className="w-[90px] h-[90px]"
            />
            <div className="flex flex-col gap-1">
              <p className="text-white text-base">Phone number</p>
              <p className="text-white text-base">+34 911 72 07 45</p>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-wrap gap-6 md:gap-8 text-lg md:text-xl">
            <Link
              href="/"
              className="text-white hover:text-[#BB9457] transition-colors"
            >
              Home
            </Link>
            <Link
              href="/menu"
              className="text-white hover:text-[#BB9457] transition-colors"
            >
              Menu
            </Link>
            <Link
              href="/gallery"
              className="text-white hover:text-[#BB9457] transition-colors"
            >
              Gallery
            </Link>
            <Link
              href="/booking"
              className="text-white hover:text-[#BB9457] transition-colors"
            >
              Booking
            </Link>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-white mb-8"></div>

        {/* Copyright and Social Media */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <p className="text-white text-sm md:text-base">
            © 2025 Bong Flavours. All rights reserved.
          </p>

          {/* Social Media Icons */}
          <div className="flex items-center gap-3">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-80 transition-opacity"
            >
              <svg
                width="30"
                height="30"
                viewBox="0 0 30 30"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M27.5 15C27.5 8.1 21.9 2.5 15 2.5C8.1 2.5 2.5 8.1 2.5 15C2.5 21.05 6.8 26.0875 12.5 27.25V18.75H10V15H12.5V11.875C12.5 9.4625 14.4625 7.5 16.875 7.5H20V11.25H17.5C16.8125 11.25 16.25 11.8125 16.25 12.5V15H20V18.75H16.25V27.4375C22.5625 26.8125 27.5 21.4875 27.5 15Z"
                  fill="white"
                />
              </svg>
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-80 transition-opacity"
            >
              <svg
                width="30"
                height="30"
                viewBox="0 0 30 30"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M16.285 2.5C17.6912 2.50375 18.405 2.51125 19.0212 2.52875L19.2637 2.5375C19.5437 2.5475 19.82 2.56 20.1537 2.575C21.4837 2.6375 22.3912 2.8475 23.1875 3.15625C24.0125 3.47375 24.7075 3.90375 25.4025 4.5975C26.0384 5.22217 26.5302 5.97809 26.8437 6.8125C27.1525 7.60875 27.3625 8.51625 27.425 9.8475C27.44 10.18 27.4525 10.4563 27.4625 10.7375L27.47 10.98C27.4887 11.595 27.4962 12.3088 27.4987 13.715L27.5 14.6475V16.285C27.503 17.1968 27.4935 18.1085 27.4712 19.02L27.4637 19.2625C27.4537 19.5437 27.4412 19.82 27.4262 20.1525C27.3637 21.4837 27.1512 22.39 26.8437 23.1875C26.5302 24.0219 26.0384 24.7778 25.4025 25.4025C24.7778 26.0384 24.0219 26.5302 23.1875 26.8438C22.3912 27.1525 21.4837 27.3625 20.1537 27.425L19.2637 27.4625L19.0212 27.47C18.405 27.4875 17.6912 27.4963 16.285 27.4988L15.3525 27.5H13.7162C12.8041 27.5032 11.8919 27.4936 10.98 27.4712L10.7375 27.4638C10.4408 27.4525 10.1441 27.4396 9.84749 27.425C8.51749 27.3625 7.60999 27.1525 6.81249 26.8438C5.97853 26.5301 5.22305 26.0382 4.59874 25.4025C3.96243 24.778 3.47013 24.022 3.15624 23.1875C2.84749 22.3912 2.63749 21.4837 2.57499 20.1525L2.53749 19.2625L2.53124 19.02C2.5082 18.1085 2.49778 17.1968 2.49999 16.285V13.715C2.49653 12.8033 2.5057 11.8915 2.52749 10.98L2.53624 10.7375C2.54624 10.4563 2.55874 10.18 2.57374 9.8475C2.63624 8.51625 2.84624 7.61 3.15499 6.8125C3.46961 5.97775 3.96277 5.2218 4.59999 4.5975C5.22394 3.96194 5.97898 3.47009 6.81249 3.15625C7.60999 2.8475 8.51624 2.6375 9.84749 2.575C10.18 2.56 10.4575 2.5475 10.7375 2.5375L10.98 2.53C11.8915 2.50779 12.8032 2.49821 13.715 2.50125L16.285 2.5ZM15 8.75C13.3424 8.75 11.7527 9.40848 10.5806 10.5806C9.40847 11.7527 8.74999 13.3424 8.74999 15C8.74999 16.6576 9.40847 18.2473 10.5806 19.4194C11.7527 20.5915 13.3424 21.25 15 21.25C16.6576 21.25 18.2473 20.5915 19.4194 19.4194C20.5915 18.2473 21.25 16.6576 21.25 15C21.25 13.3424 20.5915 11.7527 19.4194 10.5806C18.2473 9.40848 16.6576 8.75 15 8.75ZM15 11.25C15.4925 11.2499 15.9801 11.3468 16.4351 11.5352C16.8901 11.7236 17.3036 11.9997 17.6518 12.3479C18.0001 12.6961 18.2764 13.1094 18.4649 13.5644C18.6535 14.0193 18.7505 14.5069 18.7506 14.9994C18.7507 15.4918 18.6538 15.9795 18.4654 16.4345C18.277 16.8895 18.0009 17.3029 17.6527 17.6512C17.3046 17.9995 16.8912 18.2758 16.4363 18.4643C15.9813 18.6528 15.4937 18.7499 15.0012 18.75C14.0067 18.75 13.0529 18.3549 12.3496 17.6517C11.6463 16.9484 11.2512 15.9946 11.2512 15C11.2512 14.0054 11.6463 13.0516 12.3496 12.3483C13.0529 11.6451 14.0067 11.25 15.0012 11.25M21.5637 6.875C21.1493 6.875 20.7519 7.03962 20.4589 7.33265C20.1659 7.62567 20.0012 8.0231 20.0012 8.4375C20.0012 8.8519 20.1659 9.24933 20.4589 9.54235C20.7519 9.83538 21.1493 10 21.5637 10C21.9781 10 22.3756 9.83538 22.6686 9.54235C22.9616 9.24933 23.1262 8.8519 23.1262 8.4375C23.1262 8.0231 22.9616 7.62567 22.6686 7.33265C22.3756 7.03962 21.9781 6.875 21.5637 6.875Z"
                  fill="white"
                />
              </svg>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
