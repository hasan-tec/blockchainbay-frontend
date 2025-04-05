// components/SimpleToast.tsx
"use client"

import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { useCart } from '../contexts/CartContext'
import { useToast } from '@/components/ui/use-toast'

type SimpleToastProps = {
  product: any
  quantity: number
  onClose: () => void
}

export default function SimpleToast({ product, quantity, onClose }: SimpleToastProps) {
  const { getCheckoutUrl } = useCart()
  const [isRedirecting, setIsRedirecting] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, 5000)
    
    return () => clearTimeout(timer)
  }, [onClose])
  
  // Calculate proper product info
  const productName = product?.attributes?.name || 'Product'
  const productPrice = product?.attributes?.price || 0
  const totalPrice = (productPrice * quantity).toFixed(2)

  const handleCheckout = () => {
    try {
      // Get the checkout URL from CartContext
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
  
  return (
    <div className="fixed top-4 right-4 bg-[#0D0B26] border border-gray-700 rounded-lg shadow-xl p-4 max-w-xs w-full z-[9999] animate-in fade-in">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-white text-sm font-medium">Added to cart</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-white">
          ✕
        </button>
      </div>
      
      <div className="flex items-center gap-3 mb-3">
        <div className="flex-1">
          <p className="text-white text-sm font-medium">
            {productName} {quantity > 1 ? `(x${quantity})` : ''}
          </p>
          <p className="text-[#F7984A] text-sm font-medium mt-1">
            ${totalPrice}
          </p>
        </div>
      </div>
      
      <div className="flex gap-2">
        <Button 
          onClick={() => window.location.href = '/cart'} 
          variant="outline" 
          size="sm"
          className="h-8 text-xs flex-1 border-gray-700 bg-gray-800 hover:bg-gray-700 text-white"
        >
          View Cart
        </Button>
        <Button
          onClick={handleCheckout}
          disabled={isRedirecting}
          size="sm"
          className="h-8 text-xs flex-1 bg-[#F7984A] hover:bg-[#F7984A]/90 text-white"
        >
          {isRedirecting ? (
            <>
              <div className="mr-2 h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
              Redirecting...
            </>
          ) : (
            "Checkout"
          )}
        </Button>
      </div>
    </div>
  )
}