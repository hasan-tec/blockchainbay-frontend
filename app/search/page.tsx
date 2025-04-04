// app/search/page.tsx
'use client'

import dynamic from 'next/dynamic'

// Dynamically import the search results component
// This helps with code splitting and faster initial page load
const SearchResultsPage = dynamic(() => import('@/components/SearchResultsPage'), {
  loading: () => (
    <div className="min-h-screen bg-[#07071C] flex items-center justify-center">
      <div className="flex flex-col items-center">
        <div className="relative w-16 h-16 mb-8">
          <div className="absolute inset-0 bg-gradient-to-tr from-[#F7984A] to-[#F7984A]/80 rounded-lg blur-[4px] animate-pulse"></div>
          <div className="absolute inset-1 bg-[#0D0B26] rounded-lg flex items-center justify-center">
            <svg
              className="w-8 h-8 text-[#F7984A] animate-spin"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </div>
        </div>
        <p className="text-gray-300">Loading search results...</p>
      </div>
    </div>
  ),
})

export default function SearchPage() {
  return <SearchResultsPage />
}