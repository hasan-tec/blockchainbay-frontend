"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, ExternalLink } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { NewsArticle } from "@/types/news"
import { newsArticles as fallbackArticles } from "@/lib/mock-data"

interface NewsCardProps {
  article: NewsArticle;
}

const NewsCard = ({ article }: NewsCardProps) => {
  const { title, summary, categories, date, image, link } = article;
  
  return (
    <a
      href={link}
      target="_blank" 
      rel="noopener noreferrer"
      className="block"
    >
      <Card className="bg-gray-800/30 border-gray-700/50 backdrop-blur-sm overflow-hidden hover:border-[#F7984A]/30 transition-all duration-300 group h-full">
        <div className="relative aspect-video w-full overflow-hidden">
          <Image
            src={image || "/placeholder.svg"}
            width={600}
            height={300}
            alt={title}
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
          />
          {categories && categories.length > 0 && (
            <div className="absolute top-4 left-4">
              <Badge className="bg-[#F7984A] hover:bg-[#F7984A]/90">{categories[0]}</Badge>
            </div>
          )}
        </div>
        <div className="p-6">
          <h3 className="font-bold text-white text-xl mb-3 group-hover:text-[#F7984A] transition-colors line-clamp-2">
            {title}
          </h3>
          <p className="text-gray-300 text-sm mb-4 line-clamp-3">{summary}</p>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">{date}</span>
            <span
              className="inline-flex items-center text-[#F7984A] hover:text-[#F7984A]/90 hover:bg-gray-800 p-0 h-auto"
            >
              Read more <ExternalLink className="ml-1 h-4 w-4" />
            </span>
          </div>
        </div>
      </Card>
    </a>
  )
}

const NewsSection = () => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch news articles from the API
    const fetchNews = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/news');
        
        if (!response.ok) {
          throw new Error(`Failed to fetch news: ${response.status}`);
        }
        
        const data = await response.json();
        setArticles(data);
      } catch (error) {
        console.error("Error fetching news:", error);
        // Use fallback data if fetch fails
        setArticles(fallbackArticles);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  // Get the top 3 articles (featured ones will be first if available)
  const topArticles = articles
    .sort((a, b) => (a.featured === b.featured) ? 0 : a.featured ? -1 : 1)
    .slice(0, 3);

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
            href="/news"
            className="inline-flex items-center text-[#F7984A] hover:text-[#F7984A]/80 mt-4 md:mt-0 group"
          >
            <span>View all news</span>
            <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="bg-gray-800/30 border-gray-700/50 backdrop-blur-sm overflow-hidden animate-pulse">
                <div className="aspect-video w-full bg-gray-700/50"></div>
                <div className="p-6 space-y-3">
                  <div className="h-6 bg-gray-700/50 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-700/50 rounded w-full"></div>
                  <div className="h-4 bg-gray-700/50 rounded w-full"></div>
                  <div className="h-4 bg-gray-700/50 rounded w-2/3"></div>
                  <div className="flex justify-between pt-2">
                    <div className="h-4 bg-gray-700/50 rounded w-20"></div>
                    <div className="h-4 bg-gray-700/50 rounded w-24"></div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {topArticles.map((article) => (
              <NewsCard key={article.id} article={article} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default NewsSection