// Email verification for the site forms: a 6-digit code is emailed, and the
// browser gets back a signed token ("<expiryMs>.<hmac>"). The form then sends
// code + token with its submission and the route checks them with
// `checkCode`. Stateless — nothing is stored on the server. Same scheme and
// VERIFY_SECRET as the Book a Call route. Server-only.
import { NextResponse } from "next/server";
import { createHmac, randomInt, timingSafeEqual } from "crypto";
import {
  BRAND,
  C,
  FONT,
  badge,
  footnote,
  heading,
  layout,
  para,
  resend,
} from "./email";

const CODE_TTL_MS = 10 * 60 * 1000; // 10 minutes

const hashCode = (email: string, code: string, exp: number) =>
  createHmac("sha256", process.env.VERIFY_SECRET!)
    .update(`${email.toLowerCase()}:${code}:${exp}`)
    .digest("hex");

/** True when `code` + `token` prove the person received a code at `email`. */
export const checkCode = (email: string, code: unknown, token: unknown) => {
  if (!process.env.VERIFY_SECRET) return false;
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

/** 400 response the forms recognise as "wrong or expired code". */
export const badCode = () =>
  NextResponse.json(
    { error: "Invalid or expired code", reason: "bad-code" },
    { status: 400 },
  );

/** Emails a fresh code to `email`; returns the token, or null if sending failed. */
export async function sendCode(email: string, from: string) {
  if (!process.env.VERIFY_SECRET) {
    console.error("VERIFY_SECRET not set");
    return null;
  }
  const code = String(randomInt(100000, 1000000)); // 6 digits
  const exp = Date.now() + CODE_TTL_MS;

  try {
    const { error } = await resend.emails.send({
      from,
      to: email,
      subject: `${code} is your ${BRAND} verification code`,
      html: layout(
        `Your verification code is ${code}`,
        "Verify your email",
        `
        ${badge("Verify your email")}
        ${heading("Your verification code")}
        ${para("Enter this code on the form to confirm your email address.")}
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${C.rowBg}" style="background:${C.rowBg};border:1px solid ${C.border};border-radius:12px;border-collapse:separate;">
          <tr>
            <td align="center" style="padding:20px 16px;font-family:${FONT};font-size:34px;font-weight:700;letter-spacing:10px;color:#ffffff;">
              ${code}
            </td>
          </tr>
        </table>
        ${footnote("This code expires in 10 minutes. If you didn't request it, you can ignore this email.")}
        `,
      ),
    });
    if (error) throw error;
  } catch (err) {
    console.error("Resend verification email error:", err);
    return null;
  }

  return `${exp}.${hashCode(email, code, exp)}`;
}
