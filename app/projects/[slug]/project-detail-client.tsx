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
import { ChevronDown } from "lucide-react"
import MoreLinksModal from "@/components/MoreLinksModal" // Path to the new component


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

// Update your CryptoProject interface to include AdditionalLinks
interface AdditionalLink {
  id: number
  label: string
  url: string
  bgColorClass?: string
  textColorClass?: string
}

// Define a proper interface for Link items
interface LinkItem {
  label: string;
  url: string;
  bgColorClass?: string;
  textColorClass?: string;
  sortOrder?: number;
}

// Interface for the Link object as it comes from Strapi
interface StrapiLink {
  id: number;
  label: string;
  url: string;
  bgColorClass?: string;
  textColorClass?: string;
  sortOrder?: number;
  // Additional Strapi fields
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
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
  AnalyticsOneHeader: string | null
  AnalyticsTwoHeader: string | null
  // Updated to handle Strapi's data structure
  Link?: StrapiLink | StrapiLink[] | null
  // For backward compatibility
  AdditionalLinks?: LinkItem[]
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
  const [isMoreLinksOpen, setIsMoreLinksOpen] = useState(false)
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

  const getAllLinks = (project: CryptoProject): LinkItem[] => {
    // Start with the basic links that are already in the project model
    const links: LinkItem[] = [
      project.Website && {
        label: "Website",
        url: project.Website,
        bgColorClass: "hover:bg-[#F7984A]/10",
        textColorClass: "text-gray-300 hover:text-[#F7984A]"
      },
      project.Twitter && {
        label: "Twitter",
        url: project.Twitter,
        bgColorClass: "hover:bg-black/10",
        textColorClass: "text-gray-300 hover:text-white"
      },
      project.Discord && {
        label: "Discord",
        url: project.Discord,
        bgColorClass: "hover:bg-[#5865F2]/10",
        textColorClass: "text-gray-300 hover:text-[#5865F2]"
      },
      project.Telegram && {
        label: "Telegram",
        url: project.Telegram,
        bgColorClass: "hover:bg-[#0088cc]/10",
        textColorClass: "text-gray-300 hover:text-[#0088cc]"
      }
    ].filter(Boolean) as LinkItem[];
  
    // Handle Link relation from Strapi
    if (project.Link) {
      // Check if it's an array of links
      if (Array.isArray(project.Link)) {
        project.Link.forEach(link => {
          if (link && typeof link === 'object' && 'url' in link && 'label' in link) {
            links.push({
              label: link.label,
              url: link.url,
              bgColorClass: link.bgColorClass || "hover:bg-gray-800",
              textColorClass: link.textColorClass || "text-gray-300 hover:text-white"
            });
          }
        });
      } 
      // If it's a single link object
      else if (typeof project.Link === 'object' && 'url' in project.Link && 'label' in project.Link) {
        links.push({
          label: project.Link.label as string,
          url: project.Link.url as string,
          bgColorClass: (project.Link.bgColorClass as string) || "hover:bg-gray-800",
          textColorClass: (project.Link.textColorClass as string) || "text-gray-300 hover:text-white"
        });
      }
    }
  
    // For backward compatibility, also check AdditionalLinks
    if (project.AdditionalLinks && Array.isArray(project.AdditionalLinks)) {
      project.AdditionalLinks.forEach((link: any) => {
        if (link && typeof link === 'object' && 'url' in link && 'label' in link) {
          links.push({
            label: link.label,
            url: link.url,
            bgColorClass: link.bgColorClass || "hover:bg-gray-800",
            textColorClass: link.textColorClass || "text-gray-300 hover:text-white"
          });
        }
      });
    }
  
    return links;
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
                            
                            {/* More Links Button */}
                            <button
                              className="flex items-center justify-center w-8 h-8 rounded-full bg-[#0D0B26] border border-gray-800/50 text-gray-300 hover:text-[#F7984A] hover:border-[#F7984A]/30 hover:bg-[#F7984A]/10 transition-all duration-300 relative group"
                              onClick={() => setIsMoreLinksOpen(true)}
                              onMouseEnter={() => setHoverSocial("more")}
                              onMouseLeave={() => setHoverSocial(null)}
                            >
                              <ChevronDown className="h-4 w-4 group-hover:scale-110 transition-transform duration-300" />
                              {hoverSocial === "more" && (
                                <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs bg-[#0D0B26] border border-gray-800/50 px-2 py-1 rounded whitespace-nowrap">
                                  More Links
                                </span>
                              )}
                            </button>

                            {/* More Links Modal */}
                           <MoreLinksModal 
                              isOpen={isMoreLinksOpen} 
                              onClose={() => setIsMoreLinksOpen(false)} 
                              links={getAllLinks(project)}
                            />
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
                                href="https://open.spotify.com/show/6FB6i8Yc16Z0XAIu85EMOq?si=98a85f70763c47e0&nd=1&dlsi=ceafe8b78f7f403a"
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
                                href="https://podcasts.apple.com/us/podcast/blockchain-bay/id1643516087"
                                target="_blank"
                                className="flex items-center justify-center w-8 h-8 rounded-full bg-[#0D0B26] border border-gray-800/50 text-gray-300 hover:text-[#8c44ff] hover:border-[#8c44ff]/30 hover:bg-[#8c44ff]/10 transition-all duration-300 relative group"
                                onMouseEnter={() => setHoverSocial("apple")}
                                onMouseLeave={() => setHoverSocial(null)}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 50 50"
                                  className="h-4 w-4 group-hover:scale-110 transition-transform duration-300"
                                  fill="currentColor"
                                >
                                  <path d="M25.009,1.982c-12.687,0-23.009,10.322-23.009,23.01s10.322,23.009,23.009,23.009s23.009-10.321,23.009-23.009 S37.696,1.982,25.009,1.982z M34.748,35.913c-0.311,0.749-1.041,1.25-1.876,1.25c-0.258,0-0.52-0.049-0.773-0.153 c-2.334-0.955-4.805-1.438-7.338-1.438c-2.533,0-5.004,0.483-7.337,1.438c-1.031,0.423-2.203-0.071-2.625-1.098 c-0.423-1.027,0.071-2.203,1.098-2.625c2.791-1.146,5.747-1.726,8.864-1.726c3.115,0,6.072,0.58,8.864,1.726 C34.676,33.71,35.171,34.885,34.748,35.913z M36.893,29.317c-0.378,0.909-1.268,1.51-2.265,1.51 c-0.311,0-0.627-0.06-0.933-0.185c-2.827-1.155-5.824-1.741-8.9-1.741c-3.076,0-6.073,0.586-8.898,1.741 c-1.245,0.51-2.673-0.086-3.184-1.326c-0.512-1.24,0.086-2.673,1.325-3.183c3.377-1.383,6.947-2.084,10.757-2.084 c3.812,0,7.383,0.701,10.761,2.084C36.806,26.644,37.404,28.076,36.893,29.317z M38.431,21.719 c-0.444,0-0.891-0.107-1.301-0.33c-3.317-1.745-7.215-2.623-11.226-2.623c-4.468,0-8.275,0.879-11.293,2.623 c-1.458,0.766-3.248,0.19-4.002-1.268c-0.775-1.458-0.2-3.248,1.268-4.013c3.792-1.989,8.275-2.989,14.027-2.989 c5.135,0,9.977,1,14.016,2.989c1.458,0.765,2.023,2.555,1.257,4.013C40.52,21.144,39.485,21.719,38.431,21.719z"/>
                                </svg>
                                {hoverSocial === "apple" && (
                                  <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs bg-[#0D0B26] border border-gray-800/50 px-2 py-1 rounded whitespace-nowrap">
                                    Apple Podcast
                                  </span>
                                )}
                              </Link>
                              <Link
                                href="https://music.amazon.com/podcasts"
                                target="_blank"
                                className="flex items-center justify-center w-8 h-8 rounded-full bg-[#0D0B26] border border-gray-800/50 text-gray-300 hover:text-[#FF9900] hover:border-[#FF9900]/30 hover:bg-[#FF9900]/10 transition-all duration-300 relative group"
                                onMouseEnter={() => setHoverSocial("amazon")}
                                onMouseLeave={() => setHoverSocial(null)}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 24 24"
                                  className="h-4 w-4 group-hover:scale-110 transition-transform duration-300"
                                  fill="currentColor"
                                >
                                  <path d="M15.93 11.9c-.2 0-.39.1-.47.29-.08.19-.03.39.13.51.01.01.14.12.14.31 0 .18-.13.3-.14.31-.16.12-.21.32-.13.51.08.19.27.29.47.29h.02c.41-.02.87-.4.87-.95v-.32c0-.56-.45-.93-.87-.95h-.02zM14.97 14.95h-1.05c-.25 0-.47-.22-.47-.47v-1c0-.25.22-.47.47-.47h1.05c.25 0 .47.22.47.47v1c0 .25-.22.47-.47.47zM14.97 12.79h-1.05c-.25 0-.47-.22-.47-.47v-1c0-.25.22-.47.47-.47h1.05c.25 0 .47.22.47.47v1c0 .25-.22.47-.47.47zM2.03 11.9c-.2 0-.39.1-.47.29-.08.19-.03.39.13.51.01.01.14.12.14.31 0 .18-.13.3-.14.31-.16.12-.21.32-.13.51.08.19.27.29.47.29h.02c.41-.02.87-.4.87-.95v-.32c0-.56-.45-.93-.87-.95h-.02zM3 14.95H1.95c-.25 0-.47-.22-.47-.47v-1c0-.25.22-.47.47-.47H3c.25 0 .47.22.47.47v1c0 .25-.22.47-.47.47zM3 12.79H1.95c-.25 0-.47-.22-.47-.47v-1c0-.25.22-.47.47-.47H3c.25 0 .47.22.47.47v1c0 .25-.22.47-.47.47zM8.98 15.91c-1.18 0-2.05-1.28-2.05-2.96s.87-2.96 2.05-2.96 2.05 1.28 2.05 2.96-.87 2.96-2.05 2.96zM9 11.07c-.71 0-1.16.85-1.16 1.88S8.29 14.83 9 14.83s1.16-.85 1.16-1.88S9.71 11.07 9 11.07zM18 0H6C2.7 0 0 2.7 0 6v12c0 3.3 2.7 6 6 6h12c3.3 0 6-2.7 6-6V6c0-3.3-2.7-6-6-6zm2.15 13.86c-.16 1.11-1.01 2.07-2.12 2.4-.35.1-.71.15-1.07.15-.82 0-1.59-.29-2.22-.83-.62.54-1.41.83-2.22.83-.36 0-.72-.05-1.07-.15-1.11-.33-1.95-1.29-2.12-2.4-.22-1.38.47-2.99 1.45-3.89-.55-2.5.65-4.97 3.13-5.09 1.4-.05 2.64.82 3.27 2.3.54-.28 1.13-.54 1.7-.61.41-.05.83.17 1.01.54.18.37.11.81-.17 1.11-.31.33-.38.5-1.36 1.02-.05.03-.17.1-.17.1 1.46.98 2.63 3.02 2.37 4.79zM8.02 6.11c-.58 0-1.05.47-1.05 1.05v.56c0 .58.47 1.05 1.05 1.05s1.05-.47 1.05-1.05v-.56c0-.58-.47-1.05-1.05-1.05zM15.98 6.11c-.58 0-1.05.47-1.05 1.05v.56c0 .58.47 1.05 1.05 1.05s1.05-.47 1.05-1.05v-.56c0-.58-.47-1.05-1.05-1.05z"/>
                                </svg>
                                {hoverSocial === "amazon" && (
                                  <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs bg-[#0D0B26] border border-gray-800/50 px-2 py-1 rounded whitespace-nowrap">
                                    Amazon Music
                                  </span>
                                )}
                              </Link>
                              <Link
                                href="https://www.youtube.com/@chrisbagnell"
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
                              <Link
                                href="https://x.com" 
                                target="_blank"
                                className="flex items-center justify-center w-8 h-8 rounded-full bg-[#0D0B26] border border-gray-800/50 text-gray-300 hover:text-white hover:border-white/30 hover:bg-black/20 transition-all duration-300 relative group"
                                onMouseEnter={() => setHoverSocial("x")}
                                onMouseLeave={() => setHoverSocial(null)}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 24 24"
                                  className="h-4 w-4 group-hover:scale-110 transition-transform duration-300"
                                  fill="currentColor"
                                >
                                  <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
                                </svg>
                                {hoverSocial === "x" && (
                                  <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs bg-[#0D0B26] border border-gray-800/50 px-2 py-1 rounded whitespace-nowrap">
                                    X
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

