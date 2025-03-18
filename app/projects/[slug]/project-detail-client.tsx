"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import Navbar from "@/components/Navbar"
import { Footer } from "@/components/NewsletterFooter"
import { ArrowUpRight, Globe, Mail, BarChart3, X } from "lucide-react"
import { CheckCircle, MessageCircle } from "lucide-react"
import YouTubeEmbed from "@/components/YouTubeEmbed"
import DuneData from "@/components/DuneData"

// Updated Logo interfaces to match API response
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
  DetailedDescription: DetailedDescriptionBlock[]
  CurrentStatus: string
  Category: string
  SubCategory: string | null
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
  AnalyticsOneHeader: string | null // New field from Strapi
  AnalyticsTwoHeader: string | null // New field from Strapi
  Logo?: Logo
}

interface DetailedDescriptionBlock {
  type: string
  children: {
    type: string
    text: string
    bold?: boolean
  }[]
}

export default function ProjectDetailClient({ project }: { project: CryptoProject }) {
  // State for scroll detection and dark mode
  const [scrolled, setScrolled] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [activeTab, setActiveTab] = useState("about")
  const [hoverSocial, setHoverSocial] = useState<string | null>(null)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)

    // Add animation delay for content load
    const timer = setTimeout(() => {
      setIsLoaded(true)
    }, 100)

    return () => {
      window.removeEventListener("scroll", handleScroll)
      clearTimeout(timer)
    }
  }, [])

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
    document.documentElement.classList.toggle("dark")
  }

  // Process detailed description blocks into sections
  const extractFAQs = (description: DetailedDescriptionBlock[] | undefined) => {
    if (!description) return []

    const faqs = []
    let currentQuestion = null
    let currentAnswer = []

    for (const block of description) {
      if (block.type === "paragraph" && block.children.some((child) => child.bold)) {
        // If we have a previous QA pair, save it
        if (currentQuestion && currentAnswer.length > 0) {
          faqs.push({
            question: currentQuestion,
            answer: currentAnswer,
          })
          currentAnswer = []
        }

        // New question
        currentQuestion = block.children.map((child) => child.text).join("")
      } else if (currentQuestion && block.type === "paragraph") {
        // Add to current answer
        currentAnswer.push(block.children.map((child) => child.text).join(""))
      }
    }

    // Add the last QA pair if exists
    if (currentQuestion && currentAnswer.length > 0) {
      faqs.push({
        question: currentQuestion,
        answer: currentAnswer,
      })
    }

    return faqs
  }

  const extractContent = (description: DetailedDescriptionBlock[] | undefined) => {
    if (!description) return { faqs: [], regularContent: [] }

    const faqs: { question: string; answer: string[] }[] = []
    const regularContent: string[] = []

    let currentQuestion: string | null = null
    let currentAnswer: string[] = []

    for (const block of description) {
      // Check if it's a paragraph with bold text (potential question)
      if (block.type === "paragraph" && block.children.some((child) => child.bold)) {
        // If we have a previous QA pair, save it
        if (currentQuestion && currentAnswer.length > 0) {
          faqs.push({
            question: currentQuestion,
            answer: currentAnswer,
          })
          currentAnswer = []
        }

        // New question
        currentQuestion = block.children.map((child) => child.text).join("")
      }
      // Check if it's a regular paragraph in a FAQ
      else if (currentQuestion && block.type === "paragraph") {
        // Add to current answer
        currentAnswer.push(block.children.map((child) => child.text).join(""))
      }
      // If it's a regular paragraph (not part of a FAQ)
      else if (block.type === "paragraph") {
        regularContent.push(block.children.map((child) => child.text).join(""))
      }
    }

    // Add the last QA pair if exists
    if (currentQuestion && currentAnswer.length > 0) {
      faqs.push({
        question: currentQuestion,
        answer: currentAnswer,
      })
    }

    return { faqs, regularContent }
  }

  const { faqs: faqSections, regularContent } = extractContent(project?.DetailedDescription)

  // Updated function to get project logo with proper URL handling
  const getProjectLogo = () => {
    if (project.Logo?.url) {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:1337"
      // If the URL starts with "/", append the backend URL
      const logoUrl = project.Logo.url.startsWith("/") ? `${backendUrl}${project.Logo.url}` : project.Logo.url

      return (
        <div className="w-full h-full flex items-center justify-center bg-white/5 backdrop-blur-sm">
          <Image
            src={logoUrl || "/placeholder.svg"}
            alt={project.title}
            width={100}
            height={100}
            className="max-w-[80%] max-h-[80%] object-contain"
          />
        </div>
      )
    } else {
      return (
        <div className="w-full h-full bg-gradient-to-tr from-[#F7984A]/30 to-[#F7984A]/10 flex items-center justify-center text-[#F7984A] font-bold text-4xl">
          {project.title.substring(0, 2)}
        </div>
      )
    }
  }

  return (
    <div className={cn("min-h-screen bg-[#07071C] text-white", isDarkMode ? "dark" : "")}>
      {/* Enhanced Background elements */}
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
          {/* Project Header with animation */}
          <div
            className={`mb-10 transition-all duration-700 ease-out ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
          >
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-10">
              <div className="relative w-28 h-28 md:w-36 md:h-36 group">
                {/* Animated glow effect */}
                <div className="absolute inset-0 bg-gradient-to-tr from-[#F7984A]/40 to-blue-400/40 rounded-xl blur-[8px] group-hover:blur-[12px] transition-all duration-500"></div>
                <div className="absolute inset-1 bg-[#0D0B26] rounded-xl flex items-center justify-center overflow-hidden">
                  {getProjectLogo()}
                </div>
                {/* Subtle animated border */}
                <div
                  className="absolute inset-[-2px] rounded-xl border-2 border-[#F7984A]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: "linear-gradient(to right, transparent, rgba(247,152,74,0.3), transparent)",
                    transform: "rotate(0deg)",
                    animation: "spin 8s linear infinite",
                  }}
                ></div>
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      {project.CurrentStatus === "Verified" && (
                        <div className="inline-flex items-center px-2 py-1 bg-[#F7984A]/20 text-[#F7984A] text-xs font-medium rounded-full hover:bg-[#F7984A]/30 transition-colors duration-300">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Verified Project
                        </div>
                      )}
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold flex items-center gap-3 bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-white/80">
                      {project.title}
                      {project.Symbol && (
                        <span className="text-2xl md:text-3xl font-semibold text-[#F7984A]">{project.Symbol}</span>
                      )}
                    </h1>
                    <div className="flex flex-wrap gap-2 mt-3">
                      <Badge className="bg-[#0D0B26] border border-blue-500/20 text-blue-400 hover:bg-blue-500/10 hover:border-blue-500/40 transition-all duration-300">
                        {project.Category}
                      </Badge>
                      {project.SubCategory && (
                        <Badge className="bg-[#0D0B26] border border-purple-500/20 text-purple-400 hover:bg-purple-500/10 hover:border-purple-500/40 transition-all duration-300">
                          {project.SubCategory}
                        </Badge>
                      )}
                      <Badge className="bg-[#0D0B26] border border-gray-500/20 text-gray-400 hover:bg-gray-500/10 hover:border-gray-500/40 transition-all duration-300">
                        {project.ChainType}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button
                      className="rounded-full bg-[#F7984A] hover:bg-[#F7984A]/90 text-white px-4 md:px-6 py-2 md:py-3 shadow-lg shadow-[#F7984A]/20 transition-all duration-300 hover:shadow-[#F7984A]/30 hover:translate-y-[-2px] group"
                      onClick={() => window.open(project.Website, "_blank")}
                    >
                      <span>Visit Website</span>
                      <ArrowUpRight className="ml-2 h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            {/* Navigation Tabs with animation */}
            <div className="mt-8 border-b border-gray-800">
              <Tabs
                defaultValue="about"
                className="w-full"
                onValueChange={(value) => {
                  setActiveTab(value)
                }}
              >
                <TabsList className="bg-transparent border-b border-gray-800/0 gap-2">
                  <TabsTrigger
                    value="about"
                    className="data-[state=active]:text-white data-[state=active]:border-[#F7984A] px-1 py-2 border-b-2 border-transparent rounded-none bg-transparent hover:text-white transition-all duration-300 relative group"
                  >
                    About
                    {/* Animated indicator */}
                    {activeTab === "about" && (
                      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-[#F7984A]/50 via-[#F7984A] to-[#F7984A]/50"></span>
                    )}
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#F7984A]/30 group-hover:w-full transition-all duration-300"></span>
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="about" className="mt-8 pt-0">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Main Content Area with staggered animation */}
                    <div className="md:col-span-2 space-y-10">
                      <div
                        className={`transition-all duration-700 ease-out delay-100 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
                      >
                        <div className="flex flex-wrap justify-between items-center mb-4">
                          <h2 className="text-2xl font-bold relative inline-block">
                            What is {project.title}?
                            <span className="absolute -bottom-1 left-0 w-1/3 h-0.5 bg-[#F7984A]/70"></span>
                          </h2>

                          {/* Social Links */}
                          <div className="flex items-center gap-2 mt-2 md:mt-0">
                            <Link
                              href={project.Website}
                              target="_blank"
                              className="flex items-center justify-center w-8 h-8 rounded-full bg-[#0D0B26] border border-gray-800/50 text-gray-300 hover:text-white hover:border-[#F7984A]/30 hover:bg-[#F7984A]/10 transition-all duration-300 relative group"
                              onMouseEnter={() => setHoverSocial("website")}
                              onMouseLeave={() => setHoverSocial(null)}
                            >
                              <Globe className="h-4 w-4 group-hover:scale-110 transition-transform duration-300" />
                              {hoverSocial === "website" && (
                                <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs bg-[#0D0B26] border border-gray-800/50 px-2 py-1 rounded whitespace-nowrap">
                                  Website
                                </span>
                              )}
                            </Link>

                            {project.Twitter && (
                              <Link
                                href={project.Twitter}
                                target="_blank"
                                className="flex items-center justify-center w-8 h-8 rounded-full bg-[#0D0B26] border border-gray-800/50 text-gray-300 hover:text-white hover:border-[#000000]/30 hover:bg-[#000000]/10 transition-all duration-300 relative group"
                                onMouseEnter={() => setHoverSocial("twitter")}
                                onMouseLeave={() => setHoverSocial(null)}
                              >
                                <X className="h-4 w-4 group-hover:scale-110 transition-transform duration-300" />
                                {hoverSocial === "twitter" && (
                                  <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs bg-[#0D0B26] border border-gray-800/50 px-2 py-1 rounded whitespace-nowrap">
                                    X
                                  </span>
                                )}
                              </Link>
                            )}

                            {project.Discord && (
                              <Link
                                href={project.Discord}
                                target="_blank"
                                className="flex items-center justify-center w-8 h-8 rounded-full bg-[#0D0B26] border border-gray-800/50 text-gray-300 hover:text-[#5865F2] hover:border-[#5865F2]/30 hover:bg-[#5865F2]/10 transition-all duration-300 relative group"
                                onMouseEnter={() => setHoverSocial("discord")}
                                onMouseLeave={() => setHoverSocial(null)}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 24 24"
                                  className="h-4 w-4 group-hover:scale-110 transition-transform duration-300"
                                  fill="currentColor"
                                >
                                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z" />
                                </svg>
                                {hoverSocial === "discord" && (
                                  <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs bg-[#0D0B26] border border-gray-800/50 px-2 py-1 rounded whitespace-nowrap">
                                    Discord
                                  </span>
                                )}
                              </Link>
                            )}

                            {project.Telegram && (
                              <Link
                                href={project.Telegram}
                                target="_blank"
                                className="flex items-center justify-center w-8 h-8 rounded-full bg-[#0D0B26] border border-gray-800/50 text-gray-300 hover:text-white hover:border-[#0088cc]/30 hover:bg-[#0088cc]/10 transition-all duration-300 relative group"
                                onMouseEnter={() => setHoverSocial("telegram")}
                                onMouseLeave={() => setHoverSocial(null)}
                              >
                                <MessageCircle className="h-4 w-4 group-hover:scale-110 transition-transform duration-300" />
                                {hoverSocial === "telegram" && (
                                  <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs bg-[#0D0B26] border border-gray-800/50 px-2 py-1 rounded whitespace-nowrap">
                                    Telegram
                                  </span>
                                )}
                              </Link>
                            )}
                          </div>
                        </div>
                        <p className="text-gray-300 leading-relaxed font-normal">{project.ShortDescription}</p>
                      </div>
                      {/* YouTube Embed if available */}
                      {project.VideoURL && (
                        <div
                          className={`space-y-4 transition-all duration-700 ease-out delay-200 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
                        >
                          <div className="flex justify-between items-center">
                            <h3 className="text-xl font-bold flex items-center gap-2">
                              <span className="text-[#F7984A]">🔥</span> Project Overview
                            </h3>

                            {/* Podcast Subscription Links */}
                            <div className="flex items-center gap-3">
                              <div className="hidden md:flex items-center text-sm text-gray-300 font-medium mr-1">
                                <span>Subscribe now</span>
                              </div>
                              <Link
                                href="https://spotify.com"
                                target="_blank"
                                className="flex items-center justify-center w-8 h-8 rounded-full bg-[#0D0B26] border border-gray-800/50 text-gray-300 hover:text-[#1DB954] hover:border-[#1DB954]/30 hover:bg-[#1DB954]/10 transition-all duration-300 relative group"
                                onMouseEnter={() => setHoverSocial("spotify")}
                                onMouseLeave={() => setHoverSocial(null)}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 24 24"
                                  className="h-4 w-4 group-hover:scale-110 transition-transform duration-300"
                                  fill="currentColor"
                                >
                                  <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.6 0 12 0zm5.52 17.28c-.24.36-.66.48-1.02.24-2.82-1.74-6.36-2.1-10.56-1.14-.42.12-.78-.18-.9-.54-.12-.42.18-.78.54-.9 4.56-1.02 8.52-.6 11.64 1.32.42.18.48.66.3 1.02zm1.44-3.3c-.3.42-.84.6-1.26.3-3.24-1.98-8.16-2.58-11.94-1.44-.48.12-.99-.12-1.11-.6-.12-.48.12-.99.6-1.11 4.38-1.32 9.78-.66 13.5 1.62.36.24.54.78.24 1.2l-.03.03zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.3c-.6.18-1.2-.18-1.38-.78-.18-.6.18-1.2.78-1.38 4.26-1.26 11.28-1.02 15.72 1.62.54.3.78 1.02.48 1.56-.3.42-1.02.66-1.56.36z" />
                                </svg>
                                {hoverSocial === "spotify" && (
                                  <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs bg-[#0D0B26] border border-gray-800/50 px-2 py-1 rounded whitespace-nowrap">
                                    Spotify
                                  </span>
                                )}
                              </Link>
                              <Link
                                href="https://podcasts.apple.com"
                                target="_blank"
                                className="flex items-center justify-center w-8 h-8 rounded-full bg-[#0D0B26] border border-gray-800/50 text-gray-300 hover:text-[#8c44ff] hover:border-[#8c44ff]/30 hover:bg-[#8c44ff]/10 transition-all duration-300 relative group"
                                onMouseEnter={() => setHoverSocial("apple")}
                                onMouseLeave={() => setHoverSocial(null)}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 24 24"
                                  className="h-4 w-4 group-hover:scale-110 transition-transform duration-300"
                                  fill="currentColor"
                                >
                                  <path d="M5.34 0A5.328 5.328 0 000 5.34v13.32A5.328 5.328 0 005.34 24h13.32A5.328 5.328 0 0024 18.66V5.34A5.328 5.328 0 0018.66 0H5.34zm6.525 2.568c2.336 0 3.776 1.36 3.776 3.4 0 1.936-1.272 3.168-3.248 3.384 1.952.336 3.512 1.568 3.512 3.656 0 2.72-2.096 4.256-4.832 4.256-2.4 0-4.288-1.344-4.528-3.568l2.144-.752c.16 1.376.912 1.984 2.4 1.984 1.376 0 2.32-.8 2.32-2.176 0-1.504-1.04-2.224-2.896-2.224h-.672v-2.24h.624c1.648 0 2.592-.64 2.592-1.984 0-1.232-.8-1.824-2.128-1.824-1.264 0-2.112.576-2.304 1.728l-2.016-.864c.528-1.808 2.128-2.816 4.256-2.776zm5.725 12.616h1.968v1.888h-1.968v-1.888z" />
                                </svg>
                                {hoverSocial === "apple" && (
                                  <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs bg-[#0D0B26] border border-gray-800/50 px-2 py-1 rounded whitespace-nowrap">
                                    Apple Podcast
                                  </span>
                                )}
                              </Link>
                              <Link
                                href="https://youtube.com"
                                target="_blank"
                                className="flex items-center justify-center w-8 h-8 rounded-full bg-[#0D0B26] border border-gray-800/50 text-gray-300 hover:text-[#FF0000] hover:border-[#FF0000]/30 hover:bg-[#FF0000]/10 transition-all duration-300 relative group"
                                onMouseEnter={() => setHoverSocial("youtube")}
                                onMouseLeave={() => setHoverSocial(null)}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 24 24"
                                  className="h-4 w-4 group-hover:scale-110 transition-transform duration-300"
                                  fill="currentColor"
                                >
                                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                                </svg>
                                {hoverSocial === "youtube" && (
                                  <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs bg-[#0D0B26] border border-gray-800/50 px-2 py-1 rounded whitespace-nowrap">
                                    YouTube
                                  </span>
                                )}
                              </Link>
                            </div>
                          </div>
                          <div className="rounded-xl overflow-hidden border border-gray-800/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-gray-700/70">
                            <YouTubeEmbed url={project.VideoURL} title={`${project.title} - Overview`} />
                          </div>
                        </div>
                      )}

                      {/* Add this after the YouTube section and before the FAQ section */}
                      {project.VideoURL && regularContent.length > 0 && (
                        <div
                          className={`space-y-4 transition-all duration-700 ease-out delay-250 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
                        >
                          <div className="space-y-4">
                            {regularContent.map((paragraph, index) => (
                              <p key={`regular-${index}`} className="text-gray-300 leading-relaxed font-normal">
                                {paragraph}
                              </p>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* FAQ Sections with staggered animation */}
                      {faqSections.length > 0 && (
                        <div className="space-y-10">
                          {faqSections.map((faq, index) => (
                            <div
                              key={index}
                              className={`transition-all duration-700 ease-out`}
                              style={{ transitionDelay: `${300 + index * 100}ms` }}
                            >
                              <h3 className="text-2xl font-bold mb-4 text-white">{faq.question}</h3>
                              {faq.answer.map((paragraph, pIndex) => (
                                <p key={pIndex} className="text-gray-300 leading-relaxed font-normal">
                                  {paragraph}
                                </p>
                              ))}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    {/* Sidebar with animation - Only show if Dune IDs exist */}
                    {(project.AnalyticsDuneQueryID || project.dunequeryid2) && (
                      <div
                        className={`space-y-8 transition-all duration-700 ease-out delay-300 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
                      >
                        {/* Unified Analytics Card */}
                        <Card className="bg-[#0A0918] border border-gray-800/50 rounded-xl overflow-hidden shadow-lg">
                          <div className="p-5 border-b border-gray-800/50">
                            <h3 className="font-bold text-xl text-white flex items-center">
                              <BarChart3 className="mr-2 h-5 w-5 text-[#F7984A]" />
                              {project.title} Analytics
                            </h3>
                          </div>

                          <div className="p-5 space-y-8">
                            {/* First Analytics Chart */}
                            {project.AnalyticsDuneQueryID && (
                              <div>
                                {project.AnalyticsOneHeader && (
                                  <h4 className="text-base font-bold text-white mb-3">{project.AnalyticsOneHeader}</h4>
                                )}
                                <div className="bg-[#0D0B26]/70 rounded-lg overflow-hidden">
                                  <DuneData queryId={project.AnalyticsDuneQueryID} title="" />
                                </div>
                              </div>
                            )}

                            {/* Second Analytics Chart */}
                            {project.dunequeryid2 && (
                              <div>
                                {project.AnalyticsTwoHeader && (
                                  <h4 className="text-base font-bold text-white mb-3">{project.AnalyticsTwoHeader}</h4>
                                )}
                                <div className="bg-[#0D0B26]/70 rounded-lg overflow-hidden">
                                  <DuneData queryId={project.dunequeryid2} title="" />
                                </div>
                              </div>
                            )}
                          </div>
                        </Card>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
          {/* Project Updates and Related Projects with animation */}
          <div
            className={`mt-20 grid grid-cols-1 lg:grid-cols-3 gap-8 transition-all duration-700 ease-out delay-400 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
          >
            {/* Project Updates */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold flex items-center gap-2 relative">
                  <span className="text-yellow-400">📣</span> Project updates
                  <span className="absolute -bottom-1 left-0 w-1/3 h-0.5 bg-yellow-400/50"></span>
                </h3>
                <Button variant="link" className="text-[#F7984A] hover:text-[#F7984A]/80 p-0 group">
                  View more
                  <ArrowUpRight className="ml-1 h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
                </Button>
              </div>
              <div className="space-y-4">
                <div className="flex gap-4 p-4 bg-[#0D0B26]/80 border border-gray-800/50 rounded-xl hover:border-gray-700/70 hover:bg-[#0D0B26] transition-all duration-300 hover:shadow-lg group">
                  <div className="w-12 h-12 shrink-0 rounded-lg overflow-hidden bg-gradient-to-br from-yellow-400/20 to-orange-500/20 group-hover:from-yellow-400/30 group-hover:to-orange-500/30 transition-all duration-300">
                    <Image
                      src="/placeholder.svg?height=60&width=60"
                      alt="Project update"
                      width={48}
                      height={48}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div>
                    <h4 className="font-medium leading-tight group-hover:text-[#F7984A]/90 transition-colors duration-300">
                      {project.title} Latest Updates Coming Soon
                    </h4>
                    <p className="text-sm text-gray-400 mt-1">Stay tuned</p>
                  </div>
                </div>
              </div>
            </div>
            {/* News Mentions */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold flex items-center gap-2 relative">
                  <span className="text-yellow-400">📰</span> News mentions
                  <span className="absolute -bottom-1 left-0 w-1/3 h-0.5 bg-yellow-400/50"></span>
                </h3>
                <Button variant="link" className="text-[#F7984A] hover:text-[#F7984A]/80 p-0 group">
                  View more
                  <ArrowUpRight className="ml-1 h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
                </Button>
              </div>
              <div className="space-y-4">
                <div className="flex gap-4 p-4 bg-[#0D0B26]/80 border border-gray-800/50 rounded-xl hover:border-gray-700/70 hover:bg-[#0D0B26] transition-all duration-300 hover:shadow-lg group">
                  <div className="w-12 h-12 shrink-0 rounded-lg overflow-hidden bg-gradient-to-br from-blue-400/20 to-purple-500/20 group-hover:from-blue-400/30 group-hover:to-purple-500/30 transition-all duration-300">
                    <Image
                      src="/placeholder.svg?height=60&width=60"
                      alt="News mention"
                      width={48}
                      height={48}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div>
                    <h4 className="font-medium leading-tight group-hover:text-[#F7984A]/90 transition-colors duration-300">
                      {project.title} News and Media Coverage
                    </h4>
                    <p className="text-sm text-gray-400 mt-1">Coming soon</p>
                  </div>
                </div>
              </div>
            </div>
            {/* Related Projects */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold flex items-center gap-2 relative">
                  <span className="text-yellow-400">☀️</span> Related projects
                  <span className="absolute -bottom-1 left-0 w-1/3 h-0.5 bg-yellow-400/50"></span>
                </h3>
              </div>
              <div className="space-y-4">
                <div className="flex gap-4 p-4 bg-[#0D0B26]/80 border border-gray-800/50 rounded-xl hover:border-gray-700/70 hover:bg-[#0D0B26] transition-all duration-300 hover:shadow-lg group">
                  <div className="w-10 h-10 shrink-0 rounded-full overflow-hidden bg-gradient-to-br from-green-400/20 to-teal-500/20 group-hover:from-green-400/30 group-hover:to-teal-500/30 transition-all duration-300">
                    <Image
                      src="/placeholder.svg?height=40&width=40"
                      alt="Related project"
                      width={40}
                      height={40}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform
 duration-300"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium group-hover:text-[#F7984A]/90 transition-colors duration-300">
                        Similar Projects
                      </h4>
                    </div>
                    <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                      Discover more projects in the {project.Category} category
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Newsletter with animation and hover effects */}
          <div
            className={`mt-16 p-8 bg-[#0D0B26]/80 border border-gray-800/50 rounded-xl hover:border-gray-700/70 transition-all duration-500 hover:shadow-lg relative overflow-hidden group transition-all duration-700 ease-out delay-500 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
          >
            {/* Background gradient effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#F7984A]/5 via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

            <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
              <div className="md:w-3/5">
                <h3 className="text-xl font-bold flex items-center gap-2 mb-3">
                  <Mail className="h-5 w-5 text-[#F7984A] group-hover:scale-110 transition-transform duration-300" />{" "}
                  CryptoHub Newsletter
                </h3>
                <p className="text-gray-300">
                  Stay updated with the latest developments about {project.title} and other crypto projects.
                </p>
              </div>
              <div className="md:w-2/5 w-full flex flex-col sm:flex-row gap-2">
                <Input
                  placeholder="Enter email address..."
                  className="flex-grow bg-[#07071C] border-gray-800/50 focus:border-[#F7984A]/50 focus:ring-[#F7984A]/20 placeholder:text-gray-500 transition-all duration-300"
                />
                <Button className="bg-[#F7984A] hover:bg-[#F7984A]/90 text-white shrink-0 shadow-md hover:shadow-lg hover:shadow-[#F7984A]/20 transition-all duration-300 hover:-translate-y-0.5">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
      {/* Footer */}
      <Footer className="relative z-20" />
    </div>
  )
}

