import { Suspense } from 'react';
import { getProductBySlug, getProducts, ProductType, RichTextBlock } from '../../../lib/storeapi';
import ProductDetailClient from './client';
import Navbar from '../../../components/Navbar';
import { Footer } from '../../../components/NewsletterFooter';
import Loading from './loading';
import { notFound } from 'next/navigation';

export const revalidate = 10; // Revalidate the data at most once per hour

// Interface for your raw product data coming from API
interface RawProduct {
  id: number | string;
  name?: string;
  slug?: string;
  description?: string;
  category?: any;
  [key: string]: any;
}

// Define a proper type for image data
type ImageData = {
  attributes: {
    url: string;
  }
};

// Generate static params for commonly visited products
export async function generateStaticParams() {
  try {
    const products = await getProducts({ filters: { featured: { $eq: true } } });
    
    // Handle different data structures safely
    return products.map((product: ProductType | RawProduct) => {
      // If product has the expected Strapi structure
      if ('attributes' in product && product.attributes?.slug) {
        return { slug: product.attributes.slug };
      }
      
      // If product has a flat structure
      if ('slug' in product && typeof product.slug === 'string') {
        return { slug: product.slug };
      }
      
      // Fallback
      return { slug: 'product' };
    });
  } catch (error) {
    console.error('Error generating static params:', error);
    return []; // Return empty array on error
  }
}

// Function to ensure description formatting is preserved
function formatDescription(description: string | object): string | RichTextBlock[] {
  // If description is already an object (rich text blocks), return it as is
  if (typeof description !== 'string') {
    return description as RichTextBlock[];
  }
  
  if (!description) return '';
  
  // Ensure consistent newlines (replace \r\n with \n)
  let formattedDesc = description.replace(/\r\n/g, '\n');
  
  // Make sure checkmarks are properly displayed
  formattedDesc = formattedDesc.replace(/- /g, '✅ ');
  
  // Ensure section headers have proper spacing
  const sections = ['What it does:', 'What\'s included & requirements:', 'Features:', 'Requirements:'];
  sections.forEach(section => {
    if (formattedDesc.includes(section)) {
      // Add newlines before sections if they don't already have them
      if (!formattedDesc.includes(`\n\n${section}`)) {
        formattedDesc = formattedDesc.replace(section, `\n\n${section}`);
      }
    }
  });
  
  return formattedDesc;
}

// Function to transform raw product data to expected structure if needed
function transformProductIfNeeded(product: any): ProductType {
  // If the product already has the expected structure, return it
  if (product && product.attributes) {
    return product as ProductType;
  }
  
  // Extract the correct image URL
  let mainImageUrl = '/placeholder.png';
  
  if (product.mainImage) {
    // Handle Strapi 5 different image formats
    if (product.mainImage.data && product.mainImage.data.attributes) {
      // Standard Strapi format
      mainImageUrl = product.mainImage.data.attributes.url;
    } else if (product.mainImage.url) {
      // Direct URL from Strapi
      mainImageUrl = product.mainImage.url;
    } else if (product.mainImage.formats && product.mainImage.formats.small) {
      // Formats object directly on mainImage
      mainImageUrl = product.mainImage.formats.small.url;
    } else if (product.mainImage.documentId) {
      // Using documentId (your custom format)
      mainImageUrl = `/uploads/${product.mainImage.documentId}.png`;
    }
  }
  
  // Additional images handling
  const additionalImagesData: ImageData[] = [];
  if (product.additionalImages && Array.isArray(product.additionalImages)) {
    product.additionalImages.forEach((image: any) => {
      let imageUrl = '/placeholder.png';
      
      if (image.url) {
        imageUrl = image.url;
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
  
  console.log('Transforming product:', product.name);
  console.log('Using main image URL:', mainImageUrl);
  
  // Process arrays with proper structure for the client component
  // This ensures all items have both direct properties and nested attributes
  const processFeatures = (features: any[] = []) => {
    if (!Array.isArray(features)) return [];
    return features.map(feature => ({
      id: String(feature.id || '1'),
      attributes: {
        text: feature.text || (feature.attributes && feature.attributes.text) || '',
        ...feature
      }
    }));
  };
  
  const processSpecifications = (specs: any[] = []) => {
    if (!Array.isArray(specs)) return [];
    return specs.map(spec => ({
      id: String(spec.id || '1'),
      attributes: {
        key: spec.key || (spec.attributes && spec.attributes.key) || '',
        value: spec.value || (spec.attributes && spec.attributes.value) || '',
        ...spec
      }
    }));
  };
  
  const processNamedItems = (items: any[] = []) => {
    if (!Array.isArray(items)) return [];
    return items.map(item => ({
      id: String(item.id || '1'),
      attributes: {
        name: item.name || (item.attributes && item.attributes.name) || '',
        ...item
      }
    }));
  };
  
  // Handle specifications in rich text format
  let specificationsRichText = null;
  if (product.specifications) {
    if (typeof product.specifications === 'string') {
      try {
        specificationsRichText = JSON.parse(product.specifications);
      } catch (e) {
        // If it can't be parsed as JSON, create a simple rich text paragraph
        specificationsRichText = [
          {
            type: "paragraph",
            children: [{ type: "text", text: product.specifications }]
          }
        ];
      }
    } else if (Array.isArray(product.specifications)) {
      specificationsRichText = product.specifications;
    }
  }
  
  // Otherwise, transform flat structure to nested structure
  return {
    id: String(product.id),
    attributes: {
      name: product.name || '',
      slug: product.slug || 'product',
      description: formatDescription(product.description || ''),
      price: product.price || 0,
      originalPrice: product.originalPrice,
      inStock: Boolean(product.inStock),
      featured: Boolean(product.featured),
      new: Boolean(product.new),
      sale: Boolean(product.sale),
      rating: product.rating || 0,
      reviewCount: product.reviewCount || 0,
      heliumDeployVariantId: product.heliumDeployVariantId || '',
      heliumDeployProductUrl: product.heliumDeployProductUrl || '',
      dimensions: product.dimensions || '',
      weight: product.weight || '',
      materials: product.materials || '',
      batteryLife: product.batteryLife || '',
      warranty: product.warranty || '',
      specifications: specificationsRichText,
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
          id: String(product.category?.id || '1'),
          attributes: {
            name: product.category?.name || 'Uncategorized',
            slug: product.category?.slug || 'uncategorized'
          }
        }
      },
      tags: {
        data: Array.isArray(product.tags)
          ? product.tags.map((tag: any) => ({
              id: String(tag?.id || '1'),
              attributes: {
                name: tag?.name || 'Tag',
                slug: tag?.slug || 'tag'
              }
            }))
          : []
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
    console.log(`Processing slug: ${slug}`);
    
    // Get the product
    const rawProduct = await getProductBySlug(slug);
    
    if (!rawProduct) {
      console.log(`No product found for slug: ${slug}`);
      return notFound();
    }
      // Log more details to help troubleshoot
      console.log(`Product found with ID: ${rawProduct.id}, name: ${rawProduct.attributes?.name || rawProduct.name}`);
      console.log(`Specifications available: ${rawProduct.attributes?.specifications ? 'Yes' : 'No'}`);
      console.log(`Reviews available: ${rawProduct.attributes?.Review ? 'Yes' : 'No'}`);
      if (rawProduct.attributes?.Review) {
        console.log(`Number of reviews: ${rawProduct.attributes.Review.length}`);
      }
    
    // Transform the product if needed
    const product = transformProductIfNeeded(rawProduct);
    
    // Get the category slug
    let categorySlug = 'category';
    if (product.attributes.category?.data?.attributes?.slug) {
      categorySlug = product.attributes.category.data.attributes.slug;
    } else if (rawProduct.category?.slug) {
      categorySlug = rawProduct.category.slug;
    }
    
    // Get related products
    let relatedProducts: ProductType[] = [];
    try {
      const relatedProductsRaw = await getProducts({
        filters: {
          category: {
            slug: {
              $eq: categorySlug,
            },
          },
          id: {
            $ne: product.id,
          },
        },
        pagination: {
          limit: 4,
        },
      });
      
      relatedProducts = relatedProductsRaw.map(transformProductIfNeeded);
    } catch (error) {
      console.error('Error fetching related products:', error);
    }
    
    return (
      <>
        <Navbar />
        <Suspense fallback={<Loading />}>
          <ProductDetailClient product={product} relatedProducts={relatedProducts} />
        </Suspense>
      </>
    );
  } catch (error) {
    console.error('Error in product detail page:', error);
    return notFound();
  }
}