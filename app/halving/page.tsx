"use client"
import { useState, useEffect } from "react"
import { ArrowUpRight, Clock, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import Navbar from "@/components/Navbar"
import { Footer } from "@/components/NewsletterFooter"

export default function CryptoHalvingCountdownPage() {
  const [scrolled, setScrolled] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [isLoaded, setIsLoaded] = useState(false)
  const [iframeLoaded, setIframeLoaded] = useState(false)
  const [iframeError, setIframeError] = useState(false)
  const [iframeHeight, setIframeHeight] = useState(700)

  // Adjust iframe height based on screen size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setIframeHeight(500)
      } else if (window.innerWidth < 1024) {
        setIframeHeight(600)
      } else {
        setIframeHeight(700)
      }
    }

    // Set initial height
    handleResize()

    // Add event listener
    window.addEventListener("resize", handleResize)

    // Clean up
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)

    // Add animation delay for content load
    const timer = setTimeout(() => {
      setIsLoaded(true)
    }, 100)

    // Force show iframe after a reasonable timeout (8 seconds)
    const loadingTimeout = setTimeout(() => {
      setIframeLoaded(true)
    }, 8000)

    return () => {
      window.removeEventListener("scroll", handleScroll)
      clearTimeout(timer)
      clearTimeout(loadingTimeout)
    }
  }, [])

  // Handle iframe load event
  const handleIframeLoad = () => {
    console.log("Iframe loaded successfully")
    setIframeLoaded(true)
  }

  // Handle iframe error
  const handleIframeError = () => {
    console.error("Error loading iframe")
    setIframeError(true)
    setIframeLoaded(true) // Still set loaded to true to remove loading indicator
  }

  // Reload iframe
  const reloadIframe = () => {
    setIframeLoaded(false)
    setIframeError(false)
    // Force the iframe to reload by changing the key
    document.getElementById("countdownIframe")?.remove()
    const iframe = document.createElement("iframe")
    iframe.src = "https://widget.nicehash.com/countdown"
    iframe.width = "100%"
    iframe.height = "100%"
    iframe.scrolling = "yes"
    iframe.id = "countdownIframe"
    iframe.className = "absolute inset-0 w-full h-full border-0"
    iframe.title = "Crypto Halving Countdown"
    iframe.onload = handleIframeLoad
    iframe.onerror = handleIframeError
    iframe.setAttribute(
      "allow",
      "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",
    )
    iframe.setAttribute("sandbox", "allow-same-origin allow-scripts allow-popups allow-forms")
    document.getElementById("iframeContainer")?.appendChild(iframe)

    // Set a new timeout
    setTimeout(() => {
      setIframeLoaded(true)
    }, 8000)
  }

  return (
    <div className={cn("min-h-screen bg-[#07071C] text-white", isDarkMode ? "dark" : "")}>
      {/* Enhanced Background elements - responsive adjustments */}
      <div className="fixed inset-0 bg-[#07071C] overflow-hidden z-0">
        {/* Main gradient orbs - adjusted for different screen sizes */}
        <div className="absolute top-[5%] left-[5%] sm:left-[10%] w-[20rem] sm:w-[30rem] md:w-[40rem] h-[20rem] sm:h-[30rem] md:h-[40rem] rounded-full bg-gradient-to-r from-[#F7984A]/30 to-transparent opacity-50 blur-[100px]"></div>
        <div className="absolute bottom-[5%] sm:bottom-[10%] right-[5%] sm:right-[10%] w-[20rem] sm:w-[25rem] md:w-[35rem] h-[20rem] sm:h-[25rem] md:h-[35rem] rounded-full bg-gradient-to-l from-[#F7984A]/30 to-transparent opacity-50 blur-[100px]"></div>
        <div className="absolute top-[40%] right-[5%] sm:right-[15%] w-[15rem] sm:w-[20rem] md:w-[30rem] h-[15rem] sm:h-[20rem] md:h-[30rem] rounded-full bg-gradient-to-t from-blue-500/20 to-transparent opacity-40 blur-[100px]"></div>

        {/* Grid overlay with improved visibility */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px] sm:bg-[size:30px_30px] md:bg-[size:40px_40px] opacity-70"></div>

        {/* Subtle texture overlay */}
        <div className="absolute inset-0 bg-[url('/placeholder.svg?height=100&width=100')] bg-repeat opacity-[0.015]"></div>
      </div>

      {/* Navigation handled by imported Navbar component */}
      <Navbar />

      {/* Main Content */}
      <main className="pt-16 sm:pt-20 md:pt-24 pb-12 sm:pb-16 relative z-10">
        <div className="container mx-auto px-4 md:px-6">
          {/* Page Header with animation - responsive text sizes */}
          <div
            className={`mb-6 sm:mb-8 transition-all duration-700 ease-out ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
          >
            <div className="max-w-4xl mx-auto text-center mb-6 sm:mb-10">
              <div className="inline-flex items-center px-2 sm:px-3 py-1 rounded-full bg-gray-800/70 text-gray-300 text-xs sm:text-sm font-medium mb-3 sm:mb-4 border border-gray-700/30 shadow-sm">
                <span className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-[#F7984A] mr-1.5 sm:mr-2 animate-pulse"></span>
                BlockchainBay
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-3 sm:mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-white/70">
                Crypto Halving
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-gray-300">
                Track the official countdown to the next Bitcoin halving event
              </p>
            </div>
          </div>

          {/* Countdown Section - Made Larger and Responsive */}
          <div
            className={`transition-all duration-700 ease-out delay-100 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
          >
            <Card className="bg-[#0D0B26]/80 border border-gray-800/50 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:border-gray-700/70 backdrop-blur-sm">
              <div className="p-4 sm:p-6 border-b border-gray-800/50 flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4">
                <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#F7984A]/10 flex items-center justify-center shadow-inner shadow-[#F7984A]/5">
                    <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-[#F7984A]" />
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-white">Crypto Halving Countdown</h2>
                    <p className="text-sm sm:text-base text-gray-300">Live tracking of the next Bitcoin halving</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 mt-2 sm:mt-0">
                  <Badge className="bg-[#0D0B26] border border-blue-500/20 text-blue-400 hover:bg-blue-500/10 hover:border-blue-500/40 transition-all duration-300 text-xs sm:text-sm">
                    Official
                  </Badge>
                  <Badge className="bg-[#0D0B26] border border-[#F7984A]/20 text-[#F7984A] hover:bg-[#F7984A]/10 hover:border-[#F7984A]/40 transition-all duration-300 flex items-center gap-1 text-xs sm:text-sm">
                    <span className="w-1 sm:w-1.5 h-1 sm:h-1.5 rounded-full bg-[#F7984A] animate-pulse"></span>
                    Live
                  </Badge>
                </div>
              </div>

              <div className="relative">
                {/* Loading state for iframe */}
                {!iframeLoaded && (
                  <div className="absolute inset-0 flex items-center justify-center bg-[#0D0B26]/90 z-10">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 border-3 sm:border-4 border-t-[#F7984A] border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin mb-3 sm:mb-4"></div>
                      <p className="text-sm sm:text-base text-gray-300">Loading countdown...</p>
                    </div>
                  </div>
                )}

                {/* Error state for iframe */}
                {iframeError && (
                  <div className="absolute inset-0 flex items-center justify-center bg-[#0D0B26]/90 z-10">
                    <div className="flex flex-col items-center px-4 text-center">
                      <p className="text-sm sm:text-base text-red-400 mb-3 sm:mb-4">Failed to load countdown widget</p>
                      <Button
                        onClick={reloadIframe}
                        className="bg-[#F7984A] hover:bg-[#F7984A]/90 text-white flex items-center gap-2"
                        size="sm"
                      >
                        <RefreshCw className="w-4 h-4" />
                        <span>Try Again</span>
                      </Button>
                    </div>
                  </div>
                )}

                {/* Embed the countdown iframe with responsive height */}
                <div id="iframeContainer" className="relative bg-[#0A0918]" style={{ height: `${iframeHeight}px` }}>
                  <div className="absolute inset-0 bg-gradient-to-b from-[#0A0918]/0 via-transparent to-[#0A0918]/20 pointer-events-none z-10"></div>
                  <div className="absolute bottom-0 left-0 right-0 h-8 sm:h-12 bg-gradient-to-t from-[#0A0918] to-transparent pointer-events-none z-10 flex items-center justify-center">
                    <div className="h-4 sm:h-5 w-4 sm:w-5 border-b-2 border-r-2 border-[#F7984A]/70 transform rotate-45 translate-y-[-6px] sm:translate-y-[-8px] animate-bounce opacity-70"></div>
                  </div>
                  <iframe
                    src="https://widget.nicehash.com/countdown"
                    width="100%"
                    height="100%"
                    scrolling="yes"
                    id="countdownIframe"
                    onLoad={handleIframeLoad}
                    onError={handleIframeError}
                    className="absolute inset-0 w-full h-full border-0"
                    title="Crypto Halving Countdown"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                  ></iframe>
                </div>
              </div>

              <div className="p-4 sm:p-6 border-t border-gray-800/50">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4">
                  <div className="flex items-center gap-2 text-gray-300 text-xs sm:text-sm order-2 sm:order-1">
                    <span>Powered by BlockchainBay</span>
                  </div>
                  <Button
                    className="rounded-full bg-[#F7984A] hover:bg-[#F7984A]/90 text-white px-3 sm:px-4 md:px-6 py-1.5 sm:py-2 shadow-lg shadow-[#F7984A]/20 transition-all duration-300 hover:shadow-[#F7984A]/30 hover:translate-y-[-2px] group w-full sm:w-auto order-1 sm:order-2 text-sm"
                    onClick={() => window.open("https://www.nicehash.com/countdown", "_blank")}
                  >
                    <span>Learn More</span>
                    <ArrowUpRight className="ml-1.5 sm:ml-2 h-3 w-3 sm:h-4 sm:w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Additional Information - Responsive grid */}
          <div
            className={`mt-8 sm:mt-12 grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 transition-all duration-700 ease-out delay-200 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
          >
            <Card className="bg-[#0D0B26]/60 border border-gray-800/50 rounded-xl overflow-hidden p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">What is Bitcoin Halving?</h3>
              <p className="text-sm sm:text-base text-gray-300 mb-3 sm:mb-4">
                Bitcoin halving is a pre-programmed event that occurs approximately every four years (or every 210,000
                blocks) where the reward for mining Bitcoin transactions is cut in half. This reduces the rate at which
                new bitcoins are created and lowers the available supply.
              </p>
              <p className="text-sm sm:text-base text-gray-300">
                This mechanism is central to Bitcoin's monetary policy and its deflationary nature, as it ensures that
                the total supply will never exceed 21 million coins.
              </p>
            </Card>

            <Card className="bg-[#0D0B26]/60 border border-gray-800/50 rounded-xl overflow-hidden p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">Why Are Halvings Important?</h3>
              <p className="text-sm sm:text-base text-gray-300 mb-3 sm:mb-4">
                Halvings are significant economic events in the Bitcoin ecosystem. They reduce the rate at which new
                bitcoins enter circulation, making Bitcoin more scarce over time.
              </p>
              <p className="text-sm sm:text-base text-gray-300">
                Historically, Bitcoin halvings have preceded periods of significant price appreciation, as the reduced
                supply growth meets continued or increasing demand, potentially driving up the price according to
                fundamental economic principles.
              </p>
            </Card>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer className="relative z-20" />
    </div>
  )
}

