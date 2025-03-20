// lib/rssUtils.ts

// Types
export type Podcast = {
    id: string;
    title: string;
    description: string;
    thumbnail: string;
    audio: string;
    date: string;
    duration: string;
    category: string;
    featured?: boolean;
  };
  
  // Default category mapping - extracts keywords from description to categorize
  const categoryKeywords: Record<string, string[]> = {
    "DeFi": ["defi", "finance", "uniswap", "financial", "exchange"],
    "Technology": ["technology", "tech", "blockchain", "technical", "tracking", "network"],
    "NFTs": ["nft", "art", "digital art", "token"],
    "Adoption": ["adoption", "mainstream", "institutional"],
    "Regulation": ["regulation", "regulatory", "compliance", "legal"],
    "Security": ["security", "hack", "protection", "secure"],
    "Metaverse": ["metaverse", "virtual world", "digital world"],
    "Social": ["social", "community", "connection"],
  };
  
  // Function to determine category based on description
  export const determineCategory = (description: string): string => {
    const lowerDesc = description.toLowerCase();
    
    for (const [category, keywords] of Object.entries(categoryKeywords)) {
      if (keywords.some(keyword => lowerDesc.includes(keyword.toLowerCase()))) {
        return category;
      }
    }
    
    // Default category if no match
    return "Technology";
  };
  
  // Function to estimate podcast duration (since RSS feed may not provide it)
  export const estimateDuration = (description: string): string => {
    // Simple estimation: longer descriptions likely mean longer episodes
    const wordCount = description.split(/\s+/).length;
    
    if (wordCount > 300) return "60 min";
    if (wordCount > 200) return "45 min";
    if (wordCount > 100) return "30 min";
    return "25 min";
  };
  
  // Function to extract episode number from title
  export const extractEpisodeNumber = (title: string): string => {
    const match = title.match(/Ep\s*(\d+)/i);
    return match ? match[1] : '';
  };
  
  // Function to convert date to display format
  export const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    
    const options: Intl.DateTimeFormatOptions = { 
      month: 'short',
      day: 'numeric', 
      year: 'numeric'
    };
    
    return date.toLocaleDateString('en-US', options);
  };
  
  // Generate a thumbnail URL based on episode number or title
  export const generateThumbnail = (epNumber: string, title: string): string => {
    // In a real app, you might have a more sophisticated way to map episodes to images
    // Here we use placeholder images based on episode number
    const number = parseInt(epNumber);
    
    if (number && !isNaN(number)) {
      // Create deterministic but varied thumbnails
      const imageId = 1000 + (number % 10) * 100;
      return `https://images.unsplash.com/photo-${imageId}?q=80&w=2574&auto=format&fit=crop`;
    }
    
    // Default thumbnail
    return "https://images.unsplash.com/photo-1639762681057-408e52192e55?q=80&w=2532&auto=format&fit=crop";
  };
  
  // Client-side functions that fetch from our API routes
  
  export const fetchPodcasts = async (): Promise<Podcast[]> => {
    try {
      const response = await fetch('/api/podcasts');
      
      if (!response.ok) {
        throw new Error(`Failed to fetch podcasts: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error("Error fetching podcasts:", error);
      return [];
    }
  };
  
  export const fetchPodcastById = async (id: string): Promise<Podcast | null> => {
    try {
      const response = await fetch(`/api/podcasts/${id}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch podcast: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Error fetching podcast with ID ${id}:`, error);
      return null;
    }
  };
  
  export const fetchRelatedPodcasts = async (id: string, category: string): Promise<Podcast[]> => {
    try {
      // Fetch all podcasts
      const podcasts = await fetchPodcasts();
      
      // Filter related podcasts on the client side
      return podcasts
        .filter(podcast => podcast.id !== id && podcast.category === category)
        .slice(0, 3);
    } catch (error) {
      console.error(`Error fetching related podcasts for ${id}:`, error);
      return [];
    }
  };