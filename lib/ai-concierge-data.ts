export interface AiConciergeResponse {
  id: string;
  category: "Strategy" | "RAG" | "Agents" | "Applications" | "Modernization" | "Use Cases" | "Consultation";
  title: string;
  diagnostic: string;
  architecture: {
    layer: string;
    tech: string;
  }[];
  pathway: string[];
  timeline: string;
  roiProjection: string;
  recommendedServiceUrl: string;
  recommendedServiceName: string;
  nextSteps: string;
}

export const CONCIERGE_STARTERS = [
  {
    id: "opportunities",
    label: "Identify AI opportunities in my business",
    icon: "Compass",
    tag: "Strategy & Discovery",
    prompt: "I want to identify the highest-ROI AI opportunities across our business operations."
  },
  {
    id: "build-app",
    label: "We want to build an enterprise AI application",
    icon: "Cpu",
    tag: "Full-Stack AI",
    prompt: "We want to engineer a production-ready Generative AI application with private data."
  },
  {
    id: "rag-solution",
    label: "We need an enterprise RAG solution",
    icon: "Search",
    tag: "Knowledge Retrieval",
    prompt: "We need a secure enterprise RAG system to connect LLMs to our proprietary document archives."
  },
  {
    id: "deploy-agents",
    label: "We want to deploy autonomous AI agents",
    icon: "Bot",
    tag: "Agentic Workflows",
    prompt: "We want to deploy autonomous AI agents to execute multi-step workflows and tool calls."
  },
  {
    id: "modernize-app",
    label: "Modernize legacy systems with AI",
    icon: "RefreshCw",
    tag: "AI Modernization",
    prompt: "We need to modernize an existing enterprise software stack with embedded cognitive capabilities."
  },
  {
    id: "use-cases",
    label: "Show me relevant AI use cases",
    icon: "Layers",
    tag: "Vertical Solutions",
    prompt: "Show me verified enterprise AI use cases and production benchmarks for my industry."
  },
  {
    id: "talk-expert",
    label: "I want to talk to an AI architect",
    icon: "UserCheck",
    tag: "Human Advisory",
    prompt: "I want to schedule a confidential technical consultation with an Indusnet AI solutions architect."
  }
];

export const CONCIERGE_KNOWLEDGE_BASE: Record<string, AiConciergeResponse> = {
  opportunities: {
    id: "opportunities",
    category: "Strategy",
    title: "AI Opportunity Mapping & Feasibility Blueprint",
    diagnostic: "Enterprises achieve maximum AI velocity when prioritizing workflows with high unstructured document volume, repetitive cognitive friction, and strict compliance boundaries.",
    architecture: [
      { layer: "Audit Focus", tech: "Cognitive Task Friction Audit & Bottleneck Scoring" },
      { layer: "Feasibility Model", tech: "CPMAI (Cognitive Project Management for AI) Matrix" },
      { layer: "Governance Layer", tech: "Zero-Trust Enterprise Data & IP Protection Boundary" },
      { layer: "Output Deliverable", tech: "Prioritized 90-Day AI Roadmap with Hard Financial ROI" }
    ],
    pathway: [
      "Phase 1: 5-Day Technical Discovery & Data Readiness Audit",
      "Phase 2: Business Case & Hardware Sizing Model",
      "Phase 3: 2-Week Working POC Validation"
    ],
    timeline: "2 to 3 Weeks to Validated POC",
    roiProjection: "Typical 2.5x–4.8x efficiency multiplier in target pilot department",
    recommendedServiceUrl: "/assessment",
    recommendedServiceName: "AI Scoper & Assessment",
    nextSteps: "Complete our 2-minute AI Scoper or schedule an architectural session to evaluate your data readiness."
  },
  "build-app": {
    id: "build-app",
    category: "Applications",
    title: "Full-Stack Enterprise AI Application Architecture",
    diagnostic: "Building production-grade AI applications requires decoupling the UI from raw model APIs via deterministic guardrails, semantic caching, and asynchronous inference queues.",
    architecture: [
      { layer: "Frontend / Interface", tech: "Next.js 16 + React 19 Streaming Cockpit with Server Actions" },
      { layer: "Model Gateway", tech: "Frontier LLM Routing (Claude 3.5 Sonnet / GPT-4o / Private Llama-3)" },
      { layer: "Middleware Guardrails", tech: "NeMo Guardrails + Semantic Firewall + RBAC Token Validation" },
      { layer: "Inference Stack", tech: "vLLM on Private VPC (AWS Bedrock / Azure OpenAI / On-Prem)" }
    ],
    pathway: [
      "Sprint 1: Private VPC Sandbox Setup & Guardrail Configuration",
      "Sprint 2-3: Core Application Engineering & Custom Vector Indexing",
      "Sprint 4: Enterprise SSO Integration & Regression Evaluation"
    ],
    timeline: "4 to 6 Weeks to Production Deployment",
    roiProjection: "Sub-400ms end-to-end token latency with 99.8% compliance accuracy",
    recommendedServiceUrl: "/services/generative-ai",
    recommendedServiceName: "Generative AI Application Engineering",
    nextSteps: "Book an architecture review to define your target models, security isolation tier, and latency SLAs."
  },
  "rag-solution": {
    id: "rag-solution",
    category: "RAG",
    title: "Secure Hybrid Enterprise RAG & Knowledge Engine",
    diagnostic: "Standard naive vector search fails in enterprise contexts. We implement Hybrid Dense-Sparse Search with Reciprocal Rank Fusion (RRF), parent-document chunking, and verifiable source citations.",
    architecture: [
      { layer: "Ingestion Pipeline", tech: "Unstructured Document Parsing (PDFs, Tables, OCR, Audio)" },
      { layer: "Vector & Graph DB", tech: "PostgreSQL pgvector / Milvus + Neo4j Knowledge Graph" },
      { layer: "Reranker Model", tech: "Cohere Rerank-v3 / BGE-Reranker-Large" },
      { layer: "Audit Trail", tech: "Exact Page/Paragraph Attribution with Hallucination Scorer" }
    ],
    pathway: [
      "Stage 1: Document Corpus Ingestion & Chunking Strategy Optimization",
      "Stage 2: Hybrid Retrieval & Cross-Encoder Reranking Tuning",
      "Stage 3: Citation Grounding & Zero-Data-Retention Security Verification"
    ],
    timeline: "3 to 4 Weeks to Staging Ingestion",
    roiProjection: "94% reduction in manual document research latency with verified zero-hallucination citations",
    recommendedServiceUrl: "/services/generative-ai",
    recommendedServiceName: "Enterprise RAG Solutions",
    nextSteps: "Model your document volume on our ROI Calculator to estimate VRAM and monthly vector compute."
  },
  "deploy-agents": {
    id: "deploy-agents",
    category: "Agents",
    title: "Multi-Agent System & Autonomous Workflow Engine",
    diagnostic: "Agentic AI moves beyond conversational chatbots to autonomous goal execution. Our multi-agent swarms decompose objectives, invoke enterprise tools via OpenAPI, and employ self-correction loops.",
    architecture: [
      { layer: "Orchestrator Agent", tech: "Planner Agent using ReAct / Reflexion Loop with State Memory" },
      { layer: "Specialized Workers", tech: "Data Extractor Agent, SQL Generator Agent, Policy Auditor Agent" },
      { layer: "Tool Execution Layer", tech: "Secure OpenAPI Tool Callers with OAuth2 Sandbox Isolation" },
      { layer: "Human-in-the-Loop", tech: "Automated Escalation Gates for High-Value Transactions" }
    ],
    pathway: [
      "Phase 1: Deterministic Workflow Mapping & Tool Scope Definition",
      "Phase 2: Multi-Agent Choreography & Failure Recovery Loop Testing",
      "Phase 3: Sandbox Dry-Run with Mocked APIs & Safety Failsafes"
    ],
    timeline: "4 to 7 Weeks to Full Autonomy",
    roiProjection: "85% reduction in manual back-office cycle time with automated audit trails",
    recommendedServiceUrl: "/services/generative-ai",
    recommendedServiceName: "Autonomous AI Agents",
    nextSteps: "Speak with our agentic systems team to identify workflows suitable for autonomous execution."
  },
  "modernize-app": {
    id: "modernize-app",
    category: "Modernization",
    title: "Enterprise Application AI Modernization Roadmap",
    diagnostic: "Rather than rewriting legacy systems from scratch, we inject cognitive intelligence layers through event-driven microservices, semantic caching, and AI-accelerated automated test generation.",
    architecture: [
      { layer: "Cognitive Layer", tech: "Asynchronous Semantic Intelligence Microservice" },
      { layer: "Legacy Bridge", tech: "gRPC & REST Adapters with Schema Validation" },
      { layer: "Intelligent Cache", tech: "Redis Semantic Cache for 90% Sub-Second Hit Rates" },
      { layer: "Monitoring", tech: "Langfuse / OpenTelemetry End-to-End LLM Tracing" }
    ],
    pathway: [
      "Step 1: Legacy Codebase & Schema Static Analysis",
      "Step 2: Non-Invasive Sidecar AI Microservice Deployment",
      "Step 3: Phased User Migration with Fallback Routing"
    ],
    timeline: "6 to 8 Weeks",
    roiProjection: "Up to 60% reduction in cloud LLM inference expenditure via semantic caching",
    recommendedServiceUrl: "/services",
    recommendedServiceName: "Technical AI Consulting & Modernization",
    nextSteps: "Let our systems engineering team analyze your existing architecture and suggest integration points."
  },
  "use-cases": {
    id: "use-cases",
    category: "Use Cases",
    title: "Validated Industry Production Benchmarks",
    diagnostic: "Indusnet AI delivers validated production outcomes across Financial Services, Healthcare, Supply Chain, and Enterprise Software with measured cycle-time reductions.",
    architecture: [
      { layer: "Banking & Finance", tech: "Private VPC RAG across 100k+ Filings — Sub-Second Retrieval" },
      { layer: "Healthcare & Life Sci", tech: "HIPAA Clinical Intake & Diagnostic Summarization Bots" },
      { layer: "Logistics & Supply", tech: "Autonomous Freight Invoice 3-Way Reconciliation Agents" },
      { layer: "Manufacturing", tech: "Edge Computer Vision Defect Detection (< 0.1% Escape Rate)" }
    ],
    pathway: [
      "Benchmark Comparison: Review parallel case studies in your sector",
      "Scoping Workshop: Calculate workload volume and hardware needs",
      "Tailored Blueprint: Receive architecture diagram & implementation plan"
    ],
    timeline: "Instant Blueprint Review",
    roiProjection: "Proven operational payback within 1.5 to 3.5 months across enterprise deployments",
    recommendedServiceUrl: "/portfolio",
    recommendedServiceName: "Enterprise AI Portfolio & Case Studies",
    nextSteps: "Browse our case studies or run our interactive ROI & Sizing calculator for your specific team."
  },
  "talk-expert": {
    id: "talk-expert",
    category: "Consultation",
    title: "Confidential Technical Advisory with Lead AI Architect",
    diagnostic: "Direct 45-minute technical whiteboarding session with our senior AI engineering leadership. Zero sales pitches — pure architecture, data security, and viability analysis.",
    architecture: [
      { layer: "Discussion Scope", tech: "Your Target Workload, Compliance Boundaries & Data Ingestion" },
      { layer: "Review Topics", tech: "Model Selection (Frontier vs Private SLM) & Hardware Sizing" },
      { layer: "Security Audit", tech: "VPC Isolation, Zero Data Retention Agreements, RBAC" },
      { layer: "Output", tech: "Formal Architectural Recommendation & Milestone Budget" }
    ],
    pathway: [
      "Select your preferred date and slot on our executive calendar",
      "Share high-level architecture documents (optional / under NDA)",
      "Join interactive architectural deep-dive session"
    ],
    timeline: "Bookable within 24 to 48 Hours",
    roiProjection: "Accelerates enterprise decision timelines by 4–6 months",
    recommendedServiceUrl: "/contact",
    recommendedServiceName: "Book Architectural Consultation",
    nextSteps: "Schedule your dedicated session or leave your requirements for immediate architect review."
  }
};

export function matchConciergeIntent(query: string): AiConciergeResponse {
  const q = query.toLowerCase();

  if (q.includes("rag") || q.includes("knowledge") || q.includes("search") || q.includes("document") || q.includes("retrieval") || q.includes("pdf")) {
    return CONCIERGE_KNOWLEDGE_BASE["rag-solution"];
  }
  if (q.includes("agent") || q.includes("autonomous") || q.includes("workflow") || q.includes("tool") || q.includes("automate")) {
    return CONCIERGE_KNOWLEDGE_BASE["deploy-agents"];
  }
  if (q.includes("app") || q.includes("software") || q.includes("build") || q.includes("develop") || q.includes("engineer")) {
    return CONCIERGE_KNOWLEDGE_BASE["build-app"];
  }
  if (q.includes("modern") || q.includes("legacy") || q.includes("migrat") || q.includes("cache") || q.includes("cost")) {
    return CONCIERGE_KNOWLEDGE_BASE["modernize-app"];
  }
  if (q.includes("case") || q.includes("portfolio") || q.includes("industr") || q.includes("healthcare") || q.includes("finance") || q.includes("bank")) {
    return CONCIERGE_KNOWLEDGE_BASE["use-cases"];
  }
  if (q.includes("expert") || q.includes("talk") || q.includes("call") || q.includes("consult") || q.includes("contact") || q.includes("architect")) {
    return CONCIERGE_KNOWLEDGE_BASE["talk-expert"];
  }

  // Default to strategic opportunities
  return CONCIERGE_KNOWLEDGE_BASE["opportunities"];
}
