// app/giveaways/page.tsx
"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Search, Gift, ArrowRight, Clock, Calendar, Users } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

// Import our components
import Navbar from "@/components/Navbar"
import {Footer} from "@/components/NewsletterFooter"

// Import API utilities
import { fetchGiveaways, formatGiveawayData, FormattedGiveaway } from "@/lib/api"

export default function GiveawaysPage() {
  const [scrolled, setScrolled] = useState(false)
  const [giveaways, setGiveaways] = useState<FormattedGiveaway[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Fetch giveaway data when component mounts
  useEffect(() => {
    async function loadGiveaways() {
      try {
        setLoading(true)
        const data = await fetchGiveaways()
        const formattedData = formatGiveawayData(data)
        setGiveaways(formattedData)
        setError(null)
      } catch (err) {
        console.error("Failed to load giveaways:", err)
        setError("Failed to load giveaways. Please try again later.")
      } finally {
        setLoading(false)
      }
    }
    
    loadGiveaways()
  }, [])

  // Filter giveaways
  const activeGiveaways = giveaways.filter(giveaway => giveaway.status === 'active')
  const upcomingGiveaways = giveaways.filter(giveaway => giveaway.status === 'upcoming')
  
  // Get the featured giveaway (first active one)
  const featuredGiveaway = activeGiveaways.length > 0 ? activeGiveaways[0] : null

  return (
    <div className="min-h-screen bg-[#07071C] text-white">
      {/* Background elements */}
      <div className="fixed inset-0 bg-[#07071C] overflow-hidden -z-10">
        <div className="absolute top-0 left-0 w-full h-full opacity-30">
          <div className="absolute top-[10%] left-[5%] w-[30rem] h-[30rem] rounded-full bg-[#F7984A]/5 blur-[8rem]"></div>
          <div className="absolute bottom-[10%] right-[5%] w-[25rem] h-[25rem] rounded-full bg-[#F7984A]/5 blur-[8rem]"></div>
          <div className="absolute top-[40%] right-[15%] w-[20rem] h-[20rem] rounded-full bg-blue-500/5 blur-[8rem]"></div>
        </div>
        <div className="absolute inset-0 bg-[url('/placeholder.svg?height=100&width=100')] bg-repeat opacity-[0.015]"></div>
      </div>

      {/* Navigation */}
      <Navbar  />

      {/* Main Content */}
      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4 md:px-6">
          {/* Header */}
          <div className="max-w-4xl mx-auto text-center mb-16">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white text-sm font-medium mb-6 backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-[#F7984A] mr-2 animate-pulse"></span>
              Exclusive Opportunities
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold mb-6 text-white leading-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-white/70">
              Win Amazing <span className="text-[#F7984A]">Crypto</span> Prizes
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Enter our exclusive giveaways for a chance to win hardware wallets, NFTs, crypto assets, and more. New giveaways added regularly!
            </p>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-16">
              <div className="inline-block w-12 h-12 border-4 border-[#F7984A] border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-lg text-gray-300">Loading giveaways...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="max-w-xl mx-auto text-center py-16">
              <div className="bg-red-500/10 p-6 rounded-xl border border-red-500/20 mb-6">
                <p className="text-red-400">{error}</p>
              </div>
              <Button 
                onClick={() => window.location.reload()}
                className="bg-[#F7984A] hover:bg-[#F7984A]/90 text-white"
              >
                Try Again
              </Button>
            </div>
          )}

          {/* Content when data is loaded */}
          {!loading && !error && (
            <>
              {/* Empty State */}
              {giveaways.length === 0 && (
                <div className="text-center py-16">
                  <Gift className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold mb-2">No Giveaways Found</h2>
                  <p className="text-gray-400 mb-8 max-w-md mx-auto">
                    There are currently no active or upcoming giveaways. Check back soon for new opportunities!
                  </p>
                </div>
              )}

              {/* Featured Giveaway */}
              {featuredGiveaway && (
                <div className="mb-16">
                  <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#07071C] via-gray-900 to-[#07071C] border border-gray-800/50">
                    <div className="absolute inset-0 overflow-hidden">
                      <div className="absolute top-0 left-[10%] w-[30rem] h-[30rem] rounded-full bg-[#F7984A]/5 blur-[10rem] -z-10"></div>
                      <div className="absolute bottom-0 right-[10%] w-[25rem] h-[25rem] rounded-full bg-purple-500/5 blur-[10rem] -z-10"></div>
                    </div>

                    <div className="relative p-8 md:p-12">
                      <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
                        <div className="lg:w-1/2">
                          <Badge className="bg-[#F7984A] hover:bg-[#F7984A]/90 mb-4">FEATURED GIVEAWAY</Badge>
                          <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight text-white">
                            {featuredGiveaway.title}
                          </h2>
                          <p className="text-lg text-gray-300 mb-6">
                            {featuredGiveaway.description}
                          </p>
                          
                          <div className="grid grid-cols-3 gap-4 mb-6">
                            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-3 text-center">
                              <Clock className="h-5 w-5 mx-auto mb-2 text-[#F7984A]" />
                              <span className="text-sm text-gray-300">{featuredGiveaway.daysLeft} days left</span>
                            </div>
                            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-3 text-center">
                              <Calendar className="h-5 w-5 mx-auto mb-2 text-[#F7984A]" />
                              <span className="text-sm text-gray-300">Ends {featuredGiveaway.endDate}</span>
                            </div>
                            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-3 text-center">
                              <Users className="h-5 w-5 mx-auto mb-2 text-[#F7984A]" />
                              <span className="text-sm text-gray-300">{featuredGiveaway.entries} entries</span>
                            </div>
                          </div>
                          
                          <Button 
                            className="bg-[#F7984A] hover:bg-[#F7984A]/90 text-white px-8 py-6 text-lg rounded-md shadow-lg shadow-[#F7984A]/20 transition-all duration-300"
                            asChild
                          >
                            <Link href={`/giveaways/${featuredGiveaway.slug}`}>
                              <span>Enter Now</span>
                              <ArrowRight className="ml-2 h-5 w-5" />
                            </Link>
                          </Button>
                        </div>
                        <div className="lg:w-1/2">
                          <div className="relative rounded-xl overflow-hidden">
                            <Image 
                              src={featuredGiveaway.image || "/placeholder.svg"}
                              alt={featuredGiveaway.title} 
                              width={600} 
                              height={400}
                              className="w-full h-auto object-cover rounded-xl"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                            <div className="absolute bottom-4 left-4 right-4">
                              <div className="flex items-center justify-between">
                                <Badge className="bg-green-500 hover:bg-green-600">ACTIVE</Badge>
                                <span className="text-sm bg-black/50 px-3 py-1 rounded-full">Value: ${featuredGiveaway.value}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Active Giveaways */}
              {activeGiveaways.length > 0 && (
                <section className="mb-16">
                  <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-8">
                    <div>
                      <div className="inline-flex items-center px-3 py-1 rounded-full bg-gray-800/70 text-gray-300 text-sm font-medium mb-4">
                        <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                        Enter now
                      </div>
                      <h2 className="text-4xl font-bold mb-2 tracking-tight">Active Giveaways</h2>
                      <p className="text-gray-400 max-w-2xl">
                        These giveaways are currently open for entries. Don't miss your chance to win!
                      </p>
                    </div>
                    {upcomingGiveaways.length > 0 && (
                      <Link
                        href="#upcoming"
                        className="inline-flex items-center text-[#F7984A] hover:text-[#F7984A]/80 mt-4 md:mt-0 group"
                      >
                        <span>View upcoming</span>
                        <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </Link>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {activeGiveaways
                      .filter(giveaway => giveaway.id !== featuredGiveaway?.id)
                      .map((giveaway) => (
                        <Link key={giveaway.id} href={`/giveaways/${giveaway.slug}`}>
                          <Card className="bg-[#0D0B26]/80 border border-gray-800/50 rounded-xl overflow-hidden hover:border-gray-700/60 transition-all duration-300 group h-full flex flex-col">
                            <div className="relative aspect-video w-full overflow-hidden">
                              <Image
                                src={giveaway.image || "/placeholder.svg"}
                                alt={giveaway.title}
                                width={600}
                                height={300}
                                className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                              <div className="absolute top-4 left-4">
                                <Badge className="bg-green-500 hover:bg-green-600">ACTIVE</Badge>
                              </div>
                              <div className="absolute bottom-4 left-4 right-4">
                                <div className="flex items-center justify-between">
                                  <span className="text-sm bg-black/50 px-2 py-1 rounded-full flex items-center">
                                    <Clock className="h-3 w-3 mr-1" />
                                    {giveaway.daysLeft} days left
                                  </span>
                                  <span className="text-sm bg-black/50 px-2 py-1 rounded-full flex items-center">
                                    <Users className="h-3 w-3 mr-1" />
                                    {giveaway.entries} entries
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="p-6 flex-1 flex flex-col">
                              <h3 className="font-bold text-xl mb-3 group-hover:text-[#F7984A] transition-colors line-clamp-2">
                                {giveaway.title}
                              </h3>
                              <p className="text-gray-300 text-sm mb-4 line-clamp-3 flex-1">{giveaway.description}</p>
                              <div className="flex items-center justify-between mt-auto">
                                <span className="text-sm text-gray-400">Ends: {giveaway.endDate}</span>
                                <Button variant="ghost" size="sm" className="text-[#F7984A] hover:text-[#F7984A]/90 hover:bg-gray-800 p-0 h-auto">
                                  Enter now <ArrowRight className="ml-1 h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </Card>
                        </Link>
                    ))}
                  </div>
                </section>
              )}

              {/* Upcoming Giveaways */}
              {upcomingGiveaways.length > 0 && (
                <section id="upcoming" className="mb-16">
                  <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-8">
                    <div>
                      <div className="inline-flex items-center px-3 py-1 rounded-full bg-gray-800/70 text-gray-300 text-sm font-medium mb-4">
                        <span className="w-2 h-2 rounded-full bg-yellow-500 mr-2"></span>
                        Coming soon
                      </div>
                      <h2 className="text-4xl font-bold mb-2 tracking-tight">Upcoming Giveaways</h2>
                      <p className="text-gray-400 max-w-2xl">
                        These giveaways will be opening soon. Set a reminder to be the first to enter!
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {upcomingGiveaways.map((giveaway) => (
                      <Card key={giveaway.id} className="bg-[#0D0B26]/80 border border-gray-800/50 rounded-xl overflow-hidden transition-all duration-300 group h-full flex flex-col">
                        <div className="relative aspect-video w-full overflow-hidden">
                          <div className="absolute inset-0 bg-black/40 z-10"></div>
                          <Image
                            src={giveaway.image || "/placeholder.svg"}
                            alt={giveaway.title}
                            width={600}
                            height={300}
                            className="object-cover w-full h-full filter grayscale"
                          />
                          <div className="absolute top-4 left-4 z-20">
                            <Badge className="bg-yellow-500 hover:bg-yellow-600">COMING SOON</Badge>
                          </div>
                          <div className="absolute bottom-4 left-4 right-4 z-20">
                            <div className="flex items-center justify-between">
                              <span className="text-sm bg-black/50 px-2 py-1 rounded-full flex items-center">
                                <Calendar className="h-3 w-3 mr-1" />
                                Starts: {giveaway.startDate}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="p-6 flex-1 flex flex-col">
                          <h3 className="font-bold text-xl mb-3 transition-colors line-clamp-2">
                            {giveaway.title}
                          </h3>
                          <p className="text-gray-300 text-sm mb-4 line-clamp-3 flex-1">{giveaway.description}</p>
                          <div className="flex items-center justify-between mt-auto">
                            <span className="text-sm text-gray-400">Opens: {giveaway.startDate}</span>
                            <Button variant="outline" size="sm" className="text-gray-400 border-gray-700 hover:bg-gray-800">
                              Set Reminder
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </section>
              )}
            </>
          )}

          {/* How It Works */}
          <section className="mt-16">
            <h2 className="text-3xl font-bold mb-8 text-center">How Our Giveaways Work</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-[#0D0B26]/80 border border-gray-800/50 rounded-xl p-6 text-center">
                <div className="w-16 h-16 bg-[#F7984A]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-[#F7984A] text-2xl font-bold">1</span>
                </div>
                <h3 className="text-xl font-bold mb-3">Enter the Giveaway</h3>
                <p className="text-gray-300">
                  Fill out the entry form with your details. Some giveaways offer additional entry methods through social media.
                </p>
              </div>
              <div className="bg-[#0D0B26]/80 border border-gray-800/50 rounded-xl p-6 text-center">
                <div className="w-16 h-16 bg-[#F7984A]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-[#F7984A] text-2xl font-bold">2</span>
                </div>
                <h3 className="text-xl font-bold mb-3">Wait for the Draw</h3>
                <p className="text-gray-300">
                  Winners are randomly selected after the giveaway end date. All entries have an equal chance of winning.
                </p>
              </div>
              <div className="bg-[#0D0B26]/80 border border-gray-800/50 rounded-xl p-6 text-center">
                <div className="w-16 h-16 bg-[#F7984A]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-[#F7984A] text-2xl font-bold">3</span>
                </div>
                <h3 className="text-xl font-bold mb-3">Claim Your Prize</h3>
                <p className="text-gray-300">
                  Winners are notified via email and have 14 days to claim their prize. Make sure to check your inbox!
                </p>
              </div>
            </div>
          </section>

          {/* FAQ Section */}
          <section className="mt-16">
            <h2 className="text-3xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-[#0D0B26]/80 border border-gray-800/50 rounded-xl p-6">
                <h3 className="text-xl font-bold mb-3">Who can enter the giveaways?</h3>
                <p className="text-gray-300">
                  Most of our giveaways are open to residents of the United States and Canada who are 18 years or older. Specific eligibility requirements are listed on each giveaway page.
                </p>
              </div>
              <div className="bg-[#0D0B26]/80 border border-gray-800/50 rounded-xl p-6">
                <h3 className="text-xl font-bold mb-3">How are winners selected?</h3>
                <p className="text-gray-300">
                  Winners are selected randomly from all valid entries after the giveaway end date. The selection process is automated to ensure fairness.
                </p>
              </div>
              <div className="bg-[#0D0B26]/80 border border-gray-800/50 rounded-xl p-6">
                <h3 className="text-xl font-bold mb-3">How will I know if I've won?</h3>
                <p className="text-gray-300">
                  Winners are notified via the email address provided during entry. We'll also announce winners on our social media channels.
                </p>
              </div>
              <div className="bg-[#0D0B26]/80 border border-gray-800/50 rounded-xl p-6">
                <h3 className="text-xl font-bold mb-3">How often do you run giveaways?</h3>
                <p className="text-gray-300">
                  We typically run 2-3 giveaways per month. Subscribe to our newsletter to be notified when new giveaways launch.
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}