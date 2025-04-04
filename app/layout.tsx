import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { AuthProvider } from "@/contexts/AuthContext"
import { CartProvider } from "@/contexts/CartContext"
import { Toaster } from "@/components/ui/toaster"
import { CookieBanner } from "@/components/cookie-banner"

export const metadata: Metadata = {
  title: "BlockchainBay",
  description: "Where Knowledge Meets Opportunity, Join the Crypto Revolution.",
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
          <CartProvider>
            {children}
            <Toaster />
            <CookieBanner />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  )
}

