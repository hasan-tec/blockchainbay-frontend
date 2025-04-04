"use client"

import { useState } from "react"
import { CookiePolicyModal } from "./cookie-policy-modal"

export function CookieLink() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <button
        onClick={(e) => {
          e.preventDefault()
          setIsModalOpen(true)
        }}
        className="text-gray-500 hover:text-white text-sm transition-colors"
      >
        Cookies
      </button>
      <CookiePolicyModal open={isModalOpen} onOpenChange={setIsModalOpen} />
    </>
  )
}

