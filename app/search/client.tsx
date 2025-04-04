"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Search, ArrowLeft, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import Navbar from "@/components/Navbar"
import { Footer } from "@/components/NewsletterFooter"

// Define interfaces for search results
interface SearchResultItem {
  id: string | number;
  title: string;
  description: string;
  url: string;
  type: 'project' | 'product' | 'news' | 'podcast';
  image: string;
  category?: string;
  date?: string;
  price?: number;
}

interface SearchResults {
  projects: SearchResultItem[];
  products: SearchResultItem[];
  news: SearchResultItem[];
  podcasts: SearchResultItem[];
  all: SearchResultItem[];
}

export default function SearchResultsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const queryParam = searchParams?.get('q') || '';
  
  const [searchQuery, setSearchQuery] = useState(queryParam);
  const [results, setResults] = useState<SearchResults | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("all");
  
  // Fetch search results
  const fetchResults = async (query: string) => {
    if (!query.trim()) {
      setResults(null);
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      
      if (!response.ok) {
        throw new Error(`Search failed with status: ${response.status}`);
      }
      
      const data = await response.json();
      setResults(data.results);
    } catch (err) {
      console.error('Search error:', err);
      setError('Failed to perform search. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Handle search form submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      fetchResults(searchQuery.trim());
    }
  };
  
  // Initial search when page loads or query changes
  useEffect(() => {
    if (queryParam) {
      setSearchQuery(queryParam);
      fetchResults(queryParam);
    }
  }, [queryParam]);
  
  // Helper to get count for tab labels
  const getCount = (type: keyof SearchResults) => {
    if (!results) return 0;
    return results[type]?.length || 0;
  };
  
  // Change active tab when results change
  useEffect(() => {
    if (results) {
      // Automatically select the tab with results
      if (results.all.length === 0) {
        setActiveTab("all");
      } else if (results.projects.length > 0) {
        setActiveTab("projects");
      } else if (results.products.length > 0) {
        setActiveTab("products");
      } else if (results.news.length > 0) {
        setActiveTab("news");
      } else if (results.podcasts.length > 0) {
        setActiveTab("podcasts");
      }
    }
  }, [results]);
  
  return (
    <div className="min-h-screen bg-[#07071C] text-white relative">
      {/* Enhanced Background elements */}
      <div className="fixed inset-0 bg-[#07071C] overflow-hidden z-0">
        {/* Main gradient orbs */}
        <div className="absolute top-[5%] left-[10%] w-[40rem] h-[40rem] rounded-full bg-gradient-to-r from-[#F7984A]/30 to-transparent opacity-50 blur-[100px]"></div>
        <div className="absolute bottom-[10%] right-[10%] w-[35rem] h-[35rem] rounded-full bg-gradient-to-l from-[#F7984A]/30 to-transparent opacity-50 blur-[100px]"></div>
        <div className="absolute top-[40%] right-[15%] w-[30rem] h-[30rem] rounded-full bg-gradient-to-t from-blue-500/20 to-transparent opacity-40 blur-[100px]"></div>

        {/* Grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] opacity-70"></div>

        {/* Texture overlay */}
        <div className="absolute inset-0 bg-[url('/placeholder.svg?height=100&width=100')] bg-repeat opacity-[0.015]"></div>
      </div>
      
      {/* Navigation */}
      <Navbar />
      
      {/* Main Content */}
      <main className="pt-32 pb-20 relative z-10">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            {/* Back button */}
            <button 
              onClick={() => router.back()}
              className="flex items-center text-gray-400 hover:text-white mb-6 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              <span>Back</span>
            </button>
            
            {/* Search form */}
            <form onSubmit={handleSearch} className="mb-10">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search projects, products, podcasts, news..."
                  className="pl-12 py-6 bg-[#0D0B26]/80 border-gray-800/60 text-lg focus-visible:ring-[#F7984A]/50 focus-visible:border-[#F7984A]/50"
                />
                <Button 
                  type="submit" 
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#F7984A] hover:bg-[#F7984A]/90"
                  disabled={loading || !searchQuery.trim()}
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Search className="h-4 w-4 mr-2" />}
                  Search
                </Button>
              </div>
            </form>
            
            {/* Search Results */}
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="h-12 w-12 text-[#F7984A] animate-spin mb-4" />
                <p className="text-lg">Searching for "{queryParam}"...</p>
              </div>
            ) : error ? (
              <div className="bg-red-900/20 border border-red-800/50 rounded-lg p-6 text-center">
                <p className="text-lg text-red-400">{error}</p>
                <Button 
                  onClick={() => fetchResults(searchQuery)} 
                  className="mt-4 bg-red-800 hover:bg-red-700"
                >
                  Try Again
                </Button>
              </div>
            ) : results ? (
              results.all.length > 0 ? (
                <div className="space-y-8">
                  <h1 className="text-2xl font-bold">
                    Search Results for "{queryParam}"
                    <span className="text-gray-400 ml-2 text-lg font-normal">
                      ({results.all.length} results)
                    </span>
                  </h1>
                  
                  <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="grid grid-cols-5 mb-8 bg-[#0D0B26]/50">
                      <TabsTrigger value="all" className="data-[state=active]:bg-[#F7984A]/20 data-[state=active]:text-[#F7984A]">
                        All ({getCount('all')})
                      </TabsTrigger>
                      <TabsTrigger value="projects" className="data-[state=active]:bg-[#F7984A]/20 data-[state=active]:text-[#F7984A]">
                        Projects ({getCount('projects')})
                      </TabsTrigger>
                      <TabsTrigger value="products" className="data-[state=active]:bg-[#F7984A]/20 data-[state=active]:text-[#F7984A]">
                        Products ({getCount('products')})
                      </TabsTrigger>
                      <TabsTrigger value="news" className="data-[state=active]:bg-[#F7984A]/20 data-[state=active]:text-[#F7984A]">
                        News ({getCount('news')})
                      </TabsTrigger>
                      <TabsTrigger value="podcasts" className="data-[state=active]:bg-[#F7984A]/20 data-[state=active]:text-[#F7984A]">
                        Podcasts ({getCount('podcasts')})
                      </TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="all" className="space-y-6">
                      {results.all.map((item) => (
                        <SearchResultCard key={`${item.type}-${item.id}`} item={item} />
                      ))}
                    </TabsContent>
                    
                    <TabsContent value="projects" className="space-y-6">
                      {results.projects.length > 0 ? (
                        results.projects.map((item) => (
                          <SearchResultCard key={`project-${item.id}`} item={item} />
                        ))
                      ) : (
                        <NoResults type="projects" />
                      )}
                    </TabsContent>
                    
                    <TabsContent value="products" className="space-y-6">
                      {results.products.length > 0 ? (
                        results.products.map((item) => (
                          <SearchResultCard key={`product-${item.id}`} item={item} />
                        ))
                      ) : (
                        <NoResults type="products" />
                      )}
                    </TabsContent>
                    
                    <TabsContent value="news" className="space-y-6">
                      {results.news.length > 0 ? (
                        results.news.map((item) => (
                          <SearchResultCard key={`news-${item.id}`} item={item} />
                        ))
                      ) : (
                        <NoResults type="news" />
                      )}
                    </TabsContent>
                    
                    <TabsContent value="podcasts" className="space-y-6">
                      {results.podcasts.length > 0 ? (
                        results.podcasts.map((item) => (
                          <SearchResultCard key={`podcast-${item.id}`} item={item} />
                        ))
                      ) : (
                        <NoResults type="podcasts" />
                      )}
                    </TabsContent>
                  </Tabs>
                </div>
              ) : (
                <div className="bg-[#0D0B26]/50 border border-gray-800/60 rounded-lg p-10 text-center">
                  <Search className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold mb-2">No results found</h2>
                  <p className="text-gray-400 mb-6">
                    We couldn't find any results for "{queryParam}". Please try different keywords.
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    <SuggestionButton text="Bitcoin" onClick={setSearchQuery} onSearch={handleSearch} />
                    <SuggestionButton text="Ethereum" onClick={setSearchQuery} onSearch={handleSearch} />
                    <SuggestionButton text="DeFi" onClick={setSearchQuery} onSearch={handleSearch} />
                    <SuggestionButton text="NFT" onClick={setSearchQuery} onSearch={handleSearch} />
                    <SuggestionButton text="Wallet" onClick={setSearchQuery} onSearch={handleSearch} />
                  </div>
                </div>
              )
            ) : (
              <div className="bg-[#0D0B26]/50 border border-gray-800/60 rounded-lg p-10 text-center">
                <Search className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-2">Search our platform</h2>
                <p className="text-gray-400 mb-6">
                  Enter a search term above to find projects, products, news, and podcasts.
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  <SuggestionButton text="Bitcoin" onClick={setSearchQuery} onSearch={handleSearch} />
                  <SuggestionButton text="Ethereum" onClick={setSearchQuery} onSearch={handleSearch} />
                  <SuggestionButton text="DeFi" onClick={setSearchQuery} onSearch={handleSearch} />
                  <SuggestionButton text="NFT" onClick={setSearchQuery} onSearch={handleSearch} />
                  <SuggestionButton text="Wallet" onClick={setSearchQuery} onSearch={handleSearch} />
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <Footer className="relative z-20" />
    </div>
  );
}

// Search Result Card Component
function SearchResultCard({ item }: { item: SearchResultItem }) {
  // Type-specific styling
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'project': return 'bg-blue-500/20 text-blue-400';
      case 'product': return 'bg-green-500/20 text-green-400';
      case 'news': return 'bg-yellow-500/20 text-yellow-400';
      case 'podcast': return 'bg-purple-500/20 text-purple-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };
  
  return (
    <Link href={item.url}>
      <div className="bg-[#0D0B26]/70 border border-gray-800/60 rounded-lg overflow-hidden hover:border-gray-700/60 hover:bg-[#0D0B26]/90 transition-all duration-300 flex flex-col md:flex-row">
        <div className="md:w-36 md:h-36 h-48 relative shrink-0">
          <Image
            src={item.image || '/placeholder.svg'}
            alt={item.title}
            fill
            className="object-cover"
          />
        </div>
        <div className="flex-1 p-4 md:p-6">
          <div className="flex flex-wrap gap-2 mb-2">
            <Badge className={cn("rounded-full text-xs", getTypeColor(item.type))}>
              {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
            </Badge>
            {item.category && (
              <Badge className="bg-gray-800/70 text-gray-300 rounded-full text-xs">
                {item.category}
              </Badge>
            )}
          </div>
          <h3 className="text-xl font-bold mb-2 hover:text-[#F7984A] transition-colors">
            {item.title}
          </h3>
          <p className="text-gray-300 text-sm mb-3 line-clamp-2">
            {item.description}
          </p>
          <div className="flex justify-between items-center">
            {item.date && (
              <span className="text-gray-400 text-xs">{item.date}</span>
            )}
            {item.price !== undefined && (
              <span className="text-[#F7984A] font-semibold">${item.price.toFixed(2)}</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

// No Results Component
function NoResults({ type }: { type: string }) {
  return (
    <div className="bg-[#0D0B26]/30 border border-gray-800/40 rounded-lg p-6 text-center">
      <p className="text-gray-400">
        No {type} found matching your search. Try adjusting your search terms.
      </p>
    </div>
  );
}

// Suggestion Button Component
function SuggestionButton({ 
  text, 
  onClick, 
  onSearch 
}: { 
  text: string; 
  onClick: (value: string) => void; 
  onSearch: (e: React.FormEvent) => void; 
}) {
  return (
    <button
      className="bg-[#0D0B26] border border-gray-800/60 rounded-full px-4 py-2 text-sm hover:bg-[#0D0B26]/80 hover:border-gray-700/60 transition-all"
      onClick={(e) => {
        onClick(text);
        // Use a small timeout to allow state update before submission
        setTimeout(() => onSearch(e as any), 10);
      }}
    >
      {text}
    </button>
  );
}