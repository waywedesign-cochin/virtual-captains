"use client";

import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { quickContacts, socialLinks } from "./data";
import { isValidPhoneNumber } from "react-phone-number-input";
import PhoneField from "../common/PhoneField";
import ZoomHeading from "@/components/common/ZoomHeading";
import {
  VerifyEmailStep,
  requestCode,
  toVerifyResult,
} from "../common/EmailVerification";

gsap.registerPlugin(ScrollTrigger);

/* Same fields, order and rules as the "Book a Call" popup (BookACallModal):
   audience toggle, first/last name, email, phone with country code,
   organisation-only role + team size, message. */
type Audience = "individual" | "organisation";

type FormState = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  employees: string;
  message: string;
};

type FieldName = keyof FormState;

const initialState: FormState = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  role: "",
  employees: "",
  message: "",
};

type Status = "idle" | "submitting" | "success" | "error";

const EMPLOYEE_RANGES = [
  "1-10",
  "11-50",
  "51-100",
  "101-200",
  "201-500",
  "500+",
];

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const labelClass =
  "mb-1.5 block text-xs font-semibold uppercase tracking-wider text-white/80";

function controlClass(hasError: boolean) {
  return `w-full min-w-0 rounded-xl border bg-white/4 px-4 py-3.5 text-sm text-white placeholder:text-white/30 outline-none transition-all duration-200 focus:bg-white/[0.07] focus:ring-2 ${
    hasError
      ? "border-[#ff5c5c] focus:border-[#ff5c5c] focus:ring-[#ff5c5c]/20"
      : "border-white/12 focus:border-[#38bdf8] focus:ring-[#38bdf8]/20"
  }`;
}

export default function ContactForm() {
  const sectionRef = useRef<HTMLElement>(null);
  const leftPanelRef = useRef<HTMLDivElement>(null);
  const rightCardRef = useRef<HTMLDivElement>(null);

  const [audience, setAudience] = useState<Audience>("individual");
  const [values, setValues] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<Partial<Record<FieldName, string>>>({});
  const [status, setStatus] = useState<Status>("idle");
  // Set while the "Verify your email" step is showing
  const [verify, setVerify] = useState<{ email: string; token: string } | null>(
    null,
  );
  const [sendError, setSendError] = useState<string | null>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set([leftPanelRef.current, rightCardRef.current], {
          opacity: 1,
          x: 0,
          y: 0,
        });
        return;
      }

      // Initial states
      gsap.set(leftPanelRef.current, { opacity: 0, x: -50 });
      gsap.set(rightCardRef.current, { opacity: 0, y: 50 });
      gsap.set(".contact-item-anim", { opacity: 0, y: 15 });
      gsap.set(".form-field-anim", { opacity: 0, y: 18 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 78%",
          toggleActions: "play none none reverse",
        },
      });

      tl.to(leftPanelRef.current, {
        opacity: 1,
        x: 0,
        duration: 0.85,
        ease: "power3.out",
      })
        .to(
          ".contact-item-anim",
          {
            opacity: 1,
            y: 0,
            stagger: 0.1,
            duration: 0.6,
            ease: "power2.out",
          },
          "-=0.5",
        )
        .to(
          rightCardRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: "power3.out",
          },
          "-=0.7",
        )
        .to(
          ".form-field-anim",
          {
            opacity: 1,
            y: 0,
            stagger: 0.06,
            duration: 0.5,
            ease: "power2.out",
          },
          "-=0.6",
        );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleChange =
    (field: FieldName) =>
    (
      e: ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) => {
      setValues((prev) => ({ ...prev, [field]: e.target.value }));
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: undefined }));
      }
    };

  const isOrg = audience === "organisation";

  const validate = (): boolean => {
    const next: Partial<Record<FieldName, string>> = {};
    if (!values.firstName.trim())
      next.firstName = "Please enter your first name.";
    if (!values.lastName.trim()) next.lastName = "Please enter your last name.";
    if (!values.email.trim()) next.email = "Please enter your email address.";
    else if (!emailPattern.test(values.email))
      next.email = "Please enter a valid email address.";
    if (!values.phone) next.phone = "A phone number helps us follow up faster.";
    else if (!isValidPhoneNumber(values.phone))
      next.phone = "That number doesn't look valid for the selected country.";
    if (isOrg && !values.role.trim()) next.role = "Please enter your role.";
    if (isOrg && !values.employees)
      next.employees = "Please select your team size.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  // Step 1: validate, then email a code. The submission is sent from the
  // verify step once the code is entered.
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;

    setStatus("submitting");
    setSendError(null);
    try {
      const email = values.email.trim();
      setVerify({ email, token: await requestCode(email) });
      setStatus("idle");
    } catch (err) {
      setSendError(err instanceof Error ? err.message : null);
      setStatus("error");
    }
  };

  // Step 2: the real submission, with the code + token
  const submitVerified = async (code: string, token: string) => {
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // `name` / `phone` keep the API's existing required fields; the rest
      // are the popup-format extras.
      body: JSON.stringify({
        audience,
        name: `${values.firstName.trim()} ${values.lastName.trim()}`,
        firstName: values.firstName.trim(),
        lastName: values.lastName.trim(),
        email: values.email.trim(),
        phone: values.phone, // E.164, e.g. +919876543210
        role: isOrg ? values.role.trim() : undefined,
        employees: isOrg ? values.employees : undefined,
        message: values.message.trim(),
        code,
        token,
      }),
    });
    const result = await toVerifyResult(res);
    if (result === "ok") {
      setStatus("success");
      setValues(initialState);
      setVerify(null);
      // Bring the success panel into view (the card can be taller than the screen)
      requestAnimationFrame(() => {
        const card = rightCardRef.current;
        if (!card) return;
        const top = card.getBoundingClientRect().top + window.scrollY - 96;
        if (window.__lenis) window.__lenis.scrollTo(top);
        else window.scrollTo({ top, behavior: "smooth" });
      });
    }
    return result;
  };

  const errorText = (field: FieldName) =>
    errors[field] ? (
      <p id={`${field}-error`} className="mt-1.5 text-xs text-[#ff6b6b]">
        {errors[field]}
      </p>
    ) : null;

  const a11y = (field: FieldName) => ({
    "aria-invalid": Boolean(errors[field]),
    "aria-describedby": errors[field] ? `${field}-error` : undefined,
  });

  return (
    <section
      ref={sectionRef}
      id="contact-form"
      className="relative px-4 py-14 sm:px-8 sm:py-20 lg:px-12 lg:py-24 bg-[#040507]"
    >
      {/* Background glow effects */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-32 top-1/3 h-96 w-96 rounded-full bg-[#1c4fc0]/15 blur-[120px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 bottom-1/4 h-96 w-96 rounded-full bg-[#38bdf8]/10 blur-[130px]"
      />

      {/* Container aligned strictly with Navbar */}
      <div className="relative z-10 w-full max-w-372 mx-auto">
        <div className="grid gap-8 lg:grid-cols-[400px_1fr] lg:gap-10 xl:grid-cols-[440px_1fr]">
          {/* Left Info Panel */}
          <div
            ref={leftPanelRef}
            className="relative overflow-hidden rounded-[28px] border border-white/12 bg-linear-to-br from-[#0c1836] via-[#091228] to-[#050914] p-7 sm:p-10 text-white backdrop-blur-2xl shadow-[0_24px_60px_rgba(0,0,0,0.6)] flex flex-col justify-between will-change-transform"
          >
            {/* Ambient internal orb */}
            <div
              aria-hidden
              className="pointer-events-none absolute -right-16 -top-16 h-52 w-52 rounded-full bg-[#38bdf8]/20 blur-3xl"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute -left-12 -bottom-12 h-44 w-44 rounded-full bg-[#e7ff3d]/10 blur-3xl"
            />

            <div className="relative z-10">
              <span className="font-sans text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.25em] text-[#38bdf8]">
                Direct Floor Access
              </span>
              <ZoomHeading className="mt-2 font-serif text-2xl sm:text-3xl font-bold tracking-tight text-white">
                Feel Free to <br />
                <span className="italic text-[#8fd0ff]">Contact Us</span>
              </ZoomHeading>
              <span className="mt-3 block h-1 w-12 rounded-full bg-[#e7ff3d] shadow-[0_0_12px_rgba(231,255,61,0.7)]" />

              <p className="mt-5 text-sm sm:text-[15px] leading-relaxed text-white/70">
                Share a few details about your team size, pipeline velocity, or
                sales enablement challenges — onboarding, outbound, or execution
                — and we&apos;ll connect you to the right Captain.
              </p>

              {/* Quick Links for Individuals & Organisations */}
              <div className="mt-5 flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-semibold text-white/50 uppercase tracking-wider">
                  Programs:
                </span>
                <Link
                  href="/individuals"
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/5 px-3 py-1 text-xs font-medium text-white/90 backdrop-blur-md transition-all duration-200 hover:border-[#e7ff3d] hover:bg-white/10 hover:text-[#e7ff3d]"
                >
                  <span>For Individuals</span>
                  <span className="text-[10px]">↗</span>
                </Link>
                <Link
                  href="/organisations"
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/5 px-3 py-1 text-xs font-medium text-white/90 backdrop-blur-md transition-all duration-200 hover:border-[#38bdf8] hover:bg-white/10 hover:text-[#38bdf8]"
                >
                  <span>For Organisations</span>
                  <span className="text-[10px]">↗</span>
                </Link>
              </div>

              {/* Direct Quick Contact Links */}
              <ul className="mt-8 flex flex-col gap-3">
                {quickContacts.map((c) => (
                  <li
                    key={c.id}
                    className="contact-item-anim will-change-transform"
                  >
                    <a
                      href={c.href}
                      target={c.id === "whatsapp" ? "_blank" : undefined}
                      rel={
                        c.id === "whatsapp" ? "noopener noreferrer" : undefined
                      }
                      className="group flex items-center justify-between rounded-xl border border-white/10 bg-white/4 p-3.5 sm:p-4 text-xs sm:text-sm font-medium text-white/90 backdrop-blur-md transition-all duration-300 hover:border-white/25 hover:bg-white/8 hover:text-white"
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                            c.icon === "whatsapp"
                              ? "bg-[#25D366]/20 text-[#25D366]"
                              : "bg-[#38bdf8]/20 text-[#38bdf8]"
                          }`}
                        >
                          {c.icon === "whatsapp" ? "💬" : "✉️"}
                        </span>
                        <div>
                          <p className="text-[11px] text-white/50">{c.label}</p>
                          <p className="font-semibold text-white">{c.value}</p>
                        </div>
                      </div>
                      <span className="text-white/40 transition-transform duration-200 group-hover:translate-x-1">
                        →
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Bottom response guarantee badge & socials */}
            <div className="relative z-10 mt-8 pt-6 border-t border-white/10">
              <div className="flex items-center gap-2 text-xs text-white/70">
                <span className="h-2 w-2 rounded-full bg-[#e7ff3d] animate-pulse shadow-[0_0_8px_#e7ff3d]" />
                <span className="font-medium text-white/80">
                  Average response time: under 1 business day
                </span>
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-2">
                <span className="text-[11px] text-white/40 uppercase tracking-wider mr-1">
                  Follow:
                </span>
                {socialLinks.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full border border-white/15 bg-white/3 px-3 py-1 text-xs font-medium text-white/70 transition hover:border-[#38bdf8]/50 hover:bg-white/10 hover:text-white"
                  >
                    {s.label}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Right Form Card */}
          <div
            ref={rightCardRef}
            className="rounded-[28px] border border-white/10 bg-[#0a0d16]/85 p-6 sm:p-10 backdrop-blur-2xl shadow-[0_24px_60px_rgba(0,0,0,0.6)] will-change-transform"
          >
            <div className="mb-6">
              <h3 className="font-serif text-2xl font-bold text-white tracking-tight">
                Send Us a Message
              </h3>
              <p className="mt-1 text-xs sm:text-sm text-white/60">
                Fill in the details below and we&apos;ll schedule your
                consultation.
              </p>
            </div>

            {verify && (
              <VerifyEmailStep
                email={verify.email}
                token={verify.token}
                onTokenChange={(token) => setVerify({ ...verify, token })}
                onVerify={submitVerified}
                onEdit={() => setVerify(null)}
              />
            )}

            {status === "success" && (
              <div
                role="status"
                aria-live="polite"
                className="flex flex-col items-center gap-4 rounded-2xl border border-[#22c55e]/25 bg-[#22c55e]/6 px-6 py-12 text-center animate-in fade-in zoom-in-95 duration-300"
              >
                <span className="relative flex h-16 w-16 items-center justify-center">
                  <span className="absolute inset-0 animate-ping rounded-full bg-[#4ade80]/20" />
                  <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[#22c55e]/15 text-2xl font-bold text-[#4ade80]">
                    ✓
                  </span>
                </span>
                <h4 className="font-serif text-2xl font-bold text-white">
                  Message Sent
                </h4>
                <p className="max-w-sm text-sm leading-relaxed text-white/65">
                  Thanks for reaching out. A Captain will get back to you within
                  1 business day. We&apos;ve also emailed you a confirmation.
                </p>
                <button
                  type="button"
                  onClick={() => setStatus("idle")}
                  className="mt-2 cursor-pointer rounded-full border border-white/20 px-6 py-2.5 text-sm font-semibold text-white/85 transition-colors hover:border-[#38bdf8] hover:text-[#8fd0ff]"
                >
                  Send Another Message
                </button>
              </div>
            )}

            {/* Kept mounted (just hidden) during verification so "Edit
                details" returns to the filled-in form */}
            <form
              onSubmit={handleSubmit}
              noValidate
              hidden={Boolean(verify) || status === "success"}
            >
              <div className="grid gap-5 sm:grid-cols-2">
                {/* I am: Individual / Organisation (segmented, like the popup) */}
                <fieldset className="sm:col-span-2 form-field-anim will-change-transform">
                  <legend className={labelClass}>I am enquiring as</legend>
                  <div className="grid grid-cols-2 gap-1 rounded-full border border-white/12 bg-white/4 p-1">
                    {(["individual", "organisation"] as const).map((opt) => (
                      <label
                        key={opt}
                        className={`flex min-h-11 cursor-pointer items-center justify-center rounded-full text-sm font-semibold transition-colors has-focus-visible:ring-2 has-focus-visible:ring-[#38bdf8]/60 ${
                          audience === opt
                            ? "bg-white text-[#0a0b0d]"
                            : "text-white/65 hover:text-white"
                        }`}
                      >
                        <input
                          type="radio"
                          name="audience"
                          value={opt}
                          checked={audience === opt}
                          onChange={() => setAudience(opt)}
                          className="sr-only"
                        />
                        {opt === "individual" ? "Individual" : "Organisation"}
                      </label>
                    ))}
                  </div>
                </fieldset>

                {/* First / Last name */}
                <div className="form-field-anim will-change-transform">
                  <label htmlFor="firstName" className={labelClass}>
                    First Name<span className="text-[#ffd60a]"> *</span>
                  </label>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    autoComplete="given-name"
                    placeholder="Jane"
                    value={values.firstName}
                    onChange={handleChange("firstName")}
                    {...a11y("firstName")}
                    className={controlClass(Boolean(errors.firstName))}
                  />
                  {errorText("firstName")}
                </div>
                <div className="form-field-anim will-change-transform">
                  <label htmlFor="lastName" className={labelClass}>
                    Last Name<span className="text-[#ffd60a]"> *</span>
                  </label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    autoComplete="family-name"
                    placeholder="Doe"
                    value={values.lastName}
                    onChange={handleChange("lastName")}
                    {...a11y("lastName")}
                    className={controlClass(Boolean(errors.lastName))}
                  />
                  {errorText("lastName")}
                </div>

                {/* Email */}
                <div className="sm:col-span-2 form-field-anim will-change-transform">
                  <label htmlFor="email" className={labelClass}>
                    Email<span className="text-[#ffd60a]"> *</span>
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="jane@company.com"
                    value={values.email}
                    onChange={handleChange("email")}
                    {...a11y("email")}
                    className={controlClass(Boolean(errors.email))}
                  />
                  {errorText("email")}
                </div>

                {/* Phone with country code */}
                <div className="sm:col-span-2 form-field-anim will-change-transform">
                  <label htmlFor="phone" className={labelClass}>
                    Phone Number<span className="text-[#ffd60a]"> *</span>
                  </label>
                  <PhoneField
                    id="phone"
                    tone="dark"
                    value={values.phone || undefined}
                    onChange={(v) => {
                      setValues((prev) => ({ ...prev, phone: v ?? "" }));
                      if (errors.phone)
                        setErrors((prev) => ({ ...prev, phone: undefined }));
                    }}
                    invalid={Boolean(errors.phone)}
                    describedBy={errors.phone ? "phone-error" : undefined}
                  />
                  {errorText("phone")}
                </div>

                {/* Organisation only: role + team size */}
                {isOrg && (
                  <>
                    <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                      <label htmlFor="role" className={labelClass}>
                        Your Role / Designation
                        <span className="text-[#ffd60a]"> *</span>
                      </label>
                      <input
                        id="role"
                        name="role"
                        type="text"
                        autoComplete="organization-title"
                        placeholder="e.g. Sales Manager"
                        value={values.role}
                        onChange={handleChange("role")}
                        {...a11y("role")}
                        className={controlClass(Boolean(errors.role))}
                      />
                      {errorText("role")}
                    </div>
                    <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                      <label htmlFor="employees" className={labelClass}>
                        Number of Employees
                        <span className="text-[#ffd60a]"> *</span>
                      </label>
                      <select
                        id="employees"
                        name="employees"
                        value={values.employees}
                        onChange={handleChange("employees")}
                        {...a11y("employees")}
                        className={`${controlClass(Boolean(errors.employees))} cursor-pointer [&>option]:bg-[#0a0d16]`}
                      >
                        <option value="" disabled>
                          Select an option
                        </option>
                        {EMPLOYEE_RANGES.map((r) => (
                          <option key={r} value={r}>
                            {r}
                          </option>
                        ))}
                      </select>
                      {errorText("employees")}
                    </div>
                  </>
                )}

                {/* Message */}
                <div className="sm:col-span-2 form-field-anim will-change-transform">
                  <label htmlFor="message" className={labelClass}>
                    Message{" "}
                    <span className="font-normal normal-case tracking-normal text-white/40">
                      (optional)
                    </span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    placeholder="What would you like to talk about?"
                    value={values.message}
                    onChange={handleChange("message")}
                    {...a11y("message")}
                    className={`${controlClass(Boolean(errors.message))} resize-none`}
                  />
                  {errorText("message")}
                </div>
              </div>

              {/* Submit Row */}
              <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between form-field-anim will-change-transform">
                <button
                  type="submit"
                  disabled={status === "submitting"}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#e7ff3d] hover:bg-[#d8f030] px-8 py-3.5 text-sm font-bold text-[#0a0b0d] tracking-wide shadow-[0_0_24px_rgba(231,255,61,0.35)] transition-all duration-200 cursor-pointer hover:scale-102 active:scale-98 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {status === "submitting" && (
                    <span
                      aria-hidden
                      className="h-4 w-4 animate-spin rounded-full border-2 border-black/40 border-t-black"
                    />
                  )}
                  {status === "submitting"
                    ? "Sending Code..."
                    : "Submit Message →"}
                </button>

                <div role="status" aria-live="polite" className="text-sm">
                  {status === "error" && (
                    <div className="flex items-center gap-2 rounded-lg border border-[#ef4444]/30 bg-[#ef4444]/10 px-3.5 py-2 text-xs sm:text-sm font-medium text-[#f87171] animate-in fade-in duration-300">
                      <span>⚠</span>
                      <span>
                        {sendError ??
                          "Something went wrong — please try WhatsApp directly."}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
