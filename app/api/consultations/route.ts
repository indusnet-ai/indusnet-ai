import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, company, service, message, bookingDate } = body;

    if (!name || !email) {
      return NextResponse.json({ error: "Name and email are required." }, { status: 400 });
    }

    let insertResult;

    if (message) {
      // If a message is provided, it is a custom project lead
      insertResult = await supabase
        .from("leads")
        .insert([{ name, email, company, message }]);
    } else {
      // Otherwise, it is a scheduled calendar call booking
      insertResult = await supabase
        .from("consultations")
        .insert([{ name, email, company, service, booking_date: bookingDate || "Tomorrow" }]);
    }

    const { error } = insertResult;
    if (error) throw error;

    return NextResponse.json(
      { success: true, message: "Details logged successfully!" },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("Consultation API route error:", err);

    // Run in graceful simulation mode if credentials are not yet populated in .env.local
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      return NextResponse.json(
        { success: true, message: "Simulation Mode: Details logged successfully!" },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { error: err.message || "An internal error occurred. Please try again." },
      { status: 500 }
    );
  }
}
