import { Suspense } from 'react';
import NewsPageClient from '@/components/NewsPageClient';
import { fetchRssNews, generateCategoryFilters } from '@/lib/fetch-rss-server';

export default async function NewsPage() {
  // Fetch data directly in the server component
  try {
    const newsArticles = await fetchRssNews();
    const categoryFilters = generateCategoryFilters(newsArticles);
    
    return (
      <Suspense fallback={<div className="flex justify-center pt-32 pb-20">
        <div className="w-12 h-12 rounded-full border-4 border-gray-700 border-t-[#F7984A] animate-spin"></div>
      </div>}>
        <NewsPageClient 
          initialNewsArticles={newsArticles} 
          initialCategoryFilters={categoryFilters} 
        />
      </Suspense>
    );
  } catch (error) {
    console.error('Error fetching RSS news:', error);
    
    // Return client component with empty data
    return <NewsPageClient initialNewsArticles={[]} initialCategoryFilters={[]} />;
  }
}