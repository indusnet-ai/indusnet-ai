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
    const isBooking = !message;

    if (message) {
      // If a message is provided, it is a custom project lead
      insertResult = await supabase
        .from("leads")
        .insert([{ name, email, company, message }]);
    } else {
      // Otherwise, it is a scheduled calendar call booking
      insertResult = await supabase
        .from("consultations")
        .insert([{ 
          name, 
          email, 
          company, 
          service: service || "General AI Strategy", 
          booking_date: bookingDate || "Tomorrow" 
        }]);
    }

    const { error: dbError } = insertResult;
    if (dbError) {
      console.warn("Supabase insert warning in consultations API:", dbError.message);
    }

    // Prepare Email details
    const emailSubject = isBooking 
      ? `🗓️ Call Scheduled: ${name} (${company || "Individual"})`
      : `✉️ Project Inquiry: ${name} (${company || "Individual"})`;

    const emailHtml = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 12px; color: #222; line-height: 1.6;">
        <div style="text-align: center; margin-bottom: 25px; border-bottom: 2px solid #7c3aed; padding-bottom: 15px;">
          <h2 style="color: #7c3aed; margin: 0; font-size: 22px; font-weight: 800; letter-spacing: -0.5px;">INDUSNET AI</h2>
          <p style="margin: 5px 0 0 0; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #666; font-weight: 700;">
            ${isBooking ? "New Scheduled Meeting Request" : "New Contact Inquiry Message"}
          </p>
        </div>

        <div style="margin-bottom: 20px;">
          <h3 style="color: #111; border-left: 3px solid #06b6d4; padding-left: 10px; font-size: 15px; margin-bottom: 12px;">Client Details</h3>
          <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
            <tr>
              <td style="width: 35%; font-weight: 600; padding: 6px 0; color: #555;">Name:</td>
              <td style="padding: 6px 0; font-weight: 700; color: #000;">${name}</td>
            </tr>
            <tr>
              <td style="font-weight: 600; padding: 6px 0; color: #555;">Email:</td>
              <td style="padding: 6px 0; color: #7c3aed; font-weight: 700;">${email}</td>
            </tr>
            <tr>
              <td style="font-weight: 600; padding: 6px 0; color: #555;">Company:</td>
              <td style="padding: 6px 0; color: #000;">${company || "N/A"}</td>
            </tr>
            ${!isBooking ? `
            <tr>
              <td style="font-weight: 600; padding: 6px 0; color: #555;">Core Interest:</td>
              <td style="padding: 6px 0; color: #000; font-weight: 600;">${service || "General"}</td>
            </tr>` : ""}
          </table>
        </div>

        ${isBooking ? `
        <div style="margin-bottom: 20px; background-color: #f0fdf4; border: 1px solid #bbf7d0; padding: 15px; border-radius: 8px;">
          <h3 style="color: #15803d; margin: 0 0 8px 0; font-size: 14px; font-weight: 700;">🗓️ Meeting Details</h3>
          <p style="margin: 0; font-size: 13px; color: #166534;">
            <strong>Scheduled Slot:</strong> ${bookingDate}
          </p>
          <p style="margin: 5px 0 0 0; font-size: 11px; color: #15803d;">
            * A meeting invite will be auto-generated for Google Meet.
          </p>
        </div>
        ` : `
        <div style="margin-bottom: 20px; background-color: #f9f9f9; padding: 15px; border-radius: 8px; border: 1px solid #eaeaea;">
          <h3 style="color: #111; margin: 0 0 8px 0; font-size: 14px; font-weight: 700;">✉️ Message Body</h3>
          <p style="margin: 0; font-size: 13px; color: #333; white-space: pre-wrap; font-style: italic;">
            "${message}"
          </p>
        </div>
        `}

        <div style="text-align: center; font-size: 11px; color: #888; border-top: 1px solid #eaeaea; padding-top: 15px; margin-top: 25px;">
          <p>Sent automatically from the Indusnet AI Contact portal.</p>
          <p>© ${new Date().getFullYear()} Indusnet Technologies Ltd. All rights reserved.</p>
        </div>
      </div>
    `;

    // Trigger Resend integration
    if (process.env.RESEND_API_KEY) {
      try {
        const mailResponse = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "Indusnet AI Portal <onboarding@resend.dev>",
            to: "info@indusnet-ai.com",
            subject: emailSubject,
            html: emailHtml,
          }),
        });

        if (!mailResponse.ok) {
          const mailErr = await mailResponse.json().catch(() => ({}));
          console.error("Resend API booking warning:", mailErr);
        } else {
          console.log(`Booking email notification sent successfully to info@indusnet-ai.com`);
        }
      } catch (mailErr) {
        console.error("Failed to transmit booking email notification:", mailErr);
      }
    } else {
      console.log("\n=================== DIAGNOSTIC EMAIL PREVIEW ===================");
      console.log(`To: info@indusnet-ai.com`);
      console.log(`Subject: ${emailSubject}`);
      console.log("HTML Body Preview (Text Only):");
      console.log(emailHtml.replace(/<[^>]*>/g, "").trim().substring(0, 500) + "\n...");
      console.log("================================================================\n");
    }

    return NextResponse.json(
      { success: true, message: "Details logged successfully!" },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("Consultation API route error:", err);

    // Fallback simulation mode
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder-url-for-build")) {
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
