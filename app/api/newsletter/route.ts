import { NextResponse } from "next/server";
import {
  MIN,
  getIp,
  isEmail,
  isLimited,
  makeLimiter,
  misconfigured,
  resend,
  tooMany,
} from "@/app/lib/email";
import { badCode, checkCode } from "@/app/lib/otp";

const byIp = makeLimiter("newsletter:ip", 5, 10 * MIN);

/**
 * Blog "Get more insights in your inbox" signup. Saves the email to the
 * RESEND_AUDIENCE_NEWSLETTER audience so the team can send broadcasts.
 */
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }

  // Honeypot: bots fill the hidden field. Pretend it worked.
  if (body.website) return NextResponse.json({ ok: true });

  const email = String(body.email ?? "")
    .trim()
    .toLowerCase();
  if (!isEmail(email)) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  if (await isLimited([[byIp, getIp(req)]])) return tooMany();

  // Double opt-in: must prove they own the email (code from /api/verify-email)
  if (!checkCode(email, body.code, body.token)) return badCode();

  const audienceId = process.env.RESEND_AUDIENCE_NEWSLETTER;
  if (!audienceId) {
    console.error("RESEND_AUDIENCE_NEWSLETTER is not set");
    return misconfigured();
  }

  try {
    const { error } = await resend.contacts.create({
      email,
      audienceId,
      unsubscribed: false,
    });
    if (error) {
      console.error("Resend newsletter contact error:", error);
      return NextResponse.json({ error: "Failed" }, { status: 500 });
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("Newsletter error:", e);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
