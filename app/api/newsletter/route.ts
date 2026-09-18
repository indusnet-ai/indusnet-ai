import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { sendEmail, sendAutoresponder } from "@/lib/email";

export async function POST(request: Request) {
  let email: string;
  try {
    const body = await request.json();
    email = body?.email?.trim();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body provided." }, { status: 400 });
  }

  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "A valid email address is required." }, { status: 400 });
  }

  let dbSuccess = false;
  let dbError: any = null;
  let isDuplicate = false;

  // 1. Attempt PostgreSQL insert
  try {
    const rows = await query(
      `INSERT INTO public.newsletter (email, status)
       VALUES ($1, 'active')
       ON CONFLICT (email) DO NOTHING
       RETURNING id`,
      [email.toLowerCase()]
    );

    if (rows.length === 0) {
      isDuplicate = true;
    }
    dbSuccess = true;
  } catch (err: any) {
    if (err.code === "23505") {
      isDuplicate = true;
      dbSuccess = true;
    } else {
      dbError = err;
      console.error("Newsletter database insert failed. Executing fallback path...", {
        error: err.message,
        email,
      });
    }
  }

  if (isDuplicate) {
    return NextResponse.json(
      { success: true, message: "Welcome back! You are already subscribed to our newsletter." },
      { status: 200 }
    );
  }

  // 2. Format HTML Notification Email
  const emailSubject = `${!dbSuccess ? "[DB Fallback] " : ""}✉️ New Newsletter Subscriber: ${email}`;
  const emailHtml = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 12px; color: #222; line-height: 1.6;">
      <div style="text-align: center; margin-bottom: 25px; border-bottom: 2px solid #ff2d21; padding-bottom: 15px;">
        <h2 style="color: #ff2d21; margin: 0; font-size: 22px; font-weight: 800; letter-spacing: -0.5px;">INDUSNET AI</h2>
        <p style="margin: 5px 0 0 0; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #666; font-weight: 700;">Newsletter Insight Network</p>
      </div>

      ${
        !dbSuccess
          ? `<div style="background: #fef2f2; border: 1px solid #f87171; padding: 12px; border-radius: 8px; margin-bottom: 20px; color: #991b1b; font-size: 12px;">
              <strong>⚠️ DATABASE WRITE FAILED:</strong> Subscriber email preserved via notification email. Reason: ${dbError?.message || "Unknown database error"}.
            </div>`
          : ""
      }

      <div style="margin-bottom: 20px; background-color: #fef2f2; border: 1px solid #fecaca; padding: 15px; border-radius: 8px; text-align: center;">
        <h3 style="color: #b91c1c; margin: 0 0 5px 0; font-size: 14px; font-weight: 700;">🎉 New Subscriber Registered</h3>
        <p style="margin: 0; font-size: 16px; color: #7f1d1d; font-weight: bold;">
          <a href="mailto:${email}" style="color: #7f1d1d; text-decoration: none;">${email}</a>
        </p>
      </div>

      <div style="text-align: center; font-size: 11px; color: #888; border-top: 1px solid #eaeaea; padding-top: 15px; margin-top: 25px;">
        <p>Sent automatically from the Indusnet AI Subscription daemon.</p>
        <p>© ${new Date().getFullYear()} Indusnet Technologies Ltd. All rights reserved.</p>
      </div>
    </div>
  `;

  // 3. Dispatch internal notification
  const notificationResult = await sendEmail({
    to: "info@indusnet-ai.com",
    subject: emailSubject,
    html: emailHtml,
  });

  // 4. Dispatch autoresponder to subscriber
  await sendAutoresponder(
    email,
    "Subscriber",
    "subscription to the Indusnet AI Research and Insights digest"
  );

  // 5. Response
  if (!dbSuccess) {
    console.error("[CRITICAL_SUBSCRIBER_BACKUP] Newsletter subscription:", JSON.stringify({
      timestamp: new Date().toISOString(),
      email,
      dbError: dbError?.message,
      emailError: notificationResult.error,
    }));

    return NextResponse.json(
      {
        success: true,
        message: "Thank you for subscribing to our AI Insights newsletter!",
        receivedByEmail: notificationResult.success,
      },
      { status: 200 }
    );
  }

  return NextResponse.json(
    { success: true, message: "Thank you for subscribing to our AI Insights newsletter!" },
    { status: 200 }
  );
}
