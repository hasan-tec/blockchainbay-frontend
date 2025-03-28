import axios from 'axios';

// Changed to use explicit API_TOKEN for authentication
const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:1337';
const API_TOKEN = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;

// Configure axios with headers
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    Authorization: API_TOKEN ? `Bearer ${API_TOKEN}` : '',
  }
});

// Add at the top of storeapi.ts
export type RichTextChild = {
  type: string;
  text?: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  children?: Array<any>;
};

export type RichTextBlock = {
  type: string;
  children: Array<RichTextChild>;
};


export type ProductType = {
  id: string;
  attributes: {
    name: string;
    slug: string;
    description: string | RichTextBlock[]; // Use RichTextBlock[] for rich text
    price: number;
    originalPrice?: number;
    inStock: boolean;
    featured: boolean;
    new: boolean;
    sale: boolean;
    rating: number;
    reviewCount: number;
    heliumDeployVariantId: string;
    heliumDeployProductUrl?: string;
    dimensions?: string;
    weight?: string;
    materials?: string;
    batteryLife?: string;
    warranty?: string;
    mainImage: {
      data: {
        attributes: {
          url: string;
          formats?: {
            thumbnail?: {
              url: string;
            };
            small?: {
              url: string;
            };
            medium?: {
              url: string;
            };
            large?: {
              url: string;
            };
          };
        }
      }
    };
    additionalImages?: {
      data: Array<{
        attributes: {
          url: string;
          formats?: {
            thumbnail?: {
              url: string;
            };
            small?: {
              url: string;
            };
            medium?: {
              url: string;
            };
            large?: {
              url: string;
            };
          };
        }
      }>;
    };
    category: {
      data: {
        id: string;
        attributes: {
          name: string;
          slug: string;
        }
      }
    };
    tags?: {
      data: Array<{
        id: string;
        attributes: {
          name: string;
          slug: string;
        }
      }>;
    };
    features?: {
      data: Array<{
        id: string;
        attributes: {
          text: string;
        }
      }>;
    };
    specifications?: {
      data: Array<{
        id: string;
        attributes: {
          key: string;
          value: string;
        }
      }>;
    };
    compatibilities?: {
      data: Array<{
        id: string;
        attributes: {
          name: string;
        }
      }>;
    };
    connectivities?: {
      data: Array<{
        id: string;
        attributes: {
          name: string;
        }
      }>;
    };
  }
};

export type CategoryType = {
  id: string;
  attributes: {
    name: string;
    slug: string;
    products?: {
      data: ProductType[];
    };
  }
};

export async function getProducts(filters = {}) {
  try {
    console.log('Fetching products with params:', {
      populate: {
        mainImage: {
          populate: '*',
        },
        category: {
          populate: '*',
        },
        tags: {
          populate: '*',
        },
      },
      sort: ['featured:desc', 'createdAt:desc'],
      ...filters
    });
    
    const response = await apiClient.get('/api/products', {
      params: {
        populate: {
          mainImage: {
            populate: '*',
          },
          category: {
            populate: '*',
          },
          tags: {
            populate: '*',
          },
        },
        sort: ['featured:desc', 'createdAt:desc'],
        ...filters
      }
    });
    
    console.log('Products API response status:', response.status);
    console.log('Products data length:', response.data.data?.length || 0);
    
    return response.data.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

export async function getFeaturedProducts() {
  try {
    const response = await apiClient.get('/api/products', {
      params: {
        filters: {
          featured: {
            $eq: true,
          },
        },
        populate: {
          mainImage: {
            populate: '*',
          },
          category: {
            populate: '*',
          },
          tags: {
            populate: '*',
          },
        },
      }
    });
    return response.data.data;
  } catch (error) {
    console.error('Error fetching featured products:', error);
    return [];
  }
}

export async function getProductBySlug(slug: string) {
  try {
    const response = await apiClient.get('/api/products', {
      params: {
        filters: {
          slug: {
            $eq: slug,
          },
        },
        populate: {
          mainImage: {
            populate: '*',
          },
          additionalImages: {
            populate: '*',
          },
          category: {
            populate: '*',
          },
          tags: {
            populate: '*',
          },
          features: {
            populate: '*',
          },
          specifications: {
            populate: '*',
          },
          compatibilities: {
            populate: '*',
          },
          connectivities: {
            populate: '*',
          },
        },
      }
    });
    return response.data.data[0];
  } catch (error) {
    console.error(`Error fetching product with slug ${slug}:`, error);
    return null;
  }
}

export async function getCategories() {
  try {
    console.log('Fetching categories');
    const response = await apiClient.get('/api/categories', {
      params: {
        populate: '*'
      }
    });
    console.log('Categories API response status:', response.status);
    console.log('Categories data length:', response.data.data?.length || 0);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

export async function getProductsByCategory(categorySlug: string) {
  try {
    const response = await apiClient.get('/api/products', {
      params: {
        filters: {
          category: {
            slug: {
              $eq: categorySlug,
            },
          },
        },
        populate: {
          mainImage: {
            populate: '*',
          },
          category: {
            populate: '*',
          },
          tags: {
            populate: '*',
          },
        },
      }
    });
    return response.data.data;
  } catch (error) {
    console.error(`Error fetching products by category ${categorySlug}:`, error);
    return [];
  }
}

export async function getTags() {
  try {
    console.log('Fetching tags');
    const response = await apiClient.get('/api/tags', {
      params: {
        populate: '*'
      }
    });
    console.log('Tags API response status:', response.status);
    console.log('Tags data length:', response.data.data?.length || 0);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching tags:', error);
    return [];
  }
}

// Helper function to get the full image URL
// Updated getStrapiMediaUrl function for Strapi 5 compatibility

export function getStrapiMediaUrl(url: string): string {
    if (!url) return '/placeholder.png';
    
    // If the URL is already a full URL (starts with http)
    if (url.startsWith('http')) {
      return url;
    }
    
    // For local development with Strapi 5
    const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:1337';
    
    // Handle paths that already have leading slash
    if (url.startsWith('/')) {
      return `${API_URL}${url}`;
    } else {
      return `${API_URL}/${url}`;
    }
  }


  // Add type definition for processProductImage parameter

// First, define a type for raw product image from Strapi 5
type StrapiRawImage = {
    url?: string;
    documentId?: string;
    formats?: {
      thumbnail?: { url: string; width: number; height: number };
      small?: { url: string; width: number; height: number };
      medium?: { url: string; width: number; height: number };
      large?: { url: string; width: number; height: number };
    };
  } | null;
  
  // Now update the function with proper typing
  export function processProductImage(product: { mainImage?: StrapiRawImage | { data: { attributes: { url: string; formats?: any } } } }) {
    // Check if mainImage exists and handle accordingly
    if (product.mainImage && !('data' in product.mainImage)) {
      // Convert to the expected structure
      return {
        data: {
          attributes: {
            url: product.mainImage?.url || `/uploads/${product.mainImage?.documentId}.png`,
            formats: product.mainImage?.formats || {}
          }
        }
      };
    } else if (product.mainImage === null) {
      // Return a placeholder if no image
      return {
        data: {
          attributes: {
            url: '/placeholder.png'
          }
        }
      };
    }
    
    // If it already has the expected structure, return as is
    return product.mainImage;
  }