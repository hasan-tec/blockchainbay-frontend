// services/googleAnalytics.ts
"use client";

import cookieConsentManager from './cookieConsentManager';

// Replace with your actual Google Analytics ID
const GA_MEASUREMENT_ID = 'G-6BNQZ0VS2C';

export class GoogleAnalyticsService {
  private static instance: GoogleAnalyticsService;
  private isInitialized: boolean = false;
  private isClient: boolean;

  // Singleton pattern
  public static getInstance(): GoogleAnalyticsService {
    if (!GoogleAnalyticsService.instance) {
      GoogleAnalyticsService.instance = new GoogleAnalyticsService();
    }
    return GoogleAnalyticsService.instance;
  }

  constructor() {
    this.isClient = typeof window !== 'undefined';
    if (this.isClient) {
      // Set up consent change listener
      cookieConsentManager.onPreferenceChange((preferences) => {
        this.updateConsent(preferences.analytics);
      });
    }
  }

  /**
   * Initialize Google Analytics with proper consent modes
   */
  public initialize(): void {
    if (!this.isClient || this.isInitialized) return;

    try {
      // Check if analytics cookies are allowed
      const hasAnalyticsConsent = cookieConsentManager.hasConsent('analytics');
      const hasMarketingConsent = cookieConsentManager.hasConsent('marketing');

      // Create the gtag function
      window.dataLayer = window.dataLayer || [];
      function gtag(...args: any[]) {
        window.dataLayer.push(arguments);
      }
      window.gtag = gtag;

      // Set default consent
      gtag('consent', 'default', {
        'ad_storage': hasMarketingConsent ? 'granted' : 'denied',
        'analytics_storage': hasAnalyticsConsent ? 'granted' : 'denied',
        'functionality_storage': cookieConsentManager.hasConsent('functional') ? 'granted' : 'denied',
        'personalization_storage': cookieConsentManager.hasConsent('functional') ? 'granted' : 'denied',
        'security_storage': 'granted', // Always allow security cookies
      });

      // Load Google Analytics script - moved to the dedicated script component
      // for better control over loading

      // Initialize GA
      gtag('js', new Date());
      gtag('config', GA_MEASUREMENT_ID, {
        page_path: window.location.pathname,
        // Only send page views if analytics is consented
        send_page_view: hasAnalyticsConsent
      });

      this.isInitialized = true;
    } catch (error) {
      console.error('Error initializing Google Analytics:', error);
    }
  }

  /**
   * Update consent status when user preferences change
   */
  private updateConsent(analyticsConsent: boolean): void {
    if (!this.isClient || !window.gtag) return;

    try {
      const hasMarketingConsent = cookieConsentManager.hasConsent('marketing');
      const hasFunctionalConsent = cookieConsentManager.hasConsent('functional');

      window.gtag('consent', 'update', {
        'ad_storage': hasMarketingConsent ? 'granted' : 'denied',
        'analytics_storage': analyticsConsent ? 'granted' : 'denied',
        'functionality_storage': hasFunctionalConsent ? 'granted' : 'denied',
        'personalization_storage': hasFunctionalConsent ? 'granted' : 'denied',
      });
    } catch (error) {
      console.error('Error updating consent:', error);
    }
  }

  /**
   * Track a page view
   */
  public pageView(path: string): void {
    if (!this.isClient || !window.gtag || !cookieConsentManager.hasConsent('analytics')) return;

    try {
      window.gtag('config', GA_MEASUREMENT_ID, {
        page_path: path,
      });
    } catch (error) {
      console.error('Error tracking page view:', error);
    }
  }

  /**
   * Track an event
   */
  public event(action: string, params?: any): void {
    if (!this.isClient || !window.gtag || !cookieConsentManager.hasConsent('analytics')) return;

    try {
      window.gtag('event', action, params);
    } catch (error) {
      console.error('Error tracking event:', error);
    }
  }
}

// Add types for window object
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

export default GoogleAnalyticsService.getInstance();