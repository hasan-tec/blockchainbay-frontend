// components/SimpleToast.tsx
"use client"

import React, { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { getStrapiMediaUrl } from '../lib/storeapi' // Import this function

type SimpleToastProps = {
  product: any
  quantity: number
  onClose: () => void
}

export default function SimpleToast({ product, quantity, onClose }: SimpleToastProps) {
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
  
  // Log for debugging
  console.log("Product in toast:", product);
  console.log("Image data:", product?.attributes?.mainImage?.data);
  
  return (
    <div className="fixed top-4 right-4 bg-[#0D0B26] border border-gray-700 rounded-lg shadow-xl p-4 max-w-xs w-full z-[9999] animate-in fade-in">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-white text-sm font-medium">Added to cart</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-white">
          ✕
        </button>
      </div>
      
      <div className="flex items-center gap-3 mb-3">
        {/* Show product name and details without relying on image */}
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
          onClick={() => window.location.href = '/checkout'}
          size="sm"
          className="h-8 text-xs flex-1 bg-[#F7984A] hover:bg-[#F7984A]/90 text-white"
        >
          Checkout
        </Button>
      </div>
    </div>
  )
}