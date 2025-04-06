import { Suspense } from 'react';
import { getProductBySlug, getProducts, ProductType, RichTextBlock } from '../../../lib/storeapi';
import ProductDetailClient from './client';
import Navbar from '../../../components/Navbar';
import Loading from './loading';
import { notFound } from 'next/navigation';

// Disable caching for more reliable data loading
export const revalidate = 0;

// Type definitions for raw data
interface RawImage {
  url?: string;
  attributes?: {
    url: string;
    [key: string]: any;
  };
  documentId?: string;
  formats?: {
    small?: { url: string };
    [key: string]: any;
  };
  [key: string]: any;
}

// Function to ensure description formatting is preserved
function formatDescription(description: string | object): string | RichTextBlock[] {
  if (typeof description !== 'string') {
    return description as RichTextBlock[];
  }
  
  if (!description) return '';
  
  // Ensure consistent newlines
  let formattedDesc = description.replace(/\r\n/g, '\n');
  
  // Make sure checkmarks are properly displayed
  formattedDesc = formattedDesc.replace(/- /g, '✅ ');
  
  return formattedDesc;
}

// Transform product data with safer approach
function transformProductIfNeeded(product: any): ProductType {
  console.log('Transforming product data:', { id: product.id });

  // If the product already has the expected structure, return it
  if (product && product.attributes && product.attributes.mainImage?.data?.attributes?.url) {
    console.log('Product already has expected structure, returning as is');
    return product as ProductType;
  }

  // Extract the correct image URL
  let mainImageUrl = '/placeholder.png';
  
  try {
    if (product.mainImage) {
      if (product.mainImage.data && product.mainImage.data.attributes) {
        mainImageUrl = product.mainImage.data.attributes.url;
      } else if (product.mainImage.url) {
        mainImageUrl = product.mainImage.url;
      } else if (product.mainImage.formats && product.mainImage.formats.small) {
        mainImageUrl = product.mainImage.formats.small.url;
      } else if (product.mainImage.documentId) {
        mainImageUrl = `/uploads/${product.mainImage.documentId}.png`;
      }
    }
  } catch (error) {
    console.error(`Error processing mainImage for product ${product.id}:`, error);
  }
  
  // Additional images handling with better error handling
  const additionalImagesData = [];
  try {
    if (product.additionalImages) {
      if (Array.isArray(product.additionalImages.data)) {
        // Format 1: Nested data array
        additionalImagesData.push(...product.additionalImages.data.map((img: RawImage) => ({
          attributes: {
            url: img.attributes?.url || '/placeholder.png'
          }
        })));
      } else if (Array.isArray(product.additionalImages)) {
        // Format 2: Direct array
        product.additionalImages.forEach((image: RawImage) => {
          let imageUrl = '/placeholder.png';
          
          if (image.url) {
            imageUrl = image.url;
          } else if (image.attributes?.url) {
            imageUrl = image.attributes.url;
          } else if (image.documentId) {
            imageUrl = `/uploads/${image.documentId}.png`;
          }
          
          additionalImagesData.push({
            attributes: {
              url: imageUrl
            }
          });
        });
      }
    }
  } catch (error) {
    console.error('Error processing additionalImages:', error);
  }
  
  // Process arrays with proper structure for the client component
  const processFeatures = (features: any) => {
    if (!features) return [];
    
    try {
      if (features.data && Array.isArray(features.data)) {
        return features.data;
      } else if (Array.isArray(features)) {
        return features.map((feature) => ({
          id: String(feature.id || Date.now()),
          attributes: {
            text: feature.text || (feature.attributes && feature.attributes.text) || '',
            ...feature
          }
        }));
      }
    } catch (error) {
      console.error('Error processing features:', error);
    }
    
    return [];
  };
  
  const processNamedItems = (items: any) => {
    if (!items) return [];
    
    try {
      if (items.data && Array.isArray(items.data)) {
        return items.data;
      } else if (Array.isArray(items)) {
        return items.map((item) => ({
          id: String(item.id || Date.now()),
          attributes: {
            name: item.name || (item.attributes && item.attributes.name) || '',
            ...item
          }
        }));
      }
    } catch (error) {
      console.error('Error processing named items:', error);
    }
    
    return [];
  };
  
  // Extract specifications from various possible formats
  let specifications = null;
  try {
    if (product.specifications) {
      if (typeof product.specifications === 'string') {
        try {
          specifications = JSON.parse(product.specifications);
        } catch (e) {
          specifications = [
            {
              type: "paragraph",
              children: [{ type: "text", text: product.specifications }]
            }
          ];
        }
      } else if (Array.isArray(product.specifications)) {
        specifications = product.specifications;
      } else if (product.specifications.data && Array.isArray(product.specifications.data)) {
        specifications = { data: product.specifications.data };
      }
    }
  } catch (error) {
    console.error('Error processing specifications:', error);
  }
  
  // Extract category data safely
  let categoryId = '1';
  let categoryName = 'Uncategorized';
  let categorySlug = 'uncategorized';
  
  try {
    if (product.category) {
      if (product.category.data && product.category.data.attributes) {
        categoryId = String(product.category.data.id || '1');
        categoryName = product.category.data.attributes.name || 'Uncategorized';
        categorySlug = product.category.data.attributes.slug || 'uncategorized';
      } else if (typeof product.category === 'object') {
        categoryId = String(product.category.id || '1');
        categoryName = product.category.name || 'Uncategorized';
        categorySlug = product.category.slug || 'uncategorized';
      }
    }
  } catch (error) {
    console.error('Error processing category:', error);
  }
  
  // Extract tags data safely
  let tagsData = [];
  
  try {
    if (product.tags) {
      if (product.tags.data && Array.isArray(product.tags.data)) {
        tagsData = product.tags.data;
      } else if (Array.isArray(product.tags)) {
        tagsData = product.tags.map((tag: any) => ({
          id: String(tag.id || Date.now()),
          attributes: {
            name: tag.name || (tag.attributes && tag.attributes.name) || 'Tag',
            slug: tag.slug || (tag.attributes && tag.attributes.slug) || 'tag'
          }
        }));
      }
    }
  } catch (error) {
    console.error('Error processing tags:', error);
  }
  
  // Build the transformed product
  return {
    id: String(product.id),
    attributes: {
      name: product.name || (product.attributes && product.attributes.name) || 'Unnamed Product',
      slug: product.slug || (product.attributes && product.attributes.slug) || `product-${product.id}`,
      description: formatDescription(product.description || (product.attributes && product.attributes.description) || ''),
      price: Number(product.price) || Number(product.attributes && product.attributes.price) || 0,
      originalPrice: product.originalPrice || (product.attributes && product.attributes.originalPrice),
      inStock: Boolean(product.inStock || (product.attributes && product.attributes.inStock)),
      featured: Boolean(product.featured || (product.attributes && product.attributes.featured)),
      new: Boolean(product.new || (product.attributes && product.attributes.new)),
      sale: Boolean(product.sale || (product.attributes && product.attributes.sale)),
      rating: Number(product.rating) || Number(product.attributes && product.attributes.rating) || 0,
      reviewCount: Number(product.reviewCount) || Number(product.attributes && product.attributes.reviewCount) || 0,
      heliumDeployVariantId: product.heliumDeployVariantId || (product.attributes && product.attributes.heliumDeployVariantId) || '',
      heliumDeployProductUrl: product.heliumDeployProductUrl || (product.attributes && product.attributes.heliumDeployProductUrl),
      dimensions: product.dimensions || (product.attributes && product.attributes.dimensions) || '',
      weight: product.weight || (product.attributes && product.attributes.weight) || '',
      materials: product.materials || (product.attributes && product.attributes.materials) || '',
      batteryLife: product.batteryLife || (product.attributes && product.attributes.batteryLife) || '',
      warranty: product.warranty || (product.attributes && product.attributes.warranty) || '',
      specifications: specifications,
      mainImage: {
        data: {
          attributes: {
            url: mainImageUrl
          }
        }
      },
      additionalImages: {
        data: additionalImagesData
      },
      category: {
        data: {
          id: categoryId,
          attributes: {
            name: categoryName,
            slug: categorySlug
          }
        }
      },
      tags: {
        data: tagsData
      },
      features: { 
        data: processFeatures(product.features) 
      },
      compatibilities: { 
        data: processNamedItems(product.compatibilities) 
      },
      connectivities: { 
        data: processNamedItems(product.connectivities) 
      }
    }
  };
}

export default async function ProductDetailPage({ params }: { params: { slug: string } }) {
  try {
    // Use the slug from params
    const slug = params.slug;
    console.log(`Processing product detail page for slug: ${slug}`);
    
    // Get the product with error handling
    const rawProduct = await getProductBySlug(slug).catch(error => {
      console.error(`Error fetching product with slug ${slug}:`, error);
      return null;
    });
    
    if (!rawProduct) {
      console.log(`No product found for slug: ${slug}`);
      return notFound();
    }
    
    console.log(`Product found with ID: ${rawProduct.id}`);
    
    // Transform the product with better error handling
    const product = transformProductIfNeeded(rawProduct);
    
    // Get the category slug
    let categorySlug = 'category';
    try {
      if (product.attributes.category?.data?.attributes?.slug) {
        categorySlug = product.attributes.category.data.attributes.slug;
      } else if (rawProduct.category?.slug) {
        categorySlug = rawProduct.category.slug;
      }
    } catch (error) {
      console.error('Error extracting category slug:', error);
    }
    
    // Get related products with better error handling
    // Get related products with better error handling
let relatedProducts: ProductType[] = [];
try {
  console.log(`Fetching related products for category: ${categorySlug}`);
  
  // First attempt - try a simple query without complex filters
  const allCategoryProducts = await getProducts().catch(error => {
    console.error('Error fetching all products:', error);
    return [];
  });
  
  // Then manually filter client-side to get related products in the same category
  relatedProducts = allCategoryProducts
    .filter((p: any) => {
      try {
        const pCategorySlug = p.attributes?.category?.data?.attributes?.slug || 
                             (p.category?.data?.attributes?.slug) ||
                             (p.category?.slug);
        
        return pCategorySlug === categorySlug && String(p.id) !== String(product.id);
      } catch (err) {
        console.error('Error filtering product:', err);
        return false;
      }
    })
    .slice(0, 4) // Limit to 4 related products
    .map((item: any) => transformProductIfNeeded(item));
  
  console.log(`Found ${relatedProducts.length} related products`);
} catch (error) {
  console.error('Error processing related products:', error);
}
    
    console.log('Rendering product detail page');
    
    return (
      <>
        <Navbar />
        <Suspense fallback={<Loading />}>
          <ProductDetailClient product={product} relatedProducts={relatedProducts} />
        </Suspense>
      </>
    );
  } catch (error) {
    console.error('Critical error in product detail page:', error);
    
    // Return a basic error page instead of crashing
    return (
      <>
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#07071C] text-white p-4">
          <h1 className="text-3xl font-bold mb-4">Product Temporarily Unavailable</h1>
          <p className="mb-8 text-gray-300">We're having trouble retrieving this product. Please try again soon.</p>
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