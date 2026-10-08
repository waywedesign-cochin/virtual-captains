"use client";

import { useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { isValidPhoneNumber, type Value } from "react-phone-number-input";
import PhoneField from "../common/PhoneField";
import {
  VerifyEmailStep,
  requestCode,
  toVerifyResult,
  type VerifyResult,
} from "../common/EmailVerification";

// ---------- Validation ----------
type Audience = "individual" | "organisation";

type Values = {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  employees: string;
  message: string;
};

type Errors = Partial<Record<keyof Values | "phone", string>>;

// Order used for "focus the first invalid field"
const FIELD_ORDER = [
  "firstName",
  "lastName",
  "email",
  "phone",
  "role",
  "employees",
  "message",
] as const;

const NAME_RE = /^[\p{L}][\p{L}\p{M} .'-]*$/u;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const MESSAGE_MAX = 200;

function validateName(value: string, label: string): string | undefined {
  const v = value.trim();
  if (!v) return `${label} is required.`;
  if (v.length < 2) return `${label} must be at least 2 characters.`;
  if (v.length > 50) return `${label} is too long (max 50 characters).`;
  if (!NAME_RE.test(v))
    return `${label} can only contain letters, spaces, . ' and -`;
  return undefined;
}

function validateAll(
  values: Values,
  phone: Value | undefined,
  audience: Audience,
): Errors {
  const errors: Errors = {};

  const first = validateName(values.firstName, "First name");
  if (first) errors.firstName = first;

  const last = validateName(values.lastName, "Last name");
  if (last) errors.lastName = last;

  const email = values.email.trim();
  if (!email) errors.email = "Email is required.";
  else if (email.length > 254 || !EMAIL_RE.test(email))
    errors.email = "Please enter a valid email address.";

  if (!phone) errors.phone = "Please enter your phone number.";
  else if (!isValidPhoneNumber(phone))
    errors.phone = "That number doesn't look valid for the selected country.";

  if (audience === "organisation") {
    const role = values.role.trim();
    if (!role) errors.role = "Your role is required.";
    else if (role.length < 2)
      errors.role = "Role must be at least 2 characters.";
    else if (role.length > 60)
      errors.role = "Role is too long (max 60 characters).";

    if (!values.employees) errors.employees = "Please select the team size.";
  }

  if (values.message.length > MESSAGE_MAX)
    errors.message = `Message must be ${MESSAGE_MAX} characters or fewer.`;

  return errors;
}

// ---------- Styles ----------
const inputBase =
  "w-full min-w-0 rounded-xl border px-3.5 py-2.5 text-[14px] text-white outline-none transition-colors placeholder:text-white/35";
const okBorder = "border-white/15 focus:border-[#38bdf8]";
const errBorder = "border-red-400/70 focus:border-red-400";

// ---------- Razorpay Checkout (loaded from their CDN on demand) ----------
type RazorpaySuccess = {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
};

type RazorpayOptions = {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill: { name: string; email: string; contact: string };
  theme: { color: string };
  handler: (res: RazorpaySuccess) => void;
  modal: { ondismiss: () => void };
};

type RazorpayInstance = {
  open: () => void;
  on: (
    event: "payment.failed",
    cb: (res: { error: { description: string } }) => void,
  ) => void;
};

type RazorpayCtor = new (options: RazorpayOptions) => RazorpayInstance;

function loadRazorpay(): Promise<boolean> {
  return new Promise((resolve) => {
    if ((window as unknown as { Razorpay?: RazorpayCtor }).Razorpay) {
      return resolve(true);
    }
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
}

function EnrollDialog({
  onClose,
  programTitle,
  programSlug,
  price,
}: {
  onClose: () => void;
  programTitle: string;
  programSlug: string;
  price?: string;
}) {
  // Programs priced "Contact us" have no digits, so they can't be paid online
  const payable = !!price && /\d/.test(price);

  const [submitted, setSubmitted] = useState(false);
  const [paying, setPaying] = useState(false);
  const [payError, setPayError] = useState<string | null>(null);
  // Set while the "Verify your email" step is showing (payable programs)
  const [verify, setVerify] = useState<{ email: string; token: string } | null>(
    null,
  );
  const [audience, setAudience] = useState<Audience>("individual");
  const [values, setValues] = useState<Values>({
    firstName: "",
    lastName: "",
    email: "",
    role: "",
    employees: "",
    message: "",
  });
  const [phone, setPhone] = useState<Value | undefined>();
  const [errors, setErrors] = useState<Errors>({});

  // Close on Escape (not while a payment is in progress)
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !paying) onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose, paying]);

  // Lock page scroll (pause Lenis + native body scroll) while open
  useEffect(() => {
    const lenis = window.__lenis;
    lenis?.stop();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      lenis?.start();
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  // Clear a field's error as soon as the user edits it
  function setField(name: keyof Values, value: string) {
    setValues((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  }

  // Validate a single field when the user leaves it
  function blurField(name: keyof Values) {
    const all = validateAll(values, phone, audience);
    setErrors((prev) => ({ ...prev, [name]: all[name] }));
  }

  function changeAudience(next: Audience) {
    setAudience(next);
    // Organisation-only errors no longer apply when switching back
    setErrors((prev) => ({ ...prev, role: undefined, employees: undefined }));
  }

  // Props shared by every controlled field
  const fieldProps = (name: keyof Values) => ({
    name,
    value: values[name],
    onChange: (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) => setField(name, e.target.value),
    onBlur: () => blurField(name),
    "aria-invalid": errors[name] ? true : undefined,
    "aria-describedby": errors[name] ? `enroll-${name}-error` : undefined,
  });

  const cls = (name: keyof Values, bg = "bg-white/5") =>
    `${inputBase} ${bg} ${errors[name] ? errBorder : okBorder}`;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (paying) return;
    setPayError(null);

    const errs = validateAll(values, phone, audience);
    setErrors(errs);

    const firstInvalid = FIELD_ORDER.find((k) => errs[k]);
    if (firstInvalid) {
      e.currentTarget
        .querySelector<HTMLElement>(
          firstInvalid === "phone"
            ? "#enroll-phone"
            : `[name="${firstInvalid}"]`,
        )
        ?.focus();
      return;
    }

    // Not payable online: just show the confirmation (wire to a leads API later)
    if (!payable) return setSubmitted(true);

    // Payable: email a code first; payment starts from the verify step
    setPaying(true);
    try {
      const email = values.email.trim();
      setVerify({ email, token: await requestCode(email) });
    } catch (err) {
      setPayError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setPaying(false);
    }
  }

  /** Runs once the code is entered: creates the order, then opens Checkout. */
  async function pay(code: string, token: string): Promise<VerifyResult> {
    const firstName = values.firstName.trim();
    const lastName = values.lastName.trim();
    const email = values.email.trim();
    const fullName = `${firstName} ${lastName}`.trim();
    const isOrg = audience === "organisation";

    setPaying(true);
    try {
      // 1. Create the order on the server (it checks the code)
      const res = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug: programSlug,
          programTitle,
          name: fullName,
          email,
          phone,
          audience,
          role: isOrg ? values.role.trim() : "",
          employees: isOrg ? values.employees : "",
          message: values.message.trim(),
          code,
          token,
        }),
      });
      if (!res.ok) {
        setPaying(false);
        return toVerifyResult(res);
      }
      const order = await res.json();

      // 2. Load Checkout and open it
      const loaded = await loadRazorpay();
      const Rzp = (window as unknown as { Razorpay?: RazorpayCtor }).Razorpay;
      if (!loaded || !Rzp)
        throw new Error("Could not load the payment window.");

      const rzp = new Rzp({
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        name: "Virtual Captains",
        description: programTitle,
        order_id: order.orderId,
        prefill: { name: fullName, email, contact: phone as string },
        theme: { color: "#2563eb" },
        handler: async (payment) => {
          // 3. Verify the signature on the server
          try {
            const v = await fetch("/api/razorpay/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payment),
            });
            const data = await v.json();
            if (!v.ok || !data.verified) throw new Error();
            setVerify(null);
            setSubmitted(true);
          } catch {
            setVerify(null);
            setPayError(
              "Payment received but we couldn't confirm it. Please contact us with your payment ID: " +
                payment.razorpay_payment_id,
            );
          } finally {
            setPaying(false);
          }
        },
        modal: { ondismiss: () => setPaying(false) },
      });

      // Failed payment: back to the form with the reason (dismissing the
      // window instead keeps the verify step, so "Pay" can be retried)
      rzp.on("payment.failed", (r) => {
        setVerify(null);
        setPayError(r.error.description || "Payment failed. Please try again.");
        setPaying(false);
      });

      rzp.open();
      return "ok";
    } catch (err) {
      setPaying(false);
      return {
        error: err instanceof Error ? err.message : "Something went wrong.",
      };
    }
  }

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="enroll-title"
    >
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={() => {
          if (!paying) onClose();
        }}
      />

      <div
        data-lenis-prevent
        style={{ maxHeight: "min(90dvh, calc(100dvh - 2rem))" }}
        className="relative z-10 w-full max-w-110 overflow-y-auto overscroll-contain rounded-3xl border border-white/10 bg-[#0b0e14] p-6 text-white shadow-[0_40px_100px_-20px_rgba(37,99,235,0.35)] scheme-dark sm:p-9"
      >
        {/* Blue glow, same look as the page hero */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-24 left-1/2 h-48 w-96 -translate-x-1/2 rounded-full bg-[#2563eb]/25 blur-3xl"
        />

        <button
          type="button"
          onClick={onClose}
          disabled={paying}
          aria-label="Close"
          className="absolute right-5 top-5 z-10 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-white/50 transition-colors hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-4 w-4 fill-none stroke-current stroke-2"
          >
            <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
          </svg>
        </button>

        {submitted ? (
          <div className="relative flex flex-col items-center py-8 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#38bdf8]/10">
              <svg
                viewBox="0 0 24 24"
                className="h-7 w-7 fill-none stroke-[#38bdf8] stroke-2"
              >
                <path
                  d="M5 13l4 4L19 7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <h3 className="mt-5 font-serif text-2xl text-white">
              {payable ? "Payment successful" : "Thanks — we'll be in touch"}
            </h3>
            <p className="mt-2 max-w-80 text-[13px] leading-relaxed text-white/60">
              {payable
                ? `You're enrolled in ${programTitle}. We'll email you the next steps shortly.`
                : "Our team will reach out to you shortly."}
            </p>
          </div>
        ) : verify ? (
          <div className="relative">
            <VerifyEmailStep
              email={verify.email}
              token={verify.token}
              onTokenChange={(token) => setVerify({ ...verify, token })}
              onVerify={pay}
              onEdit={() => setVerify(null)}
              submitLabel={paying ? "Processing…" : "Verify & pay"}
              headingId="enroll-title"
            />
          </div>
        ) : (
          <form className="relative" onSubmit={handleSubmit} noValidate>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-1 text-xs font-medium text-[#8b9cff]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#38bdf8]" />
              Enrollment
            </div>

            <h3
              id="enroll-title"
              className="pr-8 font-serif text-2xl leading-snug"
            >
              Enroll in{" "}
              <span className="italic text-[#8b9cff]">{programTitle}</span>
            </h3>
            {price && (
              <p className="mt-1.5 text-[13px] text-white/60">
                Program fee:{" "}
                <span className="font-semibold text-white">{price}</span>
              </p>
            )}

            <div className="mt-6 flex flex-col gap-4">
              {/* Individual vs Organisation */}
              <div className="flex gap-4">
                {(["individual", "organisation"] as const).map((v) => (
                  <label
                    key={v}
                    className="flex cursor-pointer items-center gap-2"
                  >
                    <input
                      type="radio"
                      name="enroll-audience"
                      value={v}
                      checked={audience === v}
                      onChange={() => changeAudience(v)}
                      className="h-4 w-4 cursor-pointer accent-[#38bdf8]"
                    />
                    <span className="text-[13px] font-medium capitalize text-white/85">
                      {v}
                    </span>
                  </label>
                ))}
              </div>

              {/* First & Last name */}
              <div className="flex w-full flex-col gap-4 sm:flex-row">
                <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                  <label
                    htmlFor="enroll-firstName"
                    className="text-[12px] font-medium text-white/70"
                  >
                    First Name
                    <Req />
                  </label>
                  <input
                    id="enroll-firstName"
                    type="text"
                    autoComplete="given-name"
                    placeholder="Jane"
                    maxLength={50}
                    className={cls("firstName")}
                    {...fieldProps("firstName")}
                  />
                  <Err id="enroll-firstName-error" msg={errors.firstName} />
                </div>
                <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                  <label
                    htmlFor="enroll-lastName"
                    className="text-[12px] font-medium text-white/70"
                  >
                    Last Name
                    <Req />
                  </label>
                  <input
                    id="enroll-lastName"
                    type="text"
                    autoComplete="family-name"
                    placeholder="Doe"
                    maxLength={50}
                    className={cls("lastName")}
                    {...fieldProps("lastName")}
                  />
                  <Err id="enroll-lastName-error" msg={errors.lastName} />
                </div>
              </div>

              <div className="flex w-full flex-col gap-1.5">
                <label
                  htmlFor="enroll-email"
                  className="text-[12px] font-medium text-white/70"
                >
                  Work Email
                  <Req />
                </label>
                <input
                  id="enroll-email"
                  type="email"
                  autoComplete="email"
                  placeholder="jane@company.com"
                  maxLength={254}
                  className={cls("email")}
                  {...fieldProps("email")}
                />
                <Err id="enroll-email-error" msg={errors.email} />
              </div>

              {/* Phone */}
              <div className="flex w-full flex-col gap-1.5">
                <label
                  htmlFor="enroll-phone"
                  className="text-[12px] font-medium text-white/70"
                >
                  Phone Number
                  <Req />
                </label>
                <PhoneField
                  id="enroll-phone"
                  value={phone}
                  onChange={(v) => {
                    setPhone(v);
                    if (errors.phone)
                      setErrors((prev) => ({ ...prev, phone: undefined }));
                  }}
                  invalid={Boolean(errors.phone)}
                  describedBy={errors.phone ? "enroll-phone-error" : undefined}
                />
                <Err id="enroll-phone-error" msg={errors.phone} />
              </div>

              {/* Organisation-only fields */}
              {audience === "organisation" && (
                <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="flex w-full flex-col gap-1.5">
                    <label
                      htmlFor="enroll-role"
                      className="text-[12px] font-medium text-white/70"
                    >
                      Your Role/Designation
                      <Req />
                    </label>
                    <input
                      id="enroll-role"
                      type="text"
                      placeholder="e.g. Sales Manager"
                      maxLength={60}
                      className={cls("role")}
                      {...fieldProps("role")}
                    />
                    <Err id="enroll-role-error" msg={errors.role} />
                  </div>

                  <div className="flex w-full flex-col gap-1.5">
                    <label
                      htmlFor="enroll-employees"
                      className="text-[12px] font-medium text-white/70"
                    >
                      Number of Employees
                      <Req />
                    </label>
                    <select
                      id="enroll-employees"
                      className={`${cls("employees", "bg-[#0b0e14]")} cursor-pointer`}
                      {...fieldProps("employees")}
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
                    <Err id="enroll-employees-error" msg={errors.employees} />
                  </div>
                </div>
              )}

              <div className="flex w-full flex-col gap-1.5">
                <label
                  htmlFor="enroll-message"
                  className="text-[12px] font-medium text-white/70"
                >
                  Message
                </label>
                <textarea
                  id="enroll-message"
                  rows={2}
                  placeholder="Anything we should know?"
                  maxLength={MESSAGE_MAX}
                  className={`${cls("message")} resize-none`}
                  {...fieldProps("message")}
                />
                <div className="flex items-start justify-between gap-3">
                  <Err id="enroll-message-error" msg={errors.message} />
                  <span className="ml-auto text-[11px] text-white/40">
                    {values.message.length}/{MESSAGE_MAX}
                  </span>
                </div>
              </div>
            </div>

            {payError && (
              <p
                role="alert"
                className="mt-5 rounded-xl border border-red-400/30 bg-red-500/10 px-3.5 py-2.5 text-[13px] text-red-300"
              >
                {payError}
              </p>
            )}

            <button
              type="submit"
              disabled={paying}
              className="mt-6 w-full cursor-pointer rounded-full bg-[#2563eb] py-3 text-sm font-bold text-white shadow-[0_12px_30px_-10px_#2563eb] transition-colors hover:bg-[#1d4ed8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#38bdf8]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b0e14] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {paying
                ? payable
                  ? "Sending code…"
                  : "Processing…"
                : payable
                  ? "Pay now"
                  : "Request callback"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

/**
 * "Enroll now" trigger + dialog. The dialog is portalled to <body> because
 * the program card has `overflow-hidden` and a hover `translate` transform,
 * which would clip / misposition a `fixed` element rendered inside it.
 * Mounting the dialog only while open also resets the form on every open.
 */
export default function EnrollNowButton({
  programTitle,
  programSlug,
  price,
  className,
  children = "Enroll now",
}: {
  programTitle: string;
  programSlug: string;
  price?: string;
  className?: string;
  children?: ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={className}>
        {children}
      </button>
      {open &&
        createPortal(
          <EnrollDialog
            onClose={() => setOpen(false)}
            programTitle={programTitle}
            programSlug={programSlug}
            price={price}
          />,
          document.body,
        )}
    </>
  );
}

/** Required-field marker (decorative — validation is handled in JS). */
function Req() {
  return (
    <span className="text-red-400" aria-hidden="true">
      {" "}
      *
    </span>
  );
}

/** Inline field error (renders nothing when there is no message). */
function Err({ id, msg }: { id: string; msg?: string }) {
  if (!msg) return null;
  return (
    <p id={id} role="alert" className="text-[12px] text-red-400">
      {msg}
    </p>
  );
}
