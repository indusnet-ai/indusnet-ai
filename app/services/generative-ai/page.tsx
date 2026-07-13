"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Bot, Search, Zap, Cpu, Sparkles, Check, ArrowRight, 
  HelpCircle, ChevronDown, Landmark, GraduationCap, 
  Activity, ArrowDown, Building, FileText, Send 
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

// FAQ Array (phData Inspired)
const faqs = [
  {
    question: "How does Generative AI work in an enterprise setting?",
    answer: "Generative AI applications use Large Language Models (LLMs) trained to calculate new outputs from previously unseen inputs. In enterprise environments, we don't just rely on general public models; we connect them directly to your private company data sources (SharePoint, Notion, databases) using a secure technique called Retrieval-Augmented Generation (RAG). This ensures the AI has real-time business context without exposing your data."
  },
  {
    question: "Can you trust Generative AI for critical business applications?",
    answer: "Right out of the box, raw Generative AI models can lead to hallucinations. However, by designing proper retrieval constraints (RAG), semantic middleware filters, deterministic validation guardrails, and human-in-the-loop escalation paths, we build systems that are highly reliable, safe, and ready for critical workflows."
  },
  {
    question: "How much do your Generative AI consulting and strategy services cost?",
    answer: "We aim to prove concrete business value at every step. Our approach is to start simple. We offer complimentary strategy workshops to scope initial use cases, followed by rapid prototyping or feasibility assessments (typically ranging from $20k to $60k) so your organization can validate ROI before investing in full production deployment."
  },
  {
    question: "What technology stack do you support for LLM deployments?",
    answer: "We are model-agnostic and infrastructure-flexible. We build solutions utilizing frontier models (OpenAI GPT-4o, Anthropic Claude 3.5 Sonnet) as well as private, hosted open-source models (Llama 3, Mistral, Arctic) deployed inside your own AWS/Azure Virtual Private Cloud (VPC) or local infrastructure to ensure complete data sovereignty."
  }
];

// Art of the Possible Use Cases
const useCases = [
  {
    title: "Personalization & Content Generation",
    desc: "Automate and tailor messaging, product listings, marketing copy, and multi-lingual documentation for curated client audiences at scale.",
    icon: Sparkles
  },
  {
    title: "Document Language Processing",
    desc: "Excel at extracting high-accuracy insights, summarizing contract files, and parsing massive unstructured PDFs without manual overhead.",
    icon: FileText
  },
  {
    title: "Accelerate Business Processes",
    desc: "Build intelligent decision trees and assistant tools that analyze historical compliance patterns to suggest ideal actions.",
    icon: Cpu
  },
  {
    title: "Workflow Automation & Agents",
    desc: "Implement multi-agent cooperative workflows that execute multi-step operations, call external APIs, and auto-correct process errors.",
    icon: Zap
  }
];

export default function GenerativeAiServicesPage() {
  const formRef = React.useRef<HTMLDivElement>(null);
  const [openFaqIndex, setOpenFaqIndex] = React.useState<number | null>(null);

  // Form State
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [company, setCompany] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);
  const [submitStatus, setSubmitStatus] = React.useState<{ success?: boolean; message?: string } | null>(null);

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) {
      setSubmitStatus({ success: false, message: "Name and Email are required fields." });
      return;
    }

    setSubmitting(true);
    setSubmitStatus(null);

    try {
      const res = await fetch("/api/consultations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          company,
          service: "Generative AI Workshop Request",
          message: message || "Requesting a free Generative AI scoping workshop."
        })
      });

      const data = await res.json();
      if (res.ok) {
        setSubmitStatus({ success: true, message: "Success! Your workshop request has been submitted. Our team will contact you shortly." });
        setName("");
        setEmail("");
        setCompany("");
        setMessage("");
      } else {
        setSubmitStatus({ success: false, message: data.error || "Something went wrong. Please try again." });
      }
    } catch (err) {
      setSubmitStatus({ success: false, message: "Network error. Please check your connection and try again." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-24 md:gap-32 pt-32 pb-24">
      {/* 1. HERO SECTION */}
      <section className="container mx-auto px-4 md:px-6 relative overflow-hidden text-center max-w-4xl flex flex-col gap-6 items-center">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -z-10 w-[400px] h-[400px] rounded-full bg-primary/10 blur-[120px]" />
        
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Badge className="bg-primary/10 border-primary/20 text-primary rounded-full px-3.5 py-1 text-xs font-semibold">
            Generative AI Services
          </Badge>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.1] font-heading"
        >
          Unlock the Full Potential of <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Generative AI</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-muted-foreground text-base sm:text-lg md:text-xl leading-relaxed max-w-2xl"
        >
          Expert guidance to design, test, build, and scale enterprise applications powered by Large Language Models. Move securely from sandbox ideas to heavy production workloads.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-wrap items-center gap-4 justify-center pt-2"
        >
          <Button onClick={scrollToForm} size="lg" className="rounded-full bg-gradient-to-r from-primary to-accent text-white font-medium hover:brightness-110 hover:shadow-[0_0_20px_rgba(124,58,237,0.3)] transition-all duration-300">
            Schedule Free Workshop <ArrowDown className="ml-2 w-4 h-4" />
          </Button>
          <Button asChild size="lg" variant="outline" className="rounded-full border-border/60 hover:bg-white/5 text-muted-foreground hover:text-white">
            <Link href="/services">View Core Services</Link>
          </Button>
        </motion.div>
      </section>

      {/* 2. CASE STUDY: PUTTING AI INTO PRODUCTION */}
      <section className="container mx-auto px-4 md:px-6 max-w-5xl">
        <div className="text-center max-w-3xl mx-auto flex flex-col gap-4 mb-12">
          <Badge className="bg-emerald-500/10 border-emerald-500/20 text-emerald-400 w-fit mx-auto px-3 py-1 text-xs rounded-full font-semibold">
            Putting AI into Production
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-heading">
            Enterprise Success Story: IT Chat Assistant
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base">
            See how we helped a national fast-food network deploy custom models to automate IT support for 2,600+ locations.
          </p>
        </div>

        <Card className="glassmorphism-card border-none overflow-hidden relative">
          <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
          
          <CardContent className="p-8 md:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Case metrics */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] text-primary uppercase font-bold tracking-widest">The Results</span>
                <h3 className="text-3xl font-extrabold text-white">Impact at Scale</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-6">
                <div className="flex flex-col border-l-2 border-primary pl-4">
                  <span className="text-3xl font-extrabold text-emerald-400">30x Faster</span>
                  <span className="text-xs text-muted-foreground mt-1">Resolution time for common support questions</span>
                </div>
                <div className="flex flex-col border-l-2 border-accent pl-4">
                  <span className="text-3xl font-extrabold text-white">10,000+</span>
                  <span className="text-xs text-muted-foreground mt-1">IT documents vector-encoded for RAG search</span>
                </div>
                <div className="flex flex-col border-l-2 border-purple-500 pl-4">
                  <span className="text-3xl font-extrabold text-white">5 LLMs</span>
                  <span className="text-xs text-muted-foreground mt-1">Deployed in parallel for A/B evaluation</span>
                </div>
              </div>
            </div>

            {/* Case content */}
            <div className="lg:col-span-7 flex flex-col gap-6 text-left">
              <div className="flex flex-col gap-2">
                <h4 className="text-lg font-bold text-white">The Challenge</h4>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  A large fast-food brand needed a secure, natural-language interface to service their national IT requests. Support operators were overwhelmed by duplicate tickets, and document retrieval across manuals was painfully slow.
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <h4 className="text-lg font-bold text-white">The Solution</h4>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  Indusnet AI architected a Retrieval-Augmented Generation (RAG) system using vector databases to query company technical documentation. By keeping model pipelines interchangeable behind a unified API, we benchmarked multiple open-source models to optimize speed, accuracy, and operational cost.
                </p>
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                {["RAG", "Vector Search", "LLM Evaluation", "AWS Bedrock", "Docker"].map((tag, idx) => (
                  <Badge key={idx} className="bg-white/5 border border-white/10 text-muted-foreground hover:bg-white/10 px-2 py-0.5 rounded text-[10px]">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* 3. ART OF THE POSSIBLE: USE CASES */}
      <section className="container mx-auto px-4 md:px-6 max-w-5xl flex flex-col gap-12">
        <div className="text-center max-w-3xl mx-auto flex flex-col gap-4">
          <Badge className="bg-primary/10 border-primary/20 text-primary w-fit mx-auto px-3 py-1 text-xs rounded-full font-semibold">
            Art of the Possible
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-heading">
            What Can You Accomplish With Generative AI?
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base">
            From automating documentation drafts to developing agentic workforces, explore our custom AI capabilities.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {useCases.map((uc, idx) => (
            <Card key={idx} className="glassmorphism-card border-none text-left">
              <CardContent className="p-6 flex gap-4 items-start">
                <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                  <uc.icon className="w-5 h-5 text-primary" />
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="font-bold text-base text-white">{uc.title}</h3>
                  <p className="text-muted-foreground text-xs leading-relaxed">{uc.desc}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* 4. INTERACTIVE FAQ ACCORDION */}
      <section className="container mx-auto px-4 md:px-6 max-w-3xl flex flex-col gap-12">
        <div className="text-center flex flex-col gap-4">
          <Badge className="bg-accent/10 border-accent/20 text-accent w-fit mx-auto px-3 py-1 text-xs rounded-full font-semibold">
            Answering Your Questions
          </Badge>
          <h2 className="text-3xl font-extrabold tracking-tight font-heading">
            Got Generative AI Questions?
          </h2>
        </div>

        <div className="flex flex-col gap-4">
          {faqs.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div 
                key={idx} 
                className="glassmorphism-card border-none rounded-2xl overflow-hidden transition-all duration-300"
              >
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full p-6 text-left flex justify-between items-center gap-4 text-white hover:text-primary transition-colors font-bold text-sm sm:text-base"
                >
                  <span>{faq.question}</span>
                  <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform duration-300 ${isOpen ? "rotate-180 text-primary" : ""}`} />
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 text-xs sm:text-sm text-muted-foreground leading-relaxed border-t border-white/5 pt-4">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. INTERACTIVE WORKSHOP FORM */}
      <section ref={formRef} className="container mx-auto px-4 md:px-6 max-w-2xl">
        <Card className="glassmorphism-card border-none p-6 sm:p-10 relative overflow-hidden">
          {/* Background glows */}
          <div className="absolute -top-10 -right-10 -z-10 w-40 h-40 rounded-full bg-primary/10 blur-3xl animate-pulse" />
          <div className="absolute -bottom-10 -left-10 -z-10 w-40 h-40 rounded-full bg-accent/10 blur-3xl animate-pulse" />
          
          <CardContent className="p-0 flex flex-col gap-6 text-left">
            <div className="flex flex-col gap-2">
              <Badge className="bg-primary/10 border-primary/20 text-primary w-fit px-3 py-0.5 text-[10px] rounded font-bold uppercase tracking-wider">
                Strategy Kickoff
              </Badge>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-heading">
                Schedule Your Free Workshop
              </h2>
              <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">
                Sit down with our lead AI architects to align on use case discovery, data readiness, model hosting strategies, and projected ROI.
              </p>
            </div>

            <form onSubmit={handleFormSubmit} className="flex flex-col gap-4 mt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-white/90">Full Name *</label>
                  <Input 
                    type="text" 
                    placeholder="Enter name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-white/5 border-white/10 hover:border-white/20 focus:border-primary text-white rounded-xl placeholder:text-muted-foreground/60"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-white/90">Work Email *</label>
                  <Input 
                    type="email" 
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-white/5 border-white/10 hover:border-white/20 focus:border-primary text-white rounded-xl placeholder:text-muted-foreground/60"
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-white/90">Company Name</label>
                <Input 
                  type="text" 
                  placeholder="Enter organization name"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="bg-white/5 border-white/10 hover:border-white/20 focus:border-primary text-white rounded-xl placeholder:text-muted-foreground/60"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-white/90">AI Objectives or Desired Use Cases</label>
                <Textarea 
                  placeholder="What business challenges or model goals would you like to explore during the workshop?"
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="bg-white/5 border-white/10 hover:border-white/20 focus:border-primary text-white rounded-xl resize-none placeholder:text-muted-foreground/60 text-xs sm:text-sm"
                />
              </div>

              {submitStatus && (
                <div className={`p-4 rounded-xl text-xs font-medium border ${submitStatus.success ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-destructive/10 border-destructive/20 text-destructive-foreground"}`}>
                  {submitStatus.message}
                </div>
              )}

              <Button 
                type="submit" 
                disabled={submitting}
                className="w-full sm:w-fit rounded-full bg-gradient-to-r from-primary to-accent text-white font-medium hover:brightness-110 shadow-lg mt-2 ml-auto"
              >
                {submitting ? "Submitting..." : "Schedule My Workshop"} <Send className="ml-2 w-4 h-4" />
              </Button>
            </form>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
