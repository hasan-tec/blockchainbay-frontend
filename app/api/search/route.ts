// app/api/search/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { fetchRssNews } from '@/lib/fetch-rss-server';
import axios from 'axios';
import Parser from 'rss-parser';

// Type definitions for podcast extraction
interface PodcastItem extends Parser.Item {
  'media:content'?: { $: { url: string } } | { $: { url: string } }[];
  'media:thumbnail'?: { $: { url: string } } | { $: { url: string } }[];
  'itunes:image'?: { $: { href: string } };
  content?: string;
  'content:encoded'?: string;
}

// Configure the API URL
const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:1337';

// Helper function to extract episode number from title
function extractEpisodeNumber(title: string): string {
  const match = title.match(/Ep\s*(\d+)/i);
  return match ? match[1] : '';
}

// Search Strapi projects
async function searchProjects(query: string) {
  try {
    console.log('Searching projects for query:', query);
    
    // Search in crypto projects with improved query format
    const response = await axios.get(`${API_URL}/api/crypto-projects`, {
      params: {
        populate: 'Logo',
        filters: {
          $or: [
            { title: { $containsi: query } },
            { ShortDescription: { $containsi: query } },
            { Symbol: { $containsi: query } },
            { Category: { $containsi: query } },
            { ChainType: { $containsi: query } }
          ]
        }
      }
    });

    console.log('Projects search response status:', response.status);
    console.log('Projects found:', response.data?.data?.length || 0);

    if (!response.data || !response.data.data) {
      return [];
    }

    // Map to search result format - handle both potential data structures
    return response.data.data.map((project: any) => {
      // Check if data is in attributes or directly on the object
      const attrs = project.attributes || project;
      
      // Safely get the Logo URL, handling different potential structures
      let logoUrl = '/placeholder.svg';
      if (attrs.Logo?.data?.attributes?.url) {
        logoUrl = attrs.Logo.data.attributes.url.startsWith('/')
          ? `${API_URL}${attrs.Logo.data.attributes.url}`
          : attrs.Logo.data.attributes.url;
      } else if (attrs.Logo?.url) {
        logoUrl = attrs.Logo.url.startsWith('/')
          ? `${API_URL}${attrs.Logo.url}`
          : attrs.Logo.url;
      }
      
      return {
        id: project.id,
        title: attrs.title,
        description: attrs.ShortDescription || '',
        url: `/directory/${attrs.Slug}`,
        type: 'project',
        image: logoUrl,
        category: attrs.Category || 'Crypto',
        date: new Date(attrs.publishedAt || attrs.createdAt || new Date()).toLocaleDateString(),
      };
    });
  } catch (error) {
    console.error('Error searching projects:', error);
    if (axios.isAxiosError(error) && error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    return [];
  }
}

// Search products
async function searchProducts(query: string) {
  try {
    console.log('Searching products for query:', query);
    
    // Use direct axios call instead of the helper function for better control
    const response = await axios.get(`${API_URL}/api/products`, {
      params: {
        populate: ['mainImage', 'category'],
        filters: {
          $or: [
            { name: { $containsi: query } },
            { description: { $containsi: query } }
          ]
        }
      }
    });
    
    console.log('Products search response status:', response.status);
    console.log('Products found:', response.data?.data?.length || 0);

    if (!response.data || !response.data.data) {
      return [];
    }
    
    const products = response.data.data;
    
    return products.map((product: any) => {
      const attrs = product.attributes || product;
      
      // Handle description which could be a string or rich text object
      let description = 'Product description';
      if (typeof attrs.description === 'string') {
        description = attrs.description.substring(0, 150);
      } else if (Array.isArray(attrs.description) && attrs.description.length > 0) {
        // Handle rich text format
        const textBlocks = attrs.description
          .filter((block: any) => block.type === 'paragraph')
          .map((block: any) => 
            block.children
              ?.filter((child: any) => child.text)
              ?.map((child: any) => child.text)
              ?.join('')
          );
        description = textBlocks.join(' ').substring(0, 150);
      }
      
      // Get image URL with proper formatting
      let imageUrl = '/placeholder.svg';
      if (attrs.mainImage?.data?.attributes?.url) {
        imageUrl = attrs.mainImage.data.attributes.url.startsWith('/')
          ? `${API_URL}${attrs.mainImage.data.attributes.url}`
          : attrs.mainImage.data.attributes.url;
      } else if (attrs.mainImage?.url) {
        imageUrl = attrs.mainImage.url.startsWith('/')
          ? `${API_URL}${attrs.mainImage.url}`
          : attrs.mainImage.url;
      }
      
      // Get category name
      let category = 'Store';
      if (attrs.category?.data?.attributes?.name) {
        category = attrs.category.data.attributes.name;
      } else if (attrs.category?.name) {
        category = attrs.category.name;
      }
      
      return {
        id: product.id,
        title: attrs.name,
        description: description,
        url: `/store/${attrs.slug}`,
        type: 'product',
        image: imageUrl,
        category: category,
        price: attrs.price,
      };
    });
  } catch (error) {
    console.error('Error searching products:', error);
    if (axios.isAxiosError(error) && error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    return [];
  }
}

// Search news from RSS feeds
async function searchNews(query: string) {
  try {
    const allNews = await fetchRssNews();
    
    // Filter news based on query
    const filteredNews = allNews.filter(article => 
      article.title.toLowerCase().includes(query.toLowerCase()) ||
      article.summary.toLowerCase().includes(query.toLowerCase()) ||
      article.categories.some(cat => cat.toLowerCase().includes(query.toLowerCase()))
    );
    
    // Map to search result format
    return filteredNews.slice(0, 10).map(article => ({
      id: article.id,
      title: article.title,
      description: article.summary,
      url: article.link || `/news`,
      type: 'news',
      image: article.image,
      category: article.categories[0] || 'News',
      date: article.date,
    }));
  } catch (error) {
    console.error('Error searching news:', error);
    return [];
  }
}

// Search podcasts from RSS feed
async function searchPodcasts(query: string) {
  try {
    console.log('Searching podcasts for query:', query);
    
    const parser: Parser<any, PodcastItem> = new Parser({
      customFields: {
        item: [
          'media:content',
          'media:thumbnail',
          'itunes:image',
          'content',
          'content:encoded',
          'enclosure'
        ],
      },
    });
    
    const feed = await parser.parseURL('https://media.rss.com/blockchainbay/feed.xml');
    
    if (!feed.items) {
      return [];
    }
    
    console.log('Total podcast items found:', feed.items.length);
    
    // Filter podcasts based on query
    const filteredPodcasts = feed.items.filter((item: PodcastItem) => 
      (item.title && item.title.toLowerCase().includes(query.toLowerCase())) ||
      (item.contentSnippet && item.contentSnippet.toLowerCase().includes(query.toLowerCase()))
    );
    
    console.log('Filtered podcast items:', filteredPodcasts.length);
    
    // Map to search result format
    return filteredPodcasts.slice(0, 10).map((item: PodcastItem, index: number) => {
      const epNumber = item.title ? extractEpisodeNumber(item.title) : '';
      const podcastId = epNumber ? `ep-${epNumber}` : `episode-${index + 1}`;
      
      // Get image with fallbacks
      let podcastImage = '/placeholder.svg';
      
      // Check for itunes:image
      if (item['itunes:image'] && item['itunes:image']['$'] && item['itunes:image']['$'].href) {
        podcastImage = item['itunes:image']['$'].href;
      }
      // Try media:content (could be an array or single object)
      else if (item['media:content']) {
        const mediaContent = item['media:content'];
        if (Array.isArray(mediaContent)) {
          // Find the first item with a URL
          for (const content of mediaContent) {
            if (content && content.$ && content.$.url) {
              podcastImage = content.$.url;
              break;
            }
          }
        } else if (mediaContent && mediaContent.$ && mediaContent.$.url) {
          podcastImage = mediaContent.$.url;
        }
      }
      // Try media:thumbnail (could be an array or single object)
      else if (item['media:thumbnail']) {
        const mediaThumbnail = item['media:thumbnail'];
        if (Array.isArray(mediaThumbnail)) {
          // Find the first item with a URL
          for (const thumbnail of mediaThumbnail) {
            if (thumbnail && thumbnail.$ && thumbnail.$.url) {
              podcastImage = thumbnail.$.url;
              break;
            }
          }
        } else if (mediaThumbnail && mediaThumbnail.$ && mediaThumbnail.$.url) {
          podcastImage = mediaThumbnail.$.url;
        }
      }
      // Try enclosure
      else if (item.enclosure && item.enclosure.url) {
        podcastImage = item.enclosure.url;
      }
      // Try to extract from content if available
      else {
        const content = item.content || item['content:encoded'] || '';
        const imgRegex = /<img[^>]+src="([^">]+)"/;
        const match = content.match(imgRegex);
        if (match && match[1]) {
          podcastImage = match[1];
        }
      }
      
      // If we still don't have an image, use feed image if available
      if (podcastImage === '/placeholder.svg' && feed.image && feed.image.url) {
        podcastImage = feed.image.url;
      }
      
      console.log(`Podcast ${podcastId} image URL:`, podcastImage);
      
      // Parse date
      const pubDate = item.pubDate ? new Date(item.pubDate) : new Date();
      const dateStr = pubDate.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      });
      
      return {
        id: podcastId,
        title: item.title || `Untitled Podcast Episode`,
        description: item.contentSnippet?.substring(0, 150) || 'No description available',
        url: `/podcasts/${podcastId}`,
        type: 'podcast',
        image: podcastImage,
        category: 'Podcast',
        date: dateStr,
      };
    });
  } catch (error) {
    console.error('Error searching podcasts:', error);
    return [];
  }
}

// Main search handler
export async function GET(request: NextRequest) {
  try {
    // Get search query from URL parameters
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q');
    
    // If no query, return empty results
    if (!query || query.trim().length === 0) {
      return NextResponse.json({ results: [] });
    }
    
    // Execute searches in parallel
    const [projects, products, news, podcasts] = await Promise.all([
      searchProjects(query),
      searchProducts(query),
      searchNews(query),
      searchPodcasts(query)
    ]);
    
    // Combine results
    const results = {
      projects,
      products,
      news,
      podcasts,
      all: [...projects, ...products, ...news, ...podcasts]
    };
    
    return NextResponse.json({ results, query });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'An error occurred during search' },
      { status: 500 }
    );
  }
}