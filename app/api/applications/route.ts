import { NextResponse } from "next/server";
import { createHmac, randomInt, timingSafeEqual } from "crypto";
import {
  BRAND,
  C,
  FONT,
  badge,
  cap,
  esc,
  getIp,
  isLimited,
  layout,
  makeLimiter,
  MIN,
  resend,
  row,
  tooMany,
} from "@/app/lib/email";

const sendCodeByIp = makeLimiter("send:ip", 5, 10 * MIN);
const sendCodeByEmail = makeLimiter("send:email", 3, 10 * MIN);
const submitByIp = makeLimiter("submit:ip", 10, 10 * MIN);
const submitByEmail = makeLimiter("submit:email", 5, 10 * MIN);

// ---- Email verification (stateless signed code) ----
const CODE_TTL_MS = 10 * 60 * 1000; // 10 minutes

const hashCode = (email: string, code: string, exp: number) =>
  createHmac("sha256", process.env.VERIFY_SECRET!)
    .update(`${email.toLowerCase()}:${code}:${exp}`)
    .digest("hex");

/** token format: "<expiryMs>.<hmac>" */
const verifyCode = (email: string, code: unknown, token: unknown) => {
  if (typeof code !== "string" || typeof token !== "string") return false;
  if (!/^\d{6}$/.test(code)) return false;
  const [expStr, sig] = token.split(".");
  const exp = Number(expStr);
  if (!exp || !sig || Date.now() > exp) return false;
  const expected = hashCode(email, code, exp);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
};

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }

  const {
    action,
    code,
    token,
    type,
    programTitle,
    firstName,
    lastName,
    email,
    phone,
    startup,
    message,
    // "call" (general enquiry) only
    audience,
    role,
    employees,
  } = body;

  const validEmail =
    typeof email === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const from = process.env.APPLICATIONS_FROM_EMAIL;
  const to = process.env.APPLICATIONS_TO_EMAIL?.split(",").map((s) => s.trim());
  if (!from || !to?.length || !process.env.VERIFY_SECRET) {
    console.error(
      "APPLICATIONS_FROM_EMAIL / APPLICATIONS_TO_EMAIL / VERIFY_SECRET not set",
    );
    return NextResponse.json(
      { error: "Server misconfigured" },
      { status: 500 },
    );
  }

  // ---------- Step 1: email a verification code ----------
  if (action === "send-code") {
    if (!validEmail) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    if (
      await isLimited([
        [sendCodeByIp, getIp(req)],
        [sendCodeByEmail, email.toLowerCase()],
      ])
    ) {
      return tooMany();
    }

    const newCode = String(randomInt(100000, 1000000)); // 6 digits
    const exp = Date.now() + CODE_TTL_MS;
    const newToken = `${exp}.${hashCode(email, newCode, exp)}`;

    try {
      const { error } = await resend.emails.send({
        from,
        to: email,
        subject: `${newCode} is your ${BRAND} verification code`,
        html: layout(
          `Your verification code is ${newCode}`,
          "Verify your email",
          `
          ${badge("Verify your email")}
          <h1 style="margin:16px 0 12px 0;font-family:${FONT};font-size:24px;line-height:32px;font-weight:700;color:#ffffff;">
            Your verification code
          </h1>
          <p style="margin:0 0 20px 0;font-family:${FONT};font-size:15px;line-height:24px;color:${C.text};">
            Enter this code on the form to confirm your email address.
          </p>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${C.rowBg}" style="background:${C.rowBg};border:1px solid ${C.border};border-radius:12px;border-collapse:separate;">
            <tr>
              <td align="center" style="padding:20px 16px;font-family:${FONT};font-size:34px;font-weight:700;letter-spacing:10px;color:#ffffff;">
                ${newCode}
              </td>
            </tr>
          </table>
          <p style="margin:24px 0 0 0;font-family:${FONT};font-size:13px;line-height:20px;color:${C.muted};">
            This code expires in 10 minutes. If you didn't request it, you can ignore this email.
          </p>
          `,
        ),
      });
      if (error) throw error;
    } catch (err) {
      console.error("Resend verification email error:", err);
      return NextResponse.json({ error: "Failed to send" }, { status: 500 });
    }

    return NextResponse.json({ token: newToken });
  }

  // ---------- Step 2: verified submission ----------
  // Server-side validation: never trust the client
  if (
    !["eligibility", "waitlist", "call"].includes(type) ||
    !firstName ||
    !lastName ||
    !validEmail ||
    !phone
  ) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }

  // Limits run before the code check, so wrong guesses count too
  if (
    await isLimited([
      [submitByIp, getIp(req)],
      [submitByEmail, email.toLowerCase()],
    ])
  ) {
    return tooMany();
  }

  if (!verifyCode(email, code, token)) {
    return NextResponse.json(
      { error: "Invalid or expired code" },
      { status: 400 },
    );
  }

  const isCall = type === "call";
  const label =
    type === "eligibility"
      ? "Application"
      : type === "waitlist"
        ? "Waitlist"
        : "Call Request";
  const heading = programTitle ?? (isCall ? "Book a Call" : "Program");

  // 1. Notify the team (this one must succeed)
  try {
    const { error } = await resend.emails.send({
      from,
      to,
      replyTo: email,
      subject: `New ${label}: ${isCall ? "" : `${heading} – `}${firstName} ${lastName}`,
      html: layout(
        `New ${label.toLowerCase()} from ${firstName} ${lastName}`,
        `New ${label}`,
        `
        ${badge(`New ${label}`)}
        <h1 style="margin:16px 0 4px 0;font-family:${FONT};font-size:24px;line-height:32px;font-weight:700;color:#ffffff;">
          ${esc(heading)}
        </h1>
        <p style="margin:0 0 24px 0;font-family:${FONT};font-size:14px;line-height:22px;color:${C.muted};">
          ${esc(firstName)} ${esc(lastName)} just submitted a ${label.toLowerCase()}.
        </p>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${C.rowBg}" style="background:${C.rowBg};border:1px solid ${C.border};border-radius:12px;border-collapse:separate;">
          ${row("Name", `${esc(firstName)} ${esc(lastName)}`)}
          ${row("Email", `<a href="mailto:${esc(email)}" style="color:${C.blue};text-decoration:none;">${esc(email)}</a> (verified)`)}
          ${row("Phone", `<a href="tel:${esc(phone)}" style="color:${C.blue};text-decoration:none;">${esc(phone)}</a>`)}
          ${isCall && audience ? row("Type", esc(cap(audience))) : ""}
          ${isCall && role ? row("Role", esc(role)) : ""}
          ${isCall && employees ? row("Employees", esc(employees)) : ""}
          ${startup ? row("Startup", esc(startup)) : ""}
          ${row("Message", esc(message).replace(/\n/g, "<br/>") || "—")}
        </table>
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin-top:28px;">
          <tr>
            <td bgcolor="${C.blue}" style="background:${C.blue};border-radius:10px;">
              <a href="mailto:${esc(email)}" style="display:inline-block;padding:13px 26px;font-family:${FONT};font-size:14px;font-weight:600;color:#ffffff;text-decoration:none;">
                Reply to ${esc(firstName)}
              </a>
            </td>
          </tr>
        </table>
        `,
      ),
    });
    if (error) throw error;
  } catch (err) {
    console.error("Resend team email error:", err);
    return NextResponse.json({ error: "Failed to send" }, { status: 500 });
  }

  // 2. Confirmation to the applicant (optional; never fails the request)
  try {
    const isApplication = type === "eligibility";
    const confirmBadge = isCall
      ? "Request received"
      : isApplication
        ? "Application received"
        : "Waitlist confirmed";
    const confirmText = isCall
      ? "Thanks for reaching out. Our team will contact you shortly to schedule your call."
      : isApplication
        ? "Thanks for applying. If you're selected, we'll send a payment link to this email."
        : "Thanks for joining. We'll email you as soon as the program opens.";

    await resend.emails.send({
      from,
      to: email,
      replyTo: to[0],
      subject: isCall
        ? "We've received your call request"
        : isApplication
          ? "We've received your application"
          : "You're on the waitlist",
      html: layout(
        confirmText,
        confirmBadge,
        `
        ${badge(confirmBadge)}
        <h1 style="margin:16px 0 12px 0;font-family:${FONT};font-size:24px;line-height:32px;font-weight:700;color:#ffffff;">
          Hi ${esc(firstName)},
        </h1>
        <p style="margin:0 0 20px 0;font-family:${FONT};font-size:15px;line-height:24px;color:${C.text};">
          ${confirmText}
        </p>
        ${
          programTitle
            ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${C.rowBg}" style="background:${C.rowBg};border:1px solid ${C.border};border-radius:12px;border-collapse:separate;">
                <tr>
                  <td style="padding:14px 16px;font-family:${FONT};font-size:12px;letter-spacing:1px;text-transform:uppercase;color:${C.muted};">
                    Program
                    <div style="margin-top:4px;font-size:16px;font-weight:600;letter-spacing:0;text-transform:none;color:${C.text};">
                      ${esc(programTitle)}
                    </div>
                  </td>
                </tr>
              </table>`
            : ""
        }
        <p style="margin:24px 0 0 0;font-family:${FONT};font-size:13px;line-height:20px;color:${C.muted};">
          Questions? Just reply to this email and we'll get back to you.
        </p>
        `,
      ),
    });
  } catch (err) {
    console.error("Resend confirmation email error:", err);
  }

  return NextResponse.json({ ok: true });
}
