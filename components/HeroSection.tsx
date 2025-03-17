import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

// Define interface for stats
interface Stat {
  value: string;
  label: string;
}

export const StatsRow = () => {
  const stats: Stat[] = [
    { value: "1,500+", label: "Crypto Projects" },
    { value: "250K+", label: "Monthly Visitors" },
    { value: "50+", label: "Podcast Episodes" },
    { value: "100+", label: "Products in Store" }
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 w-full max-w-4xl mx-auto relative">
      {stats.map((stat, index) => (
        <div key={index} className="flex flex-col items-center p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
          <span className="text-3xl font-bold text-white mb-1">{stat.value}</span>
          <span className="text-sm text-gray-400">{stat.label}</span>
        </div>
      ))}
    </div>
  )
}

const HeroSection = () => {
  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto relative">
          {/* Gradient Orbs */}
          <div className="absolute -top-[150px] -left-[150px] w-[400px] h-[400px] rounded-full bg-[#F7984A]/20 blur-[100px] mix-blend-screen"></div>
          <div className="absolute -top-[150px] -right-[150px] w-[400px] h-[400px] rounded-full bg-purple-500/20 blur-[100px] mix-blend-screen"></div>
          <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-blue-500/10 blur-[120px] mix-blend-screen"></div>

          <div className="relative">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white text-sm font-medium mb-6 backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-[#F7984A] mr-2 animate-pulse"></span>
              Discover the latest crypto projects
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 text-white leading-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-white/70">
              Your <span className="text-[#F7984A]">crypto</span> directory hub
            </h1>

            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Stay updated with the newest crypto projects, tech news, and exclusive 
              giveaways. Your one-stop destination for everything crypto.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12 justify-center">
              <Button
                className="bg-[#F7984A] hover:bg-[#F7984A]/90 text-white px-8 py-6 text-lg rounded-md shadow-lg shadow-[#F7984A]/20 transition-all duration-300"
                asChild
              >
                <Link href="/projects">
                  <span className="z-10">Explore projects</span>
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                variant="outline"
                className="z-10 border-white/20 hover:bg-white hover:text-black text-white px-8 py-6 text-lg rounded-md transition-all duration-300 bg-black"
              >
              <Link href="/podcasts">
              <span className="z-10">Listen to podcast</span>
                
              </Link>
              </Button>
            </div>
          </div>

          <StatsRow />

          {/* Background Elements */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] bg-gradient-to-br from-[#F7984A]/5 to-purple-500/5 rounded-full blur-[100px] -z-10"></div>
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