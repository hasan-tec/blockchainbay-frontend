import type { Metadata } from 'next'
import './globals.css'
import { AuthProvider } from '@/contexts/AuthContext'


export const metadata: Metadata = {
  title: 'BlockChainBay',
  description: 'Crypto Directory Hub',
  
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
      <AuthProvider>
        {children}
       </AuthProvider>
      </body>
    </html>
  )
}
