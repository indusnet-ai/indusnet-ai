// Google Analytics 4 & Custom Conversion Event Tracking

declare global {
  interface Window {
    gtag?: (command: string, ...args: any[]) => void;
    dataLayer?: any[];
  }
}

export const ConversionEvents = {
  CONTACT_SUBMIT: "contact_form_submit",
  NEWSLETTER_SIGNUP: "newsletter_signup",
  AI_SCOPER_COMPLETE: "ai_scoper_complete",
} as const;

export function trackEvent(
  action: string,
  params: Record<string, any> = {}
): void {
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("event", action, {
      ...params,
      send_to: process.env.NEXT_PUBLIC_GA_ID,
    });
  } else if (process.env.NODE_ENV !== "production") {
    console.log(`[Analytics Diagnostic Event]: ${action}`, params);
  }
}
