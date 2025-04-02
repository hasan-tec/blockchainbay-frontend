import { Skeleton } from "@/components/ui/skeleton"

export default function ContactLoading() {
  return (
    <div className="min-h-screen bg-[#07071C] text-white pt-32 pb-20">
      <div className="container mx-auto px-4 md:px-6">
        {/* Page Header Skeleton */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Skeleton className="h-8 w-48 bg-gray-800/70 mx-auto mb-6" />
          <Skeleton className="h-14 w-full max-w-2xl bg-gray-800/70 mx-auto mb-4" />
          <Skeleton className="h-14 w-full max-w-xl bg-gray-800/70 mx-auto mb-6" />
          <Skeleton className="h-6 w-full max-w-2xl bg-gray-800/70 mx-auto" />
        </div>

        {/* Contact Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-[#0D0B26]/80 border border-gray-800/50 rounded-xl p-8">
              <Skeleton className="w-16 h-16 rounded-full bg-gray-800/70 mx-auto mb-6" />
              <Skeleton className="h-6 w-32 bg-gray-800/70 mx-auto mb-3" />
              <Skeleton className="h-4 w-full bg-gray-800/70 mx-auto mb-2" />
              <Skeleton className="h-4 w-3/4 bg-gray-800/70 mx-auto mb-4" />
              <Skeleton className="h-5 w-40 bg-gray-800/70 mx-auto" />
            </div>
          ))}
        </div>

        {/* Contact Form and Office Locations Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          {/* Contact Form Skeleton */}
          <div className="bg-[#0D0B26]/80 border border-gray-800/50 rounded-xl p-8">
            <Skeleton className="h-8 w-48 bg-gray-800/70 mb-6" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-2">
                <Skeleton className="h-5 w-24 bg-gray-800/70" />
                <Skeleton className="h-10 w-full bg-gray-800/70" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-5 w-32 bg-gray-800/70" />
                <Skeleton className="h-10 w-full bg-gray-800/70" />
              </div>
            </div>
            <div className="space-y-2 mb-6">
              <Skeleton className="h-5 w-20 bg-gray-800/70" />
              <Skeleton className="h-10 w-full bg-gray-800/70" />
            </div>
            <div className="space-y-2 mb-6">
              <Skeleton className="h-5 w-28 bg-gray-800/70" />
              <Skeleton className="h-32 w-full bg-gray-800/70" />
            </div>
            <div className="flex items-center space-x-2 mb-6">
              <Skeleton className="h-5 w-5 bg-gray-800/70" />
              <Skeleton className="h-5 w-64 bg-gray-800/70" />
            </div>
            <Skeleton className="h-12 w-full bg-gray-800/70" />
          </div>

          {/* Office Locations Skeleton */}
          <div>
            <Skeleton className="h-8 w-36 bg-gray-800/70 mb-6" />
            <div className="space-y-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-[#0D0B26]/80 border border-gray-800/50 rounded-xl p-6">
                  <div className="flex items-start gap-4">
                    <Skeleton className="w-12 h-12 rounded-full bg-gray-800/70 flex-shrink-0" />
                    <div className="w-full">
                      <Skeleton className="h-6 w-40 bg-gray-800/70 mb-2" />
                      <Skeleton className="h-4 w-full bg-gray-800/70 mb-1" />
                      <Skeleton className="h-4 w-3/4 bg-gray-800/70 mb-1" />
                      <Skeleton className="h-4 w-1/2 bg-gray-800/70 mb-3" />
                      <Skeleton className="h-4 w-64 bg-gray-800/70 mb-4" />
                      <Skeleton className="h-48 w-full bg-gray-800/70 rounded-lg" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* FAQ Section Skeleton */}
        <div className="text-center mb-12">
          <Skeleton className="h-6 w-48 bg-gray-800/70 mx-auto mb-4" />
          <Skeleton className="h-10 w-full max-w-xl bg-gray-800/70 mx-auto mb-4" />
          <Skeleton className="h-5 w-full max-w-lg bg-gray-800/70 mx-auto" />
        </div>

        <div className="max-w-3xl mx-auto mb-20">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-full bg-gray-800/70 mb-4 rounded-xl" />
          ))}
        </div>

        {/* Social Media Section Skeleton */}
        <div className="bg-gradient-to-r from-[#0D0B26]/80 via-gray-900/80 to-[#0D0B26]/80 border border-gray-800/50 rounded-2xl p-8 md:p-12 text-center">
          <Skeleton className="h-8 w-64 bg-gray-800/70 mx-auto mb-6" />
          <Skeleton className="h-5 w-full max-w-xl bg-gray-800/70 mx-auto mb-8" />
          <div className="flex flex-wrap justify-center gap-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-32 bg-gray-800/70 rounded-full" />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

