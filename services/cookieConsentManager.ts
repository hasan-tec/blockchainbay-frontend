// services/cookieConsentManager.ts
"use client";

export interface CookiePreferences {
  necessary: boolean;
  functional: boolean;
  analytics: boolean;
  marketing: boolean;
}

export class CookieConsentManager {
  private static instance: CookieConsentManager;
  private preferences: CookiePreferences = {
    necessary: true,
    functional: false,
    analytics: false,
    marketing: false
  };
  private consentCallback: ((preferences: CookiePreferences) => void)[] = [];
  private isClient: boolean;

  // Singleton pattern
  public static getInstance(): CookieConsentManager {
    if (!CookieConsentManager.instance) {
      CookieConsentManager.instance = new CookieConsentManager();
    }
    return CookieConsentManager.instance;
  }

  constructor() {
    this.isClient = typeof window !== 'undefined';
    if (this.isClient) {
      this.loadPreferences();
    }
  }

  public loadPreferences(): CookiePreferences {
    if (!this.isClient) return this.preferences;
    
    try {
      const savedPreferences = localStorage.getItem('cookiePreferences');
      if (savedPreferences) {
        this.preferences = { ...this.preferences, ...JSON.parse(savedPreferences) };
        // Necessary cookies are always true
        this.preferences.necessary = true;
      }
    } catch (error) {
      console.error('Error loading cookie preferences:', error);
    }
    return this.preferences;
  }

  public savePreferences(preferences: CookiePreferences): void {
    if (!this.isClient) return;
    
    try {
      // Ensure necessary cookies are always enabled
      const updatedPreferences = { ...preferences, necessary: true };
      this.preferences = updatedPreferences;
      localStorage.setItem('cookiePreferences', JSON.stringify(updatedPreferences));
      
      // Execute callbacks when preferences change
      this.notifyPreferenceChange(updatedPreferences);
      
    } catch (error) {
      console.error('Error saving cookie preferences:', error);
    }
  }

  public getPreferences(): CookiePreferences {
    return { ...this.preferences };
  }

  public hasConsent(cookieType: keyof CookiePreferences): boolean {
    return this.preferences[cookieType] === true;
  }

  public hasSetPreferences(): boolean {
    if (!this.isClient) return false;
    return localStorage.getItem('cookiePreferences') !== null;
  }

  public onPreferenceChange(callback: (preferences: CookiePreferences) => void): () => void {
    this.consentCallback.push(callback);
    
    // Return function to remove the callback
    return () => {
      this.consentCallback = this.consentCallback.filter(cb => cb !== callback);
    };
  }

  private notifyPreferenceChange(preferences: CookiePreferences): void {
    this.consentCallback.forEach(callback => callback(preferences));
  }
}

export default CookieConsentManager.getInstance();