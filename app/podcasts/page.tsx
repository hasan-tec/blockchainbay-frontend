"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Search, Headphones, Play, Pause, ChevronRight, Loader2, Tag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"
import { determineCategory } from "@/lib/rssUtils" // Import determineCategory

// Import Navbar and Footer components
import Navbar from "@/components/Navbar"
import { Footer } from "@/components/NewsletterFooter"

interface Podcast {
  id: string
  title: string
  description: string
  thumbnail: string
  audio: string
  date: string
  duration: string
  category: string
  featured?: boolean
}

// Get unique categories from the podcasts
const getCategoryFilters = (podcasts: Podcast[]) => {
  const categories = podcasts.reduce<Record<string, number>>((acc, podcast) => {
    const category = podcast.category.toLowerCase()
    acc[category] = (acc[category] || 0) + 1
    return acc
  }, {})

  return Object.entries(categories).map(([id, count]) => ({
    id,
    label: id === "depin" ? "DePIN" : id.charAt(0).toUpperCase() + id.slice(1), // Special case for DePIN
    count,
  }))
}

// Function to fetch all podcasts
const fetchPodcasts = async (): Promise<Podcast[]> => {
  try {
    const response = await fetch("/api/podcasts")
    if (!response.ok) {
      throw new Error("Failed to fetch podcasts")
    }
    return await response.json()
  } catch (error) {
    console.error("Error fetching podcasts:", error)
    return []
  }
}

export default function PodcastsPage() {
  // State for podcasts data
  const [podcasts, setPodcasts] = useState<Podcast[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // UI state
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [scrolled, setScrolled] = useState(false)
  const [categoryFilterOpen, setCategoryFilterOpen] = useState(true)
  const [isPlaying, setIsPlaying] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const podcastsPerPage = 8

  // Fetch podcasts on component mount
  useEffect(() => {
    const loadPodcasts = async () => {
      try {
        setLoading(true)
        const data = await fetchPodcasts()
        
        // Force recategorization when loading podcasts
        const recategorizedPodcasts = data.map(podcast => ({
          ...podcast,
          category: determineCategory(podcast.description)
        }))
        
        setPodcasts(recategorizedPodcasts)
        setError(null)
      } catch (err) {
        console.error("Failed to load podcasts:", err)
        setError("Failed to load podcasts. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    loadPodcasts()
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Calculate category filters based on actual data
  const categoryFilters = getCategoryFilters(podcasts)

  const filteredPodcasts = podcasts.filter((podcast) => {
    const matchesSearch =
      podcast.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      podcast.description.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory =
      selectedCategories.length === 0 || selectedCategories.includes(podcast.category.toLowerCase())

    return matchesSearch && matchesCategory
  })

  // Pagination logic
  const totalPages = Math.ceil(filteredPodcasts.length / podcastsPerPage)
  const indexOfLastPodcast = currentPage * podcastsPerPage
  const indexOfFirstPodcast = indexOfLastPodcast - podcastsPerPage
  const currentPodcasts = filteredPodcasts.slice(indexOfFirstPodcast, indexOfLastPodcast)

  const paginate = (pageNumber: number) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber)
      window.scrollTo({ top: document.getElementById("all-episodes")?.offsetTop || 0, behavior: "smooth" })
    }
  }

  const togglePlay = (id: string) => {
    if (isPlaying === id) {
      setIsPlaying(null)
    } else {
      setIsPlaying(id)
    }
  }

  // Featured episodes
  const featuredPodcasts = podcasts.filter((podcast) => podcast.featured)

  return (
    <div className="relative min-h-screen bg-[#07071C] text-white">
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

      {/* Navigation */}
      <Navbar  />

      {/* Main Content */}
      <main className="relative z-20 pt-32 pb-20">
        <div className="container mx-auto px-4 md:px-6">
          {/* Header */}
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-extrabold mb-6 text-white">Blockchain Bay Podcasts</h1>
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
                <h2 className="text-3xl font-bold text-white">Featured Episodes</h2>
                <Link
                  href="#all-episodes"
                  className="text-[#F7984A] hover:text-[#F7984A]/80 flex items-center gap-1 group"
                >
                  <span>View all episodes</span>
                  <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredPodcasts.map((podcast) => {
                  // Ensure correct category display
                  const displayCategory = podcast.description.toLowerCase().includes('depin') 
                    ? "DePIN" 
                    : podcast.category; 
                    
                  return (
                    <Link key={podcast.id} href={`/podcasts/${podcast.id}`}>
                      <Card className="bg-[#0D0B26]/80 border border-gray-800/50 rounded-xl overflow-hidden hover:border-[#F7984A]/30 transition-all duration-300 group h-full flex flex-col">
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
                            <Badge className="bg-[#F7984A] hover:bg-[#F7984A]/90 text-white">{displayCategory}</Badge>
                          </div>
                        </div>
                        <div className="p-6 flex-1 flex flex-col">
                          <h3 className="font-bold text-xl mb-3 group-hover:text-[#F7984A] transition-colors line-clamp-2 text-white">
                            {podcast.title}
                          </h3>
                          <p className="text-gray-300 text-sm mb-4 line-clamp-3 flex-1">
                            {podcast.description.length > 120
                              ? `${podcast.description.substring(0, 120)}...`
                              : podcast.description}
                          </p>
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
                  );
                })}
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
                    className="w-full pl-10 pr-4 py-3 bg-gray-800/70 border border-gray-700/50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#F7984A]/50 focus:border-[#F7984A]/50 transition-all text-white"
                  />
                </div>

                {/* Categories Filter */}
                <div className="space-y-4 bg-gray-800/20 p-4 rounded-lg border border-gray-800/50">
                  <button
                    className="flex items-center justify-between w-full font-semibold text-lg text-white"
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
                          <span className="flex-1 text-gray-300">{category.label}</span>
                          <span className="text-gray-500">{category.count}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                {/* Improved Subscribe to Podcast Card with SVG Icons */}
                <Card className="bg-[#0D0B26]/80 border border-gray-800/50 p-6 rounded-xl">
                  <h3 className="font-bold text-xl mb-3 text-white">Subscribe to Podcast</h3>
                  <p className="text-gray-300 text-sm mb-5">
                    Never miss an episode. Subscribe on your favorite platform.
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    {/* Spotify */}
                    <Link
                      href="https://open.spotify.com/show/6FB6i8Yc16Z0XAIu85EMOq?si=98a85f70763c47e0&nd=1&dlsi=ceafe8b78f7f403a"
                      target="_blank"
                      className="flex flex-col items-center gap-2 p-3 rounded-lg bg-gray-800/50 hover:bg-gray-800 transition-colors group"
                    >
                      <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[#1ED76020]">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          className="h-6 w-6 group-hover:scale-110 transition-transform duration-300"
                          fill="#1ED760"
                        >
                          <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.6 0 12 0zm5.52 17.28c-.24.36-.66.48-1.02.24-2.82-1.74-6.36-2.1-10.56-1.14-.42.12-.78-.18-.9-.54-.12-.42.18-.78.54-.9 4.56-1.02 8.52-.6 11.64 1.32.42.18.48.66.3 1.02zm1.44-3.3c-.3.42-.84.6-1.26.3-3.24-1.98-8.16-2.58-11.94-1.44-.48.12-.99-.12-1.11-.6-.12-.48.12-.99.6-1.11 4.38-1.32 9.78-.66 13.5 1.62.36.24.54.78.24 1.2l-.03.03zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.3c-.6.18-1.2-.18-1.38-.78-.18-.6.18-1.2.78-1.38 4.26-1.26 11.28-1.02 15.72 1.62.54.3.78 1.02.48 1.56-.3.42-1.02.66-1.56.36z" />
                        </svg>
                      </div>
                      <span className="text-sm text-gray-300">Spotify</span>
                    </Link>

                    {/* Apple Podcast */}
                    <Link
                      href="https://podcasts.apple.com/us/podcast/blockchain-bay/id1643516087"
                      target="_blank"
                      className="flex flex-col items-center gap-2 p-3 rounded-lg bg-gray-800/50 hover:bg-gray-800 transition-colors group"
                    >
                      <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[#D56DFB20]">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 32 32"
                          className="h-6 w-6 group-hover:scale-110 transition-transform duration-300"
                          fill="#D56DFB"
                        >
                          <path d="M7.12 0c-3.937-0.011-7.131 3.183-7.12 7.12v17.76c-0.011 3.937 3.183 7.131 7.12 7.12h17.76c3.937 0.011 7.131-3.183 7.12-7.12v-17.76c0.011-3.937-3.183-7.131-7.12-7.12zM15.817 3.421c3.115 0 5.932 1.204 8.079 3.453 1.631 1.693 2.547 3.489 3.016 5.855 0.161 0.787 0.161 2.932 0.009 3.817-0.5 2.817-2.041 5.339-4.317 7.063-0.812 0.615-2.797 1.683-3.115 1.683-0.12 0-0.129-0.12-0.077-0.615 0.099-0.792 0.192-0.953 0.64-1.141 0.713-0.296 1.932-1.167 2.677-1.911 1.301-1.303 2.229-2.932 2.677-4.719 0.281-1.1 0.244-3.543-0.063-4.672-0.969-3.595-3.907-6.385-7.5-7.136-1.041-0.213-2.943-0.213-4 0-3.636 0.751-6.647 3.683-7.563 7.371-0.245 1.004-0.245 3.448 0 4.448 0.609 2.443 2.188 4.681 4.255 6.015 0.407 0.271 0.896 0.547 1.1 0.631 0.447 0.192 0.547 0.355 0.629 1.14 0.052 0.485 0.041 0.62-0.072 0.62-0.073 0-0.62-0.235-1.199-0.511l-0.052-0.041c-3.297-1.62-5.407-4.364-6.177-8.016-0.187-0.943-0.224-3.187-0.036-4.052 0.479-2.323 1.396-4.135 2.921-5.739 2.199-2.319 5.027-3.543 8.172-3.543zM16 7.172c0.541 0.005 1.068 0.052 1.473 0.14 3.715 0.828 6.344 4.543 5.833 8.229-0.203 1.489-0.713 2.709-1.619 3.844-0.448 0.573-1.537 1.532-1.729 1.532-0.032 0-0.063-0.365-0.063-0.803v-0.808l0.552-0.661c2.093-2.505 1.943-6.005-0.339-8.296-0.885-0.896-1.912-1.423-3.235-1.661-0.853-0.161-1.031-0.161-1.927-0.011-1.364 0.219-2.417 0.744-3.355 1.672-2.291 2.271-2.443 5.791-0.348 8.296l0.552 0.661v0.813c0 0.448-0.037 0.807-0.084 0.807-0.036 0-0.349-0.213-0.683-0.479l-0.047-0.016c-1.109-0.885-2.088-2.453-2.495-3.995-0.244-0.932-0.244-2.697 0.011-3.625 0.672-2.505 2.521-4.448 5.079-5.359 0.547-0.193 1.509-0.297 2.416-0.281zM15.823 11.156c0.417 0 0.828 0.084 1.131 0.24 0.645 0.339 1.183 0.989 1.385 1.677 0.62 2.104-1.609 3.948-3.631 3.005h-0.015c-0.953-0.443-1.464-1.276-1.475-2.36 0-0.979 0.541-1.828 1.484-2.328 0.297-0.156 0.709-0.235 1.125-0.235zM15.812 17.464c1.319-0.005 2.271 0.463 2.625 1.291 0.265 0.62 0.167 2.573-0.292 5.735-0.307 2.208-0.479 2.765-0.905 3.141-0.589 0.52-1.417 0.667-2.209 0.385h-0.004c-0.953-0.344-1.157-0.808-1.553-3.527-0.452-3.161-0.552-5.115-0.285-5.735 0.348-0.823 1.296-1.285 2.624-1.291z" />
                        </svg>
                      </div>
                      <span className="text-sm text-gray-300">Apple</span>
                    </Link>

                    {/* YouTube */}
                    <Link
                      href="https://www.youtube.com/@chrisbagnell"
                      target="_blank"
                      className="flex flex-col items-center gap-2 p-3 rounded-lg bg-gray-800/50 hover:bg-gray-800 transition-colors group"
                    >
                      <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[#FF000020]">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          className="h-6 w-6 group-hover:scale-110 transition-transform duration-300"
                          fill="#FF0000"
                        >
                          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                        </svg>
                      </div>
                      <span className="text-sm text-gray-300">YouTube</span>
                    </Link>

                    {/* Amazon Music */}
                    <Link
                      href="https://music.amazon.com/podcasts"
                      target="_blank"
                      className="flex flex-col items-center gap-2 p-3 rounded-lg bg-gray-800/50 hover:bg-gray-800 transition-colors group"
                    >
                      <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[#00A8E120]">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 50 50"
                          className="h-6 w-6 group-hover:scale-110 transition-transform duration-300"
                          fill="#00A8E1"
                        >
                          <path
                            d="M36,5H14c-4.971,0-9,4.029-9,9v22c0,4.971,4.029,9,9,9h22c4.971,0,9-4.029,9-9V14C45,9.029,40.971,5,36,5z M38.19,21.254	c0.65-0.279,1.42-0.317,2.07-0.121c0.27,0.084,0.51,0.196,0.74,0.335v1.23c-0.72-0.494-1.55-0.634-2.19-0.289	c-0.68,0.373-1.08,1.155-1.06,1.975c-0.01,0.904,0.29,1.742,0.92,2.133c0.56,0.382,1.44,0.382,2.33,0.242v1.025	c-0.35,0.112-0.72,0.177-1.1,0.214c-0.63,0.047-1.33-0.047-1.95-0.382c-0.63-0.326-1.09-0.894-1.35-1.463	c-0.25-0.587-0.34-1.183-0.35-1.752C36.22,23.191,36.87,21.831,38.19,21.254z M34,18.01c0.552,0,1,0.448,1,1s-0.448,1-1,1	s-1-0.448-1-1S33.448,18.01,34,18.01z M34.75,21.01v7h-1.5v-7H34.75z M27,26.175c0.64,0.261,1.42,0.532,2.03,0.59	c0.61,0.068,1.28-0.01,1.67-0.223c0.19-0.116,0.23-0.278,0.23-0.458s-0.036-0.282-0.123-0.417c-0.159-0.246-0.597-0.432-1.287-0.597	c-0.34-0.097-0.71-0.194-1.12-0.416c-0.41-0.184-1.243-0.852-1.081-1.991c0.087-0.609,0.718-1.205,1.601-1.483	c1.029-0.325,2.15-0.164,3.08,0.281V22.7c-0.83-0.426-1.82-0.641-2.66-0.361c-0.25,0.077-0.58,0.251-0.58,0.564	c0,0.751,0.87,0.893,1.2,1c0.34,0.106,0.71,0.203,1.11,0.406c0.4,0.194,1.202,0.678,1.202,1.783c0,1.058-0.522,1.447-0.952,1.621	c-0.89,0.387-1.68,0.319-2.45,0.213c-0.65-0.116-1.28-0.31-1.87-0.677C27,27.249,27,26.175,27,26.175z M20.25,21.012l1.5-0.002	l0.003,2.42c0.014,0.79,0.012,1.651,0.003,2.383c-0.035,0.391,0.402,0.847,0.976,0.917c0.306,0.034,0.534,0.009,0.886-0.14	c0.208-0.082,0.42-0.152,0.632-0.225V21.01l1.5,0.001v6.818h-1.5v-0.236c-0.041,0.022-0.08,0.046-0.12,0.067	c-0.381,0.228-0.992,0.386-1.514,0.343c-0.542-0.035-1.088-0.225-1.533-0.586c-0.442-0.356-0.776-0.915-0.819-1.529	c-0.027-0.88-0.02-1.634-0.011-2.457L20.25,21.012z M9.25,21.01h1.5v0.688c0.37-0.134,0.737-0.274,1.109-0.401	c0.535-0.19,1.206-0.152,1.733,0.141c0.218,0.117,0.409,0.282,0.577,0.469c0.562-0.208,1.123-0.417,1.689-0.611	c0.535-0.19,1.206-0.152,1.733,0.141c0.532,0.286,0.946,0.809,1.093,1.418c0.039,0.152,0.056,0.306,0.065,0.461l0.004,0.317	l0.006,0.625l-0.006,1.25l-0.003,2.5h-1.5l-0.006-4.844c-0.042-0.425-0.519-0.797-1.019-0.661c-0.51,0.135-1.024,0.255-1.537,0.379	c0.034,0.143,0.052,0.287,0.061,0.433l0.004,0.317l0.006,0.625l-0.006,1.25l-0.003,2.5h-1.5l-0.006-4.844	c-0.042-0.426-0.519-0.797-1.019-0.661c-0.489,0.13-0.983,0.245-1.475,0.364v5.14h-1.5C9.25,28.006,9.25,21.01,9.25,21.01z M38.768,33.932c-2.214,1.57-4.688,2.605-7.285,3.277c-2.595,0.663-5.297,0.914-7.986,0.729c-2.688-0.18-5.313-0.836-7.787-1.794	c-2.466-0.99-4.797-2.263-6.857-3.931c-0.107-0.087-0.124-0.245-0.037-0.352c0.077-0.095,0.209-0.119,0.313-0.063l0.014,0.008	c2.249,1.217,4.653,2.149,7.067,2.889c2.433,0.692,4.909,1.187,7.4,1.288c2.485,0.087,4.997-0.107,7.449-0.617	c2.442-0.504,4.905-1.236,7.17-2.279l0.039-0.018c0.251-0.115,0.547-0.006,0.663,0.245C39.035,33.537,38.961,33.796,38.768,33.932z M39.882,36.892c-0.278,0.21-0.556,0.14-0.417-0.21c0.417-1.12,1.32-3.501,0.903-4.061c-0.486-0.63-2.987-0.28-4.098-0.14	c-0.347,0-0.347-0.28-0.069-0.49c0.972-0.7,2.292-0.98,3.404-0.98c1.111,0,2.084,0.21,2.292,0.56	C42.243,31.99,41.757,35.281,39.882,36.892z"
                          />
                        </svg>
                      </div>
                      <span className="text-sm text-gray-300">Amazon</span>
                    </Link>
                  </div>
                </Card>
              </div>

              {/* Podcasts List */}
              <div className="flex-1">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-white">All Episodes</h2>
                  {/* Replaced filter div with "Showing X-Y of Z" text */}
                  <div className="text-gray-400 text-sm">
                    Showing {indexOfFirstPodcast + 1}-{Math.min(indexOfLastPodcast, filteredPodcasts.length)} of{" "}
                    {filteredPodcasts.length}
                  </div>
                </div>

                {currentPodcasts.length > 0 ? (
                  <div className="space-y-4">
                    {currentPodcasts.map((podcast) => {
                      // Ensure correct category display for all podcasts
                      const displayCategory = podcast.description.toLowerCase().includes('depin') 
                        ? "DePIN" 
                        : podcast.category;
                        
                      return (
                        <div
                          key={podcast.id}
                          className="bg-[#0D0B26]/80 border border-gray-800/50 rounded-xl p-4 hover:border-[#F7984A]/30 transition-all duration-300 group"
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
                                  {displayCategory}
                                </Badge>
                                <span className="text-sm text-gray-400">{podcast.date}</span>
                              </div>
                              <Link
                                href={`/podcasts/${podcast.id}`}
                                className="block group-hover:text-[#F7984A] transition-colors"
                              >
                                <h3 className="font-bold text-lg mb-2 text-white">{podcast.title}</h3>
                              </Link>
                              <p className="text-gray-300 text-sm mb-3">
                                {podcast.description.length > 150
                                  ? `${podcast.description.substring(0, 150)}...`
                                  : podcast.description}
                              </p>
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
                      );
                    })}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="w-16 h-16 bg-gray-800/50 rounded-full flex items-center justify-center mb-4">
                      <Search className="w-8 h-8 text-gray-500" />
                    </div>
                    <h3 className="text-xl font-medium mb-2 text-white">No episodes found</h3>
                    <p className="text-gray-400 max-w-md">
                      We couldn't find any podcast episodes matching your search criteria. Try adjusting your filters or
                      search term.
                    </p>
                  </div>
                )}

                {/* Improved Pagination to match the screenshot */}
                {filteredPodcasts.length > podcastsPerPage && (
                  <div className="flex justify-center mt-12">
                    <div className="flex items-center gap-2 bg-[#07071C] p-1 rounded-md">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-gray-300 hover:bg-gray-800/50 hover:text-white rounded-md px-4"
                        onClick={() => paginate(currentPage - 1)}
                        disabled={currentPage === 1}
                      >
                        Previous
                      </Button>

                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        // Show first page, last page, current page, and pages around current
                        let pageNum
                        if (totalPages <= 5) {
                          // If 5 or fewer pages, show all
                          pageNum = i + 1
                        } else if (currentPage <= 3) {
                          // Near start
                          pageNum = i + 1
                          if (i === 4) pageNum = totalPages
                        } else if (currentPage >= totalPages - 2) {
                          // Near end
                          pageNum = i === 0 ? 1 : totalPages - 4 + i
                        } else {
                          // Middle
                          pageNum = currentPage - 2 + i
                          if (i === 0) pageNum = 1
                          if (i === 4) pageNum = totalPages
                        }

                        // Determine if we need to show ellipsis
                        if ((i === 1 && pageNum > 2) || (i === 3 && pageNum < totalPages - 1)) {
                          return (
                            <span key={`ellipsis-${i}`} className="text-gray-500 px-2">
                              ...
                            </span>
                          )
                        }

                        return (
                          <Button
                            key={pageNum}
                            variant={currentPage === pageNum ? "default" : "ghost"}
                            size="sm"
                            className={cn(
                              "min-w-[40px] rounded-md",
                              currentPage === pageNum
                                ? "bg-[#1a1a2e] text-white border border-gray-700"
                                : "text-gray-300 hover:bg-gray-800/50 hover:text-white",
                            )}
                            onClick={() => paginate(pageNum)}
                          >
                            {pageNum}
                          </Button>
                        )
                      })}

                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-gray-300 hover:bg-gray-800/50 hover:text-white rounded-md px-4"
                        onClick={() => paginate(currentPage + 1)}
                        disabled={currentPage === totalPages}
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
      <Footer className="relative z-20" />
    </div>
  )
}