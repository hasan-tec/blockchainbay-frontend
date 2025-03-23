"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Headphones } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface Podcast {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  audio: string;
  date: string;
  duration: string;
  category: string;
  featured?: boolean;
}

interface PodcastEpisodeProps {
  podcast: Podcast;
}

const PodcastEpisode = ({ podcast }: PodcastEpisodeProps) => {
  // Extract episode number from ID (e.g., "ep-52" -> "EP 52")
  const number = podcast.id.startsWith('ep-') 
    ? `EP ${podcast.id.replace('ep-', '')}` 
    : podcast.id.startsWith('episode-') 
      ? `EP ${podcast.id.replace('episode-', '')}` 
      : podcast.id;

  return (
    <Link href={`/podcasts/${podcast.id}`} className="block group">
      <div className="flex gap-6">
        <div className="w-1/3">
          <div className="aspect-square rounded-xl overflow-hidden shadow-lg shadow-purple-500/10 group-hover:shadow-purple-500/20 transition-all duration-300 relative">
            {/* Display the thumbnail image if available, fallback to gradient */}
            {podcast.thumbnail && podcast.thumbnail !== "/placeholder.svg" ? (
              <Image 
                src={podcast.thumbnail} 
                alt={podcast.title}
                fill
                className="object-cover"
              />
            ) : (
              <div className="bg-gradient-to-br from-[#F7984A]/80 to-purple-500/80 w-full h-full flex items-center justify-center">
                <div className="text-center p-4 w-full h-full flex flex-col items-center justify-center">
                  <Headphones className="w-10 h-10 mb-3 text-white" />
                  <span className="text-lg font-bold bg-[#07071C]/50 px-3 py-1.5 rounded-full mb-2">
                    {number}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="w-2/3">
          <div className="flex items-center gap-2 mb-2">
            <Badge className="bg-gray-800 hover:bg-gray-700 text-gray-300">{podcast.category}</Badge>
            <span className="text-xs text-gray-500">{podcast.date}</span>
          </div>
          <h3 className="font-bold text-xl mb-2 group-hover:text-[#F7984A] transition-colors">{podcast.title}</h3>
          <p className="text-gray-300 text-sm mb-4 line-clamp-2">{podcast.description}</p>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">{podcast.duration}</span>
            <Button variant="outline" size="sm" className="rounded-full bg-black">
              <span>Listen now</span>
              <Headphones className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </Link>
  )
}

// Default fallback episodes in case API fails
const fallbackEpisodes = [
  {
    id: "ep-52",
    title: "The Future of DeFi with Hayden Adams",
    description: "Uniswap founder discusses the evolution of decentralized exchanges and what's next for DeFi.",
    thumbnail: "/placeholder.svg",
    audio: "",
    duration: "58 min",
    date: "Mar 5, 2023",
    category: "DeFi",
    featured: true
  },
  {
    id: "ep-51",
    title: "Zero-Knowledge Proofs Explained",
    description: "A deep dive into ZK technology and its applications for privacy and scaling in blockchain.",
    thumbnail: "/placeholder.svg",
    audio: "",
    duration: "45 min",
    date: "Feb 28, 2023",
    category: "Technology",
    featured: true
  },
  {
    id: "ep-50",
    title: "NFTs Beyond Digital Art",
    description: "Exploring practical use cases for NFTs in gaming, identity, and real-world asset tokenization.",
    thumbnail: "/placeholder.svg",
    audio: "",
    duration: "62 min",
    date: "Feb 21, 2023",
    category: "NFTs",
    featured: true
  },
  {
    id: "ep-49",
    title: "Institutional Adoption of Crypto",
    description: "How traditional financial institutions are entering the cryptocurrency space and what it means for the industry.",
    thumbnail: "/placeholder.svg",
    audio: "",
    duration: "53 min",
    date: "Feb 14, 2023",
    category: "Adoption",
    featured: false
  }
];

const PodcastSection = () => {
  const [episodes, setEpisodes] = useState<Podcast[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPodcasts = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/podcasts');
        
        if (!response.ok) {
          throw new Error(`Failed to fetch podcasts: ${response.status}`);
        }
        
        const data = await response.json();
        setEpisodes(data);
      } catch (error) {
        console.error("Error fetching podcasts:", error);
        // Use fallback data if fetch fails
        setEpisodes(fallbackEpisodes);
      } finally {
        setLoading(false);
      }
    };

    fetchPodcasts();
  }, []);

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
            href="/podcasts"
            className="inline-flex items-center text-[#F7984A] hover:text-[#F7984A]/80 mt-4 md:mt-0 group"
          >
            <span>Browse all episodes</span>
            <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex gap-6">
                <div className="w-1/3">
                  <div className="aspect-square bg-gray-800/50 rounded-xl animate-pulse"></div>
                </div>
                <div className="w-2/3 space-y-2">
                  <div className="flex gap-2">
                    <div className="h-6 w-20 bg-gray-800/70 rounded-full animate-pulse"></div>
                    <div className="h-6 w-16 bg-gray-800/70 rounded-full animate-pulse"></div>
                  </div>
                  <div className="h-7 bg-gray-800/70 rounded w-3/4 animate-pulse"></div>
                  <div className="h-4 bg-gray-800/70 rounded w-full animate-pulse"></div>
                  <div className="h-4 bg-gray-800/70 rounded w-full animate-pulse"></div>
                  <div className="flex justify-between items-center">
                    <div className="h-4 w-16 bg-gray-800/70 rounded animate-pulse"></div>
                    <div className="h-8 w-28 bg-gray-800/70 rounded-full animate-pulse"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {episodes.slice(0, 4).map((podcast) => (
              <PodcastEpisode key={podcast.id} podcast={podcast} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default PodcastSection