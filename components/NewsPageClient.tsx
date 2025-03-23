"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  Search,
  CheckCircle,
  ShoppingCart,
  Menu,
  X,
  Headphones,
  Gift,
  Newspaper,
  BarChart3,
  Calendar,
  Clock,
  Tag,
  ExternalLink,
  ChevronLeft,
  ChevronRight
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"
// Import types
import type { NewsArticle, CategoryFilter, TimeFilter } from "@/types/news"
// Import mock data for time filters
import { timeFilters } from "@/lib/mock-data"
import Navbar from "./Navbar"
import { Footer } from "./NewsletterFooter"
interface NewsPageClientProps {
  initialNewsArticles: NewsArticle[]
  initialCategoryFilters: CategoryFilter[]
}
export default function NewsPageClient({ 
  initialNewsArticles,
  initialCategoryFilters 
}: NewsPageClientProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedTimeFrames, setSelectedTimeFrames] = useState<string[]>([])
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [categoryFilterOpen, setCategoryFilterOpen] = useState(true)
  const [timeFilterOpen, setTimeFilterOpen] = useState(true)
  const [newsArticles] = useState<NewsArticle[]>(initialNewsArticles || [])
  const [categoryFilters] = useState<CategoryFilter[]>(initialCategoryFilters || [])
  const [loading, setLoading] = useState(false)
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(9) // 9 items (3x3 grid for desktop)
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])
  
  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, selectedCategories, selectedTimeFrames])
  
  const filteredArticles = newsArticles.filter((article) => {
    const matchesSearch =
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.summary.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory =
      selectedCategories.length === 0 ||
      article.categories.some((category) => selectedCategories.includes(category.toLowerCase()))
    // Enhanced time filtering based on the date field
    const matchesTimeFrame = selectedTimeFrames.length === 0 || (
      (selectedTimeFrames.includes("today") && article.date === "Today") ||
      (selectedTimeFrames.includes("this_week") && (
        article.date === "Today" || 
        article.date === "Yesterday" || 
        article.date.includes("days ago")
      )) ||
      (selectedTimeFrames.includes("this_month") && (
        article.date === "Today" || 
        article.date === "Yesterday" || 
        article.date.includes("days ago") || 
        article.date.includes("week")
      )) ||
      selectedTimeFrames.includes("this_year")
    )
    return matchesSearch && matchesCategory && matchesTimeFrame
  })
  
  // Pagination calculations
  const totalItems = filteredArticles.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  
  // Get current page items
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredArticles.slice(indexOfFirstItem, indexOfLastItem)
  
  // Handle page change
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber)
    // Optionally scroll to top when changing pages
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  
  // Generate array of page numbers to display
  const getPageNumbers = () => {
    const pageNumbers = []
    
    // For small number of pages, show all
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i)
      }
      return pageNumbers
    }
    
    // For many pages, show 1, ..., currentPage-1, currentPage, currentPage+1, ..., totalPages
    pageNumbers.push(1)
    
    if (currentPage > 3) {
      pageNumbers.push(null) // represents ellipsis
    }
    
    // Pages around current page
    const startPage = Math.max(2, currentPage - 1)
    const endPage = Math.min(totalPages - 1, currentPage + 1)
    
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i)
    }
    
    if (currentPage < totalPages - 2) {
      pageNumbers.push(null) // represents ellipsis
    }
    
    if (totalPages > 1) {
      pageNumbers.push(totalPages)
    }
    
    return pageNumbers
  }
  
  return (
    <div className="min-h-screen bg-[#07071C] text-white">
      
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
      <div className="relative z-30">
        <Navbar />
      </div>
      {/* Main Content */}
      <main className="relative pt-32 pb-20 z-20">
        <div className="container mx-auto px-4 md:px-6">
          {/* Header - Fixed: Explicitly setting text color to white */}
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-extrabold mb-6 text-white">
              Blockchain Bay News
            </h1>
            <p className="text-xl text-gray-300">Stay updated with the latest crypto and blockchain news</p>
          </div>
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <div className="lg:w-64 flex-shrink-0 space-y-8">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search news..."
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
                  <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4" />
                    <span>Categories</span>
                  </div>
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
                          className="border-white data-[state=checked]:bg-[#F7984A] data-[state=checked]:border-[#F7984A]"
                        />
                        <span className="flex-1">{category.label}</span>
                        <span className="text-gray-500">{category.count}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Featured Articles */}
              {newsArticles.length > 0 && (
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-[#F7984A]" />
                    Featured Articles
                  </h3>
                  <div className="space-y-4">
                    {newsArticles
                      .filter((article) => article.featured)
                      .slice(0, 2)
                      .map((article) => (
                        <a
                          href={article.link}
                          target="_blank"
                          rel="noopener noreferrer" 
                          key={article.id}
                          className="block bg-[#0D0B26]/80 border border-gray-800/50 rounded-lg p-3 hover:border-gray-700/60 transition-all duration-300"
                        >
                          <div className="aspect-video w-full rounded-md overflow-hidden mb-2">
                            <Image
                              src={article.image || "/placeholder.svg"}
                              alt={article.title}
                              width={300}
                              height={170}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <h4 className="font-medium text-sm line-clamp-2 mb-1">{article.title}</h4>
                          <div className="flex items-center justify-between text-xs text-gray-400">
                            <span>{article.date}</span>
                            <span className="flex items-center">
                              {article.readTime} <ExternalLink className="ml-1 h-3 w-3" />
                            </span>
                          </div>
                        </a>
                      ))}
                  </div>
                </div>
              )}
            </div>
            {/* News Grid */}
            <div className="flex-1">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Latest News</h2>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  {totalItems > 0 && (
                    <span>
                      Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, totalItems)} of {totalItems}
                    </span>
                  )}
                </div>
              </div>
              {loading && (
                <div className="flex justify-center py-16">
                  <div className="w-12 h-12 rounded-full border-4 border-gray-700 border-t-[#F7984A] animate-spin"></div>
                </div>
              )}
              {!loading && currentItems.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {currentItems.map((article) => (
                    <a 
                      href={article.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      key={article.id}
                      className="block group"
                    >
                      <Card
                        className="bg-[#0D0B26]/80 border border-gray-800/50 rounded-xl overflow-hidden hover:border-gray-700/60 transition-all duration-300 group-hover:border-[#F7984A]/30 relative z-20"
                      >
                        <div className="relative aspect-video w-full overflow-hidden">
                          <Image
                            src={article.image || "/placeholder.svg"}
                            alt={article.title}
                            width={600}
                            height={300}
                            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute top-4 left-4 flex gap-2">
                            {article.categories.slice(0, 2).map((category, idx) => (
                              <Badge key={idx} className="bg-[#F7984A] hover:bg-[#F7984A]/90">
                                {category}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="p-6">
                          <h3 className="font-bold text-white text-xl mb-3 group-hover:text-[#F7984A] transition-colors line-clamp-2">
                            {article.title}
                          </h3>
                          <p className="text-gray-300 text-sm mb-4 line-clamp-3">{article.summary}</p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-sm text-gray-400">
                              <Clock className="h-4 w-4" />
                              <span>{article.readTime}</span>
                            </div>
                            <div className="flex items-center text-sm text-gray-400">
                              <span>{article.date}</span>
                              <ExternalLink className="ml-1.5 h-3 w-3 opacity-70 group-hover:opacity-100" />
                            </div>
                          </div>
                        </div>
                      </Card>
                    </a>
                  ))}
                </div>
              ) : !loading && (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-16 h-16 bg-gray-800/50 rounded-full flex items-center justify-center mb-4">
                    <Search className="w-8 h-8 text-gray-500" />
                  </div>
                  <h3 className="text-xl font-medium mb-2">No articles found</h3>
                  <p className="text-gray-400 max-w-md">
                    We couldn't find any articles matching your search criteria. Try adjusting your filters or search
                    term.
                  </p>
                </div>
              )}
              
              {/* Pagination - Now with actual functionality */}
              {!loading && filteredArticles.length > 0 && (
                <div className="flex justify-center mt-12 relative z-20">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="bg-gray-800/50 text-gray-400 hover:bg-gray-800 hover:text-white rounded px-4"
                      disabled={currentPage === 1}
                      onClick={() => handlePageChange(currentPage - 1)}
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" />
                      Previous
                    </Button>
                    
                    {getPageNumbers().map((number, index) => (
                      number === null ? (
                        <span key={`ellipsis-${index}`} className="text-gray-400">...</span>
                      ) : (
                        <Button
                          key={`page-${number}`}
                          variant="ghost"
                          size="sm"
                          className={cn(
                            "rounded-md w-8 h-8 p-0",
                            currentPage === number
                              ? "bg-[#F7984A]/90 text-white hover:bg-[#F7984A]"
                              : "bg-gray-800/50 text-white hover:bg-gray-800"
                          )}
                          onClick={() => handlePageChange(number as number)}
                        >
                          {number}
                        </Button>
                      )
                    ))}
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      className="bg-gray-800/50 text-gray-400 hover:bg-gray-800 hover:text-white rounded px-4"
                      disabled={currentPage === totalPages || totalPages === 0}
                      onClick={() => handlePageChange(currentPage + 1)}
                    >
                      Next
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  )
}