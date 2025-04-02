export interface StrapiResponse<T> {
    data: Array<{
      id: number;
      documentId: string;
      attributes: T;
    }>;
    meta: {
      pagination: {
        page: number;
        pageSize: number;
        pageCount: number;
        total: number;
      };
    };
  }
  
  export interface StrapiImage {
    data: {
      id: number;
      documentId: string;
      attributes: {
        name: string;
        alternativeText: string | null;
        caption: string | null;
        width: number;
        height: number;
        formats: {
          thumbnail: {
            url: string;
            width: number;
            height: number;
          };
          small: {
            url: string;
            width: number;
            height: number;
          };
          medium: {
            url: string;
            width: number;
            height: number;
          };
          large: {
            url: string;
            width: number;
            height: number;
          };
        };
        hash: string;
        ext: string;
        mime: string;
        size: number;
        url: string;
        previewUrl: string | null;
        provider: string;
        createdAt: string;
        updatedAt: string;
      };
    } | null;
  }
  
  export interface WallpaperAttributes {
    name: string;
    description: string | null;
    dimensions: string;
    type: 'desktop' | 'mobile';
    file: StrapiImage;
    thumbnail: StrapiImage;
    order: number;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
  }
  
  export interface LogoAttributes {
    name: string;
    description: string | null;
    format: 'svg' | 'png' | 'jpeg' | 'vector' | 'pdf';
    variation: 'primary' | 'white' | 'black' | 'icon';
    file: StrapiImage;
    order: number;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
  }
  
  export interface Wallpaper {
    id: number;
    documentId: string;
    attributes: WallpaperAttributes;
  }
  
  export interface Logo {
    id: number;
    documentId: string;
    attributes: LogoAttributes;
  }