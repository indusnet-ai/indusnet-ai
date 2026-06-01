import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const body = await request.json();
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
      contactRole 
    } = body;

    // Validate essential fields
    if (!domain || !businessStyle || !customerProblem || !contactName || !contactEmail) {
      return NextResponse.json({ error: "Missing required assessment parameters." }, { status: 400 });
    }

    const { error } = await supabase
      .from("assessments")
      .insert([{ 
        domain, 
        business_style: businessStyle, 
        business_context: businessContext || "", 
        customer_problem: customerProblem, 
        ai_objectives: aiObjectives || [], 
        data_profile: dataProfile || [], 
        data_size: dataSize || "Under 1,000 records", 
        contact_name: contactName, 
        contact_email: contactEmail, 
        contact_company: contactCompany || "", 
        contact_role: contactRole || "" 
      }]);

    if (error) throw error;

    return NextResponse.json(
      { success: true, message: "Cognitive CPMAI Project Assessment successfully logged!" },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("Assessments API Route Error:", err);

    // Simulation Mode Fallback for dynamic server-side safety during static builds
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder-url-for-build")) {
      return NextResponse.json(
        { success: true, message: "Simulation Mode: CPMAI Project Assessment successfully logged!" },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { error: err.message || "An internal error occurred while saving the assessment." },
      { status: 500 }
    );
  }
}
