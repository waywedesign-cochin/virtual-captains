"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { CheckCircle2, FileText, Loader2, Upload, X } from "lucide-react";

/** Kept in sync with the checks in app/api/careers/apply/route.ts */
const RESUME_MAX_BYTES = 5 * 1024 * 1024;
const RESUME_ACCEPT = ".pdf,.doc,.docx";
const RESUME_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const NOTICE_PERIODS = ["Immediate", "15 days", "30 days", "60 days", "90 days"];

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type FieldName =
  | "fullName"
  | "email"
  | "phone"
  | "location"
  | "linkedin"
  | "experience"
  | "resume"
  | "consent";

type Status = "idle" | "submitting" | "success" | "error";

// Same field styling as the Contact form
const labelClass = "mb-1.5 block text-xs font-semibold uppercase tracking-wider text-white/80";

function controlClass(hasError: boolean) {
  return `w-full min-w-0 rounded-xl border bg-white/4 px-4 py-3.5 text-sm text-white placeholder:text-white/30 outline-none transition-all duration-200 focus:bg-white/[0.07] focus:ring-2 ${
    hasError
      ? "border-[#ff5c5c] focus:border-[#ff5c5c] focus:ring-[#ff5c5c]/20"
      : "border-white/12 focus:border-[#38bdf8] focus:ring-[#38bdf8]/20"
  }`;
}

export function CareerApplyForm({ jobSlug, jobTitle }: { jobSlug: string; jobTitle: string }) {
  const [errors, setErrors] = useState<Partial<Record<FieldName, string>>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [serverError, setServerError] = useState("");
  const [resume, setResume] = useState<File | null>(null);

  function validate(data: FormData) {
    const next: Partial<Record<FieldName, string>> = {};
    const get = (k: string) => String(data.get(k) ?? "").trim();

    if (!get("fullName")) next.fullName = "Please enter your full name.";
    if (!emailPattern.test(get("email"))) next.email = "Please enter a valid email address.";
    if (get("phone").replace(/\D/g, "").length < 7) next.phone = "Please enter a valid phone number.";
    if (!get("location")) next.location = "Please enter your current city.";
    if (!get("experience")) next.experience = "Please add your years of experience.";
    const linkedin = get("linkedin");
    if (linkedin && !/^https?:\/\/.+\..+/.test(linkedin))
      next.linkedin = "Please paste the full link, starting with https://";
    if (!resume) next.resume = "Please attach your resume.";
    else if (!RESUME_TYPES.includes(resume.type)) next.resume = "Resume must be a PDF or Word file.";
    else if (resume.size > RESUME_MAX_BYTES) next.resume = "Resume must be 5 MB or smaller.";
    if (!data.get("consent")) next.consent = "Please confirm so we can process your application.";
    return next;
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    if (resume) data.set("resume", resume);

    const found = validate(data);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      const first = Object.keys(found)[0];
      form.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }

    setStatus("submitting");
    setServerError("");
    try {
      const res = await fetch("/api/careers/apply", { method: "POST", body: data });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || "Something went wrong.");
      setStatus("success");
      form.reset();
      setResume(null);
    } catch (err) {
      setStatus("error");
      setServerError(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  const fieldError = (field: FieldName) =>
    errors[field] ? (
      <p id={`${field}-error`} className="mt-1.5 text-xs text-[#ff6b6b]">
        {errors[field]}
      </p>
    ) : null;

  const aria = (field: FieldName) => ({
    "aria-invalid": Boolean(errors[field]),
    "aria-describedby": errors[field] ? `${field}-error` : undefined,
  });

  if (status === "success") {
    return (
      <div className="flex flex-col items-center gap-4 rounded-[28px] border border-white/10 bg-[#0a0d16]/85 p-8 sm:p-12 text-center backdrop-blur-2xl">
        <CheckCircle2 className="h-12 w-12 text-[#e7ff3d]" aria-hidden="true" />
        <h3 className="font-sans text-2xl font-medium text-white">Application Received</h3>
        <p className="max-w-md text-sm sm:text-base text-white/65 leading-relaxed">
          Thanks for applying for <span className="text-white">{jobTitle}</span>. Our team reviews
          every application and will get back to you within 5 business days if your profile is a
          match.
        </p>
        <Link
          href="/careers"
          className="mt-2 inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-2.5 text-sm font-semibold text-white/85 transition-colors hover:border-[#38bdf8] hover:text-[#8fd0ff]"
        >
          See Other Open Roles
        </Link>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="relative rounded-[28px] border border-white/10 bg-[#0a0d16]/85 p-6 sm:p-10 backdrop-blur-2xl shadow-[0_24px_60px_rgba(0,0,0,0.6)]"
    >
      <input type="hidden" name="jobSlug" value={jobSlug} />
      <input type="hidden" name="jobTitle" value={jobTitle} />
      {/* Honeypot: real people never see or fill this */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label>
          Leave this empty
          <input type="text" name="company_website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="fullName" className={labelClass}>
            Full Name *
          </label>
          <input id="fullName" name="fullName" autoComplete="name" placeholder="Your full name" className={controlClass(!!errors.fullName)} {...aria("fullName")} />
          {fieldError("fullName")}
        </div>

        <div>
          <label htmlFor="email" className={labelClass}>
            Email *
          </label>
          <input id="email" name="email" type="email" autoComplete="email" placeholder="you@example.com" className={controlClass(!!errors.email)} {...aria("email")} />
          {fieldError("email")}
        </div>

        <div>
          <label htmlFor="phone" className={labelClass}>
            Phone *
          </label>
          <input id="phone" name="phone" type="tel" autoComplete="tel" placeholder="+91 98765 43210" className={controlClass(!!errors.phone)} {...aria("phone")} />
          {fieldError("phone")}
        </div>

        <div>
          <label htmlFor="location" className={labelClass}>
            Current City *
          </label>
          <input id="location" name="location" autoComplete="address-level2" placeholder="e.g. Kochi, India" className={controlClass(!!errors.location)} {...aria("location")} />
          {fieldError("location")}
        </div>

        <div>
          <label htmlFor="experience" className={labelClass}>
            Total Experience *
          </label>
          <input id="experience" name="experience" placeholder="e.g. 4 years" className={controlClass(!!errors.experience)} {...aria("experience")} />
          {fieldError("experience")}
        </div>

        <div>
          <label htmlFor="noticePeriod" className={labelClass}>
            Notice Period
          </label>
          <select id="noticePeriod" name="noticePeriod" defaultValue="" className={`${controlClass(false)} appearance-none`}>
            <option value="" className="bg-[#0a0d16]">
              Select
            </option>
            {NOTICE_PERIODS.map((p) => (
              <option key={p} value={p} className="bg-[#0a0d16]">
                {p}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="currentCtc" className={labelClass}>
            Current CTC
          </label>
          <input id="currentCtc" name="currentCtc" placeholder="Optional" className={controlClass(false)} />
        </div>

        <div>
          <label htmlFor="expectedCtc" className={labelClass}>
            Expected CTC
          </label>
          <input id="expectedCtc" name="expectedCtc" placeholder="Optional" className={controlClass(false)} />
        </div>

        <div>
          <label htmlFor="linkedin" className={labelClass}>
            LinkedIn Profile
          </label>
          <input id="linkedin" name="linkedin" type="url" placeholder="https://linkedin.com/in/…" className={controlClass(!!errors.linkedin)} {...aria("linkedin")} />
          {fieldError("linkedin")}
        </div>

        <div>
          <label htmlFor="portfolio" className={labelClass}>
            Portfolio / Website
          </label>
          <input id="portfolio" name="portfolio" type="url" placeholder="Optional" className={controlClass(false)} />
        </div>

        {/* Resume upload */}
        <div className="sm:col-span-2">
          <span className={labelClass}>Resume *</span>
          {resume ? (
            <div className="flex items-center justify-between gap-3 rounded-xl border border-[#38bdf8]/40 bg-[#38bdf8]/8 px-4 py-3.5">
              <span className="flex min-w-0 items-center gap-3 text-sm text-white">
                <FileText className="h-5 w-5 shrink-0 text-[#38bdf8]" aria-hidden="true" />
                <span className="truncate">{resume.name}</span>
                <span className="shrink-0 text-xs text-white/50">{(resume.size / 1024 / 1024).toFixed(1)} MB</span>
              </span>
              <button
                type="button"
                onClick={() => setResume(null)}
                className="rounded-full p-1 text-white/60 transition-colors hover:bg-white/10 hover:text-white"
                aria-label="Remove resume"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <label
              htmlFor="resume"
              className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed px-4 py-8 text-center transition-colors has-focus-visible:ring-2 has-focus-visible:ring-[#38bdf8]/60 ${
                errors.resume ? "border-[#ff5c5c]" : "border-white/20 hover:border-[#38bdf8]/60 hover:bg-white/4"
              }`}
            >
              <Upload className="h-6 w-6 text-[#38bdf8]" aria-hidden="true" />
              <span className="text-sm font-medium text-white">Click to upload your resume</span>
              <span className="text-xs text-white/50">PDF or Word, up to 5 MB</span>
              <input
                id="resume"
                name="resume"
                type="file"
                accept={RESUME_ACCEPT}
                className="sr-only"
                onChange={(e) => setResume(e.target.files?.[0] ?? null)}
                {...aria("resume")}
              />
            </label>
          )}
          {fieldError("resume")}
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="coverLetter" className={labelClass}>
            Why This Role?
          </label>
          <textarea
            id="coverLetter"
            name="coverLetter"
            rows={5}
            maxLength={3000}
            placeholder="Tell us briefly why you're a great fit (optional)"
            className={`${controlClass(false)} resize-y`}
          />
        </div>

        <div className="sm:col-span-2">
          <label className="flex cursor-pointer items-start gap-3 text-sm text-white/70">
            <input
              type="checkbox"
              name="consent"
              value="yes"
              className="mt-0.5 h-4 w-4 shrink-0 accent-[#38bdf8]"
              {...aria("consent")}
            />
            <span>
              I agree that Virtual Captains may store and use my details to process this
              application, as described in the{" "}
              <Link href="/privacy" className="text-[#8fd0ff] underline underline-offset-4 hover:text-[#38bdf8]">
                Privacy Policy
              </Link>
              .
            </span>
          </label>
          {fieldError("consent")}
        </div>
      </div>

      {status === "error" && (
        <p role="alert" className="mt-6 rounded-xl border border-[#ff5c5c]/40 bg-[#ff5c5c]/10 px-4 py-3 text-sm text-[#ffb3b3]">
          {serverError} Please try again.
        </p>
      )}

      <div className="mt-8 flex flex-col-reverse items-center gap-4 sm:flex-row sm:justify-between">
        <p className="text-xs text-white/45">We never share your details with third parties.</p>
        <button
          type="submit"
          disabled={status === "submitting"}
          className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#e7ff3d] hover:bg-[#d8f030] px-8 py-3.5 text-sm font-bold text-[#0a0b0d] tracking-wide shadow-[0_0_24px_rgba(231,255,61,0.35)] transition-all duration-200 cursor-pointer hover:scale-102 active:scale-98 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
        >
          {status === "submitting" && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
          {status === "submitting" ? "Submitting…" : "Submit Application"}
        </button>
      </div>
    </form>
  );
}
