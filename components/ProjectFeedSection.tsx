// components/ProjectFeedSection.tsx
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";
import { fetchRssNews } from "@/lib/fetch-rss-server";
import { determineCategory, fetchPodcasts } from "@/lib/rssUtils";

// Interfaces
import { NewsArticle } from "@/types/news";
import { Podcast } from "@/lib/rssUtils";

interface ProjectFeedSectionProps {
  isLoaded: boolean;
  project: {
    title: string;
    Category: string;
  };
}

const ProjectFeedSection = ({ isLoaded, project }: ProjectFeedSectionProps) => {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [relatedProjects, setRelatedProjects] = useState<any[]>([]);

  useEffect(() => {
    // Fetch news from RSS
    const loadNews = async () => {
      try {
        const newsData = await fetchRssNews();
        
        // Filter news that might be relevant to this project
        // First look for exact title matches, then category matches
        const filteredNews = newsData.filter(article => {
          const isExactMatch = article.title.toLowerCase().includes(project.title.toLowerCase());
          const isCategoryMatch = article.categories.some(
            cat => cat.toLowerCase() === project.Category.toLowerCase()
          );
          
          return isExactMatch || isCategoryMatch;
        });
        
        // If no relevant news found, just take the most recent ones
        setNews(filteredNews.length > 0 ? filteredNews.slice(0, 3) : newsData.slice(0, 3));
      } catch (error) {
        console.error("Error fetching news:", error);
        setNews([]);
      }
    };

    // Fetch podcasts
    const loadPodcasts = async () => {
      try {
        const podcastData = await fetchPodcasts();
        
        // Filter podcasts that might be relevant to this project
        const filteredPodcasts = podcastData.filter(podcast => {
          const isExactMatch = podcast.title.toLowerCase().includes(project.title.toLowerCase());
          const isCategoryMatch = determineCategory(podcast.description).toLowerCase() === project.Category.toLowerCase();
          
          return isExactMatch || isCategoryMatch;
        });
        
        // If no relevant podcasts found, just take the most recent ones
        setPodcasts(filteredPodcasts.length > 0 ? filteredPodcasts.slice(0, 3) : podcastData.slice(0, 3));
      } catch (error) {
        console.error("Error fetching podcasts:", error);
        setPodcasts([]);
      }
    };

    // Mock related projects (in a real app, you'd fetch this from your API)
    // For now, we'll create some example related projects based on the category
    const loadRelatedProjects = async () => {
      // This would be replaced with an actual API call to your projects backend
      // with a filter for the category
      const mockProjects = [
        {
          id: 1,
          title: `Similar ${project.Category} Project 1`,
          description: `Another exciting project in the ${project.Category} space`,
          image: "/placeholder.svg?height=40&width=40",
          category: project.Category
        },
        {
          id: 2,
          title: `Similar ${project.Category} Project 2`,
          description: `A promising ${project.Category} innovation`,
          image: "/placeholder.svg?height=40&width=40",
          category: project.Category
        },
        {
          id: 3,
          title: `Similar ${project.Category} Project 3`,
          description: `Pioneering ${project.Category} technology`,
          image: "/placeholder.svg?height=40&width=40",
          category: project.Category
        }
      ];
      
      setRelatedProjects(mockProjects);
    };

    loadNews();
    loadPodcasts();
    loadRelatedProjects();
  }, [project.title, project.Category]);

  return (
    <div 
      className={`mt-20 grid grid-cols-1 lg:grid-cols-3 gap-8 transition-all duration-700 ease-out delay-400 ${
        isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
    >
      {/* News Section (formerly Project Updates) */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold flex items-center gap-2 relative">
            <span className="text-yellow-400">📰</span> Latest News
            <span className="absolute -bottom-1 left-0 w-1/3 h-0.5 bg-yellow-400/50"></span>
          </h3>
          <Link href="/news" passHref>
            <Button variant="link" className="text-[#F7984A] hover:text-[#F7984A]/80 p-0 group">
              View more
              <ArrowUpRight className="ml-1 h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
            </Button>
          </Link>
        </div>
        <div className="space-y-4">
          {news.length > 0 ? (
            news.map((article, index) => (
              <a 
                key={`news-${index}`} 
                href={article.link || "#"} 
                target="_blank"
                rel="noopener noreferrer"
                className="flex gap-4 p-4 bg-[#0D0B26]/80 border border-gray-800/50 rounded-xl hover:border-gray-700/70 hover:bg-[#0D0B26] transition-all duration-300 hover:shadow-lg group"
              >
                <div className="w-12 h-12 shrink-0 rounded-lg overflow-hidden bg-gradient-to-br from-yellow-400/20 to-orange-500/20 group-hover:from-yellow-400/30 group-hover:to-orange-500/30 transition-all duration-300">
                  <div className="w-full h-full relative">
                    <Image
                      src={article.image || "/placeholder.svg?height=60&width=60"}
                      alt={article.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </div>
                <div>
                  <h4 className="font-medium leading-tight group-hover:text-[#F7984A]/90 transition-colors duration-300">
                    {article.title}
                  </h4>
                  <p className="text-sm text-gray-400 mt-1">
                    {article.source} · {article.date}
                  </p>
                </div>
              </a>
            ))
          ) : (
            <div className="flex gap-4 p-4 bg-[#0D0B26]/80 border border-gray-800/50 rounded-xl">
              <div>
                <h4 className="font-medium leading-tight">Loading latest news...</h4>
                <p className="text-sm text-gray-400 mt-1">Stay tuned</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Podcasts Section (formerly News Mentions) */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold flex items-center gap-2 relative">
            <span className="text-yellow-400">🎙️</span> Latest Podcasts
            <span className="absolute -bottom-1 left-0 w-1/3 h-0.5 bg-yellow-400/50"></span>
          </h3>
          <Link href="/podcasts" passHref>
            <Button variant="link" className="text-[#F7984A] hover:text-[#F7984A]/80 p-0 group">
              View more
              <ArrowUpRight className="ml-1 h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
            </Button>
          </Link>
        </div>
        <div className="space-y-4">
          {podcasts.length > 0 ? (
            podcasts.map((podcast, index) => (
              <a 
                key={`podcast-${index}`}
                href={podcast.audio} 
                target="_blank"
                rel="noopener noreferrer"
                className="flex gap-4 p-4 bg-[#0D0B26]/80 border border-gray-800/50 rounded-xl hover:border-gray-700/70 hover:bg-[#0D0B26] transition-all duration-300 hover:shadow-lg group"
              >
                <div className="w-12 h-12 shrink-0 rounded-lg overflow-hidden bg-gradient-to-br from-blue-400/20 to-purple-500/20 group-hover:from-blue-400/30 group-hover:to-purple-500/30 transition-all duration-300">
                  <div className="w-full h-full relative">
                    <Image
                      src={podcast.thumbnail || "/placeholder.svg?height=60&width=60"}
                      alt={podcast.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </div>
                <div>
                  <h4 className="font-medium leading-tight group-hover:text-[#F7984A]/90 transition-colors duration-300">
                    {podcast.title}
                  </h4>
                  <p className="text-sm text-gray-400 mt-1">
                    {determineCategory(podcast.description)} · {podcast.duration}
                  </p>
                </div>
              </a>
            ))
          ) : (
            <div className="flex gap-4 p-4 bg-[#0D0B26]/80 border border-gray-800/50 rounded-xl">
              <div>
                <h4 className="font-medium leading-tight">Loading podcasts...</h4>
                <p className="text-sm text-gray-400 mt-1">Coming soon</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Related Projects */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold flex items-center gap-2 relative">
            <span className="text-yellow-400">☀️</span> Related projects
            <span className="absolute -bottom-1 left-0 w-1/3 h-0.5 bg-yellow-400/50"></span>
          </h3>
        </div>
        <div className="space-y-4">
          {relatedProjects.map((relatedProject, index) => (
            <div 
              key={`related-${index}`}
              className="flex gap-4 p-4 bg-[#0D0B26]/80 border border-gray-800/50 rounded-xl hover:border-gray-700/70 hover:bg-[#0D0B26] transition-all duration-300 hover:shadow-lg group"
            >
              <div className="w-10 h-10 shrink-0 rounded-full overflow-hidden bg-gradient-to-br from-green-400/20 to-teal-500/20 group-hover:from-green-400/30 group-hover:to-teal-500/30 transition-all duration-300">
                <div className="w-full h-full relative">
                  <Image
                    src={relatedProject.image}
                    alt={relatedProject.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-medium group-hover:text-[#F7984A]/90 transition-colors duration-300">
                    {relatedProject.title}
                  </h4>
                </div>
                <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                  {relatedProject.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectFeedSection;