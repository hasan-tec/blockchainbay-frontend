import Link from "next/link"
import { ArrowRight, Headphones } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface PodcastEpisodeProps {
  number: string;
  title: string;
  description: string;
  duration: string;
  date: string;
}

const PodcastEpisode = ({ number, title, description, duration, date }: PodcastEpisodeProps) => {
  return (
    <div className="flex gap-6 group">
      <div className="w-1/3">
        <div className="aspect-square bg-gradient-to-br from-[#F7984A]/80 to-purple-500/80 rounded-xl overflow-hidden shadow-lg shadow-purple-500/10 group-hover:shadow-purple-500/20 transition-all duration-300 flex items-center justify-center">
          <div className="text-center p-4 w-full h-full flex flex-col items-center justify-center">
            <Headphones className="w-10 h-10 mb-3 text-white" />
            <span className="text-lg font-bold bg-[#07071C]/50 px-3 py-1.5 rounded-full mb-2">
              {number}
            </span>
          </div>
        </div>
      </div>
      <div className="w-2/3">
        <div className="flex items-center gap-2 mb-2">
          <Badge className="bg-gray-800 hover:bg-gray-700 text-gray-300">Podcast</Badge>
          <span className="text-xs text-gray-500">{date}</span>
        </div>
        <h3 className="font-bold text-xl mb-2 group-hover:text-[#F7984A] transition-colors">{title}</h3>
        <p className="text-gray-300 text-sm mb-4 line-clamp-2">{description}</p>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-400">{duration}</span>
          <Button variant="outline" size="sm" className="rounded-full bg-black">
            <span>Listen now</span>
            <Headphones className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

const PodcastSection = () => {
  const episodes: PodcastEpisodeProps[] = [
    {
      number: "EP 52",
      title: "The Future of DeFi with Hayden Adams",
      description:
        "Uniswap founder discusses the evolution of decentralized exchanges and what's next for DeFi.",
      duration: "58 min",
      date: "Mar 5, 2023",
    },
    {
      number: "EP 51",
      title: "Zero-Knowledge Proofs Explained",
      description:
        "A deep dive into ZK technology and its applications for privacy and scaling in blockchain.",
      duration: "45 min",
      date: "Feb 28, 2023",
    },
    {
      number: "EP 50",
      title: "NFTs Beyond Digital Art",
      description:
        "Exploring practical use cases for NFTs in gaming, identity, and real-world asset tokenization.",
      duration: "62 min",
      date: "Feb 21, 2023",
    },
    {
      number: "EP 49",
      title: "Institutional Adoption of Crypto",
      description:
        "How traditional financial institutions are entering the cryptocurrency space and what it means for the industry.",
      duration: "53 min",
      date: "Feb 14, 2023",
    },
  ]

  return (
    <section className="py-20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
          <div>
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-gray-800/70 text-gray-300 text-sm font-medium mb-4">
              <span className="w-2 h-2 rounded-full bg-purple-500 mr-2"></span>
              Audio content
            </div>
            <h2 className="text-4xl font-bold mb-2 tracking-tight">Latest Podcast Episodes</h2>
            <p className="text-gray-400 max-w-2xl">
              Listen to in-depth conversations with crypto founders, developers, and industry experts.
            </p>
          </div>
          <Link
            href="#"
            className="inline-flex items-center text-[#F7984A] hover:text-[#F7984A]/80 mt-4 md:mt-0 group"
          >
            <span>Browse all episodes</span>
            <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {episodes.map((episode, index) => (
            <PodcastEpisode key={index} {...episode} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default PodcastSection