import Link from "next/link"
import Image from "next/image"
import { ArrowRight, ExternalLink } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface NewsCardProps {
  title: string;
  description: string;
  category: string;
  date: string;
  image: string;
}

const NewsCard = ({ title, description, category, date, image }: NewsCardProps) => {
  return (
    <Card className="bg-gray-800/30 border-gray-700/50 backdrop-blur-sm overflow-hidden hover:border-[#F7984A]/30 transition-all duration-300 group">
      <div className="relative aspect-video w-full overflow-hidden">
        <Image
          src={image || "/placeholder.svg"}
          width={600}
          height={300}
          alt={title}
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-4 left-4">
          <Badge className="bg-[#F7984A] hover:bg-[#F7984A]/90">{category}</Badge>
        </div>
      </div>
      <div className="p-6">
        <h3 className="font-bold text-white text-xl mb-3 group-hover:text-[#F7984A] transition-colors line-clamp-2">
          {title}
        </h3>
        <p className="text-gray-300 text-sm mb-4 line-clamp-3">{description}</p>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-400">{date}</span>
          <Button
            variant="ghost"
            className="text-[#F7984A] hover:text-[#F7984A]/90 hover:bg-gray-800 p-0 h-auto"
          >
            Read more <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  )
}

const NewsSection = () => {
  const newsItems: NewsCardProps[] = [
    {
      title: "Ethereum Layer 2 Solutions See Record Growth in TVL",
      description:
        "Arbitrum and Optimism lead the charge as Ethereum scaling solutions reach new heights in total value locked.",
      category: "Ethereum",
      date: "2 days ago",
      image: "https://images.unsplash.com/photo-1621761191319-c6fb62004040?q=80&w=2070&auto=format&fit=crop",
    },
    {
      title: "Major Bank Announces Crypto Custody Services for Institutional Clients",
      description:
        "In a significant move for mainstream adoption, one of the world's largest banks will offer cryptocurrency custody.",
      category: "Adoption",
      date: "4 days ago",
      image: "https://images.unsplash.com/photo-1620714223084-8fcacc6dfd8d?q=80&w=2071&auto=format&fit=crop",
    },
    {
      title: "New Regulatory Framework Proposed for Stablecoins",
      description:
        "Lawmakers introduce comprehensive legislation aimed at providing clarity for stablecoin issuers and users.",
      category: "Regulation",
      date: "5 days ago",
      image: "https://images.unsplash.com/photo-1551135049-8a33b5883817?q=80&w=2070&auto=format&fit=crop",
    },
  ]

  return (
    <section className="py-20 bg-gradient-to-b from-transparent to-gray-900/30">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
          <div>
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-gray-800/70 text-gray-300 text-sm font-medium mb-4">
              <span className="w-2 h-2 rounded-full bg-[#F7984A] mr-2"></span>
              Latest tech news
            </div>
            <h2 className="text-4xl font-bold mb-2 tracking-tight">Crypto & Tech News</h2>
            <p className="text-gray-400 max-w-2xl">
              Stay informed with the latest developments in cryptocurrency and technology.
            </p>
          </div>
          <Link
            href="#"
            className="inline-flex items-center text-[#F7984A] hover:text-[#F7984A]/80 mt-4 md:mt-0 group"
          >
            <span>View all news</span>
            <ExternalLink className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {newsItems.map((item, index) => (
            <NewsCard key={index} {...item} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default NewsSection