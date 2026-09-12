import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_INTERNAL_URL || process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

type RouteParams = {
  params: Promise<{
    path: string[];
  }>;
};

async function handleProxy(req: NextRequest, { params }: RouteParams) {
  const resolvedParams = await params;
  const path = resolvedParams.path.join("/");
  
  const url = new URL(req.url);
  const searchParams = url.search;
  
  // Forward to FastAPI backend (mapping /api/backend/* to backend /*)
  const backendUrl = `${BACKEND_URL}/${path}${searchParams}`;
  
  // Forward request headers
  const headers = new Headers();
  req.headers.forEach((value, key) => {
    if (key.toLowerCase() !== "host") {
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

  try {
    const response = await fetch(backendUrl, {
      method,
      headers,
      body,
      // @ts-ignore
      duplex: 'half'
    });

    const resHeaders = new Headers();
    response.headers.forEach((value, key) => {
      // Omit transfer-encoding to avoid HTTP chunking conflicts
      if (key.toLowerCase() !== "transfer-encoding") {
        resHeaders.set(key, value);
      }
    });

    const resBody = await response.arrayBuffer();
    return new NextResponse(resBody, {
      status: response.status,
      headers: resHeaders
    });
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Proxy connection failed";
    console.error("Backend Gateway Proxy error:", errMessage);
    return NextResponse.json({ detail: errMessage }, { status: 502 });
  }
}

export const GET = handleProxy;
export const POST = handleProxy;
export const PUT = handleProxy;
export const DELETE = handleProxy;
export const OPTIONS = handleProxy;
export const PATCH = handleProxy;
