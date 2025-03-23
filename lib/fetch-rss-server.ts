// lib/fetch-rss-server.ts
import Parser from 'rss-parser';
import { NewsArticle, CategoryFilter, TimeFilter } from '@/types/news';

// Extend the Parser.Item interface to include custom fields
interface CustomItem extends Parser.Item {
  content?: string;
  'media:content'?: { $: { url: string } } | { $: { url: string } }[];
  'media:thumbnail'?: { $: { url: string } } | { $: { url: string } }[];
  enclosure?: { url: string };
  'content:encoded'?: string;
}

// Custom parser type
type CustomParser = Parser<{}, CustomItem>;

// Define feed configuration interface
interface FeedConfig {
  disableCache?: boolean;
  itemLimit?: number;
  timeout?: number;
}

// Default RSS feed sources
const DEFAULT_FEEDS = [
  'https://cointelegraph.com/rss',
  'https://cryptoslate.com/feed/',
  'https://decrypt.co/feed',
  'https://www.coindesk.com/arc/outboundfeeds/rss',
  'https://feeds.feedburner.com/coinspeaker/',
  'https://www.newsbtc.com/feed/'
];

// Feed configuration - add options for problematic feeds
const FEED_CONFIG: Record<string, FeedConfig> = {
  'https://cointelegraph.com/rss': {
    disableCache: true,  // Disable Next.js caching for this feed
    itemLimit: 20,       // Limit to 20 most recent items
    timeout: 15000       // Longer timeout (15 seconds)
  }
};

// Function to estimate read time
const estimateReadTime = (content: string): string => {
  const words = content.split(/\s+/).length;
  const minutes = Math.max(1, Math.ceil(words / 200)); // Assuming 200 words per minute reading speed
  return `${minutes} min read`;
};

// Function to extract image URL from item
const getImageUrl = (item: CustomItem): string => {
  // Try media:content (handle both object and array cases)
  if (item['media:content']) {
    const mediaContent = item['media:content'];
    if (Array.isArray(mediaContent)) {
      for (const media of mediaContent) {
        if (media.$ && media.$.url) return media.$.url;
      }
    } else if (mediaContent.$ && mediaContent.$.url) {
      return mediaContent.$.url;
    }
  }
  
  // Try media:thumbnail (handle both object and array cases)
  if (item['media:thumbnail']) {
    const mediaThumbnail = item['media:thumbnail'];
    if (Array.isArray(mediaThumbnail)) {
      for (const media of mediaThumbnail) {
        if (media.$ && media.$.url) return media.$.url;
      }
    } else if (mediaThumbnail.$ && mediaThumbnail.$.url) {
      return mediaThumbnail.$.url;
    }
  }
  
  // Try enclosure
  if (item.enclosure?.url) {
    return item.enclosure.url;
  }
  
  // Try to extract image from content if available
  const fullContent = item.content || item['content:encoded'] || item.contentSnippet || '';
  const imgRegex = /<img[^>]+src="([^">]+)"/;
  const match = fullContent.match(imgRegex);
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
const getCategories = (item: CustomItem, source: string): string[] => {
  if (Array.isArray(item.categories) && item.categories.length > 0) {
    // Filter out empty categories and limit to 3
    return item.categories
      .filter(category => category && typeof category === 'string' && category.trim() !== '')
      .map(category => {
        // Clean up category names, capitalize first letter
        let cleaned = category.trim();
        
        // Handle different category formats
        if (cleaned.includes('/')) {
          cleaned = cleaned.split('/')[0].trim();
        }
        if (cleaned.includes(',')) {
          cleaned = cleaned.split(',')[0].trim();
        }
        
        return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
      })
      .slice(0, 3);
  }
  
  // Common crypto categories to detect in content
  const keywords = ['Bitcoin', 'Ethereum', 'DeFi', 'NFTs', 'Regulation', 'Adoption', 'Mining', 
                    'Stablecoins', 'Metaverse', 'Gaming', 'Layer 2', 'Solana', 'Banking', 'CBDCs'];
  
  // Search in title and content
  const fullContent = item.title + ' ' + (item.content || item['content:encoded'] || item.contentSnippet || '');
  const detectedCategories = keywords.filter(keyword => 
    fullContent.toLowerCase().includes(keyword.toLowerCase())
  );
  
  // Return detected categories or fallback to source name
  return detectedCategories.length > 0 ? detectedCategories.slice(0, 3) : [source];
};

// Function to determine if an article should be featured
const isFeatured = (item: CustomItem, index: number, source: string): boolean => {
  // Feature the newest articles (first articles from major sources)
  return index < 2 && ['Cointelegraph', 'CoinDesk', 'Decrypt'].includes(source);
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

// Function to get the source name from feed URL
const getSourceName = (feedUrl: string): string => {
  if (feedUrl.includes('cointelegraph')) return 'Cointelegraph';
  if (feedUrl.includes('cryptoslate')) return 'CryptoSlate';
  if (feedUrl.includes('decrypt')) return 'Decrypt';
  if (feedUrl.includes('coindesk')) return 'CoinDesk';
  if (feedUrl.includes('coinspeaker')) return 'CoinSpeaker';
  if (feedUrl.includes('newsbtc')) return 'NewsBTC';
  
  // Extract domain as fallback
  try {
    const domain = new URL(feedUrl).hostname.replace('www.', '');
    return domain.charAt(0).toUpperCase() + domain.slice(1);
  } catch (e) {
    return 'CryptoHub';
  }
};

// Generate a unique ID based on title and source
const generateUniqueId = (title: string, source: string): string => {
  // Create a simplified hash from title and source
  const combined = `${title}-${source}`;
  let hash = 0;
  for (let i = 0; i < combined.length; i++) {
    const char = combined.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return `article-${Math.abs(hash).toString(16)}`;
};

// Check if two articles are similar (likely duplicates)
const areSimilarArticles = (article1: NewsArticle, article2: NewsArticle): boolean => {
  // Check if titles are similar
  const title1 = article1.title.toLowerCase();
  const title2 = article2.title.toLowerCase();
  
  // Direct match
  if (title1 === title2) return true;
  
  // One title contains the other (for headlines with/without source)
  if (title1.includes(title2) || title2.includes(title1)) return true;
  
  // Same source and very similar titles (simple approximate matching)
  if (article1.source === article2.source) {
    // Split into words and compare
    const words1 = title1.split(/\s+/);
    const words2 = title2.split(/\s+/);
    
    // Count matching words
    let matches = 0;
    for (const word of words1) {
      if (word.length > 3 && words2.includes(word)) {
        matches++;
      }
    }
    
    // If more than 60% of words match, consider it similar
    if (matches > 0 && matches / Math.min(words1.length, words2.length) > 0.6) {
      return true;
    }
  }
  
  return false;
};

// Function to extract a clean summary
const getSummary = (item: CustomItem): string => {
  // Try contentSnippet first (usually cleanest)
  if (item.contentSnippet) {
    return item.contentSnippet.substring(0, 200) + (item.contentSnippet.length > 200 ? '...' : '');
  }
  
  // Try regular content
  if (item.content) {
    return item.content.replace(/<[^>]*>/g, '').substring(0, 200) + '...';
  }
  
  // Try content:encoded
  if (item['content:encoded']) {
    return item['content:encoded'].replace(/<[^>]*>/g, '').substring(0, 200) + '...';
  }
  
  // Fallback
  return 'No summary available';
};

// Type for Next.js fetch options
type NextFetchOptions = RequestInit & {
  next?: {
    revalidate?: number;
  };
};

// Function to fetch and parse multiple RSS feeds
export const fetchRssNews = async (feedUrls: string[] = DEFAULT_FEEDS): Promise<NewsArticle[]> => {
  const parser: CustomParser = new Parser({
    customFields: {
      item: [
        'media:content',
        'media:thumbnail',
        'content',
        'content:encoded',
        'enclosure'
      ],
    },
  });
  
  try {
    // Fetch all feeds in parallel
    const feedPromises = feedUrls.map(async (feedUrl) => {
      try {
        // Get feed-specific configuration, if any
        const feedConfig = FEED_CONFIG[feedUrl] || {};
        
        // Set a timeout for each feed fetch
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), feedConfig.timeout || 10000);
        
        // Fetch options
        const fetchOptions: NextFetchOptions = {
          signal: controller.signal,
          headers: {
            'User-Agent': 'BlockChainBay/1.0',
          }
        };
        
        // Only add the Next.js cache option for feeds that aren't too large
        if (!feedConfig.disableCache) {
          fetchOptions.next = { revalidate: 3600 }; // Revalidate hourly
        }
        
        const response = await fetch(feedUrl, fetchOptions);
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          console.warn(`Failed to fetch feed ${feedUrl}: ${response.status}`);
          return [];
        }
        
        const xml = await response.text();
        
        // For feeds we know are large, parse only what we need
        let feed;
        if (feedConfig.itemLimit) {
          // Extract only the needed items to reduce memory usage
          // This is a simplified approach - a more robust solution would use a streaming XML parser
          const startTag = '<item>';
          const endTag = '</item>';
          const items = [];
          let startPos = xml.indexOf(startTag);
          let count = 0;
          
          while (startPos !== -1 && count < feedConfig.itemLimit) {
            const endPos = xml.indexOf(endTag, startPos) + endTag.length;
            if (endPos === -1) break;
            
            const itemXml = xml.substring(startPos, endPos);
            items.push(itemXml);
            
            startPos = xml.indexOf(startTag, endPos);
            count++;
          }
          
          // Create a smaller XML string with limited items
          const channelStart = xml.substring(0, xml.indexOf(startTag));
          const channelEnd = xml.substring(xml.lastIndexOf(endTag) + endTag.length);
          const limitedXml = channelStart + items.join('') + channelEnd;
          
          feed = await parser.parseString(limitedXml);
        } else {
          feed = await parser.parseString(xml);
        }
        
        const sourceName = getSourceName(feedUrl);
        
        // Transform feed items to NewsArticle format
        return feed.items.map((item, index) => {
          const pubDate = item.pubDate ? new Date(item.pubDate) : new Date();
          
          return {
            id: generateUniqueId(item.title || '', sourceName),
            title: item.title || `Untitled Article`,
            summary: getSummary(item),
            image: getImageUrl(item),
            categories: getCategories(item, sourceName),
            date: formatDate(pubDate),
            readTime: estimateReadTime(item.content || item.contentSnippet || ''),
            source: sourceName,
            featured: isFeatured(item, index, sourceName),
            link: item.link || ''
          };
        });
      } catch (error) {
        console.error(`Error fetching ${feedUrl}:`, error);
        return []; // Return empty array for failed feeds
      }
    });
    
    // Wait for all feeds to be processed
    const feedResults = await Promise.all(feedPromises);
    
    // Flatten the arrays of articles from each feed
    let allArticles = feedResults.flat();
    
    // Sort by date (assuming the date field can be compared)
    allArticles.sort((a, b) => {
      // Convert date strings like "Today", "Yesterday", "4 days ago" to comparable values
      const dateToValue = (dateStr: string): number => {
        if (dateStr === 'Today') return 0;
        if (dateStr === 'Yesterday') return 1;
        const dayMatch = dateStr.match(/(\d+) days? ago/);
        if (dayMatch) return parseInt(dayMatch[1]);
        const weekMatch = dateStr.match(/(\d+) weeks? ago/);
        if (weekMatch) return parseInt(weekMatch[1]) * 7;
        return 100; // Default for older dates
      };
      
      return dateToValue(a.date) - dateToValue(b.date);
    });
    
    // Deduplicate similar articles
    const uniqueArticles: NewsArticle[] = [];
    for (const article of allArticles) {
      // Check if we already have a similar article
      const isDuplicate = uniqueArticles.some(uniqueArticle => 
        areSimilarArticles(uniqueArticle, article)
      );
      
      if (!isDuplicate) {
        uniqueArticles.push(article);
      }
    }
    
    // Mark featured articles (top articles after deduplication)
    uniqueArticles.slice(0, 3).forEach(article => {
      article.featured = true;
    });
    
    // Limit to a reasonable number of articles
    return uniqueArticles.slice(0, 50);
  } catch (error) {
    console.error('Error fetching RSS feeds:', error);
    return []; // Return empty array if there's an error
  }
};

// Generate category filters based on articles
export const generateCategoryFilters = (articles: NewsArticle[]): CategoryFilter[] => {
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

// Generate time filters based on the current data
export const generateTimeFilters = (): TimeFilter[] => {
  return [
    { id: "today", label: "Today", count: 8 },
    { id: "this_week", label: "This Week", count: 32 },
    { id: "this_month", label: "This Month", count: 124 },
    { id: "this_year", label: "This Year", count: 1045 },
  ];
};