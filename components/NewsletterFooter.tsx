import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Logo } from "./Navbar"
import { ReactNode } from "react"

export const NewsletterSection = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-transparent to-gray-900/30">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-gray-800/70 text-gray-300 text-sm font-medium mb-4">
            <span className="w-2 h-2 rounded-full bg-[#F7984A] mr-2"></span>
            Stay updated
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight text-white">
            Subscribe to our newsletter
          </h2>
          <p className="text-lg text-gray-300 mb-8">
            Get weekly updates on new crypto projects, tech news, podcast episodes, and exclusive giveaways.
          </p>
          <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email address"
              className="flex-grow px-4 py-3 bg-gray-800/70 border border-gray-700/50 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F7984A]/50 focus:border-[#F7984A]/50 transition-all"
            />
            <Button className="bg-[#F7984A] hover:bg-[#F7984A]/90 text-white">Subscribe</Button>
          </div>
          <p className="text-xs text-gray-400 mt-4">
            By subscribing, you agree to our Privacy Policy and consent to receive updates from our company.
          </p>
        </div>
      </div>
    </section>
  )
}

interface SocialIconProps {
  href: string;
  label: string;
  children: ReactNode;
}

export const SocialIcon = ({ href, label, children }: SocialIconProps) => {
  return (
    <Link
      href={href}
      className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
      aria-label={label}
    >
      {children}
    </Link>
  )
}

interface FooterLink {
  name: string;
  href: string;
}

interface FooterColumn {
  title: string;
  links: FooterLink[];
}

export const Footer = ({ className }: { className?: string }) => {
  const footerLinks: FooterColumn[] = [
    {
      title: "Projects",
      links: [
        { name: "Browse Projects", href: "/projects" },
        { name: "Submit Project", href: "#" },
        { name: "Verification", href: "#" },
        { name: "Categories", href: "#" },
      ],
    },
    {
      title: "Resources",
      links: [
        { name: "News", href: "#" },
        { name: "Podcasts", href: "#" },
        { name: "Giveaways", href: "#" },
        { name: "Store", href: "#" },
      ],
    },
    {
      title: "Company",
      links: [
        { name: "About", href: "#" },
        { name: "Careers", href: "#" },
        { name: "Contact", href: "#" },
        { name: "Privacy Policy", href: "#" },
      ],
    },
  ]

  return (
    <footer className={`border-t border-gray-800/50 pt-20 pb-10 ${className || ''}`}>
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 mb-16">
          <div className="md:col-span-2">
            <div className="mb-6">
              <Logo />
            </div>
            <p className="text-gray-300 mb-6">
              The premier destination for crypto enthusiasts to discover new projects, stay updated with the latest
              news, and connect with the community.
            </p>

            <div className="flex gap-4 mb-8">
              {/* Social Media Icons */}
              <SocialIcon href="#" label="Twitter">
                <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path>
                </svg>
              </SocialIcon>
              
              <SocialIcon href="#" label="Discord">
                <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.0371 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0785-.0371c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0368c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"></path>
                </svg>
              </SocialIcon>
              
              <SocialIcon href="#" label="Telegram">
                <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.96 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"></path>
                </svg>
              </SocialIcon>
              
              <SocialIcon href="#" label="YouTube">
                <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"></path>
                </svg>
              </SocialIcon>
            
              
            </div>
          </div>

          {/* Footer columns */}
          {footerLinks.map((column, colIndex) => (
            <div key={colIndex} className="space-y-4">
              <h3 className="font-bold text-lg">{column.title}</h3>
              <ul className="space-y-2">
                {column.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link href={link.href} className="text-gray-400 hover:text-white transition-colors">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-800/50 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">© 2025 BlockChainBay. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <Link href="#" className="text-gray-500 hover:text-white text-sm transition-colors">
              Terms
            </Link>
            <Link href="#" className="text-gray-500 hover:text-white text-sm transition-colors">
              Privacy
            </Link>
            <Link href="#" className="text-gray-500 hover:text-white text-sm transition-colors">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default { NewsletterSection, Footer }