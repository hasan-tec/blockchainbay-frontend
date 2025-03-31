"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useCart } from "../../contexts/CartContext"
import Navbar from "../../components/Navbar" 
import { Footer } from "../../components/NewsletterFooter"
import { Button } from "@/components/ui/button"
import { Minus, Plus, ShoppingCart, ArrowRight, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { useToast } from "@/components/ui/use-toast"

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, getCartTotal, getCheckoutUrl } = useCart()
  const [isRedirecting, setIsRedirecting] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { toast } = useToast()

  // Ensure we're in the client
  useEffect(() => {
    setMounted(true)
  }, [])

  const handleCheckout = () => {
    try {
      // Get the checkout URL
      const checkoutUrl = getCheckoutUrl()

      if (!checkoutUrl) {
        toast({
          title: "Error",
          description: "Could not create checkout URL. Your cart may be empty.",
          duration: 3000,
        })
        return
      }

      // Set redirecting state to show loading UI
      setIsRedirecting(true)

      // Log the URL we're redirecting to (for debugging)
      console.log("Redirecting to:", checkoutUrl)

      // Use a small timeout to allow the UI to update before redirecting
      setTimeout(() => {
        // Redirect to the HeliumDeploy checkout page
        window.location.href = checkoutUrl
      }, 300)
    } catch (error) {
      console.error("Error during checkout:", error)
      setIsRedirecting(false)

      toast({
        title: "Checkout Error",
        description: "There was a problem processing your checkout. Please try again.",
        duration: 3000,
      })
    }
  }

  // Don't render anything on the server
  if (!mounted) {
    return (
      <>
        <Navbar />
        <main className="pt-24 sm:pt-32 pb-12 sm:pb-20 bg-[#050714]">
          <div className="container mx-auto px-4 md:px-6">
            <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-white">Your Shopping Cart</h1>
            <div className="text-center py-8 sm:py-12 bg-[#0A0B1A] border border-[#1E2140]/50 rounded-xl">
              <p className="text-gray-300">Loading cart...</p>
            </div>
          </div>
        </main>
        <div className="bg-[#050714]">
          <Footer />
        </div>
      </>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#050714]">
      {/* Fixed Navbar with explicit text color */}
      <Navbar />
      <main className="pt-24 sm:pt-32 pb-12 sm:pb-20 flex-grow text-white">
        <div className="container mx-auto px-4 md:px-6">
          <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">Your Shopping Cart</h1>

          {items.length === 0 ? (
            <div className="text-center py-8 sm:py-12 bg-[#0A0B1A] border border-[#1E2140]/50 rounded-xl px-4">
              <div className="mb-4">
                <ShoppingCart className="w-12 h-12 sm:w-16 sm:h-16 mx-auto text-gray-500" />
              </div>
              <h2 className="text-xl sm:text-2xl mb-3 sm:mb-4">Your cart is empty</h2>
              <p className="mb-5 sm:mb-6 text-gray-400 text-sm sm:text-base">
                Looks like you haven't added any products to your cart yet.
              </p>
              <Link
                href="/store"
                className="bg-[#F7984A] hover:bg-[#F7984A]/90 text-white py-2 px-5 sm:px-6 rounded-full inline-flex items-center transition-all duration-200 text-sm sm:text-base"
              >
                Continue Shopping
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8">
              <div className="w-full">
                <div className="bg-[#0A0B1A] border border-[#1E2140]/50 rounded-xl overflow-hidden">
                  <div className="px-6 py-4 border-b border-[#1E2140]/50">
                    <h2 className="font-bold">Cart Items ({items.length})</h2>
                  </div>

                  {/* Cart items */}
                  <div className="divide-y divide-[#1E2140]/50">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 sm:p-6"
                      >
                        <div className="w-16 h-16 sm:w-20 sm:h-20 relative flex-shrink-0">
                          <Image
                            src={item.image || "/placeholder.svg"}
                            alt={item.name}
                            width={80}
                            height={80}
                            className="object-cover rounded-md"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <Link
                            href={`/store/${item.slug || item.id}`}
                            className="font-medium hover:text-[#F7984A] transition-colors line-clamp-1"
                          >
                            {item.name}
                          </Link>
                          <p className="text-[#F7984A] font-semibold mt-1">${item.price.toFixed(2)}</p>
                          {!item.inStock && <p className="text-red-400 text-xs mt-1">This item is out of stock</p>}
                        </div>
                        <div className="flex items-center gap-2 mt-2 sm:mt-0">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className={cn(
                              "w-8 h-8 rounded-full flex items-center justify-center",
                              item.quantity <= 1
                                ? "bg-[#1E2140]/50 text-gray-500 cursor-not-allowed"
                                : "bg-[#1E2140] text-white hover:bg-[#2A2D52] transition-colors",
                            )}
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-8 h-8 bg-[#1E2140] rounded-full flex items-center justify-center text-white hover:bg-[#2A2D52] transition-colors"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                        <div className="flex justify-between w-full sm:w-auto mt-2 sm:mt-0">
                          <div className="text-left sm:text-right whitespace-nowrap font-semibold sm:ml-4">
                            ${(item.price * item.quantity).toFixed(2)}
                          </div>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="w-8 h-8 bg-red-500/20 text-red-400 rounded-full flex items-center justify-center hover:bg-red-500/30 transition-colors ml-auto sm:ml-4"
                            aria-label="Remove item"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6">
                  <Link
                    href="/store"
                    className="text-sm text-[#F7984A] hover:underline inline-flex items-center transition-colors"
                  >
                    <ArrowRight className="mr-2 h-3 w-3 rotate-180" />
                    Continue Shopping
                  </Link>
                </div>
              </div>

              <div className="w-full">
                {/* Cart summary */}
                <div className="bg-[#0A0B1A] border border-[#1E2140]/50 rounded-xl p-6 lg:sticky lg:top-24">
                  <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                  <div className="space-y-2 mb-4 text-sm sm:text-base">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>${getCartTotal().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-400 text-xs sm:text-sm">
                      <span>Shipping</span>
                      <span>Calculated at checkout</span>
                    </div>
                    <div className="flex justify-between text-gray-400 text-xs sm:text-sm">
                      <span>Tax</span>
                      <span>Calculated at checkout</span>
                    </div>
                  </div>
                  <div className="border-t border-[#1E2140] pt-4 mb-4 sm:mb-6">
                    <div className="flex justify-between font-bold">
                      <span>Total</span>
                      <span>${getCartTotal().toFixed(2)}</span>
                    </div>
                  </div>

                  <Button
                    onClick={handleCheckout}
                    disabled={items.length === 0 || isRedirecting}
                    className="w-full bg-[#F7984A] hover:bg-[#F7984A]/90 text-white py-2 sm:py-3 rounded-lg font-semibold mb-3 sm:mb-4 h-10 sm:h-12 transition-all duration-200"
                  >
                    {isRedirecting ? (
                      <>
                        <div className="mr-2 h-3 w-3 sm:h-4 sm:w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                        Redirecting...
                      </>
                    ) : (
                      <>Checkout with Helium Deploy</>
                    )}
                  </Button>

                  <div className="text-center text-xs sm:text-sm text-gray-400">
                    <p>You'll be redirected to Helium Deploy to complete your purchase.</p>
                    <p className="mt-2">Your discount will be automatically applied!</p>
                    <div className="mt-3 sm:mt-4 p-2 sm:p-3 bg-[#1E2140]/50 rounded-lg text-xs">
                      <div className="font-semibold mb-1">Your discounts:</div>
                      <p>
                        10% off sitewide with code <span className="text-[#F7984A] font-medium">BlockchainBay</span>
                      </p>
                      <p>
                        $50 off orders over $500 with code{" "}
                        <span className="text-[#F7984A] font-medium">BlockchainBay50</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      {/* Fixed Footer with explicit text color */}
      <div className="bg-[#050714]">
        <Footer />
      </div>
    </div>
  )
}