"use client"

import { cn } from "@/lib/utils"

// Import components
import Navbar from "@/components/Navbar"
import BackgroundEffects from "@/components/BackgroundElements"
import HeroSection from "@/components/HeroSection"
import { ProjectsSection } from "@/components/StatsProjectsSection"
import NewsSection from "@/components/NewsSection"
import PodcastSection from "@/components/PodcastSection"
import StoreSection from "@/components/StoreSection"

import { NewsletterSection, Footer } from "@/components/NewsletterFooter"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#07071C] text-white">
      {/* Background elements */}
      <BackgroundEffects />

      {/* Navigation */}
      <Navbar />

      {/* Hero Section */}
      <HeroSection />

      {/* Latest Verified Projects Section */}
      <ProjectsSection />

      {/* Latest News Section */}
      <NewsSection />

      {/* Podcast Section */}
      <PodcastSection />

      {/* Store Section */}
      <StoreSection />

      {/* Giveaway Section */}
   

  

      {/* Footer */}
      <Footer />
    </div>
  )
}
