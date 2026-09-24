import { NextRequest, NextResponse } from "next/server";
import { aiConciergeService, AiConciergeRequest } from "@/lib/ai-service";

// Simple in-memory rate limiter per IP address
// Allows up to 20 requests per minute per IP
interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 20;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(ip, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW_MS
    });
    return false;
  }

  if (entry.count >= MAX_REQUESTS_PER_WINDOW) {
    return true;
  }

  entry.count += 1;
  return false;
}

// Cleanup stale IP entries every 5 minutes
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [ip, entry] of rateLimitMap.entries()) {
      if (now > entry.resetTime) {
        rateLimitMap.delete(ip);
      }
    }
  }, 5 * 60 * 1000);
}

export async function POST(req: NextRequest) {
  try {
    // 1. IP extraction & Rate limiting
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || 
               req.headers.get("x-real-ip") || 
               "anonymous-client";

    if (isRateLimited(ip)) {
      return NextResponse.json(
        { 
          error: "Too many requests. Please wait a moment before sending another message to the AI Concierge.",
          rateLimited: true 
        },
        { status: 429 }
      );
    }

    // 2. Body parsing and size check
    let body: any;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON request body." },
        { status: 400 }
      );
    }

    // 3. Validation & Sanitization
    const messages = Array.isArray(body.messages) ? body.messages : [];
    if (messages.length === 0 && !body.challenge) {
      return NextResponse.json(
        { error: "At least one message or challenge is required." },
        { status: 400 }
      );
    }

    // Cap message history to 10 and max 2000 chars per message
    const sanitizedMessages = messages.slice(-10).map((msg: any) => ({
      role: msg.role === "assistant" ? "assistant" : "user",
      content: typeof msg.content === "string" ? msg.content.substring(0, 2000) : ""
    }));

    const sanitizedRequest: AiConciergeRequest = {
      messages: sanitizedMessages,
      industry: typeof body.industry === "string" ? body.industry.substring(0, 100) : undefined,
      stage: typeof body.stage === "string" ? body.stage.substring(0, 100) : undefined,
      challenge: typeof body.challenge === "string" ? body.challenge.substring(0, 500) : undefined,
      engagementType: typeof body.engagementType === "string" ? body.engagementType.substring(0, 100) : undefined,
      contextSource: ["assessment", "roi", "direct", "showcase"].includes(body.contextSource) ? body.contextSource : "direct",
      assessmentContext: body.assessmentContext && typeof body.assessmentContext === "object" ? {
        domain: typeof body.assessmentContext.domain === "string" ? body.assessmentContext.domain.substring(0, 100) : undefined,
        maturityScore: typeof body.assessmentContext.maturityScore === "number" ? body.assessmentContext.maturityScore : undefined,
        priorityObjectives: Array.isArray(body.assessmentContext.priorityObjectives) ? body.assessmentContext.priorityObjectives.slice(0, 5).map((o: any) => String(o).substring(0, 100)) : undefined
      } : undefined,
      roiContext: body.roiContext && typeof body.roiContext === "object" ? {
        teamSize: typeof body.roiContext.teamSize === "number" ? body.roiContext.teamSize : undefined,
        targetDepartment: typeof body.roiContext.targetDepartment === "string" ? body.roiContext.targetDepartment.substring(0, 100) : undefined,
        estimatedSavings: typeof body.roiContext.estimatedSavings === "string" ? body.roiContext.estimatedSavings.substring(0, 100) : undefined,
        laborHoursRecovered: typeof body.roiContext.laborHoursRecovered === "string" ? body.roiContext.laborHoursRecovered.substring(0, 100) : undefined
      } : undefined,
      sessionId: typeof body.sessionId === "string" ? body.sessionId.substring(0, 64) : undefined
    };

    // 4. Execute AI Concierge Service
    const result = await aiConciergeService.processRequest(sanitizedRequest);

    return NextResponse.json(result, {
      status: 200,
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
        "X-AI-Engine": result.provider
      }
    });

  } catch (error: any) {
    console.error("[AI Concierge API Error]:", error?.message || error);
    return NextResponse.json(
      { 
        error: "An unexpected error occurred while analyzing your architecture request. Our team has been notified.",
        fallbackAvailable: true
      },
      { status: 500 }
    );
  }
}
