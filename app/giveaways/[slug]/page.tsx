// app/giveaways/[slug]/page.tsx
import { fetchGiveawayBySlug, formatGiveawayDetail, fetchRelatedGiveaways } from "@/lib/api"
import { notFound } from "next/navigation"
import GiveawayClient from "./giveaway-client"

export default async function GiveawayPage({ params }: { params: { slug: string } }) {
  try {
    // Make sure params is properly awaited
    const slug = params?.slug;
    
    if (!slug) {
      return notFound();
    }
    
    // Server-side data fetching
    const giveawayData = await fetchGiveawayBySlug(slug);
    
    if (!giveawayData) {
      return notFound();
    }
    
    // Convert null to undefined to match expected types
    const formattedGiveaway = formatGiveawayDetail(giveawayData) || undefined;
    const relatedGiveaways = await fetchRelatedGiveaways(slug);
    
    // Pass data to client component
    return <GiveawayClient giveaway={formattedGiveaway} relatedGiveaways={relatedGiveaways} />;
  } catch (error) {
    console.error("Error loading giveaway:", error);
    return <GiveawayClient error="Failed to load giveaway details. Please try again later." />;
  }
}