"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Mail, Phone, MapPin, Loader2, CheckCircle2, 
  Calendar as CalendarIcon, Clock, Sparkles, Map, Globe, Cpu, ArrowRight, ShieldCheck 
} from "lucide-react";
import { Linkedin } from "@/components/ui/brand-icons";
import { useSearchParams } from "next/navigation";
import { trackEvent, ConversionEvents } from "@/lib/analytics";

const servicesList = [
  "Enterprise RAG & Knowledge Systems",
  "AI Applications & Copilots",
  "Autonomous AI Agents",
  "Intelligent Workflow Automation",
  "Computer Vision Systems",
  "Predictive Analytics & Decision Intelligence",
  "Corporate AI Training & CPMAI",
  "Technical AI Consulting & Roadmap"
];

// Simulated available calendar slots
const calendarSlots = [
  "09:30 AM", "11:00 AM", "01:30 PM", "03:00 PM", "04:30 PM"
];

export default function ContactClient() {
  const searchParams = useSearchParams();
  const paramService = searchParams.get("service") || "";
  const paramMessage = searchParams.get("message") || searchParams.get("challenge") || "";
  const paramDomain = searchParams.get("domain") || "";

  // Dynamic services list to include incoming custom service if not in standard list
  const activeServicesList = React.useMemo(() => {
    if (paramService && !servicesList.includes(paramService)) {
      return [paramService, ...servicesList];
    }
    return servicesList;
  }, [paramService]);

  // Inquiry Form State
  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    company: "",
    service: paramService || "Enterprise RAG & Knowledge Systems",
    message: paramMessage ? `Regarding ${paramDomain ? paramDomain + ": " : ""}${paramMessage}` : ""
  });
  const [inquiryStatus, setInquiryStatus] = React.useState<"idle" | "loading" | "success" | "error">("idle");
  const [inquiryMessage, setInquiryMessage] = React.useState("");

  // Booking State
  const [selectedSlot, setSelectedSlot] = React.useState("");
  const [selectedDay, setSelectedDay] = React.useState("Tomorrow");
  const [bookingStatus, setBookingStatus] = React.useState<"idle" | "loading" | "success" | "error">("idle");
  const [bookingStep, setBookingStep] = React.useState<1 | 2>(1);
  const [bookingFields, setBookingFields] = React.useState({
    name: "",
    email: "",
    company: ""
  });
  const [bookingError, setBookingError] = React.useState("");

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setInquiryStatus("loading");
    try {
      const response = await fetch("/api/consultations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const data = await response.json().catch(() => ({}));
      if (response.ok) {
        trackEvent(ConversionEvents.LEAD_FORM_SUBMITTED, { form_type: "inquiry", service: formData.service });
        trackEvent(ConversionEvents.CONTACT_SUBMIT, { form_type: "inquiry", service: formData.service });
        setInquiryStatus("success");
        setInquiryMessage(data.message || "Consultation inquiry received! An enterprise AI architect will review your project constraints and follow up promptly.");
        setFormData({ name: "", email: "", company: "", service: "Enterprise RAG & Knowledge Systems", message: "" });
      } else {
        setInquiryStatus("error");
        setInquiryMessage(data.error || "Failed to submit enquiry. Please email info@indusnet-ai.com.");
      }
    } catch (err: any) {
      setInquiryStatus("error");
      setInquiryMessage(err.message || "Network error. Please try again or email info@indusnet-ai.com.");
    }
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlot) return;

    if (bookingStep === 1) {
      // Transition to client detail collection step
      setBookingStep(2);
      return;
    }

    if (!bookingFields.name || !bookingFields.email) {
      setBookingError("Name and email are required to schedule a call.");
      return;
    }

    setBookingStatus("loading");
    setBookingError("");

    try {
      const response = await fetch("/api/consultations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: bookingFields.name,
          email: bookingFields.email,
          company: bookingFields.company,
          bookingDate: `${selectedDay} at ${selectedSlot}`
        })
      });

      const errorData = await response.json().catch(() => ({}));
      if (response.ok) {
        trackEvent(ConversionEvents.LEAD_FORM_SUBMITTED, { form_type: "booking", slot: `${selectedDay} at ${selectedSlot}` });
        trackEvent(ConversionEvents.CONTACT_SUBMIT, { form_type: "booking", slot: `${selectedDay} at ${selectedSlot}` });
        setBookingStatus("success");
      } else {
        setBookingStatus("error");
        setBookingError(errorData.error || "Failed to schedule consultation. Please email info@indusnet-ai.com.");
      }
    } catch (err: any) {
      console.error("Booking error:", err);
      setBookingStatus("error");
      setBookingError(err.message || "Network error. Please try again or email info@indusnet-ai.com.");
    }
  };

  return (
    <div className="flex flex-col gap-24 md:gap-32 pt-32 pb-24">
      {/* 1. HERO HEADER */}
      <section className="container mx-auto px-4 md:px-6 relative overflow-hidden text-center max-w-4xl flex flex-col gap-6">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -z-10 w-[400px] h-[400px] rounded-full bg-primary/10 blur-[120px]" />
        
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto"
        >
          <Badge className="bg-primary/10 border-primary/20 text-primary rounded-full px-3 py-1 text-xs">
            Start the Transformation
          </Badge>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-[1.1] font-heading"
        >
          Discuss Your AI Architecture with our <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Engineering Team</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-muted-foreground text-base sm:text-lg leading-relaxed max-w-2xl mx-auto"
        >
          Have questions about private VPC isolation, regulatory compliance boundaries, multi-agent orchestration, or legacy ERP integration? Connect directly with our enterprise AI architects.
        </motion.p>

        {/* What Happens Next 3-Step Process */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto pt-4 text-left"
        >
          <div className="p-4 rounded-xl bg-[#08111F] border border-[#162238] space-y-1">
            <span className="text-[10px] font-mono uppercase font-bold text-primary block">Step 1 · Direct Scoping</span>
            <h3 className="text-xs font-bold text-foreground">Technical Review</h3>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              We review your workflow friction, data readiness, and security boundaries.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-[#08111F] border border-[#162238] space-y-1">
            <span className="text-[10px] font-mono uppercase font-bold text-cyan-400 block">Step 2 · Architecture</span>
            <h3 className="text-xs font-bold text-foreground">Stack & Model Sizing</h3>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              We evaluate model selection, private VPC hosting, and integration touchpoints.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-[#08111F] border border-[#162238] space-y-1">
            <span className="text-[10px] font-mono uppercase font-bold text-emerald-400 block">Step 3 · Blueprint</span>
            <h3 className="text-xs font-bold text-foreground">Production Roadmap</h3>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              You receive an actionable 90-day milestone roadmap with bounded budgets.
            </p>
          </div>
        </motion.div>
      </section>

      {/* 2. CORE WORKSPACE: FORM + CALENDAR SIMULATOR */}
      <section className="container mx-auto px-4 md:px-6 max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column: Form & details */}
          <div className="lg:col-span-6 flex flex-col gap-8">
            <Card className="bg-[#08111F] border border-[#162238] rounded-2xl text-left relative overflow-hidden shadow-xl">
              <CardContent className="p-8 flex flex-col gap-6">
                <div>
                  <h2 className="text-xl font-bold text-foreground tracking-tight">Submit an Inquiry</h2>
                  <p className="text-xs text-muted-foreground mt-1">Provide details on your project constraints and stack needs.</p>
                </div>

                <form onSubmit={handleInquirySubmit} className="flex flex-col gap-4">
                  {/* Name */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">Full Name *</label>
                    <Input
                      type="text"
                      placeholder="Jane Doe"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      disabled={inquiryStatus === "loading" || inquiryStatus === "success"}
                      className="bg-[#0D1828] border-[#162238] focus-visible:ring-primary text-xs px-4 rounded-xl text-foreground placeholder:text-muted-foreground"
                    />
                  </div>

                  {/* Email & Company */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-muted-foreground">Corporate Email *</label>
                      <Input
                        type="email"
                        placeholder="jane@company.com"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        disabled={inquiryStatus === "loading" || inquiryStatus === "success"}
                        className="bg-[#0D1828] border-[#162238] focus-visible:ring-primary text-xs px-4 rounded-xl text-foreground placeholder:text-muted-foreground"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-muted-foreground">Company Name</label>
                      <Input
                        type="text"
                        placeholder="Acme Corp"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        disabled={inquiryStatus === "loading" || inquiryStatus === "success"}
                        className="bg-[#0D1828] border-[#162238] focus-visible:ring-primary text-xs px-4 rounded-xl text-foreground placeholder:text-muted-foreground"
                      />
                    </div>
                  </div>

                  {/* Service selector */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">Core Service of Interest</label>
                    <select
                      value={formData.service}
                      onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                      disabled={inquiryStatus === "loading" || inquiryStatus === "success"}
                      className="flex h-10 w-full rounded-xl border border-[#162238] bg-[#0D1828] px-3 py-1 text-xs text-foreground shadow-sm transition-colors focus:outline-none focus:border-primary"
                    >
                      {activeServicesList.map((srv, idx) => (
                        <option key={idx} value={srv} className="bg-[#08111F] text-foreground text-xs">
                          {srv}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Message */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">Project Details / Message *</label>
                    <Textarea
                      placeholder="Please describe your legacy software bottlenecks, private data structures, or CPMAI class sizing queries..."
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      disabled={inquiryStatus === "loading" || inquiryStatus === "success"}
                      className="bg-[#0D1828] border-[#162238] focus-visible:ring-primary text-xs p-4 rounded-xl resize-none text-foreground placeholder:text-muted-foreground"
                    />
                  </div>

                  {/* Submit */}
                  <Button
                    type="submit"
                    size="lg"
                    disabled={inquiryStatus === "loading" || inquiryStatus === "success"}
                    className="w-full rounded-full bg-primary text-white font-bold hover:bg-primary/90 shadow-md shadow-primary/20"
                  >
                    {inquiryStatus === "loading" ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" /> Submitting Inquiry...
                      </span>
                    ) : (
                      "Discuss Architecture with an Architect"
                    )}
                  </Button>

                  <p className="text-[10px] text-muted-foreground/70 italic text-center font-mono">
                    Privacy: Information is used strictly to evaluate technical architecture requirements and project feasibility. No third-party sharing.
                  </p>

                  {inquiryStatus === "success" && (
                    <div className="flex items-start gap-2.5 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 mt-2 font-mono">
                      <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      <span>{inquiryMessage}</span>
                    </div>
                  )}
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Calendly Booking simulator */}
          <div className="lg:col-span-6 flex flex-col gap-8">
            <Card className="bg-[#08111F] border border-[#162238] rounded-2xl text-left relative overflow-hidden shadow-xl">
              {/* Radial glow */}
              <div className="absolute top-0 right-0 -z-10 w-48 h-48 rounded-full bg-primary/5 blur-2xl" />

              <CardContent className="p-8 flex flex-col gap-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Badge className="bg-primary/10 text-primary border border-primary/25 text-[10px] rounded-md px-2.5 py-0.5 font-mono font-semibold">
                      Live Scheduling
                    </Badge>
                    <h2 className="text-xl font-bold text-foreground tracking-tight mt-2">Book a 30-Min Call</h2>
                    <p className="text-xs text-muted-foreground mt-1">Lock in a calendar slot directly with a Solutions Architect.</p>
                  </div>
                  <Globe className="w-6 h-6 text-primary animate-pulse" />
                </div>

                {bookingStatus === "success" ? (
                  <div className="flex flex-col items-center justify-center py-10 text-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center animate-bounce">
                      <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-foreground">Call Request Scheduled</h3>
                      <p className="text-xs text-muted-foreground mt-1 max-w-xs mx-auto">
                        Your meeting request for <strong className="text-foreground">{selectedDay} at {selectedSlot}</strong> has been logged. An email alert has been sent to our solutions engineering team, and a calendar invite will be confirmed promptly.
                      </p>
                    </div>
                    <Button onClick={() => {
                      setBookingStatus("idle");
                      setBookingStep(1);
                      setBookingFields({ name: "", email: "", company: "" });
                    }} className="rounded-full bg-[#0D1828] border border-[#162238] hover:bg-[#101D30] text-xs px-6 py-2 text-foreground font-semibold">
                      Book Another Slot
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleBookingSubmit} className="flex flex-col gap-5">
                    {bookingStep === 1 ? (
                      <>
                        {/* Day selector */}
                        <div className="flex flex-col gap-2">
                          <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5 font-mono">
                            <CalendarIcon className="w-3.5 h-3.5 text-primary" /> Select Day
                          </label>
                          <div className="grid grid-cols-3 gap-2">
                            {["Tomorrow", "In 2 Days", "In 3 Days"].map((day) => (
                              <button
                                key={day}
                                type="button"
                                onClick={() => setSelectedDay(day)}
                                className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all ${
                                  selectedDay === day
                                    ? "bg-primary border-primary text-white shadow-md shadow-primary/20"
                                    : "bg-[#0D1828] border-[#162238] text-muted-foreground hover:text-foreground hover:border-primary/40"
                                }`}
                              >
                                {day}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Time slot selector */}
                        <div className="flex flex-col gap-2">
                          <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5 font-mono">
                            <Clock className="w-3.5 h-3.5 text-cyan-400" /> Available Times (IST)
                          </label>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {calendarSlots.map((slot) => (
                              <button
                                key={slot}
                                type="button"
                                onClick={() => setSelectedSlot(slot)}
                                className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all font-mono ${
                                  selectedSlot === slot
                                    ? "bg-primary border-primary text-white shadow-md shadow-primary/20"
                                    : "bg-[#0D1828] border-[#162238] text-muted-foreground hover:text-foreground hover:border-primary/40"
                                }`}
                              >
                                {slot}
                              </button>
                            ))}
                          </div>
                        </div>
                      </>
                    ) : (
                      <motion.div 
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex flex-col gap-4 text-left"
                      >
                        <div className="bg-primary/10 border border-primary/25 rounded-xl p-3 text-xs text-primary flex items-center justify-between font-mono">
                          <span>Selected: <strong>{selectedDay} at {selectedSlot}</strong></span>
                          <button 
                            type="button" 
                            onClick={() => setBookingStep(1)} 
                            className="text-xs text-cyan-400 hover:underline font-bold"
                          >
                            Change Slot
                          </button>
                        </div>

                        {/* Name */}
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] uppercase font-bold text-muted-foreground font-mono">Full Name *</label>
                          <Input 
                            type="text" 
                            required
                            placeholder="John Doe"
                            value={bookingFields.name}
                            onChange={(e) => setBookingFields({ ...bookingFields, name: e.target.value })}
                            className="bg-[#0D1828] border-[#162238] focus-visible:ring-primary text-xs px-4 rounded-xl text-foreground placeholder:text-muted-foreground"
                          />
                        </div>

                        {/* Email */}
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] uppercase font-bold text-muted-foreground font-mono">Corporate Email *</label>
                          <Input 
                            type="email" 
                            required
                            placeholder="john@company.com"
                            value={bookingFields.email}
                            onChange={(e) => setBookingFields({ ...bookingFields, email: e.target.value })}
                            className="bg-[#0D1828] border-[#162238] focus-visible:ring-primary text-xs px-4 rounded-xl text-foreground placeholder:text-muted-foreground"
                          />
                        </div>

                        {/* Company */}
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] uppercase font-bold text-muted-foreground font-mono">Company Name</label>
                          <Input 
                            type="text" 
                            placeholder="Acme Corp"
                            value={bookingFields.company}
                            onChange={(e) => setBookingFields({ ...bookingFields, company: e.target.value })}
                            className="bg-[#0D1828] border-[#162238] focus-visible:ring-primary text-xs px-4 rounded-xl text-foreground placeholder:text-muted-foreground"
                          />
                        </div>

                        {bookingError && (
                          <div className="text-xs text-rose-400 font-semibold bg-rose-500/10 border border-rose-500/20 rounded-xl p-2.5 font-mono">
                            {bookingError}
                          </div>
                        )}
                      </motion.div>
                    )}

                    {/* Submit booking */}
                    <div className="flex gap-2">
                      {bookingStep === 2 && (
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => setBookingStep(1)}
                          disabled={bookingStatus === "loading"}
                          className="rounded-full bg-[#0D1828] border border-[#162238] text-xs px-4"
                        >
                          Back
                        </Button>
                      )}
                      <Button
                        type="submit"
                        size="lg"
                        disabled={!selectedSlot || bookingStatus === "loading"}
                        className="w-full rounded-full bg-primary text-white font-bold hover:bg-primary/90 shadow-md shadow-primary/20"
                      >
                        {bookingStatus === "loading" ? (
                          <span className="flex items-center gap-2 justify-center">
                            <Loader2 className="w-4 h-4 animate-spin" /> Scheduling...
                          </span>
                        ) : bookingStep === 1 ? (
                          "Continue to Details"
                        ) : (
                          "Confirm Scheduled Call"
                        )}
                      </Button>
                    </div>
                  </form>
                )}

              </CardContent>
            </Card>
          </div>

        </div>
      </section>

      <section className="container mx-auto px-4 md:px-6 max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Details */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <Card className="bg-[#08111F] border border-[#162238] rounded-2xl text-left flex-grow shadow-lg">
              <CardContent className="p-6 flex flex-col gap-5 justify-center h-full">
                <h3 className="font-bold text-foreground text-base border-b border-[#162238] pb-3 tracking-tight">Office Contact Details</h3>
                <div className="flex flex-col gap-5">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/25 flex items-center justify-center flex-shrink-0 mt-0.5 text-primary shadow-sm">
                      <Mail className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground uppercase font-mono font-bold">Email</p>
                      <a href="mailto:info@indusnet-ai.com" className="text-xs text-foreground hover:text-primary transition-colors">
                        info@indusnet-ai.com
                      </a>
                    </div>
                  </div>

                  {/* Chennai HQ */}
                  <div className="border-t border-[#162238] pt-4 flex flex-col gap-2.5">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-primary/15 text-primary border-primary/30 text-[9px] rounded font-mono font-bold uppercase tracking-wider">India (HQ)</Badge>
                      <span className="text-xs font-semibold text-foreground/90">Chennai Corporate Campus</span>
                    </div>

                    <div className="flex items-start gap-3 pl-0.5">
                      <MapPin className="w-3.5 h-3.5 text-primary mt-0.5 flex-shrink-0" />
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Number 46 First Floor, Tansi Nagar, Velachery, Chennai 600042
                      </p>
                    </div>

                    <div className="flex items-start gap-3 pl-0.5">
                      <Phone className="w-3.5 h-3.5 text-cyan-400 mt-0.5 flex-shrink-0" />
                      <a href="tel:+919884915977" className="text-xs text-foreground/80 hover:text-cyan-400 transition-colors">
                        +91-988-491-5977
                      </a>
                    </div>
                  </div>

                  {/* Singapore Office */}
                  <div className="border-t border-[#162238] pt-4 flex flex-col gap-2.5">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-cyan-500/15 text-cyan-400 border-cyan-500/30 text-[9px] rounded font-mono font-bold uppercase tracking-wider">Singapore</Badge>
                      <span className="text-xs font-semibold text-foreground/90">Singapore Regional Office</span>
                    </div>

                    <div className="flex items-start gap-3 pl-0.5">
                      <MapPin className="w-3.5 h-3.5 text-primary mt-0.5 flex-shrink-0" />
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        51 Ubi Ave 1, #05-16 Paya Ubi Industrial Park, Singapore 408933
                      </p>
                    </div>

                    <div className="flex items-start gap-3 pl-0.5">
                      <Phone className="w-3.5 h-3.5 text-cyan-400 mt-0.5 flex-shrink-0" />
                      <div className="flex flex-col gap-1">
                        <a href="tel:+6594483805" className="text-xs text-foreground/80 hover:text-cyan-400 transition-colors">
                          +65-9448-3805
                        </a>
                        <a href="tel:+6567474753" className="text-xs text-foreground/80 hover:text-cyan-400 transition-colors">
                          +65-6747-4753
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Maps Static Placeholder Card */}
          <div className="lg:col-span-7">
            <Card className="bg-[#08111F] border border-[#162238] rounded-2xl text-left overflow-hidden h-full flex flex-col justify-center shadow-lg">
              <CardContent className="p-8 relative h-full flex flex-col justify-center bg-[#0D1828]/40 group">
                <div className="absolute inset-0 bg-primary/5 opacity-50 group-hover:opacity-75 transition-opacity duration-300" />
                <div className="z-10 flex flex-col gap-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/25 flex items-center justify-center text-primary shadow-sm">
                      <Map className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground text-sm">Our Global Presence</h4>
                      <p className="text-[10px] text-muted-foreground font-mono">Dedicated AI engineering hubs and consulting facilities</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                    <div className="bg-[#08111F] border border-[#162238] p-4 rounded-xl flex flex-col gap-2 hover:border-primary/40 transition-colors">
                      <span className="text-[10px] font-mono font-bold text-primary uppercase tracking-wide">India Campus</span>
                      <h5 className="font-semibold text-foreground text-xs">Chennai Technical HQ</h5>
                      <p className="text-[11px] text-muted-foreground leading-relaxed">
                        Fully equipped with private GPU computing clusters, certified CPMAI training spaces, and core engineering hubs.
                      </p>
                    </div>

                    <div className="bg-[#08111F] border border-[#162238] p-4 rounded-xl flex flex-col gap-2 hover:border-cyan-400/40 transition-colors">
                      <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-wide">Singapore Hub</span>
                      <h5 className="font-semibold text-foreground text-xs">Asia-Pacific Regional Office</h5>
                      <p className="text-[11px] text-muted-foreground leading-relaxed">
                        Serving APAC enterprises with bespoke LLM implementations, AI governance alignment, and strategic consulting.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
