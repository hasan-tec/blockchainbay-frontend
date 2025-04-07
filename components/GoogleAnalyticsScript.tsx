// components/GoogleAnalyticsScript.tsx
"use client";

import Script from "next/script";
import { useEffect, useState } from "react";
import { useCookieConsent } from "@/hooks/useCookieConsent";

// Replace with your actual Google Analytics ID
const GA_MEASUREMENT_ID = 'G-XXXXXXXXXX';

export function GoogleAnalyticsScript() {
  const { hasConsent, isClient } = useCookieConsent();
  const [loadAnalytics, setLoadAnalytics] = useState(false);
  
  useEffect(() => {
    if (!isClient) return;
    
    // Only load Google Analytics if consent is given
    try {
      const analyticsConsent = hasConsent('analytics');
      setLoadAnalytics(analyticsConsent);
    } catch (error) {
      console.error("Error checking analytics consent:", error);
    }
  }, [hasConsent, isClient]);

  if (!isClient || !loadAnalytics) {
    return null;
  }

  return (
    <>
      {/* Google Analytics Script */}
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            
            gtag('config', '${GA_MEASUREMENT_ID}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
    </>
  );
}