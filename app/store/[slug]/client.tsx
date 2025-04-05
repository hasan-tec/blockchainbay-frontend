"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import Image from "next/image"
import { type ProductType, getStrapiMediaUrl, RichTextBlock, RichTextChild, getProductReviews } from "../../../lib/storeapi"
import { useCart } from "../../../contexts/CartContext"
import {
  ShoppingCart,
  ChevronRight,
  Minus,
  Plus,
  Check,
  Star,
  Truck,
  Shield,
  RefreshCw,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { useToast } from "@/components/ui/use-toast"
import { Footer } from "@/components/NewsletterFooter"
import Navbar from "@/components/Navbar"
import SimpleToast from '@/components/SimpleToast'

type ProductDetailClientProps = {
  product: ProductType
  relatedProducts: ProductType[]
}

export default function ProductDetailClient({ product, relatedProducts }: ProductDetailClientProps) {
  const { addToCart } = useCart()
  const { toast } = useToast()
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const [scrolled, setScrolled] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [toastVisible, setToastVisible] = useState(false)
  const [toastProduct, setToastProduct] = useState<any>(null)
  const [toastQuantity, setToastQuantity] = useState(0)
  const [reviews, setReviews] = useState<any[]>([])

  // Use a single, reliable useEffect for fetching reviews
  useEffect(() => {
    const fetchReviewsBySlug = async () => {
      if (!product?.attributes?.slug) return;
      
      try {
        // Use the populate=* approach which we know works from your curl command
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:1337'}/api/products?populate=*`);
        const data = await response.json();
        
        // Find the target product by slug
        const targetProduct = data.data.find((p: any) => 
          p.slug === product.attributes.slug || 
          (p.attributes && p.attributes.slug === product.attributes.slug)
        );
        
        if (!targetProduct) {
          console.log("Product not found in complete response");
          setReviews([]);
          return;
        }
        
        // Check where the review data might be located
        if (targetProduct.Review && Array.isArray(targetProduct.Review)) {
          console.log(`Found ${targetProduct.Review.length} reviews in direct product object`);
          setReviews(targetProduct.Review);
        } 
        else if (targetProduct.attributes && targetProduct.attributes.Review && 
                 Array.isArray(targetProduct.attributes.Review)) {
          console.log(`Found ${targetProduct.attributes.Review.length} reviews in attributes`);
          setReviews(targetProduct.attributes.Review);
        }
        else {
          console.log("No reviews found for this product");
          setReviews([]);
        }
      } catch (error) {
        console.error("Error fetching product data:", error);
        setReviews([]);
      }
    };
    
    fetchReviewsBySlug();
  }, [product]);

  

  const productData = product.attributes

  // Extract image URLs
  const mainImageUrl = getStrapiMediaUrl(productData.mainImage.data.attributes.url)
  const additionalImages = productData.additionalImages?.data?.map((img) => getStrapiMediaUrl(img.attributes.url)) || []
  const allImages = [mainImageUrl, ...additionalImages]

  // Extract product details
  const features = productData.features?.data || []
  const specifications = Array.isArray(productData.specifications) ? 
    productData.specifications : 
    (productData.specifications?.data || [])
  const compatibility = productData.compatibilities?.data || []
  const connectivity = productData.connectivities?.data || []

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
    document.documentElement.classList.toggle("dark")
  }

  const incrementQuantity = () => {
    if (quantity < 10) {
      setQuantity(quantity + 1)
    }
  }

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1)
    }
  }

  const handleAddToCart = useCallback(() => {
    try {
      if (!product || !product.id || !productData) return

      // Call addToCart function
      addToCart(product, quantity)
      
      // Set toast data
      setToastProduct(product)
      setToastQuantity(quantity)
      setToastVisible(true)
    } catch (error) {
      console.error("Error adding to cart:", error)
    }
  }, [product, productData, quantity, addToCart])

  const handleRelatedProductAddToCart = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>, relatedProduct: ProductType) => {
      if (!e || !relatedProduct) return

      e.preventDefault()
      e.stopPropagation()

      if (!relatedProduct || !relatedProduct.id || !relatedProduct.attributes) return

      try {
        addToCart(relatedProduct, 1)
        
        // Set toast data
        setToastProduct(relatedProduct)
        setToastQuantity(1)
        setToastVisible(true)
      } catch (error) {
        console.error("Error adding related product to cart:", error)
      }
    },
    [addToCart]
  )

  // Helper function to get plain text content from rich text format
  const getRichTextAsPlainText = (richText: any[]): string => {
    if (!richText || !Array.isArray(richText)) return ""

    return richText
      .map((block) => {
        if (!block.children) return ""
        return block.children.map((child: RichTextChild) => child.text || "").join(" ")
      })
      .join(" ")
  }

  // Helper function to render product description content with proper link support
const renderDescription = (description: string | RichTextBlock[] | undefined) => {
  if (!description) return null;
  
  if (typeof description === "string") {
    // For string descriptions, we need to parse any HTML-like content
    return (
      <div 
        className="text-gray-300 leading-relaxed" 
        dangerouslySetInnerHTML={{ __html: description }}
      />
    );
  }
  
  // Handle rich text blocks format
  if (Array.isArray(description)) {
    return description.map((block, blockIndex) => {
      if (block.type === "paragraph") {
        // Check if paragraph has checkmark emoji
        const text = block.children?.map((child: RichTextChild) => child.text || "").join("") || ""
        if (text.includes("✅")) {
          return (
            <div key={blockIndex} className="flex items-start gap-2 ml-4 my-1">
              <span className="text-green-500 flex-shrink-0">✅</span>
              <span className="text-gray-300">{text.replace("✅", "").trim()}</span>
            </div>
          )
        }
        return (
          <p key={blockIndex} className="text-gray-300 leading-relaxed mb-2">
            {block.children?.map((child: RichTextChild, childIndex: number) => {
              // Handle link nodes in the rich text
              if (child.type === 'link' && child.url) {
                return (
                  <a 
                    key={childIndex}
                    href={child.url} 
                    className={`text-[#F7984A] hover:underline ${child.bold === true ? "font-bold" : ""}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {child.children?.map(c => c.text).join('') || child.text || ''}
                  </a>
                );
              }
              
              // Normal text node
              return (
                <span key={childIndex} className={child.bold === true ? "font-bold" : ""}>
                  {child.text || ""}
                </span>
              );
            })}
          </p>
        )
      } else if (block.type === "heading") {
        return (
          <h4 key={blockIndex} className="font-bold text-lg mt-4 mb-2 text-white">
            {block.children?.map((child: RichTextChild) => child.text || "").join("")}
          </h4>
        )
      } else if (block.type === "list") {
        return (
          <ul key={blockIndex} className="list-disc pl-5 mb-4 text-gray-300">
            {block.children?.map((item: any, itemIndex: number) => (
              <li key={itemIndex}>{item.children?.map((child: any) => child.text || "").join("")}</li>
            ))}
          </ul>
        )
      }
      return null
    });
  }
  
  return null;
}

  // Helper function to determine if specifications is rich text format
  const isRichTextSpecifications = (specs: any): specs is RichTextBlock[] => {
    return Array.isArray(specs) && 
          specs.length > 0 && 
          typeof specs[0] === 'object' && 
          'type' in specs[0] && 
          'children' in specs[0];
  };

  // Helper function to determine if specifications is relation format
  const isRelationSpecifications = (specs: any): specs is { data: Array<{ id: string; attributes: { key: string; value: string } }> } => {
    return specs && 
          typeof specs === 'object' && 
          'data' in specs && 
          Array.isArray(specs.data);
  };

  // Calculate average rating from reviews
  const averageRating = Array.isArray(reviews) && reviews.length > 0 
    ? reviews.reduce((acc, review) => acc + (Number(review.Rating) || 0), 0) / reviews.length 
    : (productData.rating || 0);

  return (
    <div className={cn("min-h-screen bg-[#07071C] text-white", isDarkMode ? "dark" : "")}>
      {/* Enhanced Background elements with more visible gradients and grid */}
      <div className="fixed inset-0 bg-[#07071C] overflow-hidden z-10">
        {/* Main gradient orbs - more visible now */}
        <div className="absolute top-[5%] left-[10%] w-[40rem] h-[40rem] rounded-full bg-gradient-to-r from-[#F7984A]/30 to-transparent opacity-50 blur-[100px]"></div>
        <div className="absolute bottom-[10%] right-[10%] w-[35rem] h-[35rem] rounded-full bg-gradient-to-l from-[#F7984A]/30 to-transparent opacity-50 blur-[100px]"></div>
        <div className="absolute top-[40%] right-[15%] w-[30rem] h-[30rem] rounded-full bg-gradient-to-t from-blue-500/20 to-transparent opacity-40 blur-[100px]"></div>
        {/* Grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] opacity-70"></div>
        {/* Keep the original texture overlay */}
        <div className="absolute inset-0 bg-[url('/placeholder.svg?height=100&width=100')] bg-repeat opacity-[0.015]"></div>
      </div>

      <Navbar />

      {/* Main Content */}
      <main className="pt-32 pb-20 relative z-20">
        <div className="container mx-auto px-4 md:px-6">
          {/* Breadcrumbs */}
          <div className="mb-8">
            <nav className="flex items-center text-sm text-gray-400">
              <Link href="/" className="hover:text-white transition-colors">
                Home
              </Link>
              <ChevronRight className="h-4 w-4 mx-2" />
              <Link href="/store" className="hover:text-white transition-colors">
                Store
              </Link>
              <ChevronRight className="h-4 w-4 mx-2" />
              <Link
                href={`/store?category=${productData.category.data.attributes.slug}`}
                className="hover:text-white transition-colors"
              >
                {productData.category.data.attributes.name}
              </Link>
              <ChevronRight className="h-4 w-4 mx-2" />
              <span className="text-white">{productData.name}</span>
            </nav>
          </div>

          {/* Product Details */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            {/* Product Images */}
            <div className="space-y-4">
              <div className="relative aspect-square bg-[#0D0B26]/80 border-2 border-gray-800/80 rounded-xl overflow-hidden">
                <Image
                  src={allImages[selectedImage] || "/placeholder.svg"}
                  alt={productData.name}
                  fill
                  className="object-contain"
                  priority
                  unoptimized={true}
                  onError={(e) => {
                    // @ts-ignore - TypeScript doesn't recognize currentTarget.src
                    e.currentTarget.src = "/placeholder.svg"
                  }}
                />
                {productData.sale && (
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-red-500 hover:bg-red-600">Sale</Badge>
                  </div>
                )}
                {productData.new && (
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-blue-500 hover:bg-blue-600">New</Badge>
                  </div>
                )}
              </div>

              {/* Thumbnail Images */}
              {allImages.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {allImages.map((image, index) => (
                    <button
                      key={index}
                      className={cn(
                        "relative w-20 h-20 rounded-lg overflow-hidden border-2",
                        selectedImage === index ? "border-[#F7984A]" : "border-gray-800/80 hover:border-gray-700",
                      )}
                      onClick={() => setSelectedImage(index)}
                    >
                      <Image
                        src={image || "/placeholder.svg"}
                        alt={`${productData.name} - Image ${index + 1}`}
                        fill
                        className="object-cover"
                        unoptimized={true}
                        onError={(e) => {
                          // @ts-ignore
                          e.currentTarget.src = "/placeholder.svg"
                        }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-[#0D0B26] border border-[#F7984A]/20 text-[#F7984A] hover:bg-[#0D0B26]/80">
                    {productData.category.data.attributes.name}
                  </Badge>
                  {productData.inStock ? (
                    <Badge className="bg-green-500/20 text-green-400 hover:bg-green-500/30 border-none">In Stock</Badge>
                  ) : (
                    <Badge className="bg-red-500/20 text-red-400 hover:bg-red-500/30 border-none">Out of Stock</Badge>
                  )}
                </div>
                <h1 className="text-3xl md:text-4xl font-bold mb-2">{productData.name}</h1>
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${i < Math.floor(averageRating) ? "text-yellow-400" : "text-gray-600"}`}
                        fill={i < Math.floor(averageRating) ? "currentColor" : "none"}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-400">
                    {averageRating.toFixed(1)} ({Array.isArray(reviews) ? reviews.length : 0} reviews)
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  {productData.originalPrice ? (
                    <div className="flex items-center gap-2">
                      <span className="text-3xl font-bold">${productData.price.toFixed(2)}</span>
                      <span className="text-xl text-gray-400 line-through">
                        ${productData.originalPrice.toFixed(2)}
                      </span>
                      <Badge className="bg-red-500 hover:bg-red-600">
                        Save ${(productData.originalPrice - productData.price).toFixed(2)}
                      </Badge>
                    </div>
                  ) : (
                    <span className="text-3xl font-bold">${productData.price.toFixed(2)}</span>
                  )}
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-4">Product Description</h3>
                  {renderDescription(productData.description)}
                </div>

                {/* Tags */}
                {productData.tags && productData.tags.data.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {productData.tags.data.map((tag) => (
                      <Badge
                        key={tag.id}
                        variant="outline"
                        className="bg-gray-800/50 hover:bg-gray-800 border-gray-700"
                      >
                        {tag.attributes.name}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Add to Cart */}
              <div className="pt-6 border-t border-gray-800/50">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex items-center">
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-l-md rounded-r-none bg-[#111130] hover:bg-[#1A1A40] border-r-0"
                      onClick={decrementQuantity}
                      disabled={quantity <= 1 || !productData.inStock}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <div className="h-10 px-4 flex items-center justify-center border-y bg-[#111130] hover:bg-[#1A1A40] border-gray-700 bg-gray-800/30 w-12">
                      {quantity}
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-r-md rounded-l-none border-l-0 bg-[#111130] hover:bg-[#1A1A40]" 
                      onClick={incrementQuantity}
                      disabled={quantity >= 10 || !productData.inStock}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  <Button
                    className="flex-1 bg-[#F7984A] max-w-40 hover:bg-[#F7984A]/90 text-white"
                    disabled={!productData.inStock}
                    onClick={handleAddToCart}
                  >
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    {productData.inStock ? "Add to Cart" : "Out of Stock"}
                  </Button>
                </div>
              </div>

              {/* Shipping & Returns */}
              <div className="pt-6 border-t border-gray-800/50 space-y-4">
                <div className="flex items-start gap-3">
                  <Truck className="h-5 w-5 text-[#F7984A] mt-0.5" />
                  <div>
                    <h3 className="font-medium">Free Shipping</h3>
                    <p className="text-sm text-gray-400">Free standard shipping on orders over $75</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-[#F7984A] mt-0.5" />
                  <div>
                    <h3 className="font-medium">Secure Payments</h3>
                    <p className="text-sm text-gray-400">All transactions are secure and encrypted</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <RefreshCw className="h-5 w-5 text-[#F7984A] mt-0.5" />
                  <div>
                    <h3 className="font-medium">Easy Returns</h3>
                    <p className="text-sm text-gray-400">30-day money back guarantee</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Product Tabs */}
          <div className="mb-16">
            <Tabs defaultValue="specs" className="w-full">
              <TabsList className="bg-[#0D0B26]/80 border-2 border-gray-800/80 rounded-lg p-1 w-full flex flex-wrap">
                <TabsTrigger
                  value="specs"
                  className="flex-1 data-[state=active]:bg-[#F7984A] data-[state=active]:text-white"
                >
                  Specifications
                </TabsTrigger>
                <TabsTrigger
                  value="reviews"
                  className="flex-1 data-[state=active]:bg-[#F7984A] data-[state=active]:text-white"
                >
                  Reviews ({Array.isArray(reviews) ? reviews.length : 0})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="specs" className="mt-6 bg-[#0D0B26]/80 border-2 border-gray-800/80 rounded-xl p-6">
                <div className="space-y-6">
                  {/* Product Details section */}
                  <div>
                    <h3 className="text-xl font-bold mb-4">Product Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {productData.dimensions && (
                        <div className="flex items-start gap-2">
                          <span className="text-gray-400 min-w-[120px]">Dimensions:</span>
                          <span className="text-white">{productData.dimensions}</span>
                        </div>
                      )}
                      {productData.weight && (
                        <div className="flex items-start gap-2">
                          <span className="text-gray-400 min-w-[120px]">Weight:</span>
                          <span className="text-white">{productData.weight}</span>
                        </div>
                      )}
                      {productData.materials && (
                        <div className="flex items-start gap-2">
                          <span className="text-gray-400 min-w-[120px]">Materials:</span>
                          <span className="text-white">{productData.materials}</span>
                        </div>
                      )}
                      {productData.batteryLife && (
                        <div className="flex items-start gap-2">
                          <span className="text-gray-400 min-w-[120px]">Battery Life:</span>
                          <span className="text-white">{productData.batteryLife}</span>
                        </div>
                      )}
                      {productData.warranty && (
                        <div className="flex items-start gap-2">
                          <span className="text-gray-400 min-w-[120px]">Warranty:</span>
                          <span className="text-white">{productData.warranty}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Features section */}
                  {features.length > 0 && (
                    <div>
                      <h3 className="text-xl font-bold mb-4">Key Features</h3>
                      <ul className="space-y-2">
                        {features.map((feature) => (
                          <li key={feature.id} className="flex items-start gap-2">
                            <Check className="h-5 w-5 text-[#F7984A] mt-0.5 shrink-0" />
                            <span className="text-gray-300">{feature.attributes.text}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Compatibility section */}
                  {compatibility.length > 0 && (
                    <div>
                      <h3 className="text-xl font-bold mb-4">Compatibility</h3>
                      <div className="flex flex-wrap gap-2">
                        {compatibility.map((item, index) => (
                          <Badge key={item.id || index} className="bg-gray-800 hover:bg-gray-700 text-gray-300">
                            {item.attributes?.name || "Unknown"}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Connectivity section */}
                  {connectivity.length > 0 && (
                    <div>
                      <h3 className="text-xl font-bold mb-4">Connectivity</h3>
                      <div className="flex flex-wrap gap-2">
                        {connectivity.map((item, index) => (
                          <Badge key={item.id || index} className="bg-gray-800 hover:bg-gray-700 text-gray-300">
                            {item.attributes?.name || "Unknown"}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Technical Specifications section */}
                  <h3 className="text-xl font-bold mb-4">Technical Specifications</h3>

                  {productData.specifications ? (
                    <>
                      {isRichTextSpecifications(productData.specifications) ? (
                        <div className="space-y-4">
                          {productData.specifications.map((block, blockIndex) => {
                            if (block.type === "paragraph") {
                              const text = block.children
                                ?.map((child: RichTextChild) => child.text || "")
                                .join("") || "";
                              
                              // Special handling for multi-line specifications
                              if (text.includes("\n")) {
                                const lines = text.split("\n").filter(line => line.trim() && !line.includes("Drag"));
                                return (
                                  <div key={`spec-block-${blockIndex}`} className="space-y-2">
                                    {lines.map((line, lineIndex) => {
                                      const keyValueMatch = line.match(/^([^:]+):\s*(.+)$/);
                                      
                                      if (keyValueMatch) {
                                        const [_, key, value] = keyValueMatch;
                                        return (
                                          <div key={`spec-line-${blockIndex}-${lineIndex}`} className="flex py-2 border-b border-gray-800/50 last:border-0">
                                            <span className="text-gray-400 w-1/3">{key.trim()}</span>
                                            <span className="text-white w-2/3">{value.trim()}</span>
                                          </div>
                                        );
                                      }
                                      
                                      // Regular line
                                      return (
                                        <p key={`spec-line-${blockIndex}-${lineIndex}`} className="text-gray-300 py-1">
                                          {line}
                                        </p>
                                      );
                                    })}
                                  </div>
                                );
                              }
                              
                              // Single line paragraph - show only if not empty
                              if (text.trim()) {
                                return (
                                  <p key={`spec-${blockIndex}`} className="text-gray-300 py-2 leading-relaxed">
                                    {block.children?.map((child: RichTextChild, childIndex: number) => (
                                      <span key={`spec-child-${blockIndex}-${childIndex}`} className={child.bold === true ? "font-bold" : ""}>
                                        {child.text || ""}
                                      </span>
                                    ))}
                                  </p>
                                );
                              }
                            }
                            
                            return null;
                          })}
                        </div>
                      ) : isRelationSpecifications(productData.specifications) ? (
                        <div className="space-y-2">
                          {productData.specifications.data.map((spec) => (
                            <div key={spec.id} className="flex py-2 border-b border-gray-800/50 last:border-0">
                              <span className="text-gray-400 w-1/3">{spec.attributes?.key || "Unknown"}</span>
                              <span className="text-white w-2/3">{spec.attributes?.value || ""}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-4">
                          <p className="text-gray-400">
                            Specifications format not recognized.
                          </p>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-gray-400">
                      Additional specification details not available for this product.
                      </p>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="reviews" className="mt-6 bg-[#0D0B26]/80 border-2 border-gray-800/80 rounded-xl p-6">
                <div className="space-y-6">
                  <div className="flex flex-col md:flex-row gap-8">
                    <div className="md:w-1/3 space-y-4">
                      <div className="text-center">
                        <div className="text-5xl font-bold">{averageRating.toFixed(1)}</div>
                        <div className="flex justify-center my-2">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-5 h-5 ${i < Math.floor(averageRating) ? "text-yellow-400" : "text-gray-600"}`}
                              fill={i < Math.floor(averageRating) ? "currentColor" : "none"}
                            />
                          ))}
                        </div>
                        <div className="text-sm text-gray-400">
                          Based on {Array.isArray(reviews) ? reviews.length : 0} reviews
                        </div>
                      </div>

                      <div className="space-y-2">
                        {[5, 4, 3, 2, 1].map((star) => {
                          const count = Array.isArray(reviews) ? reviews.filter((r) => r.Rating === star).length : 0;
                          const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                          return (
                            <div key={star} className="flex items-center gap-2">
                              <div className="flex items-center gap-1 w-12">
                                <span>{star}</span>
                                <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                              </div>
                              <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-yellow-400 rounded-full"
                                  style={{ width: `${percentage}%` }}
                                ></div>
                              </div>
                              <div className="w-12 text-right text-sm text-gray-400">{count}</div>
                            </div>
                          );
                        })}
                      </div>

                      <Button className="w-full bg-[#F7984A] hover:bg-[#F7984A]/90 text-white">Write a Review</Button>
                    </div>

                    <div className="md:w-2/3">
                      <h3 className="text-xl font-bold mb-4">Customer Reviews</h3>
                      {Array.isArray(reviews) && reviews.length > 0 ? (
                        <div className="space-y-6">
                          {reviews.map((review, index) => (
                            <div key={index} className="border-b border-gray-800/50 last:border-0 pb-6 last:pb-0">
                              <div className="flex justify-between items-start mb-2">
                                <div>
                                  <h4 className="font-bold">{review.Title}</h4>
                                  <div className="flex items-center gap-2 mt-1">
                                    <div className="flex">
                                      {Array.from({ length: 5 }).map((_, i) => (
                                        <Star
                                          key={i}
                                          className={`w-4 h-4 ${i < review.Rating ? "text-yellow-400" : "text-gray-600"}`}
                                          fill={i < review.Rating ? "currentColor" : "none"}
                                        />
                                      ))}
                                    </div>
                                    {review.Verified && (
                                      <Badge className="bg-green-500/20 text-green-400 hover:bg-green-500/30 border-none text-xs">
                                        Verified Purchase
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                                <div className="text-sm text-gray-400">{new Date(review.Date).toLocaleDateString()}</div>
                              </div>
                              <div className="text-sm text-gray-300 mb-2">{review.Author}</div>
                              <p className="text-gray-300">{review.Content}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <p className="text-gray-400">No reviews yet. Be the first to review this product!</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="mb-16">
              <h2 className="text-2xl font-bold mb-8">Related Products</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map((relatedProduct) => (
                  <Link key={relatedProduct.id} href={`/store/${relatedProduct.attributes.slug}`}>
                    <Card className="bg-[#0D0B26]/80 border-2 border-gray-800/80 rounded-xl overflow-hidden hover:border-gray-700/60 transition-all duration-300 group h-full flex flex-col shadow-[0_4px_12px_rgba(0,0,0,0.25)]">
                      <div className="relative aspect-square w-full overflow-hidden bg-gray-900">
                        <Image
                          src={
                            getStrapiMediaUrl(relatedProduct.attributes.mainImage.data.attributes.url) ||
                            "/placeholder.svg"
                          }
                          alt={relatedProduct.attributes.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          unoptimized={true}
                          onError={(e) => {
                            // @ts-ignore
                            e.currentTarget.src = "/placeholder.svg"
                          }}
                        />
                        {relatedProduct.attributes.sale && (
                          <div className="absolute top-4 left-4">
                            <Badge className="bg-red-500 hover:bg-red-600">Sale</Badge>
                          </div>
                        )}
                        {relatedProduct.attributes.new && (
                          <div className="absolute top-4 left-4">
                            <Badge className="bg-blue-500 hover:bg-blue-600">New</Badge>
                          </div>
                        )}
                        <div className="absolute top-4 right-4">
                          <Button
                            size="icon"
                            variant="secondary"
                            className="rounded-full w-8 h-8 bg-gray-800/70 border border-gray-700/50"
                            onClick={(e) => handleRelatedProductAddToCart(e, relatedProduct)}
                          >
                            <ShoppingCart className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="p-4 flex-1 flex flex-col">
                        <div className="text-xs text-gray-400 mb-1">
                          {relatedProduct.attributes.category.data?.attributes.name}
                        </div>
                        <h3 className="font-medium text-lg mb-2 group-hover:text-[#F7984A] transition-colors">
                          {relatedProduct.attributes.name}
                        </h3>
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < Math.floor(relatedProduct.attributes.rating) ? "text-yellow-400" : "text-gray-600"
                                }`}
                                fill={i < Math.floor(relatedProduct.attributes.rating) ? "currentColor" : "none"}
                              />
                            ))}
                          </div>
                          <span className="text-xs text-gray-400">({relatedProduct.attributes.reviewCount})</span>
                        </div>
                        <div className="mt-auto flex items-center justify-between">
                          <div>
                            {relatedProduct.attributes.originalPrice ? (
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-white">
                                  ${relatedProduct.attributes.price.toFixed(2)}
                                </span>
                                <span className="text-sm text-gray-400 line-through">
                                  ${relatedProduct.attributes.originalPrice.toFixed(2)}
                                </span>
                              </div>
                            ) : (
                              <span className="font-bold text-white">
                                ${relatedProduct.attributes.price.toFixed(2)}
                              </span>
                            )}
                          </div>
                          {!relatedProduct.attributes.inStock && (
                            <span className="text-xs text-red-400">Out of stock</span>
                          )}
                        </div>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <div className="relative z-20">
        <Footer />
      </div>
      
      {/* Toast notification */}
      {toastVisible && toastProduct && (
        <SimpleToast 
          product={toastProduct} 
          quantity={toastQuantity} 
          onClose={() => setToastVisible(false)}
        />
      )}
    </div>
  )
}