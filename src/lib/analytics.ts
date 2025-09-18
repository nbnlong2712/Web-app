// lib/analytics.ts
'use client';

import { useEffect } from 'react';

// Define types for our analytics events
export type AnalyticsEvent =
  | 'tool_card_view'
  | 'visit_click'
  | 'search_submit';

export interface EventProperties {
  [key: string]: string | number | boolean | null | undefined;
}

// Type guard for Plausible
function isPlausibleWindow(window: Window): window is Window & { plausible: (eventName: string, options?: { props?: Record<string, string | number | boolean | null | undefined>; u?: string }) => void } {
  return typeof (window as unknown as { plausible: unknown }).plausible !== 'undefined';
}

// Type guard for Gtag
function isGtagWindow(window: Window): window is Window & { gtag: (command: string, action: string, params?: Record<string, string | number | boolean | null | undefined>) => void } {
  return typeof (window as unknown as { gtag: unknown }).gtag !== 'undefined';
}

// Analytics provider interface
interface AnalyticsProvider {
  initialize(): void;
  track(event: AnalyticsEvent, properties?: EventProperties): void;
  pageview(url: string): void;
}

// Plausible Analytics Provider
class PlausibleProvider implements AnalyticsProvider {
  private plausible: ((eventName: string, options?: { props?: Record<string, string | number | boolean | null | undefined>; u?: string }) => void) | undefined;

  initialize(): void {
    if (typeof window !== 'undefined' && isPlausibleWindow(window)) {
      this.plausible = window.plausible;
    }
  }

  track(event: AnalyticsEvent, properties?: EventProperties): void {
    if (this.plausible) {
      this.plausible(event, { props: properties });
    }
  }

  pageview(url: string): void {
    if (this.plausible) {
      this.plausible('pageview', { u: url });
    }
  }
}

// Google Analytics Provider
class GoogleAnalyticsProvider implements AnalyticsProvider {
  private gtag: ((command: string, action: string, params?: Record<string, string | number | boolean | null | undefined>) => void) | undefined;

  initialize(): void {
    if (typeof window !== 'undefined' && isGtagWindow(window)) {
      this.gtag = window.gtag;
    }
  }

  track(event: AnalyticsEvent, properties?: EventProperties): void {
    if (this.gtag) {
      this.gtag('event', event, properties);
    }
  }

  pageview(url: string): void {
    if (this.gtag) {
      this.gtag('config', process.env.NEXT_PUBLIC_GA_ID || '', {
        page_path: url,
      });
    }
  }
}

// No-op provider for when analytics is disabled
class NoopProvider implements AnalyticsProvider {
  initialize(): void {}
  track(): void {}
  pageview(): void {}
}

// Analytics manager class
class AnalyticsManager {
  private provider: AnalyticsProvider;
  private initialized: boolean = false;

  constructor() {
    // Determine which provider to use based on environment variables
    if (process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN) {
      this.provider = new PlausibleProvider();
    } else if (process.env.NEXT_PUBLIC_GA_ID) {
      this.provider = new GoogleAnalyticsProvider();
    } else {
      this.provider = new NoopProvider();
    }
  }

  initialize(): void {
    if (!this.initialized) {
      this.provider.initialize();
      this.initialized = true;
    }
  }

  track(event: AnalyticsEvent, properties?: EventProperties): void {
    if (this.initialized) {
      this.provider.track(event, properties);
    }
  }

  pageview(url: string): void {
    if (this.initialized) {
      this.provider.pageview(url);
    }
  }
}

// Create singleton instance
const analyticsManager = new AnalyticsManager();

// Hook for initializing analytics
export function useAnalytics(): void {
  useEffect(() => {
    analyticsManager.initialize();
  }, []);
}

// Component for initializing analytics
export function AnalyticsScript() {
  useAnalytics();
  return null;
}

// Function to track events
export function trackEvent(event: AnalyticsEvent, properties?: EventProperties): void {
  analyticsManager.track(event, properties);
}

// Function to track page views
export function trackPageview(url: string): void {
  analyticsManager.pageview(url);
}

// Export the analytics manager for direct access if needed
export { analyticsManager };