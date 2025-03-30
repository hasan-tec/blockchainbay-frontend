import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ShoppingCart } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useCart } from "@/contexts/CartContext"
import { getStrapiMediaUrl, ProductType, RichTextBlock } from "@/lib/storeapi"

// Fallback products using the correct ProductType from storeapi
const fallbackProducts: ProductType[] = [
  {
    id: "fallback-1",
    attributes: {
      name: "Ledger Nano X",
      price: 149.00,
      slug: "ledger-nano-x",
      description: "Hardware wallet for secure crypto storage",
      inStock: true,
      featured: true,
      new: false,
      sale: false,
      rating: 5,
      reviewCount: 0,
      heliumDeployVariantId: "",
      category: {
        data: {
          id: "hw-wallet",
          attributes: {
            name: "Hardware Wallet",
            slug: "hardware-wallet"
          }
        }
      },
      mainImage: {
        data: {
          attributes: {
            url: "/placeholder.svg"
          }
        }
      }
    }
  },
];

interface ProductCardProps {
  product: ProductType;
  onAddToCart: (product: ProductType) => void;
}

// Define a helper interface for raw API data
interface RawProductData {
  id: string | number;
  name?: string;
  price?: number;
  slug?: string;
  category?: any;
  mainImage?: any;
  url?: string;
  attributes?: any;
  [key: string]: any;
}

const ProductCard = ({ product, onAddToCart }: ProductCardProps) => {
  // Ensure we handle cases where product or attributes might be undefined
  if (!product || !product.attributes) {
    console.log("Skipping product rendering - invalid product data");
    return null;
  }

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    onAddToCart(product);
  };

  // Ensure all the required attributes exist before using them
  const productName = product.attributes.name || "Unnamed Product";
  const productPrice = product.attributes.price || 0;
  const productSlug = product.attributes.slug || "";
  const categoryName = product.attributes.category?.data?.attributes?.name || "Uncategorized";
  
  // Get the correct image URL with proper fallback handling
  const imageUrl = product.attributes.mainImage?.data?.attributes?.url 
    ? getStrapiMediaUrl(product.attributes.mainImage.data.attributes.url) 
    : "/placeholder.svg";

  return (
    <div className="h-full">
      <Card className="bg-gray-800/30 border-gray-700/50 backdrop-blur-sm overflow-hidden hover:border-gray-600/50 transition-all duration-300 group h-full flex flex-col">
        <div className="relative aspect-square w-full overflow-hidden bg-gray-900">
          <Link href={productSlug ? `/store/${productSlug}` : "/store"}>
            <div className="relative w-full h-full">
              <img 
                src={imageUrl} 
                alt={productName}
                className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                onError={(e) => {
                  console.error(`Image error for product ${productName}: using fallback image`);
                  // Use type assertion to handle the TypeScript error
                  const imgElement = e.target as HTMLImageElement;
                  imgElement.onerror = null; // Prevent infinite loop
                  imgElement.src = "/placeholder.svg";
                }}
              />
            </div>
          </Link>
          <div className="absolute top-4 right-4">
            <Button
              size="icon"
              variant="secondary"
              className="rounded-full w-8 h-8 bg-gray-800/70 border border-gray-700/50"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="h-4 w-4 text-white" />
            </Button>
          </div>
        </div>
        <div className="p-4 flex-1 flex flex-col">
          <div className="text-xs text-gray-400 mb-1">
            {categoryName}
          </div>
          <Link href={productSlug ? `/store/${productSlug}` : "/store"} className="block">
            <h3 className="font-medium text-white text-lg mb-2 group-hover:text-[#F7984A] transition-colors">
              {productName}
            </h3>
          </Link>
          <div className="mt-auto flex items-center justify-between">
            <span className="font-bold text-white">${productPrice.toFixed(2)}</span>
            <Button 
              size="sm" 
              className="bg-[#F7984A] hover:bg-[#F7984A]/90 text-white"
              onClick={handleAddToCart}
            >
              Add to Cart
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

const StoreSection = () => {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      // Determine API URL from environment variables with fallbacks
      const apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 
                    (typeof window !== 'undefined' && window.location.hostname === 'localhost' 
                      ? 'http://localhost:1337' 
                      : 'http://127.0.0.1:1337');
      
      console.log("Fetching featured products from:", apiUrl);
      
      try {
        // Use a simpler query to avoid potential issues
        const response = await fetch(`${apiUrl}/api/products?populate=*`);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error(`API request failed with status: ${response.status}`, errorText);
          throw new Error(`Failed to fetch products: ${response.status} - ${errorText}`);
        }
        
        const data = await response.json();
        
        if (data && data.data && Array.isArray(data.data)) {
          console.log(`Successfully loaded ${data.data.length} products from API`);
          
          // Process each product in the data array
          const processedProducts: ProductType[] = data.data.map((item: RawProductData) => {
            const productId = String(item.id);
            
            // Check if the item is already in the expected format or needs transformation
            if (item.attributes && item.attributes.name) {
              // Already has attributes, but make sure it has all required fields
              const attributes = item.attributes;
              
              // Set any missing required attributes with default values
              if (!attributes.description) attributes.description = "";
              if (attributes.inStock === undefined) attributes.inStock = true;
              if (attributes.featured === undefined) attributes.featured = false;
              if (attributes.new === undefined) attributes.new = false;
              if (attributes.sale === undefined) attributes.sale = false;
              if (attributes.rating === undefined) attributes.rating = 5;
              if (attributes.reviewCount === undefined) attributes.reviewCount = 0;
              if (!attributes.heliumDeployVariantId) attributes.heliumDeployVariantId = "";
              
              // Try to find image in the original item structure if it's missing
              if (!attributes.mainImage?.data) {
                const imageUrl = extractImageUrl(item);
                if (imageUrl) {
                  attributes.mainImage = {
                    data: {
                      attributes: {
                        url: imageUrl
                      }
                    }
                  };
                }
              }
              
              // Return with correct ID type and ensure all attributes
              return {
                ...item,
                id: productId, 
                attributes
              } as ProductType;
            }
            
            // Extract product data regardless of structure
            const productName = item.name || "Unnamed Product";
            const productPrice = item.price || 0;
            const productSlug = item.slug || `product-${productId}`;
            const categoryName = 
              (item.category?.data?.attributes?.name) || 
              (item.category?.name) || 
              "Uncategorized";
            
            // Extract image URL from different possible structures
            const imageUrl = extractImageUrl(item);
            
            // Create a processed product with all required fields
            return {
              id: productId,
              attributes: {
                name: productName,
                price: productPrice,
                slug: productSlug,
                description: "", // Required field
                inStock: true,
                featured: false,
                new: false,
                sale: false,
                rating: 5,
                reviewCount: 0,
                heliumDeployVariantId: "",
                category: {
                  data: {
                    id: "default",
                    attributes: {
                      name: categoryName,
                      slug: categoryName.toLowerCase().replace(/\s+/g, '-')
                    }
                  }
                },
                mainImage: {
                  data: {
                    attributes: {
                      url: imageUrl
                    }
                  }
                }
              }
            } as ProductType;
          });
          
          console.log("Processed products:", processedProducts.map((p) => p.attributes.name));
          setProducts(processedProducts);
        } else {
          console.log("Invalid API response format, using fallback data");
          setProducts(fallbackProducts);
        }
      } catch (error) {
        console.error("Error processing products:", error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        setError(errorMessage);
        setProducts(fallbackProducts);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Helper function to extract image URL from different possible structures
  const extractImageUrl = (item: RawProductData): string => {
    // Check all possible image paths in the object
    if (item.mainImage?.url) {
      return item.mainImage.url;
    } else if (item.mainImage?.data?.attributes?.url) {
      return item.mainImage.data.attributes.url;
    } else if (item.attributes?.mainImage?.data?.attributes?.url) {
      return item.attributes.mainImage.data.attributes.url;
    } else if (item.url) {
      return item.url;
    } else {
      // Try to find any property containing "url" as a fallback
      for (const key in item) {
        if (key.toLowerCase().includes('image') && typeof item[key] === 'object') {
          if (item[key]?.url) return item[key].url;
          if (item[key]?.data?.attributes?.url) return item[key].data.attributes.url;
        }
      }
      return "/placeholder.svg";
    }
  };

  const handleAddToCart = (product: ProductType) => {
    if (product && product.id) {
      console.log("Adding to cart:", product.attributes?.name);
      addToCart(product, 1);
    } else {
      console.error("Attempted to add invalid product to cart");
    }
  };

  return (
    <section className="py-20 bg-gradient-to-b from-transparent to-gray-900/30">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
          <div>
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-gray-800/70 text-gray-300 text-sm font-medium mb-4">
              <span className="w-2 h-2 rounded-full bg-blue-500 mr-2"></span>
              Crypto merchandise
            </div>
            <h2 className="text-4xl font-bold mb-2 tracking-tight">Featured Products</h2>
            <p className="text-gray-400 max-w-2xl">
              Exclusive crypto merchandise, hardware wallets, and accessories for enthusiasts.
            </p>
          </div>
          <Link
            href="/store"
            className="inline-flex items-center text-[#F7984A] hover:text-[#F7984A]/80 mt-4 md:mt-0 group"
          >
            <span>Visit store</span>
            <ShoppingCart className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-center text-red-400">
            Error loading products: {error}
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 min-h-[300px] place-items-center">
            <div className="col-span-full text-center text-gray-400">Loading products...</div>
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 min-h-[300px] place-items-center">
            <div className="col-span-full text-center text-gray-400">
              No featured products available.
              <Link href="/store" className="block mt-2 text-[#F7984A] hover:underline">
                Browse all products
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default StoreSection;