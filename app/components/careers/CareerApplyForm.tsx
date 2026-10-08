"use client";

import {
  useState,
  type DragEvent,
  type FormEvent,
  type ReactNode,
} from "react";
import Link from "next/link";
import {
  Briefcase,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock,
  FileText,
  Globe,
  Link2,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Upload,
  User,
  Wallet,
  X,
  type LucideIcon,
} from "lucide-react";
import { BlueFrame } from "./BlueFrame";
import { isValidPhoneNumber, type Value } from "react-phone-number-input";
import PhoneField from "../common/PhoneField";
import {
  VerifyEmailStep,
  requestCode,
  toVerifyResult,
} from "../common/EmailVerification";

/** Kept in sync with the checks in app/api/careers/apply/route.ts */
// Vercel caps request bodies at 4.5 MB, so the resume stays under 4 MB
const RESUME_MAX_BYTES = 4 * 1024 * 1024;
const RESUME_ACCEPT = ".pdf,.doc,.docx";
const RESUME_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const NOTICE_PERIODS = [
  "Immediate",
  "15 days",
  "30 days",
  "60 days",
  "90 days",
];

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

// Same field styling as the Contact form, with room for a leading icon
const labelClass =
  "mb-1.5 block text-xs font-semibold uppercase tracking-wider text-white/80";

function controlClass(hasError: boolean, withIcon = true) {
  return `peer w-full min-w-0 rounded-xl border bg-white/4 ${withIcon ? "pl-11" : "pl-4"} pr-4 py-3.5 text-sm text-white placeholder:text-white/30 outline-none transition-all duration-200 hover:border-white/20 focus:bg-white/[0.07] focus:ring-2 ${
    hasError
      ? "border-[#ff5c5c] focus:border-[#ff5c5c] focus:ring-[#ff5c5c]/20"
      : "border-white/12 focus:border-[#38bdf8] focus:ring-[#38bdf8]/20"
  }`;
}

/** Input with a leading icon that lights up blue on focus. */
function IconField({
  icon: Icon,
  children,
}: {
  icon: LucideIcon;
  children: ReactNode;
}) {
  return (
    <div className="relative">
      {children}
      <Icon
        aria-hidden="true"
        className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/35 transition-colors peer-focus:text-[#38bdf8]"
      />
    </div>
  );
}

function FormSection({
  step,
  title,
  children,
}: {
  step: number;
  title: string;
  children: ReactNode;
}) {
  return (
    <fieldset className="space-y-5">
      <legend className="mb-5 flex w-full items-center gap-3">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-[#1d4ed8] to-[#0369a1] text-xs font-bold text-white shadow-[0_0_14px_rgba(29,78,216,0.5)]">
          {step}
        </span>
        <span className="text-sm font-semibold text-white">{title}</span>
        <span className="h-px flex-1 bg-linear-to-r from-[#38bdf8]/30 to-transparent" />
      </legend>
      <div className="grid gap-5 sm:grid-cols-2">{children}</div>
    </fieldset>
  );
}

export function CareerApplyForm({
  jobSlug,
  jobTitle,
}: {
  jobSlug: string;
  jobTitle: string;
}) {
  const [errors, setErrors] = useState<Partial<Record<FieldName, string>>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [serverError, setServerError] = useState("");
  const [resume, setResume] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [consent, setConsent] = useState(false);
  // Phone in E.164 (e.g. +919876543210), same picker as the other site forms
  const [phone, setPhone] = useState<Value | undefined>();
  // Filled form waiting on email verification (holds the resume file too)
  const [pending, setPending] = useState<{
    data: FormData;
    email: string;
    token: string;
  } | null>(null);

  function pickResume(file: File | null | undefined) {
    setResume(file ?? null);
    if (file) setErrors((e) => ({ ...e, resume: undefined }));
  }

  function onDrop(e: DragEvent<HTMLLabelElement>) {
    e.preventDefault();
    setDragging(false);
    pickResume(e.dataTransfer.files?.[0]);
  }

  function validate(data: FormData) {
    const next: Partial<Record<FieldName, string>> = {};
    const get = (k: string) => String(data.get(k) ?? "").trim();

    if (!get("fullName")) next.fullName = "Please enter your full name.";
    if (!emailPattern.test(get("email")))
      next.email = "Please enter a valid email address.";
    if (!phone) next.phone = "Please enter your phone number.";
    else if (!isValidPhoneNumber(phone))
      next.phone = "That number doesn't look valid for the selected country.";
    if (!get("location")) next.location = "Please enter your current city.";
    if (!get("experience"))
      next.experience = "Please add your years of experience.";
    const linkedin = get("linkedin");
    if (linkedin && !/^https?:\/\/.+\..+/.test(linkedin))
      next.linkedin = "Please paste the full link, starting with https://";
    if (!resume) next.resume = "Please attach your resume.";
    else if (!RESUME_TYPES.includes(resume.type))
      next.resume = "Resume must be a PDF or Word file.";
    else if (resume.size > RESUME_MAX_BYTES)
      next.resume = "Resume must be 4 MB or smaller.";
    if (!data.get("consent"))
      next.consent = "Please confirm so we can process your application.";
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
      const el = form.querySelector<HTMLElement>(`[name="${first}"]`);
      el?.focus({ preventScroll: true });
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    setStatus("submitting");
    setServerError("");
    try {
      // Step 1: email a code; the application is sent from the verify step
      const email = String(data.get("email") ?? "").trim();
      setPending({
        data,
        email,
        token: await requestCode(
          email,
          String(data.get("company_website") ?? ""),
        ),
      });
      setStatus("idle");
    } catch (err) {
      setStatus("error");
      setServerError(
        err instanceof Error ? err.message : "Something went wrong.",
      );
    }
  }

  // Step 2: the real submission, with the code + token
  async function submitVerified(code: string, token: string) {
    if (!pending) return { error: "Something went wrong." };
    const data = pending.data;
    data.set("code", code);
    data.set("token", token);
    const result = await toVerifyResult(
      await fetch("/api/careers/apply", { method: "POST", body: data }),
    );
    if (result === "ok") {
      setStatus("success");
      setPending(null);
      setResume(null);
      setPhone(undefined);
      setConsent(false);
    }
    return result;
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
      <BlueFrame>
        <div className="flex flex-col items-center gap-4 rounded-[26.5px] bg-[#0a0d16]/95 px-6 py-12 text-center backdrop-blur-2xl sm:p-14">
          <span className="relative flex h-16 w-16 items-center justify-center">
            <span className="absolute inset-0 animate-ping rounded-full bg-[#e7ff3d]/20" />
            <CheckCircle2
              className="relative h-14 w-14 text-[#e7ff3d]"
              aria-hidden="true"
            />
          </span>
          <h3 className="font-sans text-2xl font-medium text-white">
            Application Received
          </h3>
          <p className="max-w-md text-sm sm:text-base text-white/65 leading-relaxed">
            Thanks for applying for{" "}
            <span className="text-white">{jobTitle}</span>. Our team reviews
            every application and will get back to you within 5 business days if
            your profile is a match.
          </p>
          <Link
            href="/careers"
            className="mt-2 inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-2.5 text-sm font-semibold text-white/85 transition-colors hover:border-[#38bdf8] hover:text-[#8fd0ff]"
          >
            See Other Open Roles
          </Link>
        </div>
      </BlueFrame>
    );
  }

  return (
    <BlueFrame>
      {pending && (
        <div className="rounded-[26.5px] bg-[#0a0d16]/95 p-5 backdrop-blur-2xl sm:p-10">
          <VerifyEmailStep
            email={pending.email}
            token={pending.token}
            onTokenChange={(token) => setPending({ ...pending, token })}
            onVerify={submitVerified}
            onEdit={() => setPending(null)}
            submitLabel="Verify & submit application"
          />
        </div>
      )}
      {/* Kept mounted (just hidden) during verification so "Edit details"
          returns to the filled-in form */}
      <form
        onSubmit={onSubmit}
        noValidate
        hidden={Boolean(pending)}
        className="relative space-y-10 rounded-[26.5px] bg-[#0a0d16]/95 p-5 backdrop-blur-2xl sm:p-10"
      >
        <input type="hidden" name="jobSlug" value={jobSlug} />
        <input type="hidden" name="jobTitle" value={jobTitle} />
        {/* Honeypot: real people never see or fill this */}
        <div
          aria-hidden="true"
          className="absolute -left-[9999px] h-px w-px overflow-hidden"
        >
          <label>
            Leave this empty
            <input
              type="text"
              name="company_website"
              tabIndex={-1}
              autoComplete="off"
            />
          </label>
        </div>

        {/* Applying-for strip */}
        <div className="flex items-center gap-3 rounded-2xl border border-[#38bdf8]/20 bg-linear-to-r from-[#1d4ed8]/20 via-[#38bdf8]/5 to-transparent px-4 py-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#38bdf8]/15">
            <Briefcase className="h-4 w-4 text-[#8fd0ff]" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <p className="text-[11px] uppercase tracking-wider text-white/50">
              Applying For
            </p>
            <p className="truncate text-sm font-semibold text-white">
              {jobTitle}
            </p>
          </div>
        </div>

        <FormSection step={1} title="Personal Details">
          <div>
            <label htmlFor="fullName" className={labelClass}>
              Full Name *
            </label>
            <IconField icon={User}>
              <input
                id="fullName"
                name="fullName"
                autoComplete="name"
                placeholder="Your full name"
                className={controlClass(!!errors.fullName)}
                {...aria("fullName")}
              />
            </IconField>
            {fieldError("fullName")}
          </div>

          <div>
            <label htmlFor="email" className={labelClass}>
              Email *
            </label>
            <IconField icon={Mail}>
              <input
                id="email"
                name="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                placeholder="you@example.com"
                className={controlClass(!!errors.email)}
                {...aria("email")}
              />
            </IconField>
            {fieldError("email")}
          </div>

          <div>
            <label htmlFor="phone" className={labelClass}>
              Phone *
            </label>
            <PhoneField
              id="phone"
              tone="dark"
              value={phone}
              onChange={(v) => {
                setPhone(v);
                if (errors.phone)
                  setErrors((prev) => ({ ...prev, phone: undefined }));
              }}
              invalid={Boolean(errors.phone)}
              describedBy={errors.phone ? "phone-error" : undefined}
            />
            {/* PhoneField is controlled; this carries the value into FormData */}
            <input type="hidden" name="phone" value={phone ?? ""} />
            {fieldError("phone")}
          </div>

          <div>
            <label htmlFor="location" className={labelClass}>
              Current City *
            </label>
            <IconField icon={MapPin}>
              <input
                id="location"
                name="location"
                autoComplete="address-level2"
                placeholder="e.g. Kochi, India"
                className={controlClass(!!errors.location)}
                {...aria("location")}
              />
            </IconField>
            {fieldError("location")}
          </div>
        </FormSection>

        <FormSection step={2} title="Experience">
          <div>
            <label htmlFor="experience" className={labelClass}>
              Total Experience *
            </label>
            <IconField icon={Briefcase}>
              <input
                id="experience"
                name="experience"
                placeholder="e.g. 4 years"
                className={controlClass(!!errors.experience)}
                {...aria("experience")}
              />
            </IconField>
            {fieldError("experience")}
          </div>

          <div>
            <label htmlFor="noticePeriod" className={labelClass}>
              Notice Period
            </label>
            <div className="relative">
              <select
                id="noticePeriod"
                name="noticePeriod"
                defaultValue=""
                className={`${controlClass(false)} cursor-pointer appearance-none pr-10`}
              >
                <option value="" className="bg-[#0a0d16]">
                  Select
                </option>
                {NOTICE_PERIODS.map((p) => (
                  <option key={p} value={p} className="bg-[#0a0d16]">
                    {p}
                  </option>
                ))}
              </select>
              <Clock
                aria-hidden="true"
                className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/35 transition-colors peer-focus:text-[#38bdf8]"
              />
              <ChevronDown
                aria-hidden="true"
                className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/50"
              />
            </div>
          </div>

          <div>
            <label htmlFor="currentCtc" className={labelClass}>
              Current CTC
            </label>
            <IconField icon={Wallet}>
              <input
                id="currentCtc"
                name="currentCtc"
                placeholder="Optional"
                className={controlClass(false)}
              />
            </IconField>
          </div>

          <div>
            <label htmlFor="expectedCtc" className={labelClass}>
              Expected CTC
            </label>
            <IconField icon={Wallet}>
              <input
                id="expectedCtc"
                name="expectedCtc"
                placeholder="Optional"
                className={controlClass(false)}
              />
            </IconField>
          </div>
        </FormSection>

        <FormSection step={3} title="Resume & Links">
          {/* Resume upload: click or drag and drop */}
          <div className="sm:col-span-2">
            <span className={labelClass}>Resume *</span>
            {resume ? (
              <div className="flex items-center justify-between gap-3 rounded-xl border border-[#38bdf8]/40 bg-linear-to-r from-[#38bdf8]/12 to-transparent px-4 py-3.5">
                <span className="flex min-w-0 items-center gap-3 text-sm text-white">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#38bdf8]/15">
                    <FileText
                      className="h-4.5 w-4.5 text-[#38bdf8]"
                      aria-hidden="true"
                    />
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate font-medium">
                      {resume.name}
                    </span>
                    <span className="block text-xs text-white/50">
                      {(resume.size / 1024 / 1024).toFixed(1)} MB
                    </span>
                  </span>
                </span>
                <button
                  type="button"
                  onClick={() => pickResume(null)}
                  className="rounded-full p-2 text-white/60 transition-colors hover:bg-white/10 hover:text-white"
                  aria-label="Remove resume"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <label
                htmlFor="resume"
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragging(true);
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={onDrop}
                className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed px-4 py-8 text-center transition-all has-focus-visible:ring-2 has-focus-visible:ring-[#38bdf8]/60 ${
                  errors.resume
                    ? "border-[#ff5c5c] bg-[#ff5c5c]/5"
                    : dragging
                      ? "border-[#38bdf8] bg-[#38bdf8]/10 scale-[1.01]"
                      : "border-white/20 bg-white/2 hover:border-[#38bdf8]/60 hover:bg-[#38bdf8]/5"
                }`}
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#38bdf8]/12 ring-1 ring-[#38bdf8]/30">
                  <Upload
                    className="h-5 w-5 text-[#38bdf8]"
                    aria-hidden="true"
                  />
                </span>
                <span className="text-sm font-medium text-white">
                  <span className="text-[#8fd0ff]">Click to upload</span>
                  <span className="hidden sm:inline"> or drag and drop</span>
                </span>
                <span className="text-xs text-white/50">
                  PDF or Word, up to 4 MB
                </span>
                <input
                  id="resume"
                  name="resume"
                  type="file"
                  accept={RESUME_ACCEPT}
                  className="sr-only"
                  onChange={(e) => pickResume(e.target.files?.[0])}
                  {...aria("resume")}
                />
              </label>
            )}
            {fieldError("resume")}
          </div>

          <div>
            <label htmlFor="linkedin" className={labelClass}>
              LinkedIn Profile
            </label>
            <IconField icon={Link2}>
              <input
                id="linkedin"
                name="linkedin"
                type="url"
                inputMode="url"
                placeholder="https://linkedin.com/in/…"
                className={controlClass(!!errors.linkedin)}
                {...aria("linkedin")}
              />
            </IconField>
            {fieldError("linkedin")}
          </div>

          <div>
            <label htmlFor="portfolio" className={labelClass}>
              Portfolio / Website
            </label>
            <IconField icon={Globe}>
              <input
                id="portfolio"
                name="portfolio"
                type="url"
                inputMode="url"
                placeholder="Optional"
                className={controlClass(false)}
              />
            </IconField>
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
              className={`${controlClass(false, false)} resize-y`}
            />
          </div>
        </FormSection>

        <div className="space-y-6 border-t border-white/10 pt-8">
          <div>
            <label className="group flex cursor-pointer items-start gap-3 text-sm text-white/70">
              <input
                type="checkbox"
                name="consent"
                value="yes"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="peer sr-only"
                {...aria("consent")}
              />
              <span
                aria-hidden="true"
                className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-all peer-focus-visible:ring-2 peer-focus-visible:ring-[#38bdf8]/60 ${
                  consent
                    ? "border-[#38bdf8] bg-[#38bdf8] shadow-[0_0_12px_rgba(56,189,248,0.6)]"
                    : errors.consent
                      ? "border-[#ff5c5c]"
                      : "border-white/30 group-hover:border-white/60"
                }`}
              >
                {consent && (
                  <Check
                    className="h-3.5 w-3.5 text-[#0a0d16]"
                    strokeWidth={3}
                  />
                )}
              </span>
              <span>
                I agree that Virtual Captains may store and use my details to
                process this application, as described in the{" "}
                <Link
                  href="/privacy"
                  className="text-[#8fd0ff] underline underline-offset-4 hover:text-[#38bdf8]"
                >
                  Privacy Policy
                </Link>
                .
              </span>
            </label>
            {fieldError("consent")}
          </div>

          {status === "error" && (
            <p
              role="alert"
              className="rounded-xl border border-[#ff5c5c]/40 bg-[#ff5c5c]/10 px-4 py-3 text-sm text-[#ffb3b3]"
            >
              {serverError} Please try again.
            </p>
          )}

          <div className="flex flex-col-reverse items-center gap-4 sm:flex-row sm:justify-between">
            <p className="text-center text-xs text-white/45 sm:text-left">
              We never share your details with third parties.
            </p>
            <button
              type="submit"
              disabled={status === "submitting"}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#e7ff3d] hover:bg-[#d8f030] px-8 py-3.5 text-sm font-bold text-[#0a0b0d] tracking-wide shadow-[0_0_24px_rgba(231,255,61,0.35)] transition-all duration-200 cursor-pointer hover:scale-102 active:scale-98 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            >
              {status === "submitting" && (
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              )}
              {status === "submitting" ? "Sending code…" : "Submit Application"}
            </button>
          </div>
        </div>
      </form>
    </BlueFrame>
  );
}
