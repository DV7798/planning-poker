import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Basil Planning Poker',
  description: 'Real-time Planning Poker estimation tool',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=5',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
