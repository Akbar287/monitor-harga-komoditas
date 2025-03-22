import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from 'sonner'
import { Suspense } from 'react'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
})

export const metadata: Metadata = {
  title: 'Dashboard Monitoring Harga Komoditas',
  description: 'Dashboard Monitoring Harga Komoditas',
  icons: {
    icon: '/logo_disperindag.ico',
  },
  appleWebApp: {
    title: 'Dashboard Monitoring Harga Komoditas',
    statusBarStyle: 'default',
    capable: true,
    startupImage: '/logo_disperindag.png',
  },
  openGraph: {
    title: 'Dashboard Monitoring Harga Komoditas',
    description: 'Dashboard Monitoring Harga Komoditas',
    url: 'https://harga-komoditas.vercel.app/',
    siteName: 'Dashboard Monitoring Harga Komoditas',
    images: [
      {
        url: '/logo_disperindag.png',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'id-ID',
    type: 'website',
  },
}

export const viewport = {
  themeColor: '#c95b0d',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${poppins.variable} antialiased`}>
      <body className="font-sans">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  )
}
