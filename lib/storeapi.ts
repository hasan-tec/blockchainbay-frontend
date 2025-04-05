import axios from 'axios';

// Changed to use explicit API_TOKEN for authentication
const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:1337';
const API_TOKEN = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;

// Configure axios with headers and disable default caching
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Authorization': API_TOKEN ? `Bearer ${API_TOKEN}` : '',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache'
  }
});

// Add a timestamp to GET requests to prevent caching
apiClient.interceptors.request.use(config => {
  if (config.method?.toLowerCase() === 'get') {
    config.params = {
      ...config.params,
      _t: Date.now() // Add timestamp to prevent caching
    };
  }
  return config;
});

// Add this type definition at the top of storeapi.ts
export type ReviewType = {
  id: number;
  Author: string;
  Rating: number;
  Date: string;
  Title: string;
  Content: string;
  Verified: boolean;
};

// Add at the top of storeapi.ts
export type RichTextChild = {
  type: string;
  text?: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  url?: string; // Add this for link support
  children?: Array<RichTextChild>; // Make this recursive
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
    Review?: ReviewType[];
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
    specifications?: RichTextBlock[] | {
      data: Array<{
        id: string;
        attributes: {
          key: string;
          value: string;
        }
      }>;
    };
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

// Utility to implement retries for API requests
const withRetry = async <T>(fn: () => Promise<T>, retries = 3, delay = 300): Promise<T> => {
  let lastError;
  
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      console.error(`API request failed (attempt ${attempt}/${retries}):`, error);
      
      if (attempt < retries) {
        // Exponential backoff
        const backoffDelay = delay * Math.pow(2, attempt - 1);
        console.log(`Retrying in ${backoffDelay}ms...`);
        await new Promise(resolve => setTimeout(resolve, backoffDelay));
      }
    }
  }
  
  throw lastError;
};

export async function getProducts(filters: any = {}) {
  try {
    // Extract any pagination from filters to prevent overriding
    const { pagination: filterPagination, ...otherFilters } = filters;
    
    // Set default pagination with a much higher limit
    const pagination = filterPagination || {
      pageSize: 1000, // Set much higher than your total products
      page: 1
    };
    
    console.log('Fetching products with pagination:', pagination);
    
    // Use retry mechanism for more reliable data fetching
    const response = await withRetry(() => 
      apiClient.get('/api/products', {
        params: {
          populate: {
            mainImage: { populate: '*' },
            category: { populate: '*' },
            tags: { populate: '*' },
          },
          sort: ['featured:desc', 'createdAt:desc'],
          pagination, // Use the pagination object directly
          filters: otherFilters, // Pass other filters separately
        }
      })
    );
    
    console.log('Products API response status:', response.status);
    console.log('Products data length:', response.data.data?.length || 0);
    
    if (!response.data || !response.data.data || !Array.isArray(response.data.data)) {
      console.error('Invalid response format from API:', response.data);
      return [];
    }
    
    return response.data.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

export async function getFeaturedProducts() {
  try {
    const response = await withRetry(() => 
      apiClient.get('/api/products', {
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
      })
    );
    
    return response.data.data;
  } catch (error) {
    console.error('Error fetching featured products:', error);
    return [];
  }
}

export async function getProductBySlug(slug: string) {
  try {
    console.log(`Fetching product with slug: ${slug}`);
    
    // First attempt with proper filtering
    const response = await withRetry(() => 
      apiClient.get('/api/products', {
        params: {
          filters: {
            slug: {
              $eq: slug
            }
          },
          populate: '*'
        }
      })
    );
    
    if (response.data && response.data.data && response.data.data.length > 0) {
      // The API is returning the product directly, not in attributes 
      const product = response.data.data[0];
      
      // Log to debug
      console.log(`Product found with ID: ${product.id}, name: ${product.attributes?.name || product.name}`);
      console.log(`Specifications available: ${product.attributes?.specifications ? 'Yes' : 'No'}`);
      
      return product;
    }
    
    // Second attempt: get all products and filter manually
    console.log(`No product found with slug: ${slug}, trying alternative method`);
    
    const allProductsResponse = await apiClient.get('/api/products', {
      params: {
        populate: '*'
      }
    });
    
    if (allProductsResponse.data && allProductsResponse.data.data) {
      const allProducts = allProductsResponse.data.data;
      
      // Find product by slug in the complete data set
      const product = allProducts.find((p: any) => 
        (p.attributes && p.attributes.slug === slug) || 
        (p.slug === slug)
      );
      
      if (product) {
        console.log(`Found product with slug: ${slug} in complete data set`);
        return product;
      }
    }
    
    console.log(`No product found with slug: ${slug} after all attempts`);
    return null;
    
  } catch (error: any) {
    console.error(`Error fetching product with slug ${slug}:`, error);
    if (error.response) {
      console.error('Response status:', error.response.status);
    }
    return null;
  }
}

/**
 * Fetches reviews for a specific product using Strapi v5 API syntax
 * @param productId The ID of the product to fetch reviews for
 * @returns An array of review objects or an empty array if none found
 */
export async function getProductReviews(productId: string) {
  try {
    // Simplify by fetching all products with full population
    const response = await withRetry(() =>
      apiClient.get('/api/products', {
        params: {
          populate: '*'
        }
      })
    );
    
    if (!response.data || !response.data.data || !Array.isArray(response.data.data)) {
      return [];
    }
    
    // Find the product by ID
    const targetProduct = response.data.data.find((p: any) => 
      p.id === productId || 
      (p.attributes && p.attributes.id === productId)
    );
    
    if (!targetProduct) {
      return [];
    }
    
    // Check where the reviews might be located
    if (targetProduct.Review && Array.isArray(targetProduct.Review)) {
      return targetProduct.Review;
    } 
    else if (targetProduct.attributes && targetProduct.attributes.Review && 
             Array.isArray(targetProduct.attributes.Review)) {
      return targetProduct.attributes.Review;
    }
    
    return [];
  } catch (error) {
    console.error(`Error fetching reviews:`, error);
    return [];
  }
}

export async function getCategories() {
  try {
    console.log('Fetching categories');
    const response = await withRetry(() =>
      apiClient.get('/api/categories', {
        params: {
          populate: '*'
        }
      })
    );
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
    const response = await withRetry(() =>
      apiClient.get('/api/products', {
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
      })
    );
    return response.data.data;
  } catch (error) {
    console.error(`Error fetching products by category ${categorySlug}:`, error);
    return [];
  }
}

export async function getTags() {
  try {
    console.log('Fetching tags');
    const response = await withRetry(() =>
      apiClient.get('/api/tags', {
        params: {
          populate: '*'
        }
      })
    );
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