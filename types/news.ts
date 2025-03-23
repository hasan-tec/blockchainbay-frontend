// types/news.ts

export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  image: string;
  categories: string[];
  date: string;
  readTime: string;
  source: string;
  featured: boolean;
  link: string; // Added this property to store the original article URL
}

export interface CategoryFilter {
  id: string;
  label: string;
  count: number;
}

export interface TimeFilter {
  id: string;
  label: string;
  count: number;
}