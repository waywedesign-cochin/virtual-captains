import { NextResponse } from "next/server";
import { getCareerBySlug } from "@/sanity/queries";
import {
  BRAND,
  C,
  MIN,
  badge,
  button,
  esc,
  escMultiline,
  footnote,
  getIp,
  getMailConfig,
  heading,
  isLimited,
  layout,
  mailtoLink,
  makeLimiter,
  misconfigured,
  para,
  row,
  rows,
  sendLeadEmails,
  telLink,
  tooMany,
} from "@/app/lib/email";
import { badCode, checkCode } from "@/app/lib/otp";

const byIp = makeLimiter("careers:ip", 5, 10 * MIN);
const byEmail = makeLimiter("careers:email", 5, 10 * MIN);

// Vercel caps request bodies at 4.5 MB, so the resume stays under 4 MB
const RESUME_MAX_BYTES = 4 * 1024 * 1024;
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
 * Then emails the application, resume attached, to the hiring inbox
 * (CAREERS_TO_EMAIL, else APPLICATIONS_TO_EMAIL) and confirms to the candidate.
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
    return NextResponse.json(
      { error: "Please fill in all required fields." },
      { status: 400 },
    );
  }

  const resume = data.get("resume");
  if (!(resume instanceof File) || resume.size === 0) {
    return NextResponse.json(
      { error: "Please attach your resume." },
      { status: 400 },
    );
  }
  if (!RESUME_TYPES.includes(resume.type)) {
    return NextResponse.json(
      { error: "Resume must be a PDF or Word file." },
      { status: 400 },
    );
  }
  if (resume.size > RESUME_MAX_BYTES) {
    return NextResponse.json(
      { error: "Resume must be 4 MB or smaller." },
      { status: 400 },
    );
  }

  if (
    await isLimited([
      [byIp, getIp(request)],
      [byEmail, application.email.toLowerCase()],
    ])
  ) {
    return tooMany();
  }

  // Must prove they own the email (code from /api/verify-email)
  if (!checkCode(application.email, get("code"), get("token")))
    return badCode();

  // Only accept applications for roles that are live right now
  const job = await getCareerBySlug(application.jobSlug).catch(() => null);
  if (!job) {
    return NextResponse.json(
      { error: "This role is no longer accepting applications." },
      { status: 410 },
    );
  }

  const mail = getMailConfig("CAREERS_TO_EMAIL");
  if (!mail) return misconfigured();

  const a = application;
  const firstName = a.fullName.split(" ")[0];
  const link = (url: string) =>
    /^https?:\/\//i.test(url)
      ? `<a href="${esc(url)}" style="color:${C.blue};text-decoration:none;">${esc(url)}</a>`
      : esc(url);
  // Keep the extension, drop anything odd from the uploaded filename
  const ext = resume.name.match(/\.(pdf|docx?)$/i)?.[0] ?? "";
  const filename = `${a.fullName.replace(/[^\w-]+/g, "_")}_Resume${ext}`;

  const ok = await sendLeadEmails({
    ...mail,
    team: {
      replyTo: a.email,
      subject: `New Job Application: ${job.title} – ${a.fullName}`,
      html: layout(
        `${a.fullName} applied for ${job.title}`,
        "New Job Application",
        `
        ${badge("Job Application")}
        ${heading(esc(job.title), "16px 0 4px 0")}
        ${para(`${esc(a.fullName)} just applied. Their resume is attached.`, C.muted)}
        ${rows(`
          ${row("Name", esc(a.fullName))}
          ${row("Email", mailtoLink(a.email))}
          ${row("Phone", telLink(a.phone))}
          ${row("Location", esc(a.location))}
          ${row("Experience", esc(a.experience))}
          ${a.noticePeriod ? row("Notice", esc(a.noticePeriod)) : ""}
          ${a.currentCtc ? row("Current CTC", esc(a.currentCtc)) : ""}
          ${a.expectedCtc ? row("Expected CTC", esc(a.expectedCtc)) : ""}
          ${a.linkedin ? row("LinkedIn", link(a.linkedin)) : ""}
          ${a.portfolio ? row("Portfolio", link(a.portfolio)) : ""}
          ${row("Cover Letter", escMultiline(a.coverLetter) || "—")}
        `)}
        ${button(`mailto:${a.email}`, `Reply to ${firstName}`)}
        `,
      ),
      attachments: [
        { filename, content: Buffer.from(await resume.arrayBuffer()) },
      ],
    },
    confirmation: {
      to: a.email,
      subject: `We've received your application for ${job.title}`,
      html: layout(
        `Thanks for applying for ${job.title}.`,
        "Application received",
        `
        ${badge("Application received")}
        ${heading(`Hi ${esc(firstName)},`)}
        ${para(`Thanks for applying for <strong>${esc(job.title)}</strong> at ${BRAND}. Our hiring team reviews every application and will contact you if your profile is a match.`)}
        ${footnote("Questions? Just reply to this email.")}
        `,
      ),
    },
  });

  if (!ok) {
    return NextResponse.json(
      { error: "We couldn't send your application. Please try again." },
      { status: 500 },
    );
  }

  return NextResponse.json({ success: true });
}
