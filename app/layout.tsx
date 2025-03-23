import type { Metadata } from 'next'
import './globals.css'
import GiveawayStatusUpdater from '@/components/GiveawayStatusUpdater'

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
          {/* Include the status updater component that runs in the background */}
          <GiveawayStatusUpdater />
        {children}
        
      </body>
    </html>
  )
}
