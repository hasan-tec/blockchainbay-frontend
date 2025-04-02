import { Skeleton } from "@/components/ui/skeleton"

export default function PrivacyPolicyLoading() {
  return (
    <main className="relative min-h-screen pb-20">
      {/* Enhanced Background elements with more visible gradients and grid */}
      <div className="fixed inset-0 bg-[#07071C] overflow-hidden z-0">
        {/* Main gradient orbs - more visible now */}
        <div className="absolute top-[5%] left-[10%] w-[40rem] h-[40rem] rounded-full bg-gradient-to-r from-[#F7984A]/30 to-transparent opacity-50 blur-[100px]"></div>
        <div className="absolute bottom-[10%] right-[10%] w-[35rem] h-[35rem] rounded-full bg-gradient-to-l from-[#F7984A]/30 to-transparent opacity-50 blur-[100px]"></div>
        <div className="absolute top-[40%] right-[15%] w-[30rem] h-[30rem] rounded-full bg-gradient-to-t from-blue-500/20 to-transparent opacity-40 blur-[100px]"></div>

        {/* Grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] opacity-70"></div>

        {/* Keep the original texture overlay */}
        <div className="absolute inset-0 bg-[url('/placeholder.svg?height=100&width=100')] bg-repeat opacity-[0.015]"></div>
      </div>

      {/* Content container with proper z-index */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        {/* Header Section - Loading State */}
        <div className="mb-12 text-center">
          <Skeleton className="h-8 w-44 mx-auto mb-4 rounded-full bg-white/5" />
          <Skeleton className="h-12 w-80 mx-auto mb-4 rounded-xl bg-white/5" />
          <Skeleton className="h-4 w-full max-w-2xl mx-auto mb-2 rounded bg-white/5" />
          <Skeleton className="h-4 w-5/6 max-w-2xl mx-auto mb-4 rounded bg-white/5" />
          <Skeleton className="h-4 w-32 mx-auto rounded bg-white/5" />
        </div>

        {/* Two-column layout for larger screens */}
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Left column - Table of contents loading state */}
          <div className="lg:w-1/4">
            <div className="p-6 rounded-2xl bg-white/[0.03] backdrop-blur-sm border border-white/10">
              <Skeleton className="h-6 w-32 mb-4 rounded bg-white/5" />
              <div className="space-y-2">
                {[...Array(11)].map((_, i) => (
                  <Skeleton key={i} className="h-8 w-full rounded-lg bg-white/5" />
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-white/5">
                <Skeleton className="h-5 w-36 mb-3 rounded bg-white/5" />
                <Skeleton className="h-4 w-48 rounded bg-white/5" />
              </div>
            </div>
          </div>

          {/* Right column - Privacy Policy content loading state */}
          <div className="lg:w-3/4">
            <div className="space-y-12">
              {[...Array(7)].map((_, sectionIndex) => (
                <div
                  key={sectionIndex}
                  className="p-8 rounded-2xl bg-white/[0.02] backdrop-blur-sm border border-white/10"
                >
                  <Skeleton className="h-8 w-48 mb-6 rounded bg-white/5" />
                  <Skeleton className="h-4 w-full mb-2 rounded bg-white/5" />
                  <Skeleton className="h-4 w-5/6 mb-2 rounded bg-white/5" />
                  <Skeleton className="h-4 w-full mb-6 rounded bg-white/5" />

                  {sectionIndex % 2 === 0 && (
                    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                      {[...Array(4)].map((_, cardIndex) => (
                        <div key={cardIndex} className="p-5 rounded-xl bg-white/[0.03] border border-white/10">
                          <Skeleton className="h-6 w-36 mb-3 rounded bg-white/5" />
                          <Skeleton className="h-3 w-full mb-2 rounded bg-white/5" />
                          <Skeleton className="h-3 w-5/6 mb-2 rounded bg-white/5" />
                          <Skeleton className="h-3 w-4/5 rounded bg-white/5" />
                        </div>
                      ))}
                    </div>
                  )}

                  {sectionIndex % 3 === 0 && (
                    <div className="mt-8">
                      <Skeleton className="h-6 w-40 mb-4 rounded bg-white/5" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-full rounded bg-white/5" />
                        <Skeleton className="h-4 w-5/6 rounded bg-white/5" />
                        <Skeleton className="h-4 w-full rounded bg-white/5" />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

