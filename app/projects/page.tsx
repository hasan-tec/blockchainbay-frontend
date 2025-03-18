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

interface CryptoProject {
  id: number
  documentId: string
  title: string
  Slug: string
  ShortDescription: string
  DetailedDescription: any[]
  CurrentStatus: string
  Category: string
  SubCategory: string | null  // This field is not being used correctly in the API
  Subcategory: string | null  // This is the field actually used in the API response
  OtherSubCategory: string | null // Additional subcategory field in API
  TokenType: string
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
  { id: "Everyday Crypto Uses", label: "Everyday Crypto Uses" }
];

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
  { id: "Chain Types", label: "Chain Types" },
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
  { id: "Sui", label: "Sui" }
];

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
  { id: "Database", label: "Database" }
];

// Token filters
const tokenFilters: FilterItem[] = [
  { id: "Has token", label: "Has token" },
  { id: "No token", label: "No token" }
];

export default function CryptoDirectoryPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTokenFilters, setSelectedTokenFilters] = useState<string[]>([])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedChainTypes, setSelectedChainTypes] = useState<string[]>([])
  const [selectedSubCategories, setSelectedSubCategories] = useState<string[]>([])
  
  const [tokenFilterOpen, setTokenFilterOpen] = useState(true)
  const [categoryFilterOpen, setCategoryFilterOpen] = useState(true)
  const [chainTypeFilterOpen, setChainTypeFilterOpen] = useState(true)
  const [subCategoryFilterOpen, setSubCategoryFilterOpen] = useState(true)
  
  const [projects, setProjects] = useState<CryptoProject[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [scrolled, setScrolled] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  
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

  // Add a function to calculate counts for each filter
  const calculateFilterCounts = (projects: CryptoProject[]) => {
    const categoryCounts: Record<string, number> = {};
    const chainTypeCounts: Record<string, number> = {};
    const subCategoryCounts: Record<string, number> = {};
    const tokenCounts = {
      "Has token": 0,
      "No token": 0
    };

    projects.forEach(project => {
      // Count categories
      if (project.Category) {
        categoryCounts[project.Category] = (categoryCounts[project.Category] || 0) + 1;
      }
      
      // Count chain types
      if (project.ChainType) {
        chainTypeCounts[project.ChainType] = (chainTypeCounts[project.ChainType] || 0) + 1;
      }
      
      // Count subcategories - check both Subcategory and OtherSubCategory fields
      if (project.Subcategory) {
        subCategoryCounts[project.Subcategory] = (subCategoryCounts[project.Subcategory] || 0) + 1;
      }
      if (project.OtherSubCategory) {
        subCategoryCounts[project.OtherSubCategory] = (subCategoryCounts[project.OtherSubCategory] || 0) + 1;
      }

      // Count token status
      if (project.TokenType && project.TokenType !== "") {
        tokenCounts["Has token"]++;
      } else {
        tokenCounts["No token"]++;
      }
    });

    // Update the filter arrays with counts
    const updatedCategoryFilters = categoryFilters.map(filter => ({
      ...filter,
      count: categoryCounts[filter.id] || 0
    }));

    const updatedChainTypeFilters = chainTypeFilters.map(filter => ({
      ...filter,
      count: chainTypeCounts[filter.id] || 0
    }));

    const updatedSubCategoryFilters = subCategoryFilters.map(filter => ({
      ...filter,
      count: subCategoryCounts[filter.id] || 0
    }));

    const updatedTokenFilters = [
      { id: "Has token", label: "Has token", count: tokenCounts["Has token"] },
      { id: "No token", label: "No token", count: tokenCounts["No token"] }
    ];

    return {
      categoryFilters: updatedCategoryFilters,
      chainTypeFilters: updatedChainTypeFilters,
      subCategoryFilters: updatedSubCategoryFilters,
      tokenFilters: updatedTokenFilters
    };
  };

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:1337"
        const response = await fetch(`${backendUrl}/api/crypto-projects?populate=Logo`)

        if (!response.ok) {
          throw new Error("Failed to fetch projects")
        }

        const data: StrapiResponse = await response.json()
        setProjects(data.data)
        
        // Calculate and update filter counts
        const { categoryFilters: updatedCategoryFilters, 
                chainTypeFilters: updatedChainTypeFilters, 
                subCategoryFilters: updatedSubCategoryFilters,
                tokenFilters: updatedTokenFilters } = calculateFilterCounts(data.data);
        
        setCategoryFiltersWithCount(updatedCategoryFilters);
        setChainTypeFiltersWithCount(updatedChainTypeFilters);
        setSubCategoryFiltersWithCount(updatedSubCategoryFilters);
        setTokenFiltersWithCount(updatedTokenFilters);
        
        setLoading(false)
      } catch (err) {
        console.error("Error fetching projects:", err)
        setError("Failed to load projects. Please try again later.")
        setLoading(false)
      }
    }

    fetchProjects()
  }, [])

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
    document.documentElement.classList.toggle("dark")
  }

  // Reset filters function
  const resetFilters = () => {
    setSearchQuery("");
    setSelectedTokenFilters([]);
    setSelectedCategories([]);
    setSelectedChainTypes([]);
    setSelectedSubCategories([]);
  };

  // Updated filteredProjects function
  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      searchQuery === "" ||
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.ShortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (project.Symbol && project.Symbol.toLowerCase().includes(searchQuery.toLowerCase()));
  
    const matchesToken = 
      selectedTokenFilters.length === 0 || 
      (selectedTokenFilters.includes("Has token") && project.TokenType && project.TokenType.toLowerCase().includes("has token")) ||
      (selectedTokenFilters.includes("No token") && (!project.TokenType || !project.TokenType.toLowerCase().includes("has token")));
  
    const matchesCategory = 
      selectedCategories.length === 0 || 
      (project.Category && selectedCategories.includes(project.Category));
  
    const matchesChainType = 
      selectedChainTypes.length === 0 || 
      (project.ChainType && selectedChainTypes.includes(project.ChainType));
  
    // Update subcategory matching to check both Subcategory and OtherSubCategory fields
    const matchesSubCategory = 
      selectedSubCategories.length === 0 || 
      (project.Subcategory && selectedSubCategories.includes(project.Subcategory)) ||
      (project.OtherSubCategory && selectedSubCategories.includes(project.OtherSubCategory));
  
    return matchesSearch && matchesToken && matchesCategory && matchesChainType && matchesSubCategory;
  });

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
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-white/70">
              Crypto Projects
            </h1>
            <p className="text-xl text-gray-300">Discover and explore the latest verified crypto projects</p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <div className="lg:w-72 flex-shrink-0 space-y-8">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-800/70 border border-gray-700/50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#F7984A]/50 focus:border-[#F7984A]/50 transition-all"
                />
              </div>
              
              {/* Reset Filters */}
              {(selectedTokenFilters.length > 0 || selectedCategories.length > 0 || selectedChainTypes.length > 0 || selectedSubCategories.length > 0 || searchQuery) && (
                <div className="flex justify-end">
                  <button
                    onClick={resetFilters}
                    className="text-sm text-[#F7984A] hover:text-[#F7984A]/80 transition-colors"
                  >
                    Reset all filters
                  </button>
                </div>
              )}

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
                            if (checked) {
                              setSelectedTokenFilters([...selectedTokenFilters, filter.id]);
                            } else {
                              setSelectedTokenFilters(selectedTokenFilters.filter((id) => id !== filter.id));
                            }
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
                            if (checked) {
                              setSelectedCategories([...selectedCategories, category.id]);
                            } else {
                              setSelectedCategories(selectedCategories.filter((id) => id !== category.id));
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
                            if (checked) {
                              setSelectedChainTypes([...selectedChainTypes, chainType.id]);
                            } else {
                              setSelectedChainTypes(selectedChainTypes.filter((id) => id !== chainType.id));
                            }
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
                            if (checked) {
                              setSelectedSubCategories([...selectedSubCategories, subCategory.id]);
                            } else {
                              setSelectedSubCategories(selectedSubCategories.filter((id) => id !== subCategory.id));
                            }
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
                  <span className="font-bold text-white">{projects.length}</span> projects
                </p>
              </div>
            </div>

            {/* Projects Grid */}
            <div className="flex-1">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Verified Projects</h2>
                <p className="text-gray-400 text-sm">
                  <Link href="#" className="text-[#F7984A] hover:underline">
                    Learn more about our verification process
                  </Link>
                </p>
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
                    <Link key={project.id} href={`/projects/${project.Slug}`}>
                      <Card className="bg-[#0D0B26]/80 border border-gray-800/50 rounded-xl p-6 hover:border-gray-700/60 transition-all duration-300 h-full min-h-[180px] flex flex-col">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="relative">
                            <div className="w-12 h-12 rounded-full overflow-hidden bg-[#0D0B26] border border-purple-500/20">
                              <div className="w-full h-full">
                                {project.Logo?.url ? (
                                  <Image
                                    src={getProjectLogo(project) || "/placeholder.svg"}
                                    alt={project.title}
                                    width={48}
                                    height={48}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-12 h-12 bg-gradient-to-tr from-[#F7984A]/30 to-[#F7984A]/10 flex items-center justify-center text-[#F7984A] font-bold">
                                    {project.title.substring(0, 2)}
                                  </div>
                                )}
                              </div>
                            </div>
                            {project.CurrentStatus === "Verified" && (
                              <div className="absolute -bottom-1 -right-1 bg-[#F7984A] rounded-full p-0.5">
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
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer className="relative z-20" />
    </div>
  )
}