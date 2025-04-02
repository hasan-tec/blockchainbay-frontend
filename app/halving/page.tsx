"use client"
import { useState, useEffect } from "react"
import { ArrowUpRight, Clock, RefreshCw, BarChart, Shield, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import Navbar from "@/components/Navbar"
import { Footer } from "@/components/NewsletterFooter"
import Image from "next/image"
import Link from "next/link"

export default function CryptoHalvingCountdownPage() {
  const [scrolled, setScrolled] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [isLoaded, setIsLoaded] = useState(false)
  const [iframeLoaded, setIframeLoaded] = useState(false)
  const [iframeError, setIframeError] = useState(false)
  const [iframeHeight, setIframeHeight] = useState(700)
  const [activeTab, setActiveTab] = useState('what')

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
    }, 0);

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
      {!isLoaded && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-[#07071C] text-white">
          <div className="text-xl font-bold">Loading content...</div>
        </div>
      )}
      {/* Enhanced Background elements - responsive adjustments */}
      <div className="fixed inset-0 bg-[#07071C] overflow-hidden z-0 pointer-events-none">
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
      <main className="pt-16 sm:pt-20 md:pt-24 pb-12 sm:pb-16 relative z-20">
        <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl">
          {/* Page Header with animation - responsive text sizes */}
          <div
            className={`mb-8 sm:mb-10 md:mb-12 transition-all duration-700 ease-out ${isLoaded ? "opacity-100 translate-y-0" : "opacity-100 translate-y-0"}`}
          >
            <div className="max-w-4xl mx-auto text-center mb-6 sm:mb-10">
              <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-gray-800/70 text-gray-300 text-sm font-medium mb-4 border border-gray-700/30 shadow-sm backdrop-blur-sm">
                <span className="w-2 h-2 rounded-full bg-[#F7984A] mr-2 animate-pulse"></span>
                BlockchainBay
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-4 sm:mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-white/70 tracking-tight leading-tight">
                Crypto Halving
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
                Track the official countdown to the next Bitcoin halving event
              </p>
            </div>
          </div>

          {/* Countdown Section - Made Larger and Responsive */}
          <div
            className={`transition-all duration-700 ease-out delay-100 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-100 translate-y-0"}`}
          >
            <Card className="bg-[#0D0B26]/80 border border-gray-800/50 rounded-xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 hover:border-gray-700/70 backdrop-blur-sm">
              <div className="p-5 sm:p-6 border-b border-gray-800/50 flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
                  <div className="w-12 h-12 rounded-full bg-[#F7984A]/10 flex items-center justify-center shadow-inner shadow-[#F7984A]/5">
                    <Clock className="w-6 h-6 text-[#F7984A]" />
                  </div>
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-white">Crypto Halving Countdown</h2>
                    <p className="text-base text-gray-300">Live tracking of the next Bitcoin halving</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 mt-2 sm:mt-0">
                  <Badge className="bg-[#0D0B26] border border-blue-500/20 text-blue-400 hover:bg-blue-500/10 hover:border-blue-500/40 transition-all duration-300 text-sm py-1 px-3">
                    Official
                  </Badge>
                  <Badge className="bg-[#0D0B26] border border-[#F7984A]/20 text-[#F7984A] hover:bg-[#F7984A]/10 hover:border-[#F7984A]/40 transition-all duration-300 flex items-center gap-1.5 text-sm py-1 px-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#F7984A] animate-pulse"></span>
                    Live
                  </Badge>
                </div>
              </div>

              <div className="relative">
                {/* Loading state for iframe */}
                {!iframeLoaded && (
                  <div className="absolute inset-0 flex items-center justify-center bg-[#0D0B26]/90 z-10">
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 border-4 border-t-[#F7984A] border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin mb-4"></div>
                      <p className="text-base text-gray-300">Loading countdown...</p>
                    </div>
                  </div>
                )}

                {/* Error state for iframe */}
                {iframeError && (
                  <div className="absolute inset-0 flex items-center justify-center bg-[#0D0B26]/90 z-10">
                    <div className="flex flex-col items-center px-4 text-center">
                      <p className="text-base text-red-400 mb-4">Failed to load countdown widget</p>
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
                  <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-[#0A0918] to-transparent pointer-events-none z-10 flex items-center justify-center">
                    <div className="h-5 w-5 border-b-2 border-r-2 border-[#F7984A]/70 transform rotate-45 translate-y-[-8px] animate-bounce opacity-70"></div>
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

              <div className="p-5 sm:p-6 border-t border-gray-800/50">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div className="flex items-center gap-2 text-gray-300 text-sm order-2 sm:order-1">
                    <span>Powered by BlockchainBay</span>
                  </div>
                  <Button
                    className="rounded-full bg-[#F7984A] hover:bg-[#F7984A]/90 text-white px-6 py-2.5 shadow-lg shadow-[#F7984A]/20 transition-all duration-300 hover:shadow-[#F7984A]/30 hover:translate-y-[-2px] group w-full sm:w-auto order-1 sm:order-2 text-sm font-medium"
                    onClick={() => window.open("https://www.nicehash.com/countdown", "_blank")}
                  >
                    <span>Learn More</span>
                    <ArrowUpRight className="ml-2 h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Bitcoin Halving Stats - New Section with Chart */}
          <div
            className={`mt-12 sm:mt-16 transition-all duration-700 ease-out delay-150 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-100 translate-y-0"}`}
          >
            <Card className="bg-[#0D0B26]/60 border border-gray-800/50 rounded-xl overflow-hidden shadow-lg">
              <div className="p-5 sm:p-6 border-b border-gray-800/50">
                <h2 className="text-2xl sm:text-3xl font-bold mb-2">Bitcoin Halving History</h2>
                <p className="text-base text-gray-300">
                  Historical impact of previous Bitcoin halving events on price cycles
                </p>
              </div>
              
              <div className="p-5 sm:p-6 relative w-full overflow-hidden">
                <div className="aspect-[16/9] w-full relative bg-[#0A0918]/80 rounded-lg overflow-hidden shadow-inner">
                  <Image 
                    src="/halving-chart-history.jpg" 
                    alt="Bitcoin halving history chart showing price cycles" 
                    width={1200} 
                    height={675}
                    className="w-full h-auto object-contain"
                    layout="responsive"
                  />
                </div>
                <p className="text-xs text-gray-400 mt-3 text-center">Bitcoin price patterns around halving events (2012, 2016, 2020, 2024)</p>
              </div>
            </Card>
          </div>

          {/* Halving Rewards Visualization - New Section - FIXED EQUAL HEIGHT CARDS */}
          <div
            className={`mt-12 sm:mt-16 grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 transition-all duration-700 ease-out delay-200 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-100 translate-y-0"}`}
          >
            <Card className="bg-[#0D0B26]/60 border border-gray-800/50 rounded-xl overflow-hidden shadow-lg flex flex-col">
              <div className="p-5 sm:p-6 border-b border-gray-800/50">
                <h2 className="text-xl sm:text-2xl font-bold mb-2">Halving Rewards</h2>
                <p className="text-base text-gray-300">
                  The decreasing block rewards over time, creating Bitcoin's deflationary model
                </p>
              </div>
              
              <div className="p-5 sm:p-6 relative w-full overflow-hidden flex-1 flex flex-col justify-center">
                <div className="aspect-video w-full relative bg-[#0A0918]/50 rounded-lg overflow-hidden shadow-inner">
                  <Image 
                    src="/halving-rewards.jpg" 
                    alt="Bitcoin halving rewards diagram showing the decreasing rewards" 
                    width={800} 
                    height={450}
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            </Card>

            <Card className="bg-[#0D0B26]/60 border border-gray-800/50 rounded-xl overflow-hidden shadow-lg flex flex-col">
              <div className="p-5 sm:p-6 border-b border-gray-800/50">
                <h2 className="text-xl sm:text-2xl font-bold mb-2">Media Coverage Analysis</h2>
                <p className="text-base text-gray-300">
                  Mainstream media coverage of Bitcoin leading up to the 2024 halving
                </p>
              </div>
              
              <div className="p-5 sm:p-6 relative w-full overflow-hidden flex-1 flex flex-col justify-center">
                <div className="aspect-video w-full relative bg-[#0A0918]/50 rounded-lg overflow-hidden shadow-inner">
                  <Image 
                    src="/media-coverage.jpg" 
                    alt="Chart showing volume of mainstream media coverage of Bitcoin" 
                    width={800} 
                    height={450}
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            </Card>
          </div>

          {/* Bitcoin Halving Detailed Explanation */}
          <div
            className={`mt-12 sm:mt-16 transition-all duration-700 ease-out delay-250 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-100 translate-y-0"}`}
          >
            <Card className="bg-[#0D0B26]/60 border border-gray-800/50 rounded-xl overflow-hidden shadow-lg">
              <div className="p-5 sm:p-6 border-b border-gray-800/50">
                <h2 className="text-2xl sm:text-3xl font-bold mb-2">Understanding Crypto Halvings</h2>
                <p className="text-base text-gray-300">
                  A detailed look at what halvings are and why they matter
                </p>
              </div>
              
              <div className="border-b border-gray-800/30">
                <div className="flex overflow-x-auto scrollbar-hide px-2">
                  <button 
                    onClick={() => setActiveTab('what')}
                    className={`py-4 px-6 text-base transition-colors duration-200 whitespace-nowrap font-medium ${activeTab === 'what' ? 'text-[#F7984A] border-b-2 border-[#F7984A]' : 'text-gray-400 hover:text-gray-300'}`}
                  >
                    What Are Halvings
                  </button>
                  <button 
                    onClick={() => setActiveTab('bitcoin')}
                    className={`py-4 px-6 text-base transition-colors duration-200 whitespace-nowrap font-medium ${activeTab === 'bitcoin' ? 'text-[#F7984A] border-b-2 border-[#F7984A]' : 'text-gray-400 hover:text-gray-300'}`}
                  >
                    Bitcoin Halving
                  </button>
                  <button 
                    onClick={() => setActiveTab('impact')}
                    className={`py-4 px-6 text-base transition-colors duration-200 whitespace-nowrap font-medium ${activeTab === 'impact' ? 'text-[#F7984A] border-b-2 border-[#F7984A]' : 'text-gray-400 hover:text-gray-300'}`}
                  >
                    Market Impact
                  </button>
                  <button 
                    onClick={() => setActiveTab('mining')}
                    className={`py-4 px-6 text-base transition-colors duration-200 whitespace-nowrap font-medium ${activeTab === 'mining' ? 'text-[#F7984A] border-b-2 border-[#F7984A]' : 'text-gray-400 hover:text-gray-300'}`}
                  >
                    Mining Effects
                  </button>
                </div>
              </div>
              
              <div className="p-5 sm:p-6 lg:p-8">
                {activeTab === 'what' && (
                  <div className="space-y-4">
                    <p className="text-gray-300 text-base leading-relaxed">
                      Crypto halvings, also known as halving events or simply halvings, are a critical component of the cryptocurrency market that have a significant impact on the supply and demand dynamics of various cryptocurrencies.
                    </p>
                    <p className="text-gray-300 text-base leading-relaxed">
                      Most Proof of Work (POW) Cryptocurrencies have halvings that reduce the reward per block. Each halving reduces the rate of inflation and, as a result, pushes the crypto price upward.
                    </p>
                    <div className="flex items-center gap-4 p-4 bg-[#0A0918]/70 rounded-lg border border-gray-800/30 mt-6">
                      <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                        <BarChart className="w-6 h-6 text-blue-400" />
                      </div>
                      <div className="text-base">
                        <span className="text-blue-400 font-medium">Key Point:</span> Halvings are designed to control inflation and create scarcity, similar to precious metals.
                      </div>
                    </div>
                  </div>
                )}
                
                {activeTab === 'bitcoin' && (
                  <div className="space-y-4">
                    <p className="text-gray-300 text-base leading-relaxed">
                      Bitcoin, the first and most well-known cryptocurrency, serves as the quintessential example of how halving works. Bitcoin undergoes a halving approximately every four years or after every 210,000 blocks are mined.
                    </p>
                    <p className="text-gray-300 text-base leading-relaxed">
                      During this event, the reward for mining new blocks is cut in half. Initially, miners received 50 BTC for each block they successfully added to the blockchain. Over time, this reward has been systematically reduced to 25 BTC in 2012, 12.5 BTC in 2016, 6.25 BTC in 2020, and 3.125 BTC in 2024, with the next halving in 2028 expected to decrease it to 1.562 BTC per block.
                    </p>
                    <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                      <div className="bg-[#0A0918]/70 p-4 rounded-lg border border-gray-800/30 shadow-inner">
                        <div className="text-[#F7984A] font-bold text-xl mb-1">50 BTC</div>
                        <div className="text-sm text-gray-400">2009-2012</div>
                      </div>
                      <div className="bg-[#0A0918]/70 p-4 rounded-lg border border-gray-800/30 shadow-inner">
                        <div className="text-[#F7984A] font-bold text-xl mb-1">25 BTC</div>
                        <div className="text-sm text-gray-400">2012-2016</div>
                      </div>
                      <div className="bg-[#0A0918]/70 p-4 rounded-lg border border-gray-800/30 shadow-inner">
                        <div className="text-[#F7984A] font-bold text-xl mb-1">12.5 BTC</div>
                        <div className="text-sm text-gray-400">2016-2020</div>
                      </div>
                      <div className="bg-[#0A0918]/70 p-4 rounded-lg border border-gray-800/30 shadow-inner">
                        <div className="text-[#F7984A] font-bold text-xl mb-1">6.25 BTC</div>
                        <div className="text-sm text-gray-400">2020-2024</div>
                      </div>
                    </div>
                  </div>
                )}
                
                {activeTab === 'impact' && (
                  <div className="space-y-4">
                    <p className="text-gray-300 text-base leading-relaxed">
                      By halving the mining reward, the supply of new bitcoins entering circulation decreases. Assuming demand remains constant or increases, this reduction in supply could theoretically lead to an increase in Bitcoin's price due to the basic economic principle of supply and demand.
                    </p>
                    <p className="text-gray-300 text-base leading-relaxed">
                      Historical data shows significant price surges following Bitcoin halvings, though correlation does not imply causation, and other factors like market sentiment and external economic conditions also play roles.
                    </p>
                    <div className="flex items-center gap-4 p-4 bg-[#0A0918]/70 rounded-lg border border-gray-800/30 mt-6">
                      <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
                        <TrendingUp className="w-6 h-6 text-green-400" />
                      </div>
                      <div className="text-base">
                        <span className="text-green-400 font-medium">Market Reaction:</span> Each halving has preceded significant bull runs in Bitcoin's price, leading many to speculate and strategize around these events.
                      </div>
                    </div>
                  </div>
                )}
                
                {activeTab === 'mining' && (
                  <div className="space-y-4">
                    <p className="text-gray-300 text-base leading-relaxed">
                      Halving events directly affect miners. With each halving, the income from mining decreases unless the price of Bitcoin increases proportionally. Less efficient miners might find mining unprofitable and could exit the market, potentially leading to centralization of mining power among those with lower operational costs or more efficient hardware.
                    </p>
                    <p className="text-gray-300 text-base leading-relaxed">
                      Bitcoin's security is maintained by miners who validate transactions. As rewards decrease, miners rely more on transaction fees for revenue. If these fees do not compensate for the loss in block rewards, there could be security concerns, as miners might be less incentivized to secure the network.
                    </p>
                    <div className="flex items-center gap-4 p-4 bg-[#0A0918]/70 rounded-lg border border-gray-800/30 mt-6">
                      <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center">
                        <Shield className="w-6 h-6 text-purple-400" />
                      </div>
                      <div className="text-base">
                        <span className="text-purple-400 font-medium">Security Note:</span> Bitcoin's design adjusts the mining difficulty to ensure blocks are mined at a consistent rate, maintaining network stability even as rewards decrease.
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Additional Information - Responsive grid - Original sections - FIXED EQUAL HEIGHT */}
          <div
            className={`mt-12 sm:mt-16 grid grid-cols-1 gap-6 lg:gap-8 md:grid-cols-2 transition-all duration-700 ease-out delay-300 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-100 translate-y-0"}`}
          >
            <Card className="bg-[#0D0B26]/60 border border-gray-800/50 rounded-xl overflow-hidden p-5 sm:p-6 lg:p-8 shadow-lg flex flex-col">
              <h3 className="text-xl sm:text-2xl font-bold mb-4">What is Bitcoin Halving?</h3>
              <div className="flex-1">
                <p className="text-base text-gray-300 mb-4 leading-relaxed">
                  Bitcoin halving is a pre-programmed event that occurs approximately every four years (or every 210,000
                  blocks) where the reward for mining Bitcoin transactions is cut in half. This reduces the rate at which
                  new bitcoins are created and lowers cut in half. This reduces the rate at which new bitcoins are created and lowers the available supply.
              </p>
              <p className="text-base text-gray-300 leading-relaxed">
                This mechanism is central to Bitcoin's monetary policy and its deflationary nature, as it ensures that
                the total supply will never exceed 21 million coins.
              </p>
              </div>
            </Card>

            <Card className="bg-[#0D0B26]/60 border border-gray-800/50 rounded-xl overflow-hidden p-5 sm:p-6 lg:p-8 shadow-lg flex flex-col">
              <h3 className="text-xl sm:text-2xl font-bold mb-4">Why Are Halvings Important?</h3>
              <div className="flex-1">
                <p className="text-base text-gray-300 mb-4 leading-relaxed">
                  Halvings are significant economic events in the Bitcoin ecosystem. They reduce the rate at which new
                  bitcoins enter circulation, making Bitcoin more scarce over time.
                </p>
                <p className="text-base text-gray-300 leading-relaxed">
                  Historically, Bitcoin halvings have preceded periods of significant price appreciation, as the reduced
                  supply growth meets continued or increasing demand, potentially driving up the price according to
                  fundamental economic principles.
                </p>
              </div>
            </Card>
          </div>

          {/* Long-term implications section - FIXED EQUAL HEIGHT */}
          <div
            className={`mt-12 sm:mt-16 transition-all duration-700 ease-out delay-350 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-100 translate-y-0"}`}
          >
            <Card className="bg-[#0D0B26]/60 border border-gray-800/50 rounded-xl overflow-hidden p-5 sm:p-6 lg:p-8 shadow-lg">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div>
              <h3 className="text-2xl font-bold  mb-6">Long-Term Implications of Bitcoin Halvings</h3>
                  <p className="text-base text-gray-300 mb-4 leading-relaxed">
                    Bitcoin halving is part of the protocol to ensure that there will only ever be 21 million bitcoins in existence, mimicking the scarcity of precious metals like gold. This cap on supply is central to Bitcoin's value proposition as a "digital gold" or store of value.
                  </p>
                  <p className="text-base text-gray-300 leading-relaxed">
                    The last bitcoin is expected to be mined around the year 2140, after which miners will solely rely on transaction fees. This long-term vision creates a sustainable economic model for the network beyond the initial distribution phase.
                  </p>
                </div>
                
                <div className="relative">
                  <div className="aspect-[4/3] w-full relative bg-[#0A0918]/50 rounded-lg overflow-hidden shadow-inner">
                    <Image 
                      src="/miners-rewards.jpg"
                      alt="Chart showing miners' rewards decreasing over time" 
                      width={800} 
                      height={600}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-3 text-center">Miners' rewards decrease over time as Bitcoin approaches its maximum supply</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Market speculation section */}
          <div
            className={`mt-12 sm:mt-16 transition-all duration-700 ease-out delay-400 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-100 translate-y-0"}`}
          >
            <Card className="bg-[#0D0B26]/60 border border-gray-800/50 rounded-xl overflow-hidden shadow-lg">
              <div className="p-5 sm:p-6 lg:p-8 border-b border-gray-800/50">
                <h3 className="text-2xl font-bold">Market Reaction and Speculation</h3>
              </div>
              
              <div className="p-5 sm:p-6 lg:p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="bg-[#0A0918]/70 p-5 rounded-lg border border-gray-800/30 shadow-inner">
                    <h4 className="text-xl font-medium text-[#F7984A] mb-3">Market Anticipation</h4>
                    <p className="text-base text-gray-300 leading-relaxed">
                      The anticipation of Bitcoin halvings often leads to increased media coverage and investor interest, sometimes driving up demand before the event. There's a phenomenon often described as "buy the rumor, sell the news," where prices might spike in anticipation but could see corrections post-event.
                    </p>
                  </div>
                  
                  <div className="bg-[#0A0918]/70 p-5 rounded-lg border border-gray-800/30 shadow-inner">
                    <h4 className="text-xl font-medium text-[#F7984A] mb-3">Historical Performance</h4>
                    <p className="text-base text-gray-300 leading-relaxed">
                      Each halving has preceded significant bull runs in Bitcoin's price, leading many to speculate and strategize around these events. However, while historical trends provide a narrative, they don't guarantee future outcomes due to the complex interplay of market dynamics.
                    </p>
                  </div>
                </div>
                
                <div className="flex flex-col justify-center">
                  <div className="bg-[#0A0918]/70 p-5 rounded-lg border border-gray-800/30 h-full flex flex-col justify-center shadow-inner">
                    <h4 className="text-xl font-medium text-[#F7984A] mb-5 text-center">Media Coverage Trends</h4>
                    <div className="relative w-full">
                      <Image 
                        src="/media-coverage.jpg" 
                        alt="Chart showing volume of mainstream media coverage of Bitcoin" 
                        width={600} 
                        height={400}
                        className="w-full h-auto object-contain mx-auto"
                      />
                    </div>
                    <p className="text-sm text-gray-400 mt-5 text-center">
                      Bitcoin media coverage typically spikes around halving events
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* FAQs */}
          <div
            className={`mt-12 sm:mt-16 transition-all duration-700 ease-out delay-450 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-100 translate-y-0"}`}
          >
            <Card className="bg-[#0D0B26]/60 border border-gray-800/50 rounded-xl overflow-hidden shadow-lg">
              <div className="p-5 sm:p-6 lg:p-8 border-b border-gray-800/50">
                <h3 className="text-2xl font-bold">Frequently Asked Questions</h3>
              </div>
              
              <div className="divide-y divide-gray-800/30">
                <div className="p-5 sm:p-6 lg:p-8">
                  <h4 className="text-xl font-medium text-white mb-3">When is the next Bitcoin halving?</h4>
                  <p className="text-base text-gray-300 leading-relaxed">
                    The next Bitcoin halving is expected to occur in April 2024, reducing the block reward from 6.25 BTC to 3.125 BTC. The exact date depends on the rate at which blocks are mined, as halvings occur every 210,000 blocks.
                  </p>
                </div>
                
                <div className="p-5 sm:p-6 lg:p-8">
                  <h4 className="text-xl font-medium text-white mb-3">How do halvings affect Bitcoin's price?</h4>
                  <p className="text-base text-gray-300 leading-relaxed">
                    Historically, Bitcoin's price has increased significantly following halving events, though not immediately. The price appreciation typically occurs over the following year as the reduced supply of new coins enters the market. However, past performance is not indicative of future results, and many other factors influence cryptocurrency prices.
                  </p>
                </div>
                
                <div className="p-5 sm:p-6 lg:p-8">
                  <h4 className="text-xl font-medium text-white mb-3">Do other cryptocurrencies have halvings?</h4>
                  <p className="text-base text-gray-300 leading-relaxed">
                    Yes, several other Proof of Work cryptocurrencies have adopted similar halving mechanisms. Litecoin, for example, has a halving event approximately every four years, with the last occurring in August 2023. However, not all cryptocurrencies use this model, as some have different tokenomics and inflation schedules.
                  </p>
                </div>
                
                <div className="p-5 sm:p-6 lg:p-8">
                  <h4 className="text-xl font-medium text-white mb-3">What happens when all 21 million Bitcoins are mined?</h4>
                  <p className="text-base text-gray-300 leading-relaxed">
                    When all 21 million Bitcoins are mined (estimated around the year 2140), miners will no longer receive block rewards in the form of newly minted coins. Instead, they will rely solely on transaction fees as compensation for validating transactions and securing the network. This transition is expected to happen gradually as block rewards approach zero.
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Call to action */}
          <div
            className={`mt-16 sm:mt-20 transition-all duration-700 ease-out delay-500 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-100 translate-y-0"}`}
          >
            <div className="bg-gradient-to-r from-[#0A0918] via-[#0D0B26] to-[#0A0918] rounded-xl border border-gray-800/50 p-8 sm:p-10 text-center shadow-lg">
              <h3 className="text-2xl sm:text-3xl font-bold mb-5 bg-clip-text text-transparent bg-gradient-to-r from-[#F7984A] to-white">Stay Updated on Crypto Halvings</h3>
              <p className="text-gray-300 max-w-3xl mx-auto mb-8 text-lg leading-relaxed">
                Join our community to receive the latest updates on Bitcoin halving events, market analysis, and exclusive insights from crypto experts.
              </p>
              <Link 
              href="https://www.youtube.com/@chrisbagnell"
              >
              <Button
                className="rounded-full bg-[#F7984A] hover:bg-[#F7984A]/90 text-white px-8 py-3 shadow-lg shadow-[#F7984A]/20 transition-all duration-300 hover:shadow-[#F7984A]/30 hover:translate-y-[-2px] text-base font-medium"
              >
                Subscribe to Updates
              </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer className="relative z-20" />
    </div>
  );
}

