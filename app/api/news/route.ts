import { NextResponse } from 'next/server';
import { fetchRssNews } from '@/lib/fetch-rss-server';
import { newsArticles as fallbackArticles } from '@/lib/mock-data';

export async function GET() {
  try {
    // Fetch news from RSS feeds
    const articles = await fetchRssNews();
    
    // Return the articles as JSON
    return NextResponse.json(articles);
  } catch (error) {
    console.error('Error fetching news:', error);
    
    // Return fallback data in case of error
    return NextResponse.json(fallbackArticles, { status: 200 });
  }
}