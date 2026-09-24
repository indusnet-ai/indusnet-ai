"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Cpu, Mail, Phone, MapPin, ArrowRight, Loader2, CheckCircle2 } from "lucide-react";
import { Linkedin, Twitter, Github } from "@/components/ui/brand-icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { trackEvent, ConversionEvents } from "@/lib/analytics";

export function Footer() {
  const [email, setEmail] = React.useState("");
  const [status, setStatus] = React.useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = React.useState("");

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json().catch(() => ({}));
      if (response.ok) {
        trackEvent(ConversionEvents.NEWSLETTER_SIGNUP, { location: "footer" });
        setStatus("success");
        setMessage(data.message || "Thank you for subscribing to our AI Insights newsletter!");
        setEmail("");
      } else {
        setStatus("error");
        setMessage(data.error || "Subscription failed. Please try again.");
      }
    } catch (err: any) {
      setStatus("error");
      setMessage(err.message || "Connection error. Please try again.");
    }
  };

  return (
    <footer className="relative border-t border-[#162238] bg-[#050B14] pt-20 pb-10 overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute bottom-0 right-0 -z-10 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute top-0 left-0 -z-10 w-96 h-96 rounded-full bg-accent/5 blur-3xl" />

      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 pb-16 border-b border-[#162238]">
          {/* Brand Card */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <Link href="/" className="flex items-center group w-fit">
              <Image 
                src="/logo.webp" 
                alt="Indusnet AI" 
                width={109} 
                height={48} 
                className="h-12 w-auto object-contain transition-transform duration-300 hover:scale-102"
                priority={false}
              />
            </Link>
            <p className="text-muted-foreground text-sm max-w-sm leading-relaxed">
              AI-First. From Strategy to Software. Designing and deploying production-grade AI applications, autonomous agentic workflows, and private knowledge systems for enterprise leaders.
            </p>
            <div className="flex items-center gap-2.5">
              <Link
                href="https://linkedin.com/company/indusnet-ai"
                target="_blank"
                className="w-9 h-9 rounded-lg flex items-center justify-center border border-[#162238] bg-[#0D1828] text-muted-foreground hover:text-foreground hover:border-primary/50 hover:bg-[#101D30] transition-all duration-200"
              >
                <Linkedin className="w-4 h-4" />
                <span className="sr-only">LinkedIn</span>
              </Link>
              <Link
                href="https://twitter.com/indusnet_ai"
                target="_blank"
                className="w-9 h-9 rounded-lg flex items-center justify-center border border-[#162238] bg-[#0D1828] text-muted-foreground hover:text-foreground hover:border-primary/50 hover:bg-[#101D30] transition-all duration-200"
              >
                <Twitter className="w-4 h-4" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link
                href="https://github.com/indusnet-ai"
                target="_blank"
                className="w-9 h-9 rounded-lg flex items-center justify-center border border-[#162238] bg-[#0D1828] text-muted-foreground hover:text-foreground hover:border-primary/50 hover:bg-[#101D30] transition-all duration-200"
              >
                <Github className="w-4 h-4" />
                <span className="sr-only">GitHub</span>
              </Link>
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="flex flex-col gap-5">
            <h3 className="font-bold text-xs text-primary uppercase tracking-widest">Company</h3>
            <ul className="flex flex-col gap-3">
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/portfolio" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                  Solution Showcases
                </Link>
              </li>
              <li>
                <Link href="/industries" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                  Industry Verticals
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                  Research & Insights
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                  Discuss Architecture
                </Link>
              </li>
            </ul>
          </div>

          {/* Solutions Column */}
          <div className="flex flex-col gap-5">
            <h3 className="font-bold text-xs text-primary uppercase tracking-widest">Core Capabilities</h3>
            <ul className="flex flex-col gap-3">
              <li>
                <Link href="/services/generative-ai" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                  Generative AI Applications
                </Link>
              </li>
              <li>
                <Link href="/services/generative-ai" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                  Autonomous AI Agents
                </Link>
              </li>
              <li>
                <Link href="/services/generative-ai" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                  Enterprise RAG & Search
                </Link>
              </li>
              <li>
                <Link href="/roi-calculator" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                  AI ROI Estimator
                </Link>
              </li>
              <li>
                <Link href="/assessment" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                  AI Scoper & Scoping
                </Link>
              </li>
              <li>
                <Link href="/training" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                  Corporate AI Training
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details & Newsletter Column */}
          <div className="flex flex-col gap-6 lg:col-span-1 min-w-[200px]">
            <div className="flex flex-col gap-5">
              <h3 className="font-mono font-bold text-xs text-primary uppercase tracking-widest">Subscribe</h3>
              <p className="text-muted-foreground text-xs leading-normal">
                Receive curated monthly briefings on enterprise AI deployment, case studies, and workshops.
              </p>
              <form onSubmit={handleSubscribe} className="flex flex-col gap-2 relative">
                <div className="flex gap-2">
                  <Input
                    type="email"
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={status === "loading" || status === "success"}
                    className="rounded-xl bg-[#0D1828] border-[#162238] focus-visible:ring-primary text-xs px-4 text-foreground placeholder:text-muted-foreground"
                  />
                  <Button
                    type="submit"
                    size="icon"
                    disabled={status === "loading" || status === "success"}
                    className="rounded-xl bg-primary text-white flex-shrink-0 hover:bg-primary/90 shadow-md shadow-primary/20"
                  >
                    {status === "loading" ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <ArrowRight className="w-4 h-4" />
                    )}
                  </Button>
                </div>
                {status === "success" && (
                  <div className="flex items-center gap-1.5 text-xs text-emerald-400 mt-2 font-mono">
                    <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>{message}</span>
                  </div>
                )}
                {status === "error" && (
                  <div className="flex items-center gap-1.5 text-xs text-destructive mt-2 font-mono">
                    <span>{message}</span>
                  </div>
                )}
              </form>
            </div>
            
            <div className="flex flex-col gap-3 border-t border-[#162238] pt-4 mt-1">
              <div className="flex items-center gap-2.5 text-xs text-muted-foreground">
                <Mail className="w-3.5 h-3.5 text-primary" />
                <a href="mailto:info@indusnet-ai.com" className="hover:text-foreground transition-colors">
                  info@indusnet-ai.com
                </a>
              </div>
              <div className="flex items-start gap-2.5 text-xs text-muted-foreground">
                <Phone className="w-3.5 h-3.5 text-accent mt-0.5 flex-shrink-0" />
                <div className="flex flex-col gap-1">
                  <div className="flex flex-wrap gap-x-3">
                    <a href="tel:+919884915977" className="hover:text-foreground transition-colors">
                      +91-988-491-5977 (HQ)
                    </a>
                    <a href="tel:+6594483805" className="hover:text-foreground transition-colors">
                      +65-9448-3805 (SG)
                    </a>
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-2.5 text-xs text-muted-foreground">
                <MapPin className="w-3.5 h-3.5 text-primary mt-0.5 flex-shrink-0" />
                <div className="flex flex-col gap-2">
                  <div>
                    <span className="font-semibold text-foreground">Chennai (HQ): </span>
                    <span>Number 46 First Floor, Tansi Nagar, Velachery, Chennai 600042</span>
                  </div>
                  <div>
                    <span className="font-semibold text-foreground">Singapore: </span>
                    <span>51 Ubi Ave 1, #05-16 Paya Ubi Industrial Park, SG 408933</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Legal & Copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-10 text-xs text-muted-foreground border-t border-[#162238]/60 mt-4">
          <p>© {new Date().getFullYear()} Indusnet AI. All rights reserved. Registered under Indusnet Technologies Ltd.</p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-foreground transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-foreground transition-colors">
              Terms of Service
            </Link>
            <Link href="/sitemap.xml" className="hover:text-foreground transition-colors">
              Sitemap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
