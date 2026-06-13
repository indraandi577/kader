import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Pendataan Kader Hidayatullah DIY-Jateng Selatan',
  description: 'Sistem Pendataan Kaderisasi Hidayatullah Wilayah DIY-Jateng Bagian Selatan',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id">
      <body className="min-h-screen bg-gray-50 antialiased">
        {children}
      </body>
    </html>
  )
}
