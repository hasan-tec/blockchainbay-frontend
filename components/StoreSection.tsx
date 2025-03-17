import Link from "next/link"
import Image from "next/image"
import { ShoppingCart } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface ProductCardProps {
  name: string;
  price: string;
  category: string;
  image: string;
}

const ProductCard = ({ name, price, category, image }: ProductCardProps) => {
  return (
    <Card className="bg-gray-800/30 border-gray-700/50 backdrop-blur-sm overflow-hidden hover:border-gray-600/50 transition-all duration-300 group">
      <div className="relative aspect-square w-full overflow-hidden bg-gray-900">
        <Image
          src={image || "/placeholder.svg"}
          width={300}
          height={300}
          alt={name}
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-4 right-4">
          <Button
            size="icon"
            variant="secondary"
            className="rounded-full w-8 h-8 bg-gray-800/70 border border-gray-700/50"
          >
            <ShoppingCart className="h-4 w-4 text-white " />
          </Button>
        </div>
      </div>
      <div className="p-4">
        <div className="text-xs text-gray-400 mb-1">{category}</div>
        <h3 className="font-medium text-white text-lg mb-2 group-hover:text-[#F7984A] transition-colors">
          {name}
        </h3>
        <div className="flex items-center justify-between">
          <span className="font-bold text-white">{price}</span>
          <Button size="sm" className="bg-[#F7984A] hover:bg-[#F7984A]/90 text-white">
            Add to Cart
          </Button>
        </div>
      </div>
    </Card>
  )
}

const StoreSection = () => {
  const products: ProductCardProps[] = [
    {
      name: "Ledger Nano X",
      price: "$149.00",
      category: "Hardware Wallet",
      image: "https://images.unsplash.com/photo-1622630998477-20aa696ecb05?q=80&w=2070&auto=format&fit=crop",
    },
    {
      name: "Bitcoin Hoodie",
      price: "$59.99",
      category: "Apparel",
      image: "https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=2070&auto=format&fit=crop",
    },
    {
      name: "Crypto Portfolio Tracker",
      price: "$29.99",
      category: "Software",
      image: "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?q=80&w=2070&auto=format&fit=crop",
    },
    {
      name: "Ethereum Desk Lamp",
      price: "$79.99",
      category: "Home",
      image: "https://images.unsplash.com/photo-1535957998253-26ae1ef29506?q=80&w=2036&auto=format&fit=crop",
    },
  ]

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
            href="#"
            className="inline-flex items-center text-[#F7984A] hover:text-[#F7984A]/80 mt-4 md:mt-0 group"
          >
            <span>Visit store</span>
            <ShoppingCart className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <ProductCard key={index} {...product} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default StoreSection