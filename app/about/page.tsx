"use client"

import Image from "next/image"
import Link from "next/link"
import {
  Globe,
  Users,
  Shield,
  CheckCircle2,
  ArrowRight,
  ExternalLink,
  Code,
  Layers,
  Database,
  Play,
  BookOpen,
  Bell,
  Wallet,
  Lock,
  Podcast,
} from "lucide-react"
import { Footer } from "@/components/NewsletterFooter"
import Navbar from "@/components/Navbar"
import { useEffect, useState } from "react"

export default function AboutPage() {
  // Initialize with null to avoid hydration mismatch
  const [windowWidth, setWindowWidth] = useState<number | null>(null)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    // Set isMounted to true once component is mounted
    setIsMounted(true)

    // Set initial window width
    setWindowWidth(window.innerWidth)

    const handleResize = () => {
      setWindowWidth(window.innerWidth)
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return (
    <main className="min-h-screen relative z-10">
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

      <div className="sticky top-0 z-50 bg-[#07071C]/80 backdrop-blur-md">
        <Navbar />
      </div>

      <div className="container mx-auto pt-24 sm:pt-28 md:pt-32 px-4 pb-8 sm:pb-12 md:pb-16 relative z-10">
        {/* Hero Section - Completely redesigned */}
        <section className="mt-4 sm:mt-6 md:mt-8 mb-32 relative overflow-hidden">
          <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
            <div className="order-1">
              <div className="inline-flex items-center space-x-2 px-3 py-1 bg-[#F7984A]/10 rounded-full mb-6">
                <div className="w-2 h-2 rounded-full bg-[#F7984A] animate-pulse"></div>
                <span className="text-sm font-medium text-[#F7984A]">Crypto Education</span>
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl text-white lg:text-7xl font-bold mb-6 md:mb-8 leading-tight">
                Where{" "}
                <span className="bg-gradient-to-r from-[#F7984A] to-orange-500 text-transparent bg-clip-text">
                  Knowledge
                </span>{" "}
                Meets Opportunity
              </h1>

              <p className="text-xl text-gray-300 leading-relaxed mb-10 max-w-xl">
                Join the Crypto Revolution with BlockchainBay, your trusted guide to navigating the exciting world of
                cryptocurrency.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 sm:gap-5">
                <Link
                  href="/contact"
                  className="group inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-[#F7984A] to-orange-500 hover:from-orange-500 hover:to-[#F7984A] text-white font-medium rounded-lg transition-all duration-300 shadow-lg shadow-[#F7984A]/20 hover:shadow-xl hover:shadow-[#F7984A]/30 transform hover:-translate-y-1 w-full sm:w-auto"
                >
                  <span>Learn More</span>
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href={"https://www.youtube.com/@chrisbagnell"}
                  className="inline-flex items-center justify-center px-6 py-3 bg-white/5 hover:bg-white/10 text-white font-medium rounded-lg border border-white/10 hover:border-white/20 transition-all duration-300 backdrop-blur-sm transform hover:-translate-y-1 w-full sm:w-auto"
                >
                  <Play className="mr-2 w-5 h-5" />
                  <span>Watch Videos</span>
                </Link>
              </div>
            </div>

            {/* === YOUTUBE EMBED SECTION (Right Side) === */}
            <div className="order-2 relative w-full max-w-xl mx-auto lg:max-w-none mt-10 lg:mt-0">
              {/* Optional decorative background */}
              <div className="absolute inset-0 bg-gradient-to-tr from-[#F7984A]/20 to-blue-500/20 rounded-2xl blur-[5px] transform scale-[1.02] opacity-70 z-0"></div>

              {/* Container for the iframe - aspect-video sets the 16:9 ratio */}
              <div className="relative overflow-hidden rounded-2xl border border-white/10 aspect-video z-10 bg-black">
                <iframe
                  className="absolute top-0 left-0 w-full h-full"
                  src="https://www.youtube.com/embed/tDlNJTJVrG0" // Your YouTube video embed URL
                  title="BlockchainBay Introduction Video" // Accessible title
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen // Allows fullscreen button in player
                ></iframe>
              </div>
            </div>
            {/* === END YOUTUBE EMBED SECTION === */}
          </div>
        </section>

        {/* Stats Section - Redesigned with animated counters */}
        <section className="mb-32 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-[#F7984A]/5 to-blue-500/5 rounded-3xl blur-xl"></div>
          <div className="relative bg-[#0F0F2D]/50 backdrop-blur-sm rounded-3xl border border-white/10 p-8 md:p-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 md:gap-12">
              {[
                { value: "7,000+", label: "Subscribers", icon: <Users className="w-8 h-8 text-[#F7984A]" /> },
                { value: "500+", label: "Discord Members", icon: <Globe className="w-8 h-8 text-[#F7984A]" /> },
                { value: "99+", label: "Projects Covered", icon: <CheckCircle2 className="w-8 h-8 text-[#F7984A]" /> },
              ].map((stat, index) => (
                <div key={index} className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-b from-[#F7984A]/20 to-blue-500/20 rounded-xl blur-md opacity-0 group-hover:opacity-70 transition-opacity duration-500"></div>
                  <div className="relative bg-[#0A0A20]/80 backdrop-blur-sm rounded-xl border border-white/5 p-5 sm:p-6 md:p-8 h-full hover:border-[#F7984A]/20 transition-all duration-500 group-hover:transform group-hover:translate-y-[-5px]">
                    <div className="w-16 h-16 rounded-2xl bg-[#F7984A]/10 flex items-center justify-center mb-6 group-hover:bg-[#F7984A]/20 transition-all duration-500">
                      {stat.icon}
                    </div>
                    <p className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#F7984A] to-orange-500 text-transparent bg-clip-text mb-2">
                      {stat.value}
                    </p>
                    <p className="text-gray-300 font-medium">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* About Us Section */}
        <section id="about-us" className="mb-32 scroll-mt-24">
          <div className="grid lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-[#F7984A]/30 to-blue-500/30 rounded-2xl blur-[2px] transform scale-[1.02] opacity-70"></div>
              <div className="absolute inset-0 bg-[#0F0F2D]/50 rounded-2xl backdrop-blur-sm"></div>
              <div className="relative overflow-hidden rounded-2xl border border-white/10">
                <Image
                  src="/placeholder.svg?height=600&width=800&text=Chris"
                  alt="Chris from BlockchainBay"
                  width={800}
                  height={600}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#07071C] via-[#07071C]/70 to-transparent opacity-80 flex items-end">
                  <div className="p-8 w-full">
                    <div className="flex items-center space-x-2 mb-3">
                      <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                      <span className="text-sm text-green-400">Creating videos since 2010</span>
                    </div>
                    <p className="text-white text-xl font-medium leading-tight">
                      "I'm here to guide you through the fascinating universe of cryptocurrency, with a personal twist
                      that's all my own."
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="inline-block mb-3 px-3 py-1 bg-[#F7984A]/10 rounded-full">
                <span className="text-sm font-medium text-[#F7984A]">About Us</span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 md:mb-8 text-white leading-tight">
                We will give the best for you
              </h2>
              <div className="space-y-6 text-gray-300">
                <p className="leading-relaxed">
                  Hi, I'm Chris, and I've been sharing my passion through videos since 2010. I'm here to guide you
                  through the fascinating universe of cryptocurrency, with a personal twist that's all my own.
                </p>
                <p className="leading-relaxed">
                  Whether it's diving into the latest Bitcoin news or spotlighting the newest, most thrilling projects
                  each month, I'm all about making learning fun.
                </p>
                <p className="leading-relaxed">
                  Come join me on this adventure—we'll navigate the crypto world together, one video at a time!
                </p>
              </div>

              <div className="mt-10 flex items-center">
                <div className="relative">
                  <Image
                    src="/placeholder.svg?height=60&width=60"
                    alt="Chris"
                    width={60}
                    height={60}
                    className="rounded-full border-2 border-[#F7984A]"
                  />
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-green-500 border-2 border-[#0F0F2D]"></div>
                </div>
                <div className="ml-4">
                  <p className="text-white font-medium">Chris</p>
                  <p className="text-[#F7984A]">Founder & Content Creator</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Core Values Section */}
        <section className="mb-32 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-[#F7984A]/5 to-blue-500/5 rounded-3xl blur-xl"></div>
          <div className="relative bg-[#0F0F2D]/50 backdrop-blur-sm rounded-3xl border border-white/10 p-8 md:p-12">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <div className="inline-block mb-3 px-3 py-1 bg-[#F7984A]/10 rounded-full">
                <span className="text-sm font-medium text-[#F7984A]">Our Core Values</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">What Drives Us</h2>
              <p className="text-gray-300 leading-relaxed">
                At BlockchainBay, we're committed to making cryptocurrency accessible, understandable, and secure for
                everyone.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
              {[
                {
                  icon: <Shield className="w-10 h-10 text-[#F7984A]" />,
                  title: "Security First",
                  description: "We focus on educating the importance of crypto security.",
                },
                {
                  icon: <BookOpen className="w-10 h-10 text-[#F7984A]" />,
                  title: "Simple and Easy",
                  description: "We make crypto learning fun and easy to understand.",
                },
                {
                  icon: <Bell className="w-10 h-10 text-[#F7984A]" />,
                  title: "Stay Informed",
                  description: "Join our many channels to be kept up-to-date on your favorite projects.",
                },
              ].map((value, index) => (
                <div key={index} className="group relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-b from-[#F7984A]/20 to-blue-500/20 rounded-xl blur-md opacity-0 group-hover:opacity-70 transition-opacity duration-500"></div>
                  <div className="relative bg-[#0A0A20]/80 backdrop-blur-sm rounded-xl border border-white/5 p-5 sm:p-6 md:p-8 h-full hover:border-[#F7984A]/20 transition-all duration-500 group-hover:transform group-hover:translate-y-[-5px]">
                    <div className="w-16 h-16 rounded-2xl bg-[#F7984A]/10 flex items-center justify-center mb-6 group-hover:bg-[#F7984A]/20 transition-all duration-500">
                      {value.icon}
                    </div>
                    <h3 className="text-xl font-bold mb-4 text-white group-hover:text-[#F7984A] transition-colors duration-300">
                      {value.title}
                    </h3>
                    <p className="text-gray-300 leading-relaxed">{value.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="mb-32">
          <div className="grid lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center">
            <div>
              <div className="inline-block mb-3 px-3 py-1 bg-[#F7984A]/10 rounded-full">
                <span className="text-sm font-medium text-[#F7984A]">Services</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-8 text-white leading-tight">
                Navigating the Crypto Frontier with Leadership and Insight
              </h2>
              <div className="space-y-6 text-gray-300">
                <p className="leading-relaxed">
                  With the best Directory in the crypto space, you can be on the front lines, discovering new projects
                  as they're released. Stay ahead of the curve and keep yourself updated with all the latest
                  developments, news, and innovations in the world of cryptocurrency.
                </p>
              </div>

              <div className="mt-8">
                <Link
                  href="/services"
                  className="group inline-flex items-center px-6 py-3 bg-[#F7984A] hover:bg-[#F7984A]/90 text-white font-medium rounded-lg transition-all duration-300 shadow-lg shadow-[#F7984A]/20 hover:shadow-xl hover:shadow-[#F7984A]/30 transform hover:-translate-y-1"
                >
                  <span>Learn More</span>
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {[
                {
                  icon: <Layers className="w-8 h-8 text-[#F7984A]" />,
                  title: "DePINs",
                  subtitle: "Decentralized Physical Infrastructure Network",
                  description: "Blockchain-based physical infrastructure",
                },
                {
                  icon: <Database className="w-8 h-8 text-[#F7984A]" />,
                  title: "DeFi",
                  subtitle: "Decentralized Finance",
                  description: "Blockchain-based finance",
                },
                {
                  icon: <Code className="w-8 h-8 text-[#F7984A]" />,
                  title: "NFT",
                  subtitle: "Non Fungible Token",
                  description: "Unique identity and ownership",
                },
              ].map((service, index) => (
                <div key={index} className="group relative overflow-hidden col-span-1">
                  <div className="absolute inset-0 bg-gradient-to-b from-[#F7984A]/20 to-blue-500/20 rounded-xl blur-md opacity-0 group-hover:opacity-70 transition-opacity duration-500"></div>
                  <div className="relative bg-[#0A0A20]/80 backdrop-blur-sm rounded-xl border border-white/5 p-6 h-full hover:border-[#F7984A]/20 transition-all duration-500 group-hover:transform group-hover:translate-y-[-5px]">
                    <div className="w-12 h-12 rounded-xl bg-[#F7984A]/10 flex items-center justify-center mb-4 group-hover:bg-[#F7984A]/20 transition-all duration-500">
                      {service.icon}
                    </div>
                    <h3 className="text-lg font-bold mb-1 text-white group-hover:text-[#F7984A] transition-colors duration-300">
                      {service.title}
                    </h3>
                    <h4 className="text-sm text-[#F7984A] mb-2">{service.subtitle}</h4>
                    <p className="text-gray-300 text-sm">{service.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Products Section */}
        <section className="mb-32 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-[#F7984A]/5 to-blue-500/5 rounded-3xl blur-xl"></div>
          <div className="relative bg-[#0F0F2D]/50 backdrop-blur-sm rounded-3xl border border-white/10 p-8 md:p-12">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <div className="inline-block mb-3 px-3 py-1 bg-[#F7984A]/10 rounded-full">
                <span className="text-sm font-medium text-[#F7984A]">Product</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">We understand what you need</h2>
              <p className="text-gray-300 leading-relaxed">
                From the fundamentals of keeping your crypto safe to in depth analysis of new projects, we have you
                covered.
              </p>
            </div>

            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
              {[
                {
                  icon: <Database className="w-8 h-8 text-[#F7984A]" />,
                  title: "Digital Token",
                  description: "Built on blockchain network",
                },
                {
                  icon: <Layers className="w-8 h-8 text-[#F7984A]" />,
                  title: "Blockchain",
                  description: "Digital investment data storage",
                },
                {
                  icon: <Podcast className="w-8 h-8 text-[#F7984A]" />,
                  title: "Blockchain Bay Podcast",
                  description: "Meet Founders",
                },
                {
                  icon: <Wallet className="w-8 h-8 text-[#F7984A]" />,
                  title: "Hardware Wallets",
                  description: "Store Crypto offline securely",
                },
                {
                  icon: <Lock className="w-8 h-8 text-[#F7984A]" />,
                  title: "Seed Phrase Storage",
                  description: "Protect your Hardware Wallet",
                },
              ].map((product, index) => (
                <div key={index} className="group relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-b from-[#F7984A]/20 to-blue-500/20 rounded-xl blur-md opacity-0 group-hover:opacity-70 transition-opacity duration-500"></div>
                  <div className="relative bg-[#0A0A20]/80 backdrop-blur-sm rounded-xl border border-white/5 p-6 h-full hover:border-[#F7984A]/20 transition-all duration-500 group-hover:transform group-hover:translate-y-[-5px]">
                    <div className="w-14 h-14 rounded-xl bg-[#F7984A]/10 flex items-center justify-center mb-4 group-hover:bg-[#F7984A]/20 transition-all duration-500">
                      {product.icon}
                    </div>
                    <h3 className="text-lg font-bold mb-2 text-white group-hover:text-[#F7984A] transition-colors duration-300">
                      {product.title}
                    </h3>
                    <p className="text-gray-300 text-sm">{product.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline - Keeping as requested but with visual enhancements */}
        <section className="mb-32">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-block mb-3 px-3 py-1 bg-[#F7984A]/10 rounded-full">
              <span className="text-sm font-medium text-[#F7984A]">Our Journey</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">Milestones That Defined Our Path</h2>
            <p className="text-gray-300 leading-relaxed">
              From our humble beginnings to becoming a trusted voice in the crypto space, our journey has been defined
              by passion, education, and community building.
            </p>
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-4 sm:left-1/2 sm:transform sm:-translate-x-1/2 h-full w-1 bg-gradient-to-b from-[#F7984A]/70 via-blue-500/50 to-[#F7984A]/70"></div>

            {/* Timeline items */}
            <div className="space-y-24 relative">
              {[
                {
                  year: "2010",
                  quarter: "Q3",
                  title: "Founded YouTube Channel",
                  description:
                    "Started with a passion for educating people about cryptocurrency and blockchain technology.",
                  image: "/placeholder.svg?height=400&width=600",
                },
                {
                  year: "2021",
                  quarter: "Q1",
                  title: "First Crypto Video",
                  description:
                    "Launched our YouTube video to share crypto knowledge and insights with a wider audience.",
                  image: "/placeholder.svg?height=400&width=600",
                },
                {
                  year: "2021",
                  quarter: "Q3",
                  title: "Community Growth",
                  description: "Established our Discord community for deeper engagement.",
                  image: "/placeholder.svg?height=400&width=600",
                },
                {
                  year: "2022",
                  quarter: "Q2",
                  title: "Crypto Directory Launch",
                  description:
                    "Created a comprehensive directory of crypto projects to help users discover new opportunities.",
                  image: "/placeholder.svg?height=400&width=600",
                },
                {
                  year: "2022",
                  quarter: "Q4",
                  title: "Podcast Launch",
                  description:
                    "Started the BlockchainBay Podcast, interviewing founders and experts in the crypto space.",
                  image: "/placeholder.svg?height=400&width=600",
                },
                {
                  year: "2025",
                  quarter: "Q2",
                  title: "7,000+ Subscribers Milestone",
                  description:
                    "Celebrated reaching 7,000+ subscribers and expanded our content to cover emerging trends like DePINs.",
                  image: "/placeholder.svg?height=400&width=600",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className={`flex items-center ${
                    isMounted && windowWidth !== null && windowWidth >= 640 && index % 2 === 0
                      ? "flex-row-reverse"
                      : "flex-row"
                  }`}
                >
                  <div className="hidden sm:block sm:w-1/2"></div>
                  <div className="z-10 flex items-center justify-center w-10 h-10 sm:w-16 sm:h-16 rounded-full bg-[#0F0F2D] border-4 border-[#F7984A]/50 shadow-lg shadow-[#F7984A]/20 flex-shrink-0">
                    <span className="text-[#F7984A] font-bold">{index + 1}</span>
                  </div>
                  <div
                    className={`w-full sm:w-1/2 pl-4 ${
                      isMounted && windowWidth !== null && windowWidth >= 640 && index % 2 === 0
                        ? "sm:text-right sm:pr-12 sm:pl-6"
                        : "sm:pl-12 sm:pr-6"
                    }`}
                  >
                    <div className="bg-gradient-to-b from-[#0F0F2D] to-[#0A0A20] p-6 rounded-2xl border border-white/10 hover:border-[#F7984A]/30 transition-all duration-500 hover:shadow-[0_0_25px_rgba(247,152,74,0.15)] group">
                      <div className="flex items-center mb-4 justify-between">
                        <div className="flex items-center">
                          <span className="inline-block px-3 py-1 rounded-full bg-[#F7984A]/20 text-[#F7984A] text-sm font-medium">
                            {item.year}
                          </span>
                          <span className="ml-2 text-gray-400 text-sm">{item.quarter}</span>
                        </div>
                        <div className="w-2 h-2 rounded-full bg-[#F7984A] group-hover:animate-pulse"></div>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                        <div className="sm:w-1/3">
                          <div className="rounded-lg overflow-hidden border border-white/10">
                            <Image
                              src={item.image || "/placeholder.svg"}
                              alt={item.title}
                              width={600}
                              height={400}
                              className="w-full h-auto"
                            />
                          </div>
                        </div>
                        <div className="sm:w-2/3">
                          <h3 className="text-xl font-bold mb-3 text-white group-hover:text-[#F7984A] transition-colors duration-300">
                            {item.title}
                          </h3>
                          <p className="text-gray-300 leading-relaxed">{item.description}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Community Section */}
        <section className="mb-32 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-[#F7984A]/5 to-blue-500/5 rounded-3xl blur-xl"></div>
          <div className="relative bg-[#0F0F2D]/50 backdrop-blur-sm rounded-3xl border border-white/10 p-8 md:p-12">
            <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
              <div>
                <div className="inline-block mb-3 px-3 py-1 bg-[#F7984A]/10 rounded-full">
                  <span className="text-sm font-medium text-[#F7984A]">Join Our Community</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">Be Part of the Crypto Revolution</h2>
                <p className="text-gray-300 leading-relaxed mb-8">
                  Connect with like-minded crypto enthusiasts, get exclusive content, and stay updated on the latest
                  trends and projects in the blockchain space.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    href="https://discord.gg/Q9YzGH948Q"
                    className="group px-6 py-3 bg-gradient-to-r from-[#F7984A] to-orange-500 hover:from-orange-500 hover:to-[#F7984A] text-white font-medium rounded-lg transition-all duration-300 shadow-lg shadow-[#F7984A]/20 hover:shadow-xl hover:shadow-[#F7984A]/30 transform hover:-translate-y-1 flex items-center"
                  >
                    <span>Join Discord</span>
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link
                    href="https://www.youtube.com/@chrisbagnell"
                    className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white font-medium rounded-lg border border-white/10 hover:border-white/20 transition-all duration-300 backdrop-blur-sm transform hover:-translate-y-1 flex items-center"
                  >
                    <span>Subscribe on YouTube</span>
                    <ExternalLink className="ml-2 w-5 h-5" />
                  </Link>
                </div>
              </div>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-[#F7984A]/20 to-blue-500/20 rounded-2xl blur-[5px] transform scale-[1.02] opacity-70"></div>
                <div className="relative overflow-hidden rounded-2xl border border-white/10">
                  <Image
                    src="/placeholder.svg?height=600&width=800&text=Community"
                    alt="BlockchainBay Community"
                    width={800}
                    height={600}
                    className="w-full h-auto"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#07071C] via-transparent to-transparent opacity-60"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-8">
                    <div className="flex items-center space-x-2 mb-3">
                      <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                      <span className="text-sm text-green-400">Live events every week</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative overflow-hidden rounded-2xl border border-white/10">
          <div className="absolute inset-0 bg-gradient-to-r from-[#F7984A]/20 to-blue-500/20 blur-[30px]"></div>
          <div className="relative p-6 sm:p-8 md:p-12 lg:p-16">
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">Ready to Start Your Crypto Journey?</h2>
              <p className="text-xl text-gray-300 mb-10 leading-relaxed">
                Join BlockchainBay today and get access to educational content, project insights, and a supportive
                community to help you navigate the exciting world of cryptocurrency.
              </p>
              <div className="flex flex-col sm:flex-row gap-5 justify-center">
                <Link
                  href="https://www.youtube.com/@chrisbagnell"
                  className="group px-8 py-4 bg-gradient-to-r from-[#F7984A] to-orange-500 hover:from-orange-500 hover:to-[#F7984A] text-white font-medium rounded-lg transition-all duration-300 shadow-lg shadow-[#F7984A]/20 hover:shadow-xl hover:shadow-[#F7984A]/30 transform hover:-translate-y-1 flex items-center justify-center"
                >
                  <span>{"Subscribe Now"}</span>
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/contact"
                  className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white font-medium rounded-lg border border-white/10 hover:border-white/20 transition-all duration-300 backdrop-blur-sm transform hover:-translate-y-1 flex items-center justify-center"
                >
                  <span>Contact Us</span>
                  <ExternalLink className="ml-2 w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer className="relative z-20" />
    </main>
  )
}

