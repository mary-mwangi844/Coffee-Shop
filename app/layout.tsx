import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import FilmGrain from '@/components/FilmGrain'
import './globals.css'
import './maya.css'

export const metadata: Metadata = {
  title: "Maya's Coffee Shop",
  description:
    'Where every cup tells a story. Specialty blends crafted with passion in Westlands, Nairobi.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Bodoni+Moda:opsz,wght@6..96,500;6..96,600;6..96,700&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <FilmGrain />
        <Navbar />
        <main className="site-main">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
