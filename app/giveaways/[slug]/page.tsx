// app/giveaways/[slug]/page.tsx
import { fetchGiveawayBySlug, formatGiveawayDetail, fetchRelatedGiveaways } from "@/lib/api"
import { notFound } from "next/navigation"
import GiveawayClient from "./giveaway-client"

export default async function GiveawayPage({ params }: { params: { slug: string } }) {
  try {
    // Server-side data fetching
    const giveawayData = await fetchGiveawayBySlug(params.slug)
    
    if (!giveawayData) {
      return notFound()
    }
    
    const formattedGiveaway = formatGiveawayDetail(giveawayData)
    const relatedGiveaways = await fetchRelatedGiveaways(params.slug)
    
    // Pass data to client component
    return <GiveawayClient giveaway={formattedGiveaway} relatedGiveaways={relatedGiveaways} />
  } catch (error) {
    console.error("Error loading giveaway:", error)
    return <GiveawayClient error="Failed to load giveaway details. Please try again later." />
  }
}