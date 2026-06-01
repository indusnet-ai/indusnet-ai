import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    if (!email) {
      return NextResponse.json({ error: "Email address is required." }, { status: 400 });
    }

    // Attempt to write to Supabase
    const { error } = await supabase.from("newsletter").insert([{ email, status: "active" }]);
    
    if (error) {
      // Postgres error 23505 stands for unique_violation (already subscribed)
      if (error.code === "23505") {
        return NextResponse.json(
          { success: true, message: "Welcome back! You are already subscribed." },
          { status: 200 }
        );
      }
      throw error;
    }

    return NextResponse.json(
      { success: true, message: "Subscribed successfully!" },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("Newsletter API route error:", err);
    
    // In case credentials are not filled yet, run in graceful simulation mode
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      return NextResponse.json(
        { success: true, message: "Simulation Mode: Subscribed successfully!" },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { error: err.message || "An internal error occurred. Please try again." },
      { status: 500 }
    );
  }
}
