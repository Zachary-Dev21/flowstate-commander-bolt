import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'FlowState Commander Bolt',
  description: 'ADHD‑centric planner with compassionate UX',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-calm-50 text-calm-900 antialiased">
        {children}
      </body>
    </html>
  )
}
