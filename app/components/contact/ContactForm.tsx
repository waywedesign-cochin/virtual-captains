"use client";

import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { quickContacts, socialLinks } from "./data";

gsap.registerPlugin(ScrollTrigger);

type FormState = {
  name: string;
  phone: string;
  email: string;
  website: string;
  message: string;
};

const initialState: FormState = {
  name: "",
  phone: "",
  email: "",
  website: "",
  message: "",
};

type Status = "idle" | "submitting" | "success" | "error";

const fields: Array<{
  name: keyof FormState;
  label: string;
  type: string;
  placeholder: string;
  required: boolean;
}> = [
  { name: "name", label: "Full Name", type: "text", placeholder: "Riya Sharma", required: true },
  { name: "phone", label: "Phone Number", type: "tel", placeholder: "+91 98765 43210", required: true },
  { name: "email", label: "Work Email", type: "email", placeholder: "riya@company.com", required: true },
  { name: "website", label: "Company Website", type: "url", placeholder: "https://yourcompany.com", required: false },
];

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ContactForm() {
  const sectionRef = useRef<HTMLElement>(null);
  const leftPanelRef = useRef<HTMLDivElement>(null);
  const rightCardRef = useRef<HTMLDivElement>(null);

  const [values, setValues] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [status, setStatus] = useState<Status>("idle");

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
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
          "-=0.5"
        )
        .to(
          rightCardRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: "power3.out",
          },
          "-=0.7"
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
          "-=0.6"
        );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleChange =
    (field: keyof FormState) =>
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setValues((prev) => ({ ...prev, [field]: e.target.value }));
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: undefined }));
      }
    };

  const validate = (): boolean => {
    const next: Partial<Record<keyof FormState, string>> = {};
    if (!values.name.trim()) next.name = "Please enter your full name.";
    if (!values.phone.trim()) next.phone = "A phone number helps us follow up faster.";
    if (!values.email.trim()) next.email = "Please enter your email address.";
    else if (!emailPattern.test(values.email)) next.email = "Please enter a valid email address.";
    if (!values.message.trim()) next.message = "Let us know about your team or requirement.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;

    setStatus("submitting");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error("Request failed");
      setStatus("success");
      setValues(initialState);
    } catch {
      setStatus("error");
    }
  };

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
              <span className="font-mono text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.25em] text-[#38bdf8]">
                Direct Floor Access
              </span>
              <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-bold tracking-tight text-white">
                Feel Free to <br />
                <span className="italic text-[#8fd0ff]">Contact Us</span>
              </h2>
              <span className="mt-3 block h-1 w-12 rounded-full bg-[#e7ff3d] shadow-[0_0_12px_rgba(231,255,61,0.7)]" />

              <p className="mt-5 text-sm sm:text-[15px] leading-relaxed text-white/70">
                Share a few details about your team size, pipeline velocity,
                or sales enablement challenges — onboarding, outbound, or
                execution — and we&apos;ll connect you to the right Captain.
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
                  <li key={c.id} className="contact-item-anim will-change-transform">
                    <a
                      href={c.href}
                      target={c.id === "whatsapp" ? "_blank" : undefined}
                      rel={c.id === "whatsapp" ? "noopener noreferrer" : undefined}
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
                <span className="font-medium text-white/80">Average response time: under 1 business day</span>
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-2">
                <span className="text-[11px] text-white/40 uppercase tracking-wider mr-1">Follow:</span>
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
                Fill in the details below and we&apos;ll schedule your consultation.
              </p>
            </div>

            <form onSubmit={handleSubmit} noValidate>
              <div className="grid gap-5 sm:grid-cols-2">
                {fields.map((field) => (
                  <div key={field.name} className="form-field-anim will-change-transform">
                    <label
                      htmlFor={field.name}
                      className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-white/80"
                    >
                      {field.label}
                      {field.required && <span className="text-[#ffd60a]"> *</span>}
                    </label>
                    <input
                      id={field.name}
                      name={field.name}
                      type={field.type}
                      placeholder={field.placeholder}
                      value={values[field.name]}
                      onChange={handleChange(field.name)}
                      aria-invalid={Boolean(errors[field.name])}
                      aria-describedby={errors[field.name] ? `${field.name}-error` : undefined}
                      className={`w-full rounded-xl border bg-white/4 px-4 py-3.5 text-sm text-white placeholder:text-white/30 outline-none transition-all duration-200 focus:bg-white/[0.07] focus:ring-2 ${
                        errors[field.name]
                          ? "border-[#ff5c5c] focus:border-[#ff5c5c] focus:ring-[#ff5c5c]/20"
                          : "border-white/12 focus:border-[#38bdf8] focus:ring-[#38bdf8]/20"
                      }`}
                    />
                    {errors[field.name] && (
                      <p id={`${field.name}-error`} className="mt-1.5 text-xs text-[#ff6b6b]">
                        {errors[field.name]}
                      </p>
                    )}
                  </div>
                ))}

                <div className="sm:col-span-2 form-field-anim will-change-transform">
                  <label htmlFor="message" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-white/80">
                    Message / Revenue Motion Details<span className="text-[#ffd60a]"> *</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    placeholder="Tell us about your team size, sales cycle, current outbound process, and what good outcomes look like..."
                    value={values.message}
                    onChange={handleChange("message")}
                    aria-invalid={Boolean(errors.message)}
                    aria-describedby={errors.message ? "message-error" : undefined}
                    className={`w-full resize-none rounded-xl border bg-white/4 px-4 py-3.5 text-sm text-white placeholder:text-white/30 outline-none transition-all duration-200 focus:bg-white/[0.07] focus:ring-2 ${
                      errors.message
                        ? "border-[#ff5c5c] focus:border-[#ff5c5c] focus:ring-[#ff5c5c]/20"
                        : "border-white/12 focus:border-[#38bdf8] focus:ring-[#38bdf8]/20"
                    }`}
                  />
                  {errors.message && (
                    <p id="message-error" className="mt-1.5 text-xs text-[#ff6b6b]">
                      {errors.message}
                    </p>
                  )}
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
                  {status === "submitting" ? "Sending Request..." : "Submit Message →"}
                </button>

                <div role="status" aria-live="polite" className="text-sm">
                  {status === "success" && (
                    <div className="flex items-center gap-2 rounded-lg border border-[#22c55e]/30 bg-[#22c55e]/10 px-3.5 py-2 text-xs sm:text-sm font-medium text-[#4ade80] animate-in fade-in duration-300">
                      <span>✓</span>
                      <span>Thanks — a Captain will reach out within 1 business day.</span>
                    </div>
                  )}
                  {status === "error" && (
                    <div className="flex items-center gap-2 rounded-lg border border-[#ef4444]/30 bg-[#ef4444]/10 px-3.5 py-2 text-xs sm:text-sm font-medium text-[#f87171] animate-in fade-in duration-300">
                      <span>⚠</span>
                      <span>Something went wrong — please try WhatsApp directly.</span>
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
