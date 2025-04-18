"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Search, ShoppingCart, Menu, X, Headphones, Newspaper, BarChart3, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { useCart } from "../contexts/CartContext"

export const Logo = () => {
  return (
    <Link href="/">
      <div className="relative w-32 h-12 md:w-40 md:h-14 flex items-center justify-center">
        {/* Updated SVG Logo */}
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 360 90"
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
        >
          <defs>
            <linearGradient
              id="linear-gradient"
              x1="-4.48"
              y1="35.5"
              x2="62.29"
              y2="75.82"
              gradientTransform="translate(0 92) scale(1 -1)"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset=".04" stopColor="#ef4b3d" />
              <stop offset="1" stopColor="#f7984a" />
            </linearGradient>
            <linearGradient
              id="linear-gradient1"
              x1="265.8"
              y1="32.43"
              x2="297.46"
              y2="64.09"
              gradientTransform="translate(0 92) scale(1 -1)"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0" stopColor="#ef4b3d" />
              <stop offset="1" stopColor="#f7984a" />
            </linearGradient>
          </defs>
           {/* Bitcoin logo with gradient */}
           <path
            d="M30.07,41.94c2.62-1.34,4.27-3.69,3.89-7.61-.51-5.36-5.15-7.16-10.99-7.66v-7.43h-4.53v7.23c-1.19,0-2.41.03-3.62.05v-7.28h-4.53v7.43c-.98.02-1.95.04-2.88.04v-.03H1.17v4.83s3.35-.06,3.29,0c1.84,0,2.44,1.06,2.6,1.98v20.36c-.08.57-.42,1.5-1.7,1.5.06.05-3.3,0-3.3,0l-.89,5.4h5.89c1.1,0,2.17.02,3.24.03v7.52h4.53v-7.43c1.24.03,2.44.03,3.62.03v7.4h4.53v-7.5c7.61-.44,12.94-2.35,13.61-9.49.53-5.75-2.17-8.32-6.5-9.35h0ZM14.93,31.83c2.55,0,10.59-.81,10.59,4.52s-8.03,4.51-10.59,4.51c0,0,0-9.03,0-9.03ZM14.93,55.37v-9.96c3.07,0,12.7-.89,12.7,4.97s-9.63,4.98-12.7,4.98Z"
            fill="url(#linear-gradient)"
          />

          {/* I in white */}
          <path d="M47.32,26.48v34.49h-8.06V26.48h8.06Z" fill="#FFFFFF" />

          {/* O in white */}
          <path
            d="M64.43,61.48c-2.66,0-4.96-.55-6.9-1.65-1.95-1.1-3.44-2.65-4.49-4.63-1.05-1.98-1.58-4.29-1.58-6.94s.52-4.95,1.58-6.94c1.05-1.98,2.55-3.52,4.49-4.63,1.95-1.1,4.25-1.65,6.9-1.65s4.97.55,6.91,1.65c1.94,1.1,3.43,2.65,4.48,4.63,1.05,1.98,1.58,4.29,1.58,6.94s-.52,4.95-1.58,6.94c-1.05,1.98-2.55,3.52-4.48,4.63-1.94,1.1-4.24,1.65-6.91,1.65ZM64.43,55.25c1.02,0,1.88-.29,2.6-.87.71-.58,1.25-1.39,1.62-2.44.37-1.05.56-2.28.56-3.7s-.19-2.67-.56-3.72-.91-1.85-1.62-2.42c-.71-.57-1.58-.86-2.6-.86s-1.86.29-2.58.86-1.26,1.37-1.64,2.42-.56,2.28-.56,3.72.19,2.66.56,3.7c.37,1.05.91,1.86,1.64,2.44.72.58,1.58.87,2.58.87Z"
            fill="#FFFFFF"
          />

          {/* C in white */}
          <path
            d="M93.46,61.48c-2.67,0-4.97-.56-6.9-1.67-1.93-1.11-3.41-2.66-4.46-4.64s-1.56-4.29-1.56-6.91.52-4.95,1.56-6.94c1.05-1.98,2.53-3.52,4.46-4.63s4.23-1.65,6.9-1.65c1.67,0,3.19.22,4.57.66,1.38.44,2.6,1.07,3.63,1.9s1.88,1.81,2.51,2.97c.63,1.15,1.04,2.44,1.21,3.88l-7.5.97c-.11-.67-.29-1.25-.53-1.76s-.55-.94-.91-1.31c-.36-.36-.78-.64-1.26-.83s-1.01-.28-1.6-.28c-1.04,0-1.91.28-2.63.83-.72.56-1.26,1.36-1.64,2.39-.38,1.05-.56,2.29-.56,3.76s.19,2.68.56,3.74c.38,1.05.93,1.87,1.64,2.44s1.59.86,2.63.86c.59,0,1.12-.09,1.61-.29s.91-.47,1.28-.84.67-.83.91-1.37.41-1.15.52-1.8l7.5.95c-.15,1.45-.55,2.76-1.18,3.94-.63,1.17-1.47,2.18-2.51,3.02-1.05.84-2.26,1.48-3.66,1.93-1.4.45-2.93.67-4.59.67h0Z"
            fill="#FFFFFF"
          />

          {/* K in white */}
          <path
            d="M109.49,60.97V26.48h8.06v34.49s-8.06,0-8.06,0ZM116.74,54.21v-9.61h1.11l7.41-9.19h9.19l-10.83,13.11h-2.11l-4.77,5.7h0ZM125.51,60.97l-6.85-10.65,5.28-5.72,10.88,16.37h-9.31Z"
            fill="#FFFFFF"
          />

          {/* Rest of letters in white */}
          <path
            d="M148.17,61.48c-2.67,0-4.97-.56-6.9-1.67-1.93-1.11-3.41-2.66-4.46-4.64s-1.56-4.29-1.56-6.91.52-4.95,1.56-6.94c1.05-1.98,2.53-3.52,4.46-4.63s4.23-1.65,6.9-1.65c1.67,0,3.19.22,4.57.66,1.38.44,2.6,1.07,3.63,1.9s1.88,1.81,2.51,2.97c.63,1.15,1.04,2.44,1.21,3.88l-7.5.97c-.11-.67-.29-1.25-.53-1.76s-.55-.94-.91-1.31c-.36-.36-.78-.64-1.26-.83s-1.01-.28-1.6-.28c-1.04,0-1.91.28-2.63.83-.72.56-1.26,1.36-1.64,2.39-.38,1.05-.56,2.29-.56,3.76s.19,2.68.56,3.74c.38,1.05.93,1.87,1.64,2.44.72.57,1.59.86,2.63.86.59,0,1.12-.09,1.61-.29s.91-.47,1.28-.84.67-.83.91-1.37.41-1.15.52-1.8l7.5.95c-.15,1.45-.55,2.76-1.18,3.94-.63,1.17-1.47,2.18-2.51,3.02-1.05.84-2.26,1.48-3.66,1.93-1.4.45-2.93.67-4.59.67h0Z"
            fill="#FFFFFF"
          />
          <path
            d="M172.26,46.52v14.45h-8.06V26.48h7.92v15.47h-.67c.67-2.08,1.68-3.75,3.04-5.02,1.37-1.26,3.19-1.89,5.5-1.89,1.8,0,3.37.4,4.69,1.19,1.32.79,2.34,1.92,3.07,3.38s1.09,3.17,1.09,5.13v16.23h-8.06v-14.66c0-1.45-.37-2.58-1.1-3.39-.73-.81-1.75-1.21-3.07-1.21-.87,0-1.63.19-2.28.56-.66.38-1.16.92-1.53,1.64-.36.71-.55,1.58-.55,2.61h.03Z"
            fill="#FFFFFF"
          />
          <path
            d="M201.26,61.43c-1.65,0-3.12-.28-4.4-.84s-2.28-1.4-3.01-2.51-1.09-2.51-1.09-4.21c0-1.42.25-2.61.75-3.59.51-.97,1.2-1.76,2.08-2.38.89-.61,1.91-1.08,3.07-1.4,1.15-.32,2.39-.54,3.7-.65,1.47-.13,2.65-.26,3.54-.4s1.54-.36,1.95-.65.6-.68.6-1.19v-.12c0-.57-.14-1.06-.41-1.47-.28-.4-.67-.72-1.2-.94-.51-.22-1.15-.32-1.89-.32s-1.39.11-1.96.34c-.56.23-1.03.54-1.39.94s-.61.87-.73,1.42l-7.34-.74c.3-1.54.93-2.89,1.91-4.04.98-1.15,2.28-2.04,3.9-2.67s3.53-.95,5.74-.95c1.64,0,3.15.19,4.54.56,1.39.38,2.6.94,3.62,1.67,1.03.73,1.82,1.64,2.39,2.7s.84,2.29.84,3.68v17.31h-7.64v-3.59h-.19c-.46.88-1.05,1.62-1.74,2.23-.7.6-1.53,1.05-2.47,1.37s-2.01.46-3.19.46h.02ZM203.72,56.11c.89,0,1.71-.18,2.44-.55.73-.36,1.32-.87,1.74-1.51s.63-1.37.63-2.21v-2.43c-.22.13-.5.24-.83.34-.34.1-.71.19-1.11.29-.4.09-.82.18-1.24.24s-.83.13-1.24.19c-.78.11-1.43.3-1.99.56s-.98.6-1.27.99-.44.89-.44,1.46.14,1.03.43,1.42.67.69,1.17.89,1.06.3,1.71.3h0Z"
            fill="#FFFFFF"
          />
          <path
            d="M225.67,32.51c-1.19,0-2.19-.38-3.01-1.14-.82-.76-1.23-1.69-1.23-2.78s.4-2.05,1.23-2.8c.82-.76,1.82-1.14,3.01-1.14s2.17.38,2.98,1.14c.82.76,1.23,1.69,1.23,2.8s-.41,2.02-1.23,2.78-1.81,1.14-2.98,1.14ZM221.64,60.97v-25.56h8.06v25.56h-8.06Z"
            fill="#FFFFFF"
          />
          <path
            d="M242.9,46.52v14.45h-8.06v-25.56h7.66l.12,6.53h-.53c.67-2.08,1.68-3.75,3.04-5.02,1.37-1.26,3.19-1.89,5.5-1.89,1.8,0,3.37.4,4.69,1.19,1.32.79,2.34,1.92,3.07,3.38.72,1.46,1.09,3.17,1.09,5.13v16.23h-8.06v-14.66c0-1.45-.36-2.58-1.1-3.39-.73-.81-1.75-1.21-3.07-1.21-.87,0-1.63.19-2.28.56s-1.16.92-1.53,1.64c-.36.71-.55,1.58-.55,2.61h0Z"
            fill="#FFFFFF"
          />
          <path
            d="M313.54,61.43c-1.65,0-3.12-.28-4.4-.84s-2.28-1.4-3.01-2.51-1.09-2.51-1.09-4.21c0-1.42.25-2.61.75-3.59.51-.97,1.2-1.76,2.08-2.37s1.91-1.08,3.07-1.4c1.15-.32,2.39-.54,3.7-.65,1.47-.13,2.65-.26,3.54-.4s1.54-.36,1.95-.65.6-.68.6-1.19v-.12c0-.57-.14-1.06-.41-1.47-.28-.4-.67-.72-1.2-.94-.51-.22-1.15-.32-1.89-.32s-1.39.11-1.96.34-1.03.54-1.39.94-.61.87-.73,1.42l-7.34-.74c.3-1.54.93-2.89,1.91-4.04.98-1.15,2.28-2.04,3.9-2.67s3.53-.95,5.74-.95c1.64,0,3.15.19,4.54.56,1.39.38,2.6.94,3.62,1.67,1.03.73,1.82,1.64,2.39,2.7.56,1.06.84,2.29.84,3.68v17.31h-7.64v-3.59h-.19c-.46.88-1.05,1.62-1.74,2.23-.7.6-1.53,1.05-2.47,1.37s-2.01.46-3.19.46l.02-.02ZM315.99,56.11c.89,0,1.71-.18,2.44-.55.73-.36,1.32-.87,1.74-1.51.42-.64.63-1.37.63-2.21v-2.43c-.22.13-.5.24-.83.34-.34.1-.71.19-1.11.29s-.82.18-1.24.24-.83.13-1.24.19c-.78.11-1.43.3-1.99.56-.56.26-.98.6-1.27.99s-.44.89-.44,1.46.14,1.03.43,1.42c.29.4.67.69,1.17.89s1.06.3,1.71.3h0Z"
            fill="#FFFFFF"
          />
          <path
            d="M333.13,70.18l1.39-5.98,1.55.23c.88.19,1.64.22,2.28.09.64-.13,1.14-.4,1.49-.81.35-.42.53-.96.53-1.64l.09-1.09-9.61-25.58h8.47l3.82,12.34c.51,1.7.93,3.4,1.26,5.09.33,1.69.71,3.5,1.12,5.4h-1.79c.4-1.9.81-3.7,1.23-5.42.42-1.71.89-3.41,1.43-5.07l4.05-12.34h8.36l-10.76,28.46c-.54,1.41-1.22,2.63-2.05,3.67-.83,1.05-1.86,1.85-3.11,2.41-1.25.56-2.78.84-4.59.84-.97,0-1.91-.05-2.82-.16s-1.69-.25-2.36-.44h0Z"
            fill="#FFFFFF"
          />

          {/* Second Bitcoin logo (on right) with gradient */}
          <path
            d="M295.88,41.94c2.62-1.34,4.27-3.69,3.89-7.61-.51-5.36-5.15-7.16-10.99-7.66v-7.43h-4.53v7.23c-1.19,0-2.41.03-3.62.05v-7.28h-4.53v7.43c-.98.02-1.95.04-2.88.04v-.03h-6.25v4.83s3.35-.06,3.29,0c1.84,0,2.44,1.06,2.6,1.98v20.36c-.08.57-.42,1.5-1.7,1.5.06.05-3.3,0-3.3,0l-.9,5.4h5.89c1.1,0,2.17.02,3.24.03v7.52h4.53v-7.43c1.24.03,2.44.03,3.62.03v7.4h4.53v-7.5c7.61-.44,12.94-2.35,13.61-9.49.53-5.75-2.17-8.32-6.5-9.35h0ZM280.73,31.83c2.55,0,10.59-.81,10.59,4.52s-8.03,4.51-10.59,4.51v-9.03ZM280.73,55.37v-9.96c3.07,0,12.7-.89,12.7,4.97s-9.63,4.98-12.7,4.98Z"
            fill="url(#linear-gradient1)"
          />
        </svg>
      </div>
    </Link>
  )
}

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchFocused, setSearchFocused] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const mobileSearchRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const mobileMenuRef = useRef<HTMLDivElement>(null)

  // Add cart context
  const { getItemsCount } = useCart()

  // Close mobile menu when ESC key is pressed
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false)
      }
    }
    
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [mobileMenuOpen])

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileMenuOpen])

  useEffect(() => {
    // Mark as mounted so we can use cart functions safely
    setMounted(true)

    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navItems = [
    { name: "Crypto Directory", href: "/directory", icon: <BarChart3 className="h-4 w-4 mr-1" /> },
    { name: "News", href: "/news", icon: <Newspaper className="h-4 w-4 mr-1" /> },
    { name: "Podcast", href: "/podcasts", icon: <Headphones className="h-4 w-4 mr-1" /> },
    { name: "Halvings", href: "/halving", icon: <Clock className="h-4 w-4 mr-1" /> },
    { name: "Store", href: "/store", icon: <ShoppingCart className="h-4 w-4 mr-1" /> },
  ]

  // Get cart count safely
  const cartCount = mounted ? getItemsCount() : 0

  // Handle search submission
  const handleSubmitSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery("")
      setSearchOpen(false)
      setMobileMenuOpen(false)
    }
  }

  // Handle mobile search submission
  const handleMobileSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery("")
      setMobileMenuOpen(false)
    }
  }

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + K to open search
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault()
        setSearchOpen(true)
        setTimeout(() => {
          searchInputRef.current?.focus()
        }, 10)
      }

      // Escape to close search
      if (e.key === "Escape" && searchOpen) {
        setSearchOpen(false)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [searchOpen])

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b",
          scrolled
            ? "py-2 sm:py-3 bg-[#07071C]/90 backdrop-blur-md border-gray-800/50"
            : "py-3 sm:py-4 md:py-5 bg-transparent border-transparent",
        )}
      >
        <div className="container mx-auto px-3 sm:px-4 md:px-6">
          <nav className="flex items-center justify-between">
            <Logo />

            <div className="hidden lg:flex items-center space-x-0.5 xl:space-x-1">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="relative px-2 xl:px-4 py-2 text-xs xl:text-sm font-medium text-gray-200 hover:text-white transition-colors group flex items-center"
                >
                  {item.icon}
                  {item.name}
                  <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-[#F7984A] group-hover:w-1/2 group-hover:left-1/4 transition-all duration-300"></span>
                </Link>
              ))}
            </div>

            <div className="hidden lg:flex items-center gap-3 xl:gap-5">
              {/* Extended Search Bar */}
              <div
                className="flex items-center w-48 xl:w-64 h-9 xl:h-10 bg-[#0D0B26]/70 border border-gray-800/50 rounded-full px-3 cursor-pointer hover:border-gray-700/70 transition-all duration-200"
                onClick={() => {
                  setSearchOpen(true)
                  setTimeout(() => searchInputRef.current?.focus(), 10)
                }}
              >
                <Search className="h-3.5 w-3.5 xl:h-4 xl:w-4 text-gray-400 mr-2" />
                <span className="text-gray-400 text-xs xl:text-sm truncate">Search...</span>
                <div className="ml-auto">
                  <kbd className="hidden md:inline-flex h-5 items-center gap-1 rounded border border-gray-700 bg-gray-800/70 px-1.5 font-mono text-[10px] font-medium text-gray-400">
                    Ctrl+K
                  </kbd>
                </div>
              </div>

              <Link
                href="/cart"
                aria-label="Cart"
                className="relative w-8 h-8 rounded-full flex items-center justify-center text-gray-300 hover:text-white transition-colors"
              >
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#F7984A] text-[10px] flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
                <span className="absolute inset-0 rounded-full bg-gray-800 -z-10 opacity-0 hover:opacity-100 transition-opacity"></span>
              </Link>
            </div>

            <div className="flex lg:hidden items-center gap-3">
              {/* Cart icon in mobile */}
              <Link
                href="/cart"
                aria-label="Cart"
                className="relative w-8 h-8 rounded-full flex items-center justify-center text-gray-300 hover:text-white transition-colors"
              >
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#F7984A] text-[10px] flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
              
              <button
                className="flex items-center justify-center w-10 h-10 rounded-md text-gray-200 hover:text-white hover:bg-[#0D0B26]/70 transition-colors z-50"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </nav>
          
          {/* REMOVED: Mobile Search Bar is now inside the mobile menu */}
        </div>
      </header>

      {/* Search Overlay */}
      {searchOpen && (
        <div
          className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-start justify-center pt-16 sm:pt-20 px-4 animate-fadeIn"
          onClick={() => setSearchOpen(false)}
        >
          <div
            className="w-full max-w-[90%] sm:max-w-xl md:max-w-2xl bg-gradient-to-b from-[#0D0B26] to-[#07071C] border border-gray-800/80 rounded-xl shadow-2xl overflow-hidden animate-slideDown transition-all duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <form onSubmit={handleSubmitSearch} className="relative">
              <div className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 text-gray-400">
                <Search
                  className={`h-4 w-4 sm:h-5 sm:w-5 transition-colors duration-300 ${searchFocused ? "text-[#F7984A]" : "text-gray-400"}`}
                />
              </div>

              <Input
                ref={searchInputRef}
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                className="border-none bg-transparent py-3 sm:py-5 md:py-6 pl-8 sm:pl-12 pr-8 sm:pr-12 text-sm sm:text-base md:text-lg text-white placeholder:text-gray-500 focus-visible:ring-1 focus-visible:ring-[#F7984A] focus-visible:ring-offset-0"
                autoComplete="off"
              />

              <div className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 flex items-center gap-2 sm:gap-3">
                {searchQuery && (
                  <button
                    type="button"
                    className="text-gray-400 hover:text-gray-300 transition-colors"
                    onClick={() => setSearchQuery("")}
                    aria-label="Clear search"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
                <kbd className="hidden md:flex h-5 items-center gap-1 rounded border border-gray-700 bg-gray-800 px-1.5 font-mono text-[10px] font-medium text-gray-400">
                  ESC
                </kbd>
              </div>
            </form>

            <div className="p-3 sm:p-4 md:p-6 border-t border-gray-800/50 bg-black/20">
              <p className="text-xs sm:text-sm text-gray-400 mb-2 sm:mb-3">Popular Searches</p>
              <div className="flex flex-wrap gap-1 sm:gap-2">
                <button
                  className="bg-[#0D0B26] border border-gray-800/60 rounded-full px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 text-xs hover:bg-[#0D0B26]/70 hover:border-gray-700/60 transition-all duration-300 flex items-center gap-1 group"
                  onClick={(e) => {
                    setSearchQuery("Bitcoin")
                    setTimeout(() => handleSubmitSearch(e as any), 10)
                  }}
                >
                  <span>🔸</span>
                  <span className="group-hover:text-[#F7984A] text-white transition-colors">Bitcoin</span>
                </button>
                {/* More search buttons... */}
              </div>
              <div className="mt-4 sm:mt-6 flex justify-between items-center">
                <span className="text-xs text-gray-500 flex items-center gap-1">
                  <kbd className="inline-flex h-5 items-center gap-1 rounded border border-gray-700 bg-gray-800 px-1.5 font-mono text-[10px] font-medium text-gray-400 md:hidden">
                    ESC
                  </kbd>
                  <span className="md:hidden">to close</span>
                  <span className="hidden md:inline">Press ESC to close</span>
                </span>
                <Button
                  type="submit"
                  onClick={handleSubmitSearch}
                  className="bg-[#F7984A] hover:bg-[#F7984A]/90 text-white px-3 sm:px-5 py-1.5 sm:py-2 text-xs sm:text-sm transition-all duration-200 shadow-lg shadow-[#F7984A]/20 hover:shadow-[#F7984A]/30 hover:translate-y-[-1px]"
                  disabled={!searchQuery.trim()}
                >
                  Search
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile menu - with search integrated inside */}
      <div
        ref={mobileMenuRef}
        className={cn(
          "fixed inset-0 z-40 lg:hidden transition-all duration-300 ease-in-out",
          mobileMenuOpen 
            ? "opacity-100 pointer-events-auto" 
            : "opacity-0 pointer-events-none"
        )}
      >
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-[#07071C]/95 backdrop-blur-md"
          onClick={() => setMobileMenuOpen(false)}
        ></div>
        
        {/* Content */}
        <div 
          className={cn(
            "relative h-full w-full max-w-xs sm:max-w-sm ml-auto bg-[#0D0B26] border-l border-gray-800/50 overflow-y-auto transition-transform duration-300 ease-in-out transform",
            mobileMenuOpen ? "translate-x-0" : "translate-x-full"
          )}
        >
          <div className="flex flex-col h-full">
            {/* Close button */}
            <div className="flex justify-end p-4">
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-full"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="flex-1 px-4 sm:px-6 py-2">
              {/* Search Bar inside mobile menu */}
              <div className="mb-6">
                <form onSubmit={handleMobileSearch} className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <Search className="h-4 w-4 text-gray-400" />
                  </div>
                  <Input
                    ref={mobileSearchRef}
                    type="text"
                    placeholder="Search projects, products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="border border-gray-800/50 bg-[#0A0A20]/80 py-2 pl-9 pr-3 text-sm text-white placeholder:text-gray-400 focus-visible:ring-1 focus-visible:ring-[#F7984A] focus-visible:ring-offset-0 rounded-lg"
                    autoComplete="off"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
                      onClick={() => setSearchQuery("")}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </form>
              </div>
              
              <div className="space-y-1">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="flex items-center py-3 px-2 text-base sm:text-lg font-medium text-gray-200 hover:text-white hover:bg-[#0F0F2D] rounded-lg transition-all duration-200"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <div className="w-6 mr-3 flex items-center justify-center">
                      {item.icon}
                    </div>
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
            
            <div className="p-4 sm:p-6 mt-auto border-t border-gray-800/50">
              <Link href="/cart" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full bg-[#F7984A] hover:bg-[#F7984A]/90 text-white py-3 sm:py-4 flex items-center justify-center text-sm sm:text-base gap-2">
                  <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5" />
                  View Cart {cartCount > 0 && `(${cartCount})`}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Navbar