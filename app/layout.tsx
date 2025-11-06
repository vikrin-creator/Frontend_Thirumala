import './globals.css'
import React from 'react'

export const metadata = {
  title: 'Thirumala Brokers - Logistics Management',
  description: 'Seller & Lorry Management System',
  icons: {
    icon: '/favicon.svg',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="light">
      <body className="font-display">
        {children}
      </body>
    </html>
  )
}