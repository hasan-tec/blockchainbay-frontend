"use client"

import { useEffect } from "react"
import Link from "next/link"
import { CheckCircle, ArrowRight, ShoppingBag } from "lucide-react"
import { useCart } from "../../contexts/CartContext"
import Navbar from "../../components/Navbar"
import { Footer } from "../../components/NewsletterFooter"
import { Button } from "@/components/ui/button"

export default function OrderCompletePage() {
  const { clearCart } = useCart()

  // Clear the cart when this page loads
  useEffect(() => {
    // Add a small delay to ensure the page is fully loaded
    const timer = setTimeout(() => {
      clearCart()
    }, 1000)

    return () => clearTimeout(timer)
  }, [clearCart])

  return (
    <div className="min-h-screen flex flex-col bg-[#050714]">
      <Navbar />
      <main className="pt-32 pb-20 flex-grow text-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-2xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <CheckCircle className="h-20 w-20 text-green-500" />
            </div>

            <h1 className="text-3xl md:text-4xl font-bold mb-4">Thank You for Your Order!</h1>
            <p className="text-xl text-gray-300 mb-8">Your order has been placed successfully.</p>

            <div className="bg-[#0A0B1A] border border-[#1E2140]/50 rounded-xl p-8 mb-8">
              <h2 className="text-xl font-semibold mb-4">What's Next?</h2>
              <div className="space-y-4 text-left">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#F7984A]/20 text-[#F7984A] flex items-center justify-center mt-0.5">
                    1
                  </div>
                  <div>
                    <p className="text-gray-200">
                      You'll receive an order confirmation email from Helium Deploy shortly.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#F7984A]/20 text-[#F7984A] flex items-center justify-center mt-0.5">
                    2
                  </div>
                  <div>
                    <p className="text-gray-200">Your order will be processed and shipped as soon as possible.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#F7984A]/20 text-[#F7984A] flex items-center justify-center mt-0.5">
                    3
                  </div>
                  <div>
                    <p className="text-gray-200">
                      You can check your order status through the Helium Deploy dashboard.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <Link href="/store">
                <Button className="bg-[#F7984A] hover:bg-[#F7984A]/90 text-white min-w-[200px] transition-all duration-200">
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  Continue Shopping
                </Button>
              </Link>

              <Link href="/account/orders">
                <Button
                  variant="outline"
                  className="min-w-[200px] border-[#1E2140] hover:bg-[#1E2140]/50 transition-all duration-200"
                >
                  View My Orders
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

