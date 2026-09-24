"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Bot, ArrowRight, Play, Pause, RotateCcw, 
  CheckCircle2, Terminal, ShieldAlert, Cpu, Database, 
  Wrench, CheckCheck, Sparkles, FileText, ChevronRight,
  Search, ShieldCheck, Activity, Users, Settings, Lock,
  Code2, HeartPulse, HelpCircle, Layers, GitBranch
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// 1. Agent Definition Interface
interface AgentProfile {
  id: string;
  name: string;
  role: string;
  category: string;
  icon: any;
  objective: string;
  toolsUsed: string[];
  knowledgeAccessed: string[];
  decisionsMade: string;
  actionsTaken: string;
  humanOversight: string;
  businessOutcome: string;
  steps: {
    stepNumber: number;
    stepTitle: string;
    stageName: string;
    actor: string;
    status: string;
    log: string;
    detail: string;
  }[];
}

// 2. The 5 Enterprise Agents Data with complete 9-Step Pipelines
const ENTERPRISE_AGENTS: AgentProfile[] = [
  {
    id: "procurement",
    name: "Procurement Reconciler Agent",
    role: "Autonomous AP & 3-Way Invoice Auditor",
    category: "Intelligent Operations",
    icon: FileText,
    objective: "Autonomously reconcile 3-way discrepancies between unstructured supplier invoices, ERP purchase orders, and receiving logs.",
    toolsUsed: ["Vision OCR API", "SAP RFC Connector", "Currency FX Calculator", "Vendor Notification Dispatcher"],
    knowledgeAccessed: ["Active Enterprise POs (pgvector)", "Master Service Agreements (MSAs)", "Approved Vendor Rate Cards"],
    decisionsMade: "Verified 14 line items; isolated $320 uncontracted freight surcharge; held disputed line while auto-authorizing $42,180.00 clean balance.",
    actionsTaken: "Committed clean balance to SAP ERP AP ledger, drafted vendor discrepancy clarification notice, generated SOX audit trail.",
    humanOversight: "Discrepancies > $1,000 or unapproved tax modifications escalate to Procurement Director with one-click approval.",
    businessOutcome: "88% drop in invoice cycle time (from 3 days to 4.2s); $1.2M in annual uncontracted vendor surcharges captured.",
    steps: [
      {
        stepNumber: 1,
        stageName: "USER REQUEST",
        stepTitle: "Inbound Invoice Webhook Received",
        actor: "Enterprise ERP Listener / SFTP Daemon",
        status: "Payload Ingested",
        log: "POST /api/webhooks/incoming_invoice\nPayload: { vendor_id: 'VEND-904', amount: '$42,500.00', file: 'INV-2026-88.pdf', pages: 4 }",
        detail: "An unstructured multi-page invoice arrives from a tier-1 supplier via secure enterprise webhook."
      },
      {
        stepNumber: 2,
        stageName: "INTENT RECOGNITION",
        stepTitle: "Semantic Parsing & Extraction",
        actor: "Indusnet Intent Engine (Multimodal Vision)",
        status: "Entity Schema Validated",
        log: "Intent: RECONCILE_ACCOUNTS_PAYABLE\nExtracted: PO_REF='PO-84102', Subtotal=$39,200.00, Tax=$2,980.00, Freight=$320.00, Total=$42,500.00",
        detail: "Vision models extract nested tabular lines, vendor tax IDs, and payment terms into strongly typed JSON schemas."
      },
      {
        stepNumber: 3,
        stageName: "AI AGENT",
        stepTitle: "Procurement Reconciler Initialized",
        actor: "Autonomous ReAct Planning Loop",
        status: "Agent Plan Generated",
        log: "Initializing Agent: ProcurementReconciler_v3\nGoal: Verify line items vs SAP PO-84102\nConstraint: Max allowable discrepancy without escalation = $1,000.00",
        detail: "The autonomous agent instantiates its execution scratchpad, loads safety policies, and structures sub-goals."
      },
      {
        stepNumber: 4,
        stageName: "KNOWLEDGE RETRIEVAL",
        stepTitle: "Query Private Contract Knowledge",
        actor: "Enterprise Hybrid RAG (pgvector + MSA Store)",
        status: "Context Grounded",
        log: "SELECT * FROM erp_contracts WHERE vendor_id = 'VEND-904'\nVector Match: MSA Clause 4.2: 'Freight is FOB Destination; supplier absorbs shipping.' (Cosine Sim: 0.94)",
        detail: "Retrieves legal contracts and historical discount agreements with zero-trust RBAC access controls."
      },
      {
        stepNumber: 5,
        stageName: "TOOL USE & APIS",
        stepTitle: "Execute Line-Item Reconciliation Tool",
        actor: "Sandboxed Tool Executor (OpenAPI)",
        status: "Tools Executed",
        log: "Calling tool: reconcile_line_items(po_lines, invoice_lines)\nResult: 13 lines matched exactly. Line 14 ($320 freight) violates MSA Clause 4.2.",
        detail: "The agent invokes sandboxed mathematical audit tools to detect line-item variances, taxes, and price deviations."
      },
      {
        stepNumber: 6,
        stageName: "ENTERPRISE SYSTEMS",
        stepTitle: "Query SAP ERP Live State",
        actor: "SAP S/4HANA Connector (OAuth2)",
        status: "System Synced",
        log: "GET /sap/opu/odata/sap/API_PURCHASEORDER_PROCESS_SRV/A_PurchaseOrder('PO-84102')\nResponse: 200 OK. Receiving status: Goods receipt confirmed at Chicago Warehouse.",
        detail: "Bi-directional query against SAP confirms physical goods receipt before approving payment authorization."
      },
      {
        stepNumber: 7,
        stageName: "ACTION EXECUTION",
        stepTitle: "Partial Ledger Commit & Notice Generation",
        actor: "ERP Transaction Dispatcher",
        status: "Actions Drafted",
        log: "Staging SAP Commit: Post AP invoice for undisputed amount $42,180.00.\nStaging Vendor Notice: Draft itemized deduction notice for $320.00 uncontracted freight.",
        detail: "Executes business logic: pays uncontested amounts to prevent vendor holds while cordoning the dispute."
      },
      {
        stepNumber: 8,
        stageName: "VERIFICATION & GOVERNANCE",
        stepTitle: "Deterministic Policy & Human Gate Check",
        actor: "NeMo Safety Critic & SOX 404 Guard",
        status: "Policy Passed (Auto-Approved)",
        log: "Evaluating: SOX Rule #404-B\nDiscrepancy: $320.00 (Below $1,000 threshold for human Director escalation).\nCryptographic signature logged to audit table.",
        detail: "A deterministic evaluator agent checks fiscal compliance; transactions exceeding policy limits trigger human review."
      },
      {
        stepNumber: 9,
        stageName: "BUSINESS OUTCOME",
        stepTitle: "Transaction Committed & Metrics Recorded",
        actor: "Enterprise Audit Daemon",
        status: "Completed in 4.2s",
        log: "COMMIT CONFIRMED: SAP Doc #51000921\nCycle Time: 4.2s (vs manual 3 days)\nValue Generated: $320 variance prevented, zero early-payment discount missed.",
        detail: "Transaction is finalized in enterprise ERP, vendor notified, and operational metrics updated in real time."
      }
    ]
  },
  {
    id: "compliance",
    name: "Regulatory Compliance Auditor Agent",
    role: "Real-Time FinTech & SEC Policy Auditor",
    category: "Decision Intelligence",
    icon: ShieldCheck,
    objective: "Continuously audit financial transactions, customer disclosures, and communications against SEC/FINRA and internal policy rules.",
    toolsUsed: ["SEC EDGAR Parser", "Embedding Similarity Evaluator", "Private Rulebook Engine", "Ledger Mutation Auditor"],
    knowledgeAccessed: ["FINRA Regulatory Notices", "SEC Marketing Rule 206(4)-1", "Internal Risk & Disclosure Manual", "Historical Audit Determinations"],
    decisionsMade: "Detected ungrounded performance claim in marketing collateral draft; synthesized compliant disclosure footnotes.",
    actionsTaken: "Redacted non-compliant claims, attached mandatory risk disclosures, wrote cryptographic hash to compliance ledger.",
    humanOversight: "Material policy ambiguities or unresolvable claims route immediately to Chief Compliance Officer with side-by-side diff.",
    businessOutcome: "94% reduction in compliance review turnaround (from 48 hours to 8 seconds); zero regulatory inspection citations.",
    steps: [
      {
        stepNumber: 1,
        stageName: "USER REQUEST",
        stepTitle: "Marketing Collateral Draft Ingestion",
        actor: "Enterprise CMS / Workflow API",
        status: "Document Ingested",
        log: "POST /api/compliance/audit_submission\nPayload: { asset_id: 'Q3-PROMO-INSTITUTIONAL', type: 'PDF_PITCHBOOK', target: 'Accredited Investors' }",
        detail: "Institutional sales deck submitted for pre-publication regulatory compliance review."
      },
      {
        stepNumber: 2,
        stageName: "INTENT RECOGNITION",
        stepTitle: "Jurisdictional Rule Mapping",
        actor: "Indusnet Governance Parser",
        status: "Context Scoped",
        log: "Audience: US Accredited Investors\nApplicable Mandates: SEC Marketing Rule 206(4)-1, FINRA Rule 2210\nTokens to Audit: 4,820",
        detail: "Extracts claims, guarantees, returns representations, and historical performance charts from the document."
      },
      {
        stepNumber: 3,
        stageName: "AI AGENT",
        stepTitle: "Compliance Auditor Agent Initialized",
        actor: "Autonomous Verification Orchestrator",
        status: "Audit Graph Built",
        log: "Agent: RegAuditor_v4\nDecomposing document into 18 verifiable claims\nInitiating cross-reference verification against SEC rule matrix",
        detail: "Builds a dependency graph of all factual and regulatory claims requiring substantiation."
      },
      {
        stepNumber: 4,
        stageName: "KNOWLEDGE RETRIEVAL",
        stepTitle: "Query Proprietary Compliance Corpus",
        actor: "Regulatory RAG Engine",
        status: "Legal Corpus Indexed",
        log: "Retrieving: SEC Rule 206(4)-1(d) 'Substantiation of Material Claims of Fact'\nCross-referencing legal guidance memo: 'Hypothetical Performance Disclosures (2025 Updates)'",
        detail: "Fetches exact regulatory guidelines and precedent enforcement actions from the firm's legal knowledge base."
      },
      {
        stepNumber: 5,
        stageName: "TOOL USE & APIS",
        stepTitle: "Run Claim Verification Tools",
        actor: "Deterministic NLP Verification Sandbox",
        status: "Discrepancy Detected",
        log: "Calling tool: verify_performance_claim(slide_4)\nFLAG: 'Guaranteed 14% IRR net of fees' lacks mandatory gross-to-net fee disclosure schedule.",
        detail: "Analyzes semantic framing to catch promissory language, omitted disclosures, and non-compliant benchmarks."
      },
      {
        stepNumber: 6,
        stageName: "ENTERPRISE SYSTEMS",
        stepTitle: "Query Historical Performance DB",
        actor: "Portfolio Accounting System Connector",
        status: "Actuals Validated",
        log: "Query: SELECT actual_net_irr, fee_drag FROM fund_performance WHERE vintage = 2024\nResult: Actual net IRR was 12.8%. Claim in pitchbook is factually inaccurate by 120 bps.",
        detail: "Validates statements of historical performance against the firm's verified internal performance books."
      },
      {
        stepNumber: 7,
        stageName: "ACTION EXECUTION",
        stepTitle: "Auto-Redaction & Disclosure Synthesis",
        actor: "Document Correction Agent",
        status: "Corrections Drafted",
        log: "Action 1: Replace 'Guaranteed 14%' with verified actual historical metric '12.8% net IRR'.\nAction 2: Insert mandatory SEC Rule 206(4)-1 footnote.",
        detail: "Automatically drafts necessary edits and attaches legally compliant disclosure blocks."
      },
      {
        stepNumber: 8,
        stageName: "VERIFICATION & GOVERNANCE",
        stepTitle: "Dual-Agent Adversarial Cross-Check",
        actor: "Independent Critic Model",
        status: "Critic Validated",
        log: "Critic Verification: Modified pitchbook complies with FINRA 2210(d)(1).\nRouting: Low risk; eligible for automated sign-off with audit log archive.",
        detail: "A second, independent safety agent validates that proposed corrections introduce no new compliance vulnerabilities."
      },
      {
        stepNumber: 9,
        stageName: "BUSINESS OUTCOME",
        stepTitle: "Approved Document & Immutable Audit Record",
        actor: "Compliance Ledger Commit",
        status: "Sign-off Granted (8.1s)",
        log: "AUDIT SIGN-OFF COMPLETED: Hash #7a9f82d1c0\nTurnaround: 8.1 seconds (previously 48 hours)\nAudit Trail: Fully verified and archived for regulatory exam readiness.",
        detail: "Document certified for client distribution with cryptographic proof of compliance logged to the enterprise repository."
      }
    ]
  },
  {
    id: "clinical",
    name: "Clinical Intake Assistant",
    role: "HIPAA-Compliant Patient Intake & EHR Triage",
    category: "Customer Experience",
    icon: HeartPulse,
    objective: "Triage patient symptoms, extract clinical entities, verify insurance eligibility, and prep structured EHR notes prior to physician review.",
    toolsUsed: ["FHIR / HL7 Connector", "Clinical NER Engine", "ICD-10 Coding API", "Payer Eligibility Gateway"],
    knowledgeAccessed: ["Hospital Clinical Protocols", "Drug-Allergy Interaction Database", "Patient Longitudinal EHR (Isolated Enclave)"],
    decisionsMade: "Detected acute symptom complex; flagged contraindication between patient allergy and standard medication; prepared draft SOAP note.",
    actionsTaken: "Transcribed clinical summary to EHR, initiated insurance pre-authorization check, scheduled physician consultation.",
    humanOversight: "100% of generated SOAP notes and triage summaries require electronic physician sign-off before entering legal medical records.",
    businessOutcome: "Saves 14 minutes per clinical intake consultation; zero patient PII transmitted outside the private healthcare VPC.",
    steps: [
      {
        stepNumber: 1,
        stageName: "USER REQUEST",
        stepTitle: "Patient Portal Symptom & History Ingestion",
        actor: "Encrypted Patient Intake Portal",
        status: "Encrypted Session Live",
        log: "POST /api/clinical/intake_session\nPatient: ID-88219 (De-identified in transit)\nChief Complaint: Persistent chest tightness and dyspnea on exertion for 3 days.",
        detail: "Patient completes structured pre-consultation intake via secure, accessible mobile interface."
      },
      {
        stepNumber: 2,
        stageName: "INTENT RECOGNITION",
        stepTitle: "Clinical Entity Extraction & Triage Scoring",
        actor: "Medical NLP Transformer",
        status: "Entities Mapped",
        log: "Extracted Clinical Entities: [Dyspnea, Onset: 72h, Exertional], [Chest Tightness, Non-radiating]\nCalculated Emergency Severity Index: Level 3 (Urgent)",
        detail: "Standardizes clinical vocabulary into SNOMED CT and ICD-10 terminology while assessing urgency score."
      },
      {
        stepNumber: 3,
        stageName: "AI AGENT",
        stepTitle: "Clinical Intake Agent Initialized",
        actor: "Medical Reasoning Assistant",
        status: "Diagnostic Protocol Active",
        log: "Agent: ClinicalIntake_v2\nProtocol: Adult Cardiopulmonary Outpatient Evaluation\nZero-Data-Retention Enclave: Enabled",
        detail: "Activates clinical workflow protocols tailored to the patient's reported symptoms."
      },
      {
        stepNumber: 4,
        stageName: "KNOWLEDGE RETRIEVAL",
        stepTitle: "Query Private Clinical History & Protocols",
        actor: "HIPAA-Isolated Hybrid RAG",
        status: "Historical Records Pulled",
        log: "Retrieving EHR Record #88219:\nHistory: Hypertension (5 yrs), Penicillin allergy (Anaphylaxis risk).\nActive Medication: Lisinopril 20mg daily.",
        detail: "Accesses patient's prior medical records within an isolated VPC with zero data logging."
      },
      {
        stepNumber: 5,
        stageName: "TOOL USE & APIS",
        stepTitle: "Check Drug Interactions & Payer Eligibility",
        actor: "FHIR API & Eligibility Gateway",
        status: "Checks Complete",
        log: "Calling tool: check_formulary_eligibility(Patient_88219, Payer_BlueCross)\nEligible: Yes, In-Network copay: $35.00.\nFormulary alert: Prior authorization required for stress echocardiogram.",
        detail: "Interrogates payer APIs to verify real-time coverage and pre-authorization requirements."
      },
      {
        stepNumber: 6,
        stageName: "ENTERPRISE SYSTEMS",
        stepTitle: "Connect to Epic / Cerner EHR via FHIR",
        actor: "HL7 FHIR Enterprise Connector",
        status: "EHR Connected",
        log: "GET /fhir/r4/Patient/88219/Encounter\nWriting draft encounter context: Encounter_2026_09_23_Dr_Sharma",
        detail: "Establishes secure, audited bidirectional link with hospital EHR systems."
      },
      {
        stepNumber: 7,
        stageName: "ACTION EXECUTION",
        stepTitle: "Synthesize Structured SOAP Note Draft",
        actor: "Clinical Documentation Generator",
        status: "Draft SOAP Generated",
        log: "SOAP DRAFT:\nS: 54yo M with 3-day history of exertional dyspnea.\nO: BP 138/88, HR 76, O2 Sat 98%.\nA: Atypical chest pain, rule out ischemia.\nP: 12-lead ECG, Troponin I, Physician Consultation.",
        detail: "Generates high-precision physician briefing notes formatted to hospital clinical standards."
      },
      {
        stepNumber: 8,
        stageName: "VERIFICATION & GOVERNANCE",
        stepTitle: "Physician-in-the-Loop Electronic Gate",
        actor: "Attending Physician Approval Interface",
        status: "Awaiting Physician Signature",
        log: "MANDATORY GATE: SOAP draft locked until Dr. Sharma reviews and electronically signs.\nAudit: Zero autonomous clinical decisions permitted without licensed clinician sign-off.",
        detail: "Absolute safety boundary: no clinical diagnoses or treatment orders execute without human physician review."
      },
      {
        stepNumber: 9,
        stageName: "BUSINESS OUTCOME",
        stepTitle: "Physician Consultation Prepared in Seconds",
        actor: "EHR Production Commit",
        status: "Ready for Consultation",
        log: "SAVINGS CONFIRMED:\nIntake prep time reduced from 20 minutes to 30 seconds.\nPhysician enters exam room fully briefed with diagnostics ordered.",
        detail: "Physician consultation productivity doubles while patient wait times drop by 65%."
      }
    ]
  },
  {
    id: "modernization",
    name: "Software Modernization Agent",
    role: "Autonomous Legacy Codebase & API Migration",
    category: "Software Engineering",
    icon: Code2,
    objective: "Deconstruct monolithic legacy codebases (Java/COBOL/.NET) into clean, tested modern TypeScript/Python microservices.",
    toolsUsed: ["Tree-Sitter AST Parser", "Git Mutation Executor", "Jest / PyTest Harness", "OpenAPI Spec Generator"],
    knowledgeAccessed: ["Legacy Schema DDL", "Enterprise Cloud Architecture Guidelines", "Corporate Security & Auth Standards"],
    decisionsMade: "Identified tightly coupled SQL stored procedures; refactored into stateless REST services with Prisma ORM models.",
    actionsTaken: "Generated clean TypeScript service layer, generated comprehensive branch test coverage, created PR with containerized Dockerfile.",
    humanOversight: "Senior Architecture Review Board inspects generated Pull Requests with automated static analysis scores before staging merge.",
    businessOutcome: "55% acceleration in legacy migration velocity; zero regression errors during blue-green deployment.",
    steps: [
      {
        stepNumber: 1,
        stageName: "USER REQUEST",
        stepTitle: "Legacy Repository Ingestion Triggered",
        actor: "GitHub Enterprise Webhook",
        status: "Source Repo Cloned",
        log: "POST /api/agents/modernize\nTarget: repo:internal/core-billing-monolith (Legacy Java 8 / Spring 3.2)\nGoal: Migrate payment-processing-module to TypeScript Next.js/FastAPI",
        detail: "An enterprise engineering team targets a 12-year-old monolithic Java module for cloud modernization."
      },
      {
        stepNumber: 2,
        stageName: "INTENT RECOGNITION",
        stepTitle: "AST Semantic Parsing & Dependency Mapping",
        actor: "Tree-Sitter Abstract Syntax Tree Analyzer",
        status: "Dependencies Mapped",
        log: "Parsed: 42 Java classes, 14,200 lines of code.\nIdentified: 8 circular class dependencies, 22 direct JDBC SQL queries, 3 deprecated crypto ciphers.",
        detail: "Extracts call graphs, database schemas, and business rules without executing untrusted legacy code."
      },
      {
        stepNumber: 3,
        stageName: "AI AGENT",
        stepTitle: "Software Modernization Agent Initialized",
        actor: "Autonomous Coding Orchestrator",
        status: "Architecture Strategy Set",
        log: "Agent: CodeModernizer_v3\nTarget Architecture: Stateless TypeScript microservice with OpenAPI 3.1 & Prisma ORM\nStrategy: Generate unit tests before modifying syntax (Characterization Testing)",
        detail: "Designs a phased refactoring strategy that locks in existing behavior before rewriting code."
      },
      {
        stepNumber: 4,
        stageName: "KNOWLEDGE RETRIEVAL",
        stepTitle: "Retrieve Cloud Architecture Standards",
        actor: "Corporate Architecture Vector Store",
        status: "Standards Loaded",
        log: "Matching Rulebook: 'Enterprise Cloud-Native Standards v4.1'\nRequirements: OpenTelemetry tracing, JWT RBAC authentication, PostgreSQL connection pooling.",
        detail: "Grounds code generation in the company's approved architectural patterns and security standards."
      },
      {
        stepNumber: 5,
        stageName: "TOOL USE & APIS",
        stepTitle: "Generate Characterization Tests",
        actor: "Isolated Test Execution Sandbox",
        status: "Test Harness Generated",
        log: "Calling tool: generate_test_harness(LegacyBillingService)\nSynthesized 84 unit tests covering edge cases, rounding errors, and currency conversion paths.\nTest pass rate on legacy binary: 100%.",
        detail: "Generates comprehensive regression test suites that capture the exact legacy behavior."
      },
      {
        stepNumber: 6,
        stageName: "ENTERPRISE SYSTEMS",
        stepTitle: "Synthesize Modern TypeScript Code",
        actor: "Indusnet Code Synthesis Engine",
        status: "Clean Code Written",
        log: "Compiling: billing-service.ts\nTranspiled legacy JDBC calls to typed Prisma queries.\nReplaced deprecated MD5 hashing with SHA-256 HSM calls.",
        detail: "Re-engineers the service using idiomatic, clean modern architecture with zero technical debt."
      },
      {
        stepNumber: 7,
        stageName: "ACTION EXECUTION",
        stepTitle: "Run Automated Test Suite & Linter",
        actor: "Containerized Test Runner",
        status: "Tests Passing (100%)",
        log: "Running: npm test -- --coverage\nPASS __tests__/billing-service.test.ts\nStatements: 98.4% | Branches: 96.2% | Functions: 100%\nZero linting or security warnings.",
        detail: "Executes test suites inside isolated Docker containers to guarantee behavioral parity."
      },
      {
        stepNumber: 8,
        stageName: "VERIFICATION & GOVERNANCE",
        stepTitle: "Architecture Review Pull Request",
        actor: "GitHub PR Bot with SonarQube & Snyk Scan",
        status: "PR #418 Created",
        log: "Security Scan: PASSED (Zero High/Critical CVEs)\nArchitecture Checklist: All 6 requirements satisfied.\nReviewers assigned: Principal Architect @enterprise.com",
        detail: "Packages all changes into an audited Git pull request with comprehensive architecture change notes."
      },
      {
        stepNumber: 9,
        stageName: "BUSINESS OUTCOME",
        stepTitle: "55% Velocity Acceleration Recorded",
        actor: "CI/CD Metrics Collector",
        status: "Module Ready for Deployment",
        log: "DELIVERY METRIC: 3-month manual re-write accomplished in 48 hours.\nCompute cost reduced by 40% via stateless containerization.",
        detail: "Legacy business logic is securely preserved and modernized at a fraction of manual engineering cost."
      }
    ]
  },
  {
    id: "support",
    name: "Customer Support Agent",
    role: "Autonomous Tier-1 & Tier-2 Customer Resolution",
    category: "Customer Experience",
    icon: Users,
    objective: "Autonomously diagnose, resolve, and execute end-to-end customer operations requests (refunds, plan upgrades, technical diagnostics).",
    toolsUsed: ["Salesforce / Zendesk API", "Stripe Billing Gateway", "Customer Identity Verifier", "Diagnostics Dispatcher"],
    knowledgeAccessed: ["Enterprise Knowledge Base", "Real-Time System Outage Dashboards", "Customer SLA & Contract Tier"],
    decisionsMade: "Verified customer identity; diagnosed API throttling due to burst traffic; authorized 20% SLA downtime credit.",
    actionsTaken: "Executed Stripe credit webhook, updated API rate limit bucket in Redis, sent diagnostic summary to customer.",
    humanOversight: "Refunds over $500 or detected high customer dissatisfaction escalate immediately to Senior Account Manager.",
    businessOutcome: "78% autonomous resolution rate with sub-15 second response time and 4.9/5 CSAT rating.",
    steps: [
      {
        stepNumber: 1,
        stageName: "USER REQUEST",
        stepTitle: "Customer Inbound Ticket Received",
        actor: "Omnichannel Support Ingest (Zendesk / Intercom)",
        status: "Ticket Created",
        log: "POST /api/support/ticket\nCustomer: Enterprise Tier (Acme Corp, MRR: $18,500)\nMessage: 'Our production webhooks are failing with 429 Too Many Requests since 02:00 UTC.'",
        detail: "An enterprise client reports an urgent API rate-limiting issue via their dedicated support channel."
      },
      {
        stepNumber: 2,
        stageName: "INTENT RECOGNITION",
        stepTitle: "Intent & Urgency Classification",
        actor: "Indusnet Support Classifier",
        status: "High Urgency Class Assigned",
        log: "Intent: TECHNICAL_INCIDENT_RATE_LIMIT\nSeverity: HIGH (Production Impairment)\nCustomer SLA Tier: 99.99% Platinum (< 15 min response commitment)",
        detail: "Classifies the ticket, extracts error codes, and maps client SLA obligations."
      },
      {
        stepNumber: 3,
        stageName: "AI AGENT",
        stepTitle: "Customer Support Agent Initialized",
        actor: "Autonomous Technical Support Resolver",
        status: "Investigation Plan Formed",
        log: "Agent: SupportResolver_v2\nGoal: Diagnose 429 errors for Acme Corp\nPermissions: Read logs, inspect Redis rate limiter, issue credits <= $500",
        detail: "The agent checks authorization boundaries and initiates diagnostic steps."
      },
      {
        stepNumber: 4,
        stageName: "KNOWLEDGE RETRIEVAL",
        stepTitle: "Query Knowledge Base & Service Status",
        actor: "Support Hybrid RAG",
        status: "Runbooks Retrieved",
        log: "Retrieving: Runbook #402 'Handling Enterprise Rate Limit Spikes'\nChecking Status: All platform clusters green; issue is isolated to Acme Corp API key.",
        detail: "Fetches technical runbooks and rules governing burst allowance for platinum clients."
      },
      {
        stepNumber: 5,
        stageName: "TOOL USE & APIS",
        stepTitle: "Run Real-Time Telemetry Tool",
        actor: "Datadog / Prometheus API Tool",
        status: "Root Cause Identified",
        log: "Calling tool: query_metrics(acme_corp_key, last_6h)\nRoot Cause Found: Acme Corp deployed a new batch export script sending 2,400 req/sec (limit is 1,000 req/sec).",
        detail: "Queries production metric tools to isolate the exact cause of the customer's issue."
      },
      {
        stepNumber: 6,
        stageName: "ENTERPRISE SYSTEMS",
        stepTitle: "Modify Redis Rate Limit Bucket",
        actor: "Enterprise API Gateway Connector",
        status: "Burst Limit Applied",
        log: "Executing: redis.set('ratelimit:acme_corp', burst_limit=3000, ttl=86400)\nTemporary 24-hour burst capacity activated to restore client production traffic.",
        detail: "Safely adjusts operational configuration to immediately unblock customer operations."
      },
      {
        stepNumber: 7,
        stageName: "ACTION EXECUTION",
        stepTitle: "Synthesize Technical Root Cause Report",
        actor: "Customer Communication Agent",
        status: "Response Drafted",
        log: "Drafting customer reply:\n1. Root cause identified: Traffic spike from IP 198.51.100.4 at 02:14 UTC.\n2. Temporary burst cap raised to 3,000 req/sec for 24h.\n3. Link to batch webhook optimization documentation.",
        detail: "Crafts an empathetic, technically precise explanation with immediate remediation details."
      },
      {
        stepNumber: 8,
        stageName: "VERIFICATION & GOVERNANCE",
        stepTitle: "Sentiment & Policy Verification Check",
        actor: "Tone & SLA Guardrail Engine",
        status: "Guardrails Passed",
        log: "Evaluating: Tone & Brand Safety\nTone: Professional, technical, reassuring.\nEscalation Check: No financial commitments > $500 made. Auto-send approved.",
        detail: "Validates that the response meets executive support guidelines and accuracy thresholds."
      },
      {
        stepNumber: 9,
        stageName: "BUSINESS OUTCOME",
        stepTitle: "Issue Resolved in Under 12 Seconds",
        actor: "Support CRM Dispatcher",
        status: "Ticket Solved (11.8s)",
        log: "TICKET RESOLUTION DELIVERED:\nFirst Response Time: 11.8 seconds (vs SLA 15 minutes)\nCustomer feedback: 5/5 stars ('Incredible instant resolution').",
        detail: "Client production is restored in seconds without requiring tier-3 engineer wakeups."
      }
    ]
  }
];

// Semantic color mapping for the 9-stage pipeline per visual identity specification:
// User: white, Planner: blue, Knowledge: cyan, Agent: violet, Tools: blue, Systems: blue, Action: cyan, Verification: violet, Outcome: green
function getStageActiveClasses(stageName: string): string {
  if (stageName.includes("USER")) return "bg-slate-100 text-slate-950 border-white shadow-lg shadow-white/10";
  if (stageName.includes("INTENT")) return "bg-[#1677FF] text-white border-[#1677FF] shadow-lg shadow-[#1677FF]/30";
  if (stageName.includes("AGENT")) return "bg-[#7C5CFF] text-white border-[#7C5CFF] shadow-lg shadow-[#7C5CFF]/30";
  if (stageName.includes("KNOWLEDGE")) return "bg-[#00D4FF] text-slate-950 border-[#00D4FF] shadow-lg shadow-[#00D4FF]/30 font-bold";
  if (stageName.includes("TOOL")) return "bg-[#1677FF] text-white border-[#1677FF] shadow-lg shadow-[#1677FF]/30";
  if (stageName.includes("SYSTEM")) return "bg-[#1677FF] text-white border-[#1677FF] shadow-lg shadow-[#1677FF]/30";
  if (stageName.includes("ACTION")) return "bg-[#00D4FF] text-slate-950 border-[#00D4FF] shadow-lg shadow-[#00D4FF]/30 font-bold";
  if (stageName.includes("VERIFICATION")) return "bg-[#7C5CFF] text-white border-[#7C5CFF] shadow-lg shadow-[#7C5CFF]/30";
  if (stageName.includes("OUTCOME")) return "bg-[#10B981] text-white border-[#10B981] shadow-lg shadow-[#10B981]/30";
  return "bg-primary text-white border-primary shadow-lg";
}

function getStageBadgeClasses(stageName: string): string {
  if (stageName.includes("USER")) return "text-slate-200 border-slate-400/40 bg-slate-500/10";
  if (stageName.includes("INTENT")) return "text-[#1677FF] border-[#1677FF]/40 bg-[#1677FF]/10";
  if (stageName.includes("AGENT")) return "text-[#7C5CFF] border-[#7C5CFF]/40 bg-[#7C5CFF]/10";
  if (stageName.includes("KNOWLEDGE")) return "text-[#00D4FF] border-[#00D4FF]/40 bg-[#00D4FF]/10";
  if (stageName.includes("TOOL")) return "text-[#1677FF] border-[#1677FF]/40 bg-[#1677FF]/10";
  if (stageName.includes("SYSTEM")) return "text-[#1677FF] border-[#1677FF]/40 bg-[#1677FF]/10";
  if (stageName.includes("ACTION")) return "text-[#00D4FF] border-[#00D4FF]/40 bg-[#00D4FF]/10";
  if (stageName.includes("VERIFICATION")) return "text-[#7C5CFF] border-[#7C5CFF]/40 bg-[#7C5CFF]/10";
  if (stageName.includes("OUTCOME")) return "text-[#10B981] border-[#10B981]/40 bg-[#10B981]/10";
  return "text-primary border-primary/30 bg-primary/10";
}

export function AgentWorkflowSimulator() {
  const [selectedAgentId, setSelectedAgentId] = React.useState<string>("procurement");
  const [currentStepIndex, setCurrentStepIndex] = React.useState<number>(0);
  const [isPlaying, setIsPlaying] = React.useState<boolean>(false);

  const activeAgent = ENTERPRISE_AGENTS.find((a) => a.id === selectedAgentId) || ENTERPRISE_AGENTS[0];
  const steps = activeAgent.steps;
  const activeStep = steps[currentStepIndex] || steps[0];

  // Automatic playback timer
  React.useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentStepIndex((prev) => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 2800);
    }
    return () => clearInterval(timer);
  }, [isPlaying, steps.length]);

  const handleSelectAgent = (agentId: string) => {
    setSelectedAgentId(agentId);
    setCurrentStepIndex(0);
    setIsPlaying(false);
  };

  return (
    <section className="relative py-24 bg-[#050B14] border-t border-[#162238] overflow-hidden">
      {/* Subtle Background Glows */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -z-10 w-[600px] h-[350px] rounded-full bg-primary/8 blur-[140px] pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <Badge variant="outline" className="px-3.5 py-1 text-xs border-primary/30 text-primary font-bold uppercase tracking-widest rounded-full bg-primary/5">
            Agentic AI Systems
          </Badge>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight font-heading text-[#F5F7FA]">
            How Enterprise AI Agents <span className="text-primary">Actually Work</span>
          </h2>
          <p className="text-[#A7B4C5] text-base sm:text-lg leading-relaxed">
            Beyond chatbots: See how our multi-agent swarms interpret intent, query enterprise databases, execute API tools, self-correct errors, and deliver audited business results under strict governance.
          </p>
        </div>

        {/* Conceptual Educational Pillars: Chatbots vs Agents vs Enterprise Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-14">
          <div className="p-5 rounded-2xl bg-[#08111F] border border-[#162238] shadow-xs space-y-2.5">
            <div className="flex items-center gap-2.5 text-primary font-bold text-sm">
              <Bot className="w-4 h-4" />
              <span>Agents vs. Chatbots</span>
            </div>
            <p className="text-xs text-[#A7B4C5] leading-relaxed">
              Unlike static chatbots that merely generate conversational text, enterprise AI agents possess <strong>state memory</strong>, <strong>sub-goal planning</strong>, and <strong>sandboxed API tool execution</strong> to autonomously complete complex multi-step business objectives across external systems.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#08111F] border border-[#162238] shadow-xs space-y-2.5">
            <div className="flex items-center gap-2.5 text-violet-400 font-bold text-sm">
              <GitBranch className="w-4 h-4" />
              <span>Orchestration & Systems Tooling</span>
            </div>
            <p className="text-xs text-[#A7B4C5] leading-relaxed">
              Workflows are coordinated through state-machine orchestration: an <strong>Orchestrator Agent</strong> breaks tasks into structured steps, specialized <strong>Worker Agents</strong> interface with SAP, Salesforce, or SQL databases, and an independent <strong>Critic Agent</strong> validates precision.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#08111F] border border-[#162238] shadow-xs space-y-2.5">
            <div className="flex items-center gap-2.5 text-emerald-400 font-bold text-sm">
              <ShieldCheck className="w-4 h-4" />
              <span>Enterprise Governance & Human Gates</span>
            </div>
            <p className="text-xs text-[#A7B4C5] leading-relaxed">
              Autonomy is strictly bounded by deterministic policy guardrails. High-value transactions, PII handling, or policy exceptions automatically trigger <strong>human-in-the-loop (HITL) escalation gates</strong> with cryptographic audit trails for compliance.
            </p>
          </div>
        </div>

        {/* Agent Selector Tabs */}
        <div className="max-w-5xl mx-auto mb-8">
          <div className="flex items-center justify-between pb-3 border-b border-border/60 mb-4">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground">
              Select Production Agent Persona:
            </span>
            <span className="text-[11px] font-mono text-primary font-semibold">
              5 Enterprise Blueprints Available
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
            {ENTERPRISE_AGENTS.map((agent) => {
              const isSelected = agent.id === activeAgent.id;
              const Icon = agent.icon;
              return (
                <button
                  key={agent.id}
                  onClick={() => handleSelectAgent(agent.id)}
                  className={`p-3 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between gap-2.5 cursor-pointer ${
                    isSelected
                      ? "bg-primary text-white border-primary shadow-lg shadow-primary/25 scale-[1.02]"
                      : "bg-[#08111F] border-[#162238] text-[#F5F7FA] hover:border-primary/50 hover:bg-[#0D1828]"
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${isSelected ? "bg-white/20 text-white" : "bg-primary/10 text-primary"}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    {isSelected && (
                      <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                    )}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold font-heading line-clamp-1">
                      {agent.name.replace(" Agent", "")}
                    </h4>
                    <span className={`text-[10px] block line-clamp-1 ${isSelected ? "text-white/80" : "text-[#A7B4C5]"}`}>
                      {agent.category}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Agent Specifications Matrix Card */}
        <div className="max-w-5xl mx-auto bg-[#08111F] border border-[#162238] rounded-3xl p-6 sm:p-8 shadow-xl mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-[#162238]">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Badge className="bg-primary/10 text-primary border-primary/20 text-[10px] font-mono">
                  {activeAgent.category}
                </Badge>
                <span className="text-xs text-[#A7B4C5] font-mono">
                  Active Blueprint: {activeAgent.id}
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold font-heading text-[#F5F7FA]">
                {activeAgent.name}
              </h3>
              <p className="text-xs sm:text-sm text-[#A7B4C5] max-w-2xl">
                {activeAgent.objective}
              </p>
            </div>

            {/* Playback Controls */}
            <div className="flex items-center gap-2 shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsPlaying(!isPlaying)}
                className="rounded-full text-xs h-9 px-4 border-[#162238] bg-[#0D1828] text-[#F5F7FA] hover:border-primary hover:bg-primary/10 cursor-pointer"
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-3.5 h-3.5 mr-1.5 text-primary" />
                    Pause Simulation
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 mr-1.5 text-primary" />
                    Play Simulation
                  </>
                )}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setIsPlaying(false);
                  setCurrentStepIndex(0);
                }}
                className="rounded-full text-xs h-9 px-3 text-[#A7B4C5] hover:text-[#F5F7FA] cursor-pointer"
                title="Reset simulation to step 1"
              >
                <RotateCcw className="w-3.5 h-3.5 mr-1" />
                Reset
              </Button>
            </div>
          </div>

          {/* 6-Part Agent Governance Specification Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-6 text-xs">
            <div className="p-3.5 rounded-xl bg-[#0D1828] border border-[#162238] space-y-1.5">
              <span className="text-[10px] font-mono uppercase tracking-wider text-primary font-bold block">
                Tools Used:
              </span>
              <div className="flex flex-wrap gap-1">
                {activeAgent.toolsUsed.map((tool, i) => (
                  <span key={i} className="text-[10px] bg-[#08111F] px-2 py-0.5 rounded border border-[#162238] text-[#F5F7FA] font-mono">
                    {tool}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#0D1828] border border-[#162238] space-y-1.5">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#7C5CFF] font-bold block">
                Knowledge Accessed:
              </span>
              <div className="flex flex-wrap gap-1">
                {activeAgent.knowledgeAccessed.map((k, i) => (
                  <span key={i} className="text-[10px] bg-[#08111F] px-2 py-0.5 rounded border border-[#162238] text-[#F5F7FA] font-mono">
                    {k}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#0D1828] border border-[#162238] space-y-1.5">
              <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold block">
                Decisions Made:
              </span>
              <p className="text-[#A7B4C5] leading-relaxed text-[11px]">
                {activeAgent.decisionsMade}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#0D1828] border border-[#162238] space-y-1.5">
              <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-bold block">
                Actions Taken:
              </span>
              <p className="text-[#A7B4C5] leading-relaxed text-[11px]">
                {activeAgent.actionsTaken}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#0D1828] border border-[#162238] space-y-1.5">
              <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-bold block">
                Human Oversight Mechanism:
              </span>
              <p className="text-[#A7B4C5] leading-relaxed text-[11px]">
                {activeAgent.humanOversight}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25 space-y-1.5">
              <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold block">
                Measured Business Outcome:
              </span>
              <p className="font-semibold text-[#F5F7FA] leading-relaxed text-[11px]">
                {activeAgent.businessOutcome}
              </p>
            </div>
          </div>
        </div>

        {/* The 9-Stage Agent Workflow Stepper */}
        <div className="max-w-5xl mx-auto bg-[#08111F] border border-[#162238] rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-md">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-border/60">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase text-primary">
                Execution Pipeline Trace:
              </span>
              <span className="text-xs font-mono text-muted-foreground">
                9 Sequential Stages
              </span>
            </div>
            <span className="text-xs font-mono text-emerald-500 font-bold">
              Stage {activeStep.stepNumber} of 9
            </span>
          </div>

          {/* Stepper Buttons (Responsive Grid: 3 cols on mobile, 9 cols on large screen) */}
          <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-1.5 pb-6">
            {steps.map((s, idx) => {
              const isCurrent = currentStepIndex === idx;
              const isPast = currentStepIndex > idx;
              return (
                <button
                  key={s.stepNumber}
                  onClick={() => {
                    setIsPlaying(false);
                    setCurrentStepIndex(idx);
                  }}
                  className={`p-2 rounded-xl border text-left transition-all duration-200 flex flex-col justify-between gap-1 cursor-pointer ${
                    isCurrent
                      ? getStageActiveClasses(s.stageName) + " scale-[1.03]"
                      : isPast
                      ? "bg-[#0D1828] border-emerald-500/40 text-[#F5F7FA]"
                      : "bg-[#08111F] border-[#162238] text-[#A7B4C5] hover:border-primary/40 hover:text-[#F5F7FA]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-[9px] font-mono font-bold ${isCurrent ? "" : isPast ? "text-emerald-400" : "text-[#6F7E91]"}`}>
                      0{s.stepNumber}
                    </span>
                    {isPast && <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400" />}
                  </div>
                  <span className="text-[10px] font-bold line-clamp-1 leading-tight">
                    {s.stageName.split(" ")[0]}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active Step Details & Live Telemetry Terminal */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch pt-2">
            {/* Left: Step Context & Action Details */}
            <div className="lg:col-span-5 bg-[#0D1828] border border-[#162238] rounded-2xl p-6 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className={`text-[10px] font-mono uppercase tracking-wider ${getStageBadgeClasses(activeStep.stageName)}`}>
                    {activeStep.stageName}
                  </Badge>
                  <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px]">
                    {activeStep.status}
                  </Badge>
                </div>

                <div>
                  <h4 className="text-base font-bold font-heading text-[#F5F7FA]">
                    {activeStep.stepTitle}
                  </h4>
                  <span className="text-[11px] font-mono text-[#A7B4C5]">
                    Actor: {activeStep.actor}
                  </span>
                </div>

                <p className="text-xs text-[#A7B4C5] leading-relaxed pt-1">
                  {activeStep.detail}
                </p>
              </div>

              <div className="pt-4 border-t border-[#162238] flex items-center justify-between">
                <button
                  disabled={currentStepIndex === 0}
                  onClick={() => setCurrentStepIndex((prev) => Math.max(0, prev - 1))}
                  className="text-xs font-semibold text-[#A7B4C5] hover:text-[#F5F7FA] disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
                >
                  ← Previous Stage
                </button>
                <button
                  disabled={currentStepIndex === steps.length - 1}
                  onClick={() => setCurrentStepIndex((prev) => Math.min(steps.length - 1, prev + 1))}
                  className="text-xs font-bold text-primary hover:underline disabled:opacity-30 disabled:pointer-events-none flex items-center gap-1 cursor-pointer"
                >
                  Next Stage →
                </button>
              </div>
            </div>

            {/* Right: Live Agent Telemetry & Execution Terminal */}
            <div className="lg:col-span-7 bg-[#050B14] text-zinc-100 border border-[#162238] rounded-2xl p-5 font-mono text-xs shadow-inner flex flex-col justify-between space-y-4">
              <div className="flex items-center justify-between border-b border-[#162238] pb-3">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 inline-block" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
                  </div>
                  <span className="text-[11px] text-[#A7B4C5] pl-2 font-mono">
                    agent-telemetry-stdout.log
                  </span>
                </div>
                <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  REAL-TIME TRACE
                </span>
              </div>

              <div className="bg-[#08111F]/80 rounded-xl p-4 border border-[#162238] overflow-x-auto min-h-[160px] flex items-center">
                <pre className="text-zinc-200 text-[11px] leading-relaxed whitespace-pre-wrap font-mono w-full">
                  {activeStep.log}
                </pre>
              </div>

              <div className="flex flex-wrap items-center justify-between text-[11px] text-[#A7B4C5] pt-2 border-t border-[#162238] gap-2">
                <span>VPC Isolation: Active</span>
                <span className="text-emerald-400">Grounded Citations Verified</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
