"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useParams, useRouter } from "next/navigation"
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
  ChevronRight,
  Minus,
  Plus,
  Heart,
  Share2,
  Check,
  Star,
  Truck,
  Shield,
  RefreshCw,
  Info,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

// Types
type Product = {
  id: string
  name: string
  description: string
  price: number
  originalPrice?: number
  image: string
  images?: string[]
  category: string
  tags: string[]
  rating: number
  reviewCount: number
  inStock: boolean
  featured?: boolean
  new?: boolean
  sale?: boolean
  details?: {
    dimensions?: string
    weight?: string
    materials?: string
    compatibility?: string[]
    connectivity?: string[]
    batteryLife?: string
    warranty?: string
  }
  specs?: Record<string, string>
  features?: string[]
}

// Mock data
const products: Product[] = [
  {
    id: "ledger-nano-x",
    name: "Ledger Nano X",
    description:
      "Bluetooth-enabled hardware wallet for secure crypto storage. The Ledger Nano X is a cryptocurrency hardware wallet that lets you securely manage your assets. It connects to any computer via USB and to smartphones via Bluetooth, and it embeds a secure chip.",
    price: 149.0,
    image: "https://images.unsplash.com/photo-1622630998477-20aa696ecb05?q=80&w=2070&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1622630998477-20aa696ecb05?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1642427749670-f20e2e76ed8c?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1639762681085-4cf7efcc9ec6?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1642427749670-f20e2e76ed8c?q=80&w=2070&auto=format&fit=crop",
    ],
    category: "Hardware Wallets",
    tags: ["security", "storage", "bluetooth"],
    rating: 4.8,
    reviewCount: 1243,
    inStock: true,
    featured: true,
    details: {
      dimensions: "72mm × 18.6mm × 11.75mm",
      weight: "34g",
      materials: "Brushed stainless steel and plastic",
      compatibility: ["Windows 8+", "macOS 10.10+", "Linux", "Android 7+", "iOS 9+"],
      connectivity: ["USB-C", "Bluetooth 5.0"],
      batteryLife: "Up to 8 hours in Bluetooth mode",
      warranty: "2 years",
    },
    specs: {
      "Secure Element": "ST33J2M0 (CC EAL6+)",
      Connectivity: "USB-C, Bluetooth 5.0",
      Screen: "128×64 px",
      Battery: "100 mAh",
      "Supported Cryptocurrencies": "5,500+",
      "Companion App": "Ledger Live",
    },
    features: [
      "Bluetooth connectivity for mobile management",
      "Supports 5,500+ cryptocurrencies and tokens",
      "Certified secure chip (CC EAL6+)",
      "Backup and restoration via 24-word recovery phrase",
      "Manage up to 100 applications simultaneously",
      "Compatible with Windows, macOS, Linux, Android, and iOS",
    ],
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

// Reviews data
const reviews = [
  {
    id: 1,
    productId: "ledger-nano-x",
    author: "Alex Thompson",
    rating: 5,
    date: "2023-11-15",
    title: "Best hardware wallet on the market",
    content:
      "I've tried several hardware wallets and the Ledger Nano X is by far the best. The Bluetooth functionality makes it so convenient to use with my phone. Setup was straightforward and the Ledger Live app is intuitive. Highly recommend for anyone serious about crypto security.",
    verified: true,
  },
  {
    id: 2,
    productId: "ledger-nano-x",
    author: "Sarah Chen",
    rating: 4,
    date: "2023-10-22",
    title: "Great security, minor software issues",
    content:
      "The hardware itself is excellent - solid build quality and easy to use. The Bluetooth connection works well with my iPhone. Only giving 4 stars because the Ledger Live software occasionally has sync issues, but overall it's a great product for securing your crypto.",
    verified: true,
  },
  {
    id: 3,
    productId: "ledger-nano-x",
    author: "Michael Rodriguez",
    rating: 5,
    date: "2023-09-30",
    title: "Worth every penny",
    content:
      "After my friend lost crypto on an exchange, I decided to invest in proper security. The Nano X gives me peace of mind knowing my private keys are secure. The device is compact, well-built, and the screen is clear. Battery life is excellent too.",
    verified: true,
  },
  {
    id: 4,
    productId: "ledger-nano-x",
    author: "Jessica Kim",
    rating: 4,
    date: "2023-08-17",
    title: "Solid wallet with good app integration",
    content:
      "The Nano X is easy to set up and use. I appreciate the security features and the ability to manage multiple cryptocurrencies. The only downside is that some newer coins require installing separate apps, and you can only fit so many on the device at once.",
    verified: true,
  },
  {
    id: 5,
    productId: "ledger-nano-x",
    author: "David Wilson",
    rating: 5,
    date: "2023-07-05",
    title: "Finally sleeping well at night",
    content:
      "After the recent exchange hacks, I moved all my crypto to my new Ledger Nano X. The setup process was simple, and I love being able to verify transactions on the device screen. The build quality is excellent, and it supports all the coins I own.",
    verified: true,
  },
]

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [product, setProduct] = useState<Product | null>(null)
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  const [scrolled, setScrolled] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const [productReviews, setProductReviews] = useState<typeof reviews>([])

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    // Find the product by ID
    const id = params.id as string
    const foundProduct = products.find((p) => p.id === id)

    if (foundProduct) {
      setProduct(foundProduct)
      setSelectedImage(0)

      // Find related products (same category, excluding current)
      const related = products.filter((p) => p.id !== id && p.category === foundProduct.category).slice(0, 4)

      setRelatedProducts(related)

      // Get product reviews
      const productReviews = reviews.filter((r) => r.productId === id)
      setProductReviews(productReviews)
    } else {
      // Product not found, redirect to store page
      router.push("/store")
    }
  }, [params.id, router])

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
    document.documentElement.classList.toggle("dark")
  }

  const incrementQuantity = () => {
    if (quantity < 10) {
      setQuantity(quantity + 1)
    }
  }

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1)
    }
  }

  const handleAddToCart = () => {
    // Add to cart logic
    console.log(`Added ${quantity} of ${product?.name} to cart`)
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#07071C] flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="relative w-16 h-16 mb-8">
            <div className="absolute inset-0 bg-gradient-to-tr from-[#F7984A] to-[#F7984A]/80 rounded-lg blur-[4px] animate-pulse"></div>
            <div className="absolute inset-1 bg-[#F7984A] rounded-lg flex items-center justify-center">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L20 7V17L12 22L4 17V7L12 2Z" fill="white" />
              </svg>
            </div>
          </div>
          <div className="flex space-x-2">
            <div className="w-3 h-3 rounded-full bg-[#F7984A] animate-bounce" style={{ animationDelay: "0ms" }}></div>
            <div className="w-3 h-3 rounded-full bg-[#F7984A] animate-bounce" style={{ animationDelay: "150ms" }}></div>
            <div className="w-3 h-3 rounded-full bg-[#F7984A] animate-bounce" style={{ animationDelay: "300ms" }}></div>
          </div>
        </div>
      </div>
    )
  }

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
          {/* Breadcrumbs */}
          <div className="mb-8">
            <nav className="flex items-center text-sm text-gray-400">
              <Link href="/" className="hover:text-white transition-colors">
                Home
              </Link>
              <ChevronRight className="h-4 w-4 mx-2" />
              <Link href="/store" className="hover:text-white transition-colors">
                Store
              </Link>
              <ChevronRight className="h-4 w-4 mx-2" />
              <Link
                href={`/store?category=${product.category.toLowerCase()}`}
                className="hover:text-white transition-colors"
              >
                {product.category}
              </Link>
              <ChevronRight className="h-4 w-4 mx-2" />
              <span className="text-white">{product.name}</span>
            </nav>
          </div>

          {/* Product Details */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            {/* Product Images */}
            <div className="space-y-4">
              <div className="relative aspect-square bg-[#0D0B26]/80 border border-gray-800/50 rounded-xl overflow-hidden">
                <Image
                  src={product.images?.[selectedImage] || product.image}
                  alt={product.name}
                  width={600}
                  height={600}
                  className="object-contain w-full h-full"
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
              </div>

              {/* Thumbnail Images */}
              {product.images && product.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      className={cn(
                        "relative w-20 h-20 rounded-lg overflow-hidden border-2",
                        selectedImage === index ? "border-[#F7984A]" : "border-gray-800/50 hover:border-gray-700",
                      )}
                      onClick={() => setSelectedImage(index)}
                    >
                      <Image
                        src={image || "/placeholder.svg"}
                        alt={`${product.name} - Image ${index + 1}`}
                        width={80}
                        height={80}
                        className="object-cover w-full h-full"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-[#0D0B26] border border-[#F7984A]/20 text-[#F7984A] hover:bg-[#0D0B26]/80">
                    {product.category}
                  </Badge>
                  {product.inStock ? (
                    <Badge className="bg-green-500/20 text-green-400 hover:bg-green-500/30 border-none">In Stock</Badge>
                  ) : (
                    <Badge className="bg-red-500/20 text-red-400 hover:bg-red-500/30 border-none">Out of Stock</Badge>
                  )}
                </div>
                <h1 className="text-3xl md:text-4xl font-bold mb-2">{product.name}</h1>
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <svg
                        key={i}
                        className={`w-5 h-5 ${i < Math.floor(product.rating) ? "text-yellow-400" : "text-gray-600"}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-sm text-gray-400">
                    {product.rating} ({product.reviewCount} reviews)
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  {product.originalPrice ? (
                    <div className="flex items-center gap-2">
                      <span className="text-3xl font-bold">${product.price.toFixed(2)}</span>
                      <span className="text-xl text-gray-400 line-through">${product.originalPrice.toFixed(2)}</span>
                      <Badge className="bg-red-500 hover:bg-red-600">
                        Save ${(product.originalPrice - product.price).toFixed(2)}
                      </Badge>
                    </div>
                  ) : (
                    <span className="text-3xl font-bold">${product.price.toFixed(2)}</span>
                  )}
                </div>

                <p className="text-gray-300 leading-relaxed">{product.description}</p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="bg-gray-800/50 hover:bg-gray-800 border-gray-700">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Add to Cart */}
              <div className="pt-6 border-t border-gray-800/50">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex items-center">
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-l-md rounded-r-none border-r-0"
                      onClick={decrementQuantity}
                      disabled={quantity <= 1 || !product.inStock}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <div className="h-10 px-4 flex items-center justify-center border-y border-gray-700 bg-gray-800/30 w-12">
                      {quantity}
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-r-md rounded-l-none border-l-0"
                      onClick={incrementQuantity}
                      disabled={quantity >= 10 || !product.inStock}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  <Button
                    className="flex-1 bg-[#F7984A] hover:bg-[#F7984A]/90 text-white"
                    disabled={!product.inStock}
                    onClick={handleAddToCart}
                  >
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    {product.inStock ? "Add to Cart" : "Out of Stock"}
                  </Button>

                  <Button variant="outline" size="icon">
                    <Heart className="h-5 w-5" />
                  </Button>

                  <Button variant="outline" size="icon">
                    <Share2 className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              {/* Shipping & Returns */}
              <div className="pt-6 border-t border-gray-800/50 space-y-4">
                <div className="flex items-start gap-3">
                  <Truck className="h-5 w-5 text-[#F7984A] mt-0.5" />
                  <div>
                    <h3 className="font-medium">Free Shipping</h3>
                    <p className="text-sm text-gray-400">Free standard shipping on orders over $75</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-[#F7984A] mt-0.5" />
                  <div>
                    <h3 className="font-medium">Secure Payments</h3>
                    <p className="text-sm text-gray-400">All transactions are secure and encrypted</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <RefreshCw className="h-5 w-5 text-[#F7984A] mt-0.5" />
                  <div>
                    <h3 className="font-medium">Easy Returns</h3>
                    <p className="text-sm text-gray-400">30-day money back guarantee</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Product Tabs */}
          <div className="mb-16">
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="bg-[#0D0B26]/80 border border-gray-800/50 rounded-lg p-1 w-full flex flex-wrap">
                <TabsTrigger
                  value="details"
                  className="flex-1 data-[state=active]:bg-[#F7984A] data-[state=active]:text-white"
                >
                  Details
                </TabsTrigger>
                <TabsTrigger
                  value="specs"
                  className="flex-1 data-[state=active]:bg-[#F7984A] data-[state=active]:text-white"
                >
                  Specifications
                </TabsTrigger>
                <TabsTrigger
                  value="reviews"
                  className="flex-1 data-[state=active]:bg-[#F7984A] data-[state=active]:text-white"
                >
                  Reviews ({productReviews.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="mt-6 bg-[#0D0B26]/80 border border-gray-800/50 rounded-xl p-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold mb-4">Product Description</h3>
                    <p className="text-gray-300 leading-relaxed">{product.description}</p>
                  </div>

                  {product.features && (
                    <div>
                      <h3 className="text-xl font-bold mb-4">Key Features</h3>
                      <ul className="space-y-2">
                        {product.features.map((feature, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <Check className="h-5 w-5 text-[#F7984A] mt-0.5 shrink-0" />
                            <span className="text-gray-300">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {product.details && (
                    <div>
                      <h3 className="text-xl font-bold mb-4">Product Details</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {product.details.dimensions && (
                          <div className="flex items-start gap-2">
                            <span className="text-gray-400 min-w-[120px]">Dimensions:</span>
                            <span className="text-white">{product.details.dimensions}</span>
                          </div>
                        )}
                        {product.details.weight && (
                          <div className="flex items-start gap-2">
                            <span className="text-gray-400 min-w-[120px]">Weight:</span>
                            <span className="text-white">{product.details.weight}</span>
                          </div>
                        )}
                        {product.details.materials && (
                          <div className="flex items-start gap-2">
                            <span className="text-gray-400 min-w-[120px]">Materials:</span>
                            <span className="text-white">{product.details.materials}</span>
                          </div>
                        )}
                        {product.details.batteryLife && (
                          <div className="flex items-start gap-2">
                            <span className="text-gray-400 min-w-[120px]">Battery Life:</span>
                            <span className="text-white">{product.details.batteryLife}</span>
                          </div>
                        )}
                        {product.details.warranty && (
                          <div className="flex items-start gap-2">
                            <span className="text-gray-400 min-w-[120px]">Warranty:</span>
                            <span className="text-white">{product.details.warranty}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {product.details?.compatibility && (
                    <div>
                      <h3 className="text-xl font-bold mb-4">Compatibility</h3>
                      <div className="flex flex-wrap gap-2">
                        {product.details.compatibility.map((item, index) => (
                          <Badge key={index} className="bg-gray-800 hover:bg-gray-700 text-gray-300">
                            {item}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="specs" className="mt-6 bg-[#0D0B26]/80 border border-gray-800/50 rounded-xl p-6">
                {product.specs ? (
                  <div className="space-y-6">
                    <h3 className="text-xl font-bold mb-4">Technical Specifications</h3>
                    <div className="space-y-2">
                      {Object.entries(product.specs).map(([key, value]) => (
                        <div key={key} className="flex py-2 border-b border-gray-800/50 last:border-0">
                          <span className="text-gray-400 w-1/3">{key}</span>
                          <span className="text-white w-2/3">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Info className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                    <h3 className="text-xl font-medium mb-2">No specifications available</h3>
                    <p className="text-gray-400">
                      Detailed specifications for this product are not available at this time.
                    </p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="reviews" className="mt-6 bg-[#0D0B26]/80 border border-gray-800/50 rounded-xl p-6">
                <div className="space-y-6">
                  <div className="flex flex-col md:flex-row gap-8">
                    <div className="md:w-1/3 space-y-4">
                      <div className="text-center">
                        <div className="text-5xl font-bold">{product.rating}</div>
                        <div className="flex justify-center my-2">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-5 h-5 ${i < Math.floor(product.rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-600"}`}
                            />
                          ))}
                        </div>
                        <div className="text-sm text-gray-400">Based on {product.reviewCount} reviews</div>
                      </div>

                      <div className="space-y-2">
                        {[5, 4, 3, 2, 1].map((star) => {
                          const count = productReviews.filter((r) => r.rating === star).length
                          const percentage = productReviews.length > 0 ? (count / productReviews.length) * 100 : 0
                          return (
                            <div key={star} className="flex items-center gap-2">
                              <div className="flex items-center gap-1 w-12">
                                <span>{star}</span>
                                <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                              </div>
                              <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-yellow-400 rounded-full"
                                  style={{ width: `${percentage}%` }}
                                ></div>
                              </div>
                              <div className="w-12 text-right text-sm text-gray-400">{count}</div>
                            </div>
                          )
                        })}
                      </div>

                      <Button className="w-full bg-[#F7984A] hover:bg-[#F7984A]/90 text-white">Write a Review</Button>
                    </div>

                    <div className="md:w-2/3">
                      <h3 className="text-xl font-bold mb-4">Customer Reviews</h3>
                      {productReviews.length > 0 ? (
                        <div className="space-y-6">
                          {productReviews.map((review) => (
                            <div key={review.id} className="border-b border-gray-800/50 last:border-0 pb-6 last:pb-0">
                              <div className="flex justify-between items-start mb-2">
                                <div>
                                  <h4 className="font-bold">{review.title}</h4>
                                  <div className="flex items-center gap-2 mt-1">
                                    <div className="flex">
                                      {Array.from({ length: 5 }).map((_, i) => (
                                        <Star
                                          key={i}
                                          className={`w-4 h-4 ${i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-600"}`}
                                        />
                                      ))}
                                    </div>
                                    {review.verified && (
                                      <Badge className="bg-green-500/20 text-green-400 hover:bg-green-500/30 border-none text-xs">
                                        Verified Purchase
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                                <div className="text-sm text-gray-400">{review.date}</div>
                              </div>
                              <div className="text-sm text-gray-300 mb-2">{review.author}</div>
                              <p className="text-gray-300">{review.content}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <p className="text-gray-400">No reviews yet. Be the first to review this product!</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="mb-16">
              <h2 className="text-2xl font-bold mb-8">Related Products</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map((relatedProduct) => (
                  <Link key={relatedProduct.id} href={`/store/${relatedProduct.id}`}>
                    <Card className="bg-[#0D0B26]/80 border border-gray-800/50 rounded-xl overflow-hidden hover:border-gray-700/60 transition-all duration-300 group h-full flex flex-col">
                      <div className="relative aspect-square w-full overflow-hidden bg-gray-900">
                        <Image
                          src={relatedProduct.image || "/placeholder.svg"}
                          alt={relatedProduct.name}
                          width={300}
                          height={300}
                          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                        />
                        {relatedProduct.sale && (
                          <div className="absolute top-4 left-4">
                            <Badge className="bg-red-500 hover:bg-red-600">Sale</Badge>
                          </div>
                        )}
                        {relatedProduct.new && (
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
                        <div className="text-xs text-gray-400 mb-1">{relatedProduct.category}</div>
                        <h3 className="font-medium text-lg mb-2 group-hover:text-[#F7984A] transition-colors">
                          {relatedProduct.name}
                        </h3>
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <svg
                                key={i}
                                className={`w-4 h-4 ${
                                  i < Math.floor(relatedProduct.rating) ? "text-yellow-400" : "text-gray-600"
                                }`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                          <span className="text-xs text-gray-400">({relatedProduct.reviewCount})</span>
                        </div>
                        <div className="mt-auto flex items-center justify-between">
                          <div>
                            {relatedProduct.originalPrice ? (
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-white">${relatedProduct.price.toFixed(2)}</span>
                                <span className="text-sm text-gray-400 line-through">
                                  ${relatedProduct.originalPrice.toFixed(2)}
                                </span>
                              </div>
                            ) : (
                              <span className="font-bold text-white">${relatedProduct.price.toFixed(2)}</span>
                            )}
                          </div>
                          {!relatedProduct.inStock && <span className="text-xs text-red-400">Out of stock</span>}
                        </div>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          )}
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

