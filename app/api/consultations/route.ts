import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { sendEmail, sendAutoresponder } from "@/lib/email";

export async function POST(request: Request) {
  let body: any;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body provided." }, { status: 400 });
  }

  const { name, email, company, service, message, bookingDate } = body || {};

  if (!name || !email) {
    return NextResponse.json({ error: "Name and email are required." }, { status: 400 });
  }

  const isBooking = !message;
  let dbSuccess = false;
  let dbError: any = null;

  // 1. Attempt database insertion
  try {
    if (message) {
      // General inquiry lead
      await query(
        `INSERT INTO public.leads (name, email, company, message)
         VALUES ($1, $2, $3, $4)
         RETURNING id`,
        [name, email, company || null, message]
      );
    } else {
      // Scheduled consultation booking
      await query(
        `INSERT INTO public.consultations (name, email, company, service, booking_date)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING id`,
        [
          name,
          email,
          company || null,
          service || "General AI Strategy",
          bookingDate || "Tomorrow",
        ]
      );
    }
    dbSuccess = true;
  } catch (err: any) {
    dbError = err;
    console.error("Consultation database insert failed. Activating email fallback path...", {
      error: err.message,
      payload: { name, email, company, service, message, bookingDate },
    });
  }

  // 2. Prepare Internal Notification Email
  const emailSubject = `${!dbSuccess ? "[DB Fallback] " : ""}${
    isBooking
      ? `🗓️ Call Scheduled: ${name} (${company || "Individual"})`
      : `✉️ Project Inquiry: ${name} (${company || "Individual"})`
  }`;

  const emailHtml = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 12px; color: #222; line-height: 1.6;">
      <div style="text-align: center; margin-bottom: 25px; border-bottom: 2px solid #ff2d21; padding-bottom: 15px;">
        <h2 style="color: #ff2d21; margin: 0; font-size: 22px; font-weight: 800; letter-spacing: -0.5px;">INDUSNET AI</h2>
        <p style="margin: 5px 0 0 0; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #666; font-weight: 700;">
          ${isBooking ? "New Scheduled Meeting Request" : "New Contact Inquiry Message"}
        </p>
      </div>

      ${
        !dbSuccess
          ? `<div style="background: #fef2f2; border: 1px solid #f87171; padding: 12px; border-radius: 8px; margin-bottom: 20px; color: #991b1b; font-size: 12px;">
              <strong>⚠️ DATABASE WRITE FAILED:</strong> This lead was preserved via email fallback. Reason: ${dbError?.message || "Unknown database error"}.
            </div>`
          : ""
      }

      <div style="margin-bottom: 20px;">
        <h3 style="color: #111; border-left: 3px solid #ff2d21; padding-left: 10px; font-size: 15px; margin-bottom: 12px;">Client Details</h3>
        <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
          <tr>
            <td style="width: 35%; font-weight: 600; padding: 6px 0; color: #555;">Name:</td>
            <td style="padding: 6px 0; font-weight: 700; color: #000;">${name}</td>
          </tr>
          <tr>
            <td style="font-weight: 600; padding: 6px 0; color: #555;">Email:</td>
            <td style="padding: 6px 0; color: #ff2d21; font-weight: 700;"><a href="mailto:${email}">${email}</a></td>
          </tr>
          <tr>
            <td style="font-weight: 600; padding: 6px 0; color: #555;">Company:</td>
            <td style="padding: 6px 0; color: #000;">${company || "N/A"}</td>
          </tr>
          ${
            !isBooking
              ? `<tr>
                  <td style="font-weight: 600; padding: 6px 0; color: #555;">Core Interest:</td>
                  <td style="padding: 6px 0; color: #000; font-weight: 600;">${service || "General AI Consulting"}</td>
                </tr>`
              : ""
          }
        </table>
      </div>

      ${
        isBooking
          ? `<div style="margin-bottom: 20px; background-color: #f0fdf4; border: 1px solid #bbf7d0; padding: 15px; border-radius: 8px;">
              <h3 style="color: #15803d; margin: 0 0 8px 0; font-size: 14px; font-weight: 700;">🗓️ Meeting Details</h3>
              <p style="margin: 0; font-size: 13px; color: #166534;">
                <strong>Scheduled Slot:</strong> ${bookingDate}
              </p>
            </div>`
          : `<div style="margin-bottom: 20px; background-color: #f9f9f9; padding: 15px; border-radius: 8px; border: 1px solid #eaeaea;">
              <h3 style="color: #111; margin: 0 0 8px 0; font-size: 14px; font-weight: 700;">✉️ Message Body</h3>
              <p style="margin: 0; font-size: 13px; color: #333; white-space: pre-wrap; font-style: italic;">
                "${message}"
              </p>
            </div>`
      }

      <div style="text-align: center; font-size: 11px; color: #888; border-top: 1px solid #eaeaea; padding-top: 15px; margin-top: 25px;">
        <p>Sent automatically from the Indusnet AI Contact Portal.</p>
        <p>© ${new Date().getFullYear()} Indusnet Technologies Ltd. All rights reserved.</p>
      </div>
    </div>
  `;

  // 3. Send internal notification email
  const notificationResult = await sendEmail({
    to: "info@indusnet-ai.com",
    subject: emailSubject,
    html: emailHtml,
  });

  // 4. Send autoresponder to visitor
  await sendAutoresponder(
    email,
    name,
    isBooking ? `scheduled meeting on ${bookingDate}` : (service || "enterprise AI solutions")
  );

  // 5. Response Handling
  if (!dbSuccess) {
    if (notificationResult.success) {
      return NextResponse.json(
        {
          success: true,
          message: isBooking
            ? "Consultation scheduled successfully! A calendar invitation will be confirmed within one business day."
            : "Thank you! Your enquiry has been received. We will reply within one business day.",
          receivedByEmail: true,
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        {
          error: "Failed to store enquiry. Please contact us directly at info@indusnet-ai.com.",
        },
        { status: 500 }
      );
    }
  }

  return NextResponse.json(
    {
      success: true,
      message: isBooking
        ? "Consultation scheduled successfully! A calendar invitation will be confirmed within one business day."
        : "Thank you! Your enquiry has been received. We will reply within one business day.",
    },
    { status: 200 }
  );
}
