"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, X, Send, Bot, ArrowRight, Cpu, Search, 
  Layers, UserCheck, RefreshCw, Compass, ShieldCheck, 
  Zap, CheckCircle2, Terminal, Building2, Check,
  Copy, FileText, ArrowDown, ChevronRight, Lock, Calendar, Loader2,
  HelpCircle, MessageSquare
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { trackEvent, ConversionEvents } from "@/lib/analytics";
import { 
  CONCIERGE_OPENING_MESSAGE,
  CONCIERGE_STARTERS, 
  INDUSTRIES,
  SCALES,
  ENGAGEMENT_OPTIONS,
  generateCustomPath,
  CustomPathResult,
  QualificationTier,
  AiConciergeStarter
} from "@/lib/ai-concierge-data";

export interface OpenConciergeDetail {
  starterId?: string;
  industryId?: string;
  scaleId?: string;
  engagementId?: string;
  challenge?: string;
  contextSource?: "assessment" | "roi" | "direct" | "showcase";
  assessmentContext?: {
    domain?: string;
    maturityScore?: number;
    priorityObjectives?: string[];
  };
  roiContext?: {
    teamSize?: number;
    targetDepartment?: string;
    estimatedSavings?: string;
    laborHoursRecovered?: string;
  };
}

interface ConciergeApiResponse {
  isRealLlm: boolean;
  provider: string;
  model: string;
  notice?: string;
  conversationReply: string;
  opportunity: {
    challenge: string;
    recommendedApproach: string;
    likelyComponents: string[];
    enterpriseConsiderations: string[];
    suggestedNextStep: string;
    qualificationTier: QualificationTier;
    confidenceOrAssumptions: string[];
  };
}

export function AiConciergeModal() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedStarterId, setSelectedStarterId] = React.useState<string | null>(null);
  const [selectedIndustryId, setSelectedIndustryId] = React.useState<string | null>(null);
  const [selectedScaleId, setSelectedScaleId] = React.useState<string | null>(null);
  const [selectedEngagementId, setSelectedEngagementId] = React.useState<string | null>(null);
  const [customText, setCustomText] = React.useState("");
  const [isThinking, setIsThinking] = React.useState(false);
  const [copied, setCopied] = React.useState(false);

  // Attached Context (from Scoper or ROI Estimator)
  const [attachedContext, setAttachedContext] = React.useState<OpenConciergeDetail | null>(null);

  // Conversation & AI Response State
  const [conversationHistory, setConversationHistory] = React.useState<{ role: "user" | "assistant"; content: string }[]>([]);
  const [conciergeResult, setConciergeResult] = React.useState<ConciergeApiResponse | null>(null);

  // In-modal Lead Capture State
  const [showLeadForm, setShowLeadForm] = React.useState(false);
  const [leadName, setLeadName] = React.useState("");
  const [leadEmail, setLeadEmail] = React.useState("");
  const [leadCompany, setLeadCompany] = React.useState("");
  const [leadRole, setLeadRole] = React.useState("");
  const [isSubmittingLead, setIsSubmittingLead] = React.useState(false);
  const [leadSubmitted, setLeadSubmitted] = React.useState(false);
  const [leadError, setLeadError] = React.useState("");

  // Global event listener to open concierge from anywhere with optional context
  React.useEffect(() => {
    const handleOpen = (e: CustomEvent<OpenConciergeDetail>) => {
      setIsOpen(true);
      trackEvent(ConversionEvents.CTA_TALK_TO_AI, { trigger: "event_listener" });
      trackEvent(ConversionEvents.AI_CONCIERGE_STARTED);

      if (e.detail) {
        setAttachedContext(e.detail);
        if (e.detail.industryId) {
          setSelectedIndustryId(e.detail.industryId);
        }
        if (e.detail.starterId) {
          triggerQuery(e.detail.starterId, undefined, e.detail);
        } else if (e.detail.challenge) {
          triggerQuery("explore-opportunities", e.detail.challenge, e.detail);
        }
      }
    };

    window.addEventListener("open-ai-concierge" as any, handleOpen);
    return () => window.removeEventListener("open-ai-concierge" as any, handleOpen);
  }, []);

  // Handle ESC key
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const handleOpenModal = () => {
    setIsOpen(true);
    trackEvent(ConversionEvents.CTA_TALK_TO_AI, { trigger: "floating_pill" });
    trackEvent(ConversionEvents.AI_CONCIERGE_STARTED);
  };

  // Core API query execution
  const triggerQuery = async (
    starterId: string, 
    customQuery?: string, 
    overrideContext?: OpenConciergeDetail
  ) => {
    setSelectedStarterId(starterId);
    setIsThinking(true);
    setShowLeadForm(false);
    setLeadSubmitted(false);

    const activeContext = overrideContext || attachedContext;
    const starter = CONCIERGE_STARTERS.find((s) => s.id === starterId) || CONCIERGE_STARTERS[0];
    const userPrompt = customQuery?.trim() || starter.defaultChallenge;

    const newHistory = [...conversationHistory, { role: "user" as const, content: userPrompt }];
    setConversationHistory(newHistory);

    trackEvent(ConversionEvents.AI_CONCIERGE_MESSAGE_SENT, { starterId, queryLength: userPrompt.length });
    trackEvent(ConversionEvents.AI_CONCIERGE_LLM_REQUEST);

    try {
      const response = await fetch("/api/ai-concierge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newHistory,
          industry: selectedIndustryId || activeContext?.industryId || undefined,
          stage: selectedScaleId || activeContext?.scaleId || undefined,
          challenge: userPrompt,
          engagementType: selectedEngagementId || activeContext?.engagementId || undefined,
          contextSource: activeContext?.contextSource || "direct",
          assessmentContext: activeContext?.assessmentContext,
          roiContext: activeContext?.roiContext
        })
      });

      if (!response.ok) {
        throw new Error(`API returned HTTP ${response.status}`);
      }

      const data: ConciergeApiResponse = await response.json();
      setConciergeResult(data);

      setConversationHistory((prev) => [
        ...prev,
        { role: "assistant", content: data.conversationReply }
      ]);

      if (data.isRealLlm) {
        trackEvent(ConversionEvents.AI_CONCIERGE_LLM_SUCCESS, { model: data.model });
      } else {
        trackEvent(ConversionEvents.AI_CONCIERGE_LLM_FALLBACK, { provider: data.provider });
      }

      trackEvent(ConversionEvents.AI_CONCIERGE_COMPLETED, {
        tier: data.opportunity.qualificationTier,
        isRealLlm: data.isRealLlm
      });

    } catch (err) {
      console.warn("[AI Concierge] API call failed, falling back to local deterministic model:", err);
      trackEvent(ConversionEvents.AI_CONCIERGE_LLM_ERROR);

      // Safe Local Fallback
      const fallbackResult = generateCustomPath(
        starterId,
        selectedIndustryId || activeContext?.industryId || undefined,
        selectedScaleId || activeContext?.scaleId || undefined,
        userPrompt,
        selectedEngagementId || activeContext?.engagementId || undefined
      );

      const localResponse: ConciergeApiResponse = {
        isRealLlm: false,
        provider: "deterministic-local-engine",
        model: "rule-based-domain-v1",
        notice: "Notice: Live AI service endpoint was unreachable. Displaying local deterministic architecture blueprint.",
        conversationReply: `Here is a preliminary architectural framework aligned with your objectives. Our lead architects can refine these components during an architecture consultation.`,
        opportunity: {
          challenge: fallbackResult.challenge,
          recommendedApproach: fallbackResult.recommendedApproach,
          likelyComponents: fallbackResult.likelyComponents,
          enterpriseConsiderations: fallbackResult.enterpriseConsiderations,
          suggestedNextStep: fallbackResult.suggestedNextStep,
          qualificationTier: fallbackResult.qualificationTier,
          confidenceOrAssumptions: [
            "Generated from Indusnet AI enterprise pattern blueprints.",
            "Directional estimate based on input parameters."
          ]
        }
      };

      setConciergeResult(localResponse);
      setConversationHistory((prev) => [
        ...prev,
        { role: "assistant", content: localResponse.conversationReply }
      ]);
    } finally {
      setIsThinking(false);
    }
  };

  const handleStarterSelect = (id: string) => {
    triggerQuery(id);
  };

  const handleRefineIndustry = (industryId: string) => {
    setSelectedIndustryId(industryId);
    if (selectedStarterId || customText) {
      triggerQuery(selectedStarterId || "explore-opportunities", customText || undefined);
    }
  };

  const handleRefineEngagement = (engagementId: string) => {
    setSelectedEngagementId(engagementId);
    if (selectedStarterId || customText) {
      triggerQuery(selectedStarterId || "explore-opportunities", customText || undefined);
    }
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customText.trim()) return;

    const query = customText.trim();
    setCustomText("");
    triggerQuery(selectedStarterId || "build-application", query);
  };

  const handleReset = () => {
    setSelectedStarterId(null);
    setSelectedIndustryId(null);
    setSelectedScaleId(null);
    setSelectedEngagementId(null);
    setAttachedContext(null);
    setCustomText("");
    setConciergeResult(null);
    setConversationHistory([]);
    setShowLeadForm(false);
    setLeadSubmitted(false);
    setLeadError("");
  };

  const handleCopyBlueprint = () => {
    if (!conciergeResult) return;

    const text = `INDUSNET AI ARCHITECTURE BLUEPRINT
Engine: ${conciergeResult.isRealLlm ? `Live LLM (${conciergeResult.model})` : `Deterministic Domain Engine`}
Qualification Tier: ${conciergeResult.opportunity.qualificationTier}

Business Challenge:
${conciergeResult.opportunity.challenge}

Recommended AI Approach:
${conciergeResult.opportunity.recommendedApproach}

Likely System Components:
${conciergeResult.opportunity.likelyComponents.map((c) => `- ${c}`).join("\n")}

Enterprise Considerations:
${conciergeResult.opportunity.enterpriseConsiderations.map((ec) => `- ${ec}`).join("\n")}

Suggested Next Step:
${conciergeResult.opportunity.suggestedNextStep}

Directional notice: Preliminary architecture framework. Formal scoping conducted under NDA with an AI architect.`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadName || !leadEmail) {
      setLeadError("Please provide your name and corporate email.");
      return;
    }

    setIsSubmittingLead(true);
    setLeadError("");

    trackEvent(ConversionEvents.LEAD_FORM_STARTED, { form: "concierge_modal" });
    trackEvent(ConversionEvents.AI_CONCIERGE_HANDOFF_REQUESTED);

    try {
      const notes = `
AI CONCIERGE QUALIFIED OPPORTUNITY
Engine: ${conciergeResult?.isRealLlm ? `Live LLM (${conciergeResult.model})` : `Deterministic Domain Engine`}
Role / Title: ${leadRole || "Not specified"}
Qualification Tier: ${conciergeResult?.opportunity.qualificationTier || "Active Opportunity"}
Desired Engagement: ${selectedEngagementId || "AI Architecture Review"}

Attached Source: ${attachedContext?.contextSource || "Direct Concierge Session"}
${attachedContext?.assessmentContext ? `Scoper Domain: ${attachedContext.assessmentContext.domain} (Score: ${attachedContext.assessmentContext.maturityScore})` : ""}
${attachedContext?.roiContext ? `ROI Modeled: ${attachedContext.roiContext.targetDepartment} (${attachedContext.roiContext.estimatedSavings})` : ""}

Business Challenge:
${conciergeResult?.opportunity.challenge}

Recommended Approach:
${conciergeResult?.opportunity.recommendedApproach}

Key Components:
${conciergeResult?.opportunity.likelyComponents.join(", ")}

Enterprise Considerations:
${conciergeResult?.opportunity.enterpriseConsiderations.join("; ")}

Notice: AI-generated preliminary analysis - directional estimate.
      `.trim();

      const res = await fetch("/api/consultations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: leadName,
          email: leadEmail,
          company: leadCompany || "Enterprise Lead",
          service: `AI Architecture Consultation (${conciergeResult?.opportunity.qualificationTier || "Enterprise AI"})`,
          message: notes,
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (res.ok && data.success) {
        trackEvent(ConversionEvents.LEAD_FORM_SUBMITTED, {
          form: "concierge_modal",
          tier: conciergeResult?.opportunity.qualificationTier,
          isRealLlm: conciergeResult?.isRealLlm
        });
        setLeadSubmitted(true);
      } else {
        setLeadError(data.error || "Unable to forward details right now. Please email info@indusnet-ai.com.");
      }
    } catch {
      setLeadError("Network error. Please try again or reach out at info@indusnet-ai.com.");
    } finally {
      setIsSubmittingLead(false);
    }
  };

  const getStarterIcon = (iconName: string) => {
    switch (iconName) {
      case "Compass": return <Compass className="w-4 h-4 text-primary" />;
      case "Cpu": return <Cpu className="w-4 h-4 text-violet-500" />;
      case "Bot": return <Bot className="w-4 h-4 text-emerald-500" />;
      case "Search": return <Search className="w-4 h-4 text-cyan-500" />;
      case "Zap": return <Zap className="w-4 h-4 text-amber-500" />;
      case "RefreshCw": return <RefreshCw className="w-4 h-4 text-blue-500" />;
      case "Layers": return <Layers className="w-4 h-4 text-primary" />;
      default: return <UserCheck className="w-4 h-4 text-emerald-500" />;
    }
  };

  return (
    <>
      {/* Floating Concierge Launcher Pill */}
      <button
        onClick={handleOpenModal}
        className="fixed bottom-6 right-6 z-40 group flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-[#08111F]/95 border border-primary/40 shadow-2xl backdrop-blur-xl hover:border-primary hover:shadow-[0_0_30px_rgba(22,119,255,0.4)] transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        aria-label="Talk to Our AI Advisor"
      >
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary" />
        </span>
        <span className="text-xs font-bold tracking-wide text-foreground flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-primary group-hover:rotate-12 transition-transform" />
          Talk to Our AI
        </span>
        <span className="text-[10px] bg-primary/15 text-primary font-mono font-bold px-2 py-0.5 rounded-md border border-primary/30">
          Advisor
        </span>
      </button>

      {/* Modal Backdrop & Command Center */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-[#050B14]/85 backdrop-blur-md"
            />

            {/* Modal Dialog Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="relative w-full max-w-3xl max-h-[92vh] bg-[#08111F] border border-[#162238] shadow-[0_25px_80px_rgba(0,0,0,0.85)] rounded-2xl flex flex-col overflow-hidden z-10"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-[#162238] bg-[#050B14]/80">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center text-primary shadow-sm">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="font-heading font-bold text-sm text-foreground">
                        Indusnet AI Advisor
                      </h2>
                      <Badge variant="outline" className="text-[10px] py-0 px-1.5 border-primary/30 text-primary font-mono">
                        Enterprise Architecture Advisor
                      </Badge>
                    </div>
                    <p className="text-[11px] text-muted-foreground flex items-center gap-1.5 mt-0.5 font-mono">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Session Active · Production Architecture & Feasibility
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {attachedContext && (
                    <Badge className="bg-primary/15 border-primary/30 text-primary text-[10px] font-mono hidden sm:flex items-center gap-1">
                      <Layers className="w-3 h-3" />
                      {attachedContext.contextSource === "assessment"
                        ? `Scoper Context: ${attachedContext.assessmentContext?.domain || "Domain"}`
                        : attachedContext.contextSource === "roi"
                        ? `ROI Context: ${attachedContext.roiContext?.targetDepartment || "Operations"}`
                        : "Context Attached"}
                    </Badge>
                  )}
                  <button
                    onClick={() => setIsOpen(false)}
                    className="rounded-full p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors cursor-pointer"
                    aria-label="Close dialog"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Main Content Area */}
              <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
                {/* Initial Screen: Opening Greeting & Starters */}
                {!conciergeResult && !isThinking && (
                  <div className="space-y-6">
                    <div className="bg-[#0D1828] border border-[#162238] rounded-xl p-4 sm:p-5 flex items-start gap-3.5">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/25 text-primary flex items-center justify-center shrink-0 mt-0.5">
                        <Terminal className="w-4 h-4" />
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-sm font-bold text-foreground">
                          {CONCIERGE_OPENING_MESSAGE}
                        </h3>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          Select an enterprise mandate below or type your challenge. We formulate a tailored architectural roadmap, model sizing, and direct engineering pathway.
                        </p>
                      </div>
                    </div>

                    {/* Quick Filters for Progressive Refinement */}
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span className="text-[11px] font-mono text-muted-foreground font-semibold">Focus Sector:</span>
                      <select
                        value={selectedIndustryId || ""}
                        onChange={(e) => setSelectedIndustryId(e.target.value || null)}
                        className="bg-[#0D1828] border border-[#162238] rounded-lg px-2.5 py-1 text-xs text-foreground font-medium focus:outline-none focus:border-primary"
                      >
                        <option value="">All Sectors (Cross-Industry)</option>
                        {INDUSTRIES.map((ind) => (
                          <option key={ind.id} value={ind.id}>{ind.name}</option>
                        ))}
                      </select>

                      <span className="text-[11px] font-mono text-muted-foreground font-semibold ml-2">Engagement:</span>
                      <select
                        value={selectedEngagementId || ""}
                        onChange={(e) => setSelectedEngagementId(e.target.value || null)}
                        className="bg-[#0D1828] border border-[#162238] rounded-lg px-2.5 py-1 text-xs text-foreground font-medium focus:outline-none focus:border-primary"
                      >
                        <option value="">Any Stage (Auto-Detect)</option>
                        {ENGAGEMENT_OPTIONS.map((eng) => (
                          <option key={eng.id} value={eng.id}>{eng.label}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2.5">
                      <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-muted-foreground/80">
                        Select an Objective to Formulate Path
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {CONCIERGE_STARTERS.map((starter) => (
                          <button
                            key={starter.id}
                            onClick={() => handleStarterSelect(starter.id)}
                            className="group text-left p-3.5 rounded-xl border border-[#162238] hover:border-primary/50 bg-[#0D1828]/70 hover:bg-[#101D30] transition-all duration-200 flex flex-col justify-between gap-2 shadow-sm cursor-pointer"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-semibold text-primary/90 uppercase tracking-wide font-mono">
                                {starter.tag}
                              </span>
                              <div className="w-6 h-6 rounded-md bg-[#08111F] border border-[#162238] flex items-center justify-center group-hover:border-primary/40 group-hover:bg-primary/10 transition-colors">
                                {getStarterIcon(starter.icon)}
                              </div>
                            </div>
                            <span className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors leading-snug">
                              {starter.label}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Synthesizing Indicator */}
                {isThinking && (
                  <div className="py-14 flex flex-col items-center justify-center space-y-4 text-center">
                    <div className="relative w-14 h-14 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center text-primary">
                      <Sparkles className="w-7 h-7 animate-pulse" />
                      <div className="absolute inset-0 rounded-2xl border-2 border-primary/30 animate-ping opacity-25" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-bold text-foreground">
                        Synthesizing Architecture Blueprint...
                      </p>
                      <p className="text-xs text-muted-foreground font-mono">
                        Evaluating Guardrails · Sizing Compute Boundaries · Verifying Compliance
                      </p>
                    </div>
                  </div>
                )}

                {/* Generated Recommended AI Path & Opportunity Assessment */}
                {conciergeResult && !isThinking && (
                  <div className="space-y-5">
                    {/* Control Bar: Reset & Filters */}
                    <div className="flex flex-wrap items-center justify-between gap-2 bg-[#0D1828] border border-[#162238] rounded-xl px-4 py-2.5 text-xs">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-muted-foreground font-mono text-[11px]">Sector:</span>
                        <select
                          value={selectedIndustryId || ""}
                          onChange={(e) => handleRefineIndustry(e.target.value)}
                          className="bg-[#08111F] border border-[#162238] rounded-md px-2 py-1 text-xs text-foreground font-medium focus:outline-none focus:border-primary"
                        >
                          <option value="">General Enterprise</option>
                          {INDUSTRIES.map((ind) => (
                            <option key={ind.id} value={ind.id}>{ind.name}</option>
                          ))}
                        </select>

                        <span className="text-muted-foreground font-mono text-[11px] ml-1">Stage:</span>
                        <select
                          value={selectedEngagementId || ""}
                          onChange={(e) => handleRefineEngagement(e.target.value)}
                          className="bg-[#08111F] border border-[#162238] rounded-md px-2 py-1 text-xs text-foreground font-medium focus:outline-none focus:border-primary"
                        >
                          <option value="">{conciergeResult.opportunity.qualificationTier}</option>
                          {ENGAGEMENT_OPTIONS.map((eng) => (
                            <option key={eng.id} value={eng.id}>{eng.label}</option>
                          ))}
                        </select>
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          onClick={handleCopyBlueprint}
                          className="text-[11px] text-muted-foreground hover:text-foreground font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          {copied ? "Copied" : "Copy Blueprint"}
                        </button>
                        <span className="text-[#162238]">|</span>
                        <button
                          onClick={handleReset}
                          className="text-[11px] text-primary hover:underline font-semibold cursor-pointer"
                        >
                          Reset
                        </button>
                      </div>
                    </div>

                    {/* Notice Disclosure if fallback or special mode */}
                    {conciergeResult.notice && (
                      <div className="bg-[#0D1828]/80 border border-amber-500/25 rounded-xl p-3 flex items-start gap-2.5">
                        <Lock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                        <p className="text-[11px] text-muted-foreground leading-relaxed font-mono">
                          {conciergeResult.notice}
                        </p>
                      </div>
                    )}

                    {/* Conversational Advisor Reply */}
                    <div className="bg-[#0D1828] border border-[#162238] rounded-xl p-4 flex items-start gap-3.5">
                      <div className="w-8 h-8 rounded-lg bg-primary/15 border border-primary/30 text-primary flex items-center justify-center shrink-0 mt-0.5">
                        <Bot className="w-4 h-4" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-foreground">Indusnet Architecture Advisor</span>
                          {conciergeResult.isRealLlm ? (
                            <Badge className="bg-emerald-500/10 border-emerald-500/25 text-emerald-400 font-mono text-[9px] px-1.5 py-0">
                              Live Model · {conciergeResult.model}
                            </Badge>
                          ) : (
                            <Badge className="bg-amber-500/10 border-amber-500/25 text-amber-400 font-mono text-[9px] px-1.5 py-0">
                              Deterministic Engine
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {conciergeResult.conversationReply}
                        </p>
                      </div>
                    </div>

                    {/* Structured Blueprint Container: "Your AI Opportunity" */}
                    <div className="bg-[#0D1828]/60 border border-[#162238] rounded-xl p-5 shadow-sm space-y-5">
                      <div className="flex items-center justify-between border-b border-[#162238] pb-3">
                        <div className="flex items-center gap-2">
                          <Badge className="bg-primary/10 border-primary/25 text-primary text-[10px] font-mono">
                            Opportunity Brief
                          </Badge>
                          <h3 className="text-sm font-bold text-foreground">Your AI Opportunity</h3>
                        </div>
                        <Badge className="bg-muted text-muted-foreground border-border text-[10px] font-mono">
                          {conciergeResult.opportunity.qualificationTier}
                        </Badge>
                      </div>

                      {/* 1. Business Challenge */}
                      <div className="space-y-1.5">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground font-bold flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                          BUSINESS CHALLENGE
                        </span>
                        <div className="p-3 rounded-lg bg-[#08111F] border border-[#162238] text-xs text-foreground leading-relaxed">
                          {conciergeResult.opportunity.challenge}
                        </div>
                      </div>

                      {/* 2. Potential AI Approach */}
                      <div className="space-y-1.5">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground font-bold flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                          POTENTIAL AI APPROACH
                        </span>
                        <div className="p-3 rounded-lg bg-primary/10 border border-primary/30 text-xs font-bold text-foreground">
                          {conciergeResult.opportunity.recommendedApproach}
                        </div>
                      </div>

                      {/* 3. Likely System Components */}
                      <div className="space-y-2">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground font-bold flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
                          LIKELY SYSTEM COMPONENTS
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                          {conciergeResult.opportunity.likelyComponents.map((comp, i) => (
                            <div key={i} className="flex items-center gap-2 p-2.5 rounded-lg bg-[#08111F] border border-[#162238]">
                              <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />
                              <span className="text-foreground text-[11px] font-medium">{comp}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* 4. Enterprise Considerations */}
                      <div className="space-y-2">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground font-bold flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          ENTERPRISE CONSIDERATIONS
                        </span>
                        <div className="space-y-1.5">
                          {conciergeResult.opportunity.enterpriseConsiderations.map((ec, i) => (
                            <div key={i} className="flex items-start gap-2 p-2 rounded-lg bg-[#08111F] border border-[#162238] text-xs">
                              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                              <span className="text-muted-foreground text-[11px] leading-relaxed">{ec}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* 5. Suggested Next Step */}
                      <div className="space-y-1.5 bg-primary/5 border border-primary/20 rounded-xl p-3.5">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-primary font-bold block">
                          SUGGESTED NEXT STEP
                        </span>
                        <p className="text-xs text-foreground font-medium leading-relaxed">
                          {conciergeResult.opportunity.suggestedNextStep}
                        </p>
                      </div>

                      {/* Assumptions and Directional Notice */}
                      <div className="pt-2 border-t border-[#162238] text-xs space-y-2">
                        {conciergeResult.opportunity.confidenceOrAssumptions && conciergeResult.opportunity.confidenceOrAssumptions.length > 0 && (
                          <div className="p-2.5 rounded-lg bg-[#08111F] border border-[#162238] text-[11px] text-muted-foreground">
                            <span className="font-semibold text-foreground font-mono">Assumptions & Baseline:</span>{" "}
                            {conciergeResult.opportunity.confidenceOrAssumptions.join(" ")}
                          </div>
                        )}
                        <p className="text-[10px] text-muted-foreground/60 italic text-center font-mono">
                          Directional opportunity summary based on provided inputs. Not a validated commercial business case or contractual guarantee.
                        </p>
                      </div>
                    </div>

                    {/* Integrated Lead Capture: "Would you like an AI architect to review this opportunity with you?" */}
                    <div className="bg-[#08111F] border border-[#162238] rounded-xl p-5 shadow-sm space-y-4">
                      {!leadSubmitted ? (
                        <div className="space-y-4">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#162238] pb-3">
                            <div>
                              <h4 className="text-xs sm:text-sm font-bold text-foreground">
                                Would you like an AI architect to review this opportunity with you?
                              </h4>
                              <p className="text-[11px] text-muted-foreground mt-0.5">
                                Connect directly with our enterprise solutions engineering team to review technical feasibility.
                              </p>
                            </div>
                            {!showLeadForm && (
                              <Button
                                size="sm"
                                onClick={() => setShowLeadForm(true)}
                                className="rounded-full bg-primary text-white hover:bg-primary/90 text-xs px-4 font-bold shrink-0 cursor-pointer shadow-md shadow-primary/20"
                              >
                                Connect with Architect
                              </Button>
                            )}
                          </div>

                          {showLeadForm && (
                            <form onSubmit={handleLeadSubmit} className="space-y-3.5 pt-1">
                              {leadError && (
                                <div className="text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-lg p-2.5 font-mono">
                                  {leadError}
                                </div>
                              )}

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div className="space-y-1">
                                  <label className="text-[10px] font-mono uppercase font-bold text-muted-foreground">Full Name *</label>
                                  <Input
                                    type="text"
                                    required
                                    placeholder="Jane Doe"
                                    value={leadName}
                                    onChange={(e) => setLeadName(e.target.value)}
                                    className="bg-[#0D1828] border-[#162238] text-xs rounded-lg"
                                  />
                                </div>
                                <div className="space-y-1">
                                  <label className="text-[10px] font-mono uppercase font-bold text-muted-foreground">Work Email *</label>
                                  <Input
                                    type="email"
                                    required
                                    placeholder="jane@enterprise.com"
                                    value={leadEmail}
                                    onChange={(e) => setLeadEmail(e.target.value)}
                                    className="bg-[#0D1828] border-[#162238] text-xs rounded-lg"
                                  />
                                </div>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div className="space-y-1">
                                  <label className="text-[10px] font-mono uppercase font-bold text-muted-foreground">Company Name</label>
                                  <Input
                                    type="text"
                                    placeholder="Acme Corp"
                                    value={leadCompany}
                                    onChange={(e) => setLeadCompany(e.target.value)}
                                    className="bg-[#0D1828] border-[#162238] text-xs rounded-lg"
                                  />
                                </div>
                                <div className="space-y-1">
                                  <label className="text-[10px] font-mono uppercase font-bold text-muted-foreground">Role / Designation</label>
                                  <Input
                                    type="text"
                                    placeholder="Head of Architecture"
                                    value={leadRole}
                                    onChange={(e) => setLeadRole(e.target.value)}
                                    className="bg-[#0D1828] border-[#162238] text-xs rounded-lg"
                                  />
                                </div>
                              </div>

                              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                                <span className="text-[10px] text-muted-foreground/80 italic">
                                  Privacy: Details are used strictly to review architecture feasibility. No third-party sharing.
                                </span>
                                <Button
                                  type="submit"
                                  size="sm"
                                  disabled={isSubmittingLead}
                                  className="rounded-full bg-primary text-white hover:bg-primary/90 text-xs px-6 font-bold cursor-pointer w-full sm:w-auto shadow-md shadow-primary/20"
                                >
                                  {isSubmittingLead ? (
                                    <span className="flex items-center gap-1.5">
                                      <Loader2 className="w-3.5 h-3.5 animate-spin" /> Forwarding...
                                    </span>
                                  ) : (
                                    <span className="flex items-center gap-1.5">
                                      Discuss Architecture <ArrowRight className="w-3.5 h-3.5" />
                                    </span>
                                  )}
                                </Button>
                              </div>
                            </form>
                          )}
                        </div>
                      ) : (
                        <div className="py-4 text-center space-y-2">
                          <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
                            <CheckCircle2 className="w-5 h-5" />
                          </div>
                          <h4 className="text-sm font-bold text-foreground">Opportunity Summary Dispatched</h4>
                          <p className="text-xs text-muted-foreground max-w-md mx-auto leading-relaxed">
                            Thank you, <strong>{leadName}</strong>. Our enterprise solutions engineering team will review your specifications and contact you at <span className="text-foreground font-semibold">{leadEmail}</span>.
                          </p>
                          <div className="pt-2 flex flex-wrap items-center justify-center gap-2">
                            <Button
                              asChild
                              size="sm"
                              variant="outline"
                              className="rounded-full text-xs bg-[#0D1828] border-[#162238]"
                            >
                              <Link 
                                href={`/contact?service=${encodeURIComponent("AI Architecture Consultation")}`}
                                onClick={() => setIsOpen(false)}
                                className="flex items-center gap-1.5"
                              >
                                <Calendar className="w-3 h-3 text-primary" />
                                Schedule a Call on Calendar
                              </Link>
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => setIsOpen(false)}
                              className="rounded-full bg-primary text-white text-xs px-4"
                            >
                              Close Advisor
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Footer CTA & Input */}
              <div className="px-6 py-4 border-t border-[#162238] bg-[#050B14]/90 space-y-3">
                <form onSubmit={handleCustomSubmit} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={customText}
                    onChange={(e) => setCustomText(e.target.value)}
                    placeholder={
                      conciergeResult
                        ? "Ask a follow-up question (e.g. 'How do we isolate data inside our private AWS VPC?')"
                        : "Type your enterprise challenge (e.g. 'How do we connect clinical EHR notes to an open-source LLM?')"
                    }
                    className="flex-1 bg-[#0D1828] border border-[#162238] rounded-full px-4 py-2 text-xs text-foreground focus:outline-none focus:border-primary transition-colors placeholder:text-muted-foreground"
                  />
                  <Button
                    type="submit"
                    size="sm"
                    disabled={!customText.trim() || isThinking}
                    className="rounded-full bg-primary text-white hover:bg-primary/90 px-4 text-xs h-9 font-bold shrink-0 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5 mr-1" />
                    {conciergeResult ? "Ask" : "Formulate Path"}
                  </Button>
                </form>

                {conciergeResult && (
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-1">
                    <span className="text-[11px] text-muted-foreground font-mono">
                      Prefer direct human architecture review?
                    </span>
                    <Link
                      href={`/contact?service=${encodeURIComponent("AI Architecture Consultation")}&challenge=${encodeURIComponent(conciergeResult.opportunity.challenge)}`}
                      onClick={() => setIsOpen(false)}
                      className="text-xs text-primary hover:underline font-bold flex items-center gap-1"
                    >
                      Discuss Architecture on Contact Page <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
