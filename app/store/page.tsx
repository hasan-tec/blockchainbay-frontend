import { Suspense } from 'react';
import { getProducts, getCategories, getTags, getStrapiMediaUrl } from '@/lib/storeapi';
import StoreClient from './client';
import Navbar from '@/components/Navbar';
import { Footer } from '@/components/NewsletterFooter';
import Loading from './loading';

// Define types for your raw data
interface RawProduct {
  id: number | string;
  name?: string;
  slug?: string;
  description?: string;
  price?: number;
  originalPrice?: number;
  inStock?: boolean;
  featured?: boolean;
  new?: boolean;
  sale?: boolean;
  rating?: number;
  reviewCount?: number;
  heliumDeployVariantId?: string;
  heliumDeployProductUrl?: string;
  dimensions?: string;
  weight?: string;
  materials?: string;
  batteryLife?: string;
  warranty?: string;
  mainImage?: any;
  category?: any; // We'll handle this safely in the transformation
  tags?: any[]; // We'll handle this safely in the transformation
  [key: string]: any; // For any other properties
}

interface RawCategory {
  id: number | string;
  name?: string;
  slug?: string;
  [key: string]: any;
}

interface RawTag {
  id: number | string;
  name?: string;
  slug?: string;
  [key: string]: any;
}

// Type to match what your StoreClient expects
type TransformedProductType = {
  id: string;
  attributes: {
    name: string;
    slug: string;
    description: string;
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
        }
      }
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
    tags: {
      data: Array<{
        id: string;
        attributes: {
          name: string;
          slug: string;
        }
      }>;
    };
  }
};

type TransformedCategoryType = {
  id: string;
  attributes: {
    name: string;
    slug: string;
  }
};

type TransformedTagType = {
  id: string;
  attributes: {
    name: string;
    slug: string;
  }
};

export const revalidate = 3600; // Revalidate the data at most once per hour

export default async function StorePage() {
  // Fetch all necessary data in parallel
  const [rawProducts, rawCategories, rawTags] = await Promise.all([
    getProducts(),
    getCategories(),
    getTags()
  ]);

  console.log('Products fetched:', rawProducts?.length || 0);
  console.log('Categories fetched:', rawCategories?.length || 0);
  console.log('Tags fetched:', rawTags?.length || 0);

  // Transform flat products to expected structure
  const products = (rawProducts || []).map((product: RawProduct): TransformedProductType => {
    // Extract the correct URL from Strapi 5 format
    let imageUrl = '/placeholder.jpg';
    
    if (product.mainImage) {
      // Handle Strapi 5 different image formats
      if (product.mainImage.data && product.mainImage.data.attributes) {
        // Standard Strapi format
        imageUrl = product.mainImage.data.attributes.url;
      } else if (product.mainImage.url) {
        // Direct URL from Strapi
        imageUrl = product.mainImage.url;
      } else if (product.mainImage.formats && product.mainImage.formats.small) {
        // Formats object directly on mainImage
        imageUrl = product.mainImage.formats.small.url;
      } else if (product.mainImage.documentId) {
        // Using documentId (your custom format)
        imageUrl = `/uploads/${product.mainImage.documentId}.png`;
      }
    }
    
    return {
      id: String(product.id),
      attributes: {
        name: product.name || '',
        slug: product.slug || 'product',
        description: product.description || '',
        price: product.price || 0,
        originalPrice: product.originalPrice,
        inStock: Boolean(product.inStock),
        featured: Boolean(product.featured),
        new: Boolean(product.new),
        sale: Boolean(product.sale),
        rating: product.rating || 0,
        reviewCount: product.reviewCount || 0,
        heliumDeployVariantId: product.heliumDeployVariantId || '',
        heliumDeployProductUrl: product.heliumDeployProductUrl,
        dimensions: product.dimensions,
        weight: product.weight,
        materials: product.materials,
        batteryLife: product.batteryLife,
        warranty: product.warranty,
        // Use the determined image URL
        mainImage: {
          data: {
            attributes: {
              url: imageUrl
            }
          }
        },
        // Handle category with proper nesting
        category: {
          data: {
            id: (product.category && typeof product.category === 'object') 
              ? String(product.category.id || 1) 
              : '1',
            attributes: {
              name: (product.category && typeof product.category === 'object')
                ? (product.category.name || 'Uncategorized')
                : 'Uncategorized',
              slug: (product.category && typeof product.category === 'object')
                ? (product.category.slug || 'uncategorized')
                : 'uncategorized'
            }
          }
        },
        // Handle tags with proper array structure
        tags: {
          data: Array.isArray(product.tags)
            ? product.tags.map((tag: any) => ({
                id: (tag && tag.id) ? String(tag.id) : '1',
                attributes: {
                  name: (tag && tag.name) ? tag.name : 'Tag',
                  slug: (tag && tag.slug) ? tag.slug : 'tag'
                }
              }))
            : []
        }
      }
    };
  });

  // Transform categories to expected structure
  const categories = (rawCategories || []).map((category: RawCategory): TransformedCategoryType => ({
    id: String(category.id),
    attributes: {
      name: category.name || '',
      slug: category.slug || 'category'
    }
  }));

  // Transform tags to expected structure
  const tags = (rawTags || []).map((tag: RawTag): TransformedTagType => ({
    id: String(tag.id),
    attributes: {
      name: tag.name || '',
      slug: tag.slug || 'tag'
    }
  }));

  // Log the first product to see its structure (for debugging)
  if (products.length > 0) {
    console.log('First product transformed:', {
      id: products[0].id,
      name: products[0].attributes.name,
      slug: products[0].attributes.slug,
      mainImageUrl: products[0].attributes.mainImage.data.attributes.url
    });
  }

  return (
    <>
      <Navbar />
      <Suspense fallback={<Loading />}>
        <StoreClient 
          products={products} 
          categories={categories} 
          tags={tags} 
        />
      </Suspense>
    
    </>
  );
}