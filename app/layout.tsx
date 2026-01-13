import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Planning Poker',
  description: 'Real-time Planning Poker estimation tool',
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
