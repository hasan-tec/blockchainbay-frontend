"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import cookieConsentManager, { CookiePreferences } from "@/services/cookieConsentManager"

export function CookiePolicyModal({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true, // Always enabled
    functional: false,
    analytics: false,
    marketing: false,
  })
  const [mounted, setMounted] = useState(false)

  // Handle client-side rendering
  useEffect(() => {
    setMounted(true)
  }, [])

  // Load preferences when modal opens
  useEffect(() => {
    if (mounted && open) {
      const currentPrefs = cookieConsentManager.getPreferences();
      setPreferences(currentPrefs);
    }
  }, [open, mounted]);

  const handleAcceptAll = () => {
    const allAccepted: CookiePreferences = {
      necessary: true,
      functional: true,
      analytics: true,
      marketing: true,
    }
    
    setPreferences(allAccepted)
    cookieConsentManager.savePreferences(allAccepted)
    onOpenChange(false)
  }

  const handleSavePreferences = () => {
    cookieConsentManager.savePreferences(preferences)
    onOpenChange(false)
  }

  // Avoid rendering on server
  if (!mounted) {
    return null
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto bg-[#0a0b14] border border-[#1e2132] text-white">
        <DialogHeader>
          <DialogTitle className="text-xl text-white">Cookie Policy</DialogTitle>
          <DialogDescription className="text-gray-300">
            We use cookies to enhance your browsing experience, serve personalized ads or content, and analyze our
            traffic.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="overview" className="mt-4">
          <TabsList className="grid w-full grid-cols-2 bg-[#141525]">
            <TabsTrigger value="overview" className="data-[state=active]:bg-[#ff8a00] data-[state=active]:text-white">
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="preferences"
              className="data-[state=active]:bg-[#ff8a00] data-[state=active]:text-white"
            >
              Cookie Preferences
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4 mt-4">
            <div className="text-sm space-y-4 text-gray-300">
              <p>
                BlockchainBay uses cookies and similar technologies to provide, maintain, and improve our services. We
                also use them to personalize content and ads, provide social media features, and analyze our traffic.
              </p>

              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="what-are-cookies" className="border-[#1e2132]">
                  <AccordionTrigger className="text-white hover:text-[#ff8a00]">What are cookies?</AccordionTrigger>
                  <AccordionContent className="text-gray-300">
                    <p className="mb-2">
                      Cookies are small text files that are stored on your device when you visit a website. They are
                      widely used to make websites work more efficiently and provide information to the website owners.
                    </p>
                    <p>
                      Cookies help us recognize your device and provide you with a personalized experience. They also
                      help us understand which parts of our website are most popular, where our visitors go, and how
                      much time they spend there.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="types-of-cookies" className="border-[#1e2132]">
                  <AccordionTrigger className="text-white hover:text-[#ff8a00]">
                    Types of cookies we use
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-300">
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong className="text-white">Necessary cookies:</strong> These cookies are essential for you
                        to browse the website and use its features, such as accessing secure areas of the site.
                      </li>
                      <li>
                        <strong className="text-white">Functional cookies:</strong> These cookies allow the website to
                        remember choices you make (such as your username, language, or region) and provide enhanced,
                        more personal features.
                      </li>
                      <li>
                        <strong className="text-white">Analytics cookies:</strong> These cookies collect information
                        about how you use our website, which pages you visited and which links you clicked on. All of
                        the data is anonymized and cannot be used to identify you.
                      </li>
                      <li>
                        <strong className="text-white">Marketing cookies:</strong> These cookies track your online
                        activity to help advertisers deliver more relevant advertising or to limit how many times you
                        see an ad.
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="third-party" className="border-[#1e2132]">
                  <AccordionTrigger className="text-white hover:text-[#ff8a00]">Third-party cookies</AccordionTrigger>
                  <AccordionContent className="text-gray-300">
                    <p className="mb-2">
                      In addition to our own cookies, we may also use various third-party cookies to report usage
                      statistics of the service, deliver advertisements on and through the service, and so on.
                    </p>
                    <p>
                      These may include cookies from services such as Google Analytics, Google Ads, Facebook, Twitter,
                      and other social media platforms.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="manage-cookies" className="border-[#1e2132]">
                  <AccordionTrigger className="text-white hover:text-[#ff8a00]">How to manage cookies</AccordionTrigger>
                  <AccordionContent className="text-gray-300">
                    <p className="mb-2">
                      You can set your browser to refuse all or some browser cookies, or to alert you when websites set
                      or access cookies. If you disable or refuse cookies, please note that some parts of this website
                      may become inaccessible or not function properly.
                    </p>
                    <p>
                      You can also manage your cookie preferences through the "Cookie Preferences" tab in this dialog.
                    </p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </TabsContent>

          <TabsContent value="preferences" className="space-y-6 mt-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-md bg-[#141525] border border-[#1e2132]">
                <div>
                  <h4 className="font-medium text-white">Necessary Cookies</h4>
                  <p className="text-sm text-gray-400">
                    These cookies are essential for the website to function properly.
                  </p>
                </div>
                <Switch checked disabled className="data-[state=checked]:bg-[#ff8a00]" />
              </div>

              <div className="flex items-center justify-between p-3 rounded-md bg-[#141525] border border-[#1e2132]">
                <div>
                  <h4 className="font-medium text-white">Functional Cookies</h4>
                  <p className="text-sm text-gray-400">These cookies enable personalized features and functionality.</p>
                </div>
                <Switch
                  checked={preferences.functional}
                  onCheckedChange={(checked) => setPreferences({ ...preferences, functional: checked })}
                  className="data-[state=checked]:bg-[#ff8a00]"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-md bg-[#141525] border border-[#1e2132]">
                <div>
                  <h4 className="font-medium text-white">Analytics Cookies</h4>
                  <p className="text-sm text-gray-400">
                    These cookies help us understand how visitors interact with our website.
                  </p>
                </div>
                <Switch
                  checked={preferences.analytics}
                  onCheckedChange={(checked) => setPreferences({ ...preferences, analytics: checked })}
                  className="data-[state=checked]:bg-[#ff8a00]"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-md bg-[#141525] border border-[#1e2132]">
                <div>
                  <h4 className="font-medium text-white">Marketing Cookies</h4>
                  <p className="text-sm text-gray-400">
                    These cookies are used to track visitors across websites to display relevant advertisements.
                  </p>
                </div>
                <Switch
                  checked={preferences.marketing}
                  onCheckedChange={(checked) => setPreferences({ ...preferences, marketing: checked })}
                  className="data-[state=checked]:bg-[#ff8a00]"
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="sm:mr-auto border-[#1e2132] bg-black text-gray-300 hover:text-white hover:bg-[#141525]"
          >
            Close
          </Button>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleSavePreferences}
              className="border-[#1e2132] bg-black text-gray-300 hover:text-white hover:bg-[#141525]"
            >
              Save Preferences
            </Button>
            <Button onClick={handleAcceptAll} className="bg-[#ff8a00] hover:bg-[#e67e00] text-white">
              Accept All
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}