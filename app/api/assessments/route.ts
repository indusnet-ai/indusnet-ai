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

  const {
    domain,
    businessStyle,
    businessContext,
    customerProblem,
    aiObjectives,
    dataProfile,
    dataSize,
    contactName,
    contactEmail,
    contactCompany,
    contactRole,
  } = body || {};

  if (!domain || !businessStyle || !customerProblem || !contactName || !contactEmail) {
    return NextResponse.json(
      { error: "Missing required assessment parameters (domain, style, problem, name, email)." },
      { status: 400 }
    );
  }

  let dbSuccess = false;
  let dbError: any = null;

  // 1. Attempt PostgreSQL insert
  try {
    await query(
      `INSERT INTO public.assessments (
        domain, business_style, business_context, customer_problem,
        ai_objectives, data_profile, data_size, contact_name,
        contact_email, contact_company, contact_role
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING id`,
      [
        domain,
        businessStyle,
        businessContext || "",
        customerProblem,
        aiObjectives || [],
        dataProfile || [],
        dataSize || "Under 1,000 records",
        contactName,
        contactEmail,
        contactCompany || "",
        contactRole || "",
      ]
    );
    dbSuccess = true;
  } catch (err: any) {
    dbError = err;
    console.error("Assessments database insert failed. Executing fallback path...", {
      error: err.message,
      payload: body,
    });
  }

  // 2. Dispatch Transactional Notification to Management (info@indusnet-ai.com)
  const emailSubject = `${!dbSuccess ? "[DB Fallback] " : ""}🚀 CPMAI AI Scoping Sheet: ${
    contactCompany || contactName
  }`;
  const emailHtml = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 12px; color: #222; line-height: 1.6;">
      <div style="text-align: center; margin-bottom: 25px; border-bottom: 2px solid #1677FF; padding-bottom: 15px;">
        <h2 style="color: #1677FF; margin: 0; font-size: 22px; font-weight: 800; letter-spacing: -0.5px;">INDUSNET AI</h2>
        <p style="margin: 5px 0 0 0; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #666; font-weight: 700;">Cognitive AI Project Scoping Assessment</p>
      </div>

      ${
        !dbSuccess
          ? `<div style="background: #fef2f2; border: 1px solid #f87171; padding: 12px; border-radius: 8px; margin-bottom: 20px; color: #991b1b; font-size: 12px;">
              <strong>⚠️ DATABASE WRITE FAILED:</strong> Assessment preserved via email fallback. Reason: ${dbError?.message || "Unknown database error"}.
            </div>`
          : ""
      }

      <div style="margin-bottom: 20px;">
        <h3 style="color: #111; border-left: 3px solid #1677FF; padding-left: 10px; font-size: 15px; margin-bottom: 12px;">1. Client Credentials</h3>
        <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
          <tr>
            <td style="width: 35%; font-weight: 600; padding: 6px 0; color: #555;">Name:</td>
            <td style="padding: 6px 0; font-weight: 700; color: #000;">${contactName}</td>
          </tr>
          <tr>
            <td style="font-weight: 600; padding: 6px 0; color: #555;">Email:</td>
            <td style="padding: 6px 0; color: #1677FF; font-weight: 700;"><a href="mailto:${contactEmail}">${contactEmail}</a></td>
          </tr>
          <tr>
            <td style="font-weight: 600; padding: 6px 0; color: #555;">Company:</td>
            <td style="padding: 6px 0; color: #000;">${contactCompany || "N/A"}</td>
          </tr>
          <tr>
            <td style="font-weight: 600; padding: 6px 0; color: #555;">Designation / Role:</td>
            <td style="padding: 6px 0; color: #000;">${contactRole || "N/A"}</td>
          </tr>
        </table>
      </div>

      <div style="margin-bottom: 20px; background-color: #f9f9f9; padding: 15px; border-radius: 8px;">
        <h3 style="color: #111; border-left: 3px solid #1677FF; padding-left: 10px; font-size: 15px; margin: 0 0 12px 0;">2. Business & Scoping Profile</h3>
        <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
          <tr>
            <td style="width: 35%; font-weight: 600; padding: 6px 0; color: #555;">Vertical Domain:</td>
            <td style="padding: 6px 0; font-weight: 700; color: #000;">${domain}</td>
          </tr>
          <tr>
            <td style="font-weight: 600; padding: 6px 0; color: #555;">Operational Style:</td>
            <td style="padding: 6px 0; font-weight: 700; color: #000;">${businessStyle}</td>
          </tr>
        </table>
        ${
          businessContext
            ? `<div style="margin-top: 10px; padding-top: 10px; border-top: 1px solid #eaeaea; font-size: 12px; color: #444;">
                <strong style="color: #000;">Operational Context:</strong>
                <p style="margin: 5px 0 0 0; font-style: italic; white-space: pre-wrap;">"${businessContext}"</p>
              </div>`
            : ""
        }
      </div>

      <div style="margin-bottom: 20px; background-color: #f0f7ff; border: 1px solid #bfdbfe; padding: 15px; border-radius: 8px;">
        <h3 style="color: #1e40af; margin: 0 0 8px 0; font-size: 14px; font-weight: 700;">3. Problem Statement & Bottleneck</h3>
        <p style="margin: 0; font-size: 13px; color: #1e3a8a; white-space: pre-wrap;">"${customerProblem}"</p>
      </div>

      <div style="margin-bottom: 20px; background-color: #f9f9f9; padding: 15px; border-radius: 8px;">
        <h3 style="color: #111; border-left: 3px solid #1677FF; padding-left: 10px; font-size: 15px; margin: 0 0 12px 0;">4. AI Objectives & Data Profile</h3>
        <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
          <tr>
            <td style="width: 35%; font-weight: 600; padding: 6px 0; color: #555;">Objectives:</td>
            <td style="padding: 6px 0; font-weight: 600; color: #000;">${
              Array.isArray(aiObjectives) && aiObjectives.length > 0 ? aiObjectives.join(", ") : "Standard AI POC"
            }</td>
          </tr>
          <tr>
            <td style="font-weight: 600; padding: 6px 0; color: #555;">Data Types:</td>
            <td style="padding: 6px 0; color: #000;">${
              Array.isArray(dataProfile) && dataProfile.length > 0 ? dataProfile.join(", ") : "Unspecified"
            }</td>
          </tr>
          <tr>
            <td style="font-weight: 600; padding: 6px 0; color: #555;">POC Scale:</td>
            <td style="padding: 6px 0; color: #1677FF; font-weight: 700;">${dataSize}</td>
          </tr>
        </table>
      </div>

      <div style="text-align: center; font-size: 11px; color: #888; border-top: 1px solid #eaeaea; padding-top: 15px; margin-top: 25px;">
        <p>Sent automatically from the Indusnet AI CPMAI Scoping Assistant.</p>
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

  // 4. Autoresponder to user
  await sendAutoresponder(
    contactEmail,
    contactName,
    `your CPMAI Project Scoping Assessment (${domain} domain)`
  );

  // 5. Response
  if (!dbSuccess) {
    console.error("[CRITICAL_ASSESSMENT_BACKUP] AI Scoping submission:", JSON.stringify({
      timestamp: new Date().toISOString(),
      payload: body,
      dbError: dbError?.message,
      emailError: notificationResult.error,
    }));

    if (notificationResult.success) {
      return NextResponse.json(
        {
          success: true,
          message: "AI Scoping Sheet received successfully! A solutions architect will reply within one business day.",
          receivedByEmail: true,
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error:
          "Our automated systems are temporarily unable to process this scoping sheet. Please email your project details directly to info@indusnet-ai.com, and our team will respond within one business day.",
      },
      { status: 503 }
    );
  }

  return NextResponse.json(
    {
      success: true,
      message: "AI Scoping Sheet received successfully! A solutions architect will reply within one business day.",
    },
    { status: 200 }
  );
}
