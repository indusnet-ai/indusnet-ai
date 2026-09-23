"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Bot, ArrowRight, Play, Pause, RotateCcw, 
  CheckCircle2, Terminal, ShieldAlert, Cpu, Database, 
  Wrench, CheckCheck, Sparkles, FileText, ChevronRight
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface WorkflowStep {
  stepNumber: number;
  label: string;
  actor: string;
  icon: any;
  status: string;
  log: string;
  detail: string;
}

const WORKFLOW_STEPS: WorkflowStep[] = [
  {
    stepNumber: 1,
    label: "Customer / System Inbound Request",
    actor: "Enterprise Webhook / ERP Listener",
    icon: FileText,
    status: "Trigger Received",
    log: "POST /api/webhooks/incoming_invoice\nPayload: { vendor_id: 'VEND-904', amount: '$42,500.00', file: 'INV-2026-88.pdf' }",
    detail: "An unstructured invoice arrives from a vendor via email/SFTP with multi-page table line items."
  },
  {
    stepNumber: 2,
    label: "Planner Agent Interprets Intent & Scope",
    actor: "Indusnet Orchestrator (ReAct Loop)",
    icon: Bot,
    status: "Plan Formulated",
    log: "Planning Step 1: Parse table tokens via Vision OCR\nPlanning Step 2: Query SAP ERP PO #84102 for matching lines\nPlanning Step 3: Run variance audit threshold < 1.5%",
    detail: "The orchestrator deconstructs the objective into sub-goals, identifies tools needed, and verifies execution permissions."
  },
  {
    stepNumber: 3,
    label: "Agent Queries Enterprise Knowledge & ERP",
    actor: "Knowledge Agent (pgvector + SAP API)",
    icon: Database,
    status: "Context Grounded",
    log: "Querying: SELECT * FROM erp_purchase_orders WHERE po_number = 'PO-84102'\nRetrieved 14 line items. Vector match on Master Service Agreement clause 4.2.",
    detail: "Agent queries corporate records with zero-trust credentials to fetch active purchase order items and agreed payment terms."
  },
  {
    stepNumber: 4,
    label: "Agent Calls External API Tools",
    actor: "Tool Executor (OAuth2 Sandbox)",
    icon: Wrench,
    status: "Tools Invoked",
    log: "Executing tool: reconcile_line_items()\nDiscrepancy found: Line 4 tax calculation has $320 freight surcharge not on PO.",
    detail: "The agent invokes API tools to reconcile unit prices, line items, and quantities against the ERP system."
  },
  {
    stepNumber: 5,
    label: "Agent Executes Workflow & Drafts Action",
    actor: "Action Executor Agent",
    icon: Cpu,
    status: "Commit Drafted",
    log: "Generated Action: Hold $320 line for vendor clarification. Auto-approve balance of $42,180.00.\nDrafting vendor notice email.",
    detail: "Applies business logic: isolates the discrepancy, authorizes undisputed amounts, and drafts automated vendor notice."
  },
  {
    stepNumber: 6,
    label: "Evaluator Agent Verifies Policy & Accuracy",
    actor: "Deterministic Safety Critic",
    icon: ShieldAlert,
    status: "Audit Passed",
    log: "Evaluating: Compliance Rule #802 (SOX 404 audit trail)\nVariance: $320.00 (under $1,000 threshold for human CFO escalation)\nStatus: Approved with logged audit signature.",
    detail: "A separate critic agent evaluates intermediate actions against company fiscal policy before any live database commits."
  },
  {
    stepNumber: 7,
    label: "Business Outcome Delivered & Logged",
    actor: "ERP Commit daemon",
    icon: CheckCheck,
    status: "Completed in 3.8s",
    log: "COMMIT SUCCESS: Invoice #INV-2026-88 approved.\nCycle Time: 3.8 seconds.\nLabor Saved: 45 minutes of manual procurement review.",
    detail: "The transaction is committed to ERP, an audit trail is written, and both parties are notified with zero human delay."
  }
];

export function AgentWorkflowSimulator() {
  const [currentStepIndex, setCurrentStepIndex] = React.useState(0);
  const [isPlaying, setIsPlaying] = React.useState(false);

  React.useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentStepIndex((prev) => {
          if (prev >= WORKFLOW_STEPS.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 2600);
    }
    return () => clearInterval(timer);
  }, [isPlaying]);

  const activeStep = WORKFLOW_STEPS[currentStepIndex];
  const StepIcon = activeStep.icon;

  return (
    <section className="relative py-24 overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <Badge variant="outline" className="px-3.5 py-1 text-xs border-primary/30 text-primary font-bold uppercase tracking-widest rounded-full">
            Autonomous Agent Architecture
          </Badge>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight font-heading text-foreground">
            How Enterprise AI Agents <span className="text-primary">Actually Work</span>
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">
            Beyond chatbots: See how our multi-agent swarms interpret intent, query enterprise databases, execute API tools, self-correct errors, and deliver audited business results.
          </p>
        </div>

        {/* Simulator Cockpit */}
        <div className="max-w-5xl mx-auto bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-md">
          {/* Controls & Status Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-border/60">
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono font-bold uppercase text-primary">
                Simulation Scenario:
              </span>
              <Badge variant="outline" className="text-xs font-semibold py-0.5 border-border bg-muted/40 text-foreground">
                Autonomous 3-Way Invoice Reconciliation
              </Badge>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsPlaying(!isPlaying)}
                className="rounded-full text-xs h-8 px-3 border-border hover:border-primary"
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-3.5 h-3.5 mr-1 text-primary" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 mr-1 text-primary" />
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
                className="rounded-full text-xs h-8 px-2 text-muted-foreground hover:text-foreground"
                title="Reset simulation"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>

          {/* Phased Progress Stepper Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 py-6">
            {WORKFLOW_STEPS.map((s, idx) => {
              const isCurrent = currentStepIndex === idx;
              const isPast = currentStepIndex > idx;
              return (
                <button
                  key={s.stepNumber}
                  onClick={() => {
                    setIsPlaying(false);
                    setCurrentStepIndex(idx);
                  }}
                  className={`p-2.5 rounded-xl border text-left transition-all duration-200 flex flex-col justify-between gap-1.5 ${
                    isCurrent
                      ? "bg-primary text-white border-primary shadow-md shadow-primary/20 scale-102"
                      : isPast
                      ? "bg-muted/70 border-emerald-500/40 text-foreground"
                      : "bg-background/40 border-border/70 text-muted-foreground hover:border-border"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-mono font-bold ${isCurrent ? "text-white" : isPast ? "text-emerald-500" : "text-muted-foreground"}`}>
                      0{s.stepNumber}
                    </span>
                    {isPast && <CheckCircle2 className="w-3 h-3 text-emerald-500" />}
                  </div>
                  <span className="text-[11px] font-bold line-clamp-1 leading-tight">
                    {s.label.split(" ")[0]} {s.label.split(" ")[1]}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active Step Visualizer & Terminal Log */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch pt-2">
            {/* Left: Step Card Details */}
            <div className="lg:col-span-5 bg-muted/30 border border-border/70 rounded-2xl p-6 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-primary font-bold">
                    Step {activeStep.stepNumber} of 7
                  </span>
                  <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-[10px]">
                    {activeStep.status}
                  </Badge>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center shadow-md shadow-primary/25">
                    <StepIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold font-heading text-foreground">
                      {activeStep.label}
                    </h4>
                    <span className="text-[11px] text-muted-foreground">
                      Actor: {activeStep.actor}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed pt-2">
                  {activeStep.detail}
                </p>
              </div>

              <div className="pt-4 border-t border-border/60 flex items-center justify-between">
                <button
                  disabled={currentStepIndex === 0}
                  onClick={() => setCurrentStepIndex((prev) => Math.max(0, prev - 1))}
                  className="text-xs font-semibold text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:pointer-events-none transition-colors"
                >
                  ← Previous Step
                </button>
                <button
                  disabled={currentStepIndex === WORKFLOW_STEPS.length - 1}
                  onClick={() => setCurrentStepIndex((prev) => Math.min(WORKFLOW_STEPS.length - 1, prev + 1))}
                  className="text-xs font-bold text-primary hover:underline disabled:opacity-30 disabled:pointer-events-none flex items-center gap-1"
                >
                  Next Step →
                </button>
              </div>
            </div>

            {/* Right: Live Agent Telemetry & Terminal Execution Log */}
            <div className="lg:col-span-7 bg-zinc-950 text-zinc-100 border border-zinc-800 rounded-2xl p-5 font-mono text-xs shadow-inner flex flex-col justify-between space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 inline-block" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
                  </div>
                  <span className="text-[11px] text-zinc-400 pl-2">
                    agent-runtime-stdout.log
                  </span>
                </div>
                <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  ACTIVE TRACE
                </span>
              </div>

              <div className="bg-black/40 rounded-xl p-4 border border-zinc-900 overflow-x-auto min-h-[140px] flex items-center">
                <pre className="text-zinc-300 text-[11px] leading-relaxed whitespace-pre-wrap font-mono">
                  {activeStep.log}
                </pre>
              </div>

              <div className="flex items-center justify-between text-[11px] text-zinc-400 pt-2 border-t border-zinc-900">
                <span>Memory: Isolated Session State</span>
                <span className="text-emerald-400">Zero Hallucinations Enforced</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
