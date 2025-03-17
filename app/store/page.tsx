"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  Search,
  ShoppingCart,
  Moon,
  Sun,
  Menu,
  X,
  Headphones,
  Gift,
  Newspaper,
  BarChart3,
  Filter,
  ChevronDown,
  Grid,
  List,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { cn } from "@/lib/utils"

// Types
type Product = {
  id: string
  name: string
  description: string
  price: number
  originalPrice?: number
  image: string
  category: string
  tags: string[]
  rating: number
  reviewCount: number
  inStock: boolean
  featured?: boolean
  new?: boolean
  sale?: boolean
}

// Mock data
const products: Product[] = [
  {
    id: "ledger-nano-x",
    name: "Ledger Nano X",
    description: "Bluetooth-enabled hardware wallet for secure crypto storage",
    price: 149.0,
    image: "https://images.unsplash.com/photo-1622630998477-20aa696ecb05?q=80&w=2070&auto=format&fit=crop",
    category: "Hardware Wallets",
    tags: ["security", "storage", "bluetooth"],
    rating: 4.8,
    reviewCount: 1243,
    inStock: true,
    featured: true,
  },
  {
    id: "trezor-model-t",
    name: "Trezor Model T",
    description: "Premium hardware wallet with touchscreen interface",
    price: 199.0,
    image: "https://images.unsplash.com/photo-1559583109-3e7968736000?q=80&w=2070&auto=format&fit=crop",
    category: "Hardware Wallets",
    tags: ["security", "storage", "touchscreen"],
    rating: 4.7,
    reviewCount: 892,
    inStock: true,
  },
  {
    id: "bitcoin-hoodie",
    name: "Bitcoin Hoodie",
    description: "Premium cotton hoodie with embroidered Bitcoin logo",
    price: 59.99,
    originalPrice: 79.99,
    image: "https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=2070&auto=format&fit=crop",
    category: "Apparel",
    tags: ["clothing", "bitcoin", "hoodie"],
    rating: 4.5,
    reviewCount: 328,
    inStock: true,
    sale: true,
  },
  {
    id: "ethereum-t-shirt",
    name: "Ethereum T-Shirt",
    description: "Soft cotton t-shirt with Ethereum logo print",
    price: 29.99,
    image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=2070&auto=format&fit=crop",
    category: "Apparel",
    tags: ["clothing", "ethereum", "t-shirt"],
    rating: 4.3,
    reviewCount: 215,
    inStock: true,
  },
  {
    id: "crypto-portfolio-tracker",
    name: "Crypto Portfolio Tracker",
    description: "Digital portfolio tracker with real-time price updates",
    price: 29.99,
    image: "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?q=80&w=2070&auto=format&fit=crop",
    category: "Software",
    tags: ["tracking", "portfolio", "digital"],
    rating: 4.2,
    reviewCount: 156,
    inStock: true,
  },
  {
    id: "blockchain-developer-course",
    name: "Blockchain Developer Course",
    description: "Comprehensive online course for blockchain development",
    price: 199.0,
    originalPrice: 299.0,
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop",
    category: "Education",
    tags: ["course", "development", "blockchain"],
    rating: 4.9,
    reviewCount: 512,
    inStock: true,
    sale: true,
  },
  {
    id: "ethereum-desk-lamp",
    name: "Ethereum Desk Lamp",
    description: "LED desk lamp in the shape of the Ethereum logo",
    price: 79.99,
    image: "https://images.unsplash.com/photo-1535957998253-26ae1ef29506?q=80&w=2036&auto=format&fit=crop",
    category: "Home",
    tags: ["lighting", "ethereum", "decoration"],
    rating: 4.0,
    reviewCount: 87,
    inStock: true,
  },
  {
    id: "crypto-hardware-wallet-case",
    name: "Hardware Wallet Case",
    description: "Protective case for hardware wallets with RFID blocking",
    price: 24.99,
    image: "https://images.unsplash.com/photo-1618044733300-9472054094ee?q=80&w=2071&auto=format&fit=crop",
    category: "Accessories",
    tags: ["security", "storage", "protection"],
    rating: 4.6,
    reviewCount: 143,
    inStock: true,
  },
  {
    id: "bitcoin-mining-rig",
    name: "Bitcoin Mining Rig",
    description: "Complete Bitcoin mining rig setup with cooling system",
    price: 3499.0,
    image: "https://images.unsplash.com/photo-1516245834210-c4c142787335?q=80&w=2069&auto=format&fit=crop",
    category: "Mining",
    tags: ["mining", "bitcoin", "hardware"],
    rating: 4.4,
    reviewCount: 62,
    inStock: false,
    featured: true,
  },
  {
    id: "crypto-trading-journal",
    name: "Crypto Trading Journal",
    description: "Premium notebook for tracking your crypto trades",
    price: 34.99,
    image: "https://images.unsplash.com/photo-1517971129774-8a2b38fa128e?q=80&w=2134&auto=format&fit=crop",
    category: "Accessories",
    tags: ["trading", "journal", "notebook"],
    rating: 4.1,
    reviewCount: 98,
    inStock: true,
  },
  {
    id: "nft-art-frame",
    name: "NFT Digital Art Frame",
    description: "Digital frame for displaying your NFT collection",
    price: 249.0,
    image: "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?q=80&w=2070&auto=format&fit=crop",
    category: "NFT",
    tags: ["nft", "display", "digital"],
    rating: 4.7,
    reviewCount: 76,
    inStock: true,
    new: true,
  },
  {
    id: "crypto-cold-storage",
    name: "Crypto Cold Storage",
    description: "Metal plate for engraving your recovery phrases",
    price: 89.99,
    image: "https://images.unsplash.com/photo-1621155346337-1d19476ba7d6?q=80&w=2070&auto=format&fit=crop",
    category: "Security",
    tags: ["security", "storage", "metal"],
    rating: 4.9,
    reviewCount: 203,
    inStock: true,
    featured: true,
  },
]

const categoryFilters = [
  { id: "hardware-wallets", label: "Hardware Wallets", count: 2 },
  { id: "apparel", label: "Apparel", count: 2 },
  { id: "software", label: "Software", count: 1 },
  { id: "education", label: "Education", count: 1 },
  { id: "home", label: "Home", count: 1 },
  { id: "accessories", label: "Accessories", count: 2 },
  { id: "mining", label: "Mining", count: 1 },
  { id: "nft", label: "NFT", count: 1 },
  { id: "security", label: "Security", count: 1 },
]

const priceRanges = [
  { id: "under-50", label: "Under $50", min: 0, max: 50 },
  { id: "50-100", label: "$50 - $100", min: 50, max: 100 },
  { id: "100-200", label: "$100 - $200", min: 100, max: 200 },
  { id: "200-500", label: "$200 - $500", min: 200, max: 500 },
  { id: "over-500", label: "Over $500", min: 500, max: 10000 },
]

export default function StorePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000])
  const [scrolled, setScrolled] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [categoryFilterOpen, setCategoryFilterOpen] = useState(true)
  const [priceFilterOpen, setPriceFilterOpen] = useState(true)
  const [availabilityFilterOpen, setAvailabilityFilterOpen] = useState(true)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [sortOption, setSortOption] = useState("featured")
  const [inStockOnly, setInStockOnly] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
    document.documentElement.classList.toggle("dark")
  }

  const handlePriceRangeChange = (value: number[]) => {
    setPriceRange([value[0], value[1]])
  }

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory =
      selectedCategories.length === 0 || selectedCategories.includes(product.category.toLowerCase())

    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1]

    const matchesAvailability = inStockOnly ? product.inStock : true

    return matchesSearch && matchesCategory && matchesPrice && matchesAvailability
  })

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortOption) {
      case "featured":
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0)
      case "newest":
        return (b.new ? 1 : 0) - (a.new ? 1 : 0)
      case "price-low":
        return a.price - b.price
      case "price-high":
        return b.price - a.price
      case "best-selling":
        return b.reviewCount - a.reviewCount
      case "top-rated":
        return b.rating - a.rating
      default:
        return 0
    }
  })

  return (
    <div className={cn("min-h-screen bg-[#07071C] text-white", isDarkMode ? "dark" : "")}>
      {/* Background elements */}
      <div className="fixed inset-0 bg-[#07071C] overflow-hidden -z-10">
        <div className="absolute top-0 left-0 w-full h-full opacity-30">
          <div className="absolute top-[10%] left-[5%] w-[30rem] h-[30rem] rounded-full bg-[#F7984A]/5 blur-[8rem]"></div>
          <div className="absolute bottom-[10%] right-[5%] w-[25rem] h-[25rem] rounded-full bg-[#F7984A]/5 blur-[8rem]"></div>
          <div className="absolute top-[40%] right-[15%] w-[20rem] h-[20rem] rounded-full bg-blue-500/5 blur-[8rem]"></div>
        </div>
        <div className="absolute inset-0 bg-[url('/placeholder.svg?height=100&width=100')] bg-repeat opacity-[0.015]"></div>
      </div>

      {/* Navigation */}
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
            <div className="flex items-center gap-2">
              <Link href="/" className="flex items-center gap-2">
                <div className="relative w-10 h-10">
                  <div className="absolute inset-0 bg-gradient-to-tr from-[#F7984A] to-[#F7984A]/80 rounded-lg blur-[2px]"></div>
                  <div className="absolute inset-0.5 bg-[#F7984A] rounded-lg flex items-center justify-center">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2L20 7V17L12 22L4 17V7L12 2Z" fill="white" />
                    </svg>
                  </div>
                </div>
                <span className="font-bold text-xl tracking-tight">CryptoHub</span>
              </Link>
            </div>

            <div className="hidden lg:flex items-center space-x-1">
              {[
                { name: "Projects", href: "/projects", icon: <BarChart3 className="h-4 w-4 mr-1" /> },
                { name: "News", href: "/news", icon: <Newspaper className="h-4 w-4 mr-1" /> },
                { name: "Podcasts", href: "/podcasts", icon: <Headphones className="h-4 w-4 mr-1" /> },
                { name: "Store", href: "/store", icon: <ShoppingCart className="h-4 w-4 mr-1" /> },
                { name: "Giveaways", href: "#", icon: <Gift className="h-4 w-4 mr-1" /> },
              ].map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "relative px-4 py-2 text-sm font-medium text-gray-200 hover:text-white transition-colors group flex items-center",
                    item.name === "Store" && "text-white",
                  )}
                >
                  {item.icon}
                  {item.name}
                  <span
                    className={cn(
                      "absolute bottom-0 left-1/2 h-0.5 bg-[#F7984A] transition-all duration-300",
                      item.name === "Store" ? "w-1/2 left-1/4" : "w-0 group-hover:w-1/2 group-hover:left-1/4",
                    )}
                  ></span>
                </Link>
              ))}
            </div>

            <div className="hidden lg:flex items-center gap-5">
              <button
                aria-label="Toggle dark mode"
                onClick={toggleDarkMode}
                className="relative w-8 h-8 rounded-full flex items-center justify-center text-gray-300 hover:text-white transition-colors"
              >
                {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                <span className="absolute inset-0 rounded-full bg-gray-800 -z-10 opacity-0 hover:opacity-100 transition-opacity"></span>
              </button>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  className="pl-10 pr-4 py-2 w-48 rounded-full bg-gray-800/70 border border-gray-700/50 text-sm focus:outline-none focus:ring-2 focus:ring-[#F7984A]/50 focus:border-[#F7984A]/50 transition-all"
                />
              </div>

              <Link
                href="/cart"
                aria-label="Cart"
                className="relative w-8 h-8 rounded-full flex items-center justify-center text-gray-300 hover:text-white transition-colors"
              >
                <ShoppingCart className="h-5 w-5" />
                <span className="absolute top-0 right-0 w-4 h-4 rounded-full bg-[#F7984A] text-[10px] flex items-center justify-center">
                  3
                </span>
                <span className="absolute inset-0 rounded-full bg-gray-800 -z-10 opacity-0 hover:opacity-100 transition-opacity"></span>
              </Link>

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
            {[
              { name: "Projects", href: "/projects", icon: <BarChart3 className="h-5 w-5 mr-2" /> },
              { name: "News", href: "/news", icon: <Newspaper className="h-5 w-5 mr-2" /> },
              { name: "Podcasts", href: "/podcasts", icon: <Headphones className="h-5 w-5 mr-2" /> },
              { name: "Store", href: "/store", icon: <ShoppingCart className="h-5 w-5 mr-2" /> },
              { name: "Giveaways", href: "#", icon: <Gift className="h-5 w-5 mr-2" /> },
            ].map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center py-3 text-lg font-medium text-gray-200 hover:text-white border-b border-gray-800",
                  item.name === "Store" && "text-white",
                )}
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
                  placeholder="Search products..."
                  className="w-full pl-10 pr-4 py-3 rounded-lg bg-gray-800/70 border border-gray-700/50 text-sm focus:outline-none"
                />
              </div>

              <Button
                className="w-full bg-[#F7984A] hover:bg-[#F7984A]/90 text-white py-6"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sign In
              </Button>

              <Button
                variant="outline"
                className="w-full border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white py-6"
                onClick={toggleDarkMode}
              >
                {isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4 md:px-6">
          {/* Header */}
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-white/70">
              CryptoHub Store
            </h1>
            <p className="text-xl text-gray-300">
              Exclusive crypto merchandise, hardware wallets, and accessories for enthusiasts
            </p>
          </div>

          {/* Featured Products */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-8">Featured Products</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {products
                .filter((product) => product.featured)
                .map((product) => (
                  <Link key={product.id} href={`/store/${product.id}`}>
                    <Card className="bg-[#0D0B26]/80 border border-gray-800/50 rounded-xl overflow-hidden hover:border-gray-700/60 transition-all duration-300 group h-full flex flex-col">
                      <div className="relative aspect-square w-full overflow-hidden bg-gray-900">
                        <Image
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          width={400}
                          height={400}
                          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                        />
                        {product.sale && (
                          <div className="absolute top-4 left-4">
                            <Badge className="bg-red-500 hover:bg-red-600">Sale</Badge>
                          </div>
                        )}
                        {product.new && (
                          <div className="absolute top-4 left-4">
                            <Badge className="bg-blue-500 hover:bg-blue-600">New</Badge>
                          </div>
                        )}
                        <div className="absolute top-4 right-4">
                          <Button
                            size="icon"
                            variant="secondary"
                            className="rounded-full w-8 h-8 bg-gray-800/70 border border-gray-700/50"
                            onClick={(e) => {
                              e.preventDefault()
                              // Add to cart logic
                            }}
                          >
                            <ShoppingCart className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="p-4 flex-1 flex flex-col">
                        <div className="text-xs text-gray-400 mb-1">{product.category}</div>
                        <h3 className="font-medium text-lg mb-2 group-hover:text-[#F7984A] transition-colors">
                          {product.name}
                        </h3>
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <svg
                                key={i}
                                className={`w-4 h-4 ${
                                  i < Math.floor(product.rating) ? "text-yellow-400" : "text-gray-600"
                                }`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                          <span className="text-xs text-gray-400">({product.reviewCount})</span>
                        </div>
                        <div className="mt-auto flex items-center justify-between">
                          <div>
                            {product.originalPrice ? (
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-white">${product.price.toFixed(2)}</span>
                                <span className="text-sm text-gray-400 line-through">
                                  ${product.originalPrice.toFixed(2)}
                                </span>
                              </div>
                            ) : (
                              <span className="font-bold text-white">${product.price.toFixed(2)}</span>
                            )}
                          </div>
                          {!product.inStock && <span className="text-xs text-red-400">Out of stock</span>}
                        </div>
                      </div>
                    </Card>
                  </Link>
                ))}
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <div className="lg:w-64 flex-shrink-0 space-y-8">
              <div className="lg:hidden">
                <Button
                  onClick={() => setFiltersOpen(!filtersOpen)}
                  variant="outline"
                  className="w-full flex items-center justify-between"
                >
                  <span className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    Filters
                  </span>
                  <ChevronDown className={cn("h-4 w-4 transition-transform", filtersOpen ? "rotate-180" : "")} />
                </Button>
              </div>

              <div className={cn("space-y-8", filtersOpen ? "block" : "hidden lg:block")}>
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-gray-800/70 border border-gray-700/50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#F7984A]/50 focus:border-[#F7984A]/50 transition-all"
                  />
                </div>

                {/* Categories Filter */}
                <div className="space-y-4 bg-gray-800/20 p-4 rounded-lg border border-gray-800/50">
                  <button
                    className="flex items-center justify-between w-full font-semibold text-lg"
                    onClick={() => setCategoryFilterOpen(!categoryFilterOpen)}
                  >
                    <span>Categories</span>
                    <span className="text-gray-400">{categoryFilterOpen ? "−" : "+"}</span>
                  </button>
                  {categoryFilterOpen && (
                    <div className="space-y-3 pt-2">
                      {categoryFilters.map((category) => (
                        <label key={category.id} className="flex items-center space-x-3 text-sm">
                          <Checkbox
                            checked={selectedCategories.includes(category.id)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedCategories([...selectedCategories, category.id])
                              } else {
                                setSelectedCategories(selectedCategories.filter((id) => id !== category.id))
                              }
                            }}
                          />
                          <span className="flex-1">{category.label}</span>
                          <span className="text-gray-500">{category.count}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                {/* Price Filter */}
                <div className="space-y-4 bg-gray-800/20 p-4 rounded-lg border border-gray-800/50">
                  <button
                    className="flex items-center justify-between w-full font-semibold text-lg"
                    onClick={() => setPriceFilterOpen(!priceFilterOpen)}
                  >
                    <span>Price Range</span>
                    <span className="text-gray-400">{priceFilterOpen ? "−" : "+"}</span>
                  </button>
                  {priceFilterOpen && (
                    <div className="space-y-6 pt-2">
                      <div className="space-y-3">
                        {priceRanges.map((range) => (
                          <label key={range.id} className="flex items-center space-x-3 text-sm">
                            <Checkbox
                              checked={priceRange[0] === range.min && priceRange[1] === range.max}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setPriceRange([range.min, range.max])
                                }
                              }}
                            />
                            <span>{range.label}</span>
                          </label>
                        ))}
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm text-gray-400">
                          <span>${priceRange[0]}</span>
                          <span>${priceRange[1] === 10000 ? "5000+" : priceRange[1]}</span>
                        </div>
                        <Slider
                          value={[priceRange[0], priceRange[1]]}
                          min={0}
                          max={5000}
                          step={10}
                          onValueChange={handlePriceRangeChange}
                          className="w-full"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Availability Filter */}
                <div className="space-y-4 bg-gray-800/20 p-4 rounded-lg border border-gray-800/50">
                  <button
                    className="flex items-center justify-between w-full font-semibold text-lg"
                    onClick={() => setAvailabilityFilterOpen(!availabilityFilterOpen)}
                  >
                    <span>Availability</span>
                    <span className="text-gray-400">{availabilityFilterOpen ? "−" : "+"}</span>
                  </button>
                  {availabilityFilterOpen && (
                    <div className="space-y-3 pt-2">
                      <label className="flex items-center space-x-3 text-sm">
                        <Checkbox
                          checked={inStockOnly}
                          onCheckedChange={(checked) => {
                            setInStockOnly(!!checked)
                          }}
                        />
                        <span>In Stock Only</span>
                      </label>
                    </div>
                  )}
                </div>

                {/* Reset Filters */}
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setSearchQuery("")
                    setSelectedCategories([])
                    setPriceRange([0, 5000])
                    setInStockOnly(false)
                  }}
                >
                  Reset Filters
                </Button>
              </div>
            </div>

            {/* Products Grid */}
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                  <h2 className="text-2xl font-bold">All Products</h2>
                  <p className="text-sm text-gray-400">Showing {sortedProducts.length} products</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-400 whitespace-nowrap">Sort by:</span>
                    <select
                      value={sortOption}
                      onChange={(e) => setSortOption(e.target.value)}
                      className="bg-gray-800/70 border border-gray-700/50 rounded-md text-sm py-1 px-2 focus:outline-none focus:ring-2 focus:ring-[#F7984A]/50 focus:border-[#F7984A]/50"
                    >
                      <option value="featured">Featured</option>
                      <option value="newest">Newest</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                      <option value="best-selling">Best Selling</option>
                      <option value="top-rated">Top Rated</option>
                    </select>
                  </div>
                  <div className="hidden sm:flex items-center gap-1 border border-gray-700/50 rounded-md">
                    <button
                      className={cn(
                        "p-1.5 rounded-l-md",
                        viewMode === "grid" ? "bg-gray-800 text-white" : "text-gray-400 hover:text-white",
                      )}
                      onClick={() => setViewMode("grid")}
                    >
                      <Grid className="h-4 w-4" />
                    </button>
                    <button
                      className={cn(
                        "p-1.5 rounded-r-md",
                        viewMode === "list" ? "bg-gray-800 text-white" : "text-gray-400 hover:text-white",
                      )}
                      onClick={() => setViewMode("list")}
                    >
                      <List className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              {sortedProducts.length > 0 ? (
                <div
                  className={cn(
                    viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-6",
                  )}
                >
                  {sortedProducts.map((product) => (
                    <Link key={product.id} href={`/store/${product.id}`}>
                      <Card
                        className={cn(
                          "bg-[#0D0B26]/80 border border-gray-800/50 rounded-xl overflow-hidden hover:border-gray-700/60 transition-all duration-300 group h-full",
                          viewMode === "list" ? "flex flex-row" : "flex flex-col",
                        )}
                      >
                        <div
                          className={cn(
                            "relative overflow-hidden bg-gray-900",
                            viewMode === "list" ? "w-1/3 aspect-square" : "w-full aspect-square",
                          )}
                        >
                          <Image
                            src={product.image || "/placeholder.svg"}
                            alt={product.name}
                            width={400}
                            height={400}
                            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                          />
                          {product.sale && (
                            <div className="absolute top-4 left-4">
                              <Badge className="bg-red-500 hover:bg-red-600">Sale</Badge>
                            </div>
                          )}
                          {product.new && (
                            <div className="absolute top-4 left-4">
                              <Badge className="bg-blue-500 hover:bg-blue-600">New</Badge>
                            </div>
                          )}
                          <div className="absolute top-4 right-4">
                            <Button
                              size="icon"
                              variant="secondary"
                              className="rounded-full w-8 h-8 bg-gray-800/70 border border-gray-700/50"
                              onClick={(e) => {
                                e.preventDefault()
                                // Add to cart logic
                              }}
                            >
                              <ShoppingCart className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <div className={cn("p-4 flex-1 flex flex-col", viewMode === "list" ? "w-2/3" : "w-full")}>
                          <div className="text-xs text-gray-400 mb-1">{product.category}</div>
                          <h3 className="font-medium text-lg mb-2 group-hover:text-[#F7984A] transition-colors">
                            {product.name}
                          </h3>
                          {viewMode === "list" && (
                            <p className="text-sm text-gray-300 mb-4 line-clamp-2">{product.description}</p>
                          )}
                          <div className="flex items-center gap-2 mb-2">
                            <div className="flex">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <svg
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < Math.floor(product.rating) ? "text-yellow-400" : "text-gray-600"
                                  }`}
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              ))}
                            </div>
                            <span className="text-xs text-gray-400">({product.reviewCount})</span>
                          </div>
                          <div className="mt-auto flex items-center justify-between">
                            <div>
                              {product.originalPrice ? (
                                <div className="flex items-center gap-2">
                                  <span className="font-bold text-white">${product.price.toFixed(2)}</span>
                                  <span className="text-sm text-gray-400 line-through">
                                    ${product.originalPrice.toFixed(2)}
                                  </span>
                                </div>
                              ) : (
                                <span className="font-bold text-white">${product.price.toFixed(2)}</span>
                              )}
                            </div>
                            {!product.inStock && <span className="text-xs text-red-400">Out of stock</span>}
                          </div>
                        </div>
                      </Card>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-16 h-16 bg-gray-800/50 rounded-full flex items-center justify-center mb-4">
                    <Search className="w-8 h-8 text-gray-500" />
                  </div>
                  <h3 className="text-xl font-medium mb-2">No products found</h3>
                  <p className="text-gray-400 max-w-md">
                    We couldn't find any products matching your search criteria. Try adjusting your filters or search
                    term.
                  </p>
                </div>
              )}

              {/* Pagination */}
              <div className="flex justify-center mt-12">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
                    disabled
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-gray-700 bg-gray-800/50 text-white hover:bg-gray-700"
                  >
                    1
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
                  >
                    2
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
                  >
                    3
                  </Button>
                  <span className="text-gray-500">...</span>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
                  >
                    8
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
                  >
                    Next
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800/50 pt-20 pb-10">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-10 mb-16">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-6">
                <div className="relative w-10 h-10">
                  <div className="absolute inset-0 bg-gradient-to-tr from-[#F7984A] to-[#F7984A]/80 rounded-lg blur-[2px]"></div>
                  <div className="absolute inset-0.5 bg-[#F7984A] rounded-lg flex items-center justify-center">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2L20 7V17L12 22L4 17V7L12 2Z" fill="white" />
                    </svg>
                  </div>
                </div>
                <span className="font-bold text-xl tracking-tight">CryptoHub</span>
              </div>
              <p className="text-gray-300 mb-6">
                The premier destination for crypto enthusiasts to discover new projects, stay updated with the latest
                news, and connect with the community.
              </p>

              <div className="flex gap-4 mb-8">
                {/* Social Media Icons */}
                <Link
                  href="#"
                  className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
                  aria-label="Twitter"
                >
                  <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path>
                  </svg>
                </Link>
                <Link
                  href="#"
                  className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
                  aria-label="Discord"
                >
                  <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.0371 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0785-.0371c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0368c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"></path>
                  </svg>
                </Link>
              </div>
            </div>

            {/* Footer columns */}
            <div className="space-y-4">
              <h3 className="font-bold text-lg">Products</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/store?category=hardware-wallets"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Hardware Wallets
                  </Link>
                </li>
                <li>
                  <Link href="/store?category=apparel" className="text-gray-400 hover:text-white transition-colors">
                    Apparel
                  </Link>
                </li>
                <li>
                  <Link href="/store?category=accessories" className="text-gray-400 hover:text-white transition-colors">
                    Accessories
                  </Link>
                </li>
                <li>
                  <Link href="/store?category=mining" className="text-gray-400 hover:text-white transition-colors">
                    Mining Equipment
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="font-bold text-lg">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/news" className="text-gray-400 hover:text-white transition-colors">
                    News
                  </Link>
                </li>
                <li>
                  <Link href="/podcasts" className="text-gray-400 hover:text-white transition-colors">
                    Podcasts
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                    Giveaways
                  </Link>
                </li>
                <li>
                  <Link href="/store" className="text-gray-400 hover:text-white transition-colors">
                    Store
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="font-bold text-lg">Company</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800/50 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm">© 2023 CryptoHub. All rights reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <Link href="#" className="text-gray-500 hover:text-white text-sm transition-colors">
                Terms
              </Link>
              <Link href="#" className="text-gray-500 hover:text-white text-sm transition-colors">
                Privacy
              </Link>
              <Link href="#" className="text-gray-500 hover:text-white text-sm transition-colors">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

