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
import ProjectFeedSection from "@/components/ProjectFeedSection";

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

// Define a type for related projects coming from Strapi API
// Updated RelatedProject interface based on the actual API response
interface RelatedProject {
  id: number;
  documentId: string;
  title: string;
  Slug: string;
  ShortDescription: string;
  DetailedDescription?: any[];
  CurrentStatus?: string;
  Category: string;
  SubCategory?: string | null;
  TokenType?: string;
  Website?: string;
  Symbol?: string;
  ChainType?: string;
  LaunchDate?: string | null;
  VideoURL?: string;
  Twitter?: string | null;
  Telegram?: string | null;
  Discord?: string | null;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
  Logo?: Logo;
  // Add any other properties you see in your API response
}

// Interface for news articles
interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  image: string;
  categories: string[];
  date: string;
  readTime: string;
  source: string;
  featured: boolean;
  link: string;
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
  const [newsArticles, setNewsArticles] = useState<NewsArticle[]>([])
  const [relatedProjects, setRelatedProjects] = useState<RelatedProject[]>([])
  const [isLoadingNews, setIsLoadingNews] = useState(true)
  const [isLoadingRelated, setIsLoadingRelated] = useState(true)

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

  // Fetch news articles related to the project
  useEffect(() => {
    const fetchNews = async () => {
      try {
        setIsLoadingNews(true)
        const response = await fetch('/api/news')
        const data = await response.json()
        
        // Filter news that might be related to the project based on keywords
        const keywords = [
          project.title.toLowerCase(),
          project.Symbol?.toLowerCase() || '',
          project.Category.toLowerCase(),
          project.SubCategory?.toLowerCase() || '',
          project.ChainType.toLowerCase()
        ].filter(Boolean)

        const filteredNews = data.filter((article: NewsArticle) => {
          const articleText = (article.title + ' ' + article.summary).toLowerCase()
          return keywords.some(keyword => articleText.includes(keyword))
        })

        // If no matches, just take some recent articles
        const relevantNews = filteredNews.length > 0 ? filteredNews : data.slice(0, 4)
        setNewsArticles(relevantNews.slice(0, 4)) // Limit to 4 for the 2x2 grid
      } catch (error) {
        console.error('Error fetching news:', error)
        setNewsArticles([]) // Empty array on error
      } finally {
        setIsLoadingNews(false)
      }
    }

    fetchNews()
  }, [project])

  // Fetch related projects
  useEffect(() => {
    const fetchRelatedProjects = async () => {
      try {
        setIsLoadingRelated(true)
        // Use environment variable for API URL
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://127.0.0.1:1337'
        
        // First fetch projects with same Category
        const categoryQuery = encodeURIComponent(project.Category)
        const filterString = `filters[Category][$eq]=${categoryQuery}&filters[id][$ne]=${project.id}`
        const url = `${backendUrl}/api/crypto-projects?${filterString}&populate=*`
        
        console.log('Fetching related projects by category:', url)
        
        const response = await fetch(url)
        if (!response.ok) {
          throw new Error(`API response error with status: ${response.status}`)
        }
        
        const data = await response.json()
        console.log('Related projects API response:', data)
        
        // If no category matches, try getting any projects
        if (!data.data || data.data.length === 0) {
          console.log('No related projects with matching category found, trying any projects')
          
          const anyProjectsUrl = `${backendUrl}/api/crypto-projects?filters[id][$ne]=${project.id}&populate=*&pagination[limit]=4`
          console.log('Fetching any projects:', anyProjectsUrl)
          
          const anyResponse = await fetch(anyProjectsUrl)
          if (!anyResponse.ok) {
            throw new Error(`API response error with status: ${anyResponse.status}`)
          }
          
          const anyData = await anyResponse.json()
          console.log('Any projects API response:', anyData)
          
          if (anyData.data && anyData.data.length > 0) {
            console.log(`Setting ${anyData.data.length} related projects from any query`)
            setRelatedProjects(anyData.data)
          } else {
            console.log('No related projects found at all')
            setRelatedProjects([])
          }
        } else {
          console.log(`Setting ${data.data.length} related projects from category query`)
          setRelatedProjects(data.data)
        }
      } catch (error) {
        console.error('Error fetching related projects:', error)
        // For debugging
        console.log('Project being used:', project)
        setRelatedProjects([]) // Empty array on error
      } finally {
        setIsLoadingRelated(false)
      }
    }

    // Make sure we have a project with a Category before trying to fetch
    if (project && project.Category) {
      fetchRelatedProjects()
    } else {
      console.log('Cannot fetch related projects: project or Category missing')
      setIsLoadingRelated(false)
    }
  }, [project])

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

// Updated function to get related project logo
const getRelatedProjectLogo = (relatedProject: RelatedProject) => {
  if (relatedProject.Logo && relatedProject.Logo.url) {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:1337";
    // If the URL starts with "/", append the backend URL
    const logoUrl = relatedProject.Logo.url.startsWith("/") 
      ? `${backendUrl}${relatedProject.Logo.url}` 
      : relatedProject.Logo.url;

    return logoUrl;
  }
  return "/placeholder.svg";
};
  

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
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 24 24"
                                  className="h-4 w-4 group-hover:scale-110 transition-transform duration-300"
                                  fill="currentColor"
                                >
                                  <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
                                </svg>
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
                              {/* Apple Podcast Icon - new design */}
                              <Link
                                href="https://podcasts.apple.com/us/podcast/blockchain-bay/id1643516087"
                                target="_blank"
                                className="flex items-center justify-center w-8 h-8 rounded-full bg-[#0D0B26] border border-gray-800/50 text-gray-300 hover:text-[#8c44ff] hover:border-[#8c44ff]/30 hover:bg-[#8c44ff]/10 transition-all duration-300 relative group"
                                onMouseEnter={() => setHoverSocial("apple")}
                                onMouseLeave={() => setHoverSocial(null)}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 32 32"
                                  className="h-4 w-4 group-hover:scale-110 transition-transform duration-300"
                                  fill="currentColor"
                                >
                                  <path d="M7.12 0c-3.937-0.011-7.131 3.183-7.12 7.12v17.76c-0.011 3.937 3.183 7.131 7.12 7.12h17.76c3.937 0.011 7.131-3.183 7.12-7.12v-17.76c0.011-3.937-3.183-7.131-7.12-7.12zM15.817 3.421c3.115 0 5.932 1.204 8.079 3.453 1.631 1.693 2.547 3.489 3.016 5.855 0.161 0.787 0.161 2.932 0.009 3.817-0.5 2.817-2.041 5.339-4.317 7.063-0.812 0.615-2.797 1.683-3.115 1.683-0.12 0-0.129-0.12-0.077-0.615 0.099-0.792 0.192-0.953 0.64-1.141 0.713-0.296 1.932-1.167 2.677-1.911 1.301-1.303 2.229-2.932 2.677-4.719 0.281-1.1 0.244-3.543-0.063-4.672-0.969-3.595-3.907-6.385-7.5-7.136-1.041-0.213-2.943-0.213-4 0-3.636 0.751-6.647 3.683-7.563 7.371-0.245 1.004-0.245 3.448 0 4.448 0.609 2.443 2.188 4.681 4.255 6.015 0.407 0.271 0.896 0.547 1.1 0.631 0.447 0.192 0.547 0.355 0.629 1.14 0.052 0.485 0.041 0.62-0.072 0.62-0.073 0-0.62-0.235-1.199-0.511l-0.052-0.041c-3.297-1.62-5.407-4.364-6.177-8.016-0.187-0.943-0.224-3.187-0.036-4.052 0.479-2.323 1.396-4.135 2.921-5.739 2.199-2.319 5.027-3.543 8.172-3.543zM16 7.172c0.541 0.005 1.068 0.052 1.473 0.14 3.715 0.828 6.344 4.543 5.833 8.229-0.203 1.489-0.713 2.709-1.619 3.844-0.448 0.573-1.537 1.532-1.729 1.532-0.032 0-0.063-0.365-0.063-0.803v-0.808l0.552-0.661c2.093-2.505 1.943-6.005-0.339-8.296-0.885-0.896-1.912-1.423-3.235-1.661-0.853-0.161-1.031-0.161-1.927-0.011-1.364 0.219-2.417 0.744-3.355 1.672-2.291 2.271-2.443 5.791-0.348 8.296l0.552 0.661v0.813c0 0.448-0.037 0.807-0.084 0.807-0.036 0-0.349-0.213-0.683-0.479l-0.047-0.016c-1.109-0.885-2.088-2.453-2.495-3.995-0.244-0.932-0.244-2.697 0.011-3.625 0.672-2.505 2.521-4.448 5.079-5.359 0.547-0.193 1.509-0.297 2.416-0.281zM15.823 11.156c0.417 0 0.828 0.084 1.131 0.24 0.645 0.339 1.183 0.989 1.385 1.677 0.62 2.104-1.609 3.948-3.631 3.005h-0.015c-0.953-0.443-1.464-1.276-1.475-2.36 0-0.979 0.541-1.828 1.484-2.328 0.297-0.156 0.709-0.235 1.125-0.235zM15.812 17.464c1.319-0.005 2.271 0.463 2.625 1.291 0.265 0.62 0.167 2.573-0.292 5.735-0.307 2.208-0.479 2.765-0.905 3.141-0.589 0.52-1.417 0.667-2.209 0.385h-0.004c-0.953-0.344-1.157-0.808-1.553-3.527-0.452-3.161-0.552-5.115-0.285-5.735 0.348-0.823 1.296-1.285 2.624-1.291z"/>
                                </svg>
                                {hoverSocial === "apple" && (
                                  <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs bg-[#0D0B26] border border-gray-800/50 px-2 py-1 rounded whitespace-nowrap">
                                    Apple Podcast
                                  </span>
                                )}
                              </Link>
                              {/* Amazon Icon */}
                            <Link
                              href="https://music.amazon.com/podcasts"
                              target="_blank"
                              className="flex items-center justify-center w-8 h-8 rounded-full bg-[#0D0B26] border border-gray-800/50 text-gray-300 hover:text-[#FF9900] hover:border-[#FF9900]/30 hover:bg-[#FF9900]/10 transition-all duration-300 relative group"
                              onMouseEnter={() => setHoverSocial("amazon")}
                              onMouseLeave={() => setHoverSocial(null)}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 50 50"
                                className="h-4 w-4 group-hover:scale-110 transition-transform duration-300"
                                fill="currentColor"
                              >
                                <path d="M36,5H14c-4.971,0-9,4.029-9,9v22c0,4.971,4.029,9,9,9h22c4.971,0,9-4.029,9-9V14C45,9.029,40.971,5,36,5z M38.768,33.932c-2.214,1.57-4.688,2.605-7.285,3.277c-2.595,0.663-5.297,0.914-7.986,0.729c-2.688-0.18-5.313-0.836-7.787-1.794	c-2.466-0.99-4.797-2.263-6.857-3.931c-0.107-0.087-0.124-0.245-0.037-0.352c0.077-0.095,0.209-0.119,0.313-0.063l0.014,0.008	c2.249,1.217,4.653,2.149,7.067,2.889c2.433,0.692,4.909,1.187,7.4,1.288c2.485,0.087,4.997-0.107,7.449-0.617	c2.442-0.504,4.905-1.236,7.17-2.279l0.039-0.018c0.251-0.115,0.547-0.006,0.663,0.245C39.035,33.537,38.961,33.796,38.768,33.932z M39.882,36.892c-0.278,0.21-0.556,0.14-0.417-0.21c0.417-1.12,1.32-3.501,0.903-4.061c-0.486-0.63-2.987-0.28-4.098-0.14	c-0.347,0-0.347-0.28-0.069-0.49c0.972-0.7,2.292-0.98,3.404-0.98c1.111,0,2.084,0.21,2.292,0.56	C42.243,31.99,41.757,35.281,39.882,36.892z" />
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
          
          {/* News Mentions and Related Projects */}
<div className={`mt-20 transition-all duration-700 ease-out delay-400 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
  {/* News sections - Desktop: 2-column grid, Mobile: 1-column stack */}
  <div className="block md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-6">
    {/* NEWS HEADERS - On mobile, both appear as separate rows */}
    <div className="flex items-center justify-between mb-6">
      <h3 className="text-xl font-bold flex items-center gap-2 relative">
        <span className="text-yellow-400">📰</span> News mentions
        <span className="absolute -bottom-1 left-0 w-1/3 h-0.5 bg-yellow-400/50"></span>
      </h3>
      <Button 
        variant="link" 
        className="text-[#F7984A] hover:text-[#F7984A]/80 p-0 group"
        onClick={() => window.open('https://news.blockchainbay.xyz', '_blank')}
      >
        <span className="hidden md:inline">View more</span>
        <ArrowUpRight className="ml-1 h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
      </Button>
    </div>
    
    {/* More Coverage Header - Only shown on desktop */}
    <div className="hidden md:flex md:items-center md:justify-between mb-6">
      <h3 className="text-xl font-bold flex items-center gap-2 relative">
        <span className="text-yellow-400">🔍</span> More coverage
        <span className="absolute -bottom-1 left-0 w-1/3 h-0.5 bg-yellow-400/50"></span>
      </h3>
    </div>
    
    {/* NEWS CONTENT - All news articles stacked on mobile, split into columns on desktop */}
    <div className="space-y-4 md:space-y-4 mb-6 md:mb-0">
      {isLoadingNews ? (
        <div className="flex items-center justify-center h-32">
          <div className="w-8 h-8 border-4 border-t-[#F7984A] border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
        </div>
      ) : newsArticles.length > 0 ? (
        <>
          {newsArticles.slice(0, 2).map((article) => (
            <div key={article.id} className="flex gap-4 p-4 bg-[#0D0B26]/80 border border-gray-800/50 rounded-xl hover:border-gray-700/70 hover:bg-[#0D0B26] transition-all duration-300 hover:shadow-lg group">
              <div className="w-20 h-20 shrink-0 rounded-lg overflow-hidden bg-gradient-to-br from-blue-400/20 to-purple-500/20 group-hover:from-blue-400/30 group-hover:to-purple-500/30 transition-all duration-300">
                <Image
                  src={article.image || "/placeholder.svg?height=80&width=80"}
                  alt={article.title}
                  width={80}
                  height={80}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs text-gray-400">{article.source}</span>
                  <span className="text-xs text-gray-500">•</span>
                  <span className="text-xs text-gray-400">{article.date}</span>
                </div>
                <a 
                  href={article.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block"
                >
                  <h4 className="font-medium leading-tight group-hover:text-[#F7984A]/90 transition-colors duration-300 line-clamp-2">
                    {article.title}
                  </h4>
                </a>
                <p className="text-xs text-gray-400 mt-1 line-clamp-1">{article.summary}</p>
              </div>
            </div>
          ))}
        </>
      ) : (
        <div className="flex gap-4 p-4 bg-[#0D0B26]/80 border border-gray-800/50 rounded-xl">
          <div className="text-gray-400">No news articles found about {project.title} yet.</div>
        </div>
      )}
    </div>
    
    {/* Desktop-only "More coverage" section */}
    <div className="hidden md:block space-y-4">
      {isLoadingNews ? (
        <div className="flex items-center justify-center h-32">
          <div className="w-8 h-8 border-4 border-t-[#F7984A] border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
        </div>
      ) : newsArticles.length > 2 ? (
        <div className="space-y-4">
          {newsArticles.slice(2, 4).map((article) => (
            <div key={article.id} className="flex gap-4 p-4 bg-[#0D0B26]/80 border border-gray-800/50 rounded-xl hover:border-gray-700/70 hover:bg-[#0D0B26] transition-all duration-300 hover:shadow-lg group">
              <div className="w-20 h-20 shrink-0 rounded-lg overflow-hidden bg-gradient-to-br from-green-400/20 to-teal-500/20 group-hover:from-green-400/30 group-hover:to-teal-500/30 transition-all duration-300">
                <Image
                  src={article.image || "/placeholder.svg?height=80&width=80"}
                  alt={article.title}
                  width={80}
                  height={80}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs text-gray-400">{article.source}</span>
                  <span className="text-xs text-gray-500">•</span>
                  <span className="text-xs text-gray-400">{article.date}</span>
                </div>
                <a 
                  href={article.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block"
                >
                  <h4 className="font-medium leading-tight group-hover:text-[#F7984A]/90 transition-colors duration-300 line-clamp-2">
                    {article.title}
                  </h4>
                </a>
                <p className="text-xs text-gray-400 mt-1 line-clamp-1">{article.summary}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex gap-4 p-4 bg-[#0D0B26]/80 border border-gray-800/50 rounded-xl">
          <div className="text-gray-400">No additional coverage available.</div>
        </div>
      )}
    </div>
    
    {/* Mobile-only "More coverage" section - shows all articles in one column */}
    <div className="block md:hidden mt-6">
      {newsArticles.length > 2 && (
        <>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold flex items-center gap-2 relative">
              <span className="text-yellow-400">🔍</span> More coverage
              <span className="absolute -bottom-1 left-0 w-1/3 h-0.5 bg-yellow-400/50"></span>
            </h3>
          </div>
          <div className="space-y-4">
            {newsArticles.slice(2, 4).map((article) => (
              <div key={article.id} className="flex gap-4 p-4 bg-[#0D0B26]/80 border border-gray-800/50 rounded-xl hover:border-gray-700/70 hover:bg-[#0D0B26] transition-all duration-300 hover:shadow-lg group">
                <div className="w-20 h-20 shrink-0 rounded-lg overflow-hidden bg-gradient-to-br from-green-400/20 to-teal-500/20 group-hover:from-green-400/30 group-hover:to-teal-500/30 transition-all duration-300">
                  <Image
                    src={article.image || "/placeholder.svg?height=80&width=80"}
                    alt={article.title}
                    width={80}
                    height={80}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs text-gray-400">{article.source}</span>
                    <span className="text-xs text-gray-500">•</span>
                    <span className="text-xs text-gray-400">{article.date}</span>
                  </div>
                  <a 
                    href={article.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <h4 className="font-medium leading-tight group-hover:text-[#F7984A]/90 transition-colors duration-300 line-clamp-2">
                      {article.title}
                    </h4>
                  </a>
                  <p className="text-xs text-gray-400 mt-1 line-clamp-1">{article.summary}</p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  </div>

  {/* Related Projects */}
  <div className="space-y-6 mt-16">
    <div className="flex items-center justify-between">
      <h3 className="text-xl font-bold flex items-center gap-2 relative">
        <span className="text-yellow-400">☀️</span> Related projects
        <span className="absolute -bottom-1 left-0 w-1/3 h-0.5 bg-yellow-400/50"></span>
      </h3>
      <Button 
        variant="link" 
        className="text-[#F7984A] hover:text-[#F7984A]/80 p-0 group"
        onClick={() => window.open('/projects', '_self')}
      >
        <span className="hidden md:inline">View all projects</span>
        <ArrowUpRight className="ml-1 h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
      </Button>
    </div>
    
    {isLoadingRelated ? (
      <div className="flex items-center justify-center py-8">
        <div className="w-8 h-8 border-4 border-t-[#F7984A] border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
      </div>
    ) : relatedProjects.length > 0 ? (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {relatedProjects.map((relatedProject) => (
          <Link 
            key={relatedProject.id} 
            href={`/projects/${relatedProject.Slug}`} 
            className="block"
          >
            <div className="flex gap-4 p-4 bg-[#0D0B26]/80 border border-gray-800/50 rounded-xl hover:border-gray-700/70 hover:bg-[#0D0B26] transition-all duration-300 hover:shadow-lg group h-full">
              <div className="w-12 h-12 shrink-0 rounded-full overflow-hidden bg-gradient-to-br from-green-400/20 to-blue-500/20 group-hover:from-green-400/30 group-hover:to-blue-500/30 transition-all duration-300 flex items-center justify-center">
                {relatedProject.Logo ? (
                  <Image
                    src={getRelatedProjectLogo(relatedProject)}
                    alt={relatedProject.title}
                    width={48}
                    height={48}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-tr from-[#F7984A]/30 to-[#F7984A]/10 flex items-center justify-center text-[#F7984A] font-bold text-xl">
                    {relatedProject.title.substring(0, 2)}
                  </div>
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium group-hover:text-[#F7984A]/90 transition-colors duration-300 line-clamp-1">
                    {relatedProject.title}
                  </h4>
                  {relatedProject.Symbol && (
                    <span className="text-sm text-[#F7984A]">{relatedProject.Symbol}</span>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <Badge className="text-xs bg-[#0D0B26] text-blue-400 border border-blue-500/20 px-1.5 py-0">
                    {relatedProject.Category}
                  </Badge>
                  {relatedProject.SubCategory && (
                    <Badge className="text-xs bg-[#0D0B26] text-purple-400 border border-purple-500/20 px-1.5 py-0">
                      {relatedProject.SubCategory}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    ) : (
      <div className="p-6 bg-[#0D0B26]/40 border border-gray-800/50 rounded-xl text-center">
        <p className="text-gray-400">No related projects found.</p>
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