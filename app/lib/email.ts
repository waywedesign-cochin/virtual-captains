// Shared Resend setup for every form API route: the client, the branded
// email layout and an in-memory rate limiter. Server-only — never import this
// from a client component (it reads the Resend API key).
import { NextResponse } from "next/server";
import { Resend } from "resend";

export const resend = new Resend(process.env.RESEND_API_KEY);

export const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const isEmail = (v: unknown): v is string =>
  typeof v === "string" && v.length <= 254 && emailPattern.test(v);

/** HTML-escape anything user-supplied before it goes into an email. */
export const esc = (s: unknown) =>
  String(s ?? "").replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ]!,
  );

/** Escape and keep line breaks (for free-text messages). */
export const escMultiline = (s: unknown) => esc(s).replace(/\n/g, "<br/>");

// Capitalize the first letter of a string
export const cap = (s: unknown) => {
  const v = String(s ?? "");
  return v.charAt(0).toUpperCase() + v.slice(1);
};

/**
 * Sender + team inbox from env. `toEnv` lets a form route its leads to a
 * different inbox (e.g. CAREERS_TO_EMAIL), falling back to
 * APPLICATIONS_TO_EMAIL. Returns null (and logs) when not configured.
 */
export const getMailConfig = (toEnv?: string) => {
  const from = process.env.APPLICATIONS_FROM_EMAIL;
  const toRaw =
    (toEnv && process.env[toEnv]) || process.env.APPLICATIONS_TO_EMAIL;
  const to = toRaw
    ?.split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  if (!process.env.RESEND_API_KEY || !from || !to?.length) {
    console.error(
      "RESEND_API_KEY / APPLICATIONS_FROM_EMAIL / APPLICATIONS_TO_EMAIL not set",
    );
    return null;
  }
  return { from, to };
};

export const misconfigured = () =>
  NextResponse.json({ error: "Server misconfigured" }, { status: 500 });

// ---- Rate limiting (in-memory, per server instance) ----
export type Limiter = { prefix: string; count: number; windowMs: number };

export const makeLimiter = (
  prefix: string,
  count: number,
  windowMs: number,
): Limiter => ({
  prefix,
  count,
  windowMs,
});

export const MIN = 60 * 1000;

// key -> timestamps of recent hits
const hits = new Map<string, number[]>();

export const getIp = (req: Request) =>
  req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
  req.headers.get("x-real-ip") ||
  "unknown";

/** Returns true if ANY of the checks is over its limit. */
export const isLimited = async (checks: [Limiter, string][]) => {
  const now = Date.now();

  // Keep the map from growing forever
  if (hits.size > 5000) {
    for (const [k, v] of hits) {
      if (!v.length || now - v[v.length - 1] > 10 * MIN) hits.delete(k);
    }
  }

  for (const [limiter, id] of checks) {
    const key = `${limiter.prefix}:${id}`;
    const recent = (hits.get(key) ?? []).filter(
      (t) => now - t < limiter.windowMs,
    );
    if (recent.length >= limiter.count) {
      hits.set(key, recent);
      return true;
    }
    recent.push(now);
    hits.set(key, recent);
  }
  return false;
};

export const tooMany = () =>
  NextResponse.json(
    { error: "Too many requests. Please try again later." },
    { status: 429 },
  );

// ---- Email theme (blue + black) ----
export const BRAND = "Virtual Captains";
const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://your-domain.com"
).replace(/\/$/, "");
const LOGO_URL = `${SITE_URL}/home/logo.png`;
export const C = {
  pageBg: "#05070d",
  cardBg: "#0b1020",
  rowBg: "#111a33",
  border: "#1e2a4a",
  blue: "#3b82f6",
  blueDark: "#1d4ed8",
  text: "#e6ebf5",
  muted: "#8b97b5",
};
export const FONT =
  "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";

export const layout = (preheader: string, title: string, content: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <meta name="color-scheme" content="dark" />
  <meta name="supported-color-schemes" content="dark" />
  <title>${esc(title)}</title>
</head>
<body style="margin:0;padding:0;background:${C.pageBg};" bgcolor="${C.pageBg}">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:${C.pageBg};">
    ${esc(preheader)}
  </div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${C.pageBg}" style="background:${C.pageBg};">
    <tr>
      <td align="center" style="padding:32px 16px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;">
          <!-- Header -->
          <tr>
            <td align="center" style="padding:0 0 20px 0;text-align:center;font-family:${FONT};font-size:13px;font-weight:700;color:${C.blue};">
              <img src="${LOGO_URL}" alt="${esc(BRAND)}" width="140" style="display:block;margin:0 auto;width:140px;max-width:100%;height:auto;border:0;outline:none;text-decoration:none;" />
            </td>
          </tr>
          <!-- Card -->
          <tr>
            <td bgcolor="${C.cardBg}" style="background:${C.cardBg};border:1px solid ${C.border};border-radius:16px;overflow:hidden;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td height="4" bgcolor="${C.blue}" style="height:4px;line-height:4px;font-size:0;background:linear-gradient(90deg,${C.blueDark},${C.blue});">&nbsp;</td>
                </tr>
                <tr>
                  <td style="padding:32px 32px 28px 32px;font-family:${FONT};color:${C.text};">
                    ${content}
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td align="center" style="padding:20px 8px 0 8px;font-family:${FONT};font-size:12px;line-height:18px;color:${C.muted};">
              &copy; ${new Date().getFullYear()} ${esc(BRAND)}. All rights reserved.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

export const row = (label: string, value: string) => `
  <tr>
    <td style="padding:12px 16px;border-top:1px solid ${C.border};font-family:${FONT};font-size:12px;letter-spacing:1px;text-transform:uppercase;color:${C.muted};width:120px;vertical-align:top;">
      ${label}
    </td>
    <td style="padding:12px 16px;border-top:1px solid ${C.border};font-family:${FONT};font-size:15px;line-height:22px;color:${C.text};vertical-align:top;">
      ${value}
    </td>
  </tr>`;

/** Wraps `row()`s in the bordered details table. */
export const rows = (content: string) => `
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${C.rowBg}" style="background:${C.rowBg};border:1px solid ${C.border};border-radius:12px;border-collapse:separate;">
    ${content}
  </table>`;

export const badge = (text: string) => `
  <span style="display:inline-block;padding:5px 12px;border-radius:999px;background:${C.rowBg};border:1px solid ${C.blue};font-family:${FONT};font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:${C.blue};">
    ${esc(text)}
  </span>`;

export const heading = (text: string, margin = "16px 0 12px 0") => `
  <h1 style="margin:${margin};font-family:${FONT};font-size:24px;line-height:32px;font-weight:700;color:#ffffff;">
    ${text}
  </h1>`;

export const para = (text: string, color = C.text) => `
  <p style="margin:0 0 20px 0;font-family:${FONT};font-size:15px;line-height:24px;color:${color};">
    ${text}
  </p>`;

export const footnote = (text: string) => `
  <p style="margin:24px 0 0 0;font-family:${FONT};font-size:13px;line-height:20px;color:${C.muted};">
    ${text}
  </p>`;

export const button = (href: string, label: string) => `
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin-top:28px;">
    <tr>
      <td bgcolor="${C.blue}" style="background:${C.blue};border-radius:10px;">
        <a href="${esc(href)}" style="display:inline-block;padding:13px 26px;font-family:${FONT};font-size:14px;font-weight:600;color:#ffffff;text-decoration:none;">
          ${esc(label)}
        </a>
      </td>
    </tr>
  </table>`;

export const mailtoLink = (email: string) =>
  `<a href="mailto:${esc(email)}" style="color:${C.blue};text-decoration:none;">${esc(email)}</a>`;

export const telLink = (phone: string) =>
  `<a href="tel:${esc(phone)}" style="color:${C.blue};text-decoration:none;">${esc(phone)}</a>`;

/**
 * Standard "lead" pair used by the simple forms: a must-succeed email to the
 * team, then a best-effort confirmation to the sender (its failure is logged,
 * never surfaced). Returns false if the team email failed.
 */
export async function sendLeadEmails({
  from,
  to,
  team,
  confirmation,
}: {
  from: string;
  to: string[];
  team: {
    replyTo: string;
    subject: string;
    html: string;
    attachments?: { filename: string; content: Buffer }[];
  };
  confirmation?: { to: string; subject: string; html: string };
}) {
  try {
    const { error } = await resend.emails.send({ from, to, ...team });
    if (error) throw error;
  } catch (err) {
    console.error("Resend team email error:", err);
    return false;
  }

  if (confirmation) {
    try {
      const { error } = await resend.emails.send({
        from,
        replyTo: to[0],
        ...confirmation,
      });
      if (error) throw error;
    } catch (err) {
      console.error("Resend confirmation email error:", err);
    }
  }
  return true;
}
