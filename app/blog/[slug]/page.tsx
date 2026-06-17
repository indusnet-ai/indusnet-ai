import * as React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, Calendar, Clock, Sparkles, BrainCircuit, HeartPulse, 
  Building2, ShieldCheck, CheckCircle2, ChevronRight 
} from "lucide-react";

interface ArticleData {
  title: string;
  category: string;
  date: string;
  readTime: string;
  desc: string;
  author: string;
  icon: React.ComponentType<any>;
  content: React.ReactNode;
}

const articlesData: Record<string, ArticleData> = {
  "what-is-rag": {
    title: "What is RAG (Retrieval-Augmented Generation)?",
    category: "AI Architecture",
    date: "May 28, 2026",
    readTime: "6 min read",
    author: "Senthilkumar Elu",
    desc: "A deep dive into how semantic search databases connect Large Language Models to private corporate files safely, bypassing model hallucinations and third-party data leaks.",
    icon: BrainCircuit,
    content: (
      <div className="flex flex-col gap-6">
        <p>
          Generative AI models are powerful, but they suffer from two critical limitations when deployed in enterprise settings: **hallucinations** (confident but incorrect answers) and **lack of access to private, real-time data**. While fine-tuning models is an option, it is expensive, slow, and hard to manage for permissions.
        </p>
        <p>
          <strong>Retrieval-Augmented Generation (RAG)</strong> has emerged as the industry standard. RAG operates by retrieving relevant documents from a private database *first*, and then feeding those documents as a reference to the LLM to generate the final response. It turns the LLM from an "open-book test taker" instead of a student relying on memory.
        </p>

        <h3 className="text-lg font-bold text-white mt-4 border-l-2 border-primary pl-2">The Ingestion Pipeline: Transforming Data</h3>
        <p>
          Before retrieval can occur, unstructured documents (such as PDFs, DOCX, or text files) must be converted into a searchable format:
        </p>
        <ul className="list-disc pl-5 flex flex-col gap-2">
          <li><strong>Document Chunking</strong>: Large files are broken into smaller, semantic sections (e.g. 500-character segments with 100-character overlaps). This preserves context and prevents information overload in the model’s context window.</li>
          <li><strong>Vector Embedding</strong>: Each chunk is passed through an embedding model (like `text-embedding-3-small`) to convert the text into a mathematical coordinate array (vectors) representing its semantic meaning.</li>
          <li><strong>Vector Storage</strong>: These vectors are stored in specialized vector databases (such as Qdrant, Pinecone, or pgvector in PostgreSQL) with indexes optimized for cosine or inner-product similarity search.</li>
        </ul>

        <blockquote className="border-l-4 border-primary bg-white/5 p-4 rounded-r-lg my-4 text-xs italic">
          "By utilizing semantic vector indexes rather than keywords, RAG systems retrieve documents based on conceptual meaning. Searching for 'annual budget constraints' will fetch documents containing 'financial limits' or 'fiscal limits' even if the word 'budget' is never written."
        </blockquote>

        <h3 className="text-lg font-bold text-white mt-4 border-l-2 border-primary pl-2">The Query Loop: Retrieval & Generation</h3>
        <p>
          When a user inputs a query:
        </p>
        <ol className="list-decimal pl-5 flex flex-col gap-2">
          <li>The query is embedded into a vector using the same embedding model.</li>
          <li>The vector database retrieves the top-K chunks (e.g., top 5 most similar chunks) using algorithms like HNSW (Hierarchical Navigable Small World).</li>
          <li>A **reranking model** (like Cohere Rerank) reassesses the retrieved chunks to order them strictly by contextual value.</li>
          <li>The query and the prioritized chunks are merged into a prompt structure (system context) and sent to the LLM.</li>
          <li>The LLM generates a response constrained *only* to the retrieved chunks, adding clear citation markers back to source documents.</li>
        </ol>

        <h3 className="text-lg font-bold text-white mt-4 border-l-2 border-primary pl-2">Securing RAG for Enterprise Workloads</h3>
        <p>
          For corporate deployment, security is paramount. Standard RAG architectures must be wrapped with **Document-Level Access Controls (ACLs)**. When a query is executed, the system filters vector searches to include only document chunks that the user is authorized to read (e.g., matching their active Active Directory or Okta policies). This prevents junior staff from retrieving executive budgets or payroll logs through prompt queries.
        </p>
      </div>
    )
  },
  "ai-agents-vs-chatbots": {
    title: "AI Agents vs Chatbots: Understanding Autonomy Levels",
    category: "Workflow Automation",
    date: "May 20, 2026",
    readTime: "5 min read",
    author: "Senthilkumar Elu",
    desc: "Discover why standard chat interfaces are fading, replaced by autonomous agents utilizing tools, loops, self-correction, and multiple supervisor models.",
    icon: Sparkles,
    content: (
      <div className="flex flex-col gap-6">
        <p>
          The term "chatbot" is frequently used to describe anything powered by large language models. However, standard chatbots and autonomous **AI Agents** represent entirely different paradigms of software engineering. Chatbots require continuous user prompting, while AI Agents operate independently to complete complex, multi-step goals.
        </p>
        <p>
          Understanding this transition is essential for enterprise leaders looking to automate operations rather than simply provide automated text answering services.
        </p>

        <h3 className="text-lg font-bold text-white mt-4 border-l-2 border-accent pl-2">The Spectrum of Autonomy</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-2">
          <div className="bg-white/5 border border-border/40 p-4 rounded-lg flex flex-col gap-1.5">
            <span className="text-xs font-bold text-white">Level 1: Chatbots</span>
            <span className="text-[10px] text-muted-foreground text-left">Linear input/output. They reply to user prompts sequentially without tool access or memory loops.</span>
          </div>
          <div className="bg-white/5 border border-border/40 p-4 rounded-lg flex flex-col gap-1.5">
            <span className="text-xs font-bold text-accent">Level 2: Tool-Enabled</span>
            <span className="text-[10px] text-muted-foreground text-left">Can call APIs, search databases, or execute python scripts when prompted by a human.</span>
          </div>
          <div className="bg-white/5 border border-border/40 p-4 rounded-lg flex flex-col gap-1.5">
            <span className="text-xs font-bold text-primary">Level 3: Autonomous Agents</span>
            <span className="text-[10px] text-muted-foreground text-left">Runs in reasoning loops (e.g. ReAct). They self-correct, plan subtasks, and verify outputs.</span>
          </div>
        </div>

        <h3 className="text-lg font-bold text-white mt-4 border-l-2 border-accent pl-2">How Agentic Reasoning Loops Work</h3>
        <p>
          Autonomous agents utilize architectures such as **ReAct (Reason + Action)**. Instead of immediately writing a response, the agent goes through sequential cycles:
        </p>
        <ul className="list-disc pl-5 flex flex-col gap-2">
          <li><strong>Thought</strong>: The agent analyzes the user's objective and decides what information is missing.</li>
          <li><strong>Plan</strong>: It breaks the large goal into structured milestones (e.g. *Step 1: Fetch invoice, Step 2: Validate lines, Step 3: Flag mismatch*).</li>
          <li><strong>Action</strong>: It invokes a tool (such as executing a SQL query or calling a CRM API).</li>
          <li><strong>Observation</strong>: It reads the tool output and analyzes if the step succeeded or failed, adjusting the plan dynamically if an error occurs.</li>
        </ul>

        <h3 className="text-lg font-bold text-white mt-4 border-l-2 border-accent pl-2">Multi-Agent Orchestrations</h3>
        <p>
          For complex corporate operations, a single agent is rarely enough. Instead, companies deploy **multi-agent supervisor frameworks**. In this design, a specialized "Supervisor Agent" receives the user's project request and coordinates work across specialized worker agents:
        </p>
        <ul className="list-disc pl-5 flex flex-col gap-2">
          <li>An **Ingestion Agent** reads email attachments and extracts tables.</li>
          <li>A **Validation Agent** cross-checks items against billing tables in the database.</li>
          <li>An **Audit Agent** drafts warning flags if discrepancy ranges exceed pre-approved thresholds.</li>
        </ul>
        <p>
          By separating concerns, multi-agent setups achieve high stability and reduce execution loops, allowing automated pipelines to run with high accuracy.
        </p>
      </div>
    )
  },
  "hipaa-compliant-ai-healthcare": {
    title: "HIPAA-Compliant AI in Modern Healthcare",
    category: "Healthcare Compliance",
    date: "May 12, 2026",
    readTime: "4 min read",
    author: "Senthilkumar Elu",
    desc: "How hospital systems are deploying ambient clinical transcription recorders and diagnostic support networks completely inside private, audit-ready VPC subnets.",
    icon: HeartPulse,
    content: (
      <div className="flex flex-col gap-6">
        <p>
          Generative AI offers massive efficiency gains for healthcare professionals, particularly in reducing clinical burnout. Hospital networks are eager to deploy **ambient clinical transcription** (transcribing patient-doctor visits and drafting clinical notes automatically). However, passing Protected Health Information (PHI) to generic cloud models violates HIPAA security rules.
        </p>
        <p>
          Achieving HIPAA-compliant AI requires building secure architectures where data is protected at rest, in transit, and during model processing.
        </p>

        <h3 className="text-lg font-bold text-white mt-4 border-l-2 border-primary pl-2">The Private VPC Architecture</h3>
        <p>
          To maintain strict data custody, hospital systems are deploying LLMs completely inside their private virtual private cloud (VPC) on platforms like AWS or Azure:
        </p>
        <ul className="list-disc pl-5 flex flex-col gap-2">
          <li><strong>Local Model Hosting</strong>: Using open-weight, clinically-aligned models (such as Clinical-Llama or Med-Llama-3) hosted inside isolated EC2/GPU instances. Since the model resides inside the hospital's cloud perimeter, no patient transcripts leave the secure system.</li>
          <li><strong>Local Audio Transcription</strong>: Speech-to-text conversion (using Whisper models) is executed on private GPU instances, keeping raw patient audio securely within system boundaries.</li>
        </ul>

        <blockquote className="border-l-4 border-primary bg-white/5 p-4 rounded-r-lg my-4 text-xs italic">
          "Under HIPAA guidelines, model providers must execute a Business Associate Agreement (BAA). Using consumer APIs or public chatbots has zero compliance protection, exposing patient details to systemic leaks."
        </blockquote>

        <h3 className="text-lg font-bold text-white mt-4 border-l-2 border-primary pl-2">Technical Implementation Checklist</h3>
        <p>
          A compliant clinical notes builder must implement:
        </p>
        <ul className="list-disc pl-5 flex flex-col gap-2">
          <li><strong>Encryption Envelope</strong>: All data stored in tables (leads or notes) must be encrypted using keys managed via Key Management Services (KMS).</li>
          <li><strong>De-Identification Layers</strong>: Before clinical notes are compiled into databases, an automated Entity Recognition layer (NER) flags and masks direct identifiers like patient names, SSNs, or birth dates.</li>
          <li><strong>Immutable Audit Trails</strong>: Detailed logging of who accessed which record, what prompts were run, and when data was generated must be saved to tamper-proof write-once cloud buckets.</li>
        </ul>
      </div>
    )
  },
  "future-of-genai-on-premise": {
    title: "The Future of Generative AI: On-Premises & Edge Inference",
    category: "Infrastructure",
    date: "May 04, 2026",
    readTime: "7 min read",
    author: "Senthilkumar Elu",
    desc: "Model pricing is dropping, but private hardware custody is rising. Why enterprise leaders are investing in private local GPU cloud configurations.",
    icon: Building2,
    content: (
      <div className="flex flex-col gap-6">
        <p>
          Over the past two years, cloud API providers have competed in price reductions for model tokens. Yet, a growing number of mid-market enterprises and financial institutions are migrating *away* from cloud APIs, choosing instead to host LLMs on **on-premises servers or private GPU edge clusters**.
        </p>
        <p>
          This shift is driven by three key factors: **regulatory requirements, network latency control, and long-term cost efficiency**.
        </p>

        <h3 className="text-lg font-bold text-white mt-4 border-l-2 border-accent pl-2">The Financial Math: Cloud vs. Local Hardware</h3>
        <p>
          While cloud APIs have low startup costs, high-volume production systems incur significant monthly costs. Consider a system processing **10 million tokens per day** (indexing customer emails, document OCR, and running analysis loops):
        </p>
        <ul className="list-disc pl-5 flex flex-col gap-2">
          <li><strong>Cloud API Cost</strong>: At an average cost of $10 per million tokens (input + output blending), this costs roughly $100 per day, or **$36,000 per year**. If you scale to multiple agent pipelines, this cost multiplies.</li>
          <li><strong>Local GPU cost</strong>: A dedicated server equipped with dual NVIDIA RTX 6000 Ada GPUs or a private rack server costs roughly **$20,000 to $25,000 upfront**. This hardware amortizes over 3–5 years, dropping operational costs to power and cooling alone.</li>
        </ul>

        <h3 className="text-lg font-bold text-white mt-4 border-l-2 border-accent pl-2">Edge Model Optimization</h3>
        <p>
          Running models locally used to require multi-million dollar data centers. Thanks to **quantization methodologies** (GGUF, GPTQ, AWQ), model weights are compressed from 16-bit to 4-bit or 8-bit precision with minimal loss in accuracy. 
        </p>
        <p>
          A quantized 70B parameter model (like Llama-3-70B-Instruct) can run on a single dual-GPU server, delivering rapid token throughput (40+ tokens per second) securely. Local hosting middleware like vLLM and Ollama compile execution paths natively to the local hardware, making deployment straightforward.
        </p>

        <h3 className="text-lg font-bold text-white mt-4 border-l-2 border-accent pl-2">Zero Latency and Offline Reliability</h3>
        <p>
          In manufacturing, robotics, and logistics, cloud delays are a bottleneck. If an automated visual inspection camera on an assembly line must wait 1.5 seconds for a cloud API response to flag a defective item, the line stops. Hosting smaller, optimized models (e.g. 8B parameter vision models) on edge hardware (like NVIDIA Jetson or local workstations) reduces latency to milliseconds, ensuring reliable offline operations.
        </p>
      </div>
    )
  },
  "ai-automation-trends-enterprise": {
    title: "Top AI Automation Trends for Mid-Market Enterprises",
    category: "Enterprise Strategy",
    date: "April 26, 2026",
    readTime: "5 min read",
    author: "Senthilkumar Elu",
    desc: "Reconciling invoices, auto-updating CRMs, and compiling regulatory portfolios: where the highest ROI lies in 2026 for automated workflows.",
    icon: ShieldCheck,
    content: (
      <div className="flex flex-col gap-6">
        <p>
          Mid-market enterprises (businesses with $50M to $500M in revenue) face a unique challenge: they must scale operations and compete with larger corporations, but without access to massive IT development teams. 
        </p>
        <p>
          In 2026, the highest return on investment (ROI) for Generative AI in the mid-market is not found in general query interfaces or text writing assistants. It lies in **deterministic workflow automation** that removes back-office bottlenecks.
        </p>

        <h3 className="text-lg font-bold text-white mt-4 border-l-2 border-primary pl-2">Identifying High-ROI Bottlenecks</h3>
        <p>
          The most successful AI implementations target structured document workflows. We advise clients to focus on three key areas:
        </p>
        <ul className="list-disc pl-5 flex flex-col gap-2">
          <li><strong>Invoice & Logistics Reconciliation</strong>: Combining OCR with LLM parsing to read incoming invoices, cross-reference line items against internal ERP databases, and flag discrepancies for review automatically.</li>
          <li><strong>Regulatory Portfolio Compilation</strong>: Sifting through thousands of pages of audit reports, product safety sheets, and customs documentation to compile compliance portfolios.</li>
          <li><strong>Autonomous CRM/ERP Sync</strong>: Extracting action items and customer requirements from email chains or meeting transcripts, and updating internal records without manual entry.</li>
        </ul>

        <blockquote className="border-l-4 border-primary bg-white/5 p-4 rounded-r-lg my-4 text-xs italic">
          "Mid-market automation succeeded when we shifted from asking models to 'write text' to asking models to 'parse, classify, and structure data'. Structuring unstructured text is where AI delivers immediate savings."
        </blockquote>

        <h3 className="text-lg font-bold text-white mt-4 border-l-2 border-primary pl-2">CPMAI: Structured Project Management</h3>
        <p>
          Over 70% of enterprise AI projects fail due to poor scoping or undefined goals. To mitigate this risk, Indusnet AI utilizes the **CPMAI (Cognitive Project Management for AI)** methodology. 
        </p>
        <p>
          CPMAI guides projects through structured phases: from initial business scoper validation, data profiling, model selection, to continuous monitoring. Applying a structured framework ensures that AI projects have clear success metrics and deliver measurable business value.
        </p>
      </div>
    )
  }
};

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = articlesData[slug];

  if (!article) {
    notFound();
  }

  const Icon = article.icon;

  return (
    <div className="flex flex-col gap-12 md:gap-16 pt-32 pb-24 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -z-10 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[140px]" />

      {/* Header breadcrumb & Title */}
      <section className="container mx-auto px-4 md:px-6 max-w-3xl flex flex-col gap-6 text-left">
        <Button asChild variant="ghost" className="w-fit -ml-2 text-xs text-muted-foreground hover:text-white rounded-full">
          <Link href="/blog" className="flex items-center gap-1.5">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Blog
          </Link>
        </Button>

        <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" /> {article.date}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> {article.readTime}
          </span>
          <Badge className="bg-primary/10 border-primary/20 text-primary text-[10px] rounded px-2.5 py-0.5">
            {article.category}
          </Badge>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight font-heading leading-tight text-white">
          {article.title}
        </h1>

        <p className="text-muted-foreground text-sm sm:text-base leading-relaxed border-b border-border/10 pb-6">
          {article.desc}
        </p>
      </section>

      {/* Article Content Core */}
      <section className="container mx-auto px-4 md:px-6 max-w-3xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main content column */}
          <div className="lg:col-span-9 flex flex-col gap-6 text-xs sm:text-sm text-muted-foreground leading-relaxed text-left">
            {article.content}
          </div>

          {/* Sidebar author details */}
          <div className="lg:col-span-3 flex flex-col gap-4">
            <Card className="glassmorphism-card border-none text-left">
              <CardContent className="p-4 flex flex-col gap-3.5">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-xs text-primary">
                  {article.author[0]}
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs font-bold text-white">{article.author}</span>
                  <span className="text-[10px] text-muted-foreground">Founder & Managing Director</span>
                </div>
                <div className="border-t border-border/10 pt-2.5 mt-1 flex flex-col gap-1 text-[10px] text-muted-foreground">
                  <span>Certified Facilitator</span>
                  <span className="text-white font-semibold">Indusnet AI Labs</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FOOTER CALL TO ACTION */}
      <section className="container mx-auto px-4 md:px-6 max-w-3xl mt-12">
        <Card className="glassmorphism-card border-none py-8 px-6 text-center flex flex-col gap-4.5 items-center">
          <Badge className="bg-primary/10 border-primary/20 text-primary rounded-full px-2.5 py-0.5 text-xs">
            Start Your Custom POC
          </Badge>
          <h2 className="text-lg md:text-xl font-bold text-white">Need structured, secure AI deployment?</h2>
          <p className="text-muted-foreground text-xs max-w-md leading-relaxed">
            Partner with certified solutions architects to construct a highly secure, high-performance roadmap for your enterprise.
          </p>
          <div className="flex gap-2">
            <Button asChild variant="outline" className="rounded-full border-border/40 hover:bg-white/5 text-xs px-5">
              <Link href="/assessment">Use AI Scoper</Link>
            </Button>
            <Button asChild className="rounded-full bg-gradient-to-r from-primary to-accent text-white font-medium hover:brightness-110 text-xs px-5">
              <Link href="/contact" className="flex items-center gap-1">
                Book Consult <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </Button>
          </div>
        </Card>
      </section>
    </div>
  );
}
