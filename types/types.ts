// Types for Crypto Projects

export interface CryptoProject {
    id: number;
    documentId: string;
    title: string;
    Slug: string;
    ShortDescription: string;
    DetailedDescription: DetailedDescriptionBlock[];
    CurrentStatus: "Verified" | "Coming Soon" | string;
    Category: "Computing" | "Storage" | string;
    SubCategory: string | null;
    TokenType: "Has token" | "No token" | string;
    Website: string;
    Symbol: string;
    ChainType: string;
    LaunchDate: string | null;
    VideoURL: string;
    Twitter: string | null;
    Telegram: string | null;
    Discord: string | null;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    AnalyticsDuneQueryID: string | null;
    Logo?: {
      data?: {
        attributes?: {
          url: string;
        };
      };
    };
  }
  
  export interface DetailedDescriptionBlock {
    type: "paragraph";
    children: {
      type: "text";
      text: string;
      bold?: boolean;
    }[];
  }
  
  export interface StrapiResponse {
    data: CryptoProject[];
    meta: {
      pagination: {
        page: number;
        pageSize: number;
        pageCount: number;
        total: number;
      };
    };
  }