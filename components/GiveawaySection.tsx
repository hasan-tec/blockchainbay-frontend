import Image from "next/image"
import { Gift } from "lucide-react"
import { Button } from "@/components/ui/button"

const GiveawayGrid = () => {
  const items = [
    {
      title: "Monthly",
      description: "Crypto Prizes",
      icon: <Gift className="h-12 w-12 mb-4 text-[#F7984A]" />,
      bgClass: "from-[#F7984A]/20 to-[#F7984A]/5"
    },
    {
      title: "Exclusive",
      description: "NFT Drops",
      image: "https://images.unsplash.com/photo-1645559704576-fef3454a40bb?q=80&w=200&auto=format&fit=crop",
      bgClass: "from-purple-500/20 to-purple-500/5"
    },
    {
      title: "Hardware",
      description: "Wallets",
      image: "https://images.unsplash.com/photo-1622630998477-20aa696ecb05?q=80&w=200&auto=format&fit=crop",
      bgClass: "from-blue-500/20 to-blue-500/5"
    },
    {
      title: "Premium",
      description: "Subscriptions",
      image: "https://images.unsplash.com/photo-1607962336938-48482a67fd82?q=80&w=200&auto=format&fit=crop",
      bgClass: "from-green-500/20 to-green-500/5"
    }
  ]

  return (
    <div className="grid grid-cols-2 gap-4">
      {items.map((item, index) => (
        <div key={index} className={`aspect-square bg-gradient-to-br ${item.bgClass} rounded-xl p-6 flex flex-col items-center justify-center text-center`}>
          {item.icon || (
            <Image
              src={item.image}
              width={48}
              height={48}
              alt={item.title}
              className="mb-4 rounded-lg"
            />
          )}
          <div className="text-xl font-bold mb-1">{item.title}</div>
          <div className="text-sm text-gray-300">{item.description}</div>
        </div>
      ))}
    </div>
  )
}

const GiveawaySection = () => {
  const benefits = [
    "Cryptocurrency Prizes",
    "Hardware Wallets",
    "Exclusive NFT Collections",
    "Premium Subscriptions",
    "Early Access to New Features",
  ]

  return (
    <section className="py-20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#07071C] via-gray-900 to-[#07071C] border border-gray-800/50">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-0 left-[10%] w-[30rem] h-[30rem] rounded-full bg-[#F7984A]/5 blur-[10rem] -z-10"></div>
            <div className="absolute bottom-0 right-[10%] w-[25rem] h-[25rem] rounded-full bg-purple-500/5 blur-[10rem] -z-10"></div>
          </div>

          <div className="relative p-8 md:p-16">
            <div className="max-w-4xl mx-auto">
              <div className="flex flex-col lg:flex-row items-center gap-12">
                <div className="lg:w-1/2">
                  <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white text-sm font-medium mb-4">
                    <Gift className="h-4 w-4 mr-2 text-[#F7984A]" />
                    Exclusive Opportunities
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight text-white">
                    Join Our Regular Crypto Giveaways
                  </h2>
                  <p className="text-lg text-gray-300 mb-6">
                    We regularly host giveaways for our community members. Win hardware wallets, exclusive NFTs,
                    cryptocurrency prizes, and more.
                  </p>
                  <ul className="space-y-3 mb-8">
                    {benefits.map((item, index) => (
                      <li key={index} className="flex items-center text-gray-300">
                        <span className="w-5 h-5 rounded-full bg-[#F7984A]/20 text-[#F7984A] flex items-center justify-center mr-3 text-xs">
                          ✓
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button className="bg-[#F7984A] hover:bg-[#F7984A]/90 text-white px-8 py-6 text-lg rounded-md shadow-lg shadow-[#F7984A]/20 transition-all duration-300">
                      View Current Giveaways
                    </Button>
                    <Button
                      variant="outline"
                      className="border-white/20 bg-black hover:bg-white/10 text-white px-8 py-6 text-lg rounded-md transition-all duration-300"
                    >
                      How It Works
                    </Button>
                  </div>
                </div>
                <div className="lg:w-1/2">
                  <GiveawayGrid />
                  <div className="mt-4 bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm text-gray-400">Previous Winner</div>
                        <div className="font-medium">Alex M. from Germany</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-400">Prize Value</div>
                        <div className="font-medium">$5,000 USD</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default GiveawaySection
