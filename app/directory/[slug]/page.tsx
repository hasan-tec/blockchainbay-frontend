'use client'

import { useState, useEffect } from "react"
import { useParams } from 'next/navigation'
import { useRouter } from 'next/navigation'
import ProjectDetailClient from './project-detail-client'
import { cn } from "@/lib/utils"

export default function ProjectDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  useEffect(() => {
    async function fetchProject() {
      try {
        setLoading(true)
        
        // Handle slug correctly for TypeScript
        const slug = params.slug
        if (!slug) {
          throw new Error('No slug provided')
        }
        
        // Convert slug to string if it's an array
        const slugValue = Array.isArray(slug) ? slug[0] : slug
        
        // Use environment variable for API URL
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://127.0.0.1:1337'
        const apiUrl = `${backendUrl}/api/crypto-projects`
        
        // Use the Strapi advanced populate syntax
        // This will ensure we get both Logo and Link fields
        const url = `${apiUrl}?filters[Slug]=${encodeURIComponent(slugValue)}&populate=*`
        
        console.log('Client-side fetching from:', url)
        
        const response = await fetch(url)
        if (!response.ok) {
          throw new Error(`API response error with status: ${response.status}`)
        }
        
        const data = await response.json()
        console.log('API response:', data)
        
        if (!data.data || data.data.length === 0) {
          throw new Error('Project not found in API')
        }
        
        setProject(data.data[0])
        setLoading(false)
      } catch (err) {
        console.error('Error fetching project:', err)
        // Handle the error type correctly
        setError(err instanceof Error ? err.message : 'An error occurred')
        setLoading(false)
      }
    }
    
    fetchProject()
  }, [params.slug, router])
  
  if (loading) {
    return (
      <div className="min-h-screen bg-[#07071C] text-white flex items-center justify-center">
        <div className="relative">
          {/* Background blob */}
          <div className="absolute inset-0 bg-[#F7984A]/20 rounded-full blur-[30px] w-32 h-32 -z-10 animate-pulse"></div>
          {/* Spinner */}
          <div className="w-16 h-16 border-4 border-t-[#F7984A] border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
          <div className="text-center mt-6 text-lg font-medium text-gray-300">Loading project...</div>
        </div>
      </div>
    )
  }
  
  if (error || !project) {
    return (
      <div className={cn("min-h-screen bg-[#07071C] text-white")}>
        {/* Background elements */}
        <div className="fixed inset-0 bg-[#07071C] overflow-hidden -z-10">
          <div className="absolute top-0 left-0 w-full h-full opacity-30">
            <div className="absolute top-[10%] left-[5%] w-[30rem] h-[30rem] rounded-full bg-[#F7984A]/5 blur-[8rem]"></div>
            <div className="absolute bottom-[10%] right-[5%] w-[25rem] h-[25rem] rounded-full bg-[#F7984A]/5 blur-[8rem]"></div>
            <div className="absolute top-[40%] right-[15%] w-[20rem] h-[20rem] rounded-full bg-blue-500/5 blur-[8rem]"></div>
          </div>
          <div className="absolute inset-0 bg-[url('/placeholder.svg?height=100&width=100')] bg-repeat opacity-[0.015]"></div>
        </div>

        <div className="flex flex-col items-center justify-center h-screen p-4">
          <div className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center mb-8">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 8V12M12 16H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" 
                stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h1 className="text-4xl font-bold mb-4">Project Not Found</h1>
          <p className="text-xl mb-8 text-gray-300 text-center max-w-xl">{error || "Could not find this project"}</p>
          <button 
            onClick={() => router.push('/directory')}
            className="bg-[#F7984A] text-white px-8 py-3 rounded-full hover:bg-[#F7984A]/90 transition-all shadow-lg shadow-[#F7984A]/20 hover:shadow-[#F7984A]/30 hover:translate-y-[-2px]"
          >
            Back to Projects
          </button>
        </div>
      </div>
    )
  }
  
  return <ProjectDetailClient project={project} />
}