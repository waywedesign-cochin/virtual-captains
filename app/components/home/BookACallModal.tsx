"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { isValidPhoneNumber, type Value } from "react-phone-number-input";
import PhoneField from "../common/PhoneField";

type ModalMode = "call" | "eligibility" | "waitlist" | "notify";

/**
 * Dialog with four modes:
 *  - "call" (default): general "Book a Call" enquiry. Submits to
 *    /api/applications with type "call"; the team follows up to schedule.
 *  - "eligibility": program application. Submits to /api/applications; the
 *    team reviews applications and sends a payment link only to selected ones.
 *  - "waitlist": same fields, for programs that haven't opened yet.
 *  - "notify": email-only signup. Submits to /api/notify, which saves the
 *    email to a Resend Audience so the client can send a broadcast later.
 *
 * call / eligibility / waitlist are email-verified: after the form is filled,
 * a 6-digit code is emailed and must be entered before the submission is sent.
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
  location,
}: {
  open: boolean;
  onClose: () => void;
  /** Which audience the form starts on (e.g. "organisation" on /organisations). */
  defaultAudience?: "individual" | "organisation";
  mode?: ModalMode;
  /** Program being applied for (eligibility / waitlist modes). */
  programTitle?: string;
  programSlug?: string;
  /** Where the batch would run (notify mode), e.g. "Bangalore, India". */
  location?: string;
}) {
  const isEligibility = mode === "eligibility";
  const isWaitlist = mode === "waitlist";
  const isNotify = mode === "notify";
  const isApplication = isEligibility || isWaitlist; // program forms (not general call)

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [audience, setAudience] = useState<"individual" | "organisation">(
    defaultAudience,
  );
  const dialogRef = useRef<HTMLDivElement>(null);
  const [phone, setPhone] = useState<Value | undefined>();
  const [phoneError, setPhoneError] = useState<string | null>(null);

  // Email verification
  const [step, setStep] = useState<"form" | "verify">("form");
  const [pending, setPending] = useState<Record<string, unknown> | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [verifyError, setVerifyError] = useState<string | null>(null);
  const [resent, setResent] = useState(false);

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
      setStep("form");
      setPending(null);
      setToken(null);
      setCode("");
      setVerifyError(null);
      setResent(false);
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
      : "Leave your details and our team will get back to you shortly.";

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

  const RATE_LIMIT_MSG =
    "Too many attempts. Please wait a few minutes and try again.";

  /** Emails a 6-digit code and stores the signed token returned by the API. */
  const sendCode = async (email: string) => {
    const res = await fetch("/api/applications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "send-code", email }),
    });
    if (res.status === 429) throw new Error("rate-limited");
    if (!res.ok) throw new Error("Could not send code");
    const json = await res.json();
    setToken(json.token);
  };

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
            {isNotify ? (
              <>
                <h3 className="mt-5 font-sans text-2xl text-[#101010]">
                  You&apos;re on the list
                </h3>
                <p className="mt-2 max-w-80 font-sans text-[13px] leading-relaxed text-black/55">
                  We&apos;ll email you when{" "}
                  {location ?? programTitle ?? "this batch"} opens.
                </p>
              </>
            ) : isEligibility ? (
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
                  Thanks, we&apos;ll be in touch
                </h3>
                <p className="mt-2 max-w-80 font-sans text-[13px] leading-relaxed text-black/55">
                  We&apos;ve received your request and will contact you shortly
                  to schedule your call.
                </p>
              </>
            )}
          </div>
        ) : isNotify ? (
          <NotifyForm
            programSlug={programSlug}
            location={location}
            onDone={() => setSubmitted(true)}
          />
        ) : step === "verify" && pending ? (
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              if (!/^\d{6}$/.test(code)) {
                setVerifyError("Please enter the 6-digit code.");
                return;
              }
              setSubmitting(true);
              setVerifyError(null);
              try {
                const res = await fetch("/api/applications", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ ...pending, code, token }),
                });
                if (res.status === 429) {
                  setVerifyError(RATE_LIMIT_MSG);
                  return;
                }
                if (res.status === 400) {
                  setVerifyError(
                    "That code is incorrect or has expired. Please try again or resend a new code.",
                  );
                  return;
                }
                if (!res.ok) throw new Error("Request failed");
                setSubmitted(true);
              } catch {
                setVerifyError("Something went wrong. Please try again.");
              } finally {
                setSubmitting(false);
              }
            }}
          >
            <h3
              id="book-a-call-title"
              className="pr-8 font-sans text-2xl text-[#101010]"
            >
              Verify your email
            </h3>
            <p className="mt-1.5 font-sans text-[13px] leading-relaxed text-black/55">
              We sent a 6-digit code to{" "}
              <span className="font-medium text-black/80">
                {String(pending.email)}
              </span>
              . Enter it below to complete your submission.
            </p>

            <div className="mt-6 flex w-full flex-col gap-1.5">
              <span className="text-[12px] font-medium text-black/70">
                Verification code
                <Req />
              </span>
              <OtpInput
                value={code}
                length={6}
                onChange={(v) => {
                  setCode(v);
                  if (verifyError) setVerifyError(null);
                }}
              />
            </div>

            {verifyError && (
              <p className="mt-4 text-[12px] text-red-600" role="alert">
                {verifyError}
              </p>
            )}
            {resent && !verifyError && (
              <p className="mt-4 text-[12px] text-black/55">
                A new code has been sent.
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="mt-6 w-full cursor-pointer rounded-full bg-[#3478e5] py-3 text-[13.5px] font-medium text-white shadow-[0_8px_20px_-8px_rgba(52,120,229,0.6)] transition-colors hover:bg-[#2563eb] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3478e5]/50 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "Verifying…" : "Verify & submit"}
            </button>

            <div className="mt-4 flex items-center justify-between text-[12px]">
              <button
                type="button"
                disabled={submitting}
                onClick={async () => {
                  setVerifyError(null);
                  setResent(false);
                  setSubmitting(true);
                  try {
                    await sendCode(String(pending.email));
                    setCode("");
                    setResent(true);
                  } catch (err) {
                    setVerifyError(
                      err instanceof Error && err.message === "rate-limited"
                        ? RATE_LIMIT_MSG
                        : "Couldn't resend the code. Try again.",
                    );
                  } finally {
                    setSubmitting(false);
                  }
                }}
                className="cursor-pointer text-[#3478e5] hover:underline disabled:opacity-60"
              >
                Resend code
              </button>
              <button
                type="button"
                onClick={() => {
                  setStep("form");
                  setCode("");
                  setVerifyError(null);
                  setResent(false);
                }}
                className="cursor-pointer text-black/55 hover:text-black hover:underline"
              >
                Edit details
              </button>
            </div>
          </form>
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

              // Capture the form now; it's sent after the email is verified
              const data = new FormData(e.currentTarget);
              const payload = {
                type: isApplication ? mode : "call", // "eligibility" | "waitlist" | "call"
                programTitle,
                programSlug,
                firstName: data.get("firstName"),
                lastName: data.get("lastName"),
                email: data.get("email"),
                phone,
                startup: data.get("startup"),
                message: data.get("message"),
                audience: isApplication ? undefined : audience,
                role: data.get("role"),
                employees: data.get("employees"),
              };

              setSubmitting(true);
              setSubmitError(null);
              try {
                await sendCode(String(payload.email));
                setPending(payload);
                setCode("");
                setVerifyError(null);
                setResent(false);
                setStep("verify");
              } catch (err) {
                setSubmitError(
                  err instanceof Error && err.message === "rate-limited"
                    ? RATE_LIMIT_MSG
                    : "Couldn't send the verification code. Check your email address and try again.",
                );
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
                    defaultValue={String(pending?.firstName ?? "")}
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
                    defaultValue={String(pending?.lastName ?? "")}
                    placeholder="Doe"
                    className="w-full min-w-0 rounded-lg border border-black/15 px-3.5 py-2.5 text-[14px] outline-none transition-colors placeholder:text-slate-400 focus:border-[#3478e5]"
                  />
                </label>
              </div>

              <label className="flex flex-col gap-1.5 w-full">
                <span className="text-[12px] font-medium text-black/70">
                  Email
                  <Req />
                </span>
                <input
                  type="email"
                  name="email"
                  required
                  defaultValue={String(pending?.email ?? "")}
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
                    defaultValue={String(pending?.startup ?? "")}
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
                      name="role"
                      required
                      defaultValue={String(pending?.role ?? "")}
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
                      name="employees"
                      required
                      defaultValue={String(pending?.employees ?? "")}
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
                  defaultValue={String(pending?.message ?? "")}
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
              {submitting ? "Sending code…" : submitLabel}
            </button>
          </form>
        )}
      </div>
    </div>,
    document.body,
  );
}

/** Email-only "notify me" form. Posts to /api/notify. */
function NotifyForm({
  programSlug,
  location,
  onDone,
}: {
  programSlug?: string;
  location?: string;
  onDone: () => void;
}) {
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        setStatus("loading");
        try {
          const res = await fetch("/api/notify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: data.get("email"),
              website: data.get("website"), // honeypot
              programSlug,
              location,
            }),
          });
          if (!res.ok) throw new Error("Request failed");
          onDone();
        } catch {
          setStatus("error");
        }
      }}
    >
      <h3
        id="book-a-call-title"
        className="pr-8 font-sans text-2xl text-[#101010]"
      >
        Notify me
      </h3>
      <p className="mt-1.5 font-sans text-[13px] leading-relaxed text-black/55">
        {location
          ? `Get an email when the ${location} batch opens.`
          : "Get an email when new batches open."}
      </p>

      <label className="mt-6 flex w-full flex-col gap-1.5">
        <span className="text-[12px] font-medium text-black/70">
          Email
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

      {/* Honeypot: hidden from people, bots fill it in */}
      <input
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="hidden"
      />

      {status === "error" && (
        <p className="mt-4 text-[12px] text-red-600" role="alert">
          Something went wrong. Please try again.
        </p>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="mt-6 w-full cursor-pointer rounded-full bg-[#3478e5] py-3 text-[13.5px] font-medium text-white shadow-[0_8px_20px_-8px_rgba(52,120,229,0.6)] transition-colors hover:bg-[#2563eb] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3478e5]/50 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === "loading" ? "Saving…" : "Notify me"}
      </button>

      <p className="mt-3 text-center text-[11px] text-black/45">
        We&apos;ll only email you about batch openings. Unsubscribe anytime.
      </p>
    </form>
  );
}

/** Button that opens the dialog in a given mode; each instance owns its open state. */
function ModalButton({
  mode,
  label,
  programTitle,
  programSlug,
  location,
  className,
}: {
  mode: ModalMode;
  label: ReactNode;
  programTitle?: string;
  programSlug?: string;
  location?: string;
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
        location={location}
      />
    </>
  );
}

type ProgramButtonProps = {
  programTitle?: string;
  programSlug?: string;
  location?: string;
  className?: string;
};

/** "Check eligibility" CTA: opens the application form. */
export function CheckEligibilityButton(props: ProgramButtonProps) {
  return (
    <ModalButton mode="eligibility" label="Check Eligibility" {...props} />
  );
}

/** "Join the online waitlist" CTA. */
export function WaitlistButton(props: ProgramButtonProps) {
  return (
    <ModalButton mode="waitlist" label="Join the online waitlist" {...props} />
  );
}

/** "Notify me" CTA: email-only signup for batches that aren't open yet. */
export function NotifyButton(props: ProgramButtonProps) {
  return <ModalButton mode="notify" label="Notify me →" {...props} />;
}

/** 6-box one-time-code input. Keeps a single string value. */
function OtpInput({
  value,
  onChange,
  length = 6,
}: {
  value: string;
  onChange: (v: string) => void;
  length?: number;
}) {
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const digits = Array.from({ length }, (_, i) => value[i] ?? "");

  const focus = (i: number) =>
    refs.current[Math.max(0, Math.min(length - 1, i))]?.focus();

  return (
    <div className="flex w-full justify-between gap-2">
      {digits.map((d, i) => (
        <input
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          type="text"
          inputMode="numeric"
          autoComplete={i === 0 ? "one-time-code" : "off"}
          maxLength={1}
          value={d}
          aria-label={`Digit ${i + 1}`}
          onFocus={(e) => e.target.select()}
          onChange={(e) => {
            const v = e.target.value.replace(/\D/g, "").slice(-1);
            if (!v) return;
            const idx = Math.min(i, value.length);
            const arr = value.split("");
            arr[idx] = v;
            onChange(arr.join("").slice(0, length));
            focus(idx + 1);
          }}
          onKeyDown={(e) => {
            if (e.key === "Backspace") {
              e.preventDefault();
              const idx = digits[i] ? i : i - 1;
              if (idx < 0) return;
              onChange(value.slice(0, idx) + value.slice(idx + 1));
              focus(idx);
            } else if (e.key === "ArrowLeft") {
              focus(i - 1);
            } else if (e.key === "ArrowRight") {
              focus(i + 1);
            }
          }}
          onPaste={(e) => {
            e.preventDefault();
            const p = e.clipboardData
              .getData("text")
              .replace(/\D/g, "")
              .slice(0, length);
            onChange(p);
            focus(p.length >= length ? length - 1 : p.length);
          }}
          className="h-12 w-full min-w-0 rounded-lg border border-black/15 text-center text-[20px] font-medium outline-none transition-colors focus:border-[#3478e5]"
        />
      ))}
    </div>
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
