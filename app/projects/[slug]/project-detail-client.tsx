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
import { ArrowUpRight, Globe, Mail, Twitter, BarChart3 } from "lucide-react"
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

  const faqSections = extractFAQs(project?.DetailedDescription)

  // Updated function to get project logo with proper URL handling
  const getProjectLogo = () => {
    if (project.Logo?.url) {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:1337"
      // If the URL starts with "/", append the backend URL
      const logoUrl = project.Logo.url.startsWith("/") ? `${backendUrl}${project.Logo.url}` : project.Logo.url

      return (
        <Image
          src={logoUrl || "/placeholder.svg"}
          alt={project.title}
          width={120}
          height={120}
          className="w-full h-full object-cover"
        />
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
              <div className="relative w-24 h-24 md:w-32 md:h-32 group">
                {/* Animated glow effect */}
                <div className="absolute inset-0 bg-gradient-to-tr from-[#F7984A]/40 to-blue-400/40 rounded-full blur-[8px] group-hover:blur-[12px] transition-all duration-500"></div>
                <div className="absolute inset-1 bg-[#0D0B26] rounded-full flex items-center justify-center overflow-hidden">
                  {getProjectLogo()}
                </div>
                {/* Subtle rotating border */}
                <div
                  className="absolute inset-[-2px] rounded-full border-2 border-[#F7984A]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
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
                        <h2 className="text-2xl font-bold mb-4 relative inline-block">
                          What is {project.title}?
                          <span className="absolute -bottom-1 left-0 w-1/3 h-0.5 bg-[#F7984A]/70"></span>
                        </h2>
                        <p className="text-gray-300 leading-relaxed">{project.ShortDescription}</p>
                      </div>
                      {/* YouTube Embed if available */}
                      {project.VideoURL && (
                        <div
                          className={`space-y-4 transition-all duration-700 ease-out delay-200 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
                        >
                          <h3 className="text-xl font-bold flex items-center gap-2">
                            <span className="text-[#F7984A]">🔥</span> Project Overview
                          </h3>
                          <div className="rounded-xl overflow-hidden border border-gray-800/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-gray-700/70">
                            <YouTubeEmbed url={project.VideoURL} title={`${project.title} - Overview`} />
                          </div>
                        </div>
                      )}
                      {/* FAQ Sections with staggered animation */}
                      {faqSections.length > 0 && (
                        <div className="space-y-8">
                          {faqSections.map((faq, index) => (
                            <div
                              key={index}
                              className={`space-y-4 transition-all duration-700 ease-out bg-[#0D0B26]/30 p-6 rounded-xl border border-gray-800/30 hover:border-gray-700/50 hover:bg-[#0D0B26]/50 transition-all duration-300`}
                              style={{ transitionDelay: `${300 + index * 100}ms` }}
                            >
                              <h3 className="text-xl font-bold text-[#F7984A]/90">{faq.question}</h3>
                              {faq.answer.map((paragraph, pIndex) => (
                                <p key={pIndex} className="text-gray-300 leading-relaxed">
                                  {paragraph}
                                </p>
                              ))}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    {/* Sidebar with animation */}
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
                           
                            <div className="bg-[#0D0B26]/70 rounded-lg overflow-hidden">
                              <DuneData 
                                queryId={project.AnalyticsDuneQueryID} 
                                title="" 
                              />
                            </div>
                          </div>
                        )}

                        {/* Second Analytics Chart */}
                        {project.dunequeryid2 && (
                          <div>
                          
                            <div className="bg-[#0D0B26]/70 rounded-lg overflow-hidden">
                              <DuneData 
                                queryId={project.dunequeryid2}
                                title=""
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </Card>

                      {/* Subscribe with hover effects */}
                      <div className="space-y-5">
                        <h3 className="font-bold text-lg relative inline-block">
                          Subscribe for updates
                          <span className="absolute -bottom-1 left-0 w-1/2 h-0.5 bg-[#F7984A]/50"></span>
                        </h3>
                        <div className="flex items-center gap-2">
                          <Link
                            href={project.Website}
                            target="_blank"
                            className="flex items-center justify-center w-10 h-10 rounded-full bg-[#0D0B26] border border-gray-800/50 text-gray-300 hover:text-white hover:border-[#F7984A]/30 hover:bg-[#F7984A]/10 transition-all duration-300 relative group"
                            onMouseEnter={() => setHoverSocial("website")}
                            onMouseLeave={() => setHoverSocial(null)}
                          >
                            <Globe className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
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
                              className="flex items-center justify-center w-10 h-10 rounded-full bg-[#0D0B26] border border-gray-800/50 text-gray-300 hover:text-white hover:border-[#1DA1F2]/30 hover:bg-[#1DA1F2]/10 transition-all duration-300 relative group"
                              onMouseEnter={() => setHoverSocial("twitter")}
                              onMouseLeave={() => setHoverSocial(null)}
                            >
                              <Twitter className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                              {hoverSocial === "twitter" && (
                                <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs bg-[#0D0B26] border border-gray-800/50 px-2 py-1 rounded whitespace-nowrap">
                                  Twitter
                                </span>
                              )}
                            </Link>
                          )}
                          {project.Discord && (
                            <Link
                              href={project.Discord}
                              target="_blank"
                              className="flex items-center justify-center w-10 h-10 rounded-full bg-[#0D0B26] border border-gray-800/50 text-gray-300 hover:text-white hover:border-[#5865F2]/30 hover:bg-[#5865F2]/10 transition-all duration-300 relative group"
                              onMouseEnter={() => setHoverSocial("discord")}
                              onMouseLeave={() => setHoverSocial(null)}
                            >
                              <MessageCircle className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
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
                              className="flex items-center justify-center w-10 h-10 rounded-full bg-[#0D0B26] border border-gray-800/50 text-gray-300 hover:text-white hover:border-[#0088cc]/30 hover:bg-[#0088cc]/10 transition-all duration-300 relative group"
                              onMouseEnter={() => setHoverSocial("telegram")}
                              onMouseLeave={() => setHoverSocial(null)}
                            >
                              <MessageCircle className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                              {hoverSocial === "telegram" && (
                                <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs bg-[#0D0B26] border border-gray-800/50 px-2 py-1 rounded whitespace-nowrap">
                                  Telegram
                                </span>
                              )}
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
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
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
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

