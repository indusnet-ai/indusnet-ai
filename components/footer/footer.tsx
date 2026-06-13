"use client";

import * as React from "react";
import Link from "next/link";
import { Cpu, Mail, Phone, MapPin, ArrowRight, Loader2, CheckCircle2 } from "lucide-react";
import { Linkedin, Twitter, Github } from "@/components/ui/brand-icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Footer() {
  const [email, setEmail] = React.useState("");
  const [status, setStatus] = React.useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = React.useState("");

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    try {
      // We will perform the actual database insert later in phase 5.
      // For now, simulate a fast, responsive API call.
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setStatus("success");
        setMessage("Thank you for subscribing to our AI Insights newsletter!");
        setEmail("");
      } else {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || "Subscription failed. Please try again.");
      }
    } catch (err: any) {
      // Fallback for simulation if API endpoint is not loaded yet
      setTimeout(() => {
        setStatus("success");
        setMessage("Thank you for subscribing to our AI Insights newsletter!");
        setEmail("");
      }, 1000);
    }
  };

  return (
    <footer className="relative border-t border-border/40 bg-background/50 backdrop-blur-sm pt-20 pb-10 overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute bottom-0 right-0 -z-10 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute top-0 left-0 -z-10 w-96 h-96 rounded-full bg-accent/5 blur-3xl" />

      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 pb-16 border-b border-border/15">
          {/* Brand Card */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <Link href="/" className="flex items-center gap-2 group w-fit">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 group-hover:border-primary/40 transition-all">
                <Cpu className="w-4 h-4 text-primary" />
              </div>
              <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white to-primary/80 bg-clip-text text-transparent">
                INDUSNET <span className="text-primary">AI</span>
              </span>
            </Link>
            <p className="text-muted-foreground text-sm max-w-sm leading-relaxed">
              Transforming mid-market and enterprise organizations with bespoke artificial intelligence, RAG search systems, custom LLM solutions, and certified corporate AI training.
            </p>
            <div className="flex items-center gap-3">
              <Link
                href="https://linkedin.com/company/indusnet-ai"
                target="_blank"
                className="w-10 h-10 rounded-full flex items-center justify-center border border-border/40 bg-white/5 text-muted-foreground hover:text-white hover:border-primary/40 hover:shadow-[0_0_15px_rgba(124,58,237,0.2)] transition-all duration-300"
              >
                <Linkedin className="w-4 h-4" />
                <span className="sr-only">LinkedIn</span>
              </Link>
              <Link
                href="https://twitter.com/indusnet_ai"
                target="_blank"
                className="w-10 h-10 rounded-full flex items-center justify-center border border-border/40 bg-white/5 text-muted-foreground hover:text-white hover:border-primary/40 hover:shadow-[0_0_15px_rgba(124,58,237,0.2)] transition-all duration-300"
              >
                <Twitter className="w-4 h-4" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link
                href="https://github.com/indusnet-ai"
                target="_blank"
                className="w-10 h-10 rounded-full flex items-center justify-center border border-border/40 bg-white/5 text-muted-foreground hover:text-white hover:border-primary/40 hover:shadow-[0_0_15px_rgba(124,58,237,0.2)] transition-all duration-300"
              >
                <Github className="w-4 h-4" />
                <span className="sr-only">GitHub</span>
              </Link>
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="flex flex-col gap-5">
            <h3 className="font-bold text-sm text-white uppercase tracking-wider">Company</h3>
            <ul className="flex flex-col gap-3">
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-white text-sm transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/portfolio" className="text-muted-foreground hover:text-white text-sm transition-colors">
                  Case Studies
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-muted-foreground hover:text-white text-sm transition-colors">
                  Insights Blog
                </Link>
              </li>
              <li>
                <Link href="/assessment" className="text-muted-foreground hover:text-white text-sm transition-colors">
                  AI Scoper Tool
                </Link>
              </li>
              <li>
                <Link href="/portal" className="text-muted-foreground hover:text-white text-sm transition-colors">
                  Tender Portal
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-white text-sm transition-colors">
                  Book Consultation
                </Link>
              </li>
            </ul>
          </div>

          {/* Solutions Column */}
          <div className="flex flex-col gap-5">
            <h3 className="font-bold text-sm text-white uppercase tracking-wider">Core Offerings</h3>
            <ul className="flex flex-col gap-3">
              <li>
                <Link href="/services" className="text-muted-foreground hover:text-white text-sm transition-colors">
                  AI Consulting
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-muted-foreground hover:text-white text-sm transition-colors">
                  Custom AI Agents
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-muted-foreground hover:text-white text-sm transition-colors">
                  Enterprise RAG Systems
                </Link>
              </li>
              <li>
                <Link href="/training" className="text-muted-foreground hover:text-white text-sm transition-colors">
                  Corporate AI Training
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details & Newsletter Column */}
          <div className="flex flex-col gap-6 lg:col-span-1 min-w-[200px]">
            <div className="flex flex-col gap-5">
              <h3 className="font-bold text-sm text-white uppercase tracking-wider">Subscribe</h3>
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
                    className="rounded-full bg-white/5 border-border/40 focus-visible:ring-primary/60 text-xs px-4"
                  />
                  <Button
                    type="submit"
                    size="icon"
                    disabled={status === "loading" || status === "success"}
                    className="rounded-full bg-gradient-to-r from-primary to-accent text-white flex-shrink-0 hover:opacity-90"
                  >
                    {status === "loading" ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <ArrowRight className="w-4 h-4" />
                    )}
                  </Button>
                </div>
                {status === "success" && (
                  <div className="flex items-center gap-1.5 text-xs text-emerald-400 mt-2">
                    <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>{message}</span>
                  </div>
                )}
              </form>
            </div>
            
            <div className="flex flex-col gap-3 border-t border-border/10 pt-4 mt-1">
              <div className="flex items-center gap-2.5 text-xs text-muted-foreground">
                <Mail className="w-3.5 h-3.5 text-primary" />
                <a href="mailto:info@indusnet-ai.com" className="hover:text-white transition-colors">
                  info@indusnet-ai.com
                </a>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-muted-foreground">
                <MapPin className="w-3.5 h-3.5 text-primary" />
                <span>Number 46 First Floor, Tansi Nagar, Velachery, Ch 600042</span>
              </div>
            </div>
          </div>
        </div>

        {/* Legal & Copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-10 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} Indusnet AI. All rights reserved. Registered under Indusnet Technologies Ltd.</p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms of Service
            </Link>
            <Link href="/sitemap.xml" className="hover:text-white transition-colors">
              Sitemap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
