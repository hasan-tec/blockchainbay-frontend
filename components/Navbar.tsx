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

export const Logo = () => {
  return (
    <div className="flex items-center gap-2">
      <div className="relative w-10 h-10">
        <div className="absolute inset-0 bg-gradient-to-tr from-[#F7984A] to-[#F7984A]/80 rounded-lg blur-[2px]"></div>
        <div className="absolute inset-0.5 bg-[#F7984A] rounded-lg flex items-center justify-center">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L20 7V17L12 22L4 17V7L12 2Z" fill="white" />
          </svg>
        </div>
      </div>
      <span className="font-bold text-xl tracking-tight">BlockChainBay</span>
    </div>
  )
}

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navItems = [
    { name: "Projects", href: "/projects", icon: <BarChart3 className="h-4 w-4 mr-1" /> },
    { name: "News", href: "/news", icon: <Newspaper className="h-4 w-4 mr-1" /> },
    { name: "Podcasts", href: "#", icon: <Headphones className="h-4 w-4 mr-1" /> },
    { name: "Store", href: "/store", icon: <ShoppingCart className="h-4 w-4 mr-1" /> },
    { name: "Giveaways", href: "#", icon: <Gift className="h-4 w-4 mr-1" /> },
  ]

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
              

              <button
                aria-label="Cart"
                className="relative w-8 h-8 rounded-full flex items-center justify-center text-gray-300 hover:text-white transition-colors"
              >
                <ShoppingCart className="h-5 w-5" />
                <span className="absolute top-0 right-0 w-4 h-4 rounded-full bg-[#F7984A] text-[10px] flex items-center justify-center">
                  3
                </span>
                <span className="absolute inset-0 rounded-full bg-gray-800 -z-10 opacity-0 hover:opacity-100 transition-opacity"></span>
              </button>

              <Button className="bg-[#F7984A] hover:bg-[#F7984A]/90 text-white rounded-full px-5 shadow-lg shadow-[#F7984A]/20 transition-all duration-300 hover:shadow-[#F7984A]/30 hover:translate-y-[-2px]">
                Sign In
              </Button>
            </div>

            <button
              className="lg:hidden flex items-center justify-center w-10 h-10 rounded-md bg-gray-800/70 text-gray-200"
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
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search projects..."
                  className="w-full pl-10 pr-4 py-3 rounded-lg bg-gray-800/70 border border-gray-700/50 text-sm focus:outline-none"
                />
              </div>

              <Button
                className="w-full bg-[#F7984A] hover:bg-[#F7984A]/90 text-white py-6"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sign In
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Navbar
