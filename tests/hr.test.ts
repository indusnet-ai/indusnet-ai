import assert from "assert";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001";

async function runTest() {
  console.log("--------------------------------------------------");
  console.log("INTEGRATION TEST: HR RECRUITMENT MODULE");
  console.log("--------------------------------------------------");

  let token = "";
  let jobId = "";
  let candidateId = "";

  try {
    // 1. Register / Login as HR Manager
    console.log("Step 1: Authenticating as HR Manager...");
    const credentials = {
      email: "hr_test_manager@indusnet-ai.com",
      password: "secure_password_123",
      name: "Senthilkumar Elu Test",
      role: "hr_manager"
    };

    // Try to register first
    let authRes = await fetch(`${BACKEND_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials)
    });

    if (authRes.status === 400) {
      console.log("  Email already exists, attempting login instead...");
      authRes = await fetch(`${BACKEND_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password
        })
      });
    }

    assert.ok(authRes.status === 200 || authRes.status === 201, `Failed to authenticate. Status: ${authRes.status}`);
    const authData = await authRes.json();
    token = authData.access_token;
    assert.ok(token, "Access token not received.");
    console.log("✓ Authenticated successfully!");

    // 2. Create a Job Posting
    console.log("\nStep 2: Creating a Job Position...");
    const jobPayload = {
      title: "Senior AI Solutions Architect (Test)",
      department: "Engineering",
      employment_type: "Full-time",
      location: "Velachery Chennai HQ / Singapore Office",
      salary_range: "SGD 9,000 - 12,000 / month",
      description: "We are seeking a senior architect with expertise in designing agentic LLM workflows, FastAPI, React, and Python.",
      requirements: "6+ years experience. Expert in Python, FastAPI, React, Supabase PostgreSQL, and OpenAI API."
    };

    const jobRes = await fetch(`${BACKEND_URL}/hr/jobs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(jobPayload)
    });

    assert.strictEqual(jobRes.status, 201, `Failed to create job. Status: ${jobRes.status}`);
    const jobData = await jobRes.json();
    jobId = jobData.id;
    assert.ok(jobId, "Job ID not found in response.");
    console.log(`✓ Job created successfully! ID: ${jobId}`);

    // 3. Verify Public Job Listing
    console.log("\nStep 3: Verifying job list is public...");
    const listRes = await fetch(`${BACKEND_URL}/hr/jobs?status=active`);
    assert.strictEqual(listRes.status, 200);
    const listData = await listRes.json();
    const foundJob = listData.find((j: any) => j.id === jobId);
    assert.ok(foundJob, "Created job was not found in active public listings.");
    console.log("✓ Job exists in public active job listings.");

    // 4. Submit Candidate Application (multipart/form-data)
    console.log("\nStep 4: Submitting Candidate Application with Mock Resume...");
    const formData = new FormData();
    formData.append("job_id", jobId);
    formData.append("name", "Indus Test Applicant");
    formData.append("email", "candidate_test@indusnet-ai.com");
    formData.append("phone", "+91-9884915977");
    formData.append("experience_years", "6.5");
    formData.append("current_company", "Acme Enterprise");
    formData.append("current_designation", "AI Lead");
    formData.append("expected_salary", "SGD 9,500");
    formData.append("notice_period", "1 Month");
    formData.append("linkedin_url", "https://linkedin.com/in/test-applicant");

    // Add mock resume file
    const resumeText = (
      "INDUS TEST APPLICANT RESUME\n" +
      "Email: candidate_test@indusnet-ai.com\n" +
      "Phone: +91-9884915977\n" +
      "Experience: 6.5 Years as an AI Developer.\n" +
      "Skills: React, Python, FastAPI, LangGraph, Supabase, SQL, PostgreSQL, LLMs.\n" +
      "Education: BS in Computer Science from Velachery University."
    );
    const resumeBlob = new Blob([resumeText], { type: "text/plain" });
    formData.append("resume", resumeBlob, "resume.pdf");

    const appRes = await fetch(`${BACKEND_URL}/hr/applications`, {
      method: "POST",
      body: formData // Node fetch handles boundary headers automatically when given a FormData object
    });

    assert.strictEqual(appRes.status, 201, `Failed to submit application. Status: ${appRes.status}`);
    const appData = await appRes.json();
    candidateId = appData.id;
    assert.ok(candidateId, "Candidate ID not found in application response.");
    console.log(`✓ Candidate application submitted! Candidate ID: ${candidateId}`);

    // Wait a brief moment to allow background analysis to start
    console.log("  Waiting for background AI analysis task (polling)...");
    
    // 5. Retrieve Candidate Profile & Verify AI Analysis
    console.log("\nStep 5: Fetching Candidate Profile and AI Analysis...");
    
    let profileData: any = null;
    const maxAttempts = 15;
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      const profileRes = await fetch(`${BACKEND_URL}/hr/candidates/${candidateId}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      assert.strictEqual(profileRes.status, 200);
      profileData = await profileRes.json();
      
      if (profileData.analysis) {
        console.log(`  AI Analysis generated successfully on attempt ${attempt}.`);
        break;
      }
      if (attempt < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    assert.strictEqual(profileData.application.name, "Indus Test Applicant");
    assert.ok(profileData.analysis, "AI Analysis was not generated in background.");
    console.log(`✓ AI Analysis fetched! Score: ${profileData.analysis.job_match_score}%`);
    assert.ok(Array.isArray(profileData.analysis.skills), "Skills should be an array.");
    console.log(`✓ Parsed Skills: ${profileData.analysis.skills.join(", ")}`);

    // 6. Test Recruitment Copilot Chat Query
    console.log("\nStep 6: Querying Recruitment Copilot Chatbot...");
    const chatPayload = {
      message: `Find candidates with Python skills for our jobs, and draft an offer letter.`,
      history: [],
      job_id: jobId
    };

    const chatRes = await fetch(`${BACKEND_URL}/hr/copilot/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(chatPayload)
    });

    assert.strictEqual(chatRes.status, 200);
    const chatData = await chatRes.json();
    assert.ok(chatData.response, "Copilot chat response is empty.");
    console.log("✓ Copilot chat responded successfully!");
    console.log("  Copilot Response Snippet:\n", chatData.response.substring(0, 300) + "...\n");

    // 7. Update Candidate Status (Transitions & Emails)
    console.log("\nStep 7: Updating candidate status to invite for interview...");
    const statusPayload = { status: "interview" };
    const updateRes = await fetch(`${BACKEND_URL}/hr/applications/${candidateId}/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(statusPayload)
    });

    assert.strictEqual(updateRes.status, 200);
    const updateData = await updateRes.json();
    assert.strictEqual(updateData.application_status, "interview");
    console.log("✓ Candidate status updated to 'interview' and invitation email sent!");

    // 8. Cleanup - Delete Job Posting (Cascades to Application & Analysis)
    console.log("\nStep 8: Cleaning up test data...");
    const cleanRes = await fetch(`${BACKEND_URL}/hr/jobs/${jobId}`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${token}` }
    });

    assert.strictEqual(cleanRes.status, 204);
    console.log("✓ Job position and candidate applications cascadingly deleted successfully!");

    console.log("\n--------------------------------------------------");
    console.log("ALL HR MODULE RECRUITMENT TESTS PASSED SUCCESSFULLY!");
    console.log("--------------------------------------------------");

  } catch (error) {
    console.error("\n--------------------------------------------------");
    console.error("HR INTEGRATION TESTS FAILED:");
    console.error(error);
    console.error("--------------------------------------------------");
    
    // Attempt cleanup if failed
    if (token && jobId) {
      console.log("Attempting cleanup delete for job ID:", jobId);
      await fetch(`${BACKEND_URL}/hr/jobs/${jobId}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
    }
    process.exit(1);
  }
}

runTest();
