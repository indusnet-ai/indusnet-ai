import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_INTERNAL_URL || "http://127.0.0.1:8001";

type RouteParams = {
  params: Promise<{
    path: string[];
  }>;
};

const STRIPPED_HEADERS = new Set([
  "host",
  "content-length",
  "content-encoding",
  "connection",
  "transfer-encoding",
]);

async function handleProxy(req: NextRequest, { params }: RouteParams) {
  const resolvedParams = await params;
  const path = resolvedParams.path.join("/");
  
  const url = new URL(req.url);
  const searchParams = url.search;
  
  // Forward to FastAPI backend (mapping /api/backend/* to backend /*)
  const backendUrl = `${BACKEND_URL}/${path}${searchParams}`;
  
  // Forward request headers, filtering out proxy conflict headers
  const headers = new Headers();
  req.headers.forEach((value, key) => {
    if (!STRIPPED_HEADERS.has(key.toLowerCase())) {
      headers.set(key, value);
    }
  });

  const method = req.method;
  let body: ArrayBuffer | undefined = undefined;
  
  if (method !== "GET" && method !== "HEAD") {
    try {
      body = await req.arrayBuffer();
    } catch {
      body = undefined;
    }
  }

  // Set 30-second timeout for proxy requests
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000);

  try {
    const response = await fetch(backendUrl, {
      method,
      headers,
      body,
      signal: controller.signal,
      // @ts-ignore
      duplex: 'half'
    });
    clearTimeout(timeoutId);

    const resHeaders = new Headers();
    response.headers.forEach((value, key) => {
      if (!STRIPPED_HEADERS.has(key.toLowerCase())) {
        resHeaders.set(key, value);
      }
    });

    const resBody = await response.arrayBuffer();
    return new NextResponse(resBody, {
      status: response.status,
      headers: resHeaders
    });
  } catch (error: unknown) {
    clearTimeout(timeoutId);
    const isAbort = error instanceof Error && error.name === "AbortError";
    const errMessage = isAbort ? "Backend request timed out (30s)" : (error instanceof Error ? error.message : "Proxy connection failed");
    console.error("Backend Gateway Proxy error:", errMessage);
    return NextResponse.json({ detail: errMessage }, { status: isAbort ? 504 : 502 });
  }
}

export const GET = handleProxy;
export const POST = handleProxy;
export const PUT = handleProxy;
export const DELETE = handleProxy;
export const OPTIONS = handleProxy;
export const PATCH = handleProxy;
