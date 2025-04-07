// hooks/useCookieConsent.ts
"use client";

import { useEffect, useState } from "react";
import cookieConsentManager, { CookiePreferences } from "@/services/cookieConsentManager";

export const useCookieConsent = () => {
  const [preferences, setPreferences] = useState<CookiePreferences>(
    cookieConsentManager.getPreferences()
  );
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    // Update preferences from localStorage on client-side
    setPreferences(cookieConsentManager.getPreferences());
    
    // Update local state when preferences change
    const unsubscribe = cookieConsentManager.onPreferenceChange((newPreferences) => {
      setPreferences(newPreferences);
    });

    return unsubscribe;
  }, []);

  const hasConsent = (cookieType: keyof CookiePreferences): boolean => {
    return preferences[cookieType] === true;
  };

  const hasSetPreferences = (): boolean => {
    if (!isClient) return false;
    return cookieConsentManager.hasSetPreferences();
  };

  const savePreferences = (newPreferences: CookiePreferences): void => {
    cookieConsentManager.savePreferences(newPreferences);
  };

  return {
    preferences,
    hasConsent,
    hasSetPreferences,
    savePreferences,
    isClient,
  };
};