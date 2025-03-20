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
  Tag,
  Play,
  Pause,
  ChevronRight,
  Filter,
  Loader2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"
import { fetchPodcasts, type Podcast } from "@/lib/rssUtils"

// Get unique categories from the podcasts
const getCategoryFilters = (podcasts: Podcast[]) => {
  const categories = podcasts.reduce<Record<string, number>>((acc, podcast) => {
    const category = podcast.category.toLowerCase();
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {});
  
  return Object.entries(categories).map(([id, count]) => ({
    id,
    label: id.charAt(0).toUpperCase() + id.slice(1), // Capitalize first letter
    count
  }));
};

export default function PodcastsPage() {
  // State for podcasts data
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // UI state
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [scrolled, setScrolled] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [categoryFilterOpen, setCategoryFilterOpen] = useState(true)
  const [isPlaying, setIsPlaying] = useState<string | null>(null)
  
  // Calculate category filters based on actual data
  const categoryFilters = getCategoryFilters(podcasts);

  // Fetch podcasts on component mount
  useEffect(() => {
    const loadPodcasts = async () => {
      try {
        setLoading(true);
        const data = await fetchPodcasts();
        setPodcasts(data);
        setError(null);
      } catch (err) {
        console.error("Failed to load podcasts:", err);
        setError("Failed to load podcasts. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    
    loadPodcasts();
  }, []);

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

  const filteredPodcasts = podcasts.filter((podcast) => {
    const matchesSearch =
      podcast.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      podcast.description.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory =
      selectedCategories.length === 0 || selectedCategories.includes(podcast.category.toLowerCase())

    return matchesSearch && matchesCategory
  })

  const togglePlay = (id: string) => {
    if (isPlaying === id) {
      setIsPlaying(null)
    } else {
      setIsPlaying(id)
    }
  }

  // Featured episodes
  const featuredPodcasts = podcasts.filter(podcast => podcast.featured);

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
                { name: "Store", href: "#", icon: <ShoppingCart className="h-4 w-4 mr-1" /> },
                { name: "Giveaways", href: "#", icon: <Gift className="h-4 w-4 mr-1" /> },
              ].map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "relative px-4 py-2 text-sm font-medium text-gray-200 hover:text-white transition-colors group flex items-center",
                    item.name === "Podcasts" && "text-white",
                  )}
                >
                  {item.icon}
                  {item.name}
                  <span
                    className={cn(
                      "absolute bottom-0 left-1/2 h-0.5 bg-[#F7984A] transition-all duration-300",
                      item.name === "Podcasts" ? "w-1/2 left-1/4" : "w-0 group-hover:w-1/2 group-hover:left-1/4",
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
                  placeholder="Search podcasts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 w-48 rounded-full bg-gray-800/70 border border-gray-700/50 text-sm focus:outline-none focus:ring-2 focus:ring-[#F7984A]/50 focus:border-[#F7984A]/50 transition-all"
                />
              </div>

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
            {[
              { name: "Projects", href: "/projects", icon: <BarChart3 className="h-5 w-5 mr-2" /> },
              { name: "News", href: "/news", icon: <Newspaper className="h-5 w-5 mr-2" /> },
              { name: "Podcasts", href: "/podcasts", icon: <Headphones className="h-5 w-5 mr-2" /> },
              { name: "Store", href: "#", icon: <ShoppingCart className="h-5 w-5 mr-2" /> },
              { name: "Giveaways", href: "#", icon: <Gift className="h-5 w-5 mr-2" /> },
            ].map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center py-3 text-lg font-medium text-gray-200 hover:text-white border-b border-gray-800",
                  item.name === "Podcasts" && "text-white",
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
                  placeholder="Search podcasts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
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
              Blockchain Bay Podcasts
            </h1>
            <p className="text-xl text-gray-300">
              In-depth conversations with crypto founders, developers, and industry experts
            </p>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-16">
              <Loader2 className="h-12 w-12 text-[#F7984A] animate-spin mb-4" />
              <p className="text-lg text-gray-300">Loading podcast episodes...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-6 mb-8 text-center">
              <p className="text-red-400">{error}</p>
            </div>
          )}

          {/* Featured Episodes */}
          {!loading && !error && podcasts.length > 0 && featuredPodcasts.length > 0 && (
            <div className="mb-16">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold">Featured Episodes</h2>
                <Link
                  href="#all-episodes"
                  className="text-[#F7984A] hover:text-[#F7984A]/80 flex items-center gap-1 group"
                >
                  <span>View all episodes</span>
                  <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredPodcasts.map((podcast) => (
                  <Link key={podcast.id} href={`/podcasts/${podcast.id}`}>
                    <Card className="bg-[#0D0B26]/80 border border-gray-800/50 rounded-xl overflow-hidden hover:border-gray-700/60 transition-all duration-300 group h-full flex flex-col">
                      <div className="relative aspect-video w-full overflow-hidden">
                        <Image
                          src={podcast.thumbnail || "/placeholder.svg"}
                          alt={podcast.title}
                          width={600}
                          height={300}
                          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="w-16 h-16 rounded-full bg-[#F7984A]/90 flex items-center justify-center">
                            <Play className="h-8 w-8 text-white" />
                          </div>
                        </div>
                        <div className="absolute top-4 left-4">
                          <Badge className="bg-[#F7984A] hover:bg-[#F7984A]/90">{podcast.category}</Badge>
                        </div>
                      </div>
                      <div className="p-6 flex-1 flex flex-col">
                        <h3 className="font-bold text-xl mb-3 group-hover:text-[#F7984A] transition-colors line-clamp-2">
                          {podcast.title}
                        </h3>
                        <p className="text-gray-300 text-sm mb-4 line-clamp-3 flex-1">{podcast.description}</p>
                        <div className="flex items-center justify-between mt-auto">
                          <div className="flex items-center gap-2 text-sm text-gray-400">
                            <Headphones className="h-4 w-4" />
                            <span>{podcast.duration}</span>
                          </div>
                          <span className="text-sm text-gray-400">{podcast.date}</span>
                        </div>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {!loading && !error && podcasts.length > 0 && (
            <div className="flex flex-col lg:flex-row gap-8" id="all-episodes">
              {/* Filters Sidebar */}
              <div className="lg:w-64 flex-shrink-0 space-y-8">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search podcasts..."
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
                  {categoryFilterOpen && categoryFilters.length > 0 && (
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

                {/* Subscribe Card */}
                <Card className="bg-gradient-to-b from-[#0D0B26]/80 via-[#0D0B26]/95 to-[#0D0B26]/80 border-gray-800/50 p-6 rounded-xl">
                  <h3 className="font-bold text-lg mb-4">Subscribe to Podcast</h3>
                  <p className="text-gray-300 text-sm mb-6">
                    Never miss an episode. Subscribe to our podcast on your favorite platform.
                  </p>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { name: "Spotify", icon: "/placeholder.svg?height=40&width=40" },
                      { name: "Apple", icon: "/placeholder.svg?height=40&width=40" },
                      { name: "Google", icon: "/placeholder.svg?height=40&width=40" },
                    ].map((platform) => (
                      <Link
                        key={platform.name}
                        href="#"
                        className="flex flex-col items-center gap-2 p-2 rounded-lg bg-gray-800/50 hover:bg-gray-800 transition-colors"
                      >
                        <Image
                          src={platform.icon || "/placeholder.svg"}
                          alt={platform.name}
                          width={24}
                          height={24}
                          className="w-6 h-6 object-contain"
                        />
                        <span className="text-xs">{platform.name}</span>
                      </Link>
                    ))}
                  </div>
                </Card>
              </div>

              {/* Podcasts List */}
              <div className="flex-1">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">All Episodes</h2>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="gap-2">
                      <Filter className="h-4 w-4" />
                      <span className="hidden sm:inline">Filter</span>
                    </Button>
                    <select className="bg-gray-800/70 border border-gray-700/50 rounded-md text-sm py-1 px-2 focus:outline-none focus:ring-2 focus:ring-[#F7984A]/50 focus:border-[#F7984A]/50">
                      <option>Latest</option>
                      <option>Oldest</option>
                      <option>Most Popular</option>
                    </select>
                  </div>
                </div>

                {filteredPodcasts.length > 0 ? (
                  <div className="space-y-4">
                    {filteredPodcasts.map((podcast) => (
                      <div
                        key={podcast.id}
                        className="bg-[#0D0B26]/80 border border-gray-800/50 rounded-xl p-4 hover:border-gray-700/60 transition-all duration-300 group"
                      >
                        <div className="flex flex-col sm:flex-row gap-4">
                          <div className="sm:w-1/4 lg:w-1/5">
                            <div className="relative aspect-square rounded-lg overflow-hidden">
                              <Image
                                src={podcast.thumbnail || "/placeholder.svg"}
                                alt={podcast.title}
                                width={200}
                                height={200}
                                className="object-cover w-full h-full"
                              />
                              <button
                                onClick={(e) => {
                                  e.preventDefault()
                                  togglePlay(podcast.id)
                                }}
                                className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <div className="w-12 h-12 rounded-full bg-[#F7984A]/90 flex items-center justify-center">
                                  {isPlaying === podcast.id ? (
                                    <Pause className="h-6 w-6 text-white" />
                                  ) : (
                                    <Play className="h-6 w-6 text-white" />
                                  )}
                                </div>
                              </button>
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                              <Badge className="bg-[#0D0B26] border border-[#F7984A]/20 text-[#F7984A] hover:bg-[#0D0B26]/80">
                                {podcast.category}
                              </Badge>
                              <span className="text-sm text-gray-400">{podcast.date}</span>
                            </div>
                            <Link
                              href={`/podcasts/${podcast.id}`}
                              className="block group-hover:text-[#F7984A] transition-colors"
                            >
                              <h3 className="font-bold text-lg mb-2">{podcast.title}</h3>
                            </Link>
                            <p className="text-gray-300 text-sm mb-3 line-clamp-2">{podcast.description}</p>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2 text-sm text-gray-400">
                                <Headphones className="h-4 w-4" />
                                <span>{podcast.duration}</span>
                              </div>
                              <Link
                                href={`/podcasts/${podcast.id}`}
                                className="text-[#F7984A] hover:text-[#F7984A]/80 text-sm flex items-center gap-1"
                              >
                                <span>Listen now</span>
                                <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="w-16 h-16 bg-gray-800/50 rounded-full flex items-center justify-center mb-4">
                      <Search className="w-8 h-8 text-gray-500" />
                    </div>
                    <h3 className="text-xl font-medium mb-2">No episodes found</h3>
                    <p className="text-gray-400 max-w-md">
                      We couldn't find any podcast episodes matching your search criteria. Try adjusting your filters or
                      search term.
                    </p>
                  </div>
                )}

                {/* Pagination - Only show if we have enough podcasts */}
                {filteredPodcasts.length > 8 && (
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
                )}
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
              <h3 className="font-bold text-lg">Projects</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/projects" className="text-gray-400 hover:text-white transition-colors">
                    Browse Projects
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                    Submit Project
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                    Verification
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                    Categories
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
                  <Link href="#" className="text-gray-400 hover:text-white transition-colors">
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

