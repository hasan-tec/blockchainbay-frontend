import { Skeleton } from "@/components/ui/skeleton"

export default function GiveawayDetailLoading() {
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

      {/* Main Content */}
      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4 md:px-6">
          {/* Breadcrumb */}
          <div className="text-sm mb-6 flex items-center text-gray-400">
            <Skeleton className="h-4 w-16 bg-gray-800/70" />
            <div className="mx-2">›</div>
            <Skeleton className="h-4 w-24 bg-gray-800/70" />
            <div className="mx-2">›</div>
            <Skeleton className="h-4 w-32 bg-gray-800/70" />
          </div>

          {/* Giveaway Header */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#07071C] via-gray-900 to-[#07071C] border border-gray-800/50 mb-8">
            <div className="relative p-8 md:p-12">
              <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
                <div className="lg:w-1/2">
                  <Skeleton className="h-6 w-24 bg-gray-800/70 mb-4" />
                  <Skeleton className="h-10 w-full max-w-md bg-gray-800/70 mb-4" />
                  <Skeleton className="h-6 w-full max-w-sm bg-gray-800/70 mb-2" />
                  <Skeleton className="h-6 w-full max-w-lg bg-gray-800/70 mb-6" />

                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <Skeleton className="h-20 w-full bg-gray-800/70" />
                    <Skeleton className="h-20 w-full bg-gray-800/70" />
                    <Skeleton className="h-20 w-full bg-gray-800/70" />
                  </div>

                  <Skeleton className="h-14 w-40 bg-gray-800/70" />
                </div>
                <div className="lg:w-1/2">
                  <Skeleton className="aspect-video w-full rounded-xl bg-gray-800/70" />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Details */}
            <div className="lg:col-span-2">
              <div className="mb-8">
                <Skeleton className="h-10 w-full bg-gray-800/70 mb-6" />
                <Skeleton className="h-64 w-full bg-gray-800/70 rounded-xl" />
              </div>

              {/* Share Section */}
              <Skeleton className="h-24 w-full bg-gray-800/70 rounded-xl mb-8" />
            </div>

            {/* Right Column - Entry Form */}
            <div>
              <Skeleton className="h-96 w-full bg-gray-800/70 rounded-xl sticky top-24" />
            </div>
          </div>

          {/* Related Giveaways */}
          <section className="mt-16">
            <Skeleton className="h-10 w-64 bg-gray-800/70 mb-8" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-[#0D0B26]/80 border border-gray-800/50 rounded-xl overflow-hidden h-full flex flex-col"
                >
                  <Skeleton className="aspect-video w-full bg-gray-800/70" />
                  <div className="p-6 flex-1 flex flex-col">
                    <Skeleton className="h-8 w-full max-w-xs bg-gray-800/70 mb-3" />
                    <Skeleton className="h-4 w-full bg-gray-800/70 mb-2" />
                    <Skeleton className="h-4 w-full bg-gray-800/70 mb-2" />
                    <Skeleton className="h-4 w-3/4 bg-gray-800/70 mb-4" />
                    <div className="flex items-center justify-between mt-auto">
                      <Skeleton className="h-4 w-24 bg-gray-800/70" />
                      <Skeleton className="h-8 w-24 bg-gray-800/70" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}

