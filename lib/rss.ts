import Parser from 'rss-parser';

// Types
import { NewsArticle } from '@/types/news';

// Extend the Parser.Item interface to include custom fields
interface CustomItem extends Parser.Item {
  content?: string;
  'media:content'?: { $: { url: string } };
  enclosure?: { url: string };
}

// Custom parser type
type CustomParser = Parser<{}, CustomItem>;

// Function to estimate read time
const estimateReadTime = (content: string): string => {
  const words = content.split(/\s+/).length;
  const minutes = Math.max(1, Math.ceil(words / 200)); // Assuming 200 words per minute reading speed
  return `${minutes} min read`;
};

// Function to extract image URL from item
const getImageUrl = (item: CustomItem): string => {
  if (item['media:content']?.$.url) {
    return item['media:content'].$.url;
  }
  if (item.enclosure?.url) {
    return item.enclosure.url;
  }
  
  // Try to extract image from content if available
  const imgRegex = /<img[^>]+src="([^">]+)"/;
  const match = item.content?.match(imgRegex);
  if (match && match[1]) {
    return match[1];
  }
  
  // Default images that match the existing design
  const defaultImages = [
    "https://images.unsplash.com/photo-1621761191319-c6fb62004040?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1620714223084-8fcacc6dfd8d?q=80&w=2071&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1551135049-8a33b5883817?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1516245834210-c4c142787335?q=80&w=2069&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1620321023374-d1a68fbc720d?q=80&w=2097&auto=format&fit=crop"
  ];
  
  // Return a random default image
  return defaultImages[Math.floor(Math.random() * defaultImages.length)];
};

// Function to extract categories
const getCategories = (item: CustomItem): string[] => {
  if (Array.isArray(item.categories) && item.categories.length > 0) {
    return item.categories;
  }
  
  // Common crypto categories to detect in content
  const keywords = ['Bitcoin', 'Ethereum', 'DeFi', 'NFTs', 'Regulation', 'Adoption', 'Mining', 
                   'Stablecoins', 'Metaverse', 'Gaming', 'Layer 2', 'Solana', 'Banking', 'CBDCs'];
  
  // Search in title and content
  const detectedCategories = keywords.filter(keyword => 
    item.title?.includes(keyword) || 
    item.content?.includes(keyword) || 
    false
  );
  
  // Return detected categories or fallback to Crypto
  return detectedCategories.length > 0 ? detectedCategories.slice(0, 2) : ['Crypto'];
};

// Function to determine if an article should be featured
const isFeatured = (item: CustomItem, index: number): boolean => {
  // Feature the newest articles (first 3)
  return index < 3;
};

// Format the date string
const formatDate = (pubDate: Date): string => {
  const now = new Date();
  const diffInDays = Math.floor((now.getTime() - pubDate.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diffInDays === 0) {
    return 'Today';
  } else if (diffInDays === 1) {
    return 'Yesterday';
  } else if (diffInDays < 7) {
    return `${diffInDays} days ago`;
  } else if (diffInDays < 30) {
    return `${Math.floor(diffInDays / 7)} week${Math.floor(diffInDays / 7) > 1 ? 's' : ''} ago`;
  } else {
    return pubDate.toLocaleDateString();
  }
};

// Function to fetch and parse RSS feed
export const fetchRssNews = async (): Promise<NewsArticle[]> => {
  const parser: CustomParser = new Parser({
    customFields: {
      item: ['media:content', 'content', 'enclosure'],
    },
  });
  
  try {
    const feed = await parser.parseURL('https://rss.app/feeds/DRR5xqR8IRe8ouT9.xml');
    
    // Transform feed items to NewsArticle format
    const newsArticles = feed.items.map((item, index) => {
      const pubDate = item.pubDate ? new Date(item.pubDate) : new Date();
      
      return {
        id: item.guid || item.link || `article-${index}`,
        title: item.title || `Untitled Article ${index}`,
        summary: item.contentSnippet || 
                 (item.content?.replace(/<[^>]*>/g, '').substring(0, 200) + '...') || 
                 'No summary available',
        image: getImageUrl(item),
        categories: getCategories(item),
        date: formatDate(pubDate),
        readTime: estimateReadTime(item.content || item.contentSnippet || ''),
        source: feed.title || 'CryptoHub',
        featured: isFeatured(item, index),
      };
    });
    
    return newsArticles;
  } catch (error) {
    console.error('Error fetching RSS feed:', error);
    return []; // Return empty array if there's an error
  }
};

// Generate category filters based on articles
export const generateCategoryFilters = (articles: NewsArticle[]) => {
  const categoryCounts: Record<string, number> = {};
  
  articles.forEach(article => {
    article.categories.forEach(category => {
      const lowerCategory = category.toLowerCase();
      categoryCounts[lowerCategory] = (categoryCounts[lowerCategory] || 0) + 1;
    });
  });
  
  return Object.entries(categoryCounts)
    .map(([id, count]) => ({
      id,
      label: id.charAt(0).toUpperCase() + id.slice(1), // Capitalize first letter
      count,
    }))
    .sort((a, b) => b.count - a.count) // Sort by count in descending order
    .slice(0, 7); // Take top 7 categories to match the original
};