export type NewsArticle = {
    id: string
    title: string
    summary: string
    image: string
    categories: string[]
    date: string
    readTime: string
    source: string
    featured?: boolean
  }
  
  export type CategoryFilter = {
    id: string
    label: string
    count: number
  }
  
  export type TimeFilter = {
    id: string
    label: string
    count: number
  }