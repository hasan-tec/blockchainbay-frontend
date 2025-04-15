"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Search, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"
import Navbar from "@/components/Navbar"
import { Footer } from "@/components/NewsletterFooter"

// Types - Updated to match the actual API response structure
interface LogoFormat {
  name: string
  hash: string
  ext: string
  mime: string
  width: number
  height: number
  size: number
  url: string
}

interface Logo {
  id: number
  documentId: string
  name: string
  alternativeText: string | null
  caption: string | null
  width: number
  height: number
  formats: {
    thumbnail?: LogoFormat
    small?: LogoFormat
    medium?: LogoFormat
    large?: LogoFormat
  } | null
  hash: string
  ext: string
  mime: string
  size: number
  url: string
  previewUrl: string | null
  provider: string
  provider_metadata: any | null
  createdAt: string
  updatedAt: string
  publishedAt: string
}

// Update the CryptoProject interface to include the properly typed TokenType
interface CryptoProject {
  id: number
  documentId: string
  title: string
  Slug: string
  ShortDescription: string
  DetailedDescription: any[]
  descriptionbeforevideo: any[]
  CurrentStatus: string
  Category: string
  SubCategory: string | null
  Subcategory: string | null
  OtherSubCategory: string | null
  TokenType: "Has token" | "Launched" | "No token" | "Unreleased"  // Properly typed TokenType
  Website: string
  Symbol: string
  ChainType: string
  LaunchDate: string | null
  VideoURL: string
  Twitter: string | null
  Telegram: string | null
  Discord: string | null
  createdAt: string
  updatedAt: string
  publishedAt: string
  AnalyticsDuneQueryID: string | null
  dunequeryid2: string | null
  AnalyticsOneHeader: string | null
  AnalyticsTwoHeader: string | null
  Logo?: Logo
}

interface StrapiResponse {
  data: CryptoProject[]
  meta: {
    pagination: {
      page: number
      pageSize: number
      pageCount: number
      total: number
    }
  }
}

interface FilterItem {
  id: string
  label: string
  count?: number
}

// Initial filters without counts (counts will be added dynamically)
const categoryFilters: FilterItem[] = [
  { id: "DePIN", label: "DePIN" },
  { id: "Node", label: "Node" },
  { id: "Due-Diligence", label: "Due-Diligence" },
  { id: "Hardware Wallets", label: "Hardware Wallets" },
  { id: "News, Insights & Data", label: "News, Insights & Data" },
  { id: "Mining Equipment", label: "Mining Equipment" },
  { id: "Seed Phrase Storage", label: "Seed Phrase Storage" },
  { id: "Taxes", label: "Taxes" },
  { id: "Non-Custodial Swap", label: "Non-Custodial Swap" },
  { id: "Everyday Crypto Uses", label: "Everyday Crypto Uses" },
  { id: "Hosting", label: "Hosting" }, // Add this line
]

// Chain type filters
const chainTypeFilters: FilterItem[] = [
  { id: "Algorand", label: "Algorand" },
  { id: "Arbitrum", label: "Arbitrum" },
  { id: "Arweave", label: "Arweave" },
  { id: "Avalanche", label: "Avalanche" },
  { id: "Base", label: "Base" },
  { id: "Bitcoin", label: "Bitcoin" },
  { id: "BSC", label: "BSC" },
  { id: "Cardano", label: "Cardano" },
  { id: "Constellation", label: "Constellation" },
  { id: "Cosmos", label: "Cosmos" },
  { id: "Ethereum", label: "Ethereum" },
  { id: "Filecoin", label: "Filecoin" },
  { id: "IoTeX", label: "IoTeX" },
  { id: "Kadena", label: "Kadena" },
  { id: "Monad", label: "Monad" },
  { id: "Near", label: "Near" },
  { id: "Peaq", label: "Peaq" },
  { id: "Polkadot", label: "Polkadot" },
  { id: "Polygon", label: "Polygon" },
  { id: "Sentinel", label: "Sentinel" },
  { id: "Solana", label: "Solana" },
  { id: "Sui", label: "Sui" },
  { id: "Moonriver", label: "Moonriver" },
  { id: "Dynex", label: "Dynex" },
]

// Subcategory filters
const subCategoryFilters: FilterItem[] = [
  { id: "Compute", label: "Compute" },
  { id: "Storage", label: "Storage" },
  { id: "Wireless", label: "Wireless" },
  { id: "Sensor", label: "Sensor" },
  { id: "AI", label: "AI" },
  { id: "CDN/Network/Bandwidth", label: "CDN/Network/Bandwidth" },
  { id: "Privacy", label: "Privacy" },
  { id: "Energy", label: "Energy" },
  { id: "Mobility", label: "Mobility" },
  { id: "Database", label: "Database" },
]

// Token filters
// 1. Update the token filters definition to include all four options from Strapi
const tokenFilters: FilterItem[] = [
  { id: "Has token", label: "Has token" },
  { id: "Launched", label: "Launched" },
  { id: "No token", label: "No token" },
  { id: "Unreleased", label: "Unreleased" },
]


export default function CryptoDirectoryPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTokenFilters, setSelectedTokenFilters] = useState<string[]>([])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedChainTypes, setSelectedChainTypes] = useState<string[]>([])
  const [selectedSubCategories, setSelectedSubCategories] = useState<string[]>([])

  const [tokenFilterOpen, setTokenFilterOpen] = useState(false)
  const [categoryFilterOpen, setCategoryFilterOpen] = useState(true)
  const [chainTypeFilterOpen, setChainTypeFilterOpen] = useState(true)
  const [subCategoryFilterOpen, setSubCategoryFilterOpen] = useState(false)

  const [projects, setProjects] = useState<CryptoProject[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [scrolled, setScrolled] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Add pagination state variables after the other state declarations (around line 150)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [pageSize, setPageSize] = useState(12)
  const [totalItems, setTotalItems] = useState(0)

  // Add state for the filters with counts
  const [categoryFiltersWithCount, setCategoryFiltersWithCount] = useState<FilterItem[]>(categoryFilters)
  const [chainTypeFiltersWithCount, setChainTypeFiltersWithCount] = useState<FilterItem[]>(chainTypeFilters)
  const [subCategoryFiltersWithCount, setSubCategoryFiltersWithCount] = useState<FilterItem[]>(subCategoryFilters)
  const [tokenFiltersWithCount, setTokenFiltersWithCount] = useState<FilterItem[]>(tokenFilters)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // 1. First, let's create a type for valid token types to ensure type safety
type TokenType = "Has token" | "Launched" | "No token" | "Unreleased";

// 2. Update the calculateFilterCounts function with proper TypeScript support
const calculateFilterCounts = (projects: CryptoProject[]) => {
  const categoryCounts: Record<string, number> = {}
  const chainTypeCounts: Record<string, number> = {}
  const subCategoryCounts: Record<string, number> = {}
  
  // Initialize count for each token type with type safety
  const tokenCounts: Record<TokenType, number> = {
    "Has token": 0,
    "Launched": 0,
    "No token": 0,
    "Unreleased": 0
  }

  projects.forEach((project) => {
    // Count categories
    if (project.Category) {
      categoryCounts[project.Category] = (categoryCounts[project.Category] || 0) + 1
    }

    // Count chain types
    if (project.ChainType) {
      chainTypeCounts[project.ChainType] = (chainTypeCounts[project.ChainType] || 0) + 1
    }

    // Count subcategories - check both Subcategory and OtherSubCategory fields
    if (project.Subcategory) {
      subCategoryCounts[project.Subcategory] = (subCategoryCounts[project.Subcategory] || 0) + 1
    }
    if (project.OtherSubCategory) {
      subCategoryCounts[project.OtherSubCategory] = (subCategoryCounts[project.OtherSubCategory] || 0) + 1
    }

    // Count token status - Each exact enum value with type safety
    if (project.TokenType && (project.TokenType as TokenType) in tokenCounts) {
      tokenCounts[project.TokenType as TokenType]++
    }
  })

  // Update the filter arrays with counts
  const updatedCategoryFilters = categoryFilters.map((filter) => ({
    ...filter,
    count: categoryCounts[filter.id] || 0,
  }))

  const updatedChainTypeFilters = chainTypeFilters.map((filter) => ({
    ...filter,
    count: chainTypeCounts[filter.id] || 0,
  }))

  const updatedSubCategoryFilters = subCategoryFilters.map((filter) => ({
    ...filter,
    count: subCategoryCounts[filter.id] || 0,
  }))

  const updatedTokenFilters = tokenFilters.map((filter) => ({
    ...filter,
    count: (filter.id as TokenType) in tokenCounts ? tokenCounts[filter.id as TokenType] : 0,
  }))

  return {
    categoryFilters: updatedCategoryFilters,
    chainTypeFilters: updatedChainTypeFilters,
    subCategoryFilters: updatedSubCategoryFilters,
    tokenFilters: updatedTokenFilters,
  }
}

  // Update the fetchProjects function in the useEffect to handle pagination
  // Replace the existing fetchProjects function with this one:
  // Update the fetchProjects function to handle all token types
const fetchProjects = async () => {
  try {
    setLoading(true)
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:1337"

    // Build query parameters for filtering
    let queryParams = `populate=Logo&pagination[pageSize]=${pageSize}&pagination[page]=${currentPage}`

    // Add search query if present
    if (searchQuery) {
      queryParams += `&filters[$or][0][title][$containsi]=${encodeURIComponent(searchQuery)}`
      queryParams += `&filters[$or][1][ShortDescription][$containsi]=${encodeURIComponent(searchQuery)}`
      queryParams += `&filters[$or][2][Symbol][$containsi]=${encodeURIComponent(searchQuery)}`
    }

    // Add category filters if present
    if (selectedCategories.length > 0) {
      queryParams += `&filters[$and][0][$or]`
      selectedCategories.forEach((category, index) => {
        queryParams += `[${index}][Category]=${encodeURIComponent(category)}`
      })
    }

    // Add chain type filters if present
    if (selectedChainTypes.length > 0) {
      queryParams += `&filters[$and][1][$or]`
      selectedChainTypes.forEach((chainType, index) => {
        queryParams += `[${index}][ChainType]=${encodeURIComponent(chainType)}`
      })
    }

    // Add subcategory filters if present
    if (selectedSubCategories.length > 0) {
      queryParams += `&filters[$and][2][$or]`
      selectedSubCategories.forEach((subCategory, index) => {
        queryParams += `[${index}][$or][0][Subcategory]=${encodeURIComponent(subCategory)}`
        queryParams += `&filters[$and][2][$or][${index}][$or][1][OtherSubCategory]=${encodeURIComponent(subCategory)}`
      })
    }

    // Add token filters if present - Exact match for each selected token type
    if (selectedTokenFilters.length > 0) {
      queryParams += `&filters[$and][3][$or]`
      selectedTokenFilters.forEach((tokenType, index) => {
        queryParams += `[${index}][TokenType]=${encodeURIComponent(tokenType)}`
      })
    }

    console.log("API Query:", `${backendUrl}/api/crypto-projects?${queryParams}`)
    const response = await fetch(`${backendUrl}/api/crypto-projects?${queryParams}`)

    if (!response.ok) {
      throw new Error("Failed to fetch projects")
    }

    const data: StrapiResponse = await response.json()
    setProjects(data.data)
    setTotalPages(data.meta.pagination.pageCount)
    setTotalItems(data.meta.pagination.total)

    // Fetch all projects for filter counts (without pagination)
    const countResponse = await fetch(`${backendUrl}/api/crypto-projects?populate=Logo&pagination[pageSize]=1000`)
    if (countResponse.ok) {
      const countData: StrapiResponse = await countResponse.json()
      const {
        categoryFilters: updatedCategoryFilters,
        chainTypeFilters: updatedChainTypeFilters,
        subCategoryFilters: updatedSubCategoryFilters,
        tokenFilters: updatedTokenFilters,
      } = calculateFilterCounts(countData.data)

      setCategoryFiltersWithCount(updatedCategoryFilters)
      setChainTypeFiltersWithCount(updatedChainTypeFilters)
      setSubCategoryFiltersWithCount(updatedSubCategoryFilters)
      setTokenFiltersWithCount(updatedTokenFilters)
    }

    setLoading(false)
  } catch (err) {
    console.error("Error fetching projects:", err)
    setError("Failed to load projects. Please try again later.")
    setLoading(false)
  }
}

  // Update the useEffect dependency array to include currentPage and pageSize
  // Find the useEffect that calls fetchProjects and update its dependency array:
  useEffect(() => {
    fetchProjects()
  }, [
    currentPage,
    pageSize,
    searchQuery,
    selectedCategories,
    selectedChainTypes,
    selectedSubCategories,
    selectedTokenFilters,
  ])

  // Add a function to handle page changes
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    // Scroll to top when changing pages
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  // Add a function to handle page size changes
  const handlePageSizeChange = (size: number) => {
    setPageSize(size)
    setCurrentPage(1) // Reset to first page when changing page size
  }

  // Add a reset function that also resets pagination
  // Update the resetFilters function:
  const resetFilters = () => {
    setSearchQuery("")
    setSelectedTokenFilters([])
    setSelectedCategories([])
    setSelectedChainTypes([])
    setSelectedSubCategories([])
    setCurrentPage(1) // Reset to first page when filters are reset
  }

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
    document.documentElement.classList.toggle("dark")
  }

  // Updated filteredProjects function
  const filteredProjects = projects

  // Add this function to handle filter changes
  const handleFilterChange = (type: string, value: string) => {
    // Reset to page 1 whenever filters change
    setCurrentPage(1)

    if (type === "category") {
      setSelectedCategories(
        selectedCategories.includes(value)
          ? selectedCategories.filter((item) => item !== value)
          : [...selectedCategories, value],
      )
    } else if (type === "chainType") {
      setSelectedChainTypes(
        selectedChainTypes.includes(value)
          ? selectedChainTypes.filter((item) => item !== value)
          : [...selectedChainTypes, value],
      )
    } else if (type === "subCategory") {
      setSelectedSubCategories(
        selectedSubCategories.includes(value)
          ? selectedSubCategories.filter((item) => item !== value)
          : [...selectedSubCategories, value],
      )
    } else if (type === "token") {
      setSelectedTokenFilters(
        selectedTokenFilters.includes(value)
          ? selectedTokenFilters.filter((item) => item !== value)
          : [...selectedTokenFilters, value],
      )
    }
  }

  // Updated function to get the project logo URL
  const getProjectLogo = (project: CryptoProject) => {
    if (project.Logo?.url) {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:1337"
      // If the URL starts with "/", append the backend URL
      return project.Logo.url.startsWith("/") ? `${backendUrl}${project.Logo.url}` : project.Logo.url
    }
    return "/placeholder.svg" // Default placeholder
  }

  return (
    <div className={cn("min-h-screen bg-[#07071C] text-white relative", isDarkMode ? "dark" : "")}>
      {/* Enhanced Background elements with more visible gradients and grid */}
      <div className="fixed inset-0 bg-[#07071C] overflow-hidden z-0">
        {/* Main gradient orbs - more visible now */}
        <div className="absolute top-[5%] left-[10%] w-[40rem] h-[40rem] rounded-full bg-gradient-to-r from-[#F7984A]/30 to-transparent opacity-50 blur-[100px]"></div>
        <div className="absolute bottom-[10%] right-[10%] w-[35rem] h-[35rem] rounded-full bg-gradient-to-l from-[#F7984A]/30 to-transparent opacity-50 blur-[100px]"></div>
        <div className="absolute top-[40%] right-[15%] w-[30rem] h-[30rem] rounded-full bg-gradient-to-t from-blue-500/20 to-transparent opacity-40 blur-[100px]"></div>

        {/* Grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] opacity-70"></div>

        {/* Keep the original texture overlay */}
        <div className="absolute inset-0 bg-[url('/placeholder.svg?height=100&width=100')] bg-repeat opacity-[0.015]"></div>
      </div>

      {/* Navigation handled by imported Navbar component */}
      <Navbar />

      {/* Main Content */}
      <main className="pt-32 pb-20 relative z-10">
        <div className="container mx-auto px-4 md:px-6">
          {/* Header */}
          <div className="max-w-4xl mx-auto text-center mb-16 px-4 md:px-6">
            <h1 className="text-5xl md:text-6xl font-extrabold mb-6 text-white pb-3">Crypto Directory</h1>
            <p className="text-xl text-gray-300">
              Discover and explore trusted crypto projects and companies in one comprehensive directory.
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <div className="lg:w-72 flex-shrink-0 space-y-8">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search Directory..."
                  value={searchQuery}
                  onChange={(e) => {
                    setCurrentPage(1)
                    setSearchQuery(e.target.value)
                  }}
                  className="w-full pl-10 pr-4 py-3 bg-gray-800/70 border border-gray-700/50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#F7984A]/50 focus:border-[#F7984A]/50 transition-all"
                />
              </div>

              {/* Reset Filters */}
              {(selectedTokenFilters.length > 0 ||
                selectedCategories.length > 0 ||
                selectedChainTypes.length > 0 ||
                selectedSubCategories.length > 0 ||
                searchQuery) && (
                <div className="flex justify-end">
                  <button
                    onClick={resetFilters}
                    className="text-sm text-[#F7984A] hover:text-[#F7984A]/80 transition-colors"
                  >
                    Reset all filters
                  </button>
                </div>
              )}

             

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
                  <div className="space-y-3 pt-2 max-h-60 overflow-y-auto pr-2">
                    {categoryFiltersWithCount.map((category) => (
                      <label key={category.id} className="flex items-center space-x-3 text-sm">
                        <Checkbox
                          checked={selectedCategories.includes(category.id)}
                          onCheckedChange={(checked) => {
                            handleFilterChange("category", category.id)
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

              {/* Chain Types Filter */}
              <div className="space-y-4 bg-gray-800/20 p-4 rounded-lg border border-gray-800/50">
                <button
                  className="flex items-center justify-between w-full font-semibold text-lg"
                  onClick={() => setChainTypeFilterOpen(!chainTypeFilterOpen)}
                >
                  <span>Chain Types</span>
                  <span className="text-gray-400">{chainTypeFilterOpen ? "−" : "+"}</span>
                </button>
                {chainTypeFilterOpen && (
                  <div className="space-y-3 pt-2 max-h-60 overflow-y-auto pr-2">
                    {chainTypeFiltersWithCount.map((chainType) => (
                      <label key={chainType.id} className="flex items-center space-x-3 text-sm">
                        <Checkbox
                          checked={selectedChainTypes.includes(chainType.id)}
                          onCheckedChange={(checked) => {
                            handleFilterChange("chainType", chainType.id)
                          }}
                          className="border-white data-[state=checked]:bg-[#F7984A] data-[state=checked]:border-[#F7984A]"
                        />
                        <span className="flex-1">{chainType.label}</span>
                        <span className="text-gray-500">{chainType.count}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

               {/* Token Status Filter */}
               <div className="space-y-4 bg-gray-800/20 p-4 rounded-lg border border-gray-800/50">
                <button
                  className="flex items-center justify-between w-full font-semibold text-lg"
                  onClick={() => setTokenFilterOpen(!tokenFilterOpen)}
                >
                  <span>Token</span>
                  <span className="text-gray-400">{tokenFilterOpen ? "−" : "+"}</span>
                </button>
                {tokenFilterOpen && (
                  <div className="space-y-3 pt-2">
                    {tokenFiltersWithCount.map((filter) => (
                      <label key={filter.id} className="flex items-center space-x-3 text-sm">
                        <Checkbox
                          checked={selectedTokenFilters.includes(filter.id)}
                          onCheckedChange={(checked) => {
                            handleFilterChange("token", filter.id)
                          }}
                          className="border-white data-[state=checked]:bg-[#F7984A] data-[state=checked]:border-[#F7984A]"
                        />
                        <span className="flex-1">{filter.label}</span>
                        <span className="text-gray-500">{filter.count}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* SubCategories Filter */}
              <div className="space-y-4 bg-gray-800/20 p-4 rounded-lg border border-gray-800/50">
                <button
                  className="flex items-center justify-between w-full font-semibold text-lg"
                  onClick={() => setSubCategoryFilterOpen(!subCategoryFilterOpen)}
                >
                  <span>SubCategories</span>
                  <span className="text-gray-400">{subCategoryFilterOpen ? "−" : "+"}</span>
                </button>
                {subCategoryFilterOpen && (
                  <div className="space-y-3 pt-2 max-h-60 overflow-y-auto pr-2">
                    {subCategoryFiltersWithCount.map((subCategory) => (
                      <label key={subCategory.id} className="flex items-center space-x-3 text-sm">
                        <Checkbox
                          checked={selectedSubCategories.includes(subCategory.id)}
                          onCheckedChange={(checked) => {
                            handleFilterChange("subCategory", subCategory.id)
                          }}
                          className="border-white data-[state=checked]:bg-[#F7984A] data-[state=checked]:border-[#F7984A]"
                        />
                        <span className="flex-1">{subCategory.label}</span>
                        <span className="text-gray-500">{subCategory.count}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Filter Stats */}
              <div className="bg-gray-800/20 p-4 rounded-lg border border-gray-800/50 text-center">
                <p className="text-gray-300">
                  Showing <span className="font-bold text-white">{filteredProjects.length}</span> of{" "}
                  <span className="font-bold text-white">{totalItems}</span> projects
                </p>
              </div>
            </div>

            {/* Projects Grid */}
            <div className="flex-1">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Directory</h2>
              </div>

              {loading ? (
                <div className="flex flex-col items-center justify-center py-16">
                  <div className="w-16 h-16 border-4 border-t-[#F7984A] border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin mb-4"></div>
                  <p className="text-white">Loading projects...</p>
                </div>
              ) : error ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <h3 className="text-xl font-medium mb-2 text-red-400">{error}</h3>
                  <Button
                    onClick={() => window.location.reload()}
                    className="bg-[#F7984A] hover:bg-[#F7984A]/90 shadow-lg shadow-[#F7984A]/20 transition-all duration-300 hover:shadow-[#F7984A]/30 hover:translate-y-[-2px]"
                  >
                    Retry
                  </Button>
                </div>
              ) : filteredProjects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredProjects.map((project) => (
                    <Link key={project.id} href={`/directory/${project.Slug}`}>
                      <Card className="bg-[#0D0B26]/80 border border-gray-800/50 rounded-xl p-6 hover:border-gray-700/60 transition-all duration-300 h-full min-h-[180px] flex flex-col">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="relative w-12 h-12">
                            {/* Square container with very subtle gradient */}
                            <div className="absolute inset-0 rounded-lg border border-gray-800/60"></div>
                            <div className="absolute inset-0 bg-gradient-to-tr from-[#F7984A]/10 to-blue-400/5 rounded-lg flex items-center justify-center overflow-hidden">
                              {project.Logo?.url ? (
                                <Image
                                  src={getProjectLogo(project) || "/placeholder.svg"}
                                  alt={project.title}
                                  width={48}
                                  height={48}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-[#F7984A] font-bold">
                                  {project.title.substring(0, 2)}
                                </div>
                              )}
                            </div>
                            {project.CurrentStatus === "Verified" && (
                              <div className="absolute -bottom-1 -right-1 bg-[#F7984A] rounded-full p-0.5 z-10">
                                <CheckCircle className="w-3 h-3 text-white" />
                              </div>
                            )}
                          </div>
                          <div>
                            <h3 className="font-bold text-white text-lg">{project.title}</h3>
                            <div className="mt-1 flex flex-wrap gap-2">
                              <Badge className="bg-gray-800/70 text-gray-300 border-none text-xs">
                                {project.Category}
                              </Badge>
                              {project.Subcategory && (
                                <Badge className="bg-gray-800/70 text-gray-300 border-none text-xs">
                                  {project.Subcategory}
                                </Badge>
                              )}
                              {project.OtherSubCategory && (
                                <Badge className="bg-gray-800/70 text-gray-300 border-none text-xs">
                                  {project.OtherSubCategory}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        <p className="text-gray-300 text-sm line-clamp-2 overflow-hidden text-ellipsis">
                          {project.ShortDescription}
                        </p>
                      </Card>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-16 h-16 bg-gray-800/50 rounded-full flex items-center justify-center mb-4">
                    <Search className="w-8 h-8 text-gray-500" />
                  </div>
                  <h3 className="text-xl font-medium mb-2">No projects found</h3>
                  <p className="text-gray-400 max-w-md">
                    We couldn't find any projects matching your search criteria. Try adjusting your filters or search
                    term.
                  </p>
                </div>
              )}

              {!loading && !error && filteredProjects.length > 0 && (
                <div className="mt-12 space-y-6">
                  {/* Divider */}
                  <div className="h-px bg-gradient-to-r from-transparent via-gray-700/50 to-transparent"></div>

                  <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                    {/* Page size selector with styled dropdown */}
                    <div className="flex items-center gap-3 order-2 sm:order-1">
                      <span className="text-sm text-gray-400">Show:</span>
                      <select
                        value={pageSize}
                        onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                        className="bg-[#0D0B26] border border-gray-800 rounded-lg text-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#F7984A]/50 focus:border-[#F7984A]/50 transition-all appearance-none cursor-pointer"
                        style={{
                          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23F7984A' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
                          backgroundRepeat: "no-repeat",
                          backgroundPosition: "right 0.5rem center",
                          paddingRight: "2.5rem",
                        }}
                      >
                        <option value={12}>12 per page</option>
                        <option value={24}>24 per page</option>
                        <option value={48}>48 per page</option>
                      </select>
                    </div>

                    {/* Results counter */}
                    <div className="text-sm text-gray-400 order-1 sm:order-2">
                      Showing <span className="font-medium text-white">{(currentPage - 1) * pageSize + 1}</span> to{" "}
                      <span className="font-medium text-white">{Math.min(currentPage * pageSize, totalItems)}</span> of{" "}
                      <span className="font-medium text-white">{totalItems}</span> projects
                    </div>
                  </div>

                  {/* Pagination controls */}
                  <div className="flex justify-center mt-6">
                    <div className="inline-flex items-center rounded-lg overflow-hidden bg-[#0D0B26] border border-gray-800 p-1">
                      {/* Previous page button */}
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`flex items-center justify-center h-9 w-9 rounded-md transition-all ${
                          currentPage === 1
                            ? "opacity-50 cursor-not-allowed text-gray-500"
                            : "hover:bg-gray-800/80 text-gray-300 hover:text-white"
                        }`}
                        aria-label="Previous page"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="m15 18-6-6 6-6" />
                        </svg>
                      </button>

                      {/* Page numbers */}
                      <div className="flex items-center px-1">
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                          // Calculate which page numbers to show
                         
                          let pageToShow;
                          if (totalPages <= 5) {
                            // If we have 5 or fewer pages, always show all pages (1 to totalPages)
                            pageToShow = i + 1;
                          } else if (currentPage < 3) {
                            // If we're near the start, show pages 1-5
                            pageToShow = i + 1;
                          } else if (currentPage > totalPages - 2) {
                            // If we're near the end, show the last 5 pages
                            pageToShow = totalPages - Math.min(4, totalPages - 1) + i;
                          } else {
                            // Otherwise, show current page and 2 pages on each side
                            pageToShow = currentPage - 2 + i;
                          }

                          // Only show valid page numbers
                          if (pageToShow > 0 && pageToShow <= totalPages) {
                            return (
                              <button
                                key={pageToShow}
                                onClick={() => handlePageChange(pageToShow)}
                                className={`flex items-center justify-center h-9 w-9 rounded-md mx-0.5 text-sm font-medium transition-all ${
                                  currentPage === pageToShow
                                    ? "bg-[#F7984A] text-white shadow-lg shadow-[#F7984A]/20"
                                    : "hover:bg-gray-800/80 text-gray-300 hover:text-white"
                                }`}
                              >
                                {pageToShow}
                              </button>
                            )
                          }
                          return null
                        })}

                        {/* Show ellipsis and last page if there are many pages */}
                        {totalPages > 5 && currentPage < totalPages - 2 && (
                          <>
                            <span className="mx-1 text-gray-500">...</span>
                            <button
                              onClick={() => handlePageChange(totalPages)}
                              className="flex items-center justify-center h-9 w-9 rounded-md mx-0.5 text-sm font-medium hover:bg-gray-800/80 text-gray-300 hover:text-white transition-all"
                            >
                              {totalPages}
                            </button>
                          </>
                        )}
                      </div>

                      {/* Next page button */}
                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={`flex items-center justify-center h-9 w-9 rounded-md transition-all ${
                          currentPage === totalPages
                            ? "opacity-50 cursor-not-allowed text-gray-500"
                            : "hover:bg-gray-800/80 text-gray-300 hover:text-white"
                        }`}
                        aria-label="Next page"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="m9 18 6-6-6-6" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer className="relative z-20" />
    </div>
  )
}

