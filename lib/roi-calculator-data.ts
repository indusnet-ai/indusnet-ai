export interface IndustryProfile {
  id: string;
  name: string;
  badge: string;
  description: string;
  defaultVolume: number;
  defaultReviewMinutes: number;
  defaultHourlyRate: number;
  automationRate: number; // percentage
  sampleTasks: string[];
}

export const INDUSTRY_PROFILES: IndustryProfile[] = [
  {
    id: "finance",
    name: "Financial Services & Banking",
    badge: "FinTech & Banking",
    description: "Automate loan underwriting, fraud alert verification, KYC extraction, and regulatory compliance disclosures.",
    defaultVolume: 20000,
    defaultReviewMinutes: 25,
    defaultHourlyRate: 55,
    automationRate: 82,
    sampleTasks: ["Loan dossier verification", "AML transaction audit", "KYC doc extraction", "SEC filing analysis"],
  },
  {
    id: "legal",
    name: "Legal, Risk & Compliance",
    badge: "Legal & Regulatory",
    description: "Extract risky contract clauses, redline vendor MSAs against playbooks, and accelerate M&A due diligence.",
    defaultVolume: 8000,
    defaultReviewMinutes: 40,
    defaultHourlyRate: 85,
    automationRate: 85,
    sampleTasks: ["Vendor MSA redlining", "M&A diligence indexing", "Indemnification analysis", "GDPR compliance check"],
  },
  {
    id: "healthcare",
    name: "Healthcare & Life Sciences",
    badge: "Healthcare & Pharma",
    description: "HIPAA-aligned clinical note summarization, medical prior-authorization triage, and claims processing.",
    defaultVolume: 25000,
    defaultReviewMinutes: 20,
    defaultHourlyRate: 50,
    automationRate: 80,
    sampleTasks: ["Prior-auth approvals", "Clinical chart parsing", "Claims anomaly check", "Patient intake structuring"],
  },
  {
    id: "supply_chain",
    name: "Supply Chain & Procurement",
    badge: "Manufacturing & Logistics",
    description: "Multi-vendor RFP responses, invoice 3-way matching, Bill-of-Materials verification, and logistics tracking.",
    defaultVolume: 15000,
    defaultReviewMinutes: 18,
    defaultHourlyRate: 42,
    automationRate: 88,
    sampleTasks: ["Invoice 3-way matching", "Supplier RFP processing", "BOM verification", "Customs clearance logs"],
  },
  {
    id: "support",
    name: "Enterprise Customer Operations",
    badge: "Enterprise Support",
    description: "Tier-1/2 autonomous ticket deflection, multi-turn escalation summaries, and dynamic knowledge lookup.",
    defaultVolume: 40000,
    defaultReviewMinutes: 14,
    defaultHourlyRate: 32,
    automationRate: 90,
    sampleTasks: ["Technical ticket resolution", "Escalation synthesis", "Refund verification", "SLA monitoring"],
  },
];

export interface HardwareSizing {
  gpuModel: string;
  vram: string;
  architecture: string;
  estimatedMonthlyCloudCost: number;
  vectorDbStorage: string;
  expectedLatency: string;
  throughputQps: number;
}

export interface RoiCalculationResult {
  currentAnnualCost: number;
  annualHoursManual: number;
  automatedHoursSaved: number;
  grossAnnualSavings: number;
  netAnnualSavings: number;
  monthlySavings: number;
  paybackMonths: number;
  speedupMultiplier: number;
  hardware: HardwareSizing;
}

export function calculateEnterpriseRoi(
  volume: number,
  reviewMinutes: number,
  hourlyRate: number,
  automationRate: number
): RoiCalculationResult {
  const annualVolume = volume * 12;
  const annualHoursManual = Math.round((annualVolume * reviewMinutes) / 60);
  const currentAnnualCost = Math.round(annualHoursManual * hourlyRate);

  const effectiveAutomation = Math.min(Math.max(automationRate, 50), 95) / 100;
  const automatedHoursSaved = Math.round(annualHoursManual * effectiveAutomation);
  const grossAnnualSavings = Math.round(automatedHoursSaved * hourlyRate);

  // Throughput and Hardware Sizing (assuming 22 business days, 8 peak hours, 2.5x peak burst)
  const dailyWorkload = volume / 22;
  const peakQps = Math.max(0.2, Math.round(((dailyWorkload / (8 * 3600)) * 2.5) * 10) / 10);

  let hardware: HardwareSizing;
  if (peakQps < 2.5) {
    hardware = {
      gpuModel: "1x NVIDIA L4 (Ada Lovelace)",
      vram: "24 GB GDDR6",
      architecture: "Single-Node vLLM Serverless / VPC Container",
      estimatedMonthlyCloudCost: 450,
      vectorDbStorage: "20 GB pgvector / Milvus",
      expectedLatency: "< 190ms TTFT",
      throughputQps: peakQps,
    };
  } else if (peakQps < 10) {
    hardware = {
      gpuModel: "2x NVIDIA L4 (Combined 48 GB)",
      vram: "48 GB GDDR6",
      architecture: "Dual-Replica Load Balanced Private VPC Cluster",
      estimatedMonthlyCloudCost: 890,
      vectorDbStorage: "60 GB Distributed Milvus Cluster",
      expectedLatency: "< 230ms TTFT",
      throughputQps: peakQps,
    };
  } else if (peakQps < 30) {
    hardware = {
      gpuModel: "2x NVIDIA A10G (Tensor Core)",
      vram: "48 GB High-Bandwidth VRAM",
      architecture: "High-Throughput Continuous Batching Engine",
      estimatedMonthlyCloudCost: 1750,
      vectorDbStorage: "150 GB Qdrant / Milvus Cluster",
      expectedLatency: "< 260ms TTFT",
      throughputQps: peakQps,
    };
  } else {
    hardware = {
      gpuModel: "Cluster of 4x NVIDIA A10G / 2x H100",
      vram: "96+ GB Tensor Core VRAM",
      architecture: "Multi-Node Distributed PagedAttention Mesh",
      estimatedMonthlyCloudCost: 3500,
      vectorDbStorage: "400+ GB Dedicated Vector Mesh",
      expectedLatency: "< 160ms TTFT",
      throughputQps: peakQps,
    };
  }

  const annualComputeInfrastructureCost = hardware.estimatedMonthlyCloudCost * 12 * 1.12; // 12% maintenance buffer
  const netAnnualSavings = Math.max(0, Math.round(grossAnnualSavings - annualComputeInfrastructureCost));
  const monthlySavings = Math.round(netAnnualSavings / 12);

  // Payback period estimation based on standard enterprise onboarding/setup cost ($35k - $60k depending on scale)
  const baseImplementationCapEx = Math.min(75000, Math.max(30000, Math.round(volume * 1.8)));
  const rawPayback = monthlySavings > 0 ? baseImplementationCapEx / monthlySavings : 12;
  const paybackMonths = Math.min(12, Math.max(1.5, Math.round(rawPayback * 10) / 10));

  // Speedup: AI processes task in ~25-35 seconds vs human minutes
  const speedupMultiplier = Math.max(10, Math.round((reviewMinutes * 60) / 30));

  return {
    currentAnnualCost,
    annualHoursManual,
    automatedHoursSaved,
    grossAnnualSavings,
    netAnnualSavings,
    monthlySavings,
    paybackMonths,
    speedupMultiplier,
    hardware,
  };
}
