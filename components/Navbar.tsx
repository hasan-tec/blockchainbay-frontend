"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  Search,
  ShoppingCart,
  Menu,
  X,
  Headphones,
  Gift,
  Newspaper,
  BarChart3,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useCart } from "../contexts/CartContext"

export const Logo = () => {
  return (
       <Link href="/" >
    <div className="flex items-center gap-2">
      <div className="relative w-10 h-10 flex items-center justify-center">
        {/* SVG Logo */}
        <svg 
          width="36" 
          height="36" 
          viewBox="0 0 141.63 97.28" 
          xmlns="http://www.w3.org/2000/svg" 
          xmlnsXlink="http://www.w3.org/1999/xlink"
        >
          <defs>
            <linearGradient id="linear-gradient" x1="1.87" y1="93.87" x2="130.08" y2="7.63" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#ef4b3d"/>
              <stop offset="1" stopColor="#f7984a"/>
            </linearGradient>
            <linearGradient id="linear-gradient-2" x1="4.57" y1="97.88" x2="132.78" y2="11.64" xlinkHref="#linear-gradient"/>
            <linearGradient id="linear-gradient-3" x1="24.08" y1="126.87" x2="152.28" y2="40.63" xlinkHref="#linear-gradient"/>
            <linearGradient id="linear-gradient-4" x1="12.33" y1="109.41" x2="140.54" y2="23.16" xlinkHref="#linear-gradient"/>
            <linearGradient id="linear-gradient-5" x1="-22.5" y1="55.15" x2="86.17" y2="-53.52" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#ef4b3d"/>
              <stop offset="1" stopColor="#f7984a"/>
            </linearGradient>
            <linearGradient id="linear-gradient-6" x1="14.99" y1="26.32" x2="43.25" y2="-1.95" xlinkHref="#linear-gradient-5"/>
            <linearGradient id="linear-gradient-7" x1="5.63" y1="98.29" x2="116.35" y2="-12.43" xlinkHref="#linear-gradient-5"/>
            <linearGradient id="linear-gradient-8" x1="68.98" y1="80" x2="131.75" y2="17.23" xlinkHref="#linear-gradient-5"/>
            <linearGradient id="linear-gradient-9" x1="-11.2" y1="73.92" x2="121.2" y2="-6.03" gradientUnits="userSpaceOnUse">
              <stop offset=".04" stopColor="#ef4b3d"/>
              <stop offset="1" stopColor="#f7984a"/>
            </linearGradient>
          </defs>
          <path className="cls-7" d="m18.13,82.77c.08.06.15.12.23.18-.08-.06-.15-.12-.23-.18Z" fill="url(#linear-gradient)"/>
          <path className="cls-1" d="m26.8,82.95c.07-.06.14-.12.21-.18-.07.06-.14.12-.21.18Z" fill="url(#linear-gradient-2)"/>
          <path className="cls-6" d="m89.4,82.76c.07.06.13.13.2.19-.07-.06-.13-.13-.2-.19Z" fill="url(#linear-gradient-3)"/>
          <path className="cls-8" d="m98.29,51.56c-.08.06-.15.12-.23.19.08-.06.15-.12.23-.19Z" fill="url(#linear-gradient-4)"/>
          <g>
            <path className="cls-3" d="m18.37,14.31c-.08.06-.16.12-.24.19.08-.06.16-.12.24-.19Z" fill="url(#linear-gradient-5)"/>
            <path className="cls-2" d="m27.01,14.5c-.07-.06-.15-.13-.22-.19.07.06.15.13.22.19Z" fill="url(#linear-gradient-6)"/>
            <path className="cls-4" d="m89.62,14.31c-.07.07-.14.13-.21.2.07-.07.14-.13.21-.2Z" fill="url(#linear-gradient-7)"/>
            <path className="cls-9" d="m128.62,45.03c5.21-2.65,8.46-7.32,7.7-15.09-1.02-10.62-10.21-14.19-21.8-15.2V0h-8.98v14.35c-2.37,0-4.77.05-7.17.09V0s-8.97,0-8.97,0v14.73c-1.95.04-3.86.08-5.72.08v-.04h-12.39s0,9.57,0,9.57c0,0,6.63-.12,6.52,0,3.64,0,4.82,2.11,5.16,3.93v16.79s0,23.58,0,23.58c-.16,1.14-.83,2.97-3.38,2.97.12.1-6.53,0-6.53,0l-1.78,10.71h11.68c2.18,0,4.32.04,6.41.05v14.9s8.98,0,8.98,0v-14.75c2.47.05,4.85.07,7.17.07v14.68s8.98,0,8.98,0v-14.88c15.1-.87,25.67-4.67,26.98-18.83,1.06-11.4-4.31-16.49-12.88-18.55Zm-30.03-20.04c5.06,0,20.99-1.61,20.99,8.96,0,10.13-15.92,8.95-20.99,8.95v-17.91Zm0,46.7v-19.75c6.09,0,25.17-1.75,25.18,9.87,0,11.14-19.09,9.87-25.18,9.88Z" fill="url(#linear-gradient-8)"/>
            <path className="cls-5" d="m57.33,45.03c5.21-2.65,8.46-7.32,7.7-15.09-1.02-10.62-10.21-14.19-21.8-15.2V0h-8.98v14.35c-2.37,0-4.77.05-7.17.09V0s-8.97,0-8.97,0v14.73c-1.95.04-3.86.08-5.72.08v-.04H0s0,9.57,0,9.57c0,0,6.63-.12,6.52,0,3.64,0,4.82,2.11,5.16,3.93v16.79s0,23.58,0,23.58c-.16,1.14-.83,2.97-3.38,2.97.12.1-6.53,0-6.53,0L0,82.32h11.68c2.18,0,4.32.04,6.41.05v14.9s8.98,0,8.98,0v-14.75c2.47.05,4.85.07,7.17.07v14.68s8.98,0,8.98,0v-14.88c15.1-.87,25.67-4.67,26.98-18.83,1.06-11.4-4.31-16.49-12.88-18.55Zm-30.03-20.04c5.06,0,20.99-1.61,20.99,8.96,0,10.13-15.92,8.95-20.99,8.95v-17.91Zm0,46.7v-19.75c6.09,0,25.17-1.75,25.18,9.87,0,11.14-19.09,9.87-25.18,9.88Z" fill="url(#linear-gradient-9)"/>
          </g>
        </svg>
      </div>
      <span className="font-bold text-xl tracking-tight">BlockchainBay</span>
    </div>
      </Link>
  )
}

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  // Add cart context
  const { getItemsCount } = useCart()

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
    { name: "Projects", href: "/projects", icon: <BarChart3 className="h-4 w-4 mr-1" /> },
    { name: "News", href: "/news", icon: <Newspaper className="h-4 w-4 mr-1" /> },
    { name: "Podcasts", href: "/podcasts", icon: <Headphones className="h-4 w-4 mr-1" /> },
    { name: "Store", href: "/store", icon: <ShoppingCart className="h-4 w-4 mr-1" /> },
    { name: "Giveaways", href: "/giveaways", icon: <Gift className="h-4 w-4 mr-1" /> },
  ]

  // Get cart count safely
  const cartCount = mounted ? getItemsCount() : 0

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b",
          scrolled
            ? "py-3 bg-[#07071C]/90 backdrop-blur-md border-gray-800/50"
            : "py-5 bg-transparent border-transparent",
        )}
      >
        <div className="container mx-auto px-4 md:px-6">
          <nav className="flex items-center justify-between">
            <Logo />

            <div className="hidden lg:flex items-center space-x-1">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="relative px-4 py-2 text-sm font-medium text-gray-200 hover:text-white transition-colors group flex items-center"
                >
                  {item.icon}
                  {item.name}
                  <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-[#F7984A] group-hover:w-1/2 group-hover:left-1/4 transition-all duration-300"></span>
                </Link>
              ))}
            </div>

            <div className="hidden lg:flex items-center gap-5">
              <Link
                href="/cart"
                aria-label="Cart"
                className="relative w-8 h-8 rounded-full flex items-center justify-center text-gray-300 hover:text-white transition-colors"
              >
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute top-0 right-0 w-4 h-4 rounded-full bg-[#F7984A] text-[10px] flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
                <span className="absolute inset-0 rounded-full bg-gray-800 -z-10 opacity-0 hover:opacity-100 transition-opacity"></span>
              </Link>
              <Link href="/admin/giveaways" >
              <Button className="bg-[#F7984A] hover:bg-[#F7984A]/90 text-white rounded-full px-5 shadow-lg shadow-[#F7984A]/20 transition-all duration-300 hover:shadow-[#F7984A]/30 hover:translate-y-[-2px]">
                Sign In
              </Button>
              </Link>
            </div>

            <button
              className="lg:hidden flex items-center justify-center w-10 h-10 rounded-md  text-gray-200"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </nav>
        </div>
      </header>

      {/* Mobile menu */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-[#07071C]/95 backdrop-blur-md lg:hidden transition-transform duration-300 ease-in-out",
          mobileMenuOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="pt-20 px-6 h-full overflow-y-auto">
          <div className="space-y-6">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center py-3 text-lg font-medium text-gray-200 hover:text-white border-b border-gray-800"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.icon}
                {item.name}
              </Link>
            ))}

            <div className="pt-4 space-y-4">
              <Link href="/cart" onClick={() => setMobileMenuOpen(false)}>
                <Button
                  className="w-full bg-gray-800 hover:bg-gray-700 text-white py-6 flex items-center justify-center"
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  View Cart {cartCount > 0 && `(${cartCount})`}
                </Button>
              </Link>
              <Link href="/admin/giveaways" >
              <Button
                className="w-full bg-[#F7984A] hover:bg-[#F7984A]/90 text-white py-6"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sign In
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