"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { isValidPhoneNumber, type Value } from "react-phone-number-input";
import PhoneField from "../common/PhoneField";

type ModalMode = "call" | "eligibility" | "waitlist";

/**
 * Dialog with three modes:
 *  - "call" (default): dummy "Book a Call" form, nothing is sent anywhere.
 *  - "eligibility": program application. Submits to /api/applications; the
 *    team reviews applications and sends a payment link only to selected ones.
 *  - "waitlist": same fields, for programs that haven't opened yet.
 *
 * Closes on backdrop click, Escape, or the X button.
 */
export default function BookACallModal({
  open,
  onClose,
  defaultAudience = "individual",
  mode = "call",
  programTitle,
  programSlug,
}: {
  open: boolean;
  onClose: () => void;
  /** Which audience the form starts on (e.g. "organisation" on /organisations). */
  defaultAudience?: "individual" | "organisation";
  mode?: ModalMode;
  /** Program being applied for (eligibility / waitlist modes). */
  programTitle?: string;
  programSlug?: string;
}) {
  const isEligibility = mode === "eligibility";
  const isWaitlist = mode === "waitlist";
  const isApplication = isEligibility || isWaitlist; // anything that submits to the API

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [audience, setAudience] = useState<"individual" | "organisation">(
    defaultAudience,
  );
  const dialogRef = useRef<HTMLDivElement>(null);
  const [phone, setPhone] = useState<Value | undefined>();
  const [phoneError, setPhoneError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  // Lock the page behind the dialog while it's open: pause the site-wide
  // Lenis smooth scroller (it otherwise captures the wheel, so scrolling over
  // the form moved the page instead) and stop native body scroll.
  useEffect(() => {
    if (!open) return;
    const lenis = window.__lenis;
    lenis?.stop();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      lenis?.start();
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  // Reset back to the form the next time it's opened.
  useEffect(() => {
    if (open) {
      setSubmitted(false);
      setSubmitting(false);
      setSubmitError(null);
      setAudience(defaultAudience);
      setPhone(undefined);
      setPhoneError(null);
    }
  }, [open, defaultAudience]);

  if (!open) return null;

  const title = isEligibility
    ? "Check Eligibility"
    : isWaitlist
      ? "Join the Waitlist"
      : "Book a Call";

  const subtitle = isEligibility
    ? `Apply for ${programTitle ?? "this program"}. We review every application and get back to you with the next steps.`
    : isWaitlist
      ? `Be the first to know when ${programTitle ?? "this program"} opens. Leave your details and we'll reach out.`
      : "Dummy form — no submissions are sent anywhere yet.";

  const messagePlaceholder = isEligibility
    ? "Tell us a bit about yourself and your startup"
    : isWaitlist
      ? "Anything you'd like us to know? (optional)"
      : "What would you like to talk about?";

  const submitLabel = isEligibility
    ? "Submit application"
    : isWaitlist
      ? "Join waitlist"
      : "Submit";

  // Portal to <body> so a transformed/animated ancestor can't trap the
  // fixed overlay inside itself.
  return createPortal(
    <div
      className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="book-a-call-title"
    >
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* data-lenis-prevent: wheel/trackpad scroll the form, not the page.
          max-h in dvh so Submit stays reachable under mobile browser bars. */}
      <div
        ref={dialogRef}
        data-lenis-prevent
        // Height cap as an inline style: arbitrary max-h classes weren't
        // reliably generated here, and without a cap the form can't scroll.
        style={{ maxHeight: "min(90dvh, calc(100dvh - 2rem))" }}
        // text-[#101010]: the dialog sets its own text colour — on dark pages
        // it used to inherit white, making typed text and the country-code
        // select invisible on the white card
        className="relative z-10 w-full max-w-110 overflow-y-auto overscroll-contain text-[#101010] rounded-2xl border border-black/10 bg-white p-6 sm:p-9 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.45)]"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-5 top-5 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-black/40 transition-colors hover:bg-black/5 hover:text-black"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-4 w-4 fill-none stroke-current stroke-2"
          >
            <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
          </svg>
        </button>

        {submitted ? (
          <div className="flex flex-col items-center py-8 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#3478e5]/10">
              <svg
                viewBox="0 0 24 24"
                className="h-7 w-7 fill-none stroke-[#3478e5] stroke-2"
              >
                <path
                  d="M5 13l4 4L19 7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            {isEligibility ? (
              <>
                <h3 className="mt-5 font-sans text-2xl text-[#101010]">
                  Application received
                </h3>
                <p className="mt-2 max-w-80 font-sans text-[13px] leading-relaxed text-black/55">
                  Thanks for applying. If you&apos;re selected, we&apos;ll send
                  a payment link to your email to confirm your seat.
                </p>
              </>
            ) : isWaitlist ? (
              <>
                <h3 className="mt-5 font-sans text-2xl text-[#101010]">
                  You&apos;re on the list
                </h3>
                <p className="mt-2 max-w-80 font-sans text-[13px] leading-relaxed text-black/55">
                  Thanks for joining. We&apos;ll email you as soon as the online
                  program opens.
                </p>
              </>
            ) : (
              <>
                <h3 className="mt-5 font-sans text-2xl text-[#101010]">
                  Thanks — we&apos;ll be in touch
                </h3>
                <p className="mt-2 max-w-80 font-sans text-[13px] leading-relaxed text-black/55">
                  This is a placeholder confirmation — no call has actually been
                  booked yet.
                </p>
              </>
            )}
          </div>
        ) : (
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              if (!phone)
                return setPhoneError("Please enter your phone number.");
              if (!isValidPhoneNumber(phone))
                return setPhoneError(
                  "That number doesn't look valid for the selected country.",
                );

              // Book a Call stays a placeholder
              if (!isApplication) {
                setSubmitted(true);
                return;
              }

              // Eligibility / waitlist: send to the API
              const data = new FormData(e.currentTarget);
              setSubmitting(true);
              setSubmitError(null);
              try {
                const res = await fetch("/api/applications", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    type: mode, // "eligibility" | "waitlist"
                    programTitle,
                    programSlug,
                    firstName: data.get("firstName"),
                    lastName: data.get("lastName"),
                    email: data.get("email"),
                    phone,
                    startup: data.get("startup"),
                    message: data.get("message"),
                  }),
                });
                if (!res.ok) throw new Error("Request failed");
                setSubmitted(true);
              } catch {
                setSubmitError("Something went wrong. Please try again.");
              } finally {
                setSubmitting(false);
              }
            }}
          >
            <h3
              id="book-a-call-title"
              className="pr-8 font-sans text-2xl text-[#101010]"
            >
              {title}
            </h3>
            <p className="mt-1.5 font-sans text-[13px] leading-relaxed text-black/55">
              {subtitle}
            </p>

            <div className="mt-6 flex flex-col gap-4">
              {/* Radio Group: Individual vs Organisation (call mode only) */}
              {!isApplication && (
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="audience"
                      value="individual"
                      checked={audience === "individual"}
                      onChange={() => setAudience("individual")}
                      className="accent-[#3478e5] w-4 h-4 cursor-pointer"
                    />
                    <span className="text-[13px] font-medium text-black/80">
                      Individual
                    </span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="audience"
                      value="organisation"
                      checked={audience === "organisation"}
                      onChange={() => setAudience("organisation")}
                      className="accent-[#3478e5] w-4 h-4 cursor-pointer"
                    />
                    <span className="text-[13px] font-medium text-black/80">
                      Organisation
                    </span>
                  </label>
                </div>
              )}

              {/* First Name & Last Name */}
              <div className="flex flex-col sm:flex-row gap-4 w-full">
                <label className="flex flex-1 flex-col gap-1.5 min-w-0">
                  <span className="text-[12px] font-medium text-black/70">
                    First Name
                    <Req />
                  </span>
                  <input
                    type="text"
                    name="firstName"
                    required
                    placeholder="Jane"
                    className="w-full min-w-0 rounded-lg border border-black/15 px-3.5 py-2.5 text-[14px] outline-none transition-colors placeholder:text-slate-400 focus:border-[#3478e5]"
                  />
                </label>
                <label className="flex flex-1 flex-col gap-1.5 min-w-0">
                  <span className="text-[12px] font-medium text-black/70">
                    Last Name
                    <Req />
                  </span>
                  <input
                    type="text"
                    name="lastName"
                    required
                    placeholder="Doe"
                    className="w-full min-w-0 rounded-lg border border-black/15 px-3.5 py-2.5 text-[14px] outline-none transition-colors placeholder:text-slate-400 focus:border-[#3478e5]"
                  />
                </label>
              </div>

              <label className="flex flex-col gap-1.5 w-full">
                <span className="text-[12px] font-medium text-black/70">
                  Work Email
                  <Req />
                </span>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="jane@company.com"
                  className="w-full min-w-0 rounded-lg border border-black/15 px-3.5 py-2.5 text-[14px] outline-none transition-colors placeholder:text-slate-400 focus:border-[#3478e5]"
                />
              </label>

              {/* Phone — every country, flag + dialling code, validated */}
              <div className="flex flex-col gap-1.5 w-full">
                <label
                  htmlFor="book-call-phone"
                  className="text-[12px] font-medium text-black/70"
                >
                  Phone Number
                  <Req />
                </label>
                <PhoneField
                  id="book-call-phone"
                  value={phone}
                  onChange={(v) => {
                    setPhone(v);
                    if (phoneError) setPhoneError(null);
                  }}
                  invalid={Boolean(phoneError)}
                  describedBy={phoneError ? "book-call-phone-error" : undefined}
                />
                {phoneError && (
                  <p
                    id="book-call-phone-error"
                    className="text-[12px] text-red-600"
                  >
                    {phoneError}
                  </p>
                )}
              </div>

              {/* Eligibility only: startup name */}
              {isEligibility && (
                <label className="flex flex-col gap-1.5 w-full">
                  <span className="text-[12px] font-medium text-black/70">
                    Startup / Company Name
                  </span>
                  <input
                    type="text"
                    name="startup"
                    placeholder="e.g. Acme Labs"
                    className="w-full min-w-0 rounded-lg border border-black/15 px-3.5 py-2.5 text-[14px] outline-none transition-colors placeholder:text-slate-400 focus:border-[#3478e5]"
                  />
                </label>
              )}

              {/* Conditional: Fields Only for Organisation (call mode only) */}
              {!isApplication && audience === "organisation" && (
                <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
                  <label className="flex flex-col gap-1.5 w-full">
                    <span className="text-[12px] font-medium text-black/70">
                      Your Role/Designation
                      <Req />
                    </span>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sales Manager"
                      className="w-full min-w-0 rounded-lg border border-black/15 px-3.5 py-2.5 text-[14px] outline-none transition-colors placeholder:text-slate-400 focus:border-[#3478e5]"
                    />
                  </label>

                  <label className="flex flex-col gap-1.5 w-full">
                    <span className="text-[12px] font-medium text-black/70">
                      Number of Employees
                      <Req />
                    </span>
                    <select
                      required
                      defaultValue=""
                      className="w-full min-w-0 rounded-lg border border-black/15 px-3.5 py-2.5 text-[14px] outline-none transition-colors focus:border-[#3478e5] bg-white cursor-pointer"
                    >
                      <option value="" disabled>
                        Select an option
                      </option>
                      <option value="1-10">1-10</option>
                      <option value="11-50">11-50</option>
                      <option value="51-100">51-100</option>
                      <option value="101-200">101-200</option>
                      <option value="201-500">201-500</option>
                      <option value="500+">500+</option>
                    </select>
                  </label>
                </div>
              )}

              <label className="flex flex-col gap-1.5 w-full">
                <span className="text-[12px] font-medium text-black/70">
                  Message
                </span>
                <textarea
                  name="message"
                  rows={2}
                  placeholder={messagePlaceholder}
                  className="w-full min-w-0 resize-none rounded-lg border border-black/15 px-3.5 py-2.5 text-[14px] outline-none transition-colors placeholder:text-slate-400 focus:border-[#3478e5]"
                />
              </label>
            </div>

            {submitError && (
              <p className="mt-4 text-[12px] text-red-600" role="alert">
                {submitError}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="mt-6 w-full cursor-pointer rounded-full bg-[#3478e5] py-3 text-[13.5px] font-medium text-white shadow-[0_8px_20px_-8px_rgba(52,120,229,0.6)] transition-colors hover:bg-[#2563eb] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3478e5]/50 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "Submitting…" : submitLabel}
            </button>
          </form>
        )}
      </div>
    </div>,
    document.body,
  );
}

/** Button that opens the dialog in a given mode; each instance owns its open state. */
function ModalButton({
  mode,
  label,
  programTitle,
  programSlug,
  className,
}: {
  mode: ModalMode;
  label: ReactNode;
  programTitle?: string;
  programSlug?: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={className}>
        {label}
      </button>
      <BookACallModal
        open={open}
        onClose={() => setOpen(false)}
        mode={mode}
        programTitle={programTitle}
        programSlug={programSlug}
      />
    </>
  );
}

type ProgramButtonProps = {
  programTitle?: string;
  programSlug?: string;
  className?: string;
};

/** "Check eligibility" CTA: opens the application form. */
export function CheckEligibilityButton(props: ProgramButtonProps) {
  return (
    <ModalButton mode="eligibility" label="Check eligibility" {...props} />
  );
}

/** "Join the online waitlist" CTA. */
export function WaitlistButton(props: ProgramButtonProps) {
  return (
    <ModalButton mode="waitlist" label="Join the online waitlist" {...props} />
  );
}

/** Required-field marker (decorative — the input itself carries `required`). */
function Req() {
  return (
    <span className="text-red-500" aria-hidden="true">
      {" "}
      *
    </span>
  );
}
