"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { CookiePolicyModal } from "./cookie-policy-modal"
import cookieConsentManager, { CookiePreferences } from "@/services/cookieConsentManager"

export function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // Set mounted state to indicate client-side rendering
    setMounted(true)
    
    // Check if user has already set cookie preferences
    if (!cookieConsentManager.hasSetPreferences()) {
      // If no preferences are set, show the banner after a short delay
      const timer = setTimeout(() => {
        setShowBanner(true)
      }, 1500)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleAcceptAll = () => {
    // Save preferences with all cookies accepted
    const allAccepted: CookiePreferences = {
      necessary: true,
      functional: true,
      analytics: true,
      marketing: true,
    }
    
    cookieConsentManager.savePreferences(allAccepted)
    setShowBanner(false)
  }

  const handleCustomize = () => {
    setShowModal(true)
    setShowBanner(false)
  }

  // Avoid hydration mismatch by not rendering until client-side
  if (!mounted) {
    return null
  }

  if (!showBanner) {
    return null
  }

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 bg-[#0a0b14] border-t border-[#1e2132]">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-sm text-gray-300 md:max-w-2xl">
            We use cookies to enhance your browsing experience, analyze site traffic, and personalize content. By
            clicking "Accept All", you consent to our use of cookies.
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <Button
              variant="outline"
              className="border-[#1e2132] bg-black text-gray-300 hover:text-white hover:bg-[#141525] flex-1 md:flex-none"
              onClick={handleCustomize}
            >
              Customize
            </Button>
            <Button
              className="bg-[#ff8a00] hover:bg-[#e67e00] text-white flex-1 md:flex-none"
              onClick={handleAcceptAll}
            >
              Accept All
            </Button>
          </div>
        </div>
      </div>
      <CookiePolicyModal open={showModal} onOpenChange={setShowModal} />
    </>
  )
}