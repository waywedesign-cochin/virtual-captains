import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Optional: one audience per location, so the client can email only the people
 * who asked about a specific city. Keys are lowercase location strings exactly
 * as sent by the form (e.g. "bangalore, india"). Anything not listed falls
 * back to RESEND_AUDIENCE_NOTIFY.
 */
const LOCATION_AUDIENCES: Record<string, string | undefined> = {
  // "bangalore, india": process.env.RESEND_AUDIENCE_BANGALORE,
  // "hyderabad, india": process.env.RESEND_AUDIENCE_HYDERABAD,
};

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
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  const location = String(body.location ?? "")
    .trim()
    .toLowerCase();
  const audienceId =
    LOCATION_AUDIENCES[location] ?? process.env.RESEND_AUDIENCE_NOTIFY;

  if (!audienceId) {
    console.error("RESEND_AUDIENCE_NOTIFY is not set");
    return NextResponse.json(
      { error: "Server misconfigured" },
      { status: 500 },
    );
  }

  try {
    const { error } = await resend.contacts.create({
      email,
      audienceId,
      unsubscribed: false,
    });

    if (error) {
      console.error("Resend contact error:", error);
      return NextResponse.json({ error: "Failed" }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("Notify error:", e);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
