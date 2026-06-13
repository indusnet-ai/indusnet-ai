import { NextResponse } from "next/server";
import { jwks } from "@/lib/security/jwks";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(jwks, {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
