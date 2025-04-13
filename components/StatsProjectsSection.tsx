"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"

// Define TypeScript interfaces for API response
interface LogoFormat {
  name: string
  hash: string
  ext: string
  mime: string
  width: number
  height: number
  size: number
  url: string
}

interface Logo {
  id: number
  url: string
  // Other properties omitted for brevity
}

interface CryptoProject {
  id: number
  title: string
  Slug: string
  ShortDescription: string
  Category: string
  SubCategory: string | null
  CurrentStatus: string
  // Add the featured property from the updated schema
  featured?: boolean
  ChainType?: string
  Logo?: Logo
  // Other properties omitted for brevity
}

interface ApiResponse {
  data: CryptoProject[]
  meta: {
    pagination: {
      page: number
      pageSize: number
      pageCount: number
      total: number
    }
  }
}

// Define TypeScript interfaces for our component props
interface ProjectCardProps {
  name: string;
  category?: string;
  categories?: string[];
  description: string;
  image: string;
  slug: string;
  verified: boolean;
  featured?: boolean; // Add featured prop
  chainType?: string; // Optional chain type
}

export const ProjectCard = ({ 
  name, 
  category, 
  categories, 
  description, 
  image, 
  slug, 
  verified, 
  featured = false,
  chainType
}: ProjectCardProps) => {
  return (
    <Link href={`/directory/${slug}`}>
      <div className="bg-[#0D0B26]/80 border border-gray-800/50 rounded-xl p-6 hover:border-gray-700/60 transition-all duration-300 h-full">
        <div className="flex items-center gap-3 mb-4">
          <div className="relative">
            {/* Square logo with slightly rounded corners */}
            <div className="w-12 h-12 rounded-md overflow-hidden bg-[#0D0B26] border border-purple-500/20">
              <div className="w-full h-full">
                {image ? (
                  <Image
                    src={image}
                    alt={name}
                    width={48}
                    height={48}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 bg-gradient-to-tr from-[#F7984A]/30 to-[#F7984A]/10 flex items-center justify-center text-[#F7984A] font-bold">
                    {name.substring(0, 2)}
                  </div>
                )}
              </div>
            </div>
            {verified && (
              <div className="absolute -bottom-1 -right-1 bg-[#F7984A] rounded-full p-0.5">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            )}
            
            {/* Add featured indicator */}
            {featured && (
              <div className="absolute -top-1 -right-1 bg-yellow-500 rounded-full p-0.5">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M12 2l2.4 7.4h7.6l-6 4.6 2.3 7-6.3-4.6-6.3 4.6 2.3-7-6-4.6h7.6z"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="white"
                  />
                </svg>
              </div>
            )}
          </div>
          <div>
            <h3 className="font-bold text-lg">{name}</h3>
            <div className="mt-1 flex gap-2 flex-wrap">
              {categories ? (
                categories.map((cat: string, idx: number) => (
                  <Badge key={idx} className="bg-gray-800/70 text-gray-300 border-none text-xs">{cat}</Badge>
                ))
              ) : category ? (
                <Badge className="bg-gray-800/70 text-gray-300 border-none text-xs">{category}</Badge>
              ) : null}
              
              {/* Display chain type if available */}
              {chainType && (
                <Badge className="bg-gray-800/70 text-blue-300 border-none text-xs">{chainType}</Badge>
              )}
            </div>
          </div>
        </div>
        <p className="text-gray-300 text-sm line-clamp-3">{description}</p>
      </div>
    </Link>
  )
}

export const ProjectsSection = () => {
  const [projects, setProjects] = useState<CryptoProject[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setIsLoading(true);
        // Replace with your actual API endpoint
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:1337";
        
        // First try to fetch featured projects
        const featuredResponse = await fetch(`${backendUrl}/api/crypto-projects?filters[featured][$eq]=true&populate=Logo`);
        
        if (!featuredResponse.ok) {
          throw new Error("Failed to fetch featured projects");
        }
        
        const featuredData: ApiResponse = await featuredResponse.json();
        
        // If we have enough featured projects, use only those
        if (featuredData.data.length >= 3) {
          setProjects(featuredData.data);
          setIsLoading(false);
          return;
        }
        
        // Otherwise, fetch additional projects to fill the 3 slots
        const remainingCount = 3 - featuredData.data.length;
        const regularResponse = await fetch(`${backendUrl}/api/crypto-projects?filters[featured][$ne]=true&populate=Logo&pagination[limit]=${remainingCount}`);
        
        if (!regularResponse.ok) {
          throw new Error("Failed to fetch regular projects");
        }
        
        const regularData: ApiResponse = await regularResponse.json();
        
        // Combine featured and regular projects
        setProjects([...featuredData.data, ...regularData.data]);
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching projects:", err);
        
        // Fallback to fetching all projects if the featured filtering fails
        try {
          const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:1337";
          const response = await fetch(`${backendUrl}/api/crypto-projects?populate=Logo`);
          
          if (!response.ok) {
            throw new Error("Failed to fetch projects");
          }
          
          const data: ApiResponse = await response.json();
          setProjects(data.data);
        } catch (fallbackErr) {
          setError("Failed to load projects. Please try again later.");
        }
        
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Helper function to get project logo URL
  const getProjectLogo = (project: CryptoProject) => {
    if (project.Logo?.url) {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:1337";
      // If the URL starts with "/", append the backend URL
      return project.Logo.url.startsWith("/") ? `${backendUrl}${project.Logo.url}` : project.Logo.url;
    }
    return "";
  };

  return (
    <section className="py-20 bg-[#07071C]">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-8">
          
          <div>
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-gray-800/70 text-gray-300 text-sm font-medium mb-4">
              <span className="w-2 h-2 rounded-full bg-[#F7984A] mr-2"></span>
              {/* Update the label if we have featured projects */}
              {projects.some(p => p.featured) ? "Featured Projects" : "Trusted Projects & Companies"}
            </div>
            <h2 className="text-4xl font-bold tracking-tight">Crypto Directory</h2>
            <p className="text-gray-400 mt-2">Discover trusted projects and companies shaping the cryptocurrency landscape.</p>
          </div>
          <Link
            href="/directory"
            className="inline-flex items-center text-[#F7984A] hover:text-[#F7984A]/80 mt-4 md:mt-0 group"
          >
            <span>View more</span>
            <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-t-[#F7984A] border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-red-400">{error}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {projects.slice(0, 3).map((project) => (
              <ProjectCard 
                key={project.id}
                name={project.title}
                category={project.Category}
                categories={project.SubCategory ? [project.Category, project.SubCategory] : undefined}
                description={project.ShortDescription}
                image={getProjectLogo(project)}
                slug={project.Slug}
                verified={project.CurrentStatus === "Verified"}
                featured={project.featured}
                chainType={project.ChainType}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default ProjectsSection