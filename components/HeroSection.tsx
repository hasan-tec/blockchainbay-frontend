"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

// Define interface for stats
interface Stat {
  value: string
  label: string
}

export const StatsRow = () => {
  const stats: Stat[] = [
    { value: "1,500+", label: "Crypto Projects" },
    { value: "250K+", label: "Monthly Visitors" },
    { value: "50+", label: "Podcast Episodes" },
    { value: "100+", label: "Products in Store" },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8 mt-8 sm:mt-12 md:mt-16 w-full max-w-4xl mx-auto relative">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="flex flex-col items-center p-3 sm:p-4 md:p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10"
        >
          <span className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-0.5 md:mb-1">{stat.value}</span>
          <span className="text-xs sm:text-sm text-gray-400 text-center">{stat.label}</span>
        </div>
      ))}
    </div>
  )
}

const HeroSection = () => {
  return (
    <section className="relative pt-16 sm:pt-24 md:pt-32 pb-12 sm:pb-16 md:pb-20 overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto relative">
          {/* Gradient Orbs - Adjusted for better small screen display */}
          <div className="absolute -top-[100px] sm:-top-[150px] -left-[100px] sm:-left-[150px] w-[250px] sm:w-[400px] h-[250px] sm:h-[400px] rounded-full bg-[#F7984A]/20 blur-[50px] sm:blur-[100px] mix-blend-screen"></div>
          <div className="absolute -top-[100px] sm:-top-[150px] -right-[100px] sm:-right-[150px] w-[250px] sm:w-[400px] h-[250px] sm:h-[400px] rounded-full bg-purple-500/20 blur-[50px] sm:blur-[100px] mix-blend-screen"></div>
          <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[450px] md:w-[600px] h-[300px] sm:h-[450px] md:h-[600px] rounded-full bg-blue-500/10 blur-[60px] sm:blur-[90px] md:blur-[120px] mix-blend-screen"></div>

          <div className="relative">
            

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold mb-4 sm:mb-6 text-white leading-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-white/70">
              Your <span className="text-[#F7984A]">Crypto</span>  hub
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-6 sm:mb-8 max-w-2xl mx-auto">
              Stay updated with the newest crypto projects, tech news, and exclusive giveaways. Your one-stop
              destination for everything crypto.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-8 sm:mb-10 md:mb-12 justify-center">
              <Button
                className="bg-[#F7984A] hover:bg-[#F7984A]/90 text-white px-5 sm:px-6 md:px-8 py-4 sm:py-5 md:py-6 text-base sm:text-lg rounded-md shadow-lg shadow-[#F7984A]/20 transition-all duration-300"
                asChild
              >
                <Link href="/projects">
                  <span className="z-10">Explore Directory</span>
                  <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                </Link>
              </Button>
              <Button
                variant="outline"
                className="z-10 border-white/20 hover:bg-white hover:text-black text-white px-5 sm:px-6 md:px-8 py-4 sm:py-5 md:py-6 text-base sm:text-lg rounded-md transition-all duration-300 bg-black"
                asChild
              >
                <Link href="/podcasts">
                  <span className="z-10">Listen to Podcast</span>
                </Link>
              </Button>
            </div>
          </div>

          <StatsRow />

          {/* Background Elements */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] sm:w-[140%] h-[120%] sm:h-[140%] bg-gradient-to-br from-[#F7984A]/5 to-purple-500/5 rounded-full blur-[50px] sm:blur-[100px] -z-10"></div>
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDIwIDAgTCAwIDAgMCAyMCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMDUpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-5"></div>
        </div>
      </div>

      {/* Background lines */}
      <div className="absolute top-20 left-0 w-full h-full -z-10 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
        <div className="absolute top-1/4 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
        <div className="absolute top-1/2 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
        <div className="absolute top-3/4 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
      </div>
    </section>
  )
}

export default HeroSection

