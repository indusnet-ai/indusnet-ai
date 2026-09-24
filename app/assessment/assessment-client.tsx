"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Cpu, ChevronLeft, ChevronRight, CheckCircle2, Loader2, Sparkles, 
  Building2, HelpCircle, HardDrive, DollarSign, Activity, ShoppingBag, 
  Truck, BookOpen, Scale, ArrowRight, ShieldCheck 
} from "lucide-react";
import { trackEvent, ConversionEvents } from "@/lib/analytics";
import Link from "next/link";

// 1. Industry Domain Card Configurations
interface DomainOption {
  id: string;
  name: string;
  desc: string;
  icon: React.ComponentType<any>;
}

const domainsList: DomainOption[] = [
  { id: "fintech", name: "FinTech & Banking", desc: "Automated risk, asset models, and conversational agents.", icon: DollarSign },
  { id: "healthcare", name: "Healthcare & Life Sciences", desc: "HIPAA-compliant document parsing and clinic notes search.", icon: Activity },
  { id: "ecommerce", name: "E-Commerce & Retail", desc: "Personalized recommendation, agent-driven support ticketing.", icon: ShoppingBag },
  { id: "logistics", name: "Supply Chain & Logistics", desc: "Predictive routing, warehouse planning, and inventory analytics.", icon: Truck },
  { id: "edtech", name: "EdTech & Education", desc: "Adaptive grading systems, RAG-based syllabus indexing.", icon: BookOpen },
  { id: "legal", name: "Legal & Compliance", desc: "Bespoke legal contract review, case similarity classification.", icon: Scale },
  { id: "custom", name: "Custom Vertical / Other", desc: "Tell us about your specific domain in the next step.", icon: Cpu }
];

// 2. Business Style Configurations
const stylesList = [
  { id: "enterprise", name: "Enterprise Core", desc: "High-compliance, multi-layered architecture, strict controls." },
  { id: "midmarket", name: "Mid-Market Scale-Up", desc: "Agile, rapid scaling integrations, high-volume transactions." },
  { id: "startup", name: "High-Growth Startup", desc: "Product-market fit research, fast proof-of-concepts, API speed." },
  { id: "legacy", name: "Legacy / Migrant Node", desc: "Transitioning outdated on-prem architectures to serverless cloud AI." }
];

// 3. AI Objectives Options
const objectivesList = [
  "Intelligent RAG Search",
  "Autonomous Conversational Chatbots",
  "Predictive Analytics Models",
  "Automated Agentic Workflows",
  "Computer Vision Systems",
  "AI Sizing & Corporate Training"
];

// 4. Data Profile Options
const dataTypesList = [
  "Structured Database / SQL",
  "Unstructured Files (PDFs, PPTs)",
  "Customer Chats & Email Logs",
  "Media Assets (Images, Audios)",
  "No data yet (Synthetic needed)"
];

const dataSizesList = [
  "Under 1,000 records",
  "1,000 - 10,000 records",
  "10,000 - 100,000 records",
  "100,000+ records",
  "Not gathered / Custom Sizing"
];

export default function AssessmentClient() {
  const [step, setStep] = React.useState(1);
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState("");

  // Wizard Selections State
  const [domain, setDomain] = React.useState("");
  const [businessStyle, setBusinessStyle] = React.useState("");
  const [businessContext, setBusinessContext] = React.useState("");
  const [customerProblem, setCustomerProblem] = React.useState("");
  const [aiObjectives, setAiObjectives] = React.useState<string[]>([]);
  const [dataProfile, setDataProfile] = React.useState<string[]>([]);
  const [dataSize, setDataSize] = React.useState("");
  
  // Contact State
  const [contactName, setContactName] = React.useState("");
  const [contactEmail, setContactEmail] = React.useState("");
  const [contactCompany, setContactCompany] = React.useState("");
  const [contactRole, setContactRole] = React.useState("");

  const handleObjectiveToggle = (obj: string) => {
    setAiObjectives(prev => 
      prev.includes(obj) ? prev.filter(x => x !== obj) : [...prev, obj]
    );
  };

  const handleDataTypeToggle = (dt: string) => {
    setDataProfile(prev => 
      prev.includes(dt) ? prev.filter(x => x !== dt) : [...prev, dt]
    );
  };

  const handleNextStep = () => {
    setErrorMsg("");
    // Step validation before proceeding
    if (step === 1 && !domain) {
      setErrorMsg("Please select an industry vertical to continue.");
      return;
    }
    if (step === 2 && !businessStyle) {
      setErrorMsg("Please select your operational business style.");
      return;
    }
    if (step === 3 && !customerProblem) {
      setErrorMsg("Please summarize the customer problem or operational bottleneck.");
      return;
    }
    if (step === 4 && !dataSize) {
      setErrorMsg("Please select an approximate size range for your sample POC data.");
      return;
    }
    setStep(prev => prev + 1);
  };

  const handlePrevStep = () => {
    setErrorMsg("");
    setStep(prev => prev - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactEmail) {
      setErrorMsg("Contact name and corporate email are required to forward details.");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    try {
      const response = await fetch("/api/assessments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          domain,
          businessStyle,
          businessContext,
          customerProblem,
          aiObjectives,
          dataProfile,
          dataSize,
          contactName,
          contactEmail,
          contactCompany,
          contactRole
        })
      });

      if (response.ok) {
        trackEvent(ConversionEvents.AI_SCOPER_COMPLETE, { domain, scale: dataSize });
        setSuccess(true);
      } else {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || "Ingestion failed.");
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "An error occurred during submission. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Step Timeline titles
  const stepTitles = ["Domain", "Style & Context", "Problem Scoping", "Data Readiness", "Forward Info"];

  return (
    <div className="flex flex-col gap-16 md:gap-24 pt-32 pb-24 relative overflow-hidden">
      {/* Dynamic Cosmic Glow Backing */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -z-10 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[160px]" />
      
      {/* 1. HERO HEADER */}
      <section className="container mx-auto px-4 md:px-6 text-center max-w-4xl flex flex-col gap-6">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto"
        >
          <Badge className="bg-primary/10 border-primary/20 text-primary rounded-full px-3 py-1 text-xs font-semibold flex items-center gap-1.5 w-fit">
            <Sparkles className="w-3.5 h-3.5" /> CPMAI AI Scoping Framework
          </Badge>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-[1.1] font-heading"
        >
          Discover where <span className="bg-gradient-to-r from-primary via-white to-accent bg-clip-text text-transparent">AI creates value</span> in your organization.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-muted-foreground text-sm sm:text-base leading-relaxed max-w-2xl mx-auto"
        >
          Provide your business context, operational bottlenecks, and data landscape. Our senior AI architects evaluate technical feasibility, data readiness, and compliance boundaries to formulate a tailored AI opportunity roadmap.
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-xs text-muted-foreground/70 italic border border-[#162238] rounded-xl px-4 py-2.5 bg-[#050B14]/60 max-w-2xl mx-auto leading-relaxed"
        >
          <strong className="text-muted-foreground not-italic">Scoping Notice:</strong> This assessment evaluates high-level feasibility and architecture requirements. Outputs represent directional engineering recommendations, not an automated magic wand or validated final commercial contract. To review detailed VPC sizing and pilot milestones, schedule a discussion with an architect.
        </motion.p>
      </section>

      {/* 2. MAIN WIZARD COMPONENT */}
      <section className="container mx-auto px-4 md:px-6 max-w-4xl z-10">
        {!success ? (
          <div className="flex flex-col gap-8">
            {/* Step Progress Bar */}
            <div className="hidden sm:flex items-center justify-between relative px-2 mb-6">
              <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-[#162238] -z-10 -translate-y-1/2" />
              {stepTitles.map((title, idx) => {
                const stepNum = idx + 1;
                const isCompleted = step > stepNum;
                const isActive = step === stepNum;
                return (
                  <div key={idx} className="flex flex-col items-center gap-2 z-10">
                    <div 
                      className={`w-8 h-8 rounded-full border flex items-center justify-center text-xs font-mono font-bold transition-all duration-300 ${
                        isCompleted 
                          ? "bg-primary border-primary text-white" 
                          : isActive 
                          ? "bg-[#0D1828] border-primary text-primary shadow-[0_0_15px_rgba(22,119,255,0.4)] scale-110" 
                          : "bg-[#08111F] border-[#162238] text-muted-foreground"
                      }`}
                    >
                      {isCompleted ? "✓" : stepNum}
                    </div>
                    <span className={`text-[10px] font-mono font-semibold tracking-tight transition-colors duration-300 ${
                      isActive ? "text-primary font-bold" : isCompleted ? "text-primary/80" : "text-muted-foreground/60"
                    }`}>
                      {title}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Mobile Step Header */}
            <div className="sm:hidden text-center text-xs text-muted-foreground font-mono font-semibold uppercase tracking-wider mb-2">
              Step {step} of 5: <span className="text-foreground">{stepTitles[step - 1]}</span>
            </div>

            {/* Form Section with AnimatePresence */}
            <div className="relative min-h-[350px]">
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div
                    key="step-1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col gap-6"
                  >
                    <div className="text-left">
                      <h2 className="text-lg font-bold text-foreground tracking-tight flex items-center gap-2">
                        <Building2 className="w-5 h-5 text-primary" /> Select Your Vertical Domain
                      </h2>
                      <p className="text-xs text-muted-foreground mt-1">Specify which industry sector this AI solution is built for.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {domainsList.map((dom) => {
                        const Icon = dom.icon;
                        const isSelected = domain === dom.name;
                        return (
                          <Card 
                            key={dom.id}
                            onClick={() => setDomain(dom.name)}
                            className={`border text-left cursor-pointer transition-all duration-300 rounded-xl ${
                              isSelected 
                                ? "border-primary bg-primary/10 shadow-md shadow-primary/10" 
                                : "border-[#162238] bg-[#08111F] hover:border-primary/40 hover:bg-[#0D1828]"
                            }`}
                          >
                            <CardContent className="p-5 flex items-start gap-4">
                              <div className={`w-10 h-10 rounded-xl border flex items-center justify-center flex-shrink-0 transition-colors ${
                                isSelected 
                                  ? "bg-primary/20 border-primary/40 text-primary" 
                                  : "bg-[#0D1828] border-[#162238] text-muted-foreground"
                              }`}>
                                <Icon className="w-5 h-5" />
                              </div>
                              <div className="flex flex-col gap-1">
                                <h3 className="font-bold text-sm text-foreground">{dom.name}</h3>
                                <p className="text-xs text-muted-foreground leading-normal">{dom.desc}</p>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div
                    key="step-2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col gap-6 text-left"
                  >
                    <div>
                      <h2 className="text-lg font-bold text-foreground tracking-tight flex items-center gap-2">
                        <Cpu className="w-5 h-5 text-primary" /> Business Style & Operations
                      </h2>
                      <p className="text-xs text-muted-foreground mt-1">Help us understand the scale, style, and runtime environment of your organization.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {stylesList.map((sty) => {
                        const isSelected = businessStyle === sty.name;
                        return (
                          <Card 
                            key={sty.id}
                            onClick={() => setBusinessStyle(sty.name)}
                            className={`border text-left cursor-pointer transition-all duration-300 rounded-xl ${
                              isSelected 
                                ? "border-primary bg-primary/10 shadow-md shadow-primary/10" 
                                : "border-[#162238] bg-[#08111F] hover:border-primary/40 hover:bg-[#0D1828]"
                            }`}
                          >
                            <CardContent className="p-5 flex flex-col gap-1.5 h-full justify-between">
                              <h3 className="font-bold text-sm text-foreground">{sty.name}</h3>
                              <p className="text-xs text-muted-foreground leading-normal">{sty.desc}</p>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>

                    <div className="flex flex-col gap-1.5 mt-2">
                      <label className="text-xs font-semibold text-muted-foreground">Additional Business Context (Optional)</label>
                      <Textarea 
                        placeholder="Detail your operational constraints, user demographics, compliance constraints (e.g. SOC2, GDPR, HIPAA)..."
                        value={businessContext}
                        onChange={(e) => setBusinessContext(e.target.value)}
                        className="bg-[#0D1828] border-[#162238] focus-visible:ring-primary text-xs p-4 rounded-xl resize-none text-foreground placeholder:text-muted-foreground"
                        rows={4}
                      />
                    </div>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div
                    key="step-3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col gap-6 text-left"
                  >
                    <div>
                      <h2 className="text-lg font-bold text-foreground tracking-tight flex items-center gap-2">
                        <HelpCircle className="w-5 h-5 text-primary" /> Customer Problem & AI Objectives
                      </h2>
                      <p className="text-xs text-muted-foreground mt-1">Pinpoint your friction points and the concrete capabilities you aim to deploy.</p>
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-semibold text-muted-foreground">Describe the core customer friction / problem *</label>
                      <Textarea 
                        placeholder="What specific task consumes excessive hours or causes user friction? (e.g., 'Customers wait 6 hours for support answers,' 'Analysts spend 20 hours reading 100-page PDF reports manually...')"
                        value={customerProblem}
                        onChange={(e) => setCustomerProblem(e.target.value)}
                        required
                        className="bg-[#0D1828] border-[#162238] focus-visible:ring-primary text-xs p-4 rounded-xl resize-none text-foreground placeholder:text-muted-foreground"
                        rows={4}
                      />
                    </div>

                    <div className="flex flex-col gap-3.5">
                      <label className="text-xs font-semibold text-muted-foreground">Desired Core Objectives (Select all that apply)</label>
                      <div className="flex flex-wrap gap-2">
                        {objectivesList.map((obj, idx) => {
                          const isSelected = aiObjectives.includes(obj);
                          return (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => handleObjectiveToggle(obj)}
                              className={`px-4 py-2 text-xs font-semibold rounded-full border transition-all ${
                                isSelected 
                                  ? "bg-primary border-primary text-white shadow-md shadow-primary/20" 
                                  : "bg-[#08111F] border-[#162238] text-muted-foreground hover:text-foreground hover:border-primary/40"
                              }`}
                            >
                              {obj}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </motion.div>
                )}

                {step === 4 && (
                  <motion.div
                    key="step-4"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col gap-6 text-left"
                  >
                    <div>
                      <h2 className="text-lg font-bold text-foreground tracking-tight flex items-center gap-2">
                        <HardDrive className="w-5 h-5 text-cyan-400" /> Data Assets & POC Sizing
                      </h2>
                      <p className="text-xs text-muted-foreground mt-1">Detail the format, state, and size profile of your evaluation or historical logs.</p>
                    </div>

                    <div className="flex flex-col gap-3.5">
                      <label className="text-xs font-semibold text-muted-foreground">Format of Current Data Assets (Select all that apply)</label>
                      <div className="flex flex-wrap gap-2">
                        {dataTypesList.map((dt, idx) => {
                          const isSelected = dataProfile.includes(dt);
                          return (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => handleDataTypeToggle(dt)}
                              className={`px-4 py-2 text-xs font-semibold rounded-full border transition-all ${
                                isSelected 
                                  ? "bg-primary border-primary text-white shadow-md shadow-primary/20" 
                                  : "bg-[#08111F] border-[#162238] text-muted-foreground hover:text-foreground hover:border-primary/40"
                              }`}
                            >
                              {dt}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="flex flex-col gap-3">
                      <label className="text-xs font-semibold text-muted-foreground font-mono">Approximate Size of POC Sample Data *</label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                        {dataSizesList.map((sz, idx) => {
                          const isSelected = dataSize === sz;
                          return (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => setDataSize(sz)}
                              className={`py-2.5 px-4 text-xs font-mono font-semibold border text-left rounded-xl transition-all ${
                                isSelected 
                                  ? "bg-primary border-primary text-white shadow-md shadow-primary/20" 
                                  : "bg-[#08111F] border-[#162238] text-muted-foreground hover:text-foreground hover:border-primary/40"
                              }`}
                            >
                              {sz}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </motion.div>
                )}

                {step === 5 && (
                  <motion.div
                    key="step-5"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col gap-6 text-left"
                  >
                    <div>
                      <h2 className="text-lg font-bold text-foreground tracking-tight flex items-center gap-2">
                        <ShieldCheck className="w-5 h-5 text-primary" /> Forward to Indus Management
                      </h2>
                      <p className="text-xs text-muted-foreground mt-1">Specify your professional details to submit the compiled project architecture sheet.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Name */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-muted-foreground">Your Name *</label>
                        <Input 
                          type="text"
                          required
                          placeholder="Dr. Seethapathy"
                          value={contactName}
                          onChange={(e) => setContactName(e.target.value)}
                          disabled={loading}
                          className="bg-[#0D1828] border-[#162238] focus-visible:ring-primary text-xs px-4 rounded-xl text-foreground placeholder:text-muted-foreground"
                        />
                      </div>
                      
                      {/* Email */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-muted-foreground">Corporate Email *</label>
                        <Input 
                          type="email"
                          required
                          placeholder="seethapathy@company.com"
                          value={contactEmail}
                          onChange={(e) => setContactEmail(e.target.value)}
                          disabled={loading}
                          className="bg-[#0D1828] border-[#162238] focus-visible:ring-primary text-xs px-4 rounded-xl text-foreground placeholder:text-muted-foreground"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Company */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-muted-foreground">Company Name</label>
                        <Input 
                          type="text"
                          placeholder="Indus Global"
                          value={contactCompany}
                          onChange={(e) => setContactCompany(e.target.value)}
                          disabled={loading}
                          className="bg-[#0D1828] border-[#162238] focus-visible:ring-primary text-xs px-4 rounded-xl text-foreground placeholder:text-muted-foreground"
                        />
                      </div>
                      
                      {/* Designation */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-muted-foreground">Job Title / Designation</label>
                        <Input 
                          type="text"
                          placeholder="Solutions Lead"
                          value={contactRole}
                          onChange={(e) => setContactRole(e.target.value)}
                          disabled={loading}
                          className="bg-[#0D1828] border-[#162238] focus-visible:ring-primary text-xs px-4 rounded-xl text-foreground placeholder:text-muted-foreground"
                        />
                      </div>
                    </div>

                    {/* Final Submission Card Preview */}
                    <Card className="bg-[#08111F] border border-[#162238] p-5 rounded-2xl flex items-start gap-3.5 mt-2">
                      <div className="w-8 h-8 rounded-xl bg-primary/10 border border-primary/25 flex items-center justify-center flex-shrink-0 mt-0.5 text-primary shadow-sm font-mono text-xs">
                        🚀
                      </div>
                      <div className="flex flex-col gap-1 text-xs">
                        <p className="font-bold text-foreground">CPMAI Phase 0 Complete</p>
                        <p className="text-muted-foreground leading-relaxed">
                          Your selected domain (<span className="text-foreground font-semibold">{domain}</span>) and data profile are queued for validation. Upon clicking submit, this assessment sheet is forwarded directly to the Indusnet solutions management team.
                        </p>
                      </div>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Error Message Box */}
            {errorMsg && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-xl p-3 text-left font-mono font-medium"
              >
                ⚠️ {errorMsg}
              </motion.div>
            )}

            {/* Navigation Actions */}
            <div className="flex items-center justify-between border-t border-[#162238] pt-6 mt-4">
              <Button
                type="button"
                variant="ghost"
                onClick={handlePrevStep}
                disabled={step === 1 || loading}
                className="rounded-full text-xs text-muted-foreground hover:text-foreground"
              >
                <ChevronLeft className="w-4 h-4 mr-1" /> Back
              </Button>

              {step < 5 ? (
                <Button
                  type="button"
                  onClick={handleNextStep}
                  className="rounded-full bg-primary text-white font-bold text-xs px-6 py-2 shadow-md shadow-primary/20 hover:bg-primary/90"
                >
                  Continue <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="rounded-full bg-primary text-white font-bold text-xs px-8 py-2.5 shadow-md shadow-primary/20 hover:bg-primary/90"
                >
                  {loading ? (
                    <span className="flex items-center gap-1.5">
                      <Loader2 className="w-3.5 h-3.5 animate-spin" /> Forwarding Sheet...
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      Submit Assessment for Review <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </span>
                  )}
                </Button>
              )}
            </div>
          </div>
        ) : (
          /* SUCCESS VIEW: Opportunity Summary & Recommended AI Path */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full text-center"
          >
            <Card className="bg-[#08111F] border border-[#162238] max-w-3xl mx-auto shadow-2xl relative overflow-hidden rounded-2xl text-left">
              <div className="absolute top-0 right-0 -z-10 w-64 h-64 rounded-full bg-emerald-500/5 blur-3xl" />
              <CardContent className="p-6 sm:p-10 flex flex-col gap-6">
                
                {/* Header Confirmation */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#162238]">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-400 shrink-0">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <div>
                      <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 text-[10px] rounded px-2.5 py-0.5 font-mono font-semibold uppercase">
                        Assessment Submitted
                      </Badge>
                      <h2 className="text-xl sm:text-2xl font-black text-foreground tracking-tight mt-1">
                        Opportunity Scoping Summary
                      </h2>
                    </div>
                  </div>
                  <div className="text-right sm:block hidden">
                    <span className="text-[11px] font-mono text-muted-foreground block">Notification Sent To:</span>
                    <span className="text-xs font-semibold text-primary font-mono">{contactEmail}</span>
                  </div>
                </div>

                {/* 1. Scoped Opportunity Summary */}
                <div className="bg-[#0D1828]/70 border border-[#162238] rounded-xl p-5 space-y-3">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground font-bold flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-primary" />
                    YOUR SCOPED AI PROFILE
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-2.5 rounded-lg bg-[#08111F] border border-[#162238]">
                      <span className="text-[10px] font-mono text-muted-foreground uppercase block">Sector Domain</span>
                      <span className="font-bold text-foreground capitalize">{domain}</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-[#08111F] border border-[#162238]">
                      <span className="text-[10px] font-mono text-muted-foreground uppercase block">Operating Style</span>
                      <span className="font-bold text-foreground capitalize">{businessStyle}</span>
                    </div>
                  </div>
                  {customerProblem && (
                    <div className="p-3 rounded-lg bg-[#08111F] border border-[#162238] text-xs">
                      <span className="text-[10px] font-mono text-muted-foreground uppercase block mb-1">Target Bottleneck</span>
                      <p className="text-foreground/90 italic leading-relaxed">"{customerProblem}"</p>
                    </div>
                  )}
                  <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                    <span className="text-[11px] font-mono text-muted-foreground">POC Scale:</span>
                    <Badge variant="outline" className="text-[10px] font-mono border-primary/30 text-primary">
                      {dataSize}
                    </Badge>
                    {dataProfile.length > 0 && (
                      <span className="text-[11px] text-muted-foreground">
                        · Data: {dataProfile.join(", ")}
                      </span>
                    )}
                  </div>
                </div>

                {/* 2. Recommended AI Capabilities Path */}
                <div className="space-y-3">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-bold flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                    RECOMMENDED AI CAPABILITY PATH
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {aiObjectives.includes("Intelligent RAG Search") && (
                      <Link
                        href="/services/generative-ai"
                        className="p-3.5 rounded-xl bg-[#0D1828] border border-[#162238] hover:border-primary/50 transition-colors flex flex-col justify-between group"
                      >
                        <div className="space-y-1">
                          <span className="text-xs font-bold text-foreground group-hover:text-primary transition-colors flex items-center justify-between">
                            Enterprise RAG & Search
                            <ArrowRight className="w-3 h-3 text-primary group-hover:translate-x-0.5 transition-transform" />
                          </span>
                          <p className="text-[11px] text-muted-foreground leading-relaxed">
                            Private vector retrieval across documents with verified source grounding.
                          </p>
                        </div>
                        <span className="text-[10px] font-mono text-primary font-semibold mt-2">Explore Capability →</span>
                      </Link>
                    )}
                    {aiObjectives.includes("Automated Agentic Workflows") && (
                      <Link
                        href="/services/generative-ai"
                        className="p-3.5 rounded-xl bg-[#0D1828] border border-[#162238] hover:border-[#7C5CFF]/50 transition-colors flex flex-col justify-between group"
                      >
                        <div className="space-y-1">
                          <span className="text-xs font-bold text-foreground group-hover:text-[#7C5CFF] transition-colors flex items-center justify-between">
                            Autonomous AI Agents
                            <ArrowRight className="w-3 h-3 text-[#7C5CFF] group-hover:translate-x-0.5 transition-transform" />
                          </span>
                          <p className="text-[11px] text-muted-foreground leading-relaxed">
                            Tool-calling multi-agent systems with human escalation gates.
                          </p>
                        </div>
                        <span className="text-[10px] font-mono text-[#7C5CFF] font-semibold mt-2">Explore Capability →</span>
                      </Link>
                    )}
                    {aiObjectives.includes("Autonomous Conversational Chatbots") && (
                      <Link
                        href="/services/generative-ai"
                        className="p-3.5 rounded-xl bg-[#0D1828] border border-[#162238] hover:border-emerald-500/50 transition-colors flex flex-col justify-between group"
                      >
                        <div className="space-y-1">
                          <span className="text-xs font-bold text-foreground group-hover:text-emerald-400 transition-colors flex items-center justify-between">
                            Enterprise Copilots & Chatbots
                            <ArrowRight className="w-3 h-3 text-emerald-400 group-hover:translate-x-0.5 transition-transform" />
                          </span>
                          <p className="text-[11px] text-muted-foreground leading-relaxed">
                            Custom multi-channel conversational agents with deterministic safety rails.
                          </p>
                        </div>
                        <span className="text-[10px] font-mono text-emerald-400 font-semibold mt-2">Explore Capability →</span>
                      </Link>
                    )}
                    {aiObjectives.includes("Predictive Analytics Models") && (
                      <Link
                        href="/services"
                        className="p-3.5 rounded-xl bg-[#0D1828] border border-[#162238] hover:border-cyan-500/50 transition-colors flex flex-col justify-between group"
                      >
                        <div className="space-y-1">
                          <span className="text-xs font-bold text-foreground group-hover:text-cyan-400 transition-colors flex items-center justify-between">
                            Decision Intelligence
                            <ArrowRight className="w-3 h-3 text-cyan-400 group-hover:translate-x-0.5 transition-transform" />
                          </span>
                          <p className="text-[11px] text-muted-foreground leading-relaxed">
                            Predictive operational models and real-time anomaly detection.
                          </p>
                        </div>
                        <span className="text-[10px] font-mono text-cyan-400 font-semibold mt-2">Explore Capability →</span>
                      </Link>
                    )}
                    {aiObjectives.includes("Computer Vision Systems") && (
                      <Link
                        href="/services"
                        className="p-3.5 rounded-xl bg-[#0D1828] border border-[#162238] hover:border-amber-500/50 transition-colors flex flex-col justify-between group"
                      >
                        <div className="space-y-1">
                          <span className="text-xs font-bold text-foreground group-hover:text-amber-400 transition-colors flex items-center justify-between">
                            Computer Vision Systems
                            <ArrowRight className="w-3 h-3 text-amber-400 group-hover:translate-x-0.5 transition-transform" />
                          </span>
                          <p className="text-[11px] text-muted-foreground leading-relaxed">
                            Edge visual defect inspection and camera stream analytics.
                          </p>
                        </div>
                        <span className="text-[10px] font-mono text-amber-400 font-semibold mt-2">Explore Capability →</span>
                      </Link>
                    )}
                    {/* Fallback capability card if none specific matched */}
                    {aiObjectives.length === 0 && (
                      <Link
                        href="/services/generative-ai"
                        className="p-3.5 rounded-xl bg-[#0D1828] border border-[#162238] hover:border-primary/50 transition-colors flex flex-col justify-between group"
                      >
                        <div className="space-y-1">
                          <span className="text-xs font-bold text-foreground group-hover:text-primary transition-colors flex items-center justify-between">
                            Enterprise AI Applications
                            <ArrowRight className="w-3 h-3 text-primary group-hover:translate-x-0.5 transition-transform" />
                          </span>
                          <p className="text-[11px] text-muted-foreground leading-relaxed">
                            Custom copilots and streaming enterprise interfaces in private VPCs.
                          </p>
                        </div>
                        <span className="text-[10px] font-mono text-primary font-semibold mt-2">Explore Capability →</span>
                      </Link>
                    )}
                  </div>
                </div>

                {/* Notice */}
                <p className="text-[10px] text-muted-foreground/60 italic text-center font-mono">
                  Directional engineering recommendations. Formal pilot milestones and hardware sizing require technical architecture validation.
                </p>

                {/* 3. Conversion Actions */}
                <div className="border-t border-[#162238] pt-6 flex flex-col sm:flex-row gap-3 items-center justify-between">
                  <p className="text-xs text-muted-foreground">
                    Next step: Review these parameters with an enterprise solutions architect.
                  </p>
                  <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
                    <Button asChild className="rounded-full bg-primary text-white font-bold text-xs px-6 py-2 shadow-md shadow-primary/20 hover:bg-primary/90 w-full sm:w-auto">
                      <Link href={`/contact?service=${encodeURIComponent(domain + " AI Scoping")}&from=scoper`}>
                        Discuss Architecture <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                      </Link>
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        if (typeof window !== "undefined") {
                          window.dispatchEvent(new CustomEvent("open-ai-concierge", { 
                            detail: { 
                              starterId: "explore-use-cases",
                              contextSource: "assessment",
                              industryId: domain.toLowerCase().includes("health") ? "healthcare" : domain.toLowerCase().includes("financ") ? "finance" : undefined,
                              challenge: customerProblem || undefined,
                              assessmentContext: {
                                domain,
                                maturityScore: Math.min(95, 60 + aiObjectives.length * 7),
                                priorityObjectives: aiObjectives.slice(0, 3)
                              }
                            } 
                          }));
                        }
                      }}
                      className="rounded-full bg-[#0D1828] border-[#162238] hover:bg-[#101D30] text-xs px-4 py-2 w-full sm:w-auto cursor-pointer"
                    >
                      Talk to Our AI
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </section>
    </div>
  );
}
