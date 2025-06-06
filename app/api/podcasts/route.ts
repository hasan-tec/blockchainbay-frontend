// app/api/podcasts/route.ts

import { NextResponse } from 'next/server';
import { parseString } from 'xml2js';

// Add type for Next.js fetch options
type NextFetchOptions = RequestInit & {
  next?: {
    revalidate?: number;
  };
};

// Type definitions
interface PodcastEnclosure {
  $: {
    url: string;
    length?: string;
    type?: string;
  };
}

interface ITunesImage {
  $: {
    href: string;
  };
}

interface PodcastItem {
  title: string;
  description?: string;
  pubDate?: string;
  link?: string;
  enclosure?: PodcastEnclosure;
  'itunes:image'?: ITunesImage;
  'itunes:duration'?: string;
  'itunes:category'?: { $: { text: string } };
  category?: string | string[];
}

interface RSSChannel {
  title?: string;
  description?: string;
  link?: string;
  image?: { url: string };
  'itunes:image'?: ITunesImage;
  item: PodcastItem | PodcastItem[];
}

interface RSSFeed {
  rss: {
    channel: RSSChannel;
  };
}

// Function to strip HTML tags
const stripHtmlTags = (html: string): string => {
  return html?.replace(/<\/?[^>]+(>|$)/g, '') || '';
};

export async function GET() {
  try {
    // Fetch the RSS feed on the server side
    const fetchOptions: NextFetchOptions = {
      next: { revalidate: 3600 } // Revalidate every hour
    };
    
    const response = await fetch('https://media.rss.com/blockchainbay/feed.xml', fetchOptions);
    
    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch RSS feed: ${response.status}` },
        { status: response.status }
      );
    }
    
    const xmlText = await response.text();
    
    // Parse XML and process the data
    const podcasts = await new Promise((resolve, reject) => {
      parseString(xmlText, { explicitArray: false }, (err: Error | null, result: RSSFeed) => {
        if (err) {
          reject(new Error(`Failed to parse XML: ${err.message}`));
          return;
        }
        
        try {
          const channel = result.rss.channel;
          // Handle single item case by converting to array
          const items = Array.isArray(channel.item) ? channel.item : [channel.item];
          
          // Get channel level image (podcast cover)
          let podcastImage = '';
          if (channel['itunes:image'] && channel['itunes:image']['$'] && channel['itunes:image']['$'].href) {
            podcastImage = channel['itunes:image']['$'].href;
          } else if (channel.image && channel.image.url) {
            podcastImage = channel.image.url;
          }
          
          const podcasts = items.map((item: PodcastItem, index: number) => {
            const title = item.title.replace(/^##### /, '').trim();
            // Strip HTML tags from description
            const description = stripHtmlTags(item.description || '');
            const pubDate = item.pubDate || '';
            
            // Extract episode number from title
            const match = title.match(/Ep\s*(\d+)/i);
            const epNumber = match ? match[1] : '';
            
            // Generate ID from episode number or index
            const id = epNumber ? `ep-${epNumber}` : `episode-${index + 1}`;
            
            // Get media URL from enclosure
            let audioUrl = '';
            if (item.enclosure && item.enclosure['$'] && item.enclosure['$'].url) {
              audioUrl = item.enclosure['$'].url;
            }
            
            // Get episode image
            let thumbnailUrl = '';
            if (item['itunes:image'] && item['itunes:image']['$'] && item['itunes:image']['$'].href) {
              thumbnailUrl = item['itunes:image']['$'].href;
            } else {
              // Use podcast image as fallback
              thumbnailUrl = podcastImage;
            }
            
            // Determine category
            let category = 'Technology';
            if (item['itunes:category'] && item['itunes:category']['$'] && item['itunes:category']['$'].text) {
              category = item['itunes:category']['$'].text;
            } else if (item.category) {
              // Use the first category if multiple exist
              category = Array.isArray(item.category) ? item.category[0] : item.category;
            }
            
            // Get duration
            let duration = '25 min';
            if (item['itunes:duration']) {
              duration = item['itunes:duration'];
              // Format duration if it's just seconds
              if (!duration.includes(':') && !isNaN(Number(duration))) {
                const minutes = Math.floor(Number(duration) / 60);
                duration = `${minutes} min`;
              }
            } else {
              // Estimate based on description length
              const wordCount = description.split(/\s+/).length;
              if (wordCount > 300) duration = "60 min";
              else if (wordCount > 200) duration = "45 min";
              else if (wordCount > 100) duration = "30 min";
            }
            
            // Format date
            const date = new Date(pubDate).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            });
            
            // Set featured for newest episodes
            const featured = index < 3;
            
            return {
              id,
              title,
              description,
              thumbnail: thumbnailUrl || `https://source.unsplash.com/random/400x400?podcast,${index}`,
              audio: audioUrl || '',
              date,
              duration,
              category,
              featured
            };
          });
          
          resolve(podcasts);
        } catch (error) {
          console.error("Error processing RSS data:", error);
          reject(new Error(`Error processing RSS data: ${error}`));
        }
      });
    });
    
    return NextResponse.json(podcasts);
  } catch (error) {
    console.error("Error fetching podcasts:", error);
    return NextResponse.json(
      { error: "Failed to load podcasts" },
      { status: 500 }
    );
  }
}