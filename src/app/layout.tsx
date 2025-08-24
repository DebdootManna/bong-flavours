import type { Metadata } from 'next'
import { Gupter } from 'next/font/google'
import './globals.css'
import LenisProvider from '@/components/LenisProvider'
import { CartProvider } from '@/contexts/CartContext'
import { AuthProvider } from '@/contexts/AuthContext'

const gupter = Gupter({ 
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-gupter'
})

export const metadata: Metadata = {
  title: 'Bong Flavours - Authentic Bengali Restaurant',
  description: 'Experience authentic Bengali cuisine with our traditional recipes and modern service. Order online for delivery or dine-in.',
  keywords: 'bengali food, restaurant, online ordering, kolkata biryani, fish curry, authentic bengali',
  authors: [{ name: 'Bong Flavours' }],
  openGraph: {
    title: 'Bong Flavours - Authentic Bengali Restaurant',
    description: 'Experience authentic Bengali cuisine with traditional recipes',
    type: 'website',
    locale: 'en_US'
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={gupter.variable}>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="font-gupter antialiased">
        <AuthProvider>
          <CartProvider>
            <LenisProvider />
            {children}
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
