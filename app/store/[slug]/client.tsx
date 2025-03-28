"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import Image from "next/image"
import { type ProductType, getStrapiMediaUrl } from "../../../lib/storeapi"
import { useCart } from "../../../contexts/CartContext"
import {
  ShoppingCart,
  ChevronRight,
  Minus,
  Plus,
  Heart,
  Share2,
  Check,
  Star,
  Truck,
  Shield,
  RefreshCw,
  Info,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { useToast } from "@/components/ui/use-toast"
import { Footer } from "@/components/NewsletterFooter"
import Navbar from "@/components/Navbar"

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const productData = product.attributes

  // Extract image URLs
  const mainImageUrl = getStrapiMediaUrl(productData.mainImage.data.attributes.url)
  const additionalImages = productData.additionalImages?.data?.map((img) => getStrapiMediaUrl(img.attributes.url)) || []
  const allImages = [mainImageUrl, ...additionalImages]

  // Extract product details
  const features = productData.features?.data || []
  const specifications = productData.specifications?.data || []
  const compatibility = productData.compatibilities?.data || []
  const connectivity = productData.connectivities?.data || []

  // Reviews are mocked for now - would come from API in a real implementation
  const reviews = [
    {
      id: 1,
      productId: product.id,
      author: "Alex Thompson",
      rating: 5,
      date: "2023-11-15",
      title: "Great product",
      content:
        "I've been using this for a month now and it's excellent. The quality is top-notch and it works exactly as advertised.",
      verified: true,
    },
    {
      id: 2,
      productId: product.id,
      author: "Sarah Chen",
      rating: 4,
      date: "2023-10-22",
      title: "Good but could be better",
      content:
        "Overall happy with my purchase. The product is well-made but I had some minor issues with setup. Customer service was helpful though.",
      verified: true,
    },
  ]

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

  // Fixed handleAddToCart function with useCallback
  const handleAddToCart = useCallback(() => {
    // Check if product has the expected structure for the cart
    try {
      if (!product || !product.id || !productData) {
        console.error("Invalid product data:", product)
        toast({
          title: "Error",
          description: "Could not add product to cart. Invalid product data.",
          duration: 3000,
        })
        return
      }

      // Log what we're adding to cart
      console.log("Adding to cart:", {
        productId: product.id,
        name: productData.name,
        quantity: quantity,
      })

      // Call addToCart function
      addToCart(product, quantity)

      toast({
        title: "Added to cart",
        description: `${quantity} x ${productData.name} added to your cart.`,
        duration: 3000,
      })
    } catch (error) {
      console.error("Error adding to cart:", error)
      toast({
        title: "Error",
        description: "An error occurred while adding to cart.",
        duration: 3000,
      })
    }
  }, [product, productData, quantity, addToCart, toast])

  // Fixed function with proper type annotations and useCallback
  const handleRelatedProductAddToCart = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>, relatedProduct: ProductType) => {
      if (!e || !relatedProduct) return

      // Both of these are important to stop event propagation
      e.preventDefault()
      e.stopPropagation()

      // Check if product is valid
      if (!relatedProduct || !relatedProduct.id || !relatedProduct.attributes) {
        console.error("Invalid related product data")
        return
      }

      try {
        // Call addToCart function
        addToCart(relatedProduct, 1)

        toast({
          title: "Added to cart",
          description: `${relatedProduct.attributes.name} added to your cart.`,
          duration: 3000,
        })
      } catch (error) {
        console.error("Error adding related product to cart:", error)
        toast({
          title: "Error",
          description: "An error occurred while adding to cart.",
          duration: 3000,
        })
      }
    },
    [addToCart, toast],
  )

  // Helper function to get plain text content from rich text format
  const getRichTextAsPlainText = (richText: any[]): string => {
    if (!richText || !Array.isArray(richText)) return ""

    return richText
      .map((block) => {
        if (!block.children) return ""
        return block.children.map((child: any) => child.text || "").join(" ")
      })
      .join(" ")
  }

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
                  layout="fill"
                  objectFit="contain"
                  className="object-contain w-full h-full"
                  priority
                  unoptimized={true}
                  onError={(e) => {
                    console.error("Image failed to load:", allImages[selectedImage])
                    // @ts-ignore - TypeScript doesn't recognize currentTarget.src
                    e.currentTarget.src = "/placeholder.png"
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
                        layout="fill"
                        objectFit="cover"
                        className="object-cover w-full h-full"
                        unoptimized={true}
                        onError={(e) => {
                          console.error("Thumbnail failed to load:", image)
                          // @ts-ignore
                          e.currentTarget.src = "/placeholder.png"
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
                        className={`w-5 h-5 ${i < Math.floor(productData.rating) ? "text-yellow-400" : "text-gray-600"}`}
                        fill={i < Math.floor(productData.rating) ? "currentColor" : "none"}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-400">
                    {productData.rating} ({productData.reviewCount} reviews)
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
                  {typeof productData.description === "string"
                    ? // Handle string description format
                      productData.description
                        .split("\n")
                        .map((paragraph: string, index: number) => {
                          // Check if this is a section header (ends with :)
                          if (paragraph.trim().endsWith(":")) {
                            return (
                              <h4 key={index} className="font-bold text-lg mt-4 mb-2 text-white">
                                {paragraph.trim()}
                              </h4>
                            )
                          }

                          // Check if line contains a checkmark
                          else if (paragraph.includes("✅")) {
                            return (
                              <div key={index} className="flex items-start gap-2 ml-4 my-1">
                                <span className="text-green-500 flex-shrink-0">✅</span>
                                <span className="text-gray-300">{paragraph.replace("✅", "").trim()}</span>
                              </div>
                            )
                          }

                          // Regular paragraph
                          else if (paragraph.trim()) {
                            return (
                              <p key={index} className="text-gray-300 leading-relaxed mb-2">
                                {paragraph.trim()}
                              </p>
                            )
                          }

                          // Empty line - add some spacing
                          return <div key={index} className="h-2"></div>
                        })
                    : // Handle rich text blocks format
                      Array.isArray(productData.description) &&
                      productData.description.map((block, blockIndex) => {
                        if (block.type === "paragraph") {
                          // Check if paragraph has checkmark emoji
                          const text = block.children?.map((child) => child.text || "").join("") || ""
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
                              {block.children?.map((child, childIndex) => (
                                <span key={childIndex} className={child.bold === true ? "font-bold" : ""}>
                                  {child.text || ""}
                                </span>
                              ))}
                            </p>
                          )
                        } else if (block.type === "heading") {
                          return (
                            <h4 key={blockIndex} className="font-bold text-lg mt-4 mb-2 text-white">
                              {block.children?.map((child) => child.text || "").join("")}
                            </h4>
                          )
                        } else if (block.type === "list") {
                          return (
                            <ul key={blockIndex} className="list-disc pl-5 mb-4 text-gray-300">
                              {block.children?.map((item, itemIndex) => (
                                <li key={itemIndex}>{item.children?.map((child) => child.text || "").join("")}</li>
                              ))}
                            </ul>
                          )
                        }
                        return null
                      })}
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
                      className="rounded-l-md rounded-r-none bg-[#111130] hover:bg-[#1A1A40]  border-r-0"
                      onClick={decrementQuantity}
                      disabled={quantity <= 1 || !productData.inStock}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <div className="h-10 px-4 flex items-center justify-center border-y bg-[#111130] hover:bg-[#1A1A40]  border-gray-700 bg-gray-800/30 w-12">
                      {quantity}
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-r-md rounded-l-none border-l-0 bg-[#111130] hover:bg-[#1A1A40] " 
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
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="bg-[#0D0B26]/80 border-2 border-gray-800/80 rounded-lg p-1 w-full flex flex-wrap">
                <TabsTrigger
                  value="details"
                  className="flex-1 data-[state=active]:bg-[#F7984A] data-[state=active]:text-white"
                >
                  Details
                </TabsTrigger>
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
                  Reviews ({reviews.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="mt-6 bg-[#0D0B26]/80 border-2 border-gray-800/80 rounded-xl p-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold mb-4">Product Description</h3>
                    {typeof productData.description === "string"
                      ? // Handle legacy string description format
                        productData.description
                          .split("\n")
                          .map((paragraph: string, index: number) => {
                            // Check if this is a section header (ends with :)
                            if (paragraph.trim().endsWith(":")) {
                              return (
                                <h4 key={index} className="font-bold text-lg mt-4 mb-2 text-white">
                                  {paragraph.trim()}
                                </h4>
                              )
                            }

                            // Check if line contains a checkmark
                            else if (paragraph.includes("✅")) {
                              return (
                                <div key={index} className="flex items-start gap-2 ml-4 my-1">
                                  <span className="text-green-500 flex-shrink-0">✅</span>
                                  <span className="text-gray-300">{paragraph.replace("✅", "").trim()}</span>
                                </div>
                              )
                            }

                            // Regular paragraph
                            else if (paragraph.trim()) {
                              return (
                                <p key={index} className="text-gray-300 leading-relaxed mb-2">
                                  {paragraph.trim()}
                                </p>
                              )
                            }

                            // Empty line - add some spacing
                            return <div key={index} className="h-2"></div>
                          })
                      : // Handle rich text blocks format
                        Array.isArray(productData.description) &&
                        productData.description.map((block, blockIndex) => {
                          if (block.type === "paragraph") {
                            // Check if paragraph has checkmark emoji
                            const text = block.children?.map((child) => child.text || "").join("") || ""
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
                                {block.children?.map((child, childIndex) => (
                                  <span key={childIndex} className={child.bold === true ? "font-bold" : ""}>
                                    {child.text || ""}
                                  </span>
                                ))}
                              </p>
                            )
                          } else if (block.type === "heading") {
                            return (
                              <h4 key={blockIndex} className="font-bold text-lg mt-4 mb-2 text-white">
                                {block.children?.map((child) => child.text || "").join("")}
                              </h4>
                            )
                          } else if (block.type === "list") {
                            return (
                              <ul key={blockIndex} className="list-disc pl-5 mb-4 text-gray-300">
                                {block.children?.map((item, itemIndex) => (
                                  <li key={itemIndex}>{item.children?.map((child) => child.text || "").join("")}</li>
                                ))}
                              </ul>
                            )
                          }
                          return null
                        })}
                  </div>
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
                </div>
              </TabsContent>

              <TabsContent value="specs" className="mt-6 bg-[#0D0B26]/80 border-2 border-gray-800/80 rounded-xl p-6">
                {specifications.length > 0 ? (
                  <div className="space-y-6">
                    <h3 className="text-xl font-bold mb-4">Technical Specifications</h3>
                    <div className="space-y-2">
                      {specifications.map((spec) => (
                        <div key={spec.id} className="flex py-2 border-b border-gray-800/50 last:border-0">
                          <span className="text-gray-400 w-1/3">{spec.attributes?.key || "Unknown"}</span>
                          <span className="text-white w-2/3">{spec.attributes?.value || ""}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Info className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                    <h3 className="text-xl font-medium mb-2">No specifications available</h3>
                    <p className="text-gray-400">
                      Detailed specifications for this product are not available at this time.
                    </p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="reviews" className="mt-6 bg-[#0D0B26]/80 border-2 border-gray-800/80 rounded-xl p-6">
                <div className="space-y-6">
                  <div className="flex flex-col md:flex-row gap-8">
                    <div className="md:w-1/3 space-y-4">
                      <div className="text-center">
                        <div className="text-5xl font-bold">{productData.rating}</div>
                        <div className="flex justify-center my-2">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-5 h-5 ${i < Math.floor(productData.rating) ? "text-yellow-400" : "text-gray-600"}`}
                              fill={i < Math.floor(productData.rating) ? "currentColor" : "none"}
                            />
                          ))}
                        </div>
                        <div className="text-sm text-gray-400">Based on {productData.reviewCount} reviews</div>
                      </div>

                      <div className="space-y-2">
                        {[5, 4, 3, 2, 1].map((star) => {
                          const count = reviews.filter((r) => r.rating === star).length
                          const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0
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
                          )
                        })}
                      </div>

                      <Button className="w-full bg-[#F7984A] hover:bg-[#F7984A]/90 text-white">Write a Review</Button>
                    </div>

                    <div className="md:w-2/3">
                      <h3 className="text-xl font-bold mb-4">Customer Reviews</h3>
                      {reviews.length > 0 ? (
                        <div className="space-y-6">
                          {reviews.map((review) => (
                            <div key={review.id} className="border-b border-gray-800/50 last:border-0 pb-6 last:pb-0">
                              <div className="flex justify-between items-start mb-2">
                                <div>
                                  <h4 className="font-bold">{review.title}</h4>
                                  <div className="flex items-center gap-2 mt-1">
                                    <div className="flex">
                                      {Array.from({ length: 5 }).map((_, i) => (
                                        <Star
                                          key={i}
                                          className={`w-4 h-4 ${i < review.rating ? "text-yellow-400" : "text-gray-600"}`}
                                          fill={i < review.rating ? "currentColor" : "none"}
                                        />
                                      ))}
                                    </div>
                                    {review.verified && (
                                      <Badge className="bg-green-500/20 text-green-400 hover:bg-green-500/30 border-none text-xs">
                                        Verified Purchase
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                                <div className="text-sm text-gray-400">{review.date}</div>
                              </div>
                              <div className="text-sm text-gray-300 mb-2">{review.author}</div>
                              <p className="text-gray-300">{review.content}</p>
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
                            "/placeholder.svg" ||
                            "/placeholder.svg"
                          }
                          alt={relatedProduct.attributes.name}
                          layout="fill"
                          objectFit="cover"
                          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                          unoptimized={true}
                          onError={(e) => {
                            console.error(
                              "Related product image failed to load:",
                              relatedProduct.attributes.mainImage.data.attributes.url,
                            )
                            // @ts-ignore
                            e.currentTarget.src = "/placeholder.png"
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
    </div>
  )
}

