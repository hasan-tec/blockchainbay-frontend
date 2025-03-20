import { NewsArticle, CategoryFilter, TimeFilter } from '@/types/news';

// Mock news articles for fallback and initial loading state
export const newsArticles: NewsArticle[] = [
  {
    id: "1",
    title: "Ethereum Layer 2 Solutions See Record Growth in TVL",
    summary:
      "Arbitrum and Optimism lead the charge as Ethereum scaling solutions reach new heights in total value locked.",
    image: "https://images.unsplash.com/photo-1621761191319-c6fb62004040?q=80&w=2070&auto=format&fit=crop",
    categories: ["Ethereum", "DeFi"],
    date: "2 days ago",
    readTime: "5 min read",
    source: "CryptoHub",
    featured: true,
  },
  {
    id: "2",
    title: "Major Bank Announces Crypto Custody Services for Institutional Clients",
    summary:
      "In a significant move for mainstream adoption, one of the world's largest banks will offer cryptocurrency custody.",
    image: "https://images.unsplash.com/photo-1620714223084-8fcacc6dfd8d?q=80&w=2071&auto=format&fit=crop",
    categories: ["Adoption", "Banking"],
    date: "4 days ago",
    readTime: "4 min read",
    source: "CryptoHub",
  },
  {
    id: "3",
    title: "New Regulatory Framework Proposed for Stablecoins",
    summary:
      "Lawmakers introduce comprehensive legislation aimed at providing clarity for stablecoin issuers and users.",
    image: "https://images.unsplash.com/photo-1551135049-8a33b5883817?q=80&w=2070&auto=format&fit=crop",
    categories: ["Regulation", "Stablecoins"],
    date: "5 days ago",
    readTime: "6 min read",
    source: "CryptoHub",
  }
];

// Mock category filters
export const categoryFilters: CategoryFilter[] = [
  { id: "bitcoin", label: "Bitcoin", count: 42 },
  { id: "ethereum", label: "Ethereum", count: 38 },
  { id: "defi", label: "DeFi", count: 35 },
  { id: "nfts", label: "NFTs", count: 29 },
  { id: "regulation", label: "Regulation", count: 24 },
  { id: "adoption", label: "Adoption", count: 20 },
  { id: "gaming", label: "Gaming", count: 18 },
];

// Mock time filters
export const timeFilters: TimeFilter[] = [
  { id: "today", label: "Today", count: 8 },
  { id: "this_week", label: "This Week", count: 32 },
  { id: "this_month", label: "This Month", count: 124 },
  { id: "this_year", label: "This Year", count: 1045 },
];