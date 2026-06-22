import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

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
  
  // Forward to FastAPI backend (mapping /api/hr/* to backend /hr/*)
  const backendUrl = `${BACKEND_URL}/hr/${path}${searchParams}`;
  
  // Forward request headers
  const headers = new Headers();
  req.headers.forEach((value, key) => {
    if (key.toLowerCase() !== "host") {
      headers.set(key, value);
    }
  });

  const method = req.method;
  let body: any = undefined;
  
  if (method !== "GET" && method !== "HEAD") {
    try {
      body = await req.arrayBuffer();
    } catch (e) {
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
      resHeaders.set(key, value);
    });

    const resBody = await response.arrayBuffer();
    return new NextResponse(resBody, {
      status: response.status,
      headers: resHeaders
    });
  } catch (error: any) {
    console.error("Proxy error:", error);
    return NextResponse.json({ detail: error.message || "Proxy connection failed" }, { status: 502 });
  }
}

export const GET = handleProxy;
export const POST = handleProxy;
export const PUT = handleProxy;
export const DELETE = handleProxy;
export const OPTIONS = handleProxy;
export const PATCH = handleProxy;
