"use client"

import type React from "react"

import { useRef, useState } from "react"
import ReCAPTCHA from "react-google-recaptcha"
import Link from "next/link"
import Image from "next/image"
import {
  ArrowRight,
  Clock,
  Calendar,
  Users,
  Check,
  ChevronRight,
  Facebook,
  Twitter,
  Instagram,
  Copy,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

// Import our components
import Navbar from "@/components/Navbar"
import { Footer } from "@/components/NewsletterFooter"

// Import API utilities
import { submitGiveawayEntry, type GiveawayDetail, type FormattedGiveaway } from "@/lib/api"

// Fix the interface properties
interface GiveawayClientProps {
  giveaway?: GiveawayDetail
  relatedGiveaways?: FormattedGiveaway[]
  error?: string
}

export default function GiveawayClient({ giveaway, relatedGiveaways = [], error }: GiveawayClientProps) {
  const [copied, setCopied] = useState(false)
  const [formSubmitting, setFormSubmitting] = useState(false)
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    terms: false,
  })

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    })
  }

  // Inside the component, fix the recaptchaRef and handleSubmit
  const recaptchaRef = useRef<ReCAPTCHA>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!giveaway) return

    // Check if giveaway is active
    if (giveaway.status !== "active") {
      setFormError("This giveaway is not currently accepting entries.")
      return
    }

    // Get captcha token
    const captchaToken = recaptchaRef.current?.getValue()
    if (!captchaToken) {
      setFormError("Please complete the captcha verification")
      return
    }

    try {
      setFormSubmitting(true)
      setFormError(null)

      // Submit with email uniqueness check
      const success = await submitGiveawayEntry(giveaway.id, formData.name, formData.email, captchaToken)

      if (success) {
        setFormSubmitted(true)
        // Reset the form
        setFormData({
          name: "",
          email: "",
          terms: false,
        })
        // Reset the captcha
        recaptchaRef.current?.reset()
      } else {
        setFormError("This email has already been used to enter this giveaway.")
      }
    } catch (err) {
      console.error("Error submitting form:", err)
      setFormError("An unexpected error occurred. Please try again later.")
    } finally {
      setFormSubmitting(false)
    }
  }

  // Show error state if we have an error but no giveaway
  if (error || !giveaway) {
    return (
      <div className="min-h-screen text-white relative">
        {/* Enhanced Background elements with more visible gradients and grid */}
        <div className="fixed inset-0 bg-[#07071C] overflow-hidden z-10">
          {/* Main gradient orbs - more visible now */}
          <div className="absolute top-[5%] left-[10%] w-[40rem] h-[40rem] rounded-full bg-gradient-to-r from-[#F7984A]/30 to-transparent opacity-50 blur-[100px]"></div>
          <div className="absolute bottom-[10%] right-[10%] w-[35rem] h-[35rem] rounded-full bg-gradient-to-l from-[#F7984A]/30 to-transparent opacity-50 blur-[100px]"></div>
          <div className="absolute top-[40%] right-[15%] w-[30rem] h-[30rem] rounded-full bg-gradient-to-t from-blue-500/20 to-transparent opacity-40 blur-[100px]"></div>
          {/* Grid overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] opacity-70"></div>
          {/* Keep the original texture overlay */}
          <div className="absolute inset-0 bg-[url('/placeholder.svg?height=100&width=100')] bg-repeat opacity-[0.015]"></div>
        </div>

        <Navbar  />
        <main className="pt-32 pb-20 relative z-20">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-xl mx-auto text-center py-16">
              <div className="bg-red-500/10 p-6 rounded-xl border border-red-500/20 mb-6">
                <p className="text-red-400">{error || "Giveaway not found"}</p>
              </div>
              <Button
                onClick={() => window.location.reload()}
                className="bg-[#F7984A] hover:bg-[#F7984A]/90 text-white"
              >
                Try Again
              </Button>
            </div>
          </div>
        </main>
        <Footer className="relative z-20" />
      </div>
    )
  }

  // Determine if the giveaway is active based on status
  const isActive = giveaway.status === "active"

  return (
    <div className="min-h-screen text-white relative">
      {/* Enhanced Background elements with more visible gradients and grid */}
      <div className="fixed inset-0 bg-[#07071C] overflow-hidden z-10">
        {/* Main gradient orbs - more visible now */}
        <div className="absolute top-[5%] left-[10%] w-[40rem] h-[40rem] rounded-full bg-gradient-to-r from-[#F7984A]/30 to-transparent opacity-50 blur-[100px]"></div>
        <div className="absolute bottom-[10%] right-[10%] w-[35rem] h-[35rem] rounded-full bg-gradient-to-l from-[#F7984A]/30 to-transparent opacity-50 blur-[100px]"></div>
        <div className="absolute top-[40%] right-[15%] w-[30rem] h-[30rem] rounded-full bg-gradient-to-t from-blue-500/20 to-transparent opacity-40 blur-[100px]"></div>
        {/* Grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] opacity-70"></div>
        {/* Keep the original texture overlay */}
        <div className="absolute inset-0 bg-[url('/placeholder.svg?height=100&width=100')] bg-repeat opacity-[0.015]"></div>
      </div>

      {/* Navigation */}
      <Navbar  />

      {/* Main Content */}
      <main className="pt-32 pb-20 relative z-20">
        <div className="container mx-auto px-4 md:px-6">
          {/* Breadcrumb */}
          <div className="text-sm mb-6 flex items-center text-gray-400">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <ChevronRight className="h-4 w-4 mx-2" />
            <Link href="/giveaways" className="hover:text-white transition-colors">
              Giveaways
            </Link>
            <ChevronRight className="h-4 w-4 mx-2" />
            <span className="text-gray-300">{giveaway.title}</span>
          </div>

          {/* Giveaway Header */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#07071C] via-gray-900 to-[#07071C] border border-gray-800/50 mb-8">
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute top-0 left-[10%] w-[30rem] h-[30rem] rounded-full bg-[#F7984A]/5 blur-[10rem] -z-10"></div>
              <div className="absolute bottom-0 right-[10%] w-[25rem] h-[25rem] rounded-full bg-purple-500/5 blur-[10rem] -z-10"></div>
            </div>
            <div className="relative p-8 md:p-12">
              <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
                <div className="lg:w-1/2">
                  <Badge
                    className={cn(
                      "mb-4 text-white",
                      isActive ? "bg-green-500 hover:bg-green-600" : "bg-yellow-500 hover:bg-yellow-600",
                    )}
                  >
                    {isActive ? "ACTIVE GIVEAWAY" : "COMING SOON"}
                  </Badge>
                  <h1 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight text-white">{giveaway.title}</h1>
                  <p className="text-lg text-gray-300 mb-6">{giveaway.description}</p>
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-3 text-center">
                      <Clock className="h-5 w-5 mx-auto mb-2 text-[#F7984A]" />
                      <span className="text-sm text-gray-300">{giveaway.daysLeft} days left</span>
                    </div>
                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-3 text-center">
                      <Calendar className="h-5 w-5 mx-auto mb-2 text-[#F7984A]" />
                      <span className="text-sm text-gray-300">Ends {giveaway.endDate}</span>
                    </div>
                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-3 text-center">
                      <Users className="h-5 w-5 mx-auto mb-2 text-[#F7984A]" />
                      <span className="text-sm text-gray-300">
                        {isActive ? `${giveaway.entries.toLocaleString()} entries` : "Not yet open"}
                      </span>
                    </div>
                  </div>
                  {isActive ? (
                    <Button className="bg-[#F7984A] hover:bg-[#F7984A]/90 text-white px-8 py-6 text-lg rounded-md shadow-lg shadow-[#F7984A]/20 transition-all duration-300">
                      <span>Enter Now</span>
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      className="border-white/20 bg-black  hover:bg-white hover:text-black text-white px-8 py-6 text-lg rounded-md shadow-lg shadow-black/20 transition-all duration-300"
                    >
                      <span>Set Reminder</span>
                      <Calendar className="ml-2 h-5 w-5" />
                    </Button>
                  )}
                </div>
                <div className="lg:w-1/2">
                  <div className="relative rounded-xl overflow-hidden">
                    <Image
                      src={giveaway.image || "/placeholder.svg"}
                      alt={giveaway.title}
                      width={600}
                      height={400}
                      className={cn("w-full h-auto object-cover rounded-xl", !isActive && "filter grayscale")}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="flex items-center justify-between">
                        <Badge
                          className={cn(
                            "text-white",
                            isActive ? "bg-green-500 hover:bg-green-600" : "bg-yellow-500 hover:bg-yellow-600",
                          )}
                        >
                          {isActive ? "ACTIVE" : "COMING SOON"}
                        </Badge>
                        <span className="text-sm bg-black/50 px-3 py-1 rounded-full text-white">
                          Value: ${giveaway.value}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Details */}
            <div className="lg:col-span-2">
              <Tabs defaultValue="prizes" className="mb-8">
                <TabsList className="bg-gray-800/50 border border-gray-700/50">
                  <TabsTrigger
                    value="prizes"
                    className="data-[state=active]:bg-[#F7984A] data-[state=active]:text-white text-gray-300"
                  >
                    Prize Details
                  </TabsTrigger>
                  <TabsTrigger
                    value="rules"
                    className="data-[state=active]:bg-[#F7984A] data-[state=active]:text-white text-gray-300"
                  >
                    Rules & Eligibility
                  </TabsTrigger>
                  <TabsTrigger
                    value="winners"
                    className="data-[state=active]:bg-[#F7984A] data-[state=active]:text-white text-gray-300"
                  >
                    Past Winners
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="prizes" className="mt-6">
                  <Card className="bg-[#0D0B26]/80 border border-gray-800/50 rounded-xl p-6">
                    <h2 className="text-2xl font-bold mb-6 pb-2 border-b border-gray-800/50 text-white">
                      Prize Details
                    </h2>
                    <ul className="space-y-4">
                      {giveaway.prizes.length > 0 ? (
                        giveaway.prizes.map((prize, index) => (
                          <li key={index} className="flex items-start">
                            <div className="flex items-center justify-center bg-[#F7984A]/20 text-[#F7984A] rounded-full h-6 w-6 min-w-6 mr-3 mt-0.5">
                              <Check className="h-4 w-4" />
                            </div>
                            <span className="text-gray-300">{prize}</span>
                          </li>
                        ))
                      ) : (
                        <li className="text-gray-300">Prize details will be announced soon.</li>
                      )}
                    </ul>
                    <div className="mt-6 pt-6 border-t border-gray-800/50">
                      <h3 className="font-bold text-lg mb-3 text-white">Total Prize Value</h3>
                      <p className="text-2xl font-bold text-[#F7984A]">${giveaway.value}</p>
                    </div>
                  </Card>
                </TabsContent>
                <TabsContent value="rules" className="mt-6">
                  <Card className="bg-[#0D0B26]/80 border border-gray-800/50 rounded-xl p-6">
                    <h2 className="text-2xl font-bold mb-6 pb-2 border-b border-gray-800/50 text-white">
                      Rules & Eligibility
                    </h2>
                    <ul className="space-y-3">
                      {giveaway.rules.length > 0 ? (
                        giveaway.rules.map((rule, index) => (
                          <li key={index} className="flex items-start">
                            <div className="text-[#F7984A] mr-2">•</div>
                            <span className="text-gray-300">{rule}</span>
                          </li>
                        ))
                      ) : (
                        <li className="text-gray-300">
                          <div className="text-[#F7984A] mr-2 inline">•</div>
                          Full contest rules will be published shortly.
                        </li>
                      )}
                    </ul>
                    <div className="mt-6 pt-6 border-t border-gray-800/50">
                      <h3 className="font-bold text-lg mb-3 text-white">Important Dates</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-400">Start Date</p>
                          <p className="text-lg text-white">{giveaway.startDate}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">End Date</p>
                          <p className="text-lg text-white">{giveaway.endDate}</p>
                        </div>
                      </div>
                    </div>
                  </Card>
                </TabsContent>
                <TabsContent value="winners" className="mt-6">
                  <Card className="bg-[#0D0B26]/80 border border-gray-800/50 rounded-xl p-6">
                    <h2 className="text-2xl font-bold mb-6 pb-2 border-b border-gray-800/50 text-white">
                      Past Winners
                    </h2>
                    {isActive ? (
                      <div className="text-center py-8">
                        <Clock className="h-12 w-12 mx-auto mb-4 text-gray-500" />
                        <h3 className="text-xl font-medium mb-2 text-white">Winner Not Yet Selected</h3>
                        <p className="text-gray-300 max-w-md mx-auto">
                          This giveaway is still active. The winner will be announced after {giveaway.endDate}.
                        </p>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-500" />
                        <h3 className="text-xl font-medium mb-2 text-white">Giveaway Not Yet Started</h3>
                        <p className="text-gray-300 max-w-md mx-auto">
                          This giveaway will start on {giveaway.startDate}. Check back then to enter!
                        </p>
                      </div>
                    )}
                  </Card>
                </TabsContent>
              </Tabs>

              {/* Share Section */}
              <Card className="bg-[#0D0B26]/80 border border-gray-800/50 rounded-xl p-6 mb-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-bold text-lg mb-1 text-white">Share this Giveaway</h3>
                    <p className="text-sm text-gray-300">
                      Spread the word and let your friends know about this giveaway!
                    </p>
                  </div>
                  <div className="flex space-x-3">
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-full border-gray-700 bg-black text-blue-400 hover:text-blue-300 hover:bg-gray-800"
                    >
                      <Facebook className="h-5 w-5" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-full border-gray-700 bg-black text-blue-300 hover:text-blue-200 hover:bg-gray-800"
                    >
                      <Twitter className="h-5 w-5" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-full border-gray-700 bg-black text-pink-400 hover:text-pink-300 hover:bg-gray-800"
                    >
                      <Instagram className="h-5 w-5" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-full border-gray-700 bg-black text-gray-300 hover:text-white hover:bg-gray-800"
                      onClick={handleCopyLink}
                    >
                      {copied ? <Check className="h-5 w-5 text-green-500" /> : <Copy className="h-5 w-5" />}
                    </Button>
                  </div>
                </div>
              </Card>
            </div>

            {/* Right Column - Entry Form */}
            <div>
              <Card className="bg-[#0D0B26]/80 border border-gray-800/50 rounded-xl p-6 sticky top-24">
                <h2 className="text-2xl font-bold mb-6 pb-2 border-b border-gray-800/50 text-white">Enter Giveaway</h2>
                {isActive ? (
                  formSubmitted ? (
                    <div className="text-center py-6">
                      <Check className="h-12 w-12 mx-auto mb-4 text-green-500" />
                      <h3 className="text-xl font-medium mb-2 text-white">Entry Submitted!</h3>
                      <p className="text-gray-300 mb-4">Thank you for entering this giveaway.</p>
                      <p className="text-gray-300 mb-6">Winners will be announced after {giveaway.endDate}.</p>
                    </div>
                  ) : (
                    <form className="space-y-4" onSubmit={handleSubmit}>
                      <div>
                        <label htmlFor="name" className="block text-gray-300 mb-1 text-sm">
                          Full Name
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 bg-gray-800/70 border border-gray-700/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#F7984A]/50 focus:border-[#F7984A]/50 transition-all"
                          placeholder="Your full name"
                          required
                          disabled={formSubmitting}
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-gray-300 mb-1 text-sm">
                          Email Address
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 bg-gray-800/70 border border-gray-700/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#F7984A]/50 focus:border-[#F7984A]/50 transition-all"
                          placeholder="Your email address"
                          required
                          disabled={formSubmitting}
                        />
                      </div>
                      <div className="flex items-start mt-4">
                        <input
                          type="checkbox"
                          id="terms"
                          name="terms"
                          checked={formData.terms}
                          onChange={handleInputChange}
                          className="mt-1"
                          required
                          disabled={formSubmitting}
                        />
                        <label htmlFor="terms" className="ml-2 text-sm text-gray-300">
                          I agree to the terms and conditions and confirm I am 18 years or older.
                        </label>
                      </div>

                      {/* ReCAPTCHA Component */}
                      <div className="mt-4">
                        <ReCAPTCHA
                          ref={recaptchaRef}
                          sitekey={
                            process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
                          }
                          theme="dark"
                          className="transform scale-90 -ml-3"
                        />
                      </div>

                      {formError && (
                        <div className="bg-red-500/10 p-3 rounded-lg border border-red-500/20">
                          <p className="text-red-400 text-sm">{formError}</p>
                        </div>
                      )}

                      <Button
                        type="submit"
                        className="w-full bg-[#F7984A] hover:bg-[#F7984A]/90 text-white py-3 px-4 rounded-lg transition-colors duration-300"
                        disabled={formSubmitting}
                      >
                        {formSubmitting ? (
                          <>
                            <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                            Submitting...
                          </>
                        ) : (
                          "Submit Entry"
                        )}
                      </Button>
                    </form>
                  )
                ) : (
                  <div className="text-center py-6">
                    <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-500" />
                    <p className="text-gray-300 mb-4">This giveaway is not yet open for entries.</p>
                    <p className="text-gray-300 mb-6">Opens on {giveaway.startDate}</p>
                    <Button
                      className="w-full border-white/20 bg-gray-800/70 hover:bg-gray-700/70 text-white py-3 px-4 rounded-lg transition-colors duration-300"
                      disabled
                    >
                      Coming Soon
                    </Button>
                  </div>
                )}

                {/* Entry Stats */}
                {isActive && (
                  <div className="mt-6 pt-6 border-t border-gray-800/50">
                    <div className="flex items-center justify-between text-sm text-gray-300">
                      <span>Total Entries</span>
                      <span className="font-bold text-white">{giveaway.entries.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-300 mt-2">
                      <span>Time Remaining</span>
                      <span className="font-bold text-white">{giveaway.daysLeft} days</span>
                    </div>
                  </div>
                )}

                
              </Card>
            </div>
          </div>

          {/* Related Giveaways */}
          {relatedGiveaways.length > 0 &&
            // Filter out ended giveaways
            (() => {
              const activeOrUpcomingGiveaways = relatedGiveaways.filter((giveaway) => giveaway.status !== "ended")

              // Only show section if there are active or upcoming giveaways
              return activeOrUpcomingGiveaways.length > 0 ? (
                <section className="mt-16">
                  <h2 className="text-3xl font-bold mb-8 text-white">More Giveaways You Might Like</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {activeOrUpcomingGiveaways.map((relatedGiveaway) => (
                      <Link key={relatedGiveaway.id} href={`/giveaways/${relatedGiveaway.slug}`}>
                        <Card className="bg-[#0D0B26]/80 border border-gray-800/50 rounded-xl overflow-hidden hover:border-gray-700/60 transition-all duration-300 group h-full flex flex-col">
                          <div className="relative aspect-video w-full overflow-hidden">
                            <Image
                              src={relatedGiveaway.image || "/placeholder.svg"}
                              alt={relatedGiveaway.title}
                              width={600}
                              height={300}
                              className={cn(
                                "object-cover w-full h-full group-hover:scale-105 transition-transform duration-500",
                                relatedGiveaway.status !== "active" && "filter grayscale",
                              )}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                            <div className="absolute top-4 left-4">
                              <Badge
                                className={cn(
                                  "text-white",
                                  relatedGiveaway.status === "active"
                                    ? "bg-green-500 hover:bg-green-600"
                                    : "bg-yellow-500 hover:bg-yellow-600",
                                )}
                              >
                                {relatedGiveaway.status === "active" ? "ACTIVE" : "COMING SOON"}
                              </Badge>
                            </div>
                            <div className="absolute bottom-4 left-4 right-4">
                              <div className="flex items-center justify-between">
                                <span className="text-sm bg-black/50 px-2 py-1 rounded-full flex items-center text-white">
                                  <Clock className="h-3 w-3 mr-1" />
                                  {relatedGiveaway.daysLeft} days left
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="p-6 flex-1 flex flex-col">
                            <h3 className="font-bold text-xl mb-3 group-hover:text-[#F7984A] transition-colors line-clamp-2 text-white">
                              {relatedGiveaway.title}
                            </h3>
                            <p className="text-gray-300 text-sm mb-4 line-clamp-3 flex-1">
                              {relatedGiveaway.description}
                            </p>
                            <div className="flex items-center justify-between mt-auto">
                              <span className="text-sm text-gray-300">Value: ${relatedGiveaway.value}</span>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-[#F7984A] hover:text-[#F7984A]/90 hover:bg-gray-800 p-0 h-auto"
                              >
                                View details <ArrowRight className="ml-1 h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </section>
              ) : null
            })()}
        </div>
      </main>

      {/* Footer */}
      <Footer className="relative z-20" />
    </div>
  )
}

