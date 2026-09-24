"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, X, Send, Bot, ArrowRight, Cpu, Search, 
  Layers, UserCheck, RefreshCw, Compass, ShieldCheck, 
  Clock, Zap, CheckCircle2, Terminal, Building2, Check,
  Copy, FileText, ArrowDown, ChevronRight, Lock, Calendar, Loader2
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
  AiConciergeStarter
} from "@/lib/ai-concierge-data";

export function AiConciergeModal() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedStarterId, setSelectedStarterId] = React.useState<string | null>(null);
  const [selectedIndustryId, setSelectedIndustryId] = React.useState<string | null>(null);
  const [selectedScaleId, setSelectedScaleId] = React.useState<string | null>(null);
  const [selectedEngagementId, setSelectedEngagementId] = React.useState<string | null>(null);
  const [customText, setCustomText] = React.useState("");
  const [isThinking, setIsThinking] = React.useState(false);
  const [generatedResult, setGeneratedResult] = React.useState<CustomPathResult | null>(null);
  const [copied, setCopied] = React.useState(false);

  // In-modal Lead Capture State
  const [showLeadForm, setShowLeadForm] = React.useState(false);
  const [leadName, setLeadName] = React.useState("");
  const [leadEmail, setLeadEmail] = React.useState("");
  const [leadCompany, setLeadCompany] = React.useState("");
  const [leadRole, setLeadRole] = React.useState("");
  const [isSubmittingLead, setIsSubmittingLead] = React.useState(false);
  const [leadSubmitted, setLeadSubmitted] = React.useState(false);
  const [leadError, setLeadError] = React.useState("");

  // Global event listener to open concierge from anywhere
  React.useEffect(() => {
    const handleOpen = (e: CustomEvent<{ starterId?: string }>) => {
      setIsOpen(true);
      trackEvent(ConversionEvents.CTA_TALK_TO_AI, { trigger: "event_listener" });
      trackEvent(ConversionEvents.AI_CONCIERGE_STARTED);
      if (e.detail?.starterId) {
        handleStarterSelect(e.detail.starterId);
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

  const handleStarterSelect = (id: string) => {
    setSelectedStarterId(id);
    setIsThinking(true);
    setGeneratedResult(null);
    setShowLeadForm(false);
    setLeadSubmitted(false);

    setTimeout(() => {
      const res = generateCustomPath(
        id, 
        selectedIndustryId || undefined, 
        selectedScaleId || undefined,
        undefined,
        selectedEngagementId || undefined
      );
      setGeneratedResult(res);
      setIsThinking(false);
      trackEvent(ConversionEvents.AI_CONCIERGE_COMPLETED, {
        starterId: id,
        tier: res.qualificationTier,
        industry: selectedIndustryId || "general"
      });
    }, 400);
  };

  const handleRefineIndustry = (industryId: string) => {
    setSelectedIndustryId(industryId);
    if (selectedStarterId) {
      setIsThinking(true);
      setTimeout(() => {
        const res = generateCustomPath(
          selectedStarterId, 
          industryId || undefined, 
          selectedScaleId || undefined,
          customText || undefined,
          selectedEngagementId || undefined
        );
        setGeneratedResult(res);
        setIsThinking(false);
      }, 300);
    }
  };

  const handleRefineEngagement = (engagementId: string) => {
    setSelectedEngagementId(engagementId);
    if (selectedStarterId || customText) {
      setIsThinking(true);
      setTimeout(() => {
        const res = generateCustomPath(
          selectedStarterId || "explore-opportunities", 
          selectedIndustryId || undefined, 
          selectedScaleId || undefined,
          customText || undefined,
          engagementId || undefined
        );
        setGeneratedResult(res);
        setIsThinking(false);
      }, 300);
    }
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customText.trim()) return;

    const query = customText.trim();
    setIsThinking(true);
    setSelectedStarterId("build-application");
    setShowLeadForm(false);
    setLeadSubmitted(false);

    setTimeout(() => {
      const res = generateCustomPath(
        "build-application", 
        selectedIndustryId || undefined, 
        selectedScaleId || undefined, 
        query,
        selectedEngagementId || undefined
      );
      setGeneratedResult(res);
      setIsThinking(false);
      trackEvent(ConversionEvents.AI_CONCIERGE_COMPLETED, {
        query_type: "custom",
        tier: res.qualificationTier
      });
    }, 450);
  };

  const handleReset = () => {
    setSelectedStarterId(null);
    setSelectedIndustryId(null);
    setSelectedScaleId(null);
    setSelectedEngagementId(null);
    setGeneratedResult(null);
    setCustomText("");
    setIsThinking(false);
    setShowLeadForm(false);
    setLeadSubmitted(false);
    setLeadError("");
  };

  const handleCopyBlueprint = () => {
    if (!generatedResult) return;
    const text = `INDUSNET AI — ARCHITECTURE OPPORTUNITY SUMMARY

YOUR AI OPPORTUNITY:
Business Challenge:
${generatedResult.challenge}

Potential AI Approach:
${generatedResult.recommendedApproach}

Likely System Components:
${generatedResult.likelyComponents.map((c) => `- ${c}`).join("\n")}

Enterprise Considerations:
${generatedResult.enterpriseConsiderations.map((ec) => `- ${ec}`).join("\n")}

Suggested Next Step:
${generatedResult.suggestedNextStep}

Target Architecture:
${generatedResult.targetArchitecture.map((a) => `${a.layer}: ${a.technology}`).join("\n")}

Estimated Timeline: ${generatedResult.timeline}
Impact Potential: ${generatedResult.roiProjection}
Notice: Directional assessment based on user inputs. Not a contractual guarantee.`;

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

    try {
      const notes = `
AI CONCIERGE QUALIFIED OPPORTUNITY
Role / Title: ${leadRole || "Not specified"}
Qualification Tier: ${generatedResult?.qualificationTier || "Active Opportunity"}
Desired Engagement: ${generatedResult?.engagementType || "AI Architecture Review"}

Business Challenge:
${generatedResult?.challenge}

Recommended Approach:
${generatedResult?.recommendedApproach}

Key Components:
${generatedResult?.likelyComponents.join(", ")}

Enterprise Considerations:
${generatedResult?.enterpriseConsiderations.join("; ")}
      `.trim();

      const res = await fetch("/api/consultations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: leadName,
          email: leadEmail,
          company: leadCompany || "Enterprise Lead",
          service: `AI Architecture Review (${generatedResult?.engagementType || "Enterprise AI"})`,
          message: notes,
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (res.ok && data.success) {
        trackEvent(ConversionEvents.LEAD_FORM_SUBMITTED, {
          form: "concierge_modal",
          tier: generatedResult?.qualificationTier,
          service: generatedResult?.engagementType
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
                      Session Active · Strategy to Production Synthesizer
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsOpen(false)}
                  className="rounded-full p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors cursor-pointer"
                  aria-label="Close dialog"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Main Content Area */}
              <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
                {/* Initial Screen: Opening Greeting & 8 Starters */}
                {!generatedResult && !isThinking && (
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
                        Formulating Enterprise AI Blueprint...
                      </p>
                      <p className="text-xs text-muted-foreground font-mono">
                        Evaluating Guardrails · Sizing Compute · Mapping Delivery
                      </p>
                    </div>
                  </div>
                )}

                {/* Generated Recommended AI Path & Opportunity Assessment */}
                {generatedResult && !isThinking && (
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
                          <option value="">{generatedResult.engagementType}</option>
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
                          {generatedResult.engagementType}
                        </Badge>
                      </div>

                      {/* 1. Business Challenge */}
                      <div className="space-y-1.5">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground font-bold flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                          BUSINESS CHALLENGE
                        </span>
                        <div className="p-3 rounded-lg bg-[#08111F] border border-[#162238] text-xs text-foreground leading-relaxed">
                          {generatedResult.challenge}
                        </div>
                      </div>

                      {/* 2. Potential AI Approach */}
                      <div className="space-y-1.5">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground font-bold flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                          POTENTIAL AI APPROACH
                        </span>
                        <div className="p-3 rounded-lg bg-primary/10 border border-primary/30 text-xs font-bold text-foreground">
                          {generatedResult.recommendedApproach}
                        </div>
                      </div>

                      {/* 3. Likely System Components */}
                      <div className="space-y-2">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground font-bold flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
                          LIKELY SYSTEM COMPONENTS
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                          {generatedResult.likelyComponents.map((comp, i) => (
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
                          {generatedResult.enterpriseConsiderations.map((ec, i) => (
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
                          {generatedResult.suggestedNextStep}
                        </p>
                      </div>

                      {/* Timeline & Impact Potential */}
                      <div className="pt-2 border-t border-[#162238] text-xs space-y-2">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="p-2.5 rounded-lg bg-[#08111F] border border-[#162238] flex items-center justify-between">
                            <span className="text-muted-foreground font-mono text-[11px]">Estimated Timeline:</span>
                            <span className="font-bold text-foreground font-mono">{generatedResult.timeline}</span>
                          </div>
                          <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/25 flex items-center justify-between gap-2">
                            <span className="text-muted-foreground font-mono text-[11px] shrink-0">Impact Potential:</span>
                            <span className="font-semibold text-amber-400 text-right">{generatedResult.roiProjection}</span>
                          </div>
                        </div>
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
                                href={`/contact?service=${encodeURIComponent(generatedResult?.engagementType || "AI Architecture")}`}
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
                {generatedResult ? (
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                    <p className="text-xs text-muted-foreground text-center sm:text-left font-mono">
                      Prefer full contact form?
                    </p>
                    <Button
                      size="sm"
                      asChild
                      variant="outline"
                      className="rounded-full bg-[#0D1828] border-[#162238] hover:border-primary/50 text-foreground text-xs px-5 shadow-xs w-full sm:w-auto font-bold"
                    >
                      <Link
                        href={generatedResult.nextStepUrl}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center justify-center gap-1.5 font-bold"
                      >
                        Discuss Architecture on Contact Page
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleCustomSubmit} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={customText}
                      onChange={(e) => setCustomText(e.target.value)}
                      placeholder="Type your challenge (e.g. 'How do we connect HIPAA clinical notes to an open-source LLM?')"
                      className="flex-1 bg-[#0D1828] border border-[#162238] rounded-full px-4 py-2 text-xs text-foreground focus:outline-none focus:border-primary transition-colors placeholder:text-muted-foreground"
                    />
                    <Button
                      type="submit"
                      size="sm"
                      disabled={!customText.trim()}
                      className="rounded-full bg-primary text-white hover:bg-primary/90 px-4 text-xs h-9 font-bold shrink-0 cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5 mr-1" />
                      Formulate Path
                    </Button>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
