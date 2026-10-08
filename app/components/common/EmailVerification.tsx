"use client";

import { useRef, useState } from "react";

/**
 * Email verification for the site forms (same flow as the Book a Call popup):
 *  1. The form validates, then calls `requestCode(email)`; a 6-digit code is
 *     emailed and a signed token comes back.
 *  2. `<VerifyEmailStep>` collects the code and calls `onVerify(code, token)`,
 *     where the form sends its real submission with `code` + `token` added.
 *     The API rejects it unless the code matches that email.
 */

export const RATE_LIMIT_MSG =
  "Too many attempts. Please wait a few minutes and try again.";

/**
 * Emails a code to `email`; resolves to the signed token. Pass the form's
 * honeypot value as `website` so bots never trigger an email.
 */
export async function requestCode(
  email: string,
  website?: string,
): Promise<string> {
  const res = await fetch("/api/verify-email", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, website }),
  });
  if (res.status === 429) throw new Error(RATE_LIMIT_MSG);
  if (!res.ok) {
    throw new Error(
      "Couldn't send the verification code. Check your email address and try again.",
    );
  }
  return (await res.json()).token;
}

/** Outcome of a verified submission, as `onVerify` reports it. */
export type VerifyResult = "ok" | "bad-code" | { error: string };

/** Turns a submission response into a VerifyResult. */
export async function toVerifyResult(res: Response): Promise<VerifyResult> {
  if (res.ok) return "ok";
  if (res.status === 429) return { error: RATE_LIMIT_MSG };
  const json = await res.json().catch(() => ({}));
  if (json.reason === "bad-code") return "bad-code";
  return { error: json.error || "Something went wrong. Please try again." };
}

const TONES = {
  light: {
    title: "text-[#101010]",
    text: "text-black/55",
    strong: "text-black/80",
    label: "text-black/70",
    box: "border-black/15 bg-white text-[#101010] focus:border-[#3478e5]",
    error: "text-red-600",
    link: "text-[#3478e5]",
    subtle: "text-black/55 hover:text-black",
    button:
      "bg-[#3478e5] text-white hover:bg-[#2563eb] focus-visible:ring-[#3478e5]/50",
  },
  dark: {
    title: "text-white",
    text: "text-white/60",
    strong: "text-white",
    label: "text-white/70",
    box: "border-white/15 bg-white/5 text-white focus:border-[#38bdf8]",
    error: "text-[#ff6b6b]",
    link: "text-[#38bdf8]",
    subtle: "text-white/55 hover:text-white",
    button:
      "bg-linear-to-r from-[#2563eb] to-[#0284c7] text-white hover:brightness-110 focus-visible:ring-[#38bdf8]/50",
  },
};

export function VerifyEmailStep({
  email,
  token,
  onTokenChange,
  onVerify,
  onEdit,
  tone = "dark",
  submitLabel = "Verify & submit",
  headingId,
  fullWidth = false,
}: {
  email: string;
  token: string;
  onTokenChange: (token: string) => void;
  /** Send the real submission with this code + token. */
  onVerify: (code: string, token: string) => Promise<VerifyResult>;
  /** Back to the filled-in form. */
  onEdit: () => void;
  tone?: keyof typeof TONES;
  submitLabel?: string;
  headingId?: string;
  /** Stretch the code boxes and button to the full width (small popups). */
  fullWidth?: boolean;
}) {
  // Compact: never wider than the 6 boxes (304px), but shrinks on small phones
  const width = fullWidth ? "w-full" : "w-full max-w-76";
  const t = TONES[tone];
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resent, setResent] = useState(false);

  return (
    <form
      noValidate
      onSubmit={async (e) => {
        e.preventDefault();
        if (!/^\d{6}$/.test(code)) {
          setError("Please enter the 6-digit code.");
          return;
        }
        setBusy(true);
        setError(null);
        try {
          const result = await onVerify(code, token);
          if (result === "bad-code") {
            setError(
              "That code is incorrect or has expired. Please try again or resend a new code.",
            );
          } else if (result !== "ok") {
            setError(result.error);
          }
        } catch {
          setError("Something went wrong. Please try again.");
        } finally {
          setBusy(false);
        }
      }}
    >
      <h3 id={headingId} className={`font-sans text-2xl ${t.title}`}>
        Verify your email
      </h3>
      <p className={`mt-1.5 font-sans text-[13px] leading-relaxed ${t.text}`}>
        We sent a 6-digit code to{" "}
        <span className={`font-medium break-all ${t.strong}`}>{email}</span>. Enter it
        below to complete your submission.
      </p>

      <div className="mt-6 flex w-full flex-col gap-1.5">
        <span className={`text-[12px] font-medium ${t.label}`}>
          Verification code
        </span>
        <OtpInput
          value={code}
          boxClass={t.box}
          fullWidth={fullWidth}
          onChange={(v) => {
            setCode(v);
            if (error) setError(null);
          }}
        />
      </div>

      {error && (
        <p className={`mt-4 text-[12px] ${t.error}`} role="alert">
          {error}
        </p>
      )}
      {resent && !error && (
        <p className={`mt-4 text-[12px] ${t.text}`} role="status">
          A new code has been sent.
        </p>
      )}

      <button
        type="submit"
        disabled={busy}
        className={`mt-6 ${width} cursor-pointer rounded-full py-3 text-[13.5px] font-semibold transition focus-visible:outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-60 ${t.button}`}
      >
        {busy ? "Verifying…" : submitLabel}
      </button>

      <div
        className={`mt-4 flex items-center justify-between text-[12px] ${width}`}
      >
        <button
          type="button"
          disabled={busy}
          onClick={async () => {
            setError(null);
            setResent(false);
            setBusy(true);
            try {
              onTokenChange(await requestCode(email));
              setCode("");
              setResent(true);
            } catch (err) {
              setError(
                err instanceof Error
                  ? err.message
                  : "Couldn't resend the code. Try again.",
              );
            } finally {
              setBusy(false);
            }
          }}
          className={`cursor-pointer hover:underline disabled:opacity-60 ${t.link}`}
        >
          Resend code
        </button>
        <button
          type="button"
          onClick={onEdit}
          className={`cursor-pointer hover:underline ${t.subtle}`}
        >
          Edit details
        </button>
      </div>
    </form>
  );
}

/** 6-box one-time-code input. Keeps a single string value. */
function OtpInput({
  value,
  onChange,
  boxClass,
  fullWidth = false,
  length = 6,
}: {
  value: string;
  onChange: (v: string) => void;
  boxClass: string;
  fullWidth?: boolean;
  length?: number;
}) {
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const digits = Array.from({ length }, (_, i) => value[i] ?? "");

  const focus = (i: number) =>
    refs.current[Math.max(0, Math.min(length - 1, i))]?.focus();

  return (
    <div className={`flex w-full gap-1.5 sm:gap-2 ${fullWidth ? "" : "max-w-76"}`}>
      {digits.map((d, i) => (
        <input
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          type="text"
          inputMode="numeric"
          autoComplete={i === 0 ? "one-time-code" : "off"}
          autoFocus={i === 0}
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
          className={`h-12 min-w-0 rounded-lg border text-center text-lg font-medium flex-1 outline-none transition-colors ${boxClass}`}
        />
      ))}
    </div>
  );
}
