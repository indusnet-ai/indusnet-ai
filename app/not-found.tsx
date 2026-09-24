"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Home, 
  Sparkles, 
  MessageSquare, 
  Cpu, 
  Calculator, 
  FileCode2, 
  Layers, 
  ShieldCheck, 
  Bot, 
  ArrowRight 
} from "lucide-react";
import { trackEvent, ConversionEvents } from "@/lib/analytics";

const quickRoutes = [
  {
    icon: Cpu,
    title: "AI Capabilities",
    desc: "Autonomous agents, enterprise RAG, and private LLMs.",
    href: "/services/generative-ai",
  },
  {
    icon: Layers,
    title: "AI Scoper & Assessment",
    desc: "Evaluate enterprise readiness and CPMAI project scope.",
    href: "/assessment",
  },
  {
    icon: Calculator,
    title: "AI ROI Estimator",
    desc: "Model operational savings and private GPU sizing.",
    href: "/roi-calculator",
  },
  {
    icon: FileCode2,
    title: "Architecture Blueprints",
    desc: "Inspect production architecture specifications and showcases.",
    href: "/portfolio",
  },
  {
    icon: ShieldCheck,
    title: "Governance & Security",
    desc: "Zero-retention model agreements, VPC isolation, and compliance.",
    href: "/governance",
  },
  {
    icon: MessageSquare,
    title: "Direct Consultation",
    desc: "Connect directly with our senior systems architects.",
    href: "/contact",
  },
];

export default function NotFound() {
  const handleTalkToAi = () => {
    trackEvent(ConversionEvents.CTA_TALK_TO_AI, { location: "404_page" });
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("open-ai-concierge", { detail: {} }));
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-28 relative overflow-hidden text-center">
      {/* Background glow effects */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 w-[450px] sm:w-[600px] h-[450px] sm:h-[600px] rounded-full bg-primary/10 blur-[140px]" />

      <div className="max-w-2xl mx-auto flex flex-col items-center gap-8">
        <Badge className="bg-primary/10 border-primary/20 text-primary text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" /> Route Not Found
        </Badge>

        <div className="space-y-2">
          <h1 className="text-6xl sm:text-7xl font-black tracking-tight text-foreground font-heading">
            4<span className="text-primary">0</span>4
          </h1>
          <h2 className="text-xl sm:text-2xl font-bold text-foreground">
            Looking for an Enterprise AI Solution?
          </h2>
          <p className="text-muted-foreground text-xs sm:text-sm max-w-lg mx-auto leading-relaxed">
            The resource you requested may have moved or been reorganized. Explore our verified engineering routes or query our AI Concierge directly.
          </p>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button
            onClick={handleTalkToAi}
            className="rounded-full bg-gradient-to-r from-primary to-accent text-white font-semibold text-xs px-6 shadow-lg shadow-primary/25 hover:brightness-110"
          >
            <Bot className="w-4 h-4 mr-2" />
            Talk to Our AI
          </Button>

          <Button asChild variant="outline" className="rounded-full border-border hover:bg-muted text-foreground text-xs px-6">
            <Link href="/" className="flex items-center gap-2">
              <Home className="w-4 h-4" /> Return to Home
            </Link>
          </Button>
        </div>

        {/* Quick Route Cards */}
        <div className="w-full text-left pt-4">
          <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground block text-center mb-4">
            Key Enterprise Destinations
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {quickRoutes.map((route, idx) => {
              const Icon = route.icon;
              return (
                <Link
                  key={idx}
                  href={route.href}
                  className="group block"
                >
                  <Card className="bg-card/40 border-border/60 backdrop-blur-sm transition-all duration-200 group-hover:border-primary/40 group-hover:bg-card/70 h-full">
                    <CardContent className="p-4 flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-bold text-foreground group-hover:text-primary transition-colors">
                            {route.title}
                          </h4>
                          <ArrowRight className="w-3 h-3 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                        </div>
                        <p className="text-[11px] text-muted-foreground leading-snug mt-0.5 line-clamp-1">
                          {route.desc}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
