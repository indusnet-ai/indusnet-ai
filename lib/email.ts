interface EmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  from?: string;
  replyTo?: string;
}

export async function sendEmail({
  to,
  subject,
  html,
  from = "Indusnet AI <hello@indusnet-ai.com>",
  replyTo = "info@indusnet-ai.com",
}: EmailOptions): Promise<{ success: boolean; id?: string; error?: string; simulated?: boolean }> {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey || apiKey.includes("your-resend-api-key") || apiKey === "placeholder") {
    console.log("\n=================== RESEND NOT CONFIGURED / DEV PREVIEW ===================");
    console.log(`From: ${from}`);
    console.log(`To: ${Array.isArray(to) ? to.join(", ") : to}`);
    console.log(`Subject: ${subject}`);
    console.log("Body snippet:");
    console.log(html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim().substring(0, 300) + "...");
    console.log("===========================================================================\n");
    return { success: true, simulated: true };
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: Array.isArray(to) ? to : [to],
        reply_to: replyTo,
        subject,
        html,
      }),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      console.error("Resend API delivery error:", data);

      // If custom domain is not verified yet, attempt delivery via onboarding@resend.dev
      if (
        from.includes("@indusnet-ai.com") &&
        (data.message?.toLowerCase().includes("domain") || data.message?.toLowerCase().includes("verify"))
      ) {
        try {
          const retryRes = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${apiKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              from: "Indusnet AI <onboarding@resend.dev>",
              to: Array.isArray(to) ? to : [to],
              reply_to: replyTo,
              subject,
              html,
            }),
          });
          const retryData = await retryRes.json().catch(() => ({}));
          if (retryRes.ok) {
            return { success: true, id: retryData.id };
          }
        } catch {
          // ignore retry network errors and return original error
        }
      }

      return { success: false, error: data.message || "Failed to send email via Resend" };
    }

    return { success: true, id: data.id };
  } catch (err: any) {
    console.error("Failed to connect to Resend API:", err);
    return { success: false, error: err.message || "Network error sending email" };
  }
}

export async function sendAutoresponder(
  recipientEmail: string,
  recipientName: string,
  topic: string = "your enquiry"
): Promise<{ success: boolean; simulated?: boolean; error?: string }> {
  const subject = "We received your enquiry — Indusnet AI";
  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #eaeaea; border-radius: 12px; color: #1f2937; line-height: 1.6;">
      <div style="margin-bottom: 24px; border-bottom: 2px solid #1677FF; padding-bottom: 16px;">
        <h2 style="color: #1677FF; margin: 0; font-size: 20px; font-weight: 800; letter-spacing: -0.5px;">INDUSNET AI</h2>
        <p style="margin: 4px 0 0 0; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #6b7280; font-weight: 600;">Enterprise Cognitive Orchestration</p>
      </div>
      
      <p style="font-size: 14px; margin-bottom: 16px;">Hello <strong>${recipientName}</strong>,</p>
      
      <p style="font-size: 14px; margin-bottom: 16px;">
        Thank you for contacting Indusnet AI regarding <strong>${topic}</strong>. We have successfully received your submission.
      </p>
      
      <div style="background-color: #f9fafb; border-left: 4px solid #1677FF; padding: 12px 16px; margin: 20px 0; border-radius: 4px;">
        <p style="margin: 0; font-size: 13px; color: #374151;">
          <strong>Our Commitment:</strong> A senior member of our solutions engineering team will review your requirements and respond within <strong>one business day</strong>.
        </p>
      </div>
      
      <p style="font-size: 13px; color: #4b5563; margin-bottom: 24px;">
        If you have urgent queries or architectural specifications to share ahead of time, feel free to reply directly to this email or reach us at <a href="mailto:info@indusnet-ai.com" style="color: #1677FF; text-decoration: none;">info@indusnet-ai.com</a>.
      </p>
      
      <div style="border-top: 1px solid #eaeaea; padding-top: 16px; margin-top: 24px; font-size: 12px; color: #9ca3af;">
        <p style="margin: 0 0 4px 0; font-weight: 600; color: #4b5563;">Indusnet AI Solutions Engineering</p>
        <p style="margin: 0;">Chennai HQ: Number 46 First Floor, Tansi Nagar, Velachery, Chennai 600042</p>
        <p style="margin: 0;">Singapore: 51 Ubi Ave 1, #05-16 Paya Ubi Industrial Park, SG 408933</p>
      </div>
    </div>
  `;

  return sendEmail({
    to: recipientEmail,
    subject,
    html,
    from: "Indusnet AI <hello@indusnet-ai.com>",
    replyTo: "info@indusnet-ai.com",
  });
}
