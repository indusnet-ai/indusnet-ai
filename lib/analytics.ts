// Google Analytics 4 & Custom Conversion Event Tracking

declare global {
  interface Window {
    gtag?: (command: string, ...args: any[]) => void;
    dataLayer?: any[];
  }
}

export const ConversionEvents = {
  // Core CTA Interactions
  CTA_TALK_TO_AI: "cta_talk_to_ai",
  CTA_DISCOVER_AI_OPPORTUNITY: "cta_discover_ai_opportunity",
  CTA_MODEL_BUSINESS_CASE: "cta_model_business_case",
  CTA_DISCUSS_ARCHITECTURE: "cta_discuss_architecture",
  CTA_EXPLORE_CAPABILITIES: "cta_explore_capabilities",

  // Interactive Tools Funnel
  AI_CONCIERGE_STARTED: "ai_concierge_started",
  AI_CONCIERGE_COMPLETED: "ai_concierge_completed",
  AI_CONCIERGE_MESSAGE_SENT: "ai_concierge_message_sent",
  AI_CONCIERGE_LLM_REQUEST: "ai_concierge_llm_request",
  AI_CONCIERGE_LLM_SUCCESS: "ai_concierge_llm_success",
  AI_CONCIERGE_LLM_FALLBACK: "ai_concierge_llm_fallback",
  AI_CONCIERGE_LLM_ERROR: "ai_concierge_llm_error",
  AI_CONCIERGE_HANDOFF_REQUESTED: "ai_concierge_handoff_requested",
  AI_SCOPER_STARTED: "ai_scoper_started",
  AI_SCOPER_COMPLETED: "ai_scoper_completed",
  AI_SCOPER_COMPLETE: "ai_scoper_complete", // backwards-compatible alias
  ROI_ESTIMATOR_STARTED: "roi_estimator_started",
  ROI_ESTIMATOR_COMPLETED: "roi_estimator_completed",

  // Lead Generation & Handoff
  LEAD_FORM_STARTED: "lead_form_started",
  LEAD_FORM_SUBMITTED: "lead_form_submitted",
  CONTACT_SUBMIT: "contact_form_submit", // backwards-compatible alias
  NEWSLETTER_SIGNUP: "newsletter_signup",
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
