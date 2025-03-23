export default function AdminGiveawaysLoading() {
  return (
    <div className="min-h-screen bg-[#07071C] text-white">
      {/* Admin Header Skeleton */}
      <header className="fixed top-0 left-0 right-0 z-50 py-3 bg-[#07071C]/90 backdrop-blur-md border-b border-gray-800/50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="relative w-10 h-10 bg-gray-800/70 rounded-lg animate-pulse"></div>
              <div className="h-6 w-32 bg-gray-800/70 rounded-md animate-pulse"></div>
            </div>
            <div className="hidden lg:flex items-center space-x-6">
              <div className="h-4 w-20 bg-gray-800/70 rounded-md animate-pulse"></div>
              <div className="h-4 w-20 bg-gray-800/70 rounded-md animate-pulse"></div>
              <div className="h-4 w-20 bg-gray-800/70 rounded-md animate-pulse"></div>
              <div className="h-4 w-20 bg-gray-800/70 rounded-md animate-pulse"></div>
              <div className="h-4 w-20 bg-gray-800/70 rounded-md animate-pulse"></div>
            </div>
            <div className="hidden lg:flex items-center gap-5">
              <div className="h-8 w-8 bg-gray-800/70 rounded-full animate-pulse"></div>
              <div className="h-10 w-48 bg-gray-800/70 rounded-full animate-pulse"></div>
              <div className="h-8 w-8 bg-gray-800/70 rounded-full animate-pulse"></div>
            </div>
            <div className="lg:hidden h-10 w-10 bg-gray-800/70 rounded-md animate-pulse"></div>
          </div>
        </div>
      </header>

      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4 md:px-6">
          {/* Dashboard Title Skeleton */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <div className="h-8 w-40 bg-gray-800/70 rounded-full animate-pulse mb-4"></div>
              <div className="h-10 w-64 bg-gray-800/70 rounded-md animate-pulse"></div>
            </div>
            <div className="h-10 w-40 bg-gray-800/70 rounded-md animate-pulse"></div>
          </div>

          {/* Stats Overview Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-[#0D0B26]/80 border border-gray-800/50 p-6 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <div className="h-5 w-32 bg-gray-800/70 rounded-md animate-pulse"></div>
                  <div className="h-6 w-6 bg-gray-800/70 rounded-full animate-pulse"></div>
                </div>
                <div className="h-8 w-20 bg-gray-800/70 rounded-md animate-pulse"></div>
                <div className="h-4 w-40 bg-gray-800/70 rounded-md animate-pulse mt-4"></div>
              </div>
            ))}
          </div>

          {/* Giveaways Table Skeleton */}
          <div className="bg-[#0D0B26]/80 border border-gray-800/50 mb-8 rounded-lg overflow-hidden">
            <div className="p-6 border-b border-gray-800/50">
              <div className="flex justify-between items-center">
                <div className="h-7 w-40 bg-gray-800/70 rounded-md animate-pulse"></div>
                <div className="flex space-x-3">
                  <div className="h-9 w-24 bg-gray-800/70 rounded-md animate-pulse"></div>
                  <div className="h-9 w-32 bg-gray-800/70 rounded-md animate-pulse"></div>
                </div>
              </div>
            </div>

            <div className="p-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-800/70 rounded-md animate-pulse mb-3"></div>
              ))}
            </div>

            <div className="p-4 border-t border-gray-800/50 flex justify-between items-center">
              <div className="h-5 w-60 bg-gray-800/70 rounded-md animate-pulse"></div>
              <div className="flex space-x-1">
                <div className="h-8 w-20 bg-gray-800/70 rounded-md animate-pulse"></div>
                <div className="h-8 w-10 bg-gray-800/70 rounded-md animate-pulse"></div>
                <div className="h-8 w-20 bg-gray-800/70 rounded-md animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Entries Table Skeleton */}
          <div className="bg-[#0D0B26]/80 border border-gray-800/50 rounded-lg overflow-hidden">
            <div className="p-6 border-b border-gray-800/50">
              <div className="flex justify-between items-center">
                <div className="h-7 w-64 bg-gray-800/70 rounded-md animate-pulse"></div>
                <div className="flex space-x-3">
                  <div className="h-9 w-28 bg-gray-800/70 rounded-md animate-pulse"></div>
                  <div className="h-9 w-28 bg-gray-800/70 rounded-md animate-pulse"></div>
                </div>
              </div>
            </div>

            <div className="p-4">
              {[...Array(7)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-800/70 rounded-md animate-pulse mb-3"></div>
              ))}
            </div>

            <div className="p-4 border-t border-gray-800/50 flex justify-between items-center">
              <div className="h-5 w-60 bg-gray-800/70 rounded-md animate-pulse"></div>
              <div className="flex space-x-1">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-8 w-10 bg-gray-800/70 rounded-md animate-pulse"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer Skeleton */}
      <footer className="border-t border-gray-800/50 pt-20 pb-10">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-10 mb-16">
            <div className="md:col-span-2">
              <div className="h-10 w-40 bg-gray-800/70 rounded-md animate-pulse mb-6"></div>
              <div className="h-20 w-full bg-gray-800/70 rounded-md animate-pulse mb-6"></div>
              <div className="flex gap-4 mb-8">
                <div className="h-10 w-10 bg-gray-800/70 rounded-full animate-pulse"></div>
                <div className="h-10 w-10 bg-gray-800/70 rounded-full animate-pulse"></div>
              </div>
            </div>

            {[...Array(3)].map((_, i) => (
              <div key={i} className="space-y-4">
                <div className="h-6 w-24 bg-gray-800/70 rounded-md animate-pulse"></div>
                <div className="space-y-2">
                  {[...Array(4)].map((_, j) => (
                    <div key={j} className="h-5 w-32 bg-gray-800/70 rounded-md animate-pulse"></div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-800/50 pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="h-5 w-64 bg-gray-800/70 rounded-md animate-pulse"></div>
            <div className="flex gap-6 mt-4 md:mt-0">
              <div className="h-5 w-16 bg-gray-800/70 rounded-md animate-pulse"></div>
              <div className="h-5 w-16 bg-gray-800/70 rounded-md animate-pulse"></div>
              <div className="h-5 w-16 bg-gray-800/70 rounded-md animate-pulse"></div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

