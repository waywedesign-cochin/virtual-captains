import { NextResponse } from "next/server";
import { PARTNERSHIP_MODELS } from "@/app/partner/data/partnerships";
import {
  C,
  MIN,
  badge,
  button,
  esc,
  escMultiline,
  footnote,
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
import { badCode, checkCode } from "@/app/lib/otp";

const byIp = makeLimiter("partner:ip", 5, 10 * MIN);
const byEmail = makeLimiter("partner:email", 5, 10 * MIN);

const clean = (v: unknown, max: number) =>
  String(v ?? "")
    .trim()
    .slice(0, max);

/** Partner page enquiry: emails the team and confirms to the sender. */
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }

  // Honeypot: bots fill the hidden field. Pretend it worked.
  if (body.website) return NextResponse.json({ success: true });

  const fullName = clean(body.fullName, 120);
  const email = clean(body.email, 254);
  const organization = clean(body.organization, 160);
  const phone = clean(body.phone, 30);
  const message = clean(body.message, 3000);
  // Track title comes from our own data, never from the client
  const track = PARTNERSHIP_MODELS.find((m) => m.id === body.track);

  if (!fullName || !isEmail(email) || !organization || !track) {
    return NextResponse.json(
      { error: "Please fill in all required fields." },
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

  // Must prove they own the email (code from /api/verify-email)
  if (!checkCode(email, body.code, body.token)) return badCode();

  const mail = getMailConfig("PARTNER_TO_EMAIL");
  if (!mail) return misconfigured();

  const firstName = fullName.split(" ")[0];

  const ok = await sendLeadEmails({
    ...mail,
    team: {
      replyTo: email,
      subject: `New Partnership Enquiry: ${track.title} – ${organization}`,
      html: layout(
        `${fullName} from ${organization} is interested in ${track.title}`,
        "New Partnership Enquiry",
        `
        ${badge("Partnership Enquiry")}
        ${heading(esc(track.title), "16px 0 4px 0")}
        ${para(`${esc(fullName)} from ${esc(organization)} wants to partner with SalesX.`, C.muted)}
        ${rows(`
          ${row("Name", esc(fullName))}
          ${row("Email", mailtoLink(email))}
          ${phone ? row("Phone", telLink(phone)) : ""}
          ${row("Organisation", esc(organization))}
          ${row("Track", esc(track.title))}
          ${row("Message", escMultiline(message) || "—")}
        `)}
        ${button(`mailto:${email}`, `Reply to ${firstName}`)}
        `,
      ),
    },
    confirmation: {
      to: email,
      subject: "We've received your partnership enquiry",
      html: layout(
        "Thanks for your interest in partnering with SalesX.",
        "Enquiry received",
        `
        ${badge("Enquiry received")}
        ${heading(`Hi ${esc(firstName)},`)}
        ${para(`Thanks for your interest in the <strong>${esc(track.title)}</strong> with SalesX. Our partnerships team will reach out within 24 hours.`)}
        ${footnote("Questions in the meantime? Just reply to this email.")}
        `,
      ),
    },
  });

  if (!ok) {
    return NextResponse.json(
      { error: "We couldn't send your enquiry. Please try again." },
      { status: 500 },
    );
  }

  return NextResponse.json({ success: true });
}
