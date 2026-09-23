"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, X, Send, Bot, ArrowRight, Cpu, Search, 
  Layers, UserCheck, RefreshCw, Compass, ShieldCheck, 
  Clock, Zap, CheckCircle2, Terminal
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  CONCIERGE_STARTERS, 
  CONCIERGE_KNOWLEDGE_BASE, 
  matchConciergeIntent, 
  AiConciergeResponse 
} from "@/lib/ai-concierge-data";

export function AiConciergeModal() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [activeResponse, setActiveResponse] = React.useState<AiConciergeResponse | null>(null);
  const [isThinking, setIsThinking] = React.useState(false);
  const [activePromptLabel, setActivePromptLabel] = React.useState("");

  // Listen for global open event
  React.useEffect(() => {
    const handleOpen = (e: CustomEvent<{ starterId?: string }>) => {
      setIsOpen(true);
      if (e.detail?.starterId && CONCIERGE_KNOWLEDGE_BASE[e.detail.starterId]) {
        handleSelectStarter(e.detail.starterId);
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

  const handleSelectStarter = (id: string) => {
    const starter = CONCIERGE_STARTERS.find((s) => s.id === id);
    if (!starter) return;

    setActivePromptLabel(starter.prompt);
    setIsThinking(true);
    setActiveResponse(null);

    setTimeout(() => {
      setActiveResponse(CONCIERGE_KNOWLEDGE_BASE[id]);
      setIsThinking(false);
    }, 450);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    const userText = query.trim();
    setActivePromptLabel(userText);
    setQuery("");
    setIsThinking(true);
    setActiveResponse(null);

    setTimeout(() => {
      const match = matchConciergeIntent(userText);
      setActiveResponse(match);
      setIsThinking(false);
    }, 550);
  };

  const handleReset = () => {
    setActiveResponse(null);
    setActivePromptLabel("");
    setQuery("");
    setIsThinking(false);
  };

  const getStarterIcon = (iconName: string) => {
    switch (iconName) {
      case "Compass": return <Compass className="w-4 h-4 text-primary" />;
      case "Cpu": return <Cpu className="w-4 h-4 text-violet-500" />;
      case "Search": return <Search className="w-4 h-4 text-cyan-500" />;
      case "Bot": return <Bot className="w-4 h-4 text-emerald-500" />;
      case "RefreshCw": return <RefreshCw className="w-4 h-4 text-amber-500" />;
      case "Layers": return <Layers className="w-4 h-4 text-blue-500" />;
      default: return <UserCheck className="w-4 h-4 text-primary" />;
    }
  };

  return (
    <>
      {/* Floating Concierge Launcher Trigger */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 group flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-background/90 dark:bg-card/90 border border-primary/40 shadow-2xl backdrop-blur-xl hover:border-primary hover:shadow-[0_0_30px_rgba(255,45,33,0.35)] transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
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
              className="fixed inset-0 bg-black/70 backdrop-blur-md"
            />

            {/* Modal Dialog Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="relative w-full max-w-3xl max-h-[90vh] bg-card border border-border/80 shadow-[0_20px_70px_rgba(0,0,0,0.5)] rounded-2xl flex flex-col overflow-hidden z-10"
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
                        Enterprise Concierge
                      </Badge>
                    </div>
                    <p className="text-[11px] text-muted-foreground flex items-center gap-1.5 mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Live Neural Session · Model: Indusnet Enterprise Orchestrator
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
                {/* Initial Welcome & Starter Screen */}
                {!activeResponse && !isThinking && (
                  <div className="space-y-6">
                    <div className="bg-muted/40 border border-border/70 rounded-xl p-4 sm:p-5 flex items-start gap-3.5">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                        <Terminal className="w-4 h-4" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-semibold text-foreground">
                          Welcome to Indusnet AI. Tell me what you're trying to achieve.
                        </p>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          Select an enterprise requirement below or describe your workload. I'll synthesize our architectural models, delivery timelines, and direct engineering pathways.
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2.5">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                        Suggested Enterprise Starting Points
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {CONCIERGE_STARTERS.map((starter) => (
                          <button
                            key={starter.id}
                            onClick={() => handleSelectStarter(starter.id)}
                            className="group text-left p-3.5 rounded-xl border border-border/70 hover:border-primary/50 bg-background/50 hover:bg-primary/5 transition-all duration-200 flex flex-col justify-between gap-2"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-semibold text-primary/80 uppercase tracking-wide">
                                {starter.tag}
                              </span>
                              <div className="w-6 h-6 rounded-md bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                                {getStarterIcon(starter.icon)}
                              </div>
                            </div>
                            <span className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors leading-snug">
                              "{starter.label}"
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Thinking / Synthesizing State */}
                {isThinking && (
                  <div className="py-12 flex flex-col items-center justify-center space-y-4 text-center">
                    <div className="relative w-14 h-14 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center text-primary">
                      <Sparkles className="w-7 h-7 animate-pulse" />
                      <div className="absolute inset-0 rounded-2xl border-2 border-primary/30 animate-ping opacity-25" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-bold text-foreground">
                        Synthesizing Architecture & Delivery Model...
                      </p>
                      <p className="text-xs text-muted-foreground italic">
                        "{activePromptLabel}"
                      </p>
                    </div>
                  </div>
                )}

                {/* Active Diagnostic Blueprint */}
                {activeResponse && !isThinking && (
                  <div className="space-y-5">
                    {/* User Query Echo */}
                    <div className="flex items-center justify-between bg-muted/30 border border-border/60 rounded-xl px-4 py-2.5 text-xs">
                      <span className="text-muted-foreground flex items-center gap-1.5">
                        <Bot className="w-3.5 h-3.5 text-primary" />
                        Selected Objective:
                      </span>
                      <span className="font-semibold text-foreground truncate max-w-[70%]">
                        "{activePromptLabel}"
                      </span>
                      <button
                        onClick={handleReset}
                        className="text-[11px] text-primary hover:underline font-semibold"
                      >
                        Reset
                      </button>
                    </div>

                    {/* Architecture Diagnosis Banner */}
                    <div className="bg-card border border-border rounded-xl p-5 shadow-sm space-y-4">
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/60 pb-3">
                        <div className="flex items-center gap-2">
                          <Badge className="bg-primary text-white text-[10px]">
                            {activeResponse.category}
                          </Badge>
                          <h3 className="font-heading font-bold text-base text-foreground">
                            {activeResponse.title}
                          </h3>
                        </div>
                        <span className="text-[11px] font-mono text-muted-foreground flex items-center gap-1">
                          <Clock className="w-3 h-3 text-primary" />
                          {activeResponse.timeline}
                        </span>
                      </div>

                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {activeResponse.diagnostic}
                      </p>

                      {/* Technical Layering Matrix */}
                      <div className="space-y-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                          Target Architectural Stack
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                          {activeResponse.architecture.map((item, idx) => (
                            <div
                              key={idx}
                              className="p-2.5 rounded-lg bg-muted/40 border border-border/60 flex flex-col gap-0.5"
                            >
                              <span className="text-[10px] font-semibold text-primary uppercase">
                                {item.layer}
                              </span>
                              <span className="font-medium text-foreground text-[11px]">
                                {item.tech}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Phased Roadmap */}
                      <div className="space-y-2 pt-2 border-t border-border/60">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                          Recommended Delivery Phases
                        </span>
                        <div className="space-y-1.5">
                          {activeResponse.pathway.map((step, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-xs text-foreground">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                              <span>{step}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* ROI Projection Metric */}
                      <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 flex items-center justify-between text-xs">
                        <span className="text-muted-foreground font-medium">Measured Value Multiplier:</span>
                        <span className="font-bold text-primary">{activeResponse.roiProjection}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer CTA & Input */}
              <div className="px-6 py-4 border-t border-border/60 bg-muted/20 space-y-3">
                {activeResponse ? (
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                    <p className="text-xs text-muted-foreground text-center sm:text-left">
                      Ready to execute this architecture with certified enterprise engineers?
                    </p>
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                        className="rounded-full text-xs flex-1 sm:flex-none"
                      >
                        <Link
                          href={activeResponse.recommendedServiceUrl}
                          onClick={() => setIsOpen(false)}
                        >
                          Explore Details
                        </Link>
                      </Button>
                      <Button
                        size="sm"
                        asChild
                        className="rounded-full bg-primary text-white hover:bg-primary/90 text-xs shadow-md shadow-primary/20 flex-1 sm:flex-none"
                      >
                        <Link
                          href={`/contact?service=${encodeURIComponent(activeResponse.category)}`}
                          onClick={() => setIsOpen(false)}
                          className="flex items-center gap-1.5"
                        >
                          Talk to an AI Expert
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleCustomSubmit} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Ask our AI Advisor (e.g. 'Can we deploy private Llama-3 inside our AWS VPC?')"
                      className="flex-1 bg-background border border-border/80 rounded-full px-4 py-2 text-xs text-foreground focus:outline-none focus:border-primary transition-colors placeholder:text-muted-foreground"
                    />
                    <Button
                      type="submit"
                      size="sm"
                      disabled={!query.trim()}
                      className="rounded-full bg-primary text-white hover:bg-primary/90 px-4 text-xs h-8"
                    >
                      <Send className="w-3.5 h-3.5 mr-1" />
                      Ask
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
