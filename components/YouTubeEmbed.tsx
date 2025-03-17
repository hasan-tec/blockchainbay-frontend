// components/YouTubeEmbed.tsx
import { useState, useEffect } from "react";
import Image from "next/image";

const YouTubeEmbed = ({ url, title }) => {
  const [hasError, setHasError] = useState(false);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  
  // Helper function to extract YouTube video ID from various URL formats
  const getYoutubeId = (url) => {
    if (!url) return null;
    
    // Handle different YouTube URL formats
    const regExp = /^.*(youtu.be\/|v\/|e\/|u\/\w+\/|embed\/|v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    
    return (match && match[2].length === 11) ? match[2] : null;
  };
  
  const videoId = getYoutubeId(url);
  
  // Track loading state
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!iframeLoaded) {
        setHasError(true);
      }
    }, 5000); // Set a timeout to detect loading issues
    
    return () => clearTimeout(timeout);
  }, [iframeLoaded]);
  
  if (!videoId) {
    return (
      <div className="rounded-xl overflow-hidden aspect-video bg-black/20 border border-gray-800/50 flex items-center justify-center text-gray-400">
        Invalid YouTube URL
      </div>
    );
  }
  
  return (
    <div className="rounded-xl overflow-hidden aspect-video bg-black/20 border border-gray-800/50 relative">
      {!hasError ? (
        <iframe
          width="100%"
          height="100%"
          src={`https://www.youtube.com/embed/${videoId}?rel=0`}
          title={title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="aspect-video"
          onLoad={() => setIframeLoaded(true)}
          onError={() => setHasError(true)}
        ></iframe>
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
          <div className="bg-[#0D0B26] p-4 rounded-lg max-w-lg">
            <div className="text-red-400 mb-2">⚠️ Video playback error</div>
            <h4 className="text-white font-medium mb-2">{title}</h4>
            <p className="text-gray-400 text-sm mb-4">
              The video couldn't be loaded. This may be due to an ad blocker or network restrictions.
            </p>
            <a 
              href={url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block px-4 py-2 bg-[#F7984A] hover:bg-[#F7984A]/90 text-white rounded-full text-sm"
            >
              Watch on YouTube
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default YouTubeEmbed;