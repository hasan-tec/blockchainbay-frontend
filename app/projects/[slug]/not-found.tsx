import Link from 'next/link'
import { Button } from "@/components/ui/button"
import Navbar from "@/components/Navbar"

export default function ProjectNotFound() {
  return (
    <div className="min-h-screen bg-[#07071C] text-white">
      {/* Background elements */}
      <div className="fixed inset-0 bg-[#07071C] overflow-hidden -z-10">
        <div className="absolute top-0 left-0 w-full h-full opacity-30">
          <div className="absolute top-[10%] left-[5%] w-[30rem] h-[30rem] rounded-full bg-[#F7984A]/5 blur-[8rem]"></div>
          <div className="absolute bottom-[10%] right-[5%] w-[25rem] h-[25rem] rounded-full bg-[#F7984A]/5 blur-[8rem]"></div>
          <div className="absolute top-[40%] right-[15%] w-[20rem] h-[20rem] rounded-full bg-blue-500/5 blur-[8rem]"></div>
        </div>
      </div>

      <Navbar />

      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center justify-center text-center">
            <h1 className="text-5xl font-bold mb-6 font-sans tracking-tight">Project Not Found</h1>
            <p className="text-xl text-gray-300 max-w-md mb-8 font-sans">
              We couldn't find the project you're looking for. It may have been removed or doesn't exist.
            </p>
            <Link href="/projects">
              <Button className="bg-[#F7984A] hover:bg-[#F7984A]/90 text-white px-6 py-3 rounded-lg font-sans">
                Back to Projects
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}