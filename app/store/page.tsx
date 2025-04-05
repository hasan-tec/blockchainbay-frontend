import { Suspense } from 'react';
import { getProducts, getCategories, getTags, getStrapiMediaUrl, ProductType, CategoryType } from '@/lib/storeapi';
import StoreClient from './client';
import Navbar from '@/components/Navbar';
import Loading from './loading';

// Disable revalidation caching to ensure fresh data on each request
export const revalidate = 0;

// Define RawProduct type to fix TypeScript errors
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
  category?: any;
  tags?: any[];
  attributes?: any;
  [key: string]: any;
}

// Define RawTag type to fix TypeScript errors
interface RawTag {
  id: number | string;
  name?: string;
  slug?: string;
  attributes?: any;
  [key: string]: any;
}

// Define RawCategory type to fix TypeScript errors
interface RawCategory {
  id: number | string;
  name?: string;
  slug?: string;
  attributes?: any;
  [key: string]: any;
}

export default async function StorePage() {
  console.log('Starting to fetch store data');
  
  try {
    // Fetch all necessary data in parallel with proper error handling
    const [rawProducts, rawCategories, rawTags] = await Promise.all([
      getProducts().catch(error => {
        console.error('Error fetching products:', error);
        return [];
      }),
      getCategories().catch(error => {
        console.error('Error fetching categories:', error);
        return [];
      }),
      getTags().catch(error => {
        console.error('Error fetching tags:', error);
        return [];
      })
    ]);

    console.log(`Products: ${rawProducts?.length || 0}, Categories: ${rawCategories?.length || 0}, Tags: ${rawTags?.length || 0}`);

    // Transform flat products to expected structure with proper typing
    const products = (rawProducts || []).map((product: RawProduct): ProductType => {
      // Extract the correct URL from Strapi 5 format
      let imageUrl = '/placeholder.svg';
      
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
          name: product.name || product.attributes?.name || '',
          slug: product.slug || product.attributes?.slug || 'product',
          description: product.description || product.attributes?.description || '',
          price: product.price || product.attributes?.price || 0,
          originalPrice: product.originalPrice || product.attributes?.originalPrice,
          inStock: Boolean(product.inStock || product.attributes?.inStock),
          featured: Boolean(product.featured || product.attributes?.featured),
          new: Boolean(product.new || product.attributes?.new),
          sale: Boolean(product.sale || product.attributes?.sale),
          rating: product.rating || product.attributes?.rating || 0,
          reviewCount: product.reviewCount || product.attributes?.reviewCount || 0,
          heliumDeployVariantId: product.heliumDeployVariantId || product.attributes?.heliumDeployVariantId || '',
          heliumDeployProductUrl: product.heliumDeployProductUrl || product.attributes?.heliumDeployProductUrl,
          dimensions: product.dimensions || product.attributes?.dimensions,
          weight: product.weight || product.attributes?.weight,
          materials: product.materials || product.attributes?.materials,
          batteryLife: product.batteryLife || product.attributes?.batteryLife,
          warranty: product.warranty || product.attributes?.warranty,
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
              id: ((product.category && typeof product.category === 'object') 
                ? String(product.category.id || 1) 
                : (product.attributes?.category?.data?.id || '1')),
              attributes: {
                name: (product.category && typeof product.category === 'object')
                  ? (product.category.name || 'Uncategorized')
                  : (product.attributes?.category?.data?.attributes?.name || 'Uncategorized'),
                slug: (product.category && typeof product.category === 'object')
                  ? (product.category.slug || 'uncategorized')
                  : (product.attributes?.category?.data?.attributes?.slug || 'uncategorized')
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
              : (product.attributes?.tags?.data || [])
          }
        }
      };
    });

    // Transform categories to expected structure
    const categories = (rawCategories || []).map((category: RawCategory): CategoryType => ({
      id: String(category.id || category.attributes?.id || '1'),
      attributes: {
        name: category.name || category.attributes?.name || 'Uncategorized',
        slug: category.slug || category.attributes?.slug || 'category'
      }
    }));

    // Transform tags to expected structure
    const tags = (rawTags || []).map((tag: RawTag) => ({
      id: String(tag.id || tag.attributes?.id || '1'),
      attributes: {
        name: tag.name || tag.attributes?.name || '',
        slug: tag.slug || tag.attributes?.slug || 'tag'
      }
    }));

    // Log the first product to see its structure (for debugging)
    if (products.length > 0) {
      console.log('First product transformed:', {
        id: products[0].id,
        name: products[0].attributes.name,
        slug: products[0].attributes.slug,
        mainImageUrl: products[0].attributes.mainImage?.data?.attributes?.url
      });
    } else {
      console.log('No products available after transformation!');
    }

    console.log('Rendering store page with data');

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
  } catch (error) {
    console.error('Critical error in StorePage:', error);
    
    // Return a basic error page instead of crashing
    return (
      <>
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#07071C] text-white p-4">
          <h1 className="text-3xl font-bold mb-4">Temporarily Unavailable</h1>
          <p className="mb-8 text-gray-300">We're having trouble connecting to our product database. Please try again soon.</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-[#F7984A] text-white rounded-md hover:bg-[#F7984A]/90"
          >
            Refresh Page
          </button>
        </div>
      </>
    );
  }
}