"use client";

import { useState, useMemo } from "react";
import {
  INDUSTRY_PROFILES,
  calculateEnterpriseRoi,
  IndustryProfile,
} from "@/lib/roi-calculator-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Cpu,
  Coins,
  Clock,
  Zap,
  Server,
  ShieldCheck,
  Download,
  CheckCircle2,
  Building2,
  Sparkles,
  ArrowRight,
  HardDrive,
  Gauge,
  X,
} from "lucide-react";

export function RoiCalculator() {
  const [selectedIndustry, setSelectedIndustry] = useState<IndustryProfile>(
    INDUSTRY_PROFILES[0]
  );
  const [volume, setVolume] = useState<number>(INDUSTRY_PROFILES[0].defaultVolume);
  const [reviewMinutes, setReviewMinutes] = useState<number>(
    INDUSTRY_PROFILES[0].defaultReviewMinutes
  );
  const [hourlyRate, setHourlyRate] = useState<number>(
    INDUSTRY_PROFILES[0].defaultHourlyRate
  );
  const [deploymentTarget, setDeploymentTarget] = useState<string>("private_vpc");

  // Modal Lead Capture State
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalName, setModalName] = useState<string>("");
  const [modalEmail, setModalEmail] = useState<string>("");
  const [modalCompany, setModalCompany] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [modalSuccess, setModalSuccess] = useState<boolean>(false);
  const [modalError, setModalError] = useState<string>("");

  const handleIndustryChange = (ind: IndustryProfile) => {
    setSelectedIndustry(ind);
    setVolume(ind.defaultVolume);
    setReviewMinutes(ind.defaultReviewMinutes);
    setHourlyRate(ind.defaultHourlyRate);
  };

  const results = useMemo(() => {
    return calculateEnterpriseRoi(
      volume,
      reviewMinutes,
      hourlyRate,
      selectedIndustry.automationRate
    );
  }, [volume, reviewMinutes, hourlyRate, selectedIndustry.automationRate]);

  const handleExportBlueprint = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalName || !modalEmail) {
      setModalError("Please provide your name and work email.");
      return;
    }

    setIsSubmitting(true);
    setModalError("");

    try {
      const sizingNotes = `
Industry: ${selectedIndustry.name}
Monthly Volume: ${volume.toLocaleString()} tasks/month
Manual Review Time: ${reviewMinutes} mins
Hourly Cost: $${hourlyRate}/hr
Deployment: ${deploymentTarget}
Projected Net Savings: $${results.netAnnualSavings.toLocaleString()}/yr
Recommended GPU: ${results.hardware.gpuModel} (${results.hardware.vram})
Est. Monthly Cloud Compute: $${results.hardware.estimatedMonthlyCloudCost}/mo
Payback Period: ${results.paybackMonths} months
      `.trim();

      const res = await fetch("/api/consultations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: modalName,
          email: modalEmail,
          company: modalCompany || selectedIndustry.name,
          service: `ROI & Hardware Sizing Blueprint (${selectedIndustry.badge})`,
          message: sizingNotes,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setModalSuccess(true);
      } else {
        setModalError(data.error || "Failed to submit request. Please try again.");
      }
    } catch {
      setModalError("Network error. Your request has been logged.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="roi-calculator" className="container mx-auto px-4 md:px-6">
      <div className="glassmorphism-card rounded-3xl p-6 md:p-10 lg:p-12 flex flex-col gap-10 border border-primary/20 relative overflow-hidden">
        {/* Glow backdrop decorative */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl pointer-events-none" />

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto flex flex-col gap-3 relative z-10">
          <div className="flex items-center justify-center gap-2">
            <Badge className="bg-primary/10 border-primary/20 text-primary px-3 py-1 text-xs rounded-full font-bold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-primary" /> Interactive Architecture Engine
            </Badge>
            <Badge className="bg-accent/10 border-accent/20 text-accent px-3 py-1 text-xs rounded-full font-bold">
              Real-Time Sizing
            </Badge>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-heading text-foreground">
            Enterprise <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">AI ROI & Hardware</span> Sizer
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
            Model your unstructured document or agentic workloads. Calculate projected annual cost reductions, labor reallocation, and tailored private GPU cluster sizing.
          </p>
        </div>

        {/* 1. Industry Sector Selector */}
        <div className="flex flex-col gap-3 relative z-10">
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
            <Building2 className="w-4 h-4 text-primary" /> Step 1: Select Industry Domain
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
            {INDUSTRY_PROFILES.map((ind) => {
              const isSelected = selectedIndustry.id === ind.id;
              return (
                <button
                  key={ind.id}
                  onClick={() => handleIndustryChange(ind)}
                  className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col gap-1.5 ${
                    isSelected
                      ? "bg-primary/15 border-primary shadow-md shadow-primary/10 text-foreground"
                      : "bg-muted/40 border-border hover:border-primary/40 hover:bg-muted/70 text-muted-foreground"
                  }`}
                >
                  <span className="text-xs font-bold leading-snug line-clamp-2">
                    {ind.name}
                  </span>
                  <span className="text-[10px] text-primary font-semibold">
                    ~{ind.automationRate}% Automatable
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Grid: Sliders on Left, Live KPIs & Sizing on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative z-10">
          
          {/* Left Column: Workload Sliders (7 Cols) */}
          <div className="lg:col-span-6 flex flex-col gap-6 bg-card/60 rounded-2xl p-6 border border-border">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                <Gauge className="w-4 h-4 text-primary" /> Step 2: Configure Workload Variables
              </h3>
              <span className="text-xs text-muted-foreground italic">
                {selectedIndustry.badge}
              </span>
            </div>

            {/* Slider 1: Monthly Task Volume */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-foreground">Monthly Workload Volume</span>
                <span className="font-extrabold text-primary text-sm">
                  {volume.toLocaleString()} <span className="text-xs font-normal text-muted-foreground">tasks/mo</span>
                </span>
              </div>
              <input
                type="range"
                min={1000}
                max={150000}
                step={1000}
                value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                className="w-full accent-primary h-2 bg-muted rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-muted-foreground">
                <span>1,000</span>
                <span>50,000</span>
                <span>100,000</span>
                <span>150,000+</span>
              </div>
            </div>

            {/* Slider 2: Average Manual Review Time */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-foreground">Manual Processing Time</span>
                <span className="font-extrabold text-primary text-sm">
                  {reviewMinutes} <span className="text-xs font-normal text-muted-foreground">mins/task</span>
                </span>
              </div>
              <input
                type="range"
                min={5}
                max={60}
                step={1}
                value={reviewMinutes}
                onChange={(e) => setReviewMinutes(Number(e.target.value))}
                className="w-full accent-primary h-2 bg-muted rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-muted-foreground">
                <span>5 mins</span>
                <span>20 mins</span>
                <span>40 mins</span>
                <span>60 mins</span>
              </div>
            </div>

            {/* Slider 3: Blended Hourly Workforce Cost */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-foreground">Blended Hourly Workforce Cost</span>
                <span className="font-extrabold text-primary text-sm">
                  ${hourlyRate} <span className="text-xs font-normal text-muted-foreground">/ hr</span>
                </span>
              </div>
              <input
                type="range"
                min={20}
                max={150}
                step={5}
                value={hourlyRate}
                onChange={(e) => setHourlyRate(Number(e.target.value))}
                className="w-full accent-primary h-2 bg-muted rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-muted-foreground">
                <span>$20/hr</span>
                <span>$50/hr</span>
                <span>$100/hr</span>
                <span>$150/hr</span>
              </div>
            </div>

            {/* Deployment Target Selection */}
            <div className="flex flex-col gap-2 pt-2 border-t border-border">
              <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-accent" /> Target Deployment Environment:
              </span>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "private_vpc", label: "Private VPC", desc: "AWS / GCP / Azure" },
                  { id: "air_gapped", label: "Air-Gapped", desc: "On-Premises Data Center" },
                  { id: "hybrid_mesh", label: "Hybrid Mesh", desc: "Edge + Cloud Cluster" },
                ].map((dep) => (
                  <button
                    key={dep.id}
                    onClick={() => setDeploymentTarget(dep.id)}
                    className={`p-2.5 rounded-xl border text-center transition-all ${
                      deploymentTarget === dep.id
                        ? "bg-accent/15 border-accent text-foreground font-bold"
                        : "bg-muted/30 border-border text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    <p className="text-xs leading-tight">{dep.label}</p>
                    <p className="text-[9px] text-muted-foreground mt-0.5">{dep.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Domain Sample Use Cases */}
            <div className="bg-muted/40 rounded-xl p-3 border border-border flex flex-col gap-1.5">
              <span className="text-[11px] font-bold text-foreground">Target Workflows Covered:</span>
              <div className="flex flex-wrap gap-1.5">
                {selectedIndustry.sampleTasks.map((task, i) => (
                  <span key={i} className="text-[10px] bg-background/80 border border-border px-2 py-0.5 rounded-md text-muted-foreground">
                    ✓ {task}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Calculated Impact & GPU Sizing (6 Cols) */}
          <div className="lg:col-span-6 flex flex-col gap-5">
            
            {/* Top KPI Card: Net Projected Savings */}
            <div className="bg-gradient-to-br from-primary/20 via-background to-accent/15 border border-primary/30 rounded-2xl p-6 shadow-xl relative overflow-hidden text-left flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-wider font-bold text-muted-foreground flex items-center gap-1.5">
                  <Coins className="w-4 h-4 text-primary" /> Projected Net Annual Savings
                </span>
                <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-[10px] font-bold">
                  ROI Positive
                </Badge>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl sm:text-5xl font-black text-foreground tracking-tight font-heading">
                  ${results.netAnnualSavings.toLocaleString()}
                </span>
                <span className="text-xs font-semibold text-muted-foreground">/ year</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Net labor savings after factoring dedicated GPU compute costs and human-in-the-loop review overhead.
              </p>

              {/* Secondary Stats Row */}
              <div className="grid grid-cols-3 gap-3 pt-3 border-t border-border/60 mt-1">
                <div className="flex flex-col">
                  <span className="text-[10px] text-muted-foreground font-semibold flex items-center gap-1">
                    <Clock className="w-3 h-3 text-primary" /> Hours Saved
                  </span>
                  <span className="text-sm font-bold text-foreground">
                    {results.automatedHoursSaved.toLocaleString()} <span className="text-[10px] font-normal">hrs/yr</span>
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-muted-foreground font-semibold flex items-center gap-1">
                    <Zap className="w-3 h-3 text-accent" /> Turnaround
                  </span>
                  <span className="text-sm font-bold text-accent">
                    {results.speedupMultiplier}x Faster
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-muted-foreground font-semibold flex items-center gap-1">
                    <Coins className="w-3 h-3 text-emerald-400" /> Payback
                  </span>
                  <span className="text-sm font-bold text-emerald-400">
                    ~{results.paybackMonths} Months
                  </span>
                </div>
              </div>
            </div>

            {/* Hardware & Compute Architecture Sizing Box */}
            <Card className="glassmorphism-card border-border text-left">
              <CardContent className="p-5 flex flex-col gap-4">
                <div className="flex items-center justify-between border-b border-border pb-2.5">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                      <Cpu className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-xs font-bold text-foreground">Recommended Compute Sizing</span>
                  </div>
                  <Badge className="bg-primary/10 border-primary/20 text-primary text-[10px] font-bold">
                    Peak {results.hardware.throughputQps} QPS
                  </Badge>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                  <div className="bg-muted/40 p-3 rounded-xl border border-border flex flex-col gap-1">
                    <span className="text-[10px] text-muted-foreground font-semibold flex items-center gap-1">
                      <Server className="w-3 h-3 text-primary" /> Inference Hardware
                    </span>
                    <span className="font-bold text-foreground leading-snug">
                      {results.hardware.gpuModel}
                    </span>
                    <span className="text-[10px] text-primary">{results.hardware.vram}</span>
                  </div>

                  <div className="bg-muted/40 p-3 rounded-xl border border-border flex flex-col gap-1">
                    <span className="text-[10px] text-muted-foreground font-semibold flex items-center gap-1">
                      <HardDrive className="w-3 h-3 text-accent" /> Vector DB Footprint
                    </span>
                    <span className="font-bold text-foreground leading-snug">
                      {results.hardware.vectorDbStorage}
                    </span>
                    <span className="text-[10px] text-accent font-semibold">Latency: {results.hardware.expectedLatency}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between bg-primary/5 border border-primary/20 rounded-xl px-3.5 py-2.5 text-xs">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Coins className="w-3.5 h-3.5 text-primary" />
                    <span>Estimated Cloud GPU Budget:</span>
                  </div>
                  <span className="font-bold text-foreground">
                    ~${results.hardware.estimatedMonthlyCloudCost.toLocaleString()} <span className="text-[10px] font-normal text-muted-foreground">/ month</span>
                  </span>
                </div>

                {/* Call to Action Button */}
                <Button
                  onClick={() => setIsModalOpen(true)}
                  className="w-full bg-gradient-to-r from-primary to-accent hover:brightness-110 text-white font-bold text-xs h-10 rounded-xl shadow-md shadow-primary/20 flex items-center justify-center gap-2 transition-all mt-1"
                >
                  <Download className="w-3.5 h-3.5" />
                  Request Custom Architecture & ROI Blueprint (PDF)
                </Button>
              </CardContent>
            </Card>

          </div>

        </div>

      </div>

      {/* LEAD CAPTURE MODAL: Export Blueprint */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-3xl max-w-md w-full p-6 text-left relative shadow-2xl animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => {
                setIsModalOpen(false);
                setModalSuccess(false);
                setModalError("");
              }}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {modalSuccess ? (
              <div className="flex flex-col items-center text-center gap-4 py-6">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <h3 className="text-lg font-bold text-foreground">Blueprint Request Dispatched!</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Thank you, <strong>{modalName}</strong>. Our enterprise solutions team will email the comprehensive Architectural Blueprint and GPU Sizing calculation to <strong>{modalEmail}</strong> within one business day.
                  </p>
                </div>
                <Button
                  onClick={() => {
                    setIsModalOpen(false);
                    setModalSuccess(false);
                  }}
                  variant="outline"
                  className="rounded-xl text-xs mt-2"
                >
                  Close Sizer
                </Button>
              </div>
            ) : (
              <form onSubmit={handleExportBlueprint} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-primary/10 border-primary/20 text-primary text-[10px] font-bold">
                      Executive Brief
                    </Badge>
                  </div>
                  <h3 className="text-lg font-bold text-foreground">
                    Get Custom Architectural Blueprint
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Receive your customized ROI breakdown, private VPC topology diagram, and GPU hardware provisioning plan.
                  </p>
                </div>

                {modalError && (
                  <div className="bg-destructive/10 border border-destructive/20 text-destructive text-xs p-2.5 rounded-lg">
                    {modalError}
                  </div>
                )}

                <div className="flex flex-col gap-3 text-xs">
                  <div>
                    <label className="block text-[11px] font-semibold text-muted-foreground mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Jane Doe"
                      value={modalName}
                      onChange={(e) => setModalName(e.target.value)}
                      className="w-full bg-muted/50 border border-border rounded-xl px-3 py-2 text-foreground focus:outline-none focus:border-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-muted-foreground mb-1">
                      Corporate Work Email *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="jane@enterprise.com"
                      value={modalEmail}
                      onChange={(e) => setModalEmail(e.target.value)}
                      className="w-full bg-muted/50 border border-border rounded-xl px-3 py-2 text-foreground focus:outline-none focus:border-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-muted-foreground mb-1">
                      Company / Organization
                    </label>
                    <input
                      type="text"
                      placeholder="Acme Corp"
                      value={modalCompany}
                      onChange={(e) => setModalCompany(e.target.value)}
                      className="w-full bg-muted/50 border border-border rounded-xl px-3 py-2 text-foreground focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>

                <div className="bg-muted/40 p-3 rounded-xl border border-border text-[11px] text-muted-foreground flex flex-col gap-1 mt-1">
                  <span className="font-semibold text-foreground">Includes in Report:</span>
                  <span>• ${results.netAnnualSavings.toLocaleString()} projected annual savings breakdown</span>
                  <span>• Hardware specs: {results.hardware.gpuModel}</span>
                  <span>• Private Cloud VPC vs On-Premises Security Checklist</span>
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-primary hover:bg-primary/90 text-white font-bold text-xs h-10 rounded-xl flex items-center justify-center gap-2 mt-1"
                >
                  {isSubmitting ? (
                    "Generating Spec..."
                  ) : (
                    <>
                      Send Architectural Blueprint <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </Button>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
