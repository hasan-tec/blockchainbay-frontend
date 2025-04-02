"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  X,
  Download,
  Copy,
  Check,
  ChevronDown,
  ExternalLink,
  Eye,
  FileText,
  Code,
  ImageIcon,
  Info,
  ArrowRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import Navbar from "@/components/Navbar"
import { Footer } from "@/components/NewsletterFooter"

// Types for Strapi data
// Update your interface types to match the actual data structure
interface StrapiMedia {
  id: number
  documentId: string
  name: string
  alternativeText: string | null
  caption: string | null
  width: number
  height: number
  formats: any
  hash: string
  ext: string
  mime: string
  size: number
  url: string
  previewUrl: string | null
  provider: string
  createdAt: string
  updatedAt: string
}

interface Wallpaper {
  id: number
  documentId: string
  name: string
  description: string | null
  dimensions: string
  type: "desktop" | "mobile"
  file: StrapiMedia
  thumbnail: StrapiMedia
  createdAt: string
  updatedAt: string
  publishedAt: string
  order: number
}

interface Logo {
  id: number
  documentId: string
  name: string
  description: string | null
  format: "svg" | "png" | "jpeg" | "vector" | "pdf"
  variation: "primary" | "white" | "black" | "icon"
  file: StrapiMedia
  createdAt: string
  updatedAt: string
  publishedAt: string
  order: number
}

interface StrapiResponse<T> {
  data: T[]
  meta: {
    pagination: {
      page: number
      pageSize: number
      pageCount: number
      total: number
    }
  }
}

export default function MediaKitPage() {
  const [scrolled, setScrolled] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("wallpapers")
  const [copiedLink, setCopiedLink] = useState<string | null>(null)
  const [expandedSection, setExpandedSection] = useState<string | null>(null)
  const [previewImage, setPreviewImage] = useState<string | null>(null)

  // State for Strapi data
  const [wallpapers, setWallpapers] = useState<Wallpaper[]>([])
  const [logos, setLogos] = useState<Logo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Add these right after your state declarations at the top of the component
  const [debug, setDebug] = useState<{
    wallpapersRaw: any
    logosRaw: any
    wallpapersProcessed: any
    logosProcessed: any
    error: string | null
  }>({
    wallpapersRaw: null,
    logosRaw: null,
    wallpapersProcessed: null,
    logosProcessed: null,
    error: null,
  })

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Fetch data from Strapi
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null)
      try {
        // Log the exact URL we're fetching from
        const wallpapersUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/wallpapers?populate=*`
        console.log("Fetching wallpapers from:", wallpapersUrl)

        const wallpapersRes = await fetch(wallpapersUrl)
        console.log("Wallpapers response status:", wallpapersRes.status)

        if (!wallpapersRes.ok) {
          throw new Error(`Failed to fetch wallpapers: ${wallpapersRes.status}`)
        }

        const wallpapersData = await wallpapersRes.json()
        console.log("Wallpapers raw data:", wallpapersData)
        setDebug((prev) => ({ ...prev, wallpapersRaw: wallpapersData }))

        // Check if wallpapersData has the expected structure
        if (!wallpapersData.data) {
          console.error("Unexpected wallpapers data structure:", wallpapersData)
          throw new Error("Unexpected wallpapers data structure")
        }

        const processedWallpapers = wallpapersData.data || []
        console.log("Processed wallpapers:", processedWallpapers)
        setDebug((prev) => ({ ...prev, wallpapersProcessed: processedWallpapers }))
        setWallpapers(processedWallpapers)

        // Same detailed logging for logos
        const logosUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/logos?populate=*`
        console.log("Fetching logos from:", logosUrl)

        const logosRes = await fetch(logosUrl)
        console.log("Logos response status:", logosRes.status)

        if (!logosRes.ok) {
          throw new Error(`Failed to fetch logos: ${logosRes.status}`)
        }

        const logosData = await logosRes.json()
        console.log("Logos raw data:", logosData)
        setDebug((prev) => ({ ...prev, logosRaw: logosData }))

        // Check if logosData has the expected structure
        if (!logosData.data) {
          console.error("Unexpected logos data structure:", logosData)
          throw new Error("Unexpected logos data structure")
        }

        const processedLogos = logosData.data || []
        console.log("Processed logos:", processedLogos)
        setDebug((prev) => ({ ...prev, logosProcessed: processedLogos }))
        setLogos(processedLogos)
      } catch (err) {
        console.error("Error fetching data:", err)
        setError(err instanceof Error ? err.message : "An error occurred")
        setDebug((prev) => ({ ...prev, error: err instanceof Error ? err.message : "An error occurred" }))
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
    document.documentElement.classList.toggle("dark")
  }

  const handleCopyLink = (url: string) => {
    const fullUrl = getFileUrl(url)
    navigator.clipboard.writeText(fullUrl)
    setCopiedLink(fullUrl)
    setTimeout(() => setCopiedLink(null), 2000)
  }

  const toggleSection = (section: string) => {
    if (expandedSection === section) {
      setExpandedSection(null)
    } else {
      setExpandedSection(section)
    }
  }

  const openPreview = (image: string) => {
    setPreviewImage(image)
    document.body.style.overflow = "hidden"
  }

  const closePreview = () => {
    setPreviewImage(null)
    document.body.style.overflow = "auto"
  }

  // Utility functions
  const getFileUrl = (path: string): string => {
    if (!path) return ""
    if (path.startsWith("http")) {
      return path
    }
    return `${process.env.NEXT_PUBLIC_STRAPI_API_URL}${path}`
  }

  const formatFileSize = (bytes: number): string => {
    if (!bytes || bytes === 0) return "0 Bytes"

    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const handleDownload = (url: string, filename: string) => {
    const fullUrl = getFileUrl(url)
    const a = document.createElement("a")
    a.href = fullUrl
    a.download = filename || "download"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  // Update these functions in your MediaKitPage component
  const handleDownloadAll = async () => {
    try {
      // Show some loading state if needed
      setLoading(true)

      // Make sure to use the correct API URL
      const downloadUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/downloads/all`
      console.log("Downloading all from:", downloadUrl)

      // Create a temporary anchor element to trigger the download
      const link = document.createElement("a")
      link.href = downloadUrl
      link.setAttribute("download", "blockchain-bay-media-kit.zip")
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.error("Error downloading all assets:", error)
      // Optionally show an error message to the user
      setError("Failed to download all assets. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  const handleDownloadCategory = async (category: string) => {
    try {
      // Show some loading state if needed
      setLoading(true)

      // Make sure to use the correct API URL
      const downloadUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/downloads/${category}`
      console.log("Downloading category from:", downloadUrl)

      // Create a temporary anchor element to trigger the download
      const link = document.createElement("a")
      link.href = downloadUrl
      link.setAttribute("download", `blockchain-bay-${category}.zip`)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.error(`Error downloading ${category}:`, error)
      // Optionally show an error message to the user
      setError(`Failed to download ${category}. Please try again later.`)
    } finally {
      setLoading(false)
    }
  }

  // Format data for logo formats display
  // Format data for logo formats display
  // Format data for logo formats display
  const logoFormats = [
    {
      id: "svg",
      name: "SVG",
      icon: <Code className="h-5 w-5 text-blue-400" />,
      description: "Scalable Vector Graphics format, ideal for web use and scaling to any size without quality loss.",
      files: logos
        .filter((logo) => logo.format === "svg")
        .map((logo) => ({
          id: logo.id,
          name: logo.name,
          size: logo.file?.size || 0,
          url: logo.file?.url || "",
          format: logo.format,
        })),
    },
    {
      id: "png",
      name: "PNG",
      icon: <ImageIcon className="h-5 w-5 text-green-400" />,
      description: "Transparent background, suitable for digital use on websites, presentations, and social media.",
      files: logos
        .filter((logo) => logo.format === "png")
        .map((logo) => ({
          id: logo.id,
          name: logo.name,
          size: logo.file?.size || 0,
          url: logo.file?.url || "",
          format: logo.format,
        })),
    },
    {
      id: "jpeg",
      name: "JPEG",
      icon: <ImageIcon className="h-5 w-5 text-yellow-400" />,
      description: "Compressed format with solid background, suitable for print materials and email signatures.",
      files: logos
        .filter((logo) => logo.format === "jpeg")
        .map((logo) => ({
          id: logo.id,
          name: logo.name,
          size: logo.file?.size || 0,
          url: logo.file?.url || "",
          format: logo.format,
        })),
    },
    {
      id: "vector",
      name: "Vector (AI)",
      icon: <Code className="h-5 w-5 text-orange-400" />,
      description: "Adobe Illustrator vector files for professional design work and high-quality printing.",
      files: logos
        .filter((logo) => logo.format === "vector")
        .map((logo) => ({
          id: logo.id,
          name: logo.name,
          size: logo.file?.size || 0,
          url: logo.file?.url || "",
          format: logo.format,
        })),
    },
    {
      id: "pdf",
      name: "Vector PDF",
      icon: <FileText className="h-5 w-5 text-red-400" />,
      description: "Vector PDF files that can be opened in various design software and maintain quality at any size.",
      files: logos
        .filter((logo) => logo.format === "pdf")
        .map((logo) => ({
          id: logo.id,
          name: logo.name,
          size: logo.file?.size || 0,
          url: logo.file?.url || "",
          format: logo.format,
        })),
    },
  ]

  return (
    <div className={cn("min-h-screen bg-[#07071C] text-white", isDarkMode ? "dark" : "")}>
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

      {/* Navigation */}
      <Navbar />

      {/* Main Content */}
      <main className="pt-32 pb-20 relative z-10">
        <div className="container mx-auto px-4 md:px-6">
          {/* Breadcrumb */}
          <div className="mb-8 text-sm text-gray-400">
            <nav className="flex" aria-label="Breadcrumb">
              <ol className="inline-flex items-center space-x-1 md:space-x-3">
                <li className="inline-flex items-center">
                  <Link href="/" className="inline-flex items-center text-gray-400 hover:text-[#F7984A]">
                    Home
                  </Link>
                </li>
                <li>
                  <div className="flex items-center">
                    <span className="mx-2 text-gray-600">/</span>
                    <span className="text-[#F7984A]">Media Kit</span>
                  </div>
                </li>
              </ol>
            </nav>
          </div>

          {/* Header */}
          <div className="max-w-4xl mx-auto mb-16">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white text-sm font-medium mb-6 backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-[#F7984A] mr-2 animate-pulse"></span>
              Brand Assets
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-white/70">
              Media Kit
            </h1>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Download official Blockchain Bay assets for press, partnerships, and promotional materials. Please follow
              our brand guidelines when using these assets.
            </p>
            <div className="flex flex-wrap gap-4">
              
              <Button
                variant="outline"
                className="border-white/20 hover:bg-white/10 px-6 py-6 rounded-lg transition-all duration-300 hover:-translate-y-1"
              >
                Brand Guidelines
                <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Info Box */}
          <div className="max-w-4xl mx-auto mb-12 p-6 bg-gradient-to-r from-[#F7984A]/10 to-blue-500/10 rounded-xl border border-[#F7984A]/20 backdrop-blur-sm">
            <div className="flex items-start gap-4">
              <div className="bg-[#F7984A]/20 p-2 rounded-full">
                <Info className="h-6 w-6 text-[#F7984A]" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Usage Guidelines</h3>
                <p className="text-gray-300">
                  All assets provided in this media kit are subject to our brand guidelines. Please ensure you read and
                  follow these guidelines when using our assets in your materials. For any questions or special
                  requests, please contact our brand team at{" "}
                  <a href="mailto:brand@blockchainbay.com" className="text-[#F7984A] hover:underline">
                    brand@blockchainbay.com
                  </a>
                  .
                </p>
              </div>
            </div>
          </div>

          {/* Show error if there is one */}
          {error && (
            <div className="max-w-4xl mx-auto mb-8 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-white">
              <p className="font-medium flex items-center">
                <X className="h-5 w-5 mr-2" /> Error: {error}
              </p>
              <p className="mt-2 text-sm opacity-80">Please check your API connection and try again.</p>
            </div>
          )}

         {/* Tabs */}
          <Tabs defaultValue="wallpapers" className="mb-16" onValueChange={setActiveTab}>
            <div className="max-w-4xl mx-auto mb-8">
              <TabsList className="w-full grid grid-cols-2 bg-[#121220] rounded-lg">
                <TabsTrigger
                  value="wallpapers"
                  className={cn(
                    "transition-colors py-3 font-medium",
                    "data-[state=active]:text-[#F7984A] data-[state=inactive]:text-white"
                  )}
                >
                  Wallpapers
                </TabsTrigger>
                <TabsTrigger
                  value="logos"
                  className={cn(
                    "transition-colors py-3 font-medium",
                    "data-[state=active]:text-[#F7984A] data-[state=inactive]:text-gray-400"
                  )}
                >
                  Logos
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Wallpapers Tab */}
            <TabsContent value="wallpapers" className="mt-8 max-w-6xl mx-auto">
              <div className="mb-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-8 w-1 bg-[#F7984A] rounded-full"></div>
                  <h2 className="text-2xl font-bold">Wallpapers</h2>
                </div>
                <p className="text-gray-300 leading-relaxed ml-11">
                  High-quality wallpapers for desktop and mobile devices. Click on any wallpaper to preview and
                  download. These wallpapers are designed to showcase the Blockchain Bay brand and are perfect for your
                  devices.
                </p>
              </div>

              {/* Desktop Wallpapers Section */}
              <div className="mb-12">
                <h3 className="text-xl font-semibold mb-6 text-[#F7984A] ml-11">Desktop Wallpapers</h3>
                {loading ? (
                  <div className="flex justify-center p-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#F7984A]"></div>
                  </div>
                ) : !wallpapers || wallpapers.filter((w) => w?.type === "desktop").length === 0 ? (
                  <div className="p-8 text-center bg-gray-800/30 rounded-lg border border-gray-700/50">
                    <p className="text-gray-400">No desktop wallpapers available.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
                    {wallpapers
                      .filter((w) => w?.type === "desktop")
                      .map((wallpaper) => (
                        <Card
                          key={wallpaper.id}
                          className="bg-[#0D0B26]/80 border border-gray-800/50 rounded-xl overflow-hidden hover:border-[#F7984A]/30 transition-all duration-300 group hover:shadow-lg hover:shadow-[#F7984A]/5"
                        >
                          <div className="relative aspect-video w-full overflow-hidden">
                            <Image
                              src={getFileUrl(wallpaper.thumbnail?.url || wallpaper.file?.url || "")}
                              alt={wallpaper.name}
                              width={600}
                              height={338}
                              className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                              <Button
                                variant="outline"
                                className="border-white text-white hover:bg-white/20 backdrop-blur-sm"
                                onClick={() => openPreview(getFileUrl(wallpaper.file?.url || ""))}
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                Preview
                              </Button>
                            </div>
                          </div>
                          <div className="p-6">
                            <h3 className="font-bold text-lg mb-2 group-hover:text-[#F7984A] transition-colors">
                              {wallpaper.name}
                            </h3>
                            <div className="flex items-center justify-between text-sm text-gray-400 mb-5">
                              <div className="flex items-center">
                                <ImageIcon className="h-4 w-4 mr-2 text-gray-500" />
                                <span>{wallpaper.dimensions}</span>
                              </div>
                              <span>{formatFileSize(wallpaper.file?.size || 0)}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-[#F7984A] hover:text-[#F7984A]/90 hover:bg-[#F7984A]/10 p-0"
                                onClick={() => handleCopyLink(wallpaper.file?.url || "")}
                              >
                                {copiedLink === getFileUrl(wallpaper.file?.url || "") ? (
                                  <>
                                    <Check className="mr-1 h-4 w-4" />
                                    Copied
                                  </>
                                ) : (
                                  <>
                                    <Copy className="mr-1 h-4 w-4" />
                                    Copy Link
                                  </>
                                )}
                              </Button>
                              <Button
                                size="sm"
                                className="bg-[#F7984A] hover:bg-[#F7984A]/90 text-white transition-all duration-300 hover:shadow-lg hover:shadow-[#F7984A]/20"
                                onClick={() =>
                                  handleDownload(wallpaper.file?.url || "", wallpaper.file?.name || "wallpaper.jpg")
                                }
                              >
                                <Download className="mr-1 h-4 w-4" />
                                Download
                              </Button>
                            </div>
                          </div>
                        </Card>
                      ))}
                  </div>
                )}
              </div>
              {/* Mobile Wallpapers */}
              <div>
                <h3 className="text-xl font-semibold mb-6 text-[#F7984A] ml-11">Mobile Wallpapers</h3>
                {loading ? (
                  <div className="flex justify-center p-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#F7984A]"></div>
                  </div>
                ) : !wallpapers || wallpapers.filter((w) => w?.type === "mobile").length === 0 ? (
                  <div className="p-8 text-center bg-gray-800/30 rounded-lg border border-gray-700/50">
                    <p className="text-gray-400">No mobile wallpapers available.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    {wallpapers
                      .filter((w) => w?.type === "mobile")
                      .map((wallpaper) => (
                        <Card
                          key={wallpaper.id}
                          className="bg-[#0D0B26]/80 border border-gray-800/50 rounded-xl overflow-hidden hover:border-[#F7984A]/30 transition-all duration-300 group hover:shadow-lg hover:shadow-[#F7984A]/5"
                        >
                          <div className="relative aspect-[9/16] w-full overflow-hidden">
                            <Image
                              src={getFileUrl(wallpaper.thumbnail?.url || wallpaper.file?.url || "")}
                              alt={wallpaper.name}
                              width={300}
                              height={600}
                              className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                              <Button
                                variant="outline"
                                className="border-white text-white hover:bg-white/20 backdrop-blur-sm"
                                onClick={() => openPreview(getFileUrl(wallpaper.file?.url || ""))}
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                Preview
                              </Button>
                            </div>
                          </div>
                          <div className="p-4">
                            <h3 className="font-bold text-base mb-2 group-hover:text-[#F7984A] transition-colors">
                              {wallpaper.name}
                            </h3>
                            <div className="flex items-center justify-between text-xs text-gray-400 mb-4">
                              <div className="flex items-center">
                                <ImageIcon className="h-3 w-3 mr-1 text-gray-500" />
                                <span>{wallpaper.dimensions}</span>
                              </div>
                              <span>{formatFileSize(wallpaper.file?.size || 0)}</span>
                            </div>
                            <Button
                              size="sm"
                              className="w-full bg-[#F7984A] hover:bg-[#F7984A]/90 text-white transition-all duration-300 hover:shadow-lg hover:shadow-[#F7984A]/20"
                              onClick={() =>
                                handleDownload(wallpaper.file?.url || "", wallpaper.file?.name || "wallpaper.jpg")
                              }
                            >
                              <Download className="mr-1 h-4 w-4" />
                              Download
                            </Button>
                          </div>
                        </Card>
                      ))}
                  </div>
                )}
              </div>
              {/* Download All Section */}
              
            </TabsContent>

            {/* Logos Tab */}
            <TabsContent value="logos" className="mt-8 max-w-6xl mx-auto">
              <div className="mb-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-8 w-1 bg-[#F7984A] rounded-full"></div>
                  <h2 className="text-2xl font-bold">Logo Assets</h2>
                </div>
                <p className="text-gray-300 leading-relaxed ml-11">
                  Official Blockchain Bay logos in various formats. Please use these logos according to our brand
                  guidelines. Our logo represents our brand identity and should be used consistently across all
                  platforms.
                </p>
              </div>

              {/* Logo Preview */}
              <div className="mb-12">
                <h3 className="text-xl font-semibold mb-6 text-[#F7984A] ml-11">Logo Variations</h3>
                {loading ? (
                  <div className="flex justify-center p-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#F7984A]"></div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Primary Logo (Light Background) */}
                    <div className="bg-[#0D0B26]/80 border border-gray-800/50 rounded-xl p-8 flex items-center justify-center">
                      <div className="w-full max-w-xs">
                        <div className="text-center mb-4 text-sm text-gray-400">Primary Logo (Light Background)</div>
                        {logos.find(
                          (logo) => logo.variation === "primary" && (logo.format === "svg" || logo.format === "png"),
                        ) ? (
                          <Image
                            src={getFileUrl(
                              logos.find(
                                (logo) =>
                                  logo.variation === "primary" && (logo.format === "svg" || logo.format === "png"),
                              )?.file?.url || "",
                            )}
                            alt="Blockchain Bay Logo"
                            width={400}
                            height={200}
                            className="w-full h-auto"
                          />
                        ) : (
                          <div className="p-4 border border-dashed border-gray-600 rounded-md text-center text-gray-400">
                            No primary logo available
                          </div>
                        )}
                      </div>
                    </div>

                    {/* White Logo (Dark Background) */}
                    <div className="bg-white rounded-xl p-8 flex items-center justify-center">
                      <div className="w-full max-w-xs">
                        <div className="text-center mb-4 text-sm text-gray-600">Primary Logo (Dark Background)</div>
                        {logos.find(
                          (logo) => logo.variation === "white" && (logo.format === "svg" || logo.format === "png"),
                        ) ? (
                          <Image
                            src={getFileUrl(
                              logos.find(
                                (logo) =>
                                  logo.variation === "white" && (logo.format === "svg" || logo.format === "png"),
                              )?.file?.url || "",
                            )}
                            alt="Blockchain Bay Logo (Dark Background)"
                            width={400}
                            height={200}
                            className="w-full h-auto"
                          />
                        ) : (
                          <div className="p-4 border border-dashed border-gray-300 rounded-md text-center text-gray-600">
                            No white logo available
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Logo Icon Only */}
              <div className="mb-12">
                <h3 className="text-xl font-semibold mb-6 text-[#F7984A] ml-11">Icon Only</h3>
                {loading ? (
                  <div className="flex justify-center p-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#F7984A]"></div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Primary Icon */}
                    <div className="bg-[#0D0B26]/80 border border-gray-800/50 rounded-xl p-8 flex items-center justify-center">
                      <div className="w-full max-w-xs">
                        <div className="text-center mb-4 text-sm text-gray-400">Primary Icon</div>
                        <div className="flex items-center justify-center">
                          {logos.find((logo) => logo.variation === "icon" && logo.format === "svg") ? (
                            <Image
                              src={getFileUrl(
                                logos.find((logo) => logo.variation === "icon" && logo.format === "svg")?.file?.url ||
                                  "",
                              )}
                              alt="Blockchain Bay Icon"
                              width={96}
                              height={96}
                              className="w-24 h-24"
                            />
                          ) : (
                            <div className="relative w-24 h-24">
                              <div className="absolute inset-0 bg-gradient-to-tr from-[#F7984A] to-[#F7984A]/80 rounded-lg blur-[2px]"></div>
                              <div className="absolute inset-0.5 bg-[#F7984A] rounded-lg flex items-center justify-center">
                                <svg
                                  width="48"
                                  height="48"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path d="M12 2L20 7V17L12 22L4 17V7L12 2Z" fill="white" />
                                </svg>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Black Icon */}
                    <div className="bg-white rounded-xl p-8 flex items-center justify-center">
                      <div className="w-full max-w-xs">
                        <div className="text-center mb-4 text-sm text-gray-600">Black Icon</div>
                        <div className="flex items-center justify-center">
                          {logos.find((logo) => logo.variation === "black" && logo.format === "svg") ? (
                            <Image
                              src={getFileUrl(
                                logos.find((logo) => logo.variation === "black" && logo.format === "svg")?.file?.url ||
                                  "",
                              )}
                              alt="Blockchain Bay Black Icon"
                              width={96}
                              height={96}
                              className="w-24 h-24"
                            />
                          ) : (
                            <div className="relative w-24 h-24">
                              <div className="absolute inset-0 bg-black rounded-lg blur-[1px]"></div>
                              <div className="absolute inset-0.5 bg-black rounded-lg flex items-center justify-center">
                                <svg
                                  width="48"
                                  height="48"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path d="M12 2L20 7V17L12 22L4 17V7L12 2Z" fill="white" />
                                </svg>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* White Icon */}
                    <div className="bg-gray-900 rounded-xl p-8 flex items-center justify-center">
                      <div className="w-full max-w-xs">
                        <div className="text-center mb-4 text-sm text-gray-400">White Icon</div>
                        <div className="flex items-center justify-center">
                          {logos.find((logo) => logo.variation === "white" && logo.format === "svg") ? (
                            <Image
                              src={getFileUrl(
                                logos.find((logo) => logo.variation === "white" && logo.format === "svg")?.file?.url ||
                                  "",
                              )}
                              alt="Blockchain Bay White Icon"
                              width={96}
                              height={96}
                              className="w-24 h-24"
                            />
                          ) : (
                            <div className="relative w-24 h-24">
                              <div className="absolute inset-0 bg-white rounded-lg blur-[1px]"></div>
                              <div className="absolute inset-0.5 bg-white rounded-lg flex items-center justify-center">
                                <svg
                                  width="48"
                                  height="48"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path d="M12 2L20 7V17L12 22L4 17V7L12 2Z" fill="#07071C" />
                                </svg>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Logo Formats */}
              <div className="mb-12">
                <h3 className="text-xl font-semibold mb-6 text-[#F7984A] ml-11">Available Formats</h3>
                {loading ? (
                  <div className="flex justify-center p-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#F7984A]"></div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {logoFormats
                      .filter((format) => format.files.length > 0)
                      .map((format) => (
                        <div
                          key={format.id}
                          className="bg-[#0D0B26]/80 border border-gray-800/50 rounded-xl overflow-hidden hover:border-[#F7984A]/30 transition-all duration-300"
                        >
                          <div
                            className="p-6 flex items-center justify-between cursor-pointer hover:bg-gray-800/30 transition-all duration-300"
                            onClick={() => toggleSection(format.id)}
                          >
                            <div className="flex items-center gap-4">
                              <div className="bg-[#0D0B26] p-3 rounded-lg border border-gray-700/50">{format.icon}</div>
                              <div>
                                <h3 className="font-bold text-xl">{format.name}</h3>
                                <p className="text-gray-400 text-sm mt-1">{format.description}</p>
                              </div>
                            </div>
                            <ChevronDown
                              className={cn(
                                "h-6 w-6 text-gray-400 transition-transform duration-300",
                                expandedSection === format.id && "transform rotate-180",
                              )}
                            />
                          </div>

                          {expandedSection === format.id && (
                            <div className="border-t border-gray-800/50 p-6">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {format.files.map((file, index) => (
                                  <div
                                    key={index}
                                    className="flex items-center justify-between p-4 bg-gray-800/30 rounded-lg hover:bg-gray-800/50 transition-all duration-300"
                                  >
                                    <div className="flex items-center">
                                      <div className="w-10 h-10 bg-[#F7984A]/10 rounded-md flex items-center justify-center mr-4">
                                        <span className="text-[#F7984A] font-medium">{format.name}</span>
                                      </div>
                                      <div>
                                        <p className="font-medium">{file.name}</p>
                                        <p className="text-sm text-gray-400">{formatFileSize(file.size)}</p>
                                      </div>
                                    </div>
                                    <Button
                                      size="sm"
                                      className="bg-[#F7984A] hover:bg-[#F7984A]/90 text-white transition-all duration-300 hover:shadow-lg hover:shadow-[#F7984A]/20"
                                      onClick={() => handleDownload(file.url, `${file.name}.${file.format}`)}
                                    >
                                      <Download className="mr-1 h-4 w-4" />
                                      Download
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                  </div>
                )}
              </div>

              
            </TabsContent>
          </Tabs>

          {/* Usage Guidelines */}
          <section className="mt-20 max-w-6xl mx-auto">
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-8 w-1 bg-[#F7984A] rounded-full"></div>
                <h2 className="text-2xl font-bold">Usage Guidelines</h2>
              </div>
              <p className="text-gray-300 leading-relaxed ml-11">
                To maintain brand consistency, please follow these guidelines when using our assets. Proper usage of our
                brand assets helps strengthen our brand identity.
              </p>
            </div>

            <div className="p-8 bg-gradient-to-r from-[#0D0B26]/80 via-gray-900/80 to-[#0D0B26]/80 border border-gray-800/50 rounded-2xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div>
                  <h3 className="text-xl font-semibold mb-6 text-[#F7984A] flex items-center">
                    <Check className="h-5 w-5 mr-2 text-green-500" />
                    Do's
                  </h3>
                  <ul className="space-y-5">
                    <li className="flex items-start">
                      <div className="bg-green-500/20 p-1 rounded-full mt-0.5 mr-3">
                        <Check className="h-4 w-4 text-green-500" />
                      </div>
                      <span className="text-gray-300 leading-relaxed">
                        Use the provided assets without altering colors, proportions, or elements
                      </span>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-green-500/20 p-1 rounded-full mt-0.5 mr-3">
                        <Check className="h-4 w-4 text-green-500" />
                      </div>
                      <span className="text-gray-300 leading-relaxed">
                        Maintain adequate spacing around logos (minimum clear space equal to the height of the icon)
                      </span>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-green-500/20 p-1 rounded-full mt-0.5 mr-3">
                        <Check className="h-4 w-4 text-green-500" />
                      </div>
                      <span className="text-gray-300 leading-relaxed">
                        Use the appropriate logo version for different backgrounds (light/dark)
                      </span>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-green-500/20 p-1 rounded-full mt-0.5 mr-3">
                        <Check className="h-4 w-4 text-green-500" />
                      </div>
                      <span className="text-gray-300 leading-relaxed">
                        Contact us for approval when using our assets in marketing materials
                      </span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-6 text-[#F7984A] flex items-center">
                    <X className="h-5 w-5 mr-2 text-red-500" />
                    Don'ts
                  </h3>
                  <ul className="space-y-5">
                    <li className="flex items-start">
                      <div className="bg-red-500/20 p-1 rounded-full mt-0.5 mr-3">
                        <X className="h-4 w-4 text-red-500" />
                      </div>
                      <span className="text-gray-300 leading-relaxed">
                        Alter the colors, proportions, or elements of the logo
                      </span>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-red-500/20 p-1 rounded-full mt-0.5 mr-3">
                        <X className="h-4 w-4 text-red-500" />
                      </div>
                      <span className="text-gray-300 leading-relaxed">
                        Add effects, shadows, or outlines to the logo that are not part of the original design
                      </span>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-red-500/20 p-1 rounded-full mt-0.5 mr-3">
                        <X className="h-4 w-4 text-red-500" />
                      </div>
                      <span className="text-gray-300 leading-relaxed">
                        Place the logo on busy backgrounds that reduce visibility or compromise legibility
                      </span>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-red-500/20 p-1 rounded-full mt-0.5 mr-3">
                        <X className="h-4 w-4 text-red-500" />
                      </div>
                      <span className="text-gray-300 leading-relaxed">
                        Use our assets to create misleading associations or endorsements
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="mt-10 p-6 bg-[#0D0B26] border border-gray-800/50 rounded-xl">
                <p className="text-gray-300 mb-4 leading-relaxed">
                  For any questions regarding the use of our brand assets or to request special permissions, please
                  contact our brand team. We're here to help ensure our brand is represented consistently.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link 
                  href="/contact">
                  <Button variant="outline" className="border-white/20 hover:bg-white/10 transition-all duration-300">
                    Contact Brand Team
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  </Link>
                  <Button variant="outline" className="border-white/20 hover:bg-white/10 transition-all duration-300">
                    Download Brand Guidelines
                    <Download className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Image Preview Modal */}
      {previewImage && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4" onClick={closePreview}>
          <div className="relative max-w-4xl w-full">
            <button
              className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-all duration-300"
              onClick={closePreview}
            >
              <X className="h-6 w-6" />
            </button>
            <Image
              src={previewImage || "/placeholder.svg"}
              alt="Preview"
              width={1200}
              height={800}
              className="w-full h-auto rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}

      {/* Footer */}
      <Footer className='relative z-20'/>
    </div>
  )
}

