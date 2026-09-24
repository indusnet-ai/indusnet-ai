import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET() {
  const dbUrl = process.env.DATABASE_URL;
  const resendKey = process.env.RESEND_API_KEY;

  let dbStatus = "not_tested";
  let dbError: string | null = null;
  let tables: string[] = [];

  if (!dbUrl) {
    dbStatus = "missing_DATABASE_URL";
  } else {
    try {
      await query("SELECT 1");
      dbStatus = "connected";
      const tableRows = await query(
        "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'"
      );
      tables = tableRows.map((r: any) => r.table_name);
    } catch (err: any) {
      dbStatus = "error";
      dbError = err.message || "Database connection error";
    }
  }

  let resendStatus = "not_tested";
  let resendError: string | null = null;
  if (!resendKey) {
    resendStatus = "missing_RESEND_API_KEY";
  } else if (resendKey.includes("your-resend-api-key") || resendKey === "placeholder") {
    resendStatus = "placeholder_key";
  } else {
    try {
      const res = await fetch("https://api.resend.com/api-keys", {
        headers: { Authorization: `Bearer ${resendKey}` },
      });
      if (res.ok) {
        resendStatus = "valid_key";
      } else {
        const data = await res.json().catch(() => ({}));
        resendStatus = "api_error";
        resendError = data.message || `HTTP ${res.status}`;
      }
    } catch (err: any) {
      resendStatus = "network_error";
      resendError = err.message || "Resend connection error";
    }
  }

  return NextResponse.json({
    timestamp: new Date().toISOString(),
    database: {
      status: dbStatus,
      configured: Boolean(dbUrl),
      error: dbError ? "Database connection error" : null,
      tablesCount: tables.length,
    },
    resend: {
      status: resendStatus,
      configured: Boolean(resendKey),
      error: resendError ? "Email service connection error" : null,
    },
    careersMode: process.env.NEXT_PUBLIC_CAREERS_MODE || "static",
    showTestimonials: process.env.NEXT_PUBLIC_SHOW_TESTIMONIALS || "false",
  });
}
