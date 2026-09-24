"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, X, Send, Bot, ArrowRight, Cpu, Search, 
  Layers, UserCheck, RefreshCw, Compass, ShieldCheck, 
  Clock, Zap, CheckCircle2, Terminal, Building2, Check,
  Copy, FileText, ArrowDown
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  CONCIERGE_OPENING_MESSAGE,
  CONCIERGE_STARTERS, 
  INDUSTRIES,
  SCALES,
  generateCustomPath,
  AiConciergeStarter
} from "@/lib/ai-concierge-data";

export function AiConciergeModal() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedStarterId, setSelectedStarterId] = React.useState<string | null>(null);
  const [selectedIndustryId, setSelectedIndustryId] = React.useState<string | null>(null);
  const [selectedScaleId, setSelectedScaleId] = React.useState<string | null>(null);
  const [customText, setCustomText] = React.useState("");
  const [isThinking, setIsThinking] = React.useState(false);
  const [generatedResult, setGeneratedResult] = React.useState<ReturnType<typeof generateCustomPath> | null>(null);
  const [copied, setCopied] = React.useState(false);

  // Global event listener to open concierge from anywhere
  React.useEffect(() => {
    const handleOpen = (e: CustomEvent<{ starterId?: string }>) => {
      setIsOpen(true);
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

  const handleStarterSelect = (id: string) => {
    setSelectedStarterId(id);
    setIsThinking(true);
    setGeneratedResult(null);

    setTimeout(() => {
      const res = generateCustomPath(id, selectedIndustryId || undefined, selectedScaleId || undefined);
      setGeneratedResult(res);
      setIsThinking(false);
    }, 400);
  };

  const handleRefineIndustry = (industryId: string) => {
    setSelectedIndustryId(industryId);
    if (selectedStarterId) {
      setIsThinking(true);
      setTimeout(() => {
        const res = generateCustomPath(selectedStarterId, industryId, selectedScaleId || undefined);
        setGeneratedResult(res);
        setIsThinking(false);
      }, 300);
    }
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customText.trim()) return;

    const query = customText.trim();
    setCustomText("");
    setIsThinking(true);
    setSelectedStarterId("build-application");

    setTimeout(() => {
      const res = generateCustomPath("build-application", selectedIndustryId || undefined, selectedScaleId || undefined, query);
      setGeneratedResult(res);
      setIsThinking(false);
    }, 450);
  };

  const handleReset = () => {
    setSelectedStarterId(null);
    setSelectedIndustryId(null);
    setSelectedScaleId(null);
    setGeneratedResult(null);
    setCustomText("");
    setIsThinking(false);
  };

  const handleCopyBlueprint = () => {
    if (!generatedResult) return;
    const text = `INDUSNET AI ARCHITECTURE BLUEPRINT\n\nChallenge:\n${generatedResult.challenge}\n\nRecommended Approach:\n${generatedResult.recommendedApproach}\n\nKey Capabilities:\n${generatedResult.capabilities.map((c) => `- ${c}`).join("\n")}\n\nTarget Architecture:\n${generatedResult.targetArchitecture.map((a) => `${a.layer}: ${a.technology}`).join("\n")}\n\nTimeline: ${generatedResult.timeline}\nEstimated ROI: ${generatedResult.roiProjection}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 group flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-background/95 dark:bg-card/95 border border-primary/40 shadow-2xl backdrop-blur-xl hover:border-primary hover:shadow-[0_0_30px_rgba(22,119,255,0.4)] transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
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
        <span className="text-[10px] bg-primary/10 text-primary font-bold px-1.5 py-0.5 rounded-md border border-primary/20">
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
              className="fixed inset-0 bg-black/75 backdrop-blur-md"
            />

            {/* Modal Dialog Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="relative w-full max-w-3xl max-h-[92vh] bg-card border border-border shadow-[0_25px_80px_rgba(0,0,0,0.6)] rounded-2xl flex flex-col overflow-hidden z-10"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-border/60 bg-muted/30">
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
                        Enterprise AI Concierge
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
                  className="rounded-full p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors"
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
                    <div className="bg-muted/40 border border-border/70 rounded-xl p-4 sm:p-5 flex items-start gap-3.5">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                        <Terminal className="w-4 h-4" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-semibold text-foreground">
                          {CONCIERGE_OPENING_MESSAGE}
                        </p>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          Select an enterprise mandate below or type your challenge. We will formulate a tailored architectural roadmap, model sizing, and direct engineering pathway.
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2.5">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                        Select an Objective to Formulate Path
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {CONCIERGE_STARTERS.map((starter) => (
                          <button
                            key={starter.id}
                            onClick={() => handleStarterSelect(starter.id)}
                            className="group text-left p-3.5 rounded-xl border border-border/70 hover:border-primary/50 bg-background/50 hover:bg-primary/5 transition-all duration-200 flex flex-col justify-between gap-2"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-semibold text-primary/80 uppercase tracking-wide font-mono">
                                {starter.tag}
                              </span>
                              <div className="w-6 h-6 rounded-md bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors">
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

                {/* Generated Recommended AI Path */}
                {generatedResult && !isThinking && (
                  <div className="space-y-5">
                    {/* Control Bar: Reset & Sector Filter */}
                    <div className="flex flex-wrap items-center justify-between gap-2 bg-muted/30 border border-border/60 rounded-xl px-4 py-2.5 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">Specialized Sector:</span>
                        <select
                          value={selectedIndustryId || ""}
                          onChange={(e) => handleRefineIndustry(e.target.value)}
                          className="bg-background border border-border rounded-md px-2 py-1 text-xs text-foreground font-medium focus:outline-none focus:border-primary"
                        >
                          <option value="">General Enterprise</option>
                          {INDUSTRIES.map((ind) => (
                            <option key={ind.id} value={ind.id}>{ind.name}</option>
                          ))}
                        </select>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={handleCopyBlueprint}
                          className="text-[11px] text-muted-foreground hover:text-foreground font-medium flex items-center gap-1 transition-colors"
                        >
                          {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                          {copied ? "Copied" : "Copy Blueprint"}
                        </button>
                        <span className="text-border">|</span>
                        <button
                          onClick={handleReset}
                          className="text-[11px] text-primary hover:underline font-semibold"
                        >
                          Reset
                        </button>
                      </div>
                    </div>

                    {/* Structured Blueprint Container */}
                    <div className="bg-card border border-border rounded-xl p-5 shadow-sm space-y-5">
                      {/* 1. Challenge Box */}
                      <div className="space-y-1.5">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground font-bold flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                          YOUR CHALLENGE
                        </span>
                        <div className="p-3 rounded-lg bg-muted/40 border border-border/80 text-xs text-foreground leading-relaxed">
                          {generatedResult.challenge}
                        </div>
                      </div>

                      <div className="flex justify-center -my-2 text-muted-foreground">
                        <ArrowDown className="w-4 h-4 text-cyan-400" />
                      </div>

                      {/* 2. Recommended Approach */}
                      <div className="space-y-1.5">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground font-bold flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                          RECOMMENDED APPROACH
                        </span>
                        <div className="p-3 rounded-lg bg-primary/10 border border-primary/30 text-xs font-bold text-foreground">
                          {generatedResult.recommendedApproach}
                        </div>
                      </div>

                      <div className="flex justify-center -my-2 text-muted-foreground">
                        <ArrowDown className="w-4 h-4 text-cyan-400" />
                      </div>

                      {/* 3. AI Capabilities Grid */}
                      <div className="space-y-2">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground font-bold flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-violet-500" />
                          AI CAPABILITIES
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                          {generatedResult.capabilities.map((cap, i) => (
                            <div key={i} className="flex items-center gap-2 p-2.5 rounded-lg bg-muted/40 border border-border/60">
                              <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />
                              <span className="text-foreground text-[11px] font-medium">{cap}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex justify-center -my-2 text-muted-foreground">
                        <ArrowDown className="w-4 h-4 text-cyan-400" />
                      </div>

                      {/* 4. Target Architecture & Infrastructure */}
                      <div className="space-y-2">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground font-bold flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          TARGET ARCHITECTURE & INFRASTRUCTURE
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                          {generatedResult.targetArchitecture.map((arch, i) => (
                            <div key={i} className="p-2.5 rounded-lg bg-muted/30 border border-border/60">
                              <span className="text-[10px] font-mono text-primary uppercase font-bold block">
                                {arch.layer}
                              </span>
                              <span className="text-[11px] text-foreground font-medium">
                                {arch.technology}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Timeline & ROI Projection */}
                      <div className="pt-2 border-t border-border/60 text-xs space-y-2">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="p-2.5 rounded-lg bg-muted/30 border border-border/60 flex items-center justify-between">
                            <span className="text-muted-foreground">Estimated Timeline:</span>
                            <span className="font-bold text-foreground font-mono">{generatedResult.timeline}</span>
                          </div>
                          <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/25 flex items-center justify-between gap-2">
                            <span className="text-muted-foreground shrink-0">Impact Potential:</span>
                            <span className="font-semibold text-amber-400 text-right">{generatedResult.roiProjection}</span>
                          </div>
                        </div>
                        <p className="text-[10px] text-muted-foreground/60 italic text-center">
                          Impact figures are illustrative estimates based on typical deployment patterns, not documented outcomes.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer CTA & Input */}
              <div className="px-6 py-4 border-t border-border/60 bg-muted/20 space-y-3">
                {generatedResult ? (
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                    <p className="text-xs text-muted-foreground text-center sm:text-left">
                      Next Step: Review this architecture with a senior Indusnet AI architect.
                    </p>
                    <Button
                      size="sm"
                      asChild
                      className="rounded-full bg-primary text-white hover:bg-primary/90 text-xs px-6 shadow-md shadow-primary/20 w-full sm:w-auto"
                    >
                      <Link
                        href={generatedResult.nextStepUrl}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center justify-center gap-1.5 font-bold"
                      >
                        Talk to an AI Expert
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
                      className="flex-1 bg-background border border-border/80 rounded-full px-4 py-2 text-xs text-foreground focus:outline-none focus:border-primary transition-colors placeholder:text-muted-foreground"
                    />
                    <Button
                      type="submit"
                      size="sm"
                      disabled={!customText.trim()}
                      className="rounded-full bg-primary text-white hover:bg-primary/90 px-4 text-xs h-8 font-bold"
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
