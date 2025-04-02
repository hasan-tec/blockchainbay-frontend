"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckCircle2, Send } from "lucide-react"

export function ContactForm() {
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "General Inquiry", // Default subject
    message: "",
  })

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Handle select change for subject
  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      subject: value,
    }))
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    setIsSubmitting(true)
    setError(null)
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
      
      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to send your message. Please try again later.')
      }
      
      console.log("Contact form submission successful:", result)
      
      // Show success message
      setFormSubmitted(true)
      
      // Reset form after 5 seconds
      setTimeout(() => {
        setFormSubmitted(false)
        setFormData({
          name: "",
          email: "",
          subject: "General Inquiry",
          message: "",
        })
      }, 5000)
    } catch (error) {
      console.error('Error submitting contact form:', error)
      setError(error instanceof Error ? error.message : 'An unexpected error occurred. Please try again later.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="relative">
      <div className="bg-[#0D0B26]/80 border border-gray-800/50 rounded-xl p-8 backdrop-blur-sm">
        <h2 className="text-2xl font-bold mb-6">Send us a message</h2>

        {formSubmitted ? (
          <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-6 text-center">
            <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Message Sent!</h3>
            <p className="text-gray-300">
              Thank you for contacting us. We've sent you a confirmation email and will get back to you as soon as possible.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4 text-red-300 text-sm">
                <p>{error}</p>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium text-gray-300">
                  Your Name
                </label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="John Doe"
                  required
                  className="bg-gray-800/70 border-gray-700/50 focus:border-[#F7984A]/50 focus:ring-[#F7984A]/50"
                  disabled={isSubmitting}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-gray-300">
                  Email Address
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="john@example.com"
                  required
                  className="bg-gray-800/70 border-gray-700/50 focus:border-[#F7984A]/50 focus:ring-[#F7984A]/50"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="subject" className="text-sm font-medium text-gray-300">
                Subject
              </label>
              <Select 
                value={formData.subject} 
                onValueChange={handleSelectChange}
                disabled={isSubmitting}
              >
                <SelectTrigger className="bg-gray-800/70 border-gray-700/50 focus:border-[#F7984A]/50 focus:ring-[#F7984A]/50">
                  <SelectValue placeholder="Select a subject" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 text-white border-gray-700">
                  <SelectItem value="General Inquiry">General Inquiry</SelectItem>
                  <SelectItem value="Technical Support">Technical Support</SelectItem>
                  <SelectItem value="Partnership Opportunity">Partnership Opportunity</SelectItem>
                  <SelectItem value="Press & Media">Press & Media</SelectItem>
                  <SelectItem value="Careers">Careers</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label htmlFor="message" className="text-sm font-medium text-gray-300">
                Your Message
              </label>
              <Textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                placeholder="How can we help you?"
                rows={6}
                required
                className="bg-gray-800/70 border-gray-700/50 focus:border-[#F7984A]/50 focus:ring-[#F7984A]/50 resize-none"
                disabled={isSubmitting}
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="privacy"
                className="rounded border-gray-700 text-[#F7984A] focus:ring-[#F7984A]/50"
                required
                disabled={isSubmitting}
              />
              <label htmlFor="privacy" className="text-sm text-gray-300">
                I agree to the{" "}
                <a href="#" className="text-[#F7984A] hover:underline">
                  Privacy Policy
                </a>{" "}
                and consent to being contacted.
              </label>
            </div>

            <Button
              type="submit"
              className="w-full bg-[#F7984A] hover:bg-[#F7984A]/90 text-white py-6 rounded-md shadow-lg shadow-[#F7984A]/20 transition-all duration-300"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                  Sending...
                </>
              ) : (
                <>
                  Send Message
                  <Send className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>
        )}
      </div>

     
    </div>
  )
}