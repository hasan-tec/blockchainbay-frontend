"use client"

import { useState } from "react"
import { Mail } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { cn } from "@/lib/utils"
import { Footer } from "@/components/NewsletterFooter"
import Navbar from "@/components/Navbar"
import { ContactForm } from "./ContactForm" // Import the ContactForm component

export default function ContactPage() {
  const [isDarkMode, setIsDarkMode] = useState(true)

  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
    document.documentElement.classList.toggle("dark")
  }

  return (
    <div className={cn("min-h-screen bg-[#07071C] text-white relative", isDarkMode ? "dark" : "")}>
      {/* Enhanced Background elements with more visible gradients and grid */}
      <div className="fixed inset-0 bg-[#07071C] overflow-hidden z-0">
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
      <Navbar />

      {/* Page Content */}
      <main className="relative z-10 pt-32 pb-20">
        {/* Page Header */}
        <section className="mb-24">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white text-sm font-medium mb-6 backdrop-blur-sm">
                <span className="w-2 h-2 rounded-full bg-[#F7984A] mr-2 animate-pulse"></span>
                Get in touch with our team
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 text-white leading-tight">
                Contact <span className="text-[#F7984A]">BlockchainBay</span>
              </h1>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Have questions or need assistance? Our team is here to help you with any inquiries about our platform,
                services, or partnerships.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Information Cards - Only Email Support */}
        <section className="mb-24">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-xl mx-auto">
              {/* Email Support Card */}
              <div className="bg-[#0D0B26]/80 border border-gray-800/50 rounded-xl p-8 hover:border-[#F7984A]/30 transition-all duration-300 text-center group shadow-lg backdrop-blur-sm">
                <div className="w-16 h-16 rounded-full bg-[#F7984A]/10 flex items-center justify-center mx-auto mb-6 group-hover:bg-[#F7984A]/20 transition-all duration-300">
                  <Mail className="h-7 w-7 text-[#F7984A]" />
                </div>
                <h3 className="text-xl font-bold mb-3">Email Support</h3>
                <p className="text-gray-400 mb-4">
                  Our support team typically responds within 24 hours on business days.
                </p>
                <a
                  href="mailto:support@blockchainbay.cc"
                  className="inline-flex items-center justify-center px-5 py-2.5 bg-[#F7984A]/10 hover:bg-[#F7984A]/20 text-[#F7984A] rounded-lg transition-all duration-300 font-medium"
                >
                  support@blockchainbay.cc
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Form Section */}
        <section className="mb-24">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-2xl mx-auto">
              {/* Use the updated ContactForm component */}
              <ContactForm />
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mb-24">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-12">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-gray-800/70 text-gray-300 text-sm font-medium mb-4">
                <span className="w-2 h-2 rounded-full bg-[#F7984A] mr-2"></span>
                Frequently asked questions
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight text-white">
                Common Questions About Contacting Us
              </h2>
              <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                Find answers to the most frequently asked questions about our contact process and support services.
              </p>
            </div>

            <div className="max-w-3xl mx-auto bg-[#0D0B26]/50 border border-gray-800/30 rounded-2xl p-6 backdrop-blur-sm">
              <Accordion type="single" collapsible className="space-y-4">
                <AccordionItem
                  value="item-1"
                  className="bg-[#0D0B26]/80 border border-gray-800/50 rounded-xl overflow-hidden"
                >
                  <AccordionTrigger className="px-6 py-4 hover:bg-gray-800/30 transition-all">
                    What is the typical response time for support inquiries?
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-4 pt-2 text-gray-300">
                    Our support team aims to respond to all inquiries within 24 hours during business days.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem
                  value="item-2"
                  className="bg-[#0D0B26]/80 border border-gray-800/50 rounded-xl overflow-hidden"
                >
                  <AccordionTrigger className="px-6 py-4 hover:bg-gray-800/30 transition-all">
                    How can I schedule a meeting with your team?
                  </AccordionTrigger>

                  <AccordionContent className="px-6 pb-4 pt-2 text-gray-300">
                    To schedule a meeting with our team, please fill out the contact form with your preferred date and
                    time, or email us directly at meetings@blockchainbay.cc. We'll confirm your appointment within one
                    business day.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem
                  value="item-3"
                  className="bg-[#0D0B26]/80 border border-gray-800/50 rounded-xl overflow-hidden"
                >
                  <AccordionTrigger className="px-6 py-4 hover:bg-gray-800/30 transition-all">
                    Do you offer support in languages other than English?
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-4 pt-2 text-gray-300">
                    Yes, we offer support in multiple languages including Spanish, Mandarin, French, and German. Please
                    specify your preferred language when contacting us, and we'll connect you with an appropriate team
                    member.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem
                  value="item-4"
                  className="bg-[#0D0B26]/80 border border-gray-800/50 rounded-xl overflow-hidden"
                >
                  <AccordionTrigger className="px-6 py-4 hover:bg-gray-800/30 transition-all">
                    How can I report a technical issue with the platform?
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-4 pt-2 text-gray-300">
                    To report a technical issue, please use our contact form and select "Technical Support" as the
                    subject. Include as much detail as possible, including screenshots if applicable, to help us resolve
                    your issue quickly.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem
                  value="item-5"
                  className="bg-[#0D0B26]/80 border border-gray-800/50 rounded-xl overflow-hidden"
                >
                  <AccordionTrigger className="px-6 py-4 hover:bg-gray-800/30 transition-all">
                    How can I apply for a job at blockchainbay?
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-4 pt-2 text-gray-300">
                    For career opportunities, please visit our Careers page or email your resume and cover letter to
                    careers@blockchainbay.cc. We're always looking for talented individuals to join our team.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </section>

        {/* Connect with us on social media */}
        <section className="mb-24">
          <div className="container mx-auto px-4 md:px-6">
            <div className="bg-gradient-to-r from-[#0D0B26]/90 via-[#0D0B26]/80 to-[#0D0B26]/90 border border-[#F7984A]/10 rounded-2xl p-8 md:p-12 text-center shadow-lg backdrop-blur-sm">
              <h2 className="text-2xl md:text-3xl font-bold mb-6">Connect With Us On Social Media</h2>
              <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
                Follow us on social media to stay updated with the latest news, events, and announcements from
                blockchainbay.
              </p>

              <div className="flex flex-wrap justify-center gap-4 max-w-2xl mx-auto">
                {/* X (formerly Twitter) */}
                <a
                  href="https://x.com/blockchainbaycc"
                  target="_blank" // Optional: Opens link in a new tab
                  rel="noopener noreferrer" // Recommended for security when using target="_blank"
                  className="flex items-center gap-2 px-6 py-3 bg-gray-700/30 hover:bg-gray-700/40 text-white rounded-full transition-all duration-300 border border-gray-600/30"
                  aria-label="Follow us on X" // Accessibility improvement
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
                  </svg>
                </a>

                {/* LinkedIn */}
                <a
                  href="https://www.linkedin.com/company/blockchain-bay"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-6 py-3 bg-[#0A66C2]/10 hover:bg-[#0A66C2]/20 text-[#0A66C2] rounded-full transition-all duration-300 border border-[#0A66C2]/30"
                  aria-label="Connect with us on LinkedIn"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                  <span>LinkedIn</span>
                </a>

                {/* Discord */}
                <a
                  href="https://discord.gg/Q9YzGH948Q"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-6 py-3 bg-[#5865F2]/10 hover:bg-[#5865F2]/20 text-[#5865F2] rounded-full transition-all duration-300 border border-[#5865F2]/30"
                  aria-label="Join our Discord server"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.0371 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0785-.0371c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0368c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"></path>
                  </svg>
                  <span>Discord</span>
                </a>

                {/* Telegram */}
                <a
                  href="https://t.me/+vP6rrvYYMcwzMzVh"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-6 py-3 bg-[#2AABEE]/10 hover:bg-[#2AABEE]/20 text-[#2AABEE] rounded-full transition-all duration-300 border border-[#2AABEE]/30"
                  aria-label="Join our Telegram group"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M23.1117 4.49449C23.4296 2.94472 21.9074 1.65683 20.4317 2.227L2.3425 9.21601C0.694517 9.85273 0.621087 12.1572 2.22518 12.8975L6.1645 14.7157L8.03849 21.2746C8.13583 21.6153 8.40618 21.8791 8.74917 21.968C9.09216 22.0568 9.45658 21.9576 9.70712 21.707L12.5938 18.8203L16.6375 21.8531C17.8113 22.7334 19.5019 22.0922 19.7967 20.6549L23.1117 4.49449ZM3.0633 11.0816L21.1525 4.0926L17.8375 20.2531L13.1 16.6999C12.7019 16.4013 12.1448 16.4409 11.7929 16.7928L10.5565 18.0292L10.928 15.9861L18.2071 8.70703C18.5614 8.35278 18.5988 7.79106 18.2947 7.39293C17.9906 6.99479 17.4389 6.88312 17.0039 7.13168L6.95124 12.876L3.0633 11.0816ZM8.17695 14.4791L8.78333 16.6015L9.01614 15.321C9.05253 15.1209 9.14908 14.9366 9.29291 14.7928L11.5128 12.573L8.17695 14.4791Z"
                    />
                  </svg>
                  <span>Telegram</span>
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer className="relative z-20" />
    </div>
  )
}

