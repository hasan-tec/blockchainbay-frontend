import type { Metadata } from "next"
import Link from "next/link"
import { Clock, ExternalLink, ShieldCheck } from "lucide-react"
import Navbar from "@/components/Navbar";
import { Footer } from "@/components/NewsletterFooter";

export const metadata: Metadata = {
  title: "Privacy Policy | blockchainbay",
  description: "blockchainbay's Privacy Policy - How we collect, use, and protect your data",
}

export default function PrivacyPolicy() {
  // Last updated date
  const lastUpdated = "April 1, 2025";

  const tableOfContents = [
    { id: "introduction", title: "Introduction" },
    { id: "information-collection", title: "Information We Collect" },
    { id: "use-of-information", title: "How We Use Your Information" },
    { id: "data-sharing", title: "Sharing of Information" },
    { id: "data-security", title: "Data Security" },
    { id: "your-rights", title: "Your Rights and Choices" },
    { id: "cookies", title: "Cookies and Tracking" },
    { id: "childrens-privacy", title: "Children's Privacy" },
    { id: "international-transfers", title: "International Transfers" },
    { id: "changes-to-policy", title: "Changes to This Policy" },
    { id: "contact-us", title: "Contact Us" },
  ];

  return (
    <main className="relative min-h-screen pb-20">
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

      <Navbar/>

      {/* Content container with proper z-index */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        {/* Header Section */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center px-3 py-1 mb-4 rounded-full bg-[#F7984A]/10 text-[#F7984A] text-sm font-medium">
            <ShieldCheck className="w-4 h-4 mr-2" />
            Your Privacy Matters
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
            <span className="bg-gradient-to-r from-[#F7984A] to-[#F7984A]/70 bg-clip-text text-transparent">
              Privacy Policy
            </span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            This Privacy Policy explains how blockchainbay collects, uses, and protects your information when you use our platform.
          </p>
          <div className="flex items-center justify-center mt-4 text-sm text-gray-500">
            <Clock className="w-4 h-4 mr-1" />
            Last Updated: {lastUpdated}
          </div>
        </div>

        {/* Two-column layout for larger screens */}
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Left column - Table of contents on larger screens, sticky on scroll */}
          <div className="lg:w-1/4">
            <div className="lg:sticky lg:top-32 p-6 rounded-2xl bg-white/[0.03] backdrop-blur-sm border border-white/10">
              <h2 className="text-lg font-semibold text-white mb-4">Contents</h2>
              <nav className="space-y-2">
                {tableOfContents.map((item, index) => (
                  <a 
                    key={index}
                    href={`#${item.id}`}
                    className="flex items-center text-sm py-1.5 px-3 rounded-lg text-gray-400 hover:text-[#F7984A] hover:bg-[#F7984A]/5 transition-colors"
                  >
                    <span className="w-5 h-5 flex items-center justify-center rounded-full bg-[#F7984A]/10 text-[#F7984A] text-xs mr-2">
                      {index + 1}
                    </span>
                    {item.title}
                  </a>
                ))}
              </nav>
              
              <div className="mt-8 pt-6 border-t border-white/5">
                <h3 className="text-sm font-medium text-white mb-3">Need Help?</h3>
                <Link 
                  href="/contact" 
                  className="flex items-center text-sm text-[#F7984A] hover:underline"
                >
                  Contact our Privacy Team
                  <ExternalLink className="ml-1 w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>

          {/* Right column - Privacy Policy content */}
          <div className="lg:w-3/4">
            <div className="prose prose-invert max-w-none">
              {/* Introduction */}
              <section id="introduction" className="mb-12 p-8 rounded-2xl bg-white/[0.02] backdrop-blur-sm border border-white/10">
                <h2 className="text-2xl font-bold mb-4 flex items-center text-white">
                  <span className="bg-gradient-to-r from-[#F7984A] via-[#F7984A] to-[#F7984A]/70 bg-clip-text text-transparent">
                    1. Introduction
                  </span>
                </h2>
                <p className="text-gray-300 leading-relaxed">
                  At blockchainbay, we are committed to protecting your privacy and ensuring the security of your personal information. 
                  This Privacy Policy outlines how we collect, use, disclose, and safeguard your data when you use our website, 
                  mobile applications, and services (collectively, the "Services").
                </p>
                <p className="text-gray-300 leading-relaxed mt-4">
                  By accessing or using our Services, you acknowledge that you have read, understood, and agree to be bound by the 
                  terms of this Privacy Policy. If you do not agree with our policies and practices, please do not use our Services.
                </p>
              </section>

              {/* Information Collection */}
              <section id="information-collection" className="mb-12 p-8 rounded-2xl bg-white/[0.02] backdrop-blur-sm border border-white/10">
                <h2 className="text-2xl font-bold mb-4 flex items-center text-white">
                  <span className="bg-gradient-to-r from-[#F7984A] via-[#F7984A] to-[#F7984A]/70 bg-clip-text text-transparent">
                    2. Information We Collect
                  </span>
                </h2>
                
                <h3 className="text-xl font-semibold mt-6 mb-3 text-white">2.1 Information You Provide to Us</h3>
                <p className="text-gray-300 leading-relaxed">
                  We collect information that you voluntarily provide when using our Services, including:
                </p>
                <ul className="list-disc pl-6 mt-2 space-y-2 text-gray-300">
                  <li>Account information (e.g., name, email address, phone number)</li>
                  <li>Profile information (e.g., profile picture, bio)</li>
                  <li>Financial information (e.g., wallet addresses, transaction history)</li>
                  <li>Identity verification documents (e.g., government ID, proof of address)</li>
                  <li>Communications with us (e.g., customer support inquiries)</li>
                  <li>Survey responses and feedback</li>
                </ul>

                <h3 className="text-xl font-semibold mt-6 mb-3 text-white">2.2 Information We Collect Automatically</h3>
                <p className="text-gray-300 leading-relaxed">
                  When you use our Services, we automatically collect certain information, including:
                </p>
                <ul className="list-disc pl-6 mt-2 space-y-2 text-gray-300">
                  <li>Device information (e.g., device type, operating system, browser type)</li>
                  <li>IP address and location information</li>
                  <li>Usage data (e.g., pages visited, actions taken, time spent on the platform)</li>
                  <li>Cookies and similar tracking technologies</li>
                  <li>Network and connection information</li>
                </ul>

                <h3 className="text-xl font-semibold mt-6 mb-3 text-white">2.3 Information from Third Parties</h3>
                <p className="text-gray-300 leading-relaxed">
                  We may receive information about you from third parties, including:
                </p>
                <ul className="list-disc pl-6 mt-2 space-y-2 text-gray-300">
                  <li>Identity verification services</li>
                  <li>Blockchain analytics providers</li>
                  <li>Business partners and affiliates</li>
                  <li>Public sources and social media platforms</li>
                </ul>
              </section>

              {/* Use of Information */}
              <section id="use-of-information" className="mb-12 p-8 rounded-2xl bg-white/[0.02] backdrop-blur-sm border border-white/10">
                <h2 className="text-2xl font-bold mb-4 flex items-center text-white">
                  <span className="bg-gradient-to-r from-[#F7984A] via-[#F7984A] to-[#F7984A]/70 bg-clip-text text-transparent">
                    3. How We Use Your Information
                  </span>
                </h2>
                
                <p className="text-gray-300 leading-relaxed">
                  We use the information we collect for various purposes, including to:
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <div className="p-5 rounded-xl bg-white/[0.03] border border-white/10">
                    <h3 className="text-lg font-semibold mb-3 text-white">Provide Our Services</h3>
                    <ul className="space-y-2 text-gray-300 text-sm">
                      <li>Create and manage your account</li>
                      <li>Process transactions and orders</li>
                      <li>Facilitate cryptocurrency exchanges</li>
                      <li>Provide customer support</li>
                    </ul>
                  </div>
                  
                  <div className="p-5 rounded-xl bg-white/[0.03] border border-white/10">
                    <h3 className="text-lg font-semibold mb-3 text-white">Improve Our Services</h3>
                    <ul className="space-y-2 text-gray-300 text-sm">
                      <li>Analyze usage patterns and trends</li>
                      <li>Debug and troubleshoot issues</li>
                      <li>Develop new features and products</li>
                      <li>Conduct research and analytics</li>
                    </ul>
                  </div>
                  
                  <div className="p-5 rounded-xl bg-white/[0.03] border border-white/10">
                    <h3 className="text-lg font-semibold mb-3 text-white">Personalize Your Experience</h3>
                    <ul className="space-y-2 text-gray-300 text-sm">
                      <li>Tailor content and recommendations</li>
                      <li>Remember your preferences</li>
                      <li>Provide personalized support</li>
                      <li>Customize marketing communications</li>
                    </ul>
                  </div>
                  
                  <div className="p-5 rounded-xl bg-white/[0.03] border border-white/10">
                    <h3 className="text-lg font-semibold mb-3 text-white">Ensure Security and Compliance</h3>
                    <ul className="space-y-2 text-gray-300 text-sm">
                      <li>Verify your identity</li>
                      <li>Prevent fraud and unauthorized access</li>
                      <li>Comply with legal obligations</li>
                      <li>Enforce our terms and policies</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Data Sharing */}
              <section id="data-sharing" className="mb-12 p-8 rounded-2xl bg-white/[0.02] backdrop-blur-sm border border-white/10">
                <h2 className="text-2xl font-bold mb-4 flex items-center text-white">
                  <span className="bg-gradient-to-r from-[#F7984A] via-[#F7984A] to-[#F7984A]/70 bg-clip-text text-transparent">
                    4. Sharing of Information
                  </span>
                </h2>
                
                <p className="text-gray-300 leading-relaxed">
                  We may share your information with third parties under the following circumstances:
                </p>
                
                <h3 className="text-xl font-semibold mt-6 mb-3 text-white">4.1 Service Providers</h3>
                <p className="text-gray-300 leading-relaxed">
                  We may share your information with trusted third-party service providers who assist us in operating our business and providing our Services. 
                  These service providers are contractually obligated to use your information only for the purposes of providing services to us and in 
                  accordance with this Privacy Policy.
                </p>
                
                <h3 className="text-xl font-semibold mt-6 mb-3 text-white">4.2 Legal Requirements</h3>
                <p className="text-gray-300 leading-relaxed">
                  We may disclose your information if required to do so by law or in response to valid requests by public authorities 
                  (e.g., a court or a government agency). We may also disclose your information to enforce our terms and policies, 
                  protect our rights, property, or safety, or the rights, property, or safety of others.
                </p>
                
                <h3 className="text-xl font-semibold mt-6 mb-3 text-white">4.3 Business Transfers</h3>
                <p className="text-gray-300 leading-relaxed">
                  If blockchainbay is involved in a merger, acquisition, or sale of all or a portion of its assets, your information may be 
                  transferred as part of that transaction. We will notify you via email and/or a prominent notice on our website of any 
                  change in ownership or uses of your information.
                </p>
                
                <h3 className="text-xl font-semibold mt-6 mb-3 text-white">4.4 With Your Consent</h3>
                <p className="text-gray-300 leading-relaxed">
                  We may share your information with third parties when you have given us your consent to do so.
                </p>
              </section>

              {/* Data Security */}
              <section id="data-security" className="mb-12 p-8 rounded-2xl bg-white/[0.02] backdrop-blur-sm border border-white/10">
                <h2 className="text-2xl font-bold mb-4 flex items-center text-white">
                  <span className="bg-gradient-to-r from-[#F7984A] via-[#F7984A] to-[#F7984A]/70 bg-clip-text text-transparent">
                    5. Data Security
                  </span>
                </h2>
                
                <p className="text-gray-300 leading-relaxed">
                  We implement appropriate technical and organizational measures to protect your information against unauthorized access, 
                  alteration, disclosure, or destruction. These security measures include:
                </p>
                
                <ul className="list-disc pl-6 mt-4 space-y-2 text-gray-300">
                  <li>Encryption of sensitive data</li>
                  <li>Regular security assessments and penetration testing</li>
                  <li>Access controls and authentication mechanisms</li>
                  <li>Regular security training for our employees</li>
                  <li>Monitoring for suspicious activities</li>
                </ul>
                
                <p className="text-gray-300 leading-relaxed mt-4">
                  While we strive to use commercially acceptable means to protect your information, no method of transmission over the Internet or 
                  method of electronic storage is 100% secure. Therefore, we cannot guarantee its absolute security.
                </p>
                
                <div className="mt-6 p-4 rounded-lg bg-[#F7984A]/10 text-[#F7984A]">
                  <div className="flex items-start">
                    <ShieldCheck className="w-5 h-5 mt-0.5 mr-3 flex-shrink-0" />
                    <p className="text-sm">
                      We continuously review and update our security practices to enhance the protection of your data. 
                      In the event of a data breach that affects your personal information, we will notify you in accordance 
                      with applicable laws.
                    </p>
                  </div>
                </div>
              </section>

              {/* Your Rights */}
              <section id="your-rights" className="mb-12 p-8 rounded-2xl bg-white/[0.02] backdrop-blur-sm border border-white/10">
                <h2 className="text-2xl font-bold mb-4 flex items-center text-white">
                  <span className="bg-gradient-to-r from-[#F7984A] via-[#F7984A] to-[#F7984A]/70 bg-clip-text text-transparent">
                    6. Your Rights and Choices
                  </span>
                </h2>
                
                <p className="text-gray-300 leading-relaxed">
                  Depending on your location, you may have certain rights regarding your personal information, including:
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <div className="p-5 rounded-xl bg-white/[0.03] border border-white/10">
                    <h3 className="text-lg font-semibold mb-3 text-white">Access and Portability</h3>
                    <p className="text-gray-300 text-sm">
                      You have the right to access the personal information we hold about you and to receive a copy of your data in a structured, 
                      commonly used, and machine-readable format.
                    </p>
                  </div>
                  
                  <div className="p-5 rounded-xl bg-white/[0.03] border border-white/10">
                    <h3 className="text-lg font-semibold mb-3 text-white">Correction and Update</h3>
                    <p className="text-gray-300 text-sm">
                      You have the right to correct or update your personal information if it is inaccurate or incomplete. 
                      You can update much of your information directly through your account settings.
                    </p>
                  </div>
                  
                  <div className="p-5 rounded-xl bg-white/[0.03] border border-white/10">
                    <h3 className="text-lg font-semibold mb-3 text-white">Deletion</h3>
                    <p className="text-gray-300 text-sm">
                      You have the right to request the deletion of your personal information in certain circumstances. 
                      Please note that we may retain certain information as required by law or for legitimate business purposes.
                    </p>
                  </div>
                  
                  <div className="p-5 rounded-xl bg-white/[0.03] border border-white/10">
                    <h3 className="text-lg font-semibold mb-3 text-white">Object and Restrict</h3>
                    <p className="text-gray-300 text-sm">
                      You have the right to object to the processing of your personal information and to request that we restrict the processing 
                      of your personal information in certain circumstances.
                    </p>
                  </div>
                </div>
                
                <h3 className="text-xl font-semibold mt-8 mb-3 text-white">How to Exercise Your Rights</h3>
                <p className="text-gray-300 leading-relaxed">
                  To exercise your rights, please contact us at privacy@blockchainbay.com or through the Contact page on our website. 
                  We will respond to your request within the timeframe required by applicable law.
                </p>
                
                <p className="text-gray-300 leading-relaxed mt-4">
                  Please note that we may need to verify your identity before processing your request. For your protection, we may only 
                  implement requests with respect to the personal information associated with the particular email address you use to send us your request.
                </p>
              </section>

              {/* Cookies */}
              <section id="cookies" className="mb-12 p-8 rounded-2xl bg-white/[0.02] backdrop-blur-sm border border-white/10">
                <h2 className="text-2xl font-bold mb-4 flex items-center text-white">
                  <span className="bg-gradient-to-r from-[#F7984A] via-[#F7984A] to-[#F7984A]/70 bg-clip-text text-transparent">
                    7. Cookies and Tracking Technologies
                  </span>
                </h2>
                
                <p className="text-gray-300 leading-relaxed">
                  We use cookies and similar tracking technologies to track activity on our Services and to hold certain information. 
                  Cookies are files with a small amount of data that may include an anonymous unique identifier.
                </p>
                
                <h3 className="text-xl font-semibold mt-6 mb-3 text-white">7.1 Types of Cookies We Use</h3>
                
                <div className="overflow-x-auto mt-4">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-white/5">
                        <th className="px-4 py-3 text-left text-sm font-semibold text-white border-b border-white/10">Type</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-white border-b border-white/10">Purpose</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-white border-b border-white/10">Duration</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      <tr>
                        <td className="px-4 py-3 text-sm text-gray-300">Essential Cookies</td>
                        <td className="px-4 py-3 text-sm text-gray-300">Necessary for the website to function properly</td>
                        <td className="px-4 py-3 text-sm text-gray-300">Session / Persistent</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-sm text-gray-300">Preference Cookies</td>
                        <td className="px-4 py-3 text-sm text-gray-300">Remember your preferences and settings</td>
                        <td className="px-4 py-3 text-sm text-gray-300">1 year</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-sm text-gray-300">Analytics Cookies</td>
                        <td className="px-4 py-3 text-sm text-gray-300">Help us understand how visitors interact with our website</td>
                        <td className="px-4 py-3 text-sm text-gray-300">2 years</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-sm text-gray-300">Marketing Cookies</td>
                        <td className="px-4 py-3 text-sm text-gray-300">Track visitors across websites to display relevant advertisements</td>
                        <td className="px-4 py-3 text-sm text-gray-300">30 days</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                
                <h3 className="text-xl font-semibold mt-8 mb-3 text-white">7.2 Your Cookie Choices</h3>
                <p className="text-gray-300 leading-relaxed">
                  You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, 
                  you may not be able to use some portions of our Services. You can also manage your cookie preferences through our cookie banner 
                  when you first visit our website.
                </p>
              </section>

              {/* Children's Privacy */}
              <section id="childrens-privacy" className="mb-12 p-8 rounded-2xl bg-white/[0.02] backdrop-blur-sm border border-white/10">
                <h2 className="text-2xl font-bold mb-4 flex items-center text-white">
                  <span className="bg-gradient-to-r from-[#F7984A] via-[#F7984A] to-[#F7984A]/70 bg-clip-text text-transparent">
                    8. Children's Privacy
                  </span>
                </h2>
                
                <p className="text-gray-300 leading-relaxed">
                  Our Services are not intended for individuals under the age of 18. We do not knowingly collect personal information 
                  from children under 18. If you are a parent or guardian and you believe that your child has provided us with personal 
                  information, please contact us. If we become aware that we have collected personal information from a child under 18 
                  without verification of parental consent, we will take steps to remove that information from our servers.
                </p>
              </section>

              {/* International Transfers */}
              <section id="international-transfers" className="mb-12 p-8 rounded-2xl bg-white/[0.02] backdrop-blur-sm border border-white/10">
                <h2 className="text-2xl font-bold mb-4 flex items-center text-white">
                  <span className="bg-gradient-to-r from-[#F7984A] via-[#F7984A] to-[#F7984A]/70 bg-clip-text text-transparent">
                    9. International Data Transfers
                  </span>
                </h2>
                
                <p className="text-gray-300 leading-relaxed">
                  Your information may be transferred to and processed in countries other than the country in which you reside. 
                  These countries may have data protection laws that are different from the laws of your country.
                </p>
                
                <p className="text-gray-300 leading-relaxed mt-4">
                  When we transfer your information to other countries, we will protect that information as described in this Privacy Policy 
                  and in accordance with applicable law. We use appropriate safeguards, such as standard contractual clauses, to ensure that 
                  your information receives an adequate level of protection in the countries in which we process it.
                </p>
              </section>

              {/* Changes to Policy */}
              <section id="changes-to-policy" className="mb-12 p-8 rounded-2xl bg-white/[0.02] backdrop-blur-sm border border-white/10">
                <h2 className="text-2xl font-bold mb-4 flex items-center text-white">
                  <span className="bg-gradient-to-r from-[#F7984A] via-[#F7984A] to-[#F7984A]/70 bg-clip-text text-transparent">
                    10. Changes to This Privacy Policy
                  </span>
                </h2>
                
                <p className="text-gray-300 leading-relaxed">
                  We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy 
                  on this page and updating the "Last Updated" date at the top of this Privacy Policy.
                </p>
                
                <p className="text-gray-300 leading-relaxed mt-4">
                  You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective 
                  when they are posted on this page.
                </p>
                
                <div className="mt-6 p-4 rounded-lg bg-[#F7984A]/10 text-[#F7984A]">
                  <div className="flex items-start">
                    <ShieldCheck className="w-5 h-5 mt-0.5 mr-3 flex-shrink-0" />
                    <p className="text-sm">
                      For significant changes to this Privacy Policy, we will make reasonable efforts to notify you, such as by sending an email 
                      to the email address associated with your account or by placing a prominent notice on our website.
                    </p>
                  </div>
                </div>
              </section>

              {/* Contact Us */}
              <section id="contact-us" className="mb-12 p-8 rounded-2xl bg-white/[0.02] backdrop-blur-sm border border-white/10">
                <h2 className="text-2xl font-bold mb-4 flex items-center text-white">
                  <span className="bg-gradient-to-r from-[#F7984A] via-[#F7984A] to-[#F7984A]/70 bg-clip-text text-transparent">
                    11. Contact Us
                    </span>
                </h2>
                
                <p className="text-gray-300 leading-relaxed">
                  If you have any questions or concerns about this Privacy Policy or our privacy practices, please contact us at:
                </p>
                
                <div className="mt-6 space-y-4 text-gray-300">
                  <div className="flex items-start">
                    <div className="mr-3 w-10 h-10 rounded-full bg-[#F7984A]/10 flex items-center justify-center flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#F7984A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-white font-medium">Email</h3>
                      <p className="text-sm">privacy@blockchainbay.com</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="mr-3 w-10 h-10 rounded-full bg-[#F7984A]/10 flex items-center justify-center flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#F7984A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-white font-medium">Phone</h3>
                      <p className="text-sm">+1 (555) 123-4567</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="mr-3 w-10 h-10 rounded-full bg-[#F7984A]/10 flex items-center justify-center flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#F7984A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-white font-medium">Address</h3>
                      <p className="text-sm">123 Blockchain Avenue, Suite 500</p>
                      <p className="text-sm">San Francisco, CA 94103</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 pt-6 border-t border-white/5">
                  <Link 
                    href="/contact" 
                    className="inline-flex items-center px-5 py-3 rounded-lg bg-[#F7984A] text-white font-medium hover:bg-[#F7984A]/90 transition-colors"
                  >
                    Contact Our Privacy Team
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </Link>
                </div>
              </section>
            </div>
            
            {/* Back to top button - fixed position */}
            <div className="fixed bottom-8 right-8 z-50">
              <a 
                href="#introduction" 
                className="flex items-center justify-center w-12 h-12 rounded-full bg-[#F7984A]/80 text-white shadow-lg hover:bg-[#F7984A] transition-colors"
                aria-label="Back to top"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>

       <Footer className="relative z-20"/>         

    </main>
  );
}

