import { getProgramPrice } from "@/app/lib/getProgramPrices";
import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { badCode, checkCode } from "@/app/lib/otp";
import { MIN, getIp, isLimited, makeLimiter, tooMany } from "@/app/lib/email";

// Caps wrong-code guesses as well as order spam
const byIp = makeLimiter("order:ip", 10, 10 * MIN);
const byEmail = makeLimiter("order:email", 5, 10 * MIN);

export const runtime = "nodejs";

const bad = (error: string) => NextResponse.json({ error }, { status: 400 });

// Razorpay allows max 256 chars per notes value; keep well under it.
const clean = (v: unknown, max: number) =>
  String(v ?? "")
    .trim()
    .slice(0, max);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { slug } = body ?? {};

    const name = clean(body?.name, 101);
    const email = clean(body?.email, 254);
    const phone = clean(body?.phone, 20);
    const audience =
      body?.audience === "organisation" ? "organisation" : "individual";
    const role = clean(body?.role, 60);
    const employees = clean(body?.employees, 10);
    const message = clean(body?.message, 200);
    // Display-only (used in the receipt email); the price never comes from it
    const programTitle = clean(body?.programTitle, 120);

    if (!name || !email || !phone) return bad("Missing details.");

    if (
      await isLimited([
        [byIp, getIp(req)],
        [byEmail, email.toLowerCase()],
      ])
    ) {
      return tooMany();
    }

    // Must prove they own the email (code from /api/verify-email)
    if (!checkCode(email, body?.code, body?.token)) return badCode();

    // Price comes from the server, never from the client
    const rupees =
      typeof slug === "string" ? await getProgramPrice(slug) : null;
    if (!rupees) return bad("This program can't be paid for online.");

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });

    // Only include optional fields when they have a value
    const notes: Record<string, string> = {
      program: slug,
      name,
      email,
      phone,
      audience,
    };
    if (audience === "organisation") {
      if (role) notes.role = role;
      if (employees) notes.employees = employees;
    }
    if (message) notes.message = message;
    if (programTitle) notes.programTitle = programTitle;

    const order = await razorpay.orders.create({
      amount: rupees * 100, // paise
      currency: "INR",
      receipt: `enr_${Date.now()}`,
      notes,
    });

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    console.error("create-order failed", err);
    return NextResponse.json(
      { error: "Could not start payment." },
      { status: 500 },
    );
  }
}
