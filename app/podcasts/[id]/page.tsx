"use client"
import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { useParams, useRouter } from "next/navigation"
import {
  Clock,
  Calendar,
  Play,
  Pause,
  Volume2,
  Volume1,
  VolumeX,
  SkipBack,
  SkipForward,
  Share2,
  Download,
  ChevronRight,
  Loader2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
// Import Navbar and Footer components
import Navbar from "@/components/Navbar"
import { Footer } from "@/components/NewsletterFooter"

interface Podcast {
  id: string
  title: string
  description: string
  thumbnail: string
  audio: string
  date: string
  duration: string
  category: string
  featured?: boolean
}

// Function to fetch podcast by ID
const fetchPodcastById = async (id: string): Promise<Podcast | null> => {
  try {
    const response = await fetch(`/api/podcasts/${id}`)
    if (!response.ok) {
      throw new Error("Failed to fetch podcast")
    }
    return await response.json()
  } catch (error) {
    console.error("Error fetching podcast:", error)
    return null
  }
}

// Function to fetch related podcasts
const fetchRelatedPodcasts = async (currentId: string, category: string): Promise<Podcast[]> => {
  try {
    const response = await fetch("/api/podcasts")
    if (!response.ok) {
      throw new Error("Failed to fetch podcasts")
    }

    const podcasts: Podcast[] = await response.json()

    // Filter podcasts by category and exclude current podcast
    return podcasts
      .filter(
        (podcast) =>
          podcast.id !== currentId && (podcast.category.toLowerCase() === category.toLowerCase() || podcast.featured),
      )
      .slice(0, 3) // Return only 3 related podcasts
  } catch (error) {
    console.error("Error fetching related podcasts:", error)
    return []
  }
}

// Function to get podcast by relative position (prev or next)
const getAdjacentPodcast = async (currentId: string, direction: "prev" | "next"): Promise<string | null> => {
  try {
    const response = await fetch("/api/podcasts")
    if (!response.ok) {
      throw new Error("Failed to fetch podcasts")
    }

    const podcasts: Podcast[] = await response.json()
    const currentIndex = podcasts.findIndex((podcast) => podcast.id === currentId)

    if (currentIndex === -1) return null

    if (direction === "prev" && currentIndex > 0) {
      return podcasts[currentIndex - 1].id
    }

    if (direction === "next" && currentIndex < podcasts.length - 1) {
      return podcasts[currentIndex + 1].id
    }

    return null
  } catch (error) {
    console.error("Error fetching adjacent podcast:", error)
    return null
  }
}

export default function PodcastDetailPage() {
  const params = useParams()
  const router = useRouter()

  // State for podcast data
  const [podcast, setPodcast] = useState<Podcast | null>(null)
  const [relatedPodcasts, setRelatedPodcasts] = useState<Podcast[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // UI state
  const [scrolled, setScrolled] = useState(false)
  const [showShareOptions, setShowShareOptions] = useState(false)

  // Audio player state
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(0.8)
  const [isMuted, setIsMuted] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  // Fetch podcast data
  useEffect(() => {
    const loadPodcast = async () => {
      try {
        setLoading(true)
        const id = params.id as string

        if (!id) {
          router.push("/podcasts")
          return
        }

        const podcastData = await fetchPodcastById(id)

        if (!podcastData) {
          setError("Podcast not found")
          return
        }

        setPodcast(podcastData)

        // Load related podcasts
        const related = await fetchRelatedPodcasts(id, podcastData.category)
        setRelatedPodcasts(related)

        setError(null)
      } catch (err) {
        console.error("Failed to load podcast:", err)
        setError("Failed to load podcast. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    loadPodcast()
  }, [params.id, router])

  useEffect(() => {
    const handleScroll = () => {
      // Only enable scroll effects on larger screens
      if (window.innerWidth >= 768) {
        setScrolled(window.scrollY > 20)
      } else {
        // Force scrolled to false on mobile to prevent animations
        setScrolled(false)
      }
    }

    // Check screen size initially
    handleScroll()

    window.addEventListener("scroll", handleScroll)
    window.addEventListener("resize", handleScroll)

    return () => {
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("resize", handleScroll)
    }
  }, [])

  // Audio player controls
  const togglePlay = () => {
    if (audioRef.current) {
      if (audioRef.current.src && audioRef.current.src !== window.location.href) {
        if (isPlaying) {
          audioRef.current.pause()
        } else {
          // Add a play promise with error handling
          const playPromise = audioRef.current.play()
          if (playPromise !== undefined) {
            playPromise.catch((error) => {
              console.error("Error playing audio:", error)
              // Show a user-friendly error message
              setError("Unable to play this podcast episode. Please try again later.")
            })
          }
        }
        setIsPlaying(!isPlaying)
      } else {
        console.error("No valid audio source available")
        setError("No audio available for this podcast episode.")
      }
    }
  }

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime)
    }
  }

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration)
    }
  }

  const handleSeek = (value: number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value[0]
      setCurrentTime(value[0])
    }
  }

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0]
    setVolume(newVolume)
    if (audioRef.current) {
      audioRef.current.volume = newVolume
    }
    if (newVolume === 0) {
      setIsMuted(true)
    } else if (isMuted) {
      setIsMuted(false)
    }
  }

  const toggleMute = () => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.volume = volume
      } else {
        audioRef.current.volume = 0
      }
      setIsMuted(!isMuted)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`
  }

  // Navigate to previous/next podcast
  const navigateToPodcast = async (direction: "prev" | "next") => {
    if (!podcast) return

    setLoading(true)
    const adjacentId = await getAdjacentPodcast(podcast.id, direction)

    if (adjacentId) {
      router.push(`/podcasts/${adjacentId}`)
    } else {
      // If no adjacent podcast, show a message
      setError(`No ${direction === "prev" ? "previous" : "next"} episode available`)
      setTimeout(() => setError(null), 3000)
      setLoading(false)
    }
  }

  // Skip forward/backward
  const skipForward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.min(audioRef.current.currentTime + 15, audioRef.current.duration || 0)
    }
  }

  const skipBackward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(audioRef.current.currentTime - 15, 0)
    }
  }

  // Download podcast audio
  const downloadPodcast = () => {
    if (!podcast || !podcast.audio) {
      setError("No audio available to download")
      return
    }

    // Create an anchor element and trigger download
    const link = document.createElement("a")
    link.href = podcast.audio
    link.download = `${podcast.title.replace(/\s+/g, "-").toLowerCase()}.mp3`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Share podcast
  const sharePodcast = async () => {
    if (!podcast) return

    const shareData = {
      title: podcast.title,
      text: `Listen to ${podcast.title} on Blockchain Bay Podcasts`,
      url: window.location.href,
    }
    try {
      if (navigator.share) {
        await navigator.share(shareData)
      } else {
        // Fallback to clipboard
        await navigator.clipboard.writeText(window.location.href)
        alert("Link copied to clipboard!")
      }
    } catch (error) {
      console.error("Error sharing:", error)
    }
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-[#07071C] flex items-center justify-center relative z-20">
        {/* Enhanced Background elements with more visible gradients and grid */}
        <div className="fixed inset-0 bg-[#07071C] overflow-hidden z-10">
          {/* Main gradient orbs - more visible now */}
          <div className="absolute top-[5%] left-[10%] w-[40rem] h-[40rem] rounded-full bg-gradient-to-r from-[#F7984A]/30 to-transparent opacity-50 blur-[100px]"></div>
          <div className="absolute bottom-[10%] right-[10%] w-[35rem] h-[35rem] rounded-full bg-gradient-to-l from-[#F7984A]/30 to-transparent opacity-50 blur-[100px]"></div>
          <div className="absolute top-[40%] right-[15%] w-[30rem] h-[30rem] rounded-full bg-gradient-to-t from-blue-500/20 to-transparent opacity-40 blur-[100px]"></div>
          {/* Grid overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] opacity-70"></div>
          {/* Texture overlay */}
          <div className="absolute inset-0 bg-[url('/placeholder.svg?height=100&width=100')] bg-repeat opacity-[0.015]"></div>
        </div>

        <div className="flex flex-col items-center relative z-20">
          <Loader2 className="h-12 w-12 text-[#F7984A] animate-spin mb-8" />
          <p className="text-white text-lg">Loading podcast episode...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error || !podcast) {
    return (
      <div className="min-h-screen bg-[#07071C] flex items-center justify-center relative z-20">
        {/* Enhanced Background elements with more visible gradients and grid */}
        <div className="fixed inset-0 bg-[#07071C] overflow-hidden z-10">
          {/* Main gradient orbs - more visible now */}
          <div className="absolute top-[5%] left-[10%] w-[40rem] h-[40rem] rounded-full bg-gradient-to-r from-[#F7984A]/30 to-transparent opacity-50 blur-[100px]"></div>
          <div className="absolute bottom-[10%] right-[10%] w-[35rem] h-[35rem] rounded-full bg-gradient-to-l from-[#F7984A]/30 to-transparent opacity-50 blur-[100px]"></div>
          <div className="absolute top-[40%] right-[15%] w-[30rem] h-[30rem] rounded-full bg-gradient-to-t from-blue-500/20 to-transparent opacity-40 blur-[100px]"></div>
          {/* Grid overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] opacity-70"></div>
          {/* Texture overlay */}
          <div className="absolute inset-0 bg-[url('/placeholder.svg?height=100&width=100')] bg-repeat opacity-[0.015]"></div>
        </div>

        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-8 max-w-md relative z-20">
          <h2 className="text-xl font-bold text-white mb-4">Error Loading Podcast</h2>
          <p className="text-red-400 mb-6">{error || "Podcast not found"}</p>
          <Button className="bg-[#F7984A] hover:bg-[#F7984A]/90 text-white" onClick={() => router.push("/podcasts")}>
            Return to Podcasts
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#07071C] text-white relative z-20">
      {/* Enhanced Background elements with more visible gradients and grid */}
      <div className="fixed inset-0 bg-[#07071C] overflow-hidden z-10">
        {/* Main gradient orbs - more visible now */}
        <div className="absolute top-[5%] left-[10%] w-[40rem] h-[40rem] rounded-full bg-gradient-to-r from-[#F7984A]/30 to-transparent opacity-50 blur-[100px]"></div>
        <div className="absolute bottom-[10%] right-[10%] w-[35rem] h-[35rem] rounded-full bg-gradient-to-l from-[#F7984A]/30 to-transparent opacity-50 blur-[100px]"></div>
        <div className="absolute top-[40%] right-[15%] w-[30rem] h-[30rem] rounded-full bg-gradient-to-t from-blue-500/20 to-transparent opacity-40 blur-[100px]"></div>
        {/* Grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] opacity-70"></div>
        {/* Texture overlay */}
        <div className="absolute inset-0 bg-[url('/placeholder.svg?height=100&width=100')] bg-repeat opacity-[0.015]"></div>
      </div>

      {/* Navigation */}
      <Navbar />

      {/* Main Content */}
      <main className="pt-32 pb-32 relative z-20">
        <div className="container mx-auto px-4 md:px-6">
          {/* Breadcrumb */}
          <div className="mb-8">
            <div className="flex items-center text-sm text-gray-400">
              <Link href="/" className="hover:text-white transition-colors">
                Home
              </Link>
              <ChevronRight className="h-4 w-4 mx-2" />
              <Link href="/podcasts" className="hover:text-white transition-colors">
                Podcasts
              </Link>
              <ChevronRight className="h-4 w-4 mx-2" />
              <span className="text-white truncate max-w-[200px] sm:max-w-[300px] md:max-w-none">{podcast.title}</span>
            </div>
          </div>

          {/* Audio Player (Sticky on scroll - disabled for mobile) */}
          <div className="md:sticky md:top-20 z-40 mb-8 bg-[#0D0B26]/95 backdrop-blur-md border border-gray-800/50 rounded-xl overflow-hidden shadow-xl">
            <div className="p-3 md:p-6">
              <div className="flex flex-col md:flex-row gap-4 md:gap-6">
                <div className="md:w-1/4 lg:w-1/5 mx-auto md:mx-0" style={{ maxWidth: "180px" }}>
                  <div className="relative aspect-square rounded-lg overflow-hidden">
                    <Image
                      src={podcast.thumbnail || "/placeholder.svg"}
                      alt={podcast.title}
                      width={300}
                      height={300}
                      className="object-cover w-full h-full"
                    />
                  </div>
                </div>
                <div className="flex-1 flex flex-col">
                  <div className="mb-3 md:mb-4">
                    <Badge className="mb-2 bg-[#0D0B26] border border-[#F7984A]/20 text-[#F7984A]">
                      {podcast.category}
                    </Badge>
                    <h1 className="text-xl md:text-3xl font-bold mb-2 line-clamp-2">{podcast.title}</h1>
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {podcast.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {podcast.duration}
                      </span>
                    </div>
                  </div>

                  {/* Enhanced Audio controls */}
                  <div className="space-y-3 md:space-y-4">
                    <audio
                      ref={audioRef}
                      src={podcast?.audio || ""}
                      onError={(e) => {
                        console.error("Audio error:", e)
                        setError("There was a problem loading the audio for this podcast.")
                      }}
                      onTimeUpdate={handleTimeUpdate}
                      onLoadedMetadata={handleLoadedMetadata}
                      onEnded={() => setIsPlaying(false)}
                      className="hidden"
                    />

                    {/* Enhanced progress bar with visual indicators */}
                    <div className="flex items-center gap-2">
                      <div className="relative w-full h-3 bg-gray-800 rounded-full overflow-hidden">
                        {/* Buffered progress (simulated) */}
                        <div
                          className="absolute top-0 left-0 h-full bg-gray-600 rounded-full"
                          style={{ width: `${Math.min((currentTime / duration) * 100 + 20, 100)}%` }}
                        ></div>

                        {/* Actual progress */}
                        <div
                          className="absolute top-0 left-0 h-full bg-[#F7984A] rounded-full"
                          style={{ width: `${(currentTime / duration) * 100}%` }}
                        ></div>

                        {/* Time markers - hide on mobile */}
                        {[0.25, 0.5, 0.75].map((marker) => (
                          <div
                            key={`marker-${marker}`}
                            className="absolute top-1/2 w-0.5 h-1.5 bg-gray-700 -translate-y-1/2 hidden md:block"
                            style={{ left: `${marker * 100}%` }}
                          ></div>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="text-sm text-gray-400 w-full md:w-auto text-center md:text-left">
                        {formatTime(currentTime)} / {formatTime(duration || 0)}
                      </div>

                      <div className="flex items-center gap-2 md:gap-4 mx-auto md:mx-0">
                        <button
                          onClick={skipBackward}
                          className="p-2 rounded-full hover:bg-gray-800/50 transition-colors"
                          aria-label="Skip backward 15 seconds"
                        >
                          <SkipBack className="h-5 w-5" />
                        </button>

                        <button
                          onClick={togglePlay}
                          className="w-12 h-12 rounded-full bg-[#F7984A] flex items-center justify-center hover:bg-[#F7984A]/90 transition-colors"
                          aria-label={isPlaying ? "Pause" : "Play"}
                        >
                          {isPlaying ? (
                            <Pause className="h-6 w-6 text-white" />
                          ) : (
                            <Play className="h-6 w-6 text-white ml-1" />
                          )}
                        </button>

                        <button
                          onClick={skipForward}
                          className="p-2 rounded-full hover:bg-gray-800/50 transition-colors"
                          aria-label="Skip forward 15 seconds"
                        >
                          <SkipForward className="h-5 w-5" />
                        </button>
                      </div>

                      <div className="hidden md:flex items-center gap-2 w-32">
                        <button
                          onClick={toggleMute}
                          className="p-1 rounded-full hover:bg-gray-800/50 transition-colors"
                          aria-label={isMuted ? "Unmute" : "Mute"}
                        >
                          {isMuted ? (
                            <VolumeX className="h-4 w-4 text-gray-400" />
                          ) : volume < 0.5 ? (
                            <Volume1 className="h-4 w-4 text-gray-400" />
                          ) : (
                            <Volume2 className="h-4 w-4 text-gray-400" />
                          )}
                        </button>
                        <Slider
                          value={[isMuted ? 0 : volume]}
                          max={1}
                          step={0.01}
                          onValueChange={handleVolumeChange}
                          className="w-24"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex items-center flex-wrap gap-3 mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2 border-gray-700 bg-black text-gray-300 hover:bg-white hover:text-black"
                      onClick={downloadPodcast}
                    >
                      <Download className="h-4 w-4" />
                      <span className="hidden sm:inline">Download</span>
                    </Button>

                    <div className="relative">
  <Button
    variant="outline"
    size="sm"
    className="gap-2 bg-black text-gray-300 hover:bg-white hover:text-black border-gray-700"
    onClick={() => setShowShareOptions(!showShareOptions)}
  >
    <Share2 className="h-4 w-4" />
    <span className="hidden sm:inline">Share</span>
  </Button>

  {showShareOptions && (
    <div className="absolute bottom-full mb-2 sm:right-0 left-0 sm:left-auto bg-[#0D0B26] border border-gray-800 rounded-lg shadow-xl p-3 z-[9999] w-48">
      <div className="space-y-2">
        {[
          { name: "Twitter", icon: "X" },
          { name: "Facebook", icon: "F" },
          { name: "LinkedIn", icon: "in" },
          { name: "Copy Link", icon: "🔗" },
        ].map((option) => (
          <button
            key={option.name}
            className="flex items-center gap-2 w-full p-2 text-sm text-gray-300 hover:bg-gray-800/50 rounded-md transition-colors"
            onClick={() => {
              if (option.name === "Copy Link") {
                navigator.clipboard.writeText(window.location.href)
                alert("Link copied to clipboard!")
              } else {
                sharePodcast()
              }
              setShowShareOptions(false)
            }}
          >
            <span className="w-6 h-6 flex items-center justify-center bg-gray-800 rounded-full">
              {option.icon}
            </span>
            <span>{option.name}</span>
          </button>
        ))}
      </div>
    </div>
  )}
</div>

                    <Button
                      onClick={() => navigateToPodcast("next")}
                      variant="outline"
                      size="sm"
                      className="gap-2 border-gray-700 bg-black text-gray-300 hover:bg-white hover:text-black ml-auto"
                    >
                      <span className="hidden sm:inline">Next Episode</span>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main content - now with better space utilization */}
            <div className="lg:col-span-2">
              {/* Episode description */}
              <Card className="bg-[#0D0B26]/80 border border-gray-800/50 rounded-xl p-6 mb-8">
                <h2 className="text-xl text-white font-bold mb-4">Episode Description</h2>
                <div className="prose prose-invert max-w-none">
                  <p className="text-gray-300 leading-relaxed">{podcast.description}</p>
                </div>
              </Card>

              {/* Subscribe card - moved from sidebar to main content area */}
              <Card className="bg-[#0D0B26]/80 border-gray-800/50 p-6 rounded-xl mb-8">
                <h3 className="font-bold text-white text-lg mb-4">Subscribe to Podcast</h3>
                <p className="text-gray-300 text-sm mb-6">
                  Never miss an episode. Subscribe to our podcast on your favorite platform.
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {/* Spotify */}
                  <Link
                    href="https://open.spotify.com/show/6FB6i8Yc16Z0XAIu85EMOq?si=98a85f70763c47e0&nd=1&dlsi=ceafe8b78f7f403a"
                    target="_blank"
                    className="flex flex-col items-center gap-3 p-4 rounded-lg bg-gray-800/50 hover:bg-gray-800 transition-colors group"
                  >
                    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[#1ED76020]">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        className="h-6 w-6 group-hover:scale-110 transition-transform duration-300"
                        fill="#1ED760"
                      >
                        <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.6 0 12 0zm5.52 17.28c-.24.36-.66.48-1.02.24-2.82-1.74-6.36-2.1-10.56-1.14-.42.12-.78-.18-.9-.54-.12-.42.18-.78.54-.9 4.56-1.02 8.52-.6 11.64 1.32.42.18.48.66.3 1.02zm1.44-3.3c-.3.42-.84.6-1.26.3-3.24-1.98-8.16-2.58-11.94-1.44-.48.12-.99-.12-1.11-.6-.12-.48.12-.99.6-1.11 4.38-1.32 9.78-.66 13.5 1.62.36.24.54.78.24 1.2l-.03.03zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.3c-.6.18-1.2-.18-1.38-.78-.18-.6.18-1.2.78-1.38 4.26-1.26 11.28-1.02 15.72 1.62.54.3.78 1.02.48 1.56-.3.42-1.02.66-1.56.36z" />
                      </svg>
                    </div>
                    <span className="text-sm text-gray-300">Spotify</span>
                  </Link>

                  {/* Apple Podcast */}
                  <Link
                    href="https://podcasts.apple.com/us/podcast/blockchain-bay/id1643516087"
                    target="_blank"
                    className="flex flex-col items-center gap-3 p-4 rounded-lg bg-gray-800/50 hover:bg-gray-800 transition-colors group"
                  >
                    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[#D56DFB20]">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 32 32"
                        className="h-6 w-6 group-hover:scale-110 transition-transform duration-300"
                        fill="#D56DFB"
                      >
                        <path d="M7.12 0c-3.937-0.011-7.131 3.183-7.12 7.12v17.76c-0.011 3.937 3.183 7.131 7.12 7.12h17.76c3.937 0.011 7.131-3.183 7.12-7.12v-17.76c0.011-3.937-3.183-7.131-7.12-7.12zM15.817 3.421c3.115 0 5.932 1.204 8.079 3.453 1.631 1.693 2.547 3.489 3.016 5.855 0.161 0.787 0.161 2.932 0.009 3.817-0.5 2.817-2.041 5.339-4.317 7.063-0.812 0.615-2.797 1.683-3.115 1.683-0.12 0-0.129-0.12-0.077-0.615 0.099-0.792 0.192-0.953 0.64-1.141 0.713-0.296 1.932-1.167 2.677-1.911 1.301-1.303 2.229-2.932 2.677-4.719 0.281-1.1 0.244-3.543-0.063-4.672-0.969-3.595-3.907-6.385-7.5-7.136-1.041-0.213-2.943-0.213-4 0-3.636 0.751-6.647 3.683-7.563 7.371-0.245 1.004-0.245 3.448 0 4.448 0.609 2.443 2.188 4.681 4.255 6.015 0.407 0.271 0.896 0.547 1.1 0.631 0.447 0.192 0.547 0.355 0.629 1.14 0.052 0.485 0.041 0.62-0.072 0.62-0.073 0-0.62-0.235-1.199-0.511l-0.052-0.041c-3.297-1.62-5.407-4.364-6.177-8.016-0.187-0.943-0.224-3.187-0.036-4.052 0.479-2.323 1.396-4.135 2.921-5.739 2.199-2.319 5.027-3.543 8.172-3.543zM16 7.172c0.541 0.005 1.068 0.052 1.473 0.14 3.715 0.828 6.344 4.543 5.833 8.229-0.203 1.489-0.713 2.709-1.619 3.844-0.448 0.573-1.537 1.532-1.729 1.532-0.032 0-0.063-0.365-0.063-0.803v-0.808l0.552-0.661c2.093-2.505 1.943-6.005-0.339-8.296-0.885-0.896-1.912-1.423-3.235-1.661-0.853-0.161-1.031-0.161-1.927-0.011-1.364 0.219-2.417 0.744-3.355 1.672-2.291 2.271-2.443 5.791-0.348 8.296l0.552 0.661v0.813c0 0.448-0.037 0.807-0.084 0.807-0.036 0-0.349-0.213-0.683-0.479l-0.047-0.016c-1.109-0.885-2.088-2.453-2.495-3.995-0.244-0.932-0.244-2.697 0.011-3.625 0.672-2.505 2.521-4.448 5.079-5.359 0.547-0.193 1.509-0.297 2.416-0.281zM15.823 11.156c0.417 0 0.828 0.084 1.131 0.24 0.645 0.339 1.183 0.989 1.385 1.677 0.62 2.104-1.609 3.948-3.631 3.005h-0.015c-0.953-0.443-1.464-1.276-1.475-2.36 0-0.979 0.541-1.828 1.484-2.328 0.297-0.156 0.709-0.235 1.125-0.235zM15.812 17.464c1.319-0.005 2.271 0.463 2.625 1.291 0.265 0.62 0.167 2.573-0.292 5.735-0.307 2.208-0.479 2.765-0.905 3.141-0.589 0.52-1.417 0.667-2.209 0.385h-0.004c-0.953-0.344-1.157-0.808-1.553-3.527-0.452-3.161-0.552-5.115-0.285-5.735 0.348-0.823 1.296-1.285 2.624-1.291z" />
                      </svg>
                    </div>
                    <span className="text-sm text-gray-300">Apple Podcasts</span>
                  </Link>

                  {/* YouTube */}
                  <Link
                    href="https://www.youtube.com/@chrisbagnell"
                    target="_blank"
                    className="flex flex-col items-center gap-3 p-4 rounded-lg bg-gray-800/50 hover:bg-gray-800 transition-colors group"
                  >
                    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[#FF000020]">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        className="h-6 w-6 group-hover:scale-110 transition-transform duration-300"
                        fill="#FF0000"
                      >
                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                      </svg>
                    </div>
                    <span className="text-sm text-gray-300">YouTube</span>
                  </Link>

                  {/* Amazon Music */}
                  <Link
                    href="https://music.amazon.com/podcasts"
                    target="_blank"
                    className="flex flex-col items-center gap-3 p-4 rounded-lg bg-gray-800/50 hover:bg-gray-800 transition-colors group"
                  >
                    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[#00A8E120]">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 50 50"
                        className="h-6 w-6 group-hover:scale-110 transition-transform duration-300"
                        fill="#00A8E1"
                      >
                        <path d="M36,5H14c-4.971,0-9,4.029-9,9v22c0,4.971,4.029,9,9,9h22c4.971,0,9-4.029,9-9V14C45,9.029,40.971,5,36,5z M38.768,33.932c-2.214,1.57-4.688,2.605-7.285,3.277c-2.595,0.663-5.297,0.914-7.986,0.729c-2.688-0.18-5.313-0.836-7.787-1.794	c-2.466-0.99-4.797-2.263-6.857-3.931c-0.107-0.087-0.124-0.245-0.037-0.352c0.077-0.095,0.209-0.119,0.313-0.063l0.014,0.008	c2.249,1.217,4.653,2.149,7.067,2.889c2.433,0.692,4.909,1.187,7.4,1.288c2.485,0.087,4.997-0.107,7.449-0.617	c2.442-0.504,4.905-1.236,7.17-2.279l0.039-0.018c0.251-0.115,0.547-0.006,0.663,0.245C39.035,33.537,38.961,33.796,38.768,33.932z M39.882,36.892c-0.278,0.21-0.556,0.14-0.417-0.21c0.417-1.12,1.32-3.501,0.903-4.061c-0.486-0.63-2.987-0.28-4.098-0.14	c-0.347,0-0.347-0.28-0.069-0.49c0.972-0.7,2.292-0.98,3.404-0.98c1.111,0,2.084,0.21,2.292,0.56	C42.243,31.99,41.757,35.281,39.882,36.892z" />
                      </svg>
                    </div>
                    <span className="text-sm text-gray-300">Amazon Music</span>
                  </Link>
                </div>
              </Card>
            </div>

            {/* Sidebar - now with adjusted content */}
            <div className="space-y-8">
              {/* Related episodes */}
              <Card className="bg-[#0D0B26]/80 border border-gray-800/50 rounded-xl p-6">
                <h2 className="text-xl text-white font-bold mb-4">Related Episodes</h2>
                <div className="space-y-4">
                  {relatedPodcasts.map((relatedPodcast) => (
                    <Link key={relatedPodcast.id} href={`/podcasts/${relatedPodcast.id}`} className="flex gap-3 group">
                      <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src={relatedPodcast.thumbnail || "/placeholder.svg"}
                          alt={relatedPodcast.title}
                          width={80}
                          height={80}
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-sm text-white group-hover:text-[#F7984A] transition-colors line-clamp-2">
                          {relatedPodcast.title}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-gray-400">{relatedPodcast.date}</span>
                          <span className="text-xs text-gray-400">•</span>
                          <span className="text-xs text-gray-400">{relatedPodcast.duration}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
                <Link href="/podcasts">
                  <Button
                    variant="outline"
                    className="w-full mt-4 border-gray-700 bg-black text-gray-300 hover:bg-white hover:text-black"
                  >
                    View All Episodes
                  </Button>
                </Link>
              </Card>

              {/* Tags */}
              <Card className="bg-[#0D0B26]/80 border border-gray-800/50 rounded-xl p-6">
                <h3 className="font-bold text-white text-lg mb-4">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {Array.from(
                    new Set([
                      podcast.category,
                      "Blockchain",
                      "Crypto",
                      "Technology",
                      "Web3",
                      "Finance",
                      "Innovation",
                      "DeFi",
                    ]),
                  ).map((tag, index) => (
                    <Badge
                      key={`tag-${index}-${tag}`}
                      variant="outline"
                      className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white hover:border-gray-600 cursor-pointer"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer className="relative z-20" />

      {/* Custom scrollbar styles */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #1a1a2e;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #3a3a5a;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #4a4a6a;
        }
      `}</style>
    </div>
  )
}

