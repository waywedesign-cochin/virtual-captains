import { NextResponse } from "next/server";
import {
  MIN,
  getIp,
  getMailConfig,
  isEmail,
  isLimited,
  makeLimiter,
  misconfigured,
  tooMany,
} from "@/app/lib/email";
import { sendCode } from "@/app/lib/otp";

const byIp = makeLimiter("verify:ip", 5, 10 * MIN);
const byEmail = makeLimiter("verify:email", 3, 10 * MIN);

/**
 * Step 1 of every verified form (contact, careers, partner, enrol,
 * newsletter): emails a 6-digit code and returns the signed token the form
 * sends back with its submission.
 */
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  // Honeypot filled → pretend it worked, but send nothing
  if (body?.website) return NextResponse.json({ token: `${Date.now()}.0` });

  const email = String(body?.email ?? "").trim();
  if (!isEmail(email)) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  if (
    await isLimited([
      [byIp, getIp(req)],
      [byEmail, email.toLowerCase()],
    ])
  ) {
    return tooMany();
  }

  const mail = getMailConfig();
  if (!mail) return misconfigured();

  const token = await sendCode(email, mail.from);
  if (!token) {
    return NextResponse.json({ error: "Failed to send" }, { status: 500 });
  }
  return NextResponse.json({ token });
}
