import { NextResponse } from "next/server";
import {
  MIN,
  badge,
  button,
  esc,
  escMultiline,
  getIp,
  getMailConfig,
  heading,
  isEmail,
  isLimited,
  layout,
  mailtoLink,
  makeLimiter,
  misconfigured,
  para,
  row,
  rows,
  sendLeadEmails,
  telLink,
  tooMany,
} from "@/app/lib/email";

const byIp = makeLimiter("event:ip", 5, 10 * MIN);
const byEmail = makeLimiter("event:email", 3, 10 * MIN);

const EVENT = "SalesX Platform Launch";

const clean = (v: unknown, max: number) =>
  String(v ?? "")
    .trim()
    .slice(0, max);

/**
 * SalesX launch invite requests from the home-page popup. No email
 * verification (unlike the other lead forms); rate limits + honeypot only.
 * Only the team (CONTACT_TO_EMAIL) is emailed — no confirmation to the sender.
 */
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }

  // Honeypot: bots fill the hidden field. Pretend it worked.
  if (body.website) return NextResponse.json({ success: true });

  const firstName = clean(body.firstName, 60);
  const lastName = clean(body.lastName, 60);
  const name = `${firstName} ${lastName}`.trim();
  const email = clean(body.email, 254);
  const phone = clean(body.phone, 20);
  const company = clean(body.company, 120);
  const message = clean(body.message, 3000);

  if (!firstName || !isEmail(email) || !phone) {
    return NextResponse.json(
      { error: "Name, email, and phone are required." },
      { status: 400 },
    );
  }

  if (
    await isLimited([
      [byIp, getIp(request)],
      [byEmail, email.toLowerCase()],
    ])
  ) {
    return tooMany();
  }

  const mail = getMailConfig("CONTACT_TO_EMAIL");
  if (!mail) return misconfigured();

  const ok = await sendLeadEmails({
    ...mail,
    team: {
      replyTo: email,
      subject: `New Launch Invite Request: ${name}`,
      html: layout(
        `New ${EVENT} invite request from ${name}`,
        "New Invite Request",
        `
        ${badge(EVENT)}
        ${heading(esc(name), "16px 0 4px 0")}
        ${para(`Requested an invite from the home-page popup.`, "#8b97b5")}
        ${rows(`
          ${row("Name", esc(name))}
          ${row("Email", mailtoLink(email))}
          ${row("Phone", telLink(phone))}
          ${row("Company", esc(company) || "—")}
          ${row("Message", escMultiline(message) || "—")}
        `)}
        ${button(`mailto:${email}`, `Reply to ${firstName}`)}
        `,
      ),
    },
  });

  if (!ok) {
    return NextResponse.json(
      { error: "Failed to process request." },
      { status: 500 },
    );
  }

  return NextResponse.json({ success: true });
}
