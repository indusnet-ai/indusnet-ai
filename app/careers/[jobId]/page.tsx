"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  ArrowLeft, Briefcase, MapPin, DollarSign, Clock, FileText, 
  Upload, CheckCircle, AlertCircle, Sparkles, Building, Phone
} from "lucide-react";

interface Job {
  id: string;
  title: string;
  department: string;
  employment_type: string;
  location: string;
  salary_range: string;
  description: string;
  requirements: string;
  status: string;
}

interface PageProps {
  params: Promise<{
    jobId: string;
  }>;
}

export default function JobDetailPage({ params }: PageProps) {
  const resolvedParams = React.use(params);
  const jobId = resolvedParams.jobId;
  const router = useRouter();

  const [job, setJob] = React.useState<Job | null>(null);
  const [loadingJob, setLoadingJob] = React.useState(true);
  
  // Form State
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [experienceYears, setExperienceYears] = React.useState("");
  const [currentCompany, setCurrentCompany] = React.useState("");
  const [currentDesignation, setCurrentDesignation] = React.useState("");
  const [expectedSalary, setExpectedSalary] = React.useState("");
  const [noticePeriod, setNoticePeriod] = React.useState("");
  const [linkedinUrl, setLinkedinUrl] = React.useState("");
  const [portfolioUrl, setPortfolioUrl] = React.useState("");
  const [resumeFile, setResumeFile] = React.useState<File | null>(null);
  
  // UI states
  const [submitting, setSubmitting] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState("");

  React.useEffect(() => {
    async function fetchJob() {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
        const res = await fetch(`${API_URL}/hr/jobs/${jobId}`);
        if (res.ok) {
          const data = await res.json();
          setJob(data);
        } else {
          setErrorMsg("Job listing not found.");
        }
      } catch (err) {
        console.error("Failed to load job details:", err);
        setErrorMsg("Failed to load job details.");
      } finally {
        setLoadingJob(false);
      }
    }
    fetchJob();
  }, [jobId]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Size check (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        alert("File size exceeds 5MB. Please upload a smaller PDF/DOCX file.");
        return;
      }
      setResumeFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resumeFile) {
      alert("Please upload your resume to complete the application.");
      return;
    }

    setSubmitting(true);
    setErrorMsg("");

    const formData = new FormData();
    formData.append("job_id", jobId);
    formData.append("name", name);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("experience_years", experienceYears);
    formData.append("resume", resumeFile);
    
    if (currentCompany) formData.append("current_company", currentCompany);
    if (currentDesignation) formData.append("current_designation", currentDesignation);
    if (expectedSalary) formData.append("expected_salary", expectedSalary);
    if (noticePeriod) formData.append("notice_period", noticePeriod);
    if (linkedinUrl) formData.append("linkedin_url", linkedinUrl);
    if (portfolioUrl) formData.append("portfolio_url", portfolioUrl);

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
      const res = await fetch(`${API_URL}/hr/applications`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || "Failed to submit application");
      }

      setSuccess(true);
      
      // Reset form fields
      setName("");
      setEmail("");
      setPhone("");
      setExperienceYears("");
      setCurrentCompany("");
      setCurrentDesignation("");
      setExpectedSalary("");
      setNoticePeriod("");
      setLinkedinUrl("");
      setPortfolioUrl("");
      setResumeFile(null);
      
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingJob) {
    return (
      <div className="min-h-screen bg-[#030014] text-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary"></div>
          <span className="text-xs text-zinc-400">Loading job specifications...</span>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-[#030014] text-white flex flex-col items-center justify-center p-6 text-center">
        <AlertCircle className="w-12 h-12 text-red-400 mb-4" />
        <h2 className="text-xl font-bold mb-2">Job Listing Not Found</h2>
        <p className="text-zinc-400 text-xs mb-6 max-w-sm">This position may have been closed or is temporarily draft mode.</p>
        <Button asChild variant="outline" className="border-border/40 hover:bg-white/5 rounded-full text-xs">
          <Link href="/careers">Back to Careers</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030014] text-white flex flex-col font-sans">
      {/* Glow backgrounds */}
      <div className="absolute top-0 left-0 w-full h-[400px] bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />

      {/* Header */}
      <header className="border-b border-border/10 py-6 px-6 md:px-12 backdrop-blur-md sticky top-0 z-50 bg-[#030014]/80">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <Building className="w-5 h-5 text-primary" />
            INDUSNET <span className="text-primary">AI</span>
          </Link>
          <Button asChild variant="outline" className="border-border/40 hover:bg-white/5 rounded-full text-xs">
            <Link href="/careers">All Careers</Link>
          </Button>
        </div>
      </header>

      {/* Main Grid */}
      <main className="flex-grow max-w-7xl mx-auto w-full px-6 md:px-12 py-12 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Left Hand: Job Info */}
        <section className="lg:col-span-6 flex flex-col gap-6 text-left" aria-labelledby="job-title-heading">
          <Link href="/careers" className="text-xs text-zinc-400 hover:text-white flex items-center gap-1.5 transition-colors mb-2">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Careers
          </Link>

          <div>
            <Badge className="bg-primary/10 border-primary/20 text-primary text-[10px] rounded px-3 py-0.5 mb-4">
              {job.department}
            </Badge>
            <h1 id="job-title-heading" className="text-3xl md:text-4xl font-extrabold text-white leading-tight mb-4">
              {job.title}
            </h1>
            
            <div className="flex flex-wrap gap-4 text-xs text-zinc-400 mt-2">
              <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-accent" /> {job.location}</span>
              <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-accent" /> {job.employment_type}</span>
              <span className="flex items-center gap-1.5"><DollarSign className="w-4 h-4 text-accent" /> {job.salary_range}</span>
            </div>
          </div>

          <div className="border-t border-border/10 my-4" />

          {/* Job Description */}
          <div className="flex flex-col gap-3">
            <h2 className="text-base font-bold text-white uppercase tracking-wider">Role Overview</h2>
            <p className="text-zinc-300 text-xs md:text-sm leading-relaxed whitespace-pre-wrap">
              {job.description}
            </p>
          </div>

          {/* Job Requirements */}
          <div className="flex flex-col gap-3 mt-4">
            <h2 className="text-base font-bold text-white uppercase tracking-wider">Key Requirements</h2>
            <div className="text-zinc-300 text-xs md:text-sm leading-relaxed whitespace-pre-wrap bg-white/[0.01] border border-border/5 p-4 rounded-xl">
              {job.requirements}
            </div>
          </div>
        </section>

        {/* Right Hand: Application Form */}
        <section className="lg:col-span-6" aria-labelledby="form-heading">
          {success ? (
            <Card className="bg-green-950/20 border border-green-500/30 p-8 text-center rounded-2xl flex flex-col items-center gap-4 shadow-2xl backdrop-blur-xl">
              <CheckCircle className="w-16 h-16 text-green-400 animate-bounce" />
              <CardTitle className="text-xl font-bold text-white">Application Received!</CardTitle>
              <p className="text-zinc-300 text-xs leading-relaxed max-w-sm">
                Thank you for applying. Our AI recruitment copilot is currently analyzing your resume. A confirmation email has been dispatched to <strong>{email}</strong>.
              </p>
              <Button asChild className="bg-green-500 hover:bg-green-600 text-white font-semibold text-xs mt-4 rounded-xl">
                <Link href="/careers">Return to Job Listings</Link>
              </Button>
            </Card>
          ) : (
            <Card className="glassmorphism-card border-none p-6 md:p-8">
              <CardHeader className="p-0 pb-6 text-left">
                <CardTitle id="form-heading" className="text-lg font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" /> Apply for this position
                </CardTitle>
                <CardDescription className="text-zinc-400 text-xs">
                  Fill in your details below and upload your resume to start the screening process.
                </CardDescription>
              </CardHeader>

              {errorMsg && (
                <div className="bg-red-500/10 border border-red-500/20 p-3.5 rounded-xl text-red-400 text-xs flex items-center gap-2 mb-6">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="flex flex-col gap-5 text-left">
                {/* Section 1: Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="fullname" className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Full Name</label>
                    <Input id="fullname" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} required className="bg-neutral-900 border-border/40 text-xs text-white" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="email" className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Email Address</label>
                    <Input id="email" type="email" placeholder="john@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required className="bg-neutral-900 border-border/40 text-xs text-white" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="phone" className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Phone Number</label>
                    <Input id="phone" type="tel" placeholder="+65-9876-5432" value={phone} onChange={(e) => setPhone(e.target.value)} required className="bg-neutral-900 border-border/40 text-xs text-white" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="experience" className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Years of Experience</label>
                    <Input id="experience" type="number" step="0.1" min="0" placeholder="e.g. 4.5" value={experienceYears} onChange={(e) => setExperienceYears(e.target.value)} required className="bg-neutral-900 border-border/40 text-xs text-white" />
                  </div>
                </div>

                {/* Section 2: Professional Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-border/5 pt-4">
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="company" className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Current Company</label>
                    <Input id="company" placeholder="e.g. Acme Corp" value={currentCompany} onChange={(e) => setCurrentCompany(e.target.value)} className="bg-neutral-900 border-border/40 text-xs text-white" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="designation" className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Current Designation</label>
                    <Input id="designation" placeholder="e.g. Senior Software Engineer" value={currentDesignation} onChange={(e) => setCurrentDesignation(e.target.value)} className="bg-neutral-900 border-border/40 text-xs text-white" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="salary" className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Expected Salary</label>
                    <Input id="salary" placeholder="e.g. SGD 8,000/mo" value={expectedSalary} onChange={(e) => setExpectedSalary(e.target.value)} className="bg-neutral-900 border-border/40 text-xs text-white" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="notice" className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Notice Period</label>
                    <Input id="notice" placeholder="e.g. 1 Month" value={noticePeriod} onChange={(e) => setNoticePeriod(e.target.value)} className="bg-neutral-900 border-border/40 text-xs text-white" />
                  </div>
                </div>

                {/* Section 3: Links */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-border/5 pt-4">
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="linkedin" className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">LinkedIn Profile URL</label>
                    <Input id="linkedin" type="url" placeholder="https://linkedin.com/in/username" value={linkedinUrl} onChange={(e) => setLinkedinUrl(e.target.value)} className="bg-neutral-900 border-border/40 text-xs text-white" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="portfolio" className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Portfolio / GitHub URL</label>
                    <Input id="portfolio" type="url" placeholder="https://github.com/username" value={portfolioUrl} onChange={(e) => setPortfolioUrl(e.target.value)} className="bg-neutral-900 border-border/40 text-xs text-white" />
                  </div>
                </div>

                {/* Section 4: File Upload */}
                <div className="flex flex-col gap-1.5 border-t border-border/5 pt-4">
                  <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Resume Attachment (PDF or DOCX)</span>
                  <div className="border border-dashed border-border/40 hover:border-primary/50 transition-all rounded-xl p-6 text-center cursor-pointer relative bg-neutral-900/50 focus-within:ring-1 focus-within:ring-primary">
                    <input
                      type="file"
                      id="resume-upload"
                      accept=".pdf,.docx"
                      onChange={handleFileChange}
                      required
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    <Upload className="w-8 h-8 text-primary mx-auto mb-2" />
                    <p className="text-xs text-white font-medium">
                      {resumeFile ? resumeFile.name : "Upload your resume file"}
                    </p>
                    <p className="text-[10px] text-zinc-400 mt-1">
                      Max file size: 5MB. Formats: PDF or DOCX only.
                    </p>
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-gradient-to-r from-primary to-accent hover:brightness-110 text-white font-bold py-6 text-xs mt-2 rounded-xl"
                >
                  {submitting ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white"></div>
                      Submitting Application...
                    </div>
                  ) : (
                    "Submit Job Application"
                  )}
                </Button>
              </form>
            </Card>
          )}
        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-border/10 bg-[#02000c] py-16 px-6 md:px-12 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col gap-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col gap-4 text-left">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Building className="w-5 h-5 text-primary" />
                INDUSNET <span className="text-primary">AI</span>
              </h2>
              <p className="text-zinc-400 text-xs leading-relaxed max-w-sm">
                A pioneer in building and deploying verified cognitive orchestration tools for enterprise scale compliance audits and recruitment models.
              </p>
            </div>
            
            <div className="flex flex-col gap-3 text-left">
              <h3 className="text-xs uppercase tracking-wider font-extrabold text-zinc-300">Singapore Corporate Office</h3>
              <p className="text-zinc-400 text-xs leading-relaxed">
                51 Ubi Ave 1, #05-16 Paya Ubi Industrial Park,<br />
                Singapore, SG 408933
              </p>
              <div className="flex flex-col gap-1 text-zinc-400 text-xs mt-1">
                <div className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-primary" /> +65-9448-3805</div>
                <div className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-primary" /> +65-6747-4753</div>
              </div>
            </div>

            <div className="flex flex-col gap-3 text-left">
              <h3 className="text-xs uppercase tracking-wider font-extrabold text-zinc-300">Chennai Headquarters</h3>
              <p className="text-zinc-400 text-xs leading-relaxed">
                Number 46 First Floor, Tansi Nagar,<br />
                Velachery, Chennai, India 600042
              </p>
              <div className="flex flex-col gap-1 text-zinc-400 text-xs mt-1">
                <div className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-primary" /> +91-9884915977</div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-border/5 pt-8 text-center text-zinc-500 text-[11px] flex flex-col md:flex-row justify-between items-center gap-4">
            <p>© {new Date().getFullYear()} Indusnet AI Corporation. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
