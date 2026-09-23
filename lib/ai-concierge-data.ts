export interface AiConciergeStarter {
  id: string;
  label: string;
  tag: string;
  icon: string;
  defaultChallenge: string;
  recommendedApproach: string;
  capabilities: string[];
  architectureLayers: {
    layer: string;
    technology: string;
  }[];
  timeline: string;
  roiProjection: string;
  targetServiceUrl: string;
  targetServiceName: string;
}

export interface IndustryOption {
  id: string;
  name: string;
  sampleChallenge: string;
}

export interface ScaleOption {
  id: string;
  name: string;
  complianceFocus: string;
}

export const CONCIERGE_OPENING_MESSAGE = 
  "I'm the Indusnet AI Advisor. What are you trying to build, automate or transform?";

export const CONCIERGE_STARTERS: AiConciergeStarter[] = [
  {
    id: "explore-opportunities",
    label: "Explore AI Opportunities",
    tag: "Strategy & Audit",
    icon: "Compass",
    defaultChallenge: "Identifying high-yield, low-risk enterprise workflows ripe for generative and agentic acceleration.",
    recommendedApproach: "Cognitive Task Friction Audit + 90-Day CPMAI Opportunity Roadmap",
    capabilities: [
      "Friction Point Identification",
      "Data Feasibility & Readiness Scoring",
      "Zero-Trust Compliance Boundaries",
      "Executive Financial ROI Modeling"
    ],
    architectureLayers: [
      { layer: "Evaluation Framework", technology: "CPMAI (Cognitive Project Management for AI) Matrix" },
      { layer: "Governance Layer", technology: "Zero-Trust Enterprise Data & IP Protection Boundary" },
      { layer: "Hardware Sizing", technology: "Cloud VPC vs On-Premises Compute Budgeting" },
      { layer: "Output Deliverable", technology: "Prioritized 90-Day Production Roadmap & Budget" }
    ],
    timeline: "2 to 3 Weeks to Validated POC",
    roiProjection: "Typical 3x–5x operational acceleration in target pilot workflow",
    targetServiceUrl: "/assessment",
    targetServiceName: "AI Scoper & Assessment"
  },
  {
    id: "build-application",
    label: "Build an AI Application",
    tag: "Full-Stack AI",
    icon: "Cpu",
    defaultChallenge: "Engineering a production-grade, secure Generative AI software application with private corporate data.",
    recommendedApproach: "Full-Stack Enterprise AI Software Architecture (Isolated VPC + Streaming UI)",
    capabilities: [
      "Custom Copilots & Cockpits",
      "Next.js 16 Streaming Interfaces",
      "Deterministic Semantic Guardrails",
      "vLLM & Triton Inference Clustering"
    ],
    architectureLayers: [
      { layer: "Interface Layer", technology: "Next.js 16 + React 19 Streaming Cockpit with Server Actions" },
      { layer: "Model Gateway", technology: "Frontier LLM Routing (Claude 3.5 Sonnet / GPT-4o / Private Llama-3)" },
      { layer: "Guardrail Middleware", technology: "NeMo Guardrails + Semantic Firewall + RBAC Token Scoping" },
      { layer: "Inference Mesh", technology: "Private VPC (AWS Bedrock / Azure OpenAI / On-Prem vLLM)" }
    ],
    timeline: "4 to 6 Weeks to Production Deployment",
    roiProjection: "Sub-400ms token latency with 99.8% compliance accuracy and zero hallucination risk",
    targetServiceUrl: "/services/generative-ai",
    targetServiceName: "Generative AI Application Engineering"
  },
  {
    id: "deploy-agents",
    label: "Deploy AI Agents",
    tag: "Agentic Systems",
    icon: "Bot",
    defaultChallenge: "Moving past basic chatbots to autonomous multi-agent swarms that plan tasks and invoke enterprise tools.",
    recommendedApproach: "Multi-Agent System & Autonomous Workflow Engine (ReAct / Reflexion Loop)",
    capabilities: [
      "Planner & Orchestrator Swarms",
      "Sandboxed OpenAPI Tool Callers",
      "Self-Correction & Critic Loops",
      "Human-in-the-Loop Escalation"
    ],
    architectureLayers: [
      { layer: "Orchestrator Agent", technology: "Planner Agent using ReAct / Reflexion Loop with State Memory" },
      { layer: "Worker Agents", technology: "Data Extraction, Code Generation, and Policy Audit Agents" },
      { layer: "Tool Execution Layer", technology: "Secure OpenAPI Tool Callers with OAuth2 Sandbox Isolation" },
      { layer: "Human-in-the-Loop", technology: "Automated Escalation Gates for High-Value Transactions" }
    ],
    timeline: "4 to 7 Weeks to Autonomous Autopilot",
    roiProjection: "85% reduction in manual back-office cycle time with automated cryptographic audit trails",
    targetServiceUrl: "/services/generative-ai",
    targetServiceName: "Autonomous AI Agents"
  },
  {
    id: "implement-rag",
    label: "Implement Enterprise RAG",
    tag: "Knowledge Systems",
    icon: "Search",
    defaultChallenge: "Enterprise knowledge is scattered across SharePoint, Notion, Drive, and SQL, leading to manual research friction.",
    recommendedApproach: "Enterprise Hybrid RAG (Dense-Sparse Search + Knowledge Graph Attribution)",
    capabilities: [
      "Hybrid BM25 + Dense Retrieval",
      "Reciprocal Rank Fusion (RRF)",
      "Cross-Encoder Re-Ranking",
      "Deterministic Citation Grounding"
    ],
    architectureLayers: [
      { layer: "Ingestion Pipeline", technology: "Unstructured Document Parsing (PDFs, Tables, OCR, Audio)" },
      { layer: "Vector & Graph DB", technology: "PostgreSQL pgvector / Milvus + Neo4j Knowledge Graph" },
      { layer: "Reranker Model", technology: "Cohere Rerank-v3 / BGE-Reranker-Large" },
      { layer: "Audit Trail", technology: "Exact Page/Paragraph Attribution with Hallucination Scorer" }
    ],
    timeline: "3 to 4 Weeks to Staging Ingestion",
    roiProjection: "94% reduction in manual document research latency with verified zero-hallucination citations",
    targetServiceUrl: "/services/generative-ai",
    targetServiceName: "Enterprise RAG Solutions"
  },
  {
    id: "automate-workflow",
    label: "Automate a Workflow",
    tag: "Operations AI",
    icon: "Zap",
    defaultChallenge: "Manual document routing, 3-way invoice matching, and approval delays bottleneck operations.",
    recommendedApproach: "Intelligent Cognitive Automation & Document Pipeline",
    capabilities: [
      "Vision-Language Tabular Extraction",
      "ERP / CRM API Synchronization",
      "Discrepancy Flagging & Triage",
      "Automated Action Commitments"
    ],
    architectureLayers: [
      { layer: "Ingestion Hook", technology: "Event-Driven Webhook / SFTP / Email Listener" },
      { layer: "Vision Parser", technology: "Multimodal Table Extraction & OCR Normalization" },
      { layer: "Business Logic", technology: "Deterministic Fiscal Policy Verification Engine" },
      { layer: "System Connector", technology: "SAP / Salesforce / Workday Integration API" }
    ],
    timeline: "3 to 5 Weeks",
    roiProjection: "90% faster processing cycle, cutting invoice and claims turnarounds from 3 days to seconds",
    targetServiceUrl: "/services/generative-ai",
    targetServiceName: "AI Workflow Automation"
  },
  {
    id: "modernize-app",
    label: "Modernize an Existing Application",
    tag: "Modernization",
    icon: "RefreshCw",
    defaultChallenge: "Monolithic legacy codebases lack documentation, causing architectural stagnation and costly technical debt.",
    recommendedApproach: "Sidecar Cognitive Microservices + AI-Assisted Code Modernization",
    capabilities: [
      "Automated Legacy Code Analysis",
      "Semantic Cache Interception",
      "Test Suite Synthesis",
      "Non-Invasive API Modernization"
    ],
    architectureLayers: [
      { layer: "Cognitive Layer", technology: "Asynchronous Semantic Intelligence Microservice" },
      { layer: "Legacy Bridge", technology: "gRPC & REST Adapters with Schema Validation" },
      { layer: "Intelligent Cache", technology: "Redis Semantic Cache for 90% Sub-Second Hit Rates" },
      { layer: "Monitoring", technology: "Langfuse / OpenTelemetry End-to-End LLM Tracing" }
    ],
    timeline: "6 to 8 Weeks",
    roiProjection: "Up to 60% reduction in cloud LLM inference expenditure via semantic caching",
    targetServiceUrl: "/services",
    targetServiceName: "Technical AI Consulting & Modernization"
  },
  {
    id: "explore-use-cases",
    label: "Explore AI Use Cases",
    tag: "Case Studies",
    icon: "Layers",
    defaultChallenge: "Understanding how peer enterprise leaders deployed AI with measured, proven business returns.",
    recommendedApproach: "Sector-Specific Production Blueprints & Verified Case Studies",
    capabilities: [
      "Financial Services Compliance RAG",
      "Logistics Freight Reconciliation Swarm",
      "Healthcare HIPAA Triage Assistant",
      "Manufacturing Edge Vision Defect Inspection"
    ],
    architectureLayers: [
      { layer: "Banking & Finance", technology: "Private VPC RAG across 100k+ Filings — Sub-Second Retrieval" },
      { layer: "Healthcare & Life Sci", technology: "HIPAA Clinical Intake & Diagnostic Summarization Bots" },
      { layer: "Logistics & Supply", technology: "Autonomous Freight Invoice 3-Way Reconciliation Agents" },
      { layer: "Manufacturing", technology: "Edge Computer Vision Defect Detection (< 0.1% Escape Rate)" }
    ],
    timeline: "Instant Blueprint Review",
    roiProjection: "Proven operational payback within 1.5 to 3.5 months across enterprise deployments",
    targetServiceUrl: "/portfolio",
    targetServiceName: "Enterprise AI Portfolio & Case Studies"
  },
  {
    id: "talk-expert",
    label: "Talk to an AI Expert",
    tag: "Advisory",
    icon: "UserCheck",
    defaultChallenge: "Need an immediate confidential whiteboarding session on model selection, data privacy, and architecture.",
    recommendedApproach: "45-Minute Technical Advisory with Lead Indusnet AI Architect",
    capabilities: [
      "Architecture Whiteboarding",
      "Hardware Sizing & VRAM Modeling",
      "Zero-Data-Retention Security Audit",
      "Milestone Delivery Roadmapping"
    ],
    architectureLayers: [
      { layer: "Discussion Scope", technology: "Your Target Workload, Compliance Boundaries & Data Ingestion" },
      { layer: "Review Topics", technology: "Model Selection (Frontier vs Private SLM) & Hardware Sizing" },
      { layer: "Security Audit", technology: "VPC Isolation, Zero Data Retention Agreements, RBAC" },
      { layer: "Output", technology: "Formal Architectural Recommendation & Milestone Budget" }
    ],
    timeline: "Bookable within 24 to 48 Hours",
    roiProjection: "Accelerates enterprise decision timelines by 4–6 months",
    targetServiceUrl: "/contact",
    targetServiceName: "Book Architectural Consultation"
  }
];

export const INDUSTRIES: IndustryOption[] = [
  { id: "finance", name: "Banking & Financial Services", sampleChallenge: "Private regulatory compliance, loan underwriting, and audit speed." },
  { id: "healthcare", name: "Healthcare & Life Sciences", sampleChallenge: "HIPAA-compliant clinical note summarization and triage workflows." },
  { id: "logistics", name: "Supply Chain & Logistics", sampleChallenge: "Multi-vendor freight reconciliation and invoice 3-way matching." },
  { id: "retail", name: "Retail & E-commerce", sampleChallenge: "Autonomous support ticket resolution and personal shopping agents." },
  { id: "manufacturing", name: "Industrial & Manufacturing", sampleChallenge: "Computer vision defect inspection and predictive maintenance." },
  { id: "software", name: "Enterprise Software & Tech", sampleChallenge: "Legacy codebase modernization and internal developer copilots." }
];

export const SCALES: ScaleOption[] = [
  { id: "enterprise", name: "Global Enterprise / Multitenant", complianceFocus: "SOC-2, HIPAA, Okta SSO, VPC Isolation" },
  { id: "midmarket", name: "Mid-Market / High Growth", complianceFocus: "Rapid Time-to-Value, AWS/Azure Bedrock Managed Services" },
  { id: "airgapped", name: "Strictly Air-Gapped / Sovereign", complianceFocus: "100% On-Premise Open-Weights Models, Zero Cloud Egress" }
];

export function generateCustomPath(
  starterId: string,
  industryId?: string,
  scaleId?: string,
  customQuery?: string
): {
  challenge: string;
  recommendedApproach: string;
  capabilities: string[];
  targetArchitecture: { layer: string; technology: string }[];
  timeline: string;
  roiProjection: string;
  nextStepUrl: string;
  nextStepLabel: string;
} {
  const starter = CONCIERGE_STARTERS.find((s) => s.id === starterId) || CONCIERGE_STARTERS[0];
  const industry = INDUSTRIES.find((i) => i.id === industryId);
  const scale = SCALES.find((sc) => sc.id === scaleId);

  const challengeText = customQuery?.trim()
    ? customQuery.trim()
    : industry
    ? `${starter.defaultChallenge} Specialized for ${industry.name}: ${industry.sampleChallenge}`
    : starter.defaultChallenge;

  const adjustedCapabilities = [...starter.capabilities];
  if (scale?.id === "airgapped") {
    adjustedCapabilities[adjustedCapabilities.length - 1] = "Air-Gapped On-Premises Host Deployment";
  } else if (industry?.id === "healthcare") {
    adjustedCapabilities[0] = "HIPAA-Compliant Diagnostic Data Isolation";
  } else if (industry?.id === "finance") {
    adjustedCapabilities[0] = "SOC-2 Aligned Cryptographic Audit Trails";
  }

  const architecture = [...starter.architectureLayers];
  if (scale?.id === "airgapped") {
    architecture[architecture.length - 1] = {
      layer: "Deployment Target",
      technology: "Air-Gapped Bare-Metal Kubernetes with NVIDIA L4/A100 Clusters"
    };
  }

  return {
    challenge: challengeText,
    recommendedApproach: starter.recommendedApproach,
    capabilities: adjustedCapabilities,
    targetArchitecture: architecture,
    timeline: starter.timeline,
    roiProjection: starter.roiProjection,
    nextStepUrl: `/contact?service=${encodeURIComponent(starter.label)}`,
    nextStepLabel: "Talk to an AI Expert"
  };
}
