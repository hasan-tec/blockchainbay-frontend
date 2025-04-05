"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { type ProductType, type CategoryType, getStrapiMediaUrl, type RichTextBlock } from "../../lib/storeapi"
import { useCart } from "@/contexts/CartContext"
import { Search, ShoppingCart, Filter, ChevronDown, Grid, List } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { cn } from "@/lib/utils"
import Navbar from "@/components/Navbar"
import { Footer } from "@/components/NewsletterFooter"

type StoreClientProps = {
  products: ProductType[]
  categories: CategoryType[]
  tags: any[]
}

export default function StoreClient({ products, categories, tags }: StoreClientProps) {
  const { addToCart } = useCart()

  // State for filters
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000])
  const [inStockOnly, setInStockOnly] = useState(false)

  // State for UI display options
  const [scrolled, setScrolled] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [categoryFilterOpen, setCategoryFilterOpen] = useState(true)
  const [priceFilterOpen, setPriceFilterOpen] = useState(true)
  const [tagFilterOpen, setTagFilterOpen] = useState(true)
  const [availabilityFilterOpen, setAvailabilityFilterOpen] = useState(true)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [sortOption, setSortOption] = useState("featured")

  const [currentPage, setCurrentPage] = useState(1)
  const [productsPerPage] = useState(9)

  // Helper function to get plain text content from rich text format
  const getRichTextAsPlainText = (richText: RichTextBlock[]): string => {
    if (!richText || !Array.isArray(richText)) return ""

    return richText
      .map((block) => {
        if (!block.children) return ""
        return block.children.map((child: any) => child.text || "").join(" ")
      })
      .join(" ")
  }

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

  // Process categories for display - with null checking
  const categoryFilters = categories
    .filter((category) => category && category.attributes) // Filter out any undefined or null categories
    .map((category) => ({
      id: category.attributes.slug || "",
      label: category.attributes.name || "",
      count: products.filter(
        (product) => product.attributes.category?.data?.attributes?.slug === category.attributes.slug,
      ).length,
    }))

  // Process tags for display - with null checking
  const tagFilters = tags
    .filter((tag) => tag && tag.attributes) // Filter out any undefined or null tags
    .map((tag) => ({
      id: tag.attributes.slug || "",
      label: tag.attributes.name || "",
      count: products.filter((product) =>
        product.attributes.tags?.data?.some((t) => t?.attributes?.slug === tag.attributes.slug),
      ).length,
    }))

  // Define price ranges
  const priceRanges = [
    { id: "under-50", label: "Under $50", min: 0, max: 50 },
    { id: "50-100", label: "$50 - $100", min: 50, max: 100 },
    { id: "100-200", label: "$100 - $200", min: 100, max: 200 },
    { id: "200-500", label: "$200 - $500", min: 200, max: 500 },
    { id: "over-500", label: "Over $500", min: 500, max: 10000 },
  ]

  // Filter products based on selected filters
  const filteredProducts = products.filter((product) => {
    const productData = product.attributes

    // Null check for product data
    if (!productData) return false

    // Search filter
    const matchesSearch =
      productData.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (typeof productData.description === "string"
        ? productData.description.toLowerCase().includes(searchQuery.toLowerCase())
        : Array.isArray(productData.description)
          ? getRichTextAsPlainText(productData.description).toLowerCase().includes(searchQuery.toLowerCase())
          : false)

    // Category filter
    const matchesCategory =
      selectedCategories.length === 0 ||
      (productData.category?.data?.attributes?.slug &&
        selectedCategories.includes(productData.category.data.attributes.slug))

    // Tag filter
    const matchesTags =
      selectedTags.length === 0 ||
      productData.tags?.data?.some((tag) => tag?.attributes?.slug && selectedTags.includes(tag.attributes.slug))

    // Price filter
    const matchesPrice = productData.price >= priceRange[0] && productData.price <= priceRange[1]

    // Availability filter
    const matchesAvailability = inStockOnly ? productData.inStock === true : true

    return matchesSearch && matchesCategory && matchesTags && matchesPrice && matchesAvailability
  })

  // Sort products based on selected sort option
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const aData = a.attributes
    const bData = b.attributes

    // Null check for product data
    if (!aData || !bData) return 0

    switch (sortOption) {
      case "featured":
        return (bData.featured ? 1 : 0) - (aData.featured ? 1 : 0)
      case "newest":
        return (bData.new ? 1 : 0) - (aData.new ? 1 : 0)
      case "price-low":
        return (aData.price || 0) - (bData.price || 0)
      case "price-high":
        return (bData.price || 0) - (aData.price || 0)
      case "best-selling":
        return (bData.reviewCount || 0) - (aData.reviewCount || 0)
      case "top-rated":
        return (bData.rating || 0) - (aData.rating || 0)
      default:
        return 0
    }
  })

  // Get current products for pagination
  const indexOfLastProduct = currentPage * productsPerPage
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage
  const currentProducts = sortedProducts.slice(indexOfFirstProduct, indexOfLastProduct)

  // Calculate total pages
  const totalPages = Math.ceil(sortedProducts.length / productsPerPage)

  // Handle price range change
  const handlePriceRangeChange = (value: number[]) => {
    setPriceRange([value[0], value[1]])
  }

  // Reset all filters
  const resetFilters = () => {
    setSearchQuery("")
    setSelectedCategories([])
    setSelectedTags([])
    setPriceRange([0, 5000])
    setInStockOnly(false)
  }

  // Quick add to cart handler
  const handleQuickAddToCart = (e: React.MouseEvent, product: ProductType) => {
    e.preventDefault()
    e.stopPropagation()
    addToCart(product, 1)
    // Here you could add a toast notification
  }

  // In your StoreClient component
  useEffect(() => {
    console.log("Products received in component:", products)
    console.log("Categories received in component:", categories)
    console.log("Tags received in component:", tags)
  }, [products, categories, tags])

  return (
    <div className={cn("min-h-screen bg-[#07071C] text-white", isDarkMode ? "dark" : "")}>
      {/* Enhanced Background elements with more visible gradients and grid */}
      <div className="fixed inset-0 bg-[#07071C] overflow-hidden z-10">
        {/* Main gradient orbs - more visible now */}
        <div className="absolute top-[5%] left-[10%] w-[40rem] h-[40rem] rounded-full bg-gradient-to-r from-[#F7984A]/30 to-transparent opacity-50 blur-[100px]"></div>
        <div className="absolute bottom-[10%] right-[10%] w-[35rem] h-[35rem] rounded-full bg-gradient-to-l from-[#F7984A]/30 to-transparent opacity-50 blur-[100px]"></div>
        <div className="absolute top-[40%] right-[15%] w-[30rem] h-[30rem] rounded-full bg-gradient-to-t from-blue-500/20 to-transparent opacity-40 blur-[100px]"></div>
        {/* Grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] opacity-70"></div>
        {/* Keep the original texture overlay */}
        <div className="absolute inset-0 bg-[url('/placeholder.svg?height=100&width=100')] bg-repeat opacity-[0.015]"></div>
      </div>

      
        <Navbar />
   

      {/* Main Content */}
      <main className="pt-32 pb-20 relative z-20">
        <div className="container mx-auto px-4 md:px-6">
          {/* Header */}
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h1 className="text-5xl md:text-6xl pb-3 font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-white/70">
              Blockchain Bay Store
            </h1>
            <p className="text-xl text-gray-300">
              Exclusive crypto merchandise, hardware wallets, and accessories for enthusiasts
            </p>
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

                {/* Tags Filter */}
                <div className="space-y-4 bg-gray-800/20 p-4 rounded-lg border border-gray-800/50">
                  <button
                    className="flex items-center justify-between w-full font-semibold text-lg"
                    onClick={() => setTagFilterOpen(!tagFilterOpen)}
                  >
                    <span>Tags</span>
                    <span className="text-gray-400">{tagFilterOpen ? "−" : "+"}</span>
                  </button>
                  {tagFilterOpen && (
                    <div className="space-y-3 pt-2">
                      {tagFilters.map((tag) => (
                        <label key={tag.id} className="flex items-center space-x-3 text-sm">
                          <Checkbox
                            checked={selectedTags.includes(tag.id)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedTags([...selectedTags, tag.id])
                              } else {
                                setSelectedTags(selectedTags.filter((id) => id !== tag.id))
                              }
                            }}
                          />
                          <span className="flex-1">{tag.label}</span>
                          <span className="text-gray-500">{tag.count}</span>
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
                <Button variant="outline" className="w-full bg-black" onClick={resetFilters}>
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

              {currentProducts.length > 0 ? (
                <div
                  className={cn(
                    viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-6",
                  )}
                >
                  {currentProducts.map((product) => {
                    // Check if product and its attributes exist
                    if (!product || !product.attributes || !product.attributes.mainImage?.data) {
                      return null
                    }

                    return (
                      <Link key={product.id} href={`/store/${product.attributes.slug}`}>
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
                              src={
                                getStrapiMediaUrl(product.attributes.mainImage.data.attributes.url) ||
                                "/placeholder.svg" ||
                                "/placeholder.svg"
                              }
                              alt={product.attributes.name || "Product image"}
                              width={400}
                              height={400}
                              className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                              priority
                              unoptimized={true}
                              onError={(e) => {
                                console.error("Image failed to load:", product.attributes.mainImage.data.attributes.url)
                                // @ts-ignore - currentTarget.src exists but TypeScript doesn't know it
                                e.currentTarget.src = "/placeholder.png"
                              }}
                            />

                            {product.attributes.sale && (
                              <div className="absolute top-4 left-4">
                                <Badge className="bg-red-500 hover:bg-red-600">Sale</Badge>
                              </div>
                            )}
                            {product.attributes.new && (
                              <div className="absolute top-4 left-4">
                                <Badge className="bg-blue-500 hover:bg-blue-600">New</Badge>
                              </div>
                            )}
                            <div className="absolute top-4 right-4">
                              <Button
                                size="icon"
                                variant="secondary"
                                className="rounded-full w-8 h-8 bg-gray-800/70 border border-gray-700/50"
                                onClick={(e) => handleQuickAddToCart(e, product)}
                              >
                                <ShoppingCart className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          <div className={cn("p-4 flex-1 flex flex-col", viewMode === "list" ? "w-2/3" : "w-full")}>
                            <div className="text-xs text-gray-400 mb-1">
                              {product.attributes.category?.data?.attributes?.name || "Uncategorized"}
                            </div>
                            <h3 className="font-medium text-lg mb-2 group-hover:text-[#F7984A] transition-colors">
                              {product.attributes.name}
                            </h3>
                            {viewMode === "list" && (
                              <p className="text-sm text-gray-300 mb-4 line-clamp-2">
                                {typeof product.attributes.description === "string"
                                  ? product.attributes.description
                                  : getRichTextAsPlainText(product.attributes.description as RichTextBlock[])}
                              </p>
                            )}
                            <div className="flex items-center gap-2 mb-2">
                              <div className="flex">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <svg
                                    key={i}
                                    className={`w-4 h-4 ${
                                      i < Math.floor(product.attributes.rating || 5)
                                        ? "text-yellow-400"
                                        : "text-gray-600"
                                    }`}
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                  </svg>
                                ))}
                              </div>
                              <span className="text-xs text-gray-400">({product.attributes.reviewCount || 5})</span>
                            </div>
                            <div className="mt-auto flex items-center justify-between">
                              <div>
                                {product.attributes.originalPrice ? (
                                  <div className="flex items-center gap-2">
                                    <span className="font-bold text-white">${product.attributes.price.toFixed(2)}</span>
                                    <span className="text-sm text-gray-400 line-through">
                                      ${product.attributes.originalPrice.toFixed(2)}
                                    </span>
                                  </div>
                                ) : (
                                  <span className="font-bold text-white">${product.attributes.price.toFixed(2)}</span>
                                )}
                              </div>
                              {!product.attributes.inStock && (
                                <span className="text-xs text-red-400">Out of stock</span>
                              )}
                            </div>
                          </div>
                        </Card>
                      </Link>
                    )
                  })}
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
              {sortedProducts.length > 0 && (
                <div className="flex justify-center mt-12">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
                      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>

                    {/* Generate page buttons */}
                    {Array.from({ length: Math.min(totalPages, 5) }).map((_, idx) => {
                      // Logic to show pages around current page
                      let pageNum
                      if (totalPages <= 5) {
                        pageNum = idx + 1
                      } else if (currentPage <= 3) {
                        pageNum = idx + 1
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + idx
                      } else {
                        pageNum = currentPage - 2 + idx
                      }

                      return (
                        <Button
                          key={pageNum}
                          variant="outline"
                          size="sm"
                          className={cn(
                            "border-gray-700 hover:bg-gray-800 hover:text-white",
                            currentPage === pageNum ? "bg-gray-800/50 text-white" : "text-gray-300",
                          )}
                          onClick={() => setCurrentPage(pageNum)}
                        >
                          {pageNum}
                        </Button>
                      )
                    })}

                    {/* Show ellipsis if there are more pages */}
                    {totalPages > 5 && currentPage < totalPages - 2 && <span className="text-gray-500">...</span>}

                    {/* Show last page if not visible in the sequence */}
                    {totalPages > 5 && currentPage < totalPages - 2 && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
                        onClick={() => setCurrentPage(totalPages)}
                      >
                        {totalPages}
                      </Button>
                    )}

                    <Button
                      variant="outline"
                      size="sm"
                      className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
                      onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <div className="relative z-20">
        <Footer />
      </div>
    </div>
  )
}

