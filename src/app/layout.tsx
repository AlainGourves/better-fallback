import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.scss'
import { Suspense } from 'react'
import Loading from './loading'
import { ContextProvider } from './context/ContextProvider'
import SVGSprite from './components/SVGSprite'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'A Better Font Fallback',
  description: 'Font fallbacks that use font metric overrides to prevent content layout shifts',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Suspense fallback={<Loading />}>
          <ContextProvider>

            {children}
          </ContextProvider>
        </Suspense>
        <SVGSprite />
      </body>
    </html>
  )
}
