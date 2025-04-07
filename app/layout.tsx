import type { Metadata } from "next";
import { Suspense } from 'react'; // 1. Import Suspense
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
// Make sure this path is correct - was CartContext in old, CartProvider in new
import { CartProvider } from "@/contexts/CartContext"; 
import { Toaster } from "@/components/ui/toaster";
import { CookieBanner } from "@/components/cookie-banner";
import { GoogleAnalyticsProvider } from "@/components/GoogleAnalyticsProvider";
import { GoogleAnalyticsScript } from "@/components/GoogleAnalyticsScript";

export const metadata: Metadata = {
  title: "BlockchainBay",
  description: "Where Knowledge Meets Opportunity, Join the Crypto Revolution.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <CartProvider>
            {/* 2. Wrap the component using useSearchParams */}
            <Suspense fallback={null}> 
              {/* 
                fallback={null} is often fine for background things 
                like analytics providers. You could put a loading 
                spinner here if it wrapped visible UI.
              */}
              <GoogleAnalyticsProvider>
                {/* 
                  GoogleAnalyticsScript can stay here or be moved inside 
                  GoogleAnalyticsProvider if it makes more sense logically.
                  Keeping it here is fine.
                 */}
                <GoogleAnalyticsScript /> 
                {children} {/* Your page content */}
                <Toaster />
                <CookieBanner />
              </GoogleAnalyticsProvider>
            </Suspense>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}