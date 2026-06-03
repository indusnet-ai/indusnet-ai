import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    if (!email) {
      return NextResponse.json({ error: "Email address is required." }, { status: 400 });
    }

    // 1. Attempt to write to Supabase
    const { error: dbError } = await supabase
      .from("newsletter")
      .insert([{ email, status: "active" }]);
    
    if (dbError) {
      // Postgres error 23505 stands for unique_violation (already subscribed)
      if (dbError.code === "23505") {
        return NextResponse.json(
          { success: true, message: "Welcome back! You are already subscribed." },
          { status: 200 }
        );
      }
      console.warn("Supabase newsletter insert error (falling back to simulation):", dbError.message);
    }

    // 2. Format HTML Email Notification
    const emailSubject = `✉️ New Newsletter Subscriber: ${email}`;
    const emailHtml = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 12px; color: #222; line-height: 1.6;">
        <div style="text-align: center; margin-bottom: 25px; border-bottom: 2px solid #7c3aed; padding-bottom: 15px;">
          <h2 style="color: #7c3aed; margin: 0; font-size: 22px; font-weight: 800; letter-spacing: -0.5px;">INDUSNET AI</h2>
          <p style="margin: 5px 0 0 0; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #666; font-weight: 700;">Newsletter Insight Network</p>
        </div>

        <div style="margin-bottom: 20px; background-color: #f5f3ff; border: 1px solid #ddd6fe; padding: 15px; border-radius: 8px; text-align: center;">
          <h3 style="color: #6d28d9; margin: 0 0 5px 0; font-size: 14px; font-weight: 700;">🎉 New Subscriber Registered</h3>
          <p style="margin: 0; font-size: 16px; color: #4c1d95; font-weight: bold;">
            ${email}
          </p>
        </div>

        <div style="text-align: center; font-size: 11px; color: #888; border-top: 1px solid #eaeaea; padding-top: 15px; margin-top: 25px;">
          <p>Sent automatically from the Indusnet AI Subscription daemon.</p>
          <p>© ${new Date().getFullYear()} Indusnet Technologies Ltd. All rights reserved.</p>
        </div>
      </div>
    `;

    // 3. Trigger Resend notification email
    if (process.env.RESEND_API_KEY) {
      try {
        const mailResponse = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "Indusnet AI Newsletter <onboarding@resend.dev>",
            to: "info@indusnet-ai.com",
            subject: emailSubject,
            html: emailHtml,
          }),
        });

        if (!mailResponse.ok) {
          const mailErr = await mailResponse.json().catch(() => ({}));
          console.error("Resend API newsletter registration warning:", mailErr);
        } else {
          console.log(`Newsletter subscription alert sent successfully for: ${email}`);
        }
      } catch (mailErr) {
        console.error("Failed to transmit newsletter subscription email:", mailErr);
      }
    } else {
      console.log("\n=================== DIAGNOSTIC EMAIL PREVIEW ===================");
      console.log(`To: info@indusnet-ai.com`);
      console.log(`Subject: ${emailSubject}`);
      console.log("HTML Body Preview (Text Only):");
      console.log(emailHtml.replace(/<[^>]*>/g, "").trim().substring(0, 300) + "\n...");
      console.log("================================================================\n");
    }

    return NextResponse.json(
      { success: true, message: "Subscribed successfully!" },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("Newsletter API route error:", err);
    
    // In case credentials are not filled yet, run in graceful simulation mode
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder-url-for-build")) {
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
