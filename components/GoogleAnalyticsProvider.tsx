// components/GoogleAnalyticsProvider.tsx
"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import googleAnalytics from "@/services/googleAnalytics";

export function GoogleAnalyticsProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isClient, setIsClient] = useState(false);

  // Handle client-side initialization
  useEffect(() => {
    setIsClient(true);
    googleAnalytics.initialize();
  }, []);

  // Track page views
  useEffect(() => {
    if (!isClient || !pathname) return;
    
    try {
      const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : "");
      googleAnalytics.pageView(url);
    } catch (error) {
      console.error("Error tracking page view:", error);
    }
  }, [pathname, searchParams, isClient]);

  return <>{children}</>;
}