import { NextResponse } from "next/server";
import { getCareerBySlug } from "@/sanity/queries";

const RESUME_MAX_BYTES = 5 * 1024 * 1024;
const RESUME_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Job application submissions from /careers/[slug].
 *
 * Validates the form and the resume, and checks the role is still open.
 * Emailing the application (with the resume attached) is NOT wired up yet:
 * it will use the same Resend setup as the other site forms once that lands.
 * Until then submissions are only logged.
 */
export async function POST(request: Request) {
  let data: FormData;
  try {
    data = await request.formData();
  } catch {
    return NextResponse.json({ error: "Invalid submission." }, { status: 400 });
  }

  const get = (k: string) => String(data.get(k) ?? "").trim();

  // Honeypot filled → silently accept so bots don't retry
  if (get("company_website")) return NextResponse.json({ success: true });

  const application = {
    jobSlug: get("jobSlug"),
    jobTitle: get("jobTitle"),
    fullName: get("fullName"),
    email: get("email"),
    phone: get("phone"),
    location: get("location"),
    experience: get("experience"),
    noticePeriod: get("noticePeriod"),
    currentCtc: get("currentCtc"),
    expectedCtc: get("expectedCtc"),
    linkedin: get("linkedin"),
    portfolio: get("portfolio"),
    coverLetter: get("coverLetter").slice(0, 3000),
  };

  if (
    !application.jobSlug ||
    !application.fullName ||
    !emailPattern.test(application.email) ||
    !application.phone ||
    !application.location ||
    !application.experience ||
    !data.get("consent")
  ) {
    return NextResponse.json({ error: "Please fill in all required fields." }, { status: 400 });
  }

  const resume = data.get("resume");
  if (!(resume instanceof File) || resume.size === 0) {
    return NextResponse.json({ error: "Please attach your resume." }, { status: 400 });
  }
  if (!RESUME_TYPES.includes(resume.type)) {
    return NextResponse.json({ error: "Resume must be a PDF or Word file." }, { status: 400 });
  }
  if (resume.size > RESUME_MAX_BYTES) {
    return NextResponse.json({ error: "Resume must be 5 MB or smaller." }, { status: 400 });
  }

  // Only accept applications for roles that are live right now
  const job = await getCareerBySlug(application.jobSlug).catch(() => null);
  if (!job) {
    return NextResponse.json(
      { error: "This role is no longer accepting applications." },
      { status: 410 },
    );
  }

  // TODO(resend): send `application` + the resume as an attachment to the
  // hiring inbox (and a confirmation to the candidate) using the shared
  // Resend helper once it's merged. The resume bytes are available via
  // `Buffer.from(await resume.arrayBuffer())`.
  console.log("[Career Application]:", {
    ...application,
    jobTitle: job.title,
    resume: { name: resume.name, type: resume.type, size: resume.size },
    timestamp: new Date().toISOString(),
  });

  return NextResponse.json({ success: true });
}
