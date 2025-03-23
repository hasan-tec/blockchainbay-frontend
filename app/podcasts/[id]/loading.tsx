export default function Loading() {
  return (
    <div className="min-h-screen bg-[#07071C] flex items-center justify-center">
      <div className="flex flex-col items-center">
        <div className="relative w-16 h-16 mb-8">
          <div className="absolute inset-0 bg-gradient-to-tr from-[#F7984A] to-[#F7984A]/80 rounded-lg blur-[4px] animate-pulse"></div>
          <div className="absolute inset-1 bg-[#F7984A] rounded-lg flex items-center justify-center">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L20 7V17L12 22L4 17V7L12 2Z" fill="white" />
            </svg>
          </div>
        </div>
        <div className="flex space-x-2">
          <div className="w-3 h-3 rounded-full bg-[#F7984A] animate-bounce" style={{ animationDelay: "0ms" }}></div>
          <div className="w-3 h-3 rounded-full bg-[#F7984A] animate-bounce" style={{ animationDelay: "150ms" }}></div>
          <div className="w-3 h-3 rounded-full bg-[#F7984A] animate-bounce" style={{ animationDelay: "300ms" }}></div>
        </div>
      </div>
    </div>
  )
}

